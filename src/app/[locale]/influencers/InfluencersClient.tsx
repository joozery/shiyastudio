"use client";

import { useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Play, Search, Users, LayoutGrid, SlidersHorizontal, Target, Clapperboard, ChartColumn, Sparkles, Shirt, ShoppingBag, Utensils, Plane, Monitor, Leaf, PawPrint, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useProjectsMotion } from '@/components/sections/useProjectsMotion';
import { useCreatorSelection } from '@/components/sections/useCreatorSelection';
import { CreatorSelectionForm } from '@/components/sections/CreatorSelectionForm';
import {SocialBrandIcon as SocialIcon} from '@/components/creators/SocialBrandIcon';
import styles from './Influencers.module.css';

export interface Creator { id: string; author: string; img: string; videoUrl: string; category: string; platform: string; gender?: string; bio?: string; profileUrl?: string; followers?: string; categories?: string[]; socials?: import('@/lib/creators').Social[]; portfolio?: string[]; featured?: boolean }
const categoryIcons: Record<string, typeof Users> = { Beauty: Sparkles, Fashion: Shirt, Lifestyle: ShoppingBag, Food: Utensils, Travel: Plane, Tech: Monitor, Health: Leaf, Pet: PawPrint, Business: Briefcase };
const localVideo = (url: string) => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);


