'use client';
import {useCreatorSelection} from '@/components/sections/useCreatorSelection';
import {SocialBrandIcon} from '@/components/creators/SocialBrandIcon';
import {useLocale} from 'next-intl';
import {ArrowLeft,ArrowUpRight,Check,Plus,Users,Sparkles,Play} from 'lucide-react';
import Image from 'next/image';
import {Link} from '@/navigation';
import {Navbar} from '@/components/layout/Navbar';
import {Footer} from '@/components/layout/Footer';
import type {Creator} from '../InfluencersClient';
import styles from './Profile.module.css';
const validLink=(url:string)=>{try{return ['http:','https:'].includes(new URL(url).protocol)}catch{return false}};
const videoLink=(url:string)=>/\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
export default function ProfileClient({creator}:{creator:Creator}) {
 const thai=useLocale()==='th';
 const {selected:ids,toggle:toggleId}=useCreatorSelection();
 const selected=ids.includes(creator.id);
 const socials=(creator.socials||[]).filter(s=>validLink(s.url));
 const portfolio=[...new Set([...(creator.portfolio||[]),creator.videoUrl].filter(url=>url&&validLink(url)))];
 return <main className={styles.page}><Navbar/>
  <div className={styles.wrap}>
   <nav className={styles.breadcrumb} aria-label={thai?'เส้นทางหน้า':'Breadcrumb'}><Link href="/influencers#creators"><ArrowLeft size={16}/>{thai?'กลับไปเลือก Influencer':'All creators'}</Link><span>/</span><span>{creator.author}</span></nav>
   <section className={styles.profile} aria-labelledby="creator-name">
    <div className={styles.portraitColumn}><div className={styles.portrait}>
     {creator.img?<Image src={creator.img} unoptimized={creator.img.startsWith('/api/creators/media/')} alt={creator.author} fill sizes="(max-width:760px) 90vw, (max-width:1100px) 45vw, 460px" className={styles.image} preload/>:<Users size={64}/>}
     {creator.featured&&<span className={styles.featured}><Sparkles size={14}/>{thai?'ครีเอเตอร์แนะนำ':'Featured creator'}</span>}
     <div className={styles.portraitCaption}><span>SHIYA STUDIO</span><span>OUR CREATORS</span></div>
    </div></div>
    <div className={styles.details}><p className={styles.eyebrow}>MEET THE CREATOR</p><h1 id="creator-name">{creator.author}</h1>
     <div className={styles.tags}>{(creator.categories||[creator.category]).filter(Boolean).map(value=><span key={value}>{value}</span>)}</div>
     {creator.bio&&<p className={styles.bio}>{creator.bio}</p>}
     <div className={styles.summary}>
      {creator.followers&&<div><strong>{creator.followers}</strong><span>{thai?'ผู้ติดตาม':'Followers'}{creator.platform?` · ${creator.platform}`:''}</span></div>}
      {socials.length>0&&<div><strong>{socials.length.toString().padStart(2,'0')}</strong><span>{thai?'ช่องทางโซเชียล':'Social channels'}</span></div>}
      {portfolio.length>0&&<div><strong>{portfolio.length.toString().padStart(2,'0')}</strong><span>{thai?'ผลงานที่แนบ':'Portfolio links'}</span></div>}
     </div>
     <div className={styles.selectionBox}><div><h2>{thai?'ครีเอเตอร์ที่ใช่สำหรับแบรนด์คุณ?':'A match for your brand?'}</h2><p>{thai?'เลือกเก็บไว้ แล้วส่งรายชื่อให้ทีม SHIYA ช่วยประสานแคมเปญ':'Add this creator to your selection and let us coordinate your campaign.'}</p></div><div className={styles.actions}>
      <button onClick={()=>toggleId(creator.id)} aria-pressed={selected} className={selected?styles.selected:styles.select}>{selected?<Check size={18}/>:<Plus size={18}/>} {selected?(thai?'เลือกไว้แล้ว':'Selected'):(thai?'เลือก Influencer คนนี้':'Select this creator')}</button>
      <Link href="/influencers#creators">{thai?'ดูรายชื่อที่เลือก':'Review selection'}<ArrowUpRight size={17}/></Link>
     </div><p className={styles.selectionStatus} role="status">{selected?(thai?'เพิ่มคนนี้ในรายชื่อที่เลือกแล้ว':'This creator is in your selection'):thai?'คุณสามารถเลือกได้มากกว่าหนึ่งคน':'You can select more than one creator.'}</p></div>
    </div>
   </section>
   {socials.length>0&&<section className={styles.section} aria-labelledby="social-heading"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>SOCIAL PRESENCE</p><h2 id="social-heading">{thai?'ช่องทางและสถิติ':'Channels & statistics'}</h2></div><p>{thai?'สถิติที่ครีเอเตอร์แจ้งในโปรไฟล์':'Statistics supplied by the creator'}</p></div><div className={styles.socialGrid}>{socials.map(social=><article key={social.platform} className={styles.socialCard}>
    <a href={social.url} target="_blank" rel="noopener noreferrer" className={styles.socialHeading}><span className={styles.socialIcon}><SocialBrandIcon platform={social.platform} size={25}/></span><h3>{social.platform}</h3><ArrowUpRight size={19}/></a>
    <dl className={styles.metrics}>{[[social.followers,thai?'ผู้ติดตาม':'Followers'],[social.averageViews,thai?'ยอดชมเฉลี่ย':'Average views'],[social.engagement?`${social.engagement.replace(/%$/,'')}%`:'','Engagement']].filter(([value])=>value).map(([value,label])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    {!social.followers&&!social.averageViews&&!social.engagement&&<p className={styles.noStats}>{thai?'ยังไม่ได้ระบุสถิติ':'Statistics not provided'}</p>}
   </article>)}</div></section>}
   {portfolio.length>0&&<section className={styles.section} aria-labelledby="portfolio-heading"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>SELECTED WORK</p><h2 id="portfolio-heading">{thai?'ผลงานของครีเอเตอร์':'Creator portfolio'}</h2></div></div><div className={styles.workGrid}>{portfolio.map((url,index)=><article key={url} className={styles.workCard}>
    {videoLink(url)?<video src={url} controls playsInline preload="metadata" className={styles.video}/>:<a href={url} target="_blank" rel="noopener noreferrer" className={styles.workLink}><span className={styles.workNumber}>{String(index+1).padStart(2,'0')}</span><div><Play size={24}/><h3>{thai?'ดูผลงานต้นฉบับ':'Explore original work'}</h3><span>{new URL(url).hostname}</span></div><ArrowUpRight size={25}/></a>}
   </article>)}</div></section>}
   <section className={styles.explore}><div><p className={styles.eyebrow}>FIND YOUR PERFECT CREATOR</p><h2>{thai?'ค้นหาครีเอเตอร์สำหรับแคมเปญของคุณต่อ':'Find more creators for your campaign.'}</h2></div><Link href="/influencers#creators">{thai?'ดู Influencer ทั้งหมด':'Explore all creators'}<ArrowUpRight size={19}/></Link></section>
  </div><Footer showCta={false}/></main>;
}
