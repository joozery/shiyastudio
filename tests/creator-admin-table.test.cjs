/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS fixtures for the Node test runner. */
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
test('creator table filters and paginates without changing record IDs, opens the original record and exports selected filtered rows',()=>{
 const state=[];let cursor=0;let opened=null;let exported=null;
 const react={useState:initial=>{const index=cursor++;if(!(index in state))state[index]=initial;return [state[index],value=>{state[index]=typeof value==='function'?value(state[index]):value}]},useRef:()=>({current:null}),useEffect:()=>{}};
 const dependencies={react,'next/image':{default:()=>null},'@/components/creators/SocialBrandIcon':{SocialBrandIcon:()=>null},'./CreatorsTable.module.css':{default:new Proxy({},{get:(_,name)=>String(name)})}};
 const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/components/admin/CreatorsTable.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports,require:name=>dependencies[name]||require(name),console,Date,Set});
 const profiles=Array.from({length:25},(_,index)=>({id:`id-${index}`,author:`Creator ${index}`,createdAt:'2026-10-08T05:30:00Z',img:'',categories:[index%2?'Food':'Beauty'],socials:[{platform:index%2?'TikTok':'Instagram',url:'https://example.test',followers:'120K'}],personal:{fullName:'Private name',province:index%2?'เชียงใหม่':'กรุงเทพมหานคร'},contact:{email:'private@example.test'},status:index%3?'approved':'pending',featured:false}));
 const props={profiles,busy:false,onOpen:record=>{opened=record},onAdd:()=>{},onExport:rows=>{exported=rows}};
 let tree;const render=()=>{cursor=0;tree=exports.default(props)};
 function elements(node,out=[]){if(Array.isArray(node)){node.forEach(child=>elements(child,out));return out}if(node&&typeof node==='object'&&node.props){out.push(node);elements(node.props.children,out)}return out}
 const find=(type,label)=>elements(tree).find(element=>element.type===type&&element.props['aria-label']===label);
 const rows=()=>elements(tree).filter(element=>element.type==='tbody')[0].props.children[0];
 render();assert.equal(rows().length,10);
 find('button','หน้าถัดไป').props.onClick();render();assert.equal(rows().length,10);assert.equal(rows()[0].key,'id-10');
 const firstPerson=elements(rows()[0]).find(element=>element.type==='button');firstPerson.props.onClick();assert.equal(opened,profiles[10]);
 find('input','เลือก Creator 10').props.onChange();render();
 const exportButton=()=>elements(tree).find(element=>element.type==='button'&&element.props.children?.[1]==='ส่งออก CSV');exportButton().props.onClick();assert.deepEqual(Array.from(exported,row=>row.id),['id-10']);
 find('select','แพลตฟอร์ม').props.onChange({target:{value:'TikTok'}});render();assert.equal(rows()[0].key,'id-1');assert.equal(rows().length,10);exportButton().props.onClick();assert.equal(exported.length,12);assert.ok(exported.every(row=>row.socials[0].platform==='TikTok'));
 find('select','จำนวนรายการต่อหน้า').props.onChange({target:{value:'20'}});render();assert.equal(rows().length,12);assert.equal(find('button','หน้าถัดไป').props.disabled,true);
 find('input','ค้นหาผู้สมัคร').props.onChange({target:{value:'Creator 23'}});render();assert.equal(rows().length,1);assert.equal(rows()[0].key,'id-23');
 find('select','สถานะผู้สมัคร').props.onChange({target:{value:'pending'}});render();assert.equal(rows().length,0);
});