export default function InfluencersClient({ items, configuredCategories, configuredGenders }: { items: Creator[]; heroImage: string; configuredCategories: string[]; configuredGenders: string[] }) {
  const thai = useLocale() === 'th';
  const reduced = useReducedMotion();
  const page = useRef<HTMLElement>(null);
  const { selected: favorites, toggle: toggleFavorite, clear } = useCreatorSelection();
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState('all');
  const [category, setCategory] = useState('all');
  const [gender, setGender] = useState('all');
  const platforms = [...new Set(items.flatMap(item => item.socials?.map(s => s.platform) || [item.platform]).filter(Boolean))];
  const categories = [...new Set(configuredCategories)];
  const filtered = items.filter(item => (gender === 'all' || item.gender === gender) && (platform === 'all' || (item.socials?.some(s => s.platform === platform) || item.platform === platform)) && (category === 'all' || (item.categories || [item.category]).includes(category)) && [item.author, ...(item.categories || [item.category]), item.platform].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  useProjectsMotion(page, 'influencers');

  return <main ref={page} className={styles.page}>
    <Navbar overlay/>
    <section className={styles.hero}>
      <Image src="/coverinfu.png" alt="" fill sizes="100vw" preload className={styles.heroImage}/>
      <div className={styles.heroShade}/>
      <div className={styles.wrap}><div className={styles.heroGrid}>
        <div className={styles.heroCopy}><p className={styles.eyebrow}>INFLUENCER MARKETING</p><h1>{thai ? <>เชื่อมแบรนด์<br/>กับผู้คน<span>ที่ใช่</span></> : <>CONNECT BRANDS<br/>WITH THE <span>RIGHT PEOPLE.</span></>}</h1><p className={styles.intro}>{thai ? 'เราคือเอเจนซี่ที่เชื่อมแบรนด์กับอินฟลูเอนเซอร์ สร้างแคมเปญที่เข้าถึงใจ เข้าถึงกลุ่มเป้าหมายได้อย่างมีประสิทธิภาพ' : 'Connecting brands with creators. Meaningful campaigns that reach the right audience.'}</p><div className={styles.heroActions}><a href="#creators" className={styles.primary}>{thai ? 'ค้นหาอินฟลูเอนเซอร์' : 'Find a creator'}<ArrowUpRight size={18}/></a><Link href="/services/influencer" className={styles.watch}><span><Play size={16} fill="currentColor"/></span>{thai ? 'ดูตัวอย่างแคมเปญ' : 'Explore campaigns'}</Link></div><Link href="/influencers/apply" className={styles.applyLink}>{thai ? 'สมัครเป็น Influencer กับ SHIYA →' : 'Join our creator network →'}</Link>{items.length > 0 && <div className={styles.stats}><div><strong>{items.length}</strong><span>{thai ? 'รายการครีเอเตอร์' : 'Creator content'}</span></div><div><strong>{platforms.length}</strong><span>{thai ? 'แพลตฟอร์ม' : 'Platforms'}</span></div><div><strong>{categories.length}</strong><span>{thai ? 'ประเภทงาน' : 'Content categories'}</span></div></div>}</div>

      </div></div>
    </section>
    <section id="creators" className={styles.directory} aria-labelledby="creators-heading">
      <div className={styles.wrap}>
        <div className={styles.categories}><button className={category === 'all' ? styles.activeCategory : ''} onClick={() => setCategory('all')}><LayoutGrid size={17}/>{thai ? 'ทั้งหมด' : 'All'}</button>{categories.map(value => { const Icon = categoryIcons[value] || Users; return <button key={value} className={category === value ? styles.activeCategory : ''} onClick={() => setCategory(value)}><Icon size={17}/>{value}</button>; })}</div>
        <div className={styles.heading}><div><p className={styles.eyebrow}>EXPLORE</p><h2 id="creators-heading">{thai ? 'ค้นหาอินฟลูเอนเซอร์ที่ใช่' : 'Find your right creator.'}</h2><p>{thai ? 'หลากหลายสไตล์ ครอบคลุมทุกกลุ่มเป้าหมาย' : 'Different voices. Meaningful connections.'}</p></div><button className={styles.filterButton} onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="creator-filters"><SlidersHorizontal size={17}/>{thai ? 'ตัวกรอง' : 'Filters'}</button></div>
        <div className={styles.toolbar}>
          <div className={styles.search}><Search size={18}/><label htmlFor="creator-search" className="sr-only">{thai ? 'ค้นหาครีเอเตอร์' : 'Search creators'}</label><input id="creator-search" type="search" placeholder={thai ? 'ค้นหาชื่อช่องหรือประเภทงาน…' : 'Search creators or content…'} value={query} onChange={e => setQuery(e.target.value)}/></div>
          <div id="creator-filters" className={styles.select} hidden={!filtersOpen}><label htmlFor="creator-platform">{thai ? 'แพลตฟอร์ม' : 'Platform'}</label><select id="creator-platform" value={platform} onChange={e => setPlatform(e.target.value)}><option value="all">{thai ? 'ทุกแพลตฟอร์ม' : 'All platforms'}</option>{platforms.map(value => <option key={value}>{value}</option>)}</select></div>
          <div className={styles.select} hidden={!filtersOpen}><label htmlFor="creator-category">{thai ? 'ประเภทงาน' : 'Content category'}</label><select id="creator-category" value={category} onChange={e => setCategory(e.target.value)}><option value="all">{thai ? 'ทุกประเภท' : 'All categories'}</option>{categories.map(value => <option key={value}>{value}</option>)}</select></div>
          <div className={styles.select} hidden={!filtersOpen}><label htmlFor="creator-gender">{thai ? 'เพศ' : 'Gender'}</label><select id="creator-gender" value={gender} onChange={e => setGender(e.target.value)}><option value="all">{thai ? 'ทุกเพศ' : 'All genders'}</option>{configuredGenders.map(value => <option key={value}>{value}</option>)}</select></div>
        </div>
        <p aria-live="polite" className={styles.count}>{thai ? `พบ ${filtered.length} รายการ` : `${filtered.length} results`}</p>
        <div className={styles.selection}><span>{thai ? 'เลือก Influencer ที่เหมาะกับแคมเปญของคุณ' : 'Choose the creators for your campaign.'}</span><button disabled={!items.some(item => favorites.includes(item.id))} onClick={() => setSelectionOpen(!selectionOpen)}>{thai ? 'ส่งรายชื่อที่เลือก' : 'Send selection'} ({items.filter(item => favorites.includes(item.id)).length})<ArrowUpRight size={16}/></button></div>{selectionOpen && <CreatorSelectionForm ids={items.filter(item => favorites.includes(item.id)).map(item => item.id)} names={items.filter(item => favorites.includes(item.id)).map(item => item.author)} thai={thai} onSuccess={clear}/>}<div className={styles.grid}>{filtered.map((item,index) => <motion.article key={`${item.id}-${index}`} className={`${styles.card} ${favorites.includes(item.id) ? styles.selectedCard : ''}`} initial={reduced ? false : { opacity:0, y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true, amount:.1 }} transition={{ duration:.35 }}>
          <Link href={`/influencers/${encodeURIComponent(item.id)}`} className={styles.photo} aria-label={`${thai ? 'ดูโปรไฟล์' : 'View profile'} ${item.author}`}>
            {item.img && !localVideo(item.img) ? <Image src={item.img} unoptimized={item.img.startsWith('/api/creators/media/')} alt={item.author || (thai ? 'ผลงานครีเอเตอร์' : 'Creator content')} fill sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 320px" className={styles.image}/> : localVideo(item.videoUrl || item.img) ? <video className={styles.image} src={item.videoUrl || item.img} muted playsInline preload="metadata"/> : <Users size={40}/>}
            {item.platform && <span className={styles.platform}><SocialIcon platform={item.platform}/>{item.platform}</span>}{item.featured && <span className={styles.featured}>{thai ? 'แนะนำ' : 'Featured'}</span>}<span className={styles.preview}>{item.videoUrl ? <Play size={15}/> : <ArrowUpRight size={16}/>}</span>
          </Link>
          <div className={styles.info}>
            <div className={styles.creatorName}><h3><Link href={`/influencers/${encodeURIComponent(item.id)}`}>{item.author || (thai ? 'ครีเอเตอร์' : 'Creator')}</Link></h3></div>
            <div className={styles.creatorTags}>{(item.categories || (item.category ? [item.category] : [])).map(value => <span key={value}>{value}</span>)}</div>
            <div className={styles.socialAccounts}>{(item.socials?.filter(social=>social.url) || []).map(social => <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.author} ${social.platform}`} title={`${social.platform}${social.followers ? ` · ${social.followers} Followers` : ''}`}><SocialIcon platform={social.platform}/><span>{social.platform}</span></a>)}</div>
            {item.followers && <div className={styles.followerStat}><strong>{item.followers}</strong><span>{thai ? 'ผู้ติดตาม' : 'Followers'}{item.platform ? ` · ${item.platform}` : ''}</span></div>}
            <div className={styles.cardActions}><Link href={`/influencers/${encodeURIComponent(item.id)}`}>{thai ? 'ดูโปรไฟล์' : 'Profile'}<ArrowUpRight size={15}/></Link><button aria-label={`${thai ? 'เลือก Influencer' : 'Select creator'} ${item.author} ${index + 1}`} aria-pressed={favorites.includes(item.id)} onClick={() => toggleFavorite(item.id)}>{favorites.includes(item.id) ? (thai ? 'เลือกแล้ว ✓' : 'Selected ✓') : (thai ? 'เลือก +' : 'Select +')}</button></div>
          </div>
        </motion.article>)}</div>
        {filtered.length === 0 && <div className={styles.empty}><Users size={32}/><h3>{items.length ? (thai ? 'ไม่พบรายการที่ค้นหา' : 'No matching creators') : (thai ? 'กำลังเตรียมข้อมูลครีเอเตอร์' : 'Our creator collection is coming soon')}</h3>{items.length > 0 && <button onClick={() => { setQuery(''); setPlatform('all'); setCategory('all'); setGender('all'); }}>{thai ? 'ดูทั้งหมด' : 'Show all'}</button>}</div>}
      </div>
    </section>
    <section className={styles.services}><div className={`${styles.wrap} ${styles.servicesGrid}`}><div><p className={styles.eyebrow}>OUR SERVICE</p><h2>{thai ? <>บริการครบวงจร<br/>ด้าน Influencer Marketing</> : <>Full-service<br/>Influencer Marketing</>}</h2><p>{thai ? 'วางกลยุทธ์ คัดเลือกอินฟลูเอนเซอร์ ผลิตคอนเทนต์ และดูแลแคมเปญแบบครบวงจร เพื่อผลลัพธ์ที่วัดได้จริง' : 'From strategy and creator selection to content production and measurable results.'}</p><Link href="/contact" className={styles.primary}>{thai ? 'ปรึกษาแคมเปญกับเรา' : 'Plan your campaign'}<ArrowUpRight size={18}/></Link></div><div className={styles.serviceCards}>{[{icon:Target,title:'Strategy & Planning',th:'วางกลยุทธ์ให้เหมาะกับแบรนด์และกลุ่มเป้าหมาย',en:'Strategy built around your brand and audience.'},{icon:Users,title:'Influencer Selection',th:'คัดเลือกครีเอเตอร์ที่ใช่สำหรับแต่ละแคมเปญ',en:'The right creators for your campaign.'},{icon:Clapperboard,title:'Content Production',th:'ดูแลการผลิตคอนเทนต์ให้ตรงกับแบรนด์และแพลตฟอร์ม',en:'Content tailored to your brand and platform.'},{icon:ChartColumn,title:'Measure & Report',th:'สรุปผลและข้อมูลเพื่อพัฒนาแคมเปญต่อไป',en:'Insights to improve your next campaign.'}].map(service => <div key={service.title}><service.icon size={30}/><div><h3>{service.title}</h3><p>{thai ? service.th : service.en}</p></div></div>)}</div></div></section>
    <section className={styles.caseStudy}><Image src="/coverbrin.png" alt="" fill sizes="100vw"/><div className={styles.wrap}><div><p className={styles.eyebrow}>CASE STUDY</p><h2>{thai ? <>ผลงานที่สร้างจริง<br/>จากแบรนด์จริง</> : <>Real work.<br/>Real brands.</>}</h2></div><Link href="/services/influencer" aria-label={thai ? 'ดูผลงานแคมเปญ' : 'View campaigns'}><ArrowUpRight size={25}/></Link></div></section>
    <Footer showCta={false}/>

  </main>;
}
