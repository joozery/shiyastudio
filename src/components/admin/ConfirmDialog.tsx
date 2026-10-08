'use client';
import {createContext,useCallback,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {AlertTriangle,X} from 'lucide-react';
import styles from './ConfirmDialog.module.css';
type Options={title?:string;confirmLabel?:string;danger?:boolean};
type Confirm=(message:string,options?:Options)=>Promise<boolean>;
const Context=createContext<Confirm|null>(null);
export function useConfirm(){const confirm=useContext(Context);if(!confirm)throw new Error('useConfirm requires ConfirmProvider');return confirm}
export function ConfirmProvider({children}:{children:ReactNode}){
 const [request,setRequest]=useState<({message:string}&Options)|null>(null);
 const dialog=useRef<HTMLDialogElement>(null),resolve=useRef<((confirmed:boolean)=>void)|null>(null);
 const confirm=useCallback<Confirm>((message,options={})=>{if(resolve.current)return Promise.resolve(false);return new Promise<boolean>(done=>{resolve.current=done;setRequest({message,...options})})},[]);
 const finish=useCallback((confirmed:boolean)=>{dialog.current?.close();const done=resolve.current;resolve.current=null;setRequest(null);done?.(confirmed)},[]);
 useEffect(()=>{if(request&&!dialog.current?.open)dialog.current?.showModal()},[request]);
 useEffect(()=>()=>{resolve.current?.(false);resolve.current=null},[]);
 return <Context.Provider value={confirm}>{children}<dialog ref={dialog} className={styles.dialog} aria-labelledby="admin-confirm-title" aria-describedby="admin-confirm-message" onCancel={event=>{event.preventDefault();finish(false)}} onClick={event=>{if(event.target===event.currentTarget){const bounds=event.currentTarget.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)finish(false)}}}>{request&&<><div className={styles.heading}><span className={`${styles.icon} ${request.danger!==false?styles.danger:''}`}><AlertTriangle size={25}/></span><button type="button" className={styles.close} onClick={()=>finish(false)} aria-label="ปิดหน้าต่างยืนยัน"><X size={20}/></button></div><h2 id="admin-confirm-title">{request.title||'ยืนยันการดำเนินการ'}</h2><p id="admin-confirm-message">{request.message}</p><footer className={styles.actions}><button type="button" autoFocus className={styles.cancel} onClick={()=>finish(false)}>ยกเลิก</button><button type="button" className={`${styles.confirm} ${request.danger!==false?styles.destructive:''}`} onClick={()=>finish(true)}>{request.confirmLabel||'ยืนยัน'}</button></footer></>}</dialog></Context.Provider>
}
