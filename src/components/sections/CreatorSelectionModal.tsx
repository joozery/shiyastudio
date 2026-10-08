'use client';
import {useEffect,useId,useRef,useState} from 'react';
import Image from 'next/image';
import {ArrowUpRight,CheckCircle2,X} from 'lucide-react';
import {CreatorSelectionForm} from './CreatorSelectionForm';
import styles from './CreatorSelectionModal.module.css';
type Creator={id:string;author:string;img:string;category:string};
export function CreatorSelectionModal({creators,thai,onClose,onSuccess,onRemove}:{creators:Creator[];thai:boolean;onClose:()=>void;onSuccess:()=>void;onRemove:(id:string)=>void}){
 const formId=useId();
 const dialog=useRef<HTMLDialogElement>(null);const [sending,setSending]=useState(false),[sent,setSent]=useState(false);
 useEffect(()=>{const element=dialog.current;const overflow=document.body.style.overflow;document.body.style.overflow='hidden';element?.showModal();return ()=>{element?.close();document.body.style.overflow=overflow}},[]);
 const close=()=>{if(!sending)onClose()};
 return <dialog ref={dialog} className={styles.dialog} data-lenis-prevent aria-labelledby="creator-selection-title" onCancel={event=>{event.preventDefault();close()}} onClick={event=>{if(event.target===event.currentTarget){const box=event.currentTarget.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)close()}}}>
 <header className={styles.header}><div><p>SHIYA STUDIO</p><h2 id="creator-selection-title">{sent?(thai?'ส่งรายชื่อเรียบร้อยแล้ว':'Selection sent'):(thai?'ส่งรายชื่อ Influencer':'Send your creator selection')}</h2></div><button type="button" disabled={sending} aria-label={thai?'ปิดหน้าต่าง':'Close dialog'} onClick={close}><X size={19}/></button></header>
 <div className={styles.content}>{!sent&&<><p className={styles.intro}>{thai?'ตรวจรายชื่อและกรอกข้อมูลให้ทีมติดต่อกลับ':'Review your selection and leave your contact details.'}</p><section className={styles.selection} aria-label={thai?'รายชื่อที่เลือก':'Selected creators'}><div className={styles.sectionTitle}><h3>{thai?'รายชื่อที่เลือก':'Selected creators'}</h3><span>{creators.length} {thai?'คน':'creators'}</span></div><div className={styles.creators}>{creators.map(creator=><article key={creator.id}>{creator.img?<Image src={creator.img} alt="" width={32} height={32} unoptimized/>:<span className={styles.initial}>{creator.author.slice(0,1)}</span>}<div><strong title={creator.author}>{creator.author}</strong></div><button type="button" disabled={sending} aria-label={`${thai?'นำออก':'Remove'} ${creator.author}`} onClick={()=>onRemove(creator.id)}><X size={16}/></button></article>)}</div>{!creators.length&&<p className={styles.empty}>{thai?'ยังไม่มี Influencer ที่เลือก ปิดหน้าต่างเพื่อเลือกใหม่ได้เลย':'Your selection is empty. Close this window to choose your creators.'}</p>}</section></>}
 <CreatorSelectionForm ids={creators.map(c=>c.id)} names={creators.map(c=>c.author)} thai={thai} showNames={false} compact formId={formId} hideSubmit onSendingChange={setSending} onSuccess={()=>{setSent(true);onSuccess()}}/>
 </div><footer className={styles.footer}>{sent?<button type="button" className={styles.done} onClick={close}><CheckCircle2 size={17}/>{thai?'กลับไปดู Influencer':'Back to creators'}<ArrowUpRight size={16}/></button>:<><button type="button" disabled={sending} className={styles.cancel} onClick={close}>{thai?'เลือกเพิ่ม':'Choose more'}</button><button type="submit" form={formId} disabled={sending||!creators.length} className={styles.submit}>{sending?(thai?'กำลังส่ง…':'Sending…'):(thai?`ส่งรายชื่อ (${creators.length})`:`Send (${creators.length})`)}<ArrowUpRight size={16}/></button></>}</footer>
 </dialog>
}
