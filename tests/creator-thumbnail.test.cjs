/* eslint-disable @typescript-eslint/no-require-imports */
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');const sharp=require('sharp');const {randomBytes}=require('node:crypto');const {ObjectId}=require('mongodb');
test('table thumbnails resize real images, cache work, and recheck auth and photo ownership before every response',async()=>{
 const original=await sharp(randomBytes(1000*1200*3),{raw:{width:1000,height:1200,channels:3}}).png().toBuffer();let authenticated=true,exists=true,downloads=0;const photoId=String(new ObjectId());
 class NextResponse extends Response{}
 class GridFSBucket{find(){return {next:async()=>({length:original.length,metadata:{contentType:'image/png'}})}}openDownloadStream(){downloads++;return (async function*(){yield original})()}}
 const db={collection:()=>({findOne:async query=>{assert.equal(query.photoId,photoId);assert.equal(query.deletedAt.$exists,false);return exists?{_id:'creator'}:null}})};
 const deps={'next/server':{NextResponse},mongodb:{ObjectId,GridFSBucket},sharp:{default:sharp},'@/lib/mongodb':{default:Promise.resolve({db:()=>db})},'@/lib/auth':{getAdminSession:async()=>authenticated?{email:'staff@example.test'}:null}};
 const context={exports:{},require:name=>deps[name]||require(name),Buffer,Date,Response};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/api/creators/thumbnails/[id]/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,context);
 const get=()=>context.exports.GET(undefined,{params:Promise.resolve({id:photoId})});let result=await get();assert.equal(result.status,200);assert.equal(result.headers.get('Cache-Control'),'private, no-store');const output=Buffer.from(await result.arrayBuffer());const metadata=await sharp(output).metadata();assert.equal(metadata.width,128);assert.equal(metadata.height,150);assert.equal(metadata.format,'webp');assert.ok(output.length<original.length/20);assert.equal(downloads,1);
 assert.equal((await get()).status,200);assert.equal(downloads,1);authenticated=false;assert.equal((await get()).status,401);authenticated=true;exists=false;assert.equal((await get()).status,404);assert.equal(downloads,1);
});
