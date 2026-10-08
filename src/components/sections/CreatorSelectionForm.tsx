'use client';
import {useState} from 'react';
import {CheckCircle2} from 'lucide-react';
import styles from './CreatorSelectionForm.module.css';
type Props={ids:string[];names:string[];thai:boolean;onSuccess:()=>void;showNames?:boolean;onSendingChange?:(sending:boolean)=>void;compact?:boolean;formId?:string;hideSubmit?:boolean};
export function CreatorSelectionForm({ids,names,thai,onSuccess,showNames=true,onSendingChange,compact=false,formId,hideSubmit=false}:Props){
 const [sending,setSending]=useState(false),[error,setError]=useState(''),[success,setSuccess]=useState(false);
 const submit=async(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();const values=new FormData(e.currentTarget);if(sending||!ids.length)return;setSending(true);onSendingChange?.(true);setError('');try{const response=await fetch('/api/creators/selections',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...Object.fromEntries(values),creatorIds:ids})});const data=await response.json();if(!response.ok)throw Error(data.error);setSuccess(true);onSuccess()}catch(error){setError(error instanceof Error?error.message:'ส่งไม่สำเร็จ')}finally{setSending(false);onSendingChange?.(false)}};
 const field=(name:string,label:string,type:string,required=false)=><label key={name}>{label}<input name={name} type={type} required={required} autoComplete={name==='name'?'name':name==='email'?'email':name==='phone'?'tel':'organization'} maxLength={name==='phone'?30:150}/></label>;
 if(success)return <div role="status" className={styles.success}><CheckCircle2 size={30}/>{thai?'ส่งรายชื่อให้ทีม SHIYA แล้ว ทีมจะติดต่อกลับตามข้อมูลที่ให้ไว้':'Your selection has been sent. Our team will be in touch.'}</div>;
 return <form id={formId} onSubmit={submit} className={`${styles.form} ${compact?styles.compact:''}`}>
 {!compact&&<h3>{thai?'ส่งรายชื่อที่เลือก':'Send your selection'} ({ids.length})</h3>}{showNames&&<p className={styles.names}>{names.join(' · ')}</p>}
 <fieldset disabled={sending} className={styles.fields}><div className={styles.grid}>{field('name',thai?'ชื่อผู้ติดต่อ *':'Contact name *','text',true)}{field('email',thai?'อีเมล *':'Email *','email',true)}{!compact&&<>{field('company',thai?'บริษัท / แบรนด์':'Company / Brand','text')}{field('phone',thai?'เบอร์โทร':'Phone','tel')}</>}</div>
 {compact&&<details className={styles.optional}><summary>{thai?'เพิ่มบริษัท / เบอร์โทร (ไม่บังคับ)':'Add company / phone (optional)'}</summary><div className={styles.grid}>{field('company',thai?'บริษัท / แบรนด์':'Company / Brand','text')}{field('phone',thai?'เบอร์โทร':'Phone','tel')}</div></details>}
 <label className={styles.message}>{thai?'รายละเอียดแคมเปญ':'Campaign details'}<textarea name="message" rows={compact?2:3} maxLength={3000} placeholder={thai?'แบรนด์ ประเภทงาน หรือช่วงเวลาที่ต้องการ':'Brand, campaign type or preferred dates'}/></label>
 <p className={styles.privacy}>{thai?'ใช้ข้อมูลติดต่อเพื่อประสานแคมเปญเท่านั้น ไม่แสดงใน Catalog':'Your contact details are used to coordinate this campaign and are not shown in the catalog.'}</p>{error&&<p role="alert" className={styles.error}>{error}</p>}
 {!hideSubmit&&<button disabled={sending||!ids.length} className={styles.submit}>{sending?(thai?'กำลังส่ง…':'Sending…'):(thai?`ส่งรายชื่อที่เลือก (${ids.length})`:`Send selection (${ids.length})`)}</button>}</fieldset></form>;
}
