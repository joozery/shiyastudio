'use client';
import {useRef,useState,type ReactNode} from 'react';
import Link,{useLinkStatus} from 'next/link';
import {usePathname} from 'next/navigation';
import Image from 'next/image';
import {Toaster} from 'sonner';
import {LayoutDashboard,FolderOpen,MessageSquare,Receipt,Users,ImageIcon,Layers,Film,Globe,Shield,Settings,Menu,X,ArrowUpRight,Search,Loader2,ChevronRight} from 'lucide-react';
import {ConfirmProvider} from './ConfirmDialog';
import LogoutButton from './LogoutButton';
import './Admin.css';
const groups=[
 {title:'งานและลูกค้า',items:[{path:'dashboard',label:'ภาพรวมระบบ',icon:LayoutDashboard},{path:'contacts',label:'ข้อความจากลูกค้า',icon:MessageSquare},{path:'quotations',label:'ใบเสนอราคา',icon:Receipt},{path:'creators',label:'ผู้สมัคร / Influencer',icon:Users},{path:'creators/selections',label:'รายชื่อที่ลูกค้าเลือก',icon:MessageSquare},{path:'creators/settings',label:'หมวดหมู่ / ข้อตกลง',icon:Settings}]},
 {title:'เนื้อหาเว็บไซต์',items:[{path:'hero',label:'ภาพและวิดีโอหน้าแรก',icon:ImageIcon},{path:'services',label:'บริการ',icon:Layers},{path:'service-works',label:'ผลงานแยกตามบริการ',icon:Film},{path:'projects',label:'แกลเลอรีโปรเจกต์',icon:FolderOpen},{path:'clients',label:'โลโก้ลูกค้า / Partners',icon:Globe},{path:'influencer',label:'Influencer & Commerce',icon:Film}]},
 {title:'ระบบ',items:[{path:'users',label:'จัดการแอดมิน',icon:Shield},{path:'settings',label:'บัญชีและการตั้งค่า',icon:Settings}]}
];
function NavigationHint(){const {pending}=useLinkStatus();return <span className="admin-nav-hint" aria-live="polite">{pending&&<><Loader2 size={15} className="admin-spin"/><span className="sr-only">กำลังเปิดหน้า…</span></>}</span>}
export default function AdminShell({children,locale,user}:{children:ReactNode;locale:string;user:{email:string;role:string;avatar:string}}){
 const pathname=usePathname();const [query,setQuery]=useState('');const menu=useRef<HTMLDialogElement>(null);
 const menuItems=groups.flatMap(g=>g.items);
 const active=menuItems.find(item=>pathname===`/${locale}/admin/${item.path}`)||menuItems.find(item=>pathname.startsWith(`/${locale}/admin/${item.path}/`));
 const navigation=<><label className="admin-nav-search"><Search size={16}/><input aria-label="ค้นหาเมนูหลังบ้าน" placeholder="ค้นหาเมนู…" value={query} onChange={e=>setQuery(e.target.value)}/></label><nav aria-label="เมนูหลังบ้าน" className="admin-nav">{groups.map(group=>{const items=group.items.filter(item=>item.label.toLowerCase().includes(query.trim().toLowerCase()));return items.length>0&&<div key={group.title}><p className="admin-nav-group">{group.title}</p>{items.map(item=><Link key={item.path} href={`/${locale}/admin/${item.path}`} aria-current={active?.path===item.path?'page':undefined} onClick={()=>menu.current?.close()} className={`admin-nav-link ${active?.path===item.path?'is-active':''}`}><item.icon size={18}/><span>{item.label}</span><NavigationHint/></Link>)}</div>})}{!groups.some(group=>group.items.some(item=>item.label.toLowerCase().includes(query.trim().toLowerCase())))&&<p className="admin-nav-empty">ไม่พบเมนูที่ค้นหา</p>}</nav></>;
 return <ConfirmProvider><div className="admin-shell"><Toaster position="top-right" richColors/>
  <aside className="admin-sidebar"><Link href={`/${locale}/admin/dashboard`} className="admin-brand"><Image src="/logo/logo.png" alt="SHIYA STUDIO" width={44} height={44}/><div><strong>SHIYA STUDIO</strong><span>Workspace / Admin</span></div></Link>{navigation}<div className="admin-sidebar-bottom"><LogoutButton locale={locale}/></div></aside>
  <dialog ref={menu} className="admin-mobile-menu"><div className="admin-mobile-title"><strong>SHIYA / เมนูหลังบ้าน</strong><button onClick={()=>menu.current?.close()} aria-label="ปิดเมนู"><X size={22}/></button></div>{navigation}<LogoutButton locale={locale}/></dialog>
  <div className="admin-main"><header className="admin-topbar"><div className="admin-topbar-left"><button className="admin-menu-button" onClick={()=>menu.current?.showModal()} aria-label="เปิดเมนูหลังบ้าน"><Menu size={22}/></button><span className="admin-workspace-name">Workspace</span><ChevronRight size={15}/><strong>{active?.label||'หลังบ้าน SHIYA'}</strong></div><div className="admin-topbar-right"><a href={`/${locale}`} target="_blank" rel="noopener noreferrer" className="admin-website-link">ดูเว็บไซต์<ArrowUpRight size={16}/></a><Link href={`/${locale}/admin/settings`} className="admin-user"><span className="admin-user-text"><strong>{user.email.split('@')[0]}</strong><small>{user.role}</small></span>{user.avatar?<Image src={user.avatar} unoptimized alt="รูปบัญชีผู้ดูแล" width={36} height={36}/>:<span className="admin-user-initial">{user.email[0]?.toUpperCase()}</span>}</Link></div></header><main id="admin-main-content" className="admin-content">{children}</main></div>
 </div></ConfirmProvider>;
}
