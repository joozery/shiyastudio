/* eslint-disable @typescript-eslint/no-require-imports */
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
test('confirmation waits for a decision, defaults to cancellation and never approves a duplicate request',async()=>{
 const slots=[];let cursor=0;const effects=[];const node=(type,props)=>({type,props});
 const react={createContext:()=>({Provider:'Provider'}),useContext:()=>null,useCallback:fn=>fn,useState:initial=>{const index=cursor++;if(!(index in slots))slots[index]=initial;return[slots[index],value=>{slots[index]=value}]},useRef:initial=>{const index=cursor++;if(!(index in slots))slots[index]={current:initial};return slots[index]},useEffect:(fn,deps)=>{effects.push({fn,deps})}};
 const context={exports:{},Promise,Error,require:name=>name==='react'?react:name==='react/jsx-runtime'?{jsx:node,jsxs:node}:name==='lucide-react'?{AlertTriangle:'Icon',X:'X'}:name.endsWith('.css')?{default:new Proxy({},{get:(_,key)=>key})}:require(name)};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/components/admin/ConfirmDialog.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,context);
 const render=()=>{cursor=0;return context.exports.ConfirmProvider({children:null})};let tree=render();const confirm=tree.props.value;
 let settled=false;const pending=confirm('ลบโปรไฟล์?').then(result=>{settled=true;return result});await Promise.resolve();assert.equal(settled,false);
 assert.equal(await confirm('duplicate'),false);tree=render();const dialog=tree.props.children[1];assert.equal(dialog.props['aria-labelledby'],'admin-confirm-title');let prevented=false;dialog.props.onCancel({preventDefault(){prevented=true}});assert.equal(await pending,false);assert.equal(prevented,true);
 const approved=confirm('ลบโปรไฟล์?',{confirmLabel:'ลบโปรไฟล์'});tree=render();const content=tree.props.children[1].props.children.props.children;const footer=content[3];assert.equal(footer.props.children[0].props.autoFocus,true);footer.props.children[1].props.onClick();assert.equal(await approved,true);
 const unmounted=confirm('pending on unmount');const cleanup=effects.find(effect=>effect.deps.length===0).fn();cleanup();assert.equal(await unmounted,false);
});
