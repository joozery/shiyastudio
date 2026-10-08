"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Play, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/navigation";
import styles from "./Detail.module.css";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useProjectsMotion } from "@/components/sections/useProjectsMotion";

interface GalleryItem { id?: string; image?: string; type?: string; videoUrl?: string; influencer?: { username?: string; platform?: string } }
interface Project { id: string | number; brand?: string; campaign?: string; about?: string; category?: string; tags?: string[]; heroImage?: string; coverImage?: string; stats?: { reach?: string; views?: string; engagement?: string }; gallery?: GalleryItem[] }
const isVideo = (url = "") => /\.(mp4|mov|webm|m4v)(\?|$)/i.test(url);
const videoSource = (item: GalleryItem) => item.videoUrl || (isVideo(item.image) ? item.image : "");
const isVideoItem = (item: GalleryItem) => item.type === "VIDEO" || !!videoSource(item);
const meaningful = (text?: string) => text && !/^(new campaign|about this project\.*|category|tag\d+|logo text)$/i.test(text.trim()) ? text : "";

export default function DynamicServiceDetailPage() {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const thai = useLocale() === "th";
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const page = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const viewerOpen = selected !== null;
  const [direction, setDirection] = useState(1);
  useProjectsMotion(page, `${loading}-${slug}-${id}`);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true); setError(false);
      try {
        const response = await fetch('/api/service-works', { signal: controller.signal });
        if (!response.ok) throw new Error('Unavailable');
        const data = await response.json();
        if (!controller.signal.aborted) setProject((data.services?.[slug] as Project[] | undefined)?.find(p => String(p.id) === id) ?? null);
      } catch { if (!controller.signal.aborted) setError(true); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    void load();
    return () => controller.abort();
  }, [id, slug, attempt]);

  useEffect(() => {
    if (!viewerOpen) return;
    const modal = dialog.current;
    modal?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; modal?.close(); };
  }, [viewerOpen]);

  const gallery = project?.gallery ?? [];
  const items = gallery.filter(item => filter === "ALL" || (filter === "VIDEO" ? isVideoItem(item) : !isVideoItem(item)));
  const hero = project?.heroImage || project?.coverImage || gallery.find(item => item.image && !isVideo(item.image))?.image;
  const title = project?.brand || (thai ? 'ผลงานของเรา' : 'Our work');
  const service = ({ influencer: 'Influencer Marketing', production: 'Creative Production', 'graphic-design': 'Graphic Design', 'vdo-motion': 'Video & Motion', 'mix-master-music': 'Audio & Music' } as Record<string,string>)[slug] || slug;
  const stats = [{ label: 'TOTAL REACH', value: project?.stats?.reach }, { label: 'TOTAL VIEWS', value: project?.stats?.views }, { label: 'ENGAGEMENT RATE', value: project?.stats?.engagement }].filter(stat => stat.value);

  const selectedIndex = selected ? gallery.indexOf(selected) : -1;
  const move = (step: number) => { setDirection(step); setSelected(gallery[(selectedIndex + step + gallery.length) % gallery.length]); };

  return <main ref={page} className={styles.page}>
    <Navbar overlay />
    {loading ? <section className={styles.state} aria-busy="true"><p>{thai ? 'กำลังโหลดผลงาน…' : 'Loading project…'}</p></section> : error || !project ? <section className={styles.state}><h1>{thai ? (error ? 'ยังโหลดผลงานไม่ได้' : 'ไม่พบผลงานนี้') : 'Project unavailable'}</h1>{error && <button onClick={() => setAttempt(n => n + 1)}>{thai ? 'ลองอีกครั้ง' : 'Retry'}</button>}<Link href="/projects">{thai ? 'กลับไปดูผลงาน' : 'Back to projects'}</Link></section> : <>
      <section className={styles.hero}>
        <div className={styles.wrap}>
          <Link href={`/services/${slug}`} className={styles.back}><ArrowLeft size={16} />{thai ? 'กลับไปดูผลงานทั้งหมด' : 'Back to all work'}</Link>
          <div className={styles.heading}><div><p className={styles.eyebrow}>{service}</p><h1>{title}</h1>{meaningful(project.campaign) && <p className={styles.subtitle}>{project.campaign}</p>}</div><a href="#campaign-content" className={styles.explore}>{thai ? 'สำรวจผลงาน' : 'Explore the campaign'}<ArrowUpRight size={20}/></a></div>
          <div className={styles.heroImage}>{hero && !isVideo(hero) ? <Image src={hero} alt={`${title} campaign`} fill sizes="(max-width: 768px) 100vw, 90vw" preload className={styles.cover}/> : <ImageIcon size={48}/>}<span className={styles.caption}>SHIYA STUDIO / {service.toUpperCase()}</span></div>
        </div>
      </section>
      <section className={styles.overview}>
        <div className={styles.wrap}>
          <div className={styles.summary}><div><p className={styles.eyebrow}>CAMPAIGN OVERVIEW</p><h2>{thai ? 'ไอเดียที่กลายเป็นผลงานจริง' : 'Ideas brought to life.'}</h2></div><div><p className={styles.about}>{meaningful(project.about) || (thai ? `รวมผลงานภาพและวิดีโอในแคมเปญของ ${title} โดยทีม SHIYA STUDIO` : `Explore the photography and video content created for ${title} by SHIYA STUDIO.`)}</p><div className={styles.tags}>{[service, ...(project.tags ?? []).filter(tag => meaningful(tag))].map(tag => <span key={tag}>{tag}</span>)}</div></div></div>
          {stats.length > 0 && <div className={styles.stats}>{stats.map(stat => <div key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div>}
        </div>
      </section>
      <section id="campaign-content" className={styles.gallery}>
        <div className={styles.wrap}><div className={styles.galleryHeading}><div><p className={styles.eyebrow}>CAMPAIGN CONTENT / {String(gallery.length).padStart(2,'0')}</p><h2>{thai ? 'ทุกมุมของแคมเปญ' : 'The campaign, in focus.'}</h2></div><div className={styles.filters} role="group" aria-label={thai ? 'กรองประเภทผลงาน' : 'Filter content'}>{['ALL','PHOTO','VIDEO'].map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === 'ALL' ? (thai ? 'ทั้งหมด' : 'All') : value === 'PHOTO' ? (thai ? 'ภาพ' : 'Photos') : (thai ? 'วิดีโอ' : 'Videos')}<span>{value === 'ALL' ? gallery.length : gallery.filter(item => value === 'VIDEO' ? isVideoItem(item) : !isVideoItem(item)).length}</span></button>)}</div></div>
          <div className={styles.grid}>{items.map((item,index) => {
            const video = videoSource(item); const thumbnail = item.image && !isVideo(item.image) ? item.image : '';
            const external = video && !isVideo(video);
            const content = <><div className={styles.media}>{thumbnail ? <img src={thumbnail} alt={`${title} — ${index + 1}`} loading="lazy"/> : <div className={styles.placeholder}>{isVideoItem(item) ? <Play size={32}/> : <ImageIcon size={32}/>}</div>}<span className={styles.badge}>{isVideoItem(item) ? 'VIDEO' : 'PHOTO'}</span>{isVideoItem(item) && <span className={styles.play}><Play size={19} fill="currentColor"/></span>}</div><div className={styles.itemCaption}><span>{item.influencer?.username || `${title} / ${String(index + 1).padStart(2,'0')}`}</span>{external ? <ArrowUpRight size={17}/> : <span>{isVideoItem(item) ? 'PLAY' : 'VIEW'}</span>}</div></>;
            return external ? <a key={item.id || index} className={styles.card} href={video} target="_blank" rel="noopener noreferrer">{content}</a> : <motion.button key={item.id || index} initial={reducedMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.4 }} className={styles.card} onClick={() => setSelected(item)} disabled={!thumbnail && !video}>{content}</motion.button>;
          })}</div>
          {!items.length && <p className={styles.empty}>{thai ? 'ยังไม่มีผลงานในหมวดนี้' : 'No content in this category yet.'}</p>}
        </div>
      </section>
      <section className={styles.cta}><div className={styles.wrap}><p className={styles.eyebrow}>LET’S CREATE TOGETHER</p><h2>{thai ? 'โปรเจกต์ต่อไป อาจเป็นแบรนด์คุณ' : 'Your brand could be next.'}</h2><Link href="/contact">{thai ? 'คุยเรื่องโปรเจกต์ของคุณ' : 'Start a conversation'}<ArrowUpRight size={20}/></Link></div></section>
      <Footer showCta={false}/>
    </>}
    <dialog ref={dialog} data-lenis-prevent className={styles.modal} aria-label={thai ? 'ชมผลงาน' : 'Project preview'} onCancel={() => setSelected(null)} onClose={() => setSelected(null)} onKeyDown={event => { if(event.key === 'ArrowRight') { event.preventDefault(); move(1); } if(event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } }}>
      <div className={styles.viewerHeader}><div><span>{service}</span><strong>{title}</strong></div><span>{selectedIndex + 1} / {gallery.length}</span><button className={styles.close} aria-label={thai ? 'ปิดภาพผลงาน' : 'Close preview'} onClick={() => setSelected(null)}><X size={24}/></button></div>
      <div className={styles.viewerStage}>
        <button className={styles.previous} aria-label={thai ? 'ผลงานก่อนหน้า' : 'Previous item'} onClick={() => move(-1)} disabled={gallery.length < 2}><ChevronLeft/></button>
        <AnimatePresence mode="wait" initial={false}><motion.div key={selectedIndex} className={styles.viewerMedia} initial={{ opacity: 0, x: reducedMotion ? 0 : direction * 45 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reducedMotion ? 0 : direction * -45 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} drag={selected && !videoSource(selected) ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.15} onDragEnd={(_, info) => { if(info.offset.x < -45) move(1); else if(info.offset.x > 45) move(-1); }}>
          {selected && (isVideo(videoSource(selected)) ? <video src={videoSource(selected)} controls autoPlay playsInline/> : videoSource(selected) ? <div className={styles.externalPreview}>{selected.image && <img src={selected.image} alt={title}/>}<a href={videoSource(selected)} target="_blank" rel="noopener noreferrer">{thai ? 'เปิดวิดีโอต้นฉบับ' : 'Watch original video'}<ArrowUpRight size={18}/></a></div> : selected.image ? <img src={selected.image} alt={title} draggable={false}/> : <p>{thai ? 'ยังไม่มีไฟล์ผลงาน' : 'Media unavailable'}</p>)}
        </motion.div></AnimatePresence>
        <button className={styles.next} aria-label={thai ? 'ผลงานถัดไป' : 'Next item'} onClick={() => move(1)} disabled={gallery.length < 2}><ChevronRight/></button>
      </div>
      <div className={styles.viewerFooter}><p aria-live="polite">{selected?.influencer?.username || title} <span> / {selected && isVideoItem(selected) ? 'VIDEO' : 'PHOTO'}</span></p><div className={styles.thumbnails}>{gallery.map((item,index) => <button key={item.id || index} aria-label={`${thai ? 'ดูผลงาน' : 'View item'} ${index + 1}`} aria-pressed={index === selectedIndex} onClick={() => { setDirection(index > selectedIndex ? 1 : -1); setSelected(item); }}>{item.image && !isVideo(item.image) ? <img src={item.image} alt="" loading="lazy"/> : <Play size={18}/>}</button>)}</div></div>
    </dialog>
  </main>;
}
