/* eslint-disable @typescript-eslint/no-require-imports -- Node test runner uses CommonJS fixtures. */
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
const crypto=require('node:crypto');
function compile(file,deps){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{exports,require:name=>deps[name]||require(name),console,Date,JSON,URL});return exports}
const response={NextResponse:{json:(data,options={})=>({data,...options})}};
test('admin identity uses the verified database user, exposes only profile fields, and keeps finance restricted',async()=>{
 const token='a'.repeat(64);let cookie={value:JSON.stringify({token,email:'forged@example.test',role:'Super Admin'})};let role='Editor';let inactive=false;const queries=[];
 const db={collection:name=>({findOne:async(query,options)=>{queries.push({name,query,options});if(name==='admin_sessions')return {email:'actual@example.test'};assert.equal(query.email,'actual@example.test');assert.equal(query.status.$ne,'inactive');if(inactive)return null;return {_id:'user-1',email:'actual@example.test',role,name:'Actual user',avatar:'/avatar.png',password:'do-not-expose'}}})};
 const auth=compile('src/lib/auth.ts',{'next/headers':{cookies:async()=>({get:()=>cookie})},'next/server':response,'./mongodb':{default:Promise.resolve({db:()=>db})}});
 const session=await auth.getAdminSession();assert.equal(session.email,'actual@example.test');assert.equal(session.role,'Editor');assert.equal(session.id,'user-1');assert.equal(session.password,undefined);assert.equal(session.token,undefined);assert.equal(queries.length,2);assert.equal(queries[0].query.tokenHash,crypto.createHash('sha256').update(token).digest('hex'));assert.equal(queries[1].options.projection.role,1);
 assert.equal(await auth.canManageCreatorFinance(),false);role='Super Admin';assert.equal(await auth.canManageCreatorFinance(),true);
 inactive=true;assert.equal(await auth.getAdminSession(),null);inactive=false;
 cookie={value:JSON.stringify({email:'actual@example.test',authenticated:true})};assert.equal(await auth.getAdminSession(),null);assert.equal((await auth.requireAdmin()).status,401);
});
function evaluate(expression,document){if(typeof expression==='string'&&expression.startsWith('$'))return document[expression.slice(1)];if(typeof expression!=='object'||expression===null)return expression;if(expression.$isArray)return Array.isArray(evaluate(expression.$isArray,document));if(expression.$size)return evaluate(expression.$size,document).length;if(expression.$cond){const [condition,yes,no]=expression.$cond;return evaluate(evaluate(condition,document)?yes:no,document)}return expression}
test('dashboard returns the same counts, zero values, defaults and timestamps with one query and no gallery payload',async()=>{
 let documents=[];let calls=0;
 const db={collection:()=>({aggregate:pipeline=>{calls++;const types=pipeline[0].$match.type.$in;const projection=pipeline[1].$project;return {toArray:async()=>documents.filter(d=>types.includes(d.type)).map(document=>Object.fromEntries(Object.entries(projection).filter(([key])=>key!=='_id').map(([key,value])=>[key,value===1?document[key]:evaluate(value,document)])))}}})};
 const api=compile('src/app/api/dashboard/route.ts',{'next/server':response,'@/lib/mongodb':{default:Promise.resolve({db:()=>db})}});
 let result=await api.GET();assert.equal(result.data.totals.totalItems,25);assert.equal(result.data.totals.configuredSections,0);assert.equal(result.data.sections.influencer.categories,5);
 documents=[{type:'hero',slides:[],updatedAt:'2026-10-01'},{type:'services',services:[{},{}],updatedAt:'2026-10-04'},{type:'projects',projects:Array.from({length:1000},()=>({media:['large-media-data']}))},{type:'clients',clients:[{}]},{type:'influencer',items:[{private:'unused'}],categories:[]},{type:'unrelated',items:[{}]}];
 result=await api.GET();assert.equal(calls,2);assert.equal(result.data.sections.hero.slides,0);assert.equal(result.data.sections.services.count,2);assert.equal(result.data.sections.projects.count,1000);assert.equal(result.data.sections.influencer.categories,0);assert.equal(result.data.totals.totalItems,1004);assert.equal(result.data.totals.configuredSections,5);assert.equal(result.data.totals.lastModified,'2026-10-04');assert.equal(JSON.stringify(result.data).includes('large-media-data'),false);
 documents=[{type:'hero'},{type:'influencer',items:null}];result=await api.GET();assert.equal(result.data.sections.hero.slides,3);assert.equal(result.data.sections.influencer.items,6);
});
test('creator list verifies the session once and loads only category settings without gallery data',async()=>{
 let sessions=0,queries=0;let role='Editor',authenticated=true;
 const db={collection:name=>name==='creators'?{find:(query,options)=>{queries++;assert.equal(query.deletedAt.$exists,false);if(options.projection.id===1){assert.equal(options.projection.rates,undefined);assert.equal(options.projection.bio,undefined);assert.equal(options.projection.consent,undefined);assert.equal(options.projection['personal.fullName'],1);assert.equal(options.projection['contact.email'],1)}else{assert.equal(options.projection.workRecords,0);assert.equal(options.projection['consent.termsText'],0)}return {sort:()=>({toArray:async()=>[{id:'one',author:'Creator'}]})}}}:{findOne:async(query,options)=>{queries++;assert.equal(query.type,'influencer');assert.equal(options.projection.items,undefined);assert.equal(options.projection.profileCategories,1);return {profileCategories:['Beauty'],profileGenders:['หญิง']}}}};
 const api=compile('src/app/api/creators/admin/route.ts',{'next/server':response,'@/lib/mongodb':{default:Promise.resolve({db:()=>db})},'@/lib/creators':{text:value=>String(value||'')},'@/lib/auth':{getAdminSession:async()=>{sessions++;return authenticated?{email:'staff@example.test',role}:null}}});
 let result=await api.GET();assert.equal(sessions,1);assert.equal(queries,2);assert.equal(result.data.canFinance,false);assert.equal(result.data.profileCategories[0],'Beauty');assert.equal(result.data.profiles.length,1);assert.equal(result.headers['Cache-Control'],'no-store');
 role='Super Admin';result=await api.GET();assert.equal(result.data.canFinance,true);result=await api.GET({url:'http://localhost:3001/api/creators/admin?view=list'});assert.equal(result.data.profiles.length,1);
 authenticated=false;const previous=queries;result=await api.GET();assert.equal(result.status,401);assert.equal(queries,previous);
});
