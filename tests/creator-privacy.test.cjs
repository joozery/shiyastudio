const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = ts.transpileModule(fs.readFileSync('src/lib/creators.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const context={exports:{}};vm.runInNewContext(source,context);const {publicCreator}=context.exports;
test('customer profile excludes applicant, contact, pricing, banking, tax and private attachment data, including nested fields',()=>{
 const profile={id:'creator-1',author:'Example',img:'',photoId:'photo-1',bio:'Public bio',categories:['Beauty'],gender:'หญิง',socials:[{platform:'TikTok',url:'https://example.com',followers:'120K',averageViews:'30K',engagement:'4',email:'private@example.com'}],portfolio:['https://example.com/work'],featured:true,personal:{fullName:'Private Name',birthday:'2000-01-01'},contact:{email:'private@example.com',phone:'0812345678'},rates:{post:'9999'},accountNumber:'private-bank',taxId:'private-tax',mediaKitId:'private-kit',consent:{terms:true}};
 const result=JSON.parse(JSON.stringify(publicCreator(profile)));
 assert.equal(result.author,'Example');assert.equal(result.img,'/api/creators/media/photo-1');assert.equal(result.socials[0].followers,'120K');
 for(const key of ['personal','contact','rates','accountNumber','taxId','mediaKitId','consent'])assert.equal(Object.hasOwn(result,key),false,key);
 assert.equal(Object.hasOwn(result.socials[0],'email'),false);
 assert.equal(JSON.stringify(result).includes('Private Name'),false);
});
test('public model handles an empty optional portfolio without synthesizing statistics',()=>{const result=publicCreator({id:'x',author:'X',socials:[],categories:[]});assert.equal(result.followers,'');assert.equal(result.videoUrl,'');assert.equal(result.img,'')});
