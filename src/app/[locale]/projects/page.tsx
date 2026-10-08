"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowUpRight, ArrowRight, Search, X, Play, FolderOpen, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { useProjectsMotion } from "@/components/sections/useProjectsMotion";
import styles from "./Projects.module.css";

interface Project {
  id: string | number;
  brand?: string;
  title?: string;
  coverImage?: string;
  heroImage?: string;
  description?: string;
  about?: string;
  campaign?: string;
  gallery?: { image?: string; type?: string; videoUrl?: string }[];
  category?: string;
  year?: string | number;
  serviceSlug: string;
}
interface Service { slug: string; title: string }
interface WorksResponse { services?: Record<string, Omit<Project, 'serviceSlug'>[]> }

export default function ProjectsPage() {
  const t = useTranslations("all_projects");
  const pageRef = useRef<HTMLElement>(null);
  const thai = useLocale() === "th";
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadProjects() {
      try {
        const [worksResponse, servicesResponse] = await Promise.all([
          fetch('/api/service-works', { signal: controller.signal }),
          fetch('/api/services', { signal: controller.signal }),
        ]);
        if (!worksResponse.ok || !servicesResponse.ok) throw new Error('Projects unavailable');
        const [worksData, servicesData]: [WorksResponse, { services?: Service[] }] = await Promise.all([worksResponse.json(), servicesResponse.json()]);
        const works = Object.entries(worksData.services ?? {}).flatMap(([serviceSlug, items]) => Array.isArray(items) ? items.map(item => ({ ...item, serviceSlug })) : []);
        if (controller.signal.aborted) return;
        setProjects(works);
        setServices(servicesData.services ?? []);
        setError(false);
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadProjects();
    return () => controller.abort();
  }, [attempt]);

  const filteredProjects = projects.filter(project => {
    const matchesService = filter === 'all' || project.serviceSlug === filter;
    const serviceTitle = services.find(service => service.slug === project.serviceSlug)?.title ?? '';
    const searchable = [project.brand, project.title, project.category, serviceTitle].filter(Boolean).join(' ').toLocaleLowerCase();
    return matchesService && searchable.includes(search.trim().toLocaleLowerCase());
  });
  useProjectsMotion(pageRef, `${loading}-${filter}-${search}-${filteredProjects.length}`);
  const activeService = services.find(service => service.slug === filter);
  const retry = () => { setLoading(true); setError(false); setAttempt(value => value + 1); };
  const filterStyle = (active: boolean) => `inline-flex min-h-11 shrink-0 items-center gap-2 border-b px-1 py-2 text-[10px] uppercase tracking-[0.09em] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${active ? 'border-[#0085ff] text-[#0085ff]' : 'border-transparent text-white/55 hover:border-blue-400 hover:text-white'}`;

  return (
    <main ref={pageRef} className="min-h-screen bg-black text-white">
      <Navbar overlay />
      <section data-project-hero aria-labelledby="projects-heading" className={`${styles.hero} relative isolate overflow-hidden bg-black`}>
        <Image src="/service-production.png" alt="" fill sizes="100vw" preload className={`${styles.heroVisual} -z-20 object-cover object-[70%_45%] grayscale`} />
        <div className={`${styles.heroShade} absolute inset-0 -z-10`} />
        <div className={`${styles.heroContent} mx-auto max-w-[1600px] px-6 pb-10 pt-32 md:px-10 md:pb-12 md:pt-40 lg:px-16`}>
          <p className="mb-5 flex items-center gap-3 text-xs font-medium tracking-[0.16em] text-[#28a5ff]"><span className="size-2 rounded-full bg-[#0085ff]" />OUR PROJECTS</p>
          <h1 id="projects-heading" className={`${styles.heroTitle} max-w-4xl font-bold tracking-tight`}>SELECTED<br /><span className="text-[#0085ff]">PROJECTS</span></h1>
          <p className="mt-5 max-w-md text-base leading-[1.6] text-white/70 md:text-xl">{thai ? <>ผลงานที่เกิดจากไอเดีย<br />และสร้างผลลัพธ์ให้กับแบรนด์</> : <>Ideas made real.<br />Meaningful results for brands.</>}</p>
        </div>
      </section>

      <section id="project-gallery" aria-labelledby="gallery-heading" className="scroll-mt-24">
        <div className="mx-auto max-w-[1600px] px-6 pb-14 md:px-10 md:pb-20 lg:px-16">
          <h2 id="gallery-heading" className="sr-only">{filter === 'all' ? t('filter_all') : activeService?.title ?? filter}</h2>
          <div className="mb-6 flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div role="group" aria-label={thai ? 'กรองผลงานตามบริการ' : 'Filter projects by service'} className="scrollbar-hide flex min-w-0 gap-5 overflow-x-auto pb-2">
              <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')} className={filterStyle(filter === 'all')}>{thai ? 'ทั้งหมด' : 'All'}</button>
              {services.map(service => <button key={service.slug} type="button" aria-pressed={filter === service.slug} onClick={() => setFilter(service.slug)} className={filterStyle(filter === service.slug)}>{service.title}</button>)}
            </div>
            <div role="search" className="flex h-11 w-full shrink-0 items-center gap-3 rounded-full border border-white/20 px-4 focus-within:border-blue-400 xl:w-64">
              <Search size={17} className="shrink-0 text-white/60" /><label htmlFor="project-search" className="sr-only">{thai ? 'ค้นหาผลงาน' : 'Search projects'}</label><input id="project-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={thai ? 'ค้นหาผลงาน…' : 'Search projects…'} className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45 [&::-webkit-search-cancel-button]:appearance-none" />{search ? <button type="button" aria-label={thai ? 'ล้างคำค้นหา' : 'Clear search'} onClick={() => setSearch('')} className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-white/10"><X size={16} /></button> : <ArrowRight size={17} aria-hidden="true" className="text-white/40" />}
            </div>
          </div>
          <p aria-live="polite" className="sr-only">{loading ? (thai ? 'กำลังโหลดผลงาน…' : 'Loading projects…') : error ? '' : thai ? `${filteredProjects.length} ผลงาน` : `${filteredProjects.length} projects`}</p>

          {loading ? <div aria-busy="true" aria-label={thai ? 'กำลังโหลดผลงาน' : 'Loading projects'} className="grid gap-8 md:grid-cols-2">{[0, 1, 2, 3].map(index => <div key={index} aria-hidden="true" className="animate-pulse motion-reduce:animate-none"><div className="aspect-[16/10] rounded-xl bg-white/10" /><div className="mt-5 h-3 w-28 rounded bg-white/10" /><div className="mt-3 h-6 w-2/3 rounded bg-white/10" /></div>)}</div> : error ? <div role="alert" className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center"><FolderOpen size={32} className="mx-auto mb-4 text-blue-500" /><h3 className="text-xl font-medium">{thai ? 'ยังโหลดผลงานไม่ได้' : 'Projects could not be loaded.'}</h3><p className="mt-3 text-sm text-white/55">{thai ? 'กรุณาลองใหม่อีกครั้ง' : 'Please try again.'}</p><button type="button" onClick={retry} className="mx-auto mt-6 inline-flex min-h-11 items-center gap-3 rounded-full bg-blue-600 px-6 text-sm text-white hover:bg-blue-700"><RotateCcw size={16} />{thai ? 'ลองอีกครั้ง' : 'Try again'}</button></div> : filteredProjects.length ? <div className="space-y-6 md:space-y-8">
            {filteredProjects.map((project, index) => <ProjectScene key={`${project.serviceSlug}-${project.id}`} project={project} serviceTitle={services.find(service => service.slug === project.serviceSlug)?.title} index={index} total={filteredProjects.length} buttonText={t('view_details')} thai={thai} />)}
          </div> : <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center"><FolderOpen size={32} className="mx-auto mb-4 text-blue-500" /><h3 className="text-xl font-medium">{search ? (thai ? 'ไม่พบผลงานที่ค้นหา' : 'No matching projects.') : (thai ? 'ยังไม่มีผลงานในหมวดนี้' : 'No projects in this category yet.')}</h3><p className="mt-3 text-sm text-white/55">{thai ? 'ลองเลือกบริการอื่น หรือดูผลงานทั้งหมด' : 'Explore another category or view all work.'}</p>{(filter !== 'all' || search) && <button type="button" onClick={() => { setFilter('all'); setSearch(''); }} className="mt-5 min-h-11 text-sm font-medium text-blue-600">{t('filter_all')}<span aria-hidden="true"> ↗</span></button>}</div>}
        </div>
      </section>

      <section aria-labelledby="project-cta-heading" className="relative isolate overflow-hidden bg-[#030910]">
        <Image src="/cover33.png" alt="" fill sizes="100vw" className="-z-20 object-cover object-[75%_center]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#02070ff2_0%,#031229cc_45%,#00000033_100%)]" />
        <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24 lg:px-16"><p className="mb-5 flex items-center gap-3 text-xs font-medium tracking-[0.14em] text-[#28a5ff]"><span className="size-2 rounded-full bg-[#0085ff]" />LET’S CREATE TOGETHER</p><h2 id="project-cta-heading" className="text-[clamp(2.25rem,4.6vw,4.5rem)] font-bold leading-[1.05] tracking-tight">YOUR BRAND<br />COULD BE <span className="text-[#0085ff]">NEXT.</span></h2><p className="mt-5 text-lg text-white/70 md:text-2xl">{thai ? 'มาสร้างผลงานต่อไปด้วยกัน' : 'Let’s create the next story together.'}</p><Link href="/contact" className="mt-7 inline-flex min-h-12 items-center gap-8 rounded-full bg-[#0085ff] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500">{thai ? 'เริ่มโปรเจกต์กับเรา' : 'Start a project'}<ArrowUpRight size={18} /></Link></div>
      </section>
      <Footer showCta={false} />
    </main>
  );
}

function ProjectScene({ project, serviceTitle, index, total, buttonText, thai }: { project: Project; serviceTitle?: string; index: number; total: number; buttonText: string; thai: boolean }) {
  const title = project.brand || project.title || (thai ? 'ผลงานของเรา' : 'Our project');
  const category = project.category?.trim().toLowerCase() === 'category' ? undefined : project.category;
  const photo = project.gallery?.find(item => item.image && item.type === 'PHOTO')?.image;
  const image = project.heroImage || photo || project.coverImage;
  const preview = project.gallery?.find(item => item.image && item.type === 'VIDEO' && item.image !== image && item.image !== project.coverImage);
  const description = project.description || (project.about && !/about this project|no description/i.test(project.about) ? project.about : undefined);
  const href = `/services/${project.serviceSlug}/${project.id}`;
  return (
    <article data-project-scene className={`${styles.scene} relative md:pr-10`}>
      <div className={`${styles.panel} relative isolate min-h-[460px] overflow-hidden rounded-lg bg-[#0a0d12] md:min-h-[480px]`}>
        {image ? <div className={`${styles.visual} absolute inset-0`}><Image src={image} alt={title} fill sizes="(max-width: 768px) 90vw, 90vw" loading={index < 2 ? 'eager' : 'lazy'} className="object-cover" /></div> : <Image src="/logo/logo.png" alt="" fill sizes="90vw" className="object-contain p-16" />}
        <div className={`${styles.panelShade} absolute inset-0`} />
        <div className={`${styles.content} relative z-10 flex min-h-[460px] max-w-2xl flex-col items-start px-6 py-8 md:min-h-[480px] md:px-9 md:py-10`}>
          <span aria-hidden="true" className="mb-4 text-3xl font-light tracking-tight text-white/35 md:text-4xl">{String(index + 1).padStart(2, '0')}</span>
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.14em] text-blue-300">{serviceTitle || category || project.serviceSlug}</p>
          <h3 className={`${styles.sceneTitle} max-w-xl break-words font-semibold leading-[1.05] tracking-tight`}>{title}</h3>
          {description && <p className="mt-5 max-w-xs line-clamp-3 text-sm leading-6 text-white/75">{description}</p>}
          <Link href={href} aria-label={`${buttonText}: ${title}`} className="mt-6 inline-flex min-h-11 items-center gap-4 border-b border-white/25 text-xs font-medium tracking-[0.08em] transition-colors hover:border-blue-400 hover:text-blue-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400">{buttonText}<span className="flex size-6 items-center justify-center rounded-full border border-white/40"><ArrowRight size={14} /></span></Link>
          {preview?.image && <Link href={href} aria-label={`${thai ? 'ดูเนื้อหาผลงาน' : 'View project content'}: ${title}`} className="relative mt-auto block h-20 w-36 overflow-hidden rounded-lg border border-white/20 bg-black/20 md:h-24 md:w-44"><Image src={preview.image} alt="" fill sizes="176px" className="object-cover" /><span className="absolute inset-0 flex items-center justify-center bg-black/25">{preview.type === 'VIDEO' ? <span className="flex size-8 items-center justify-center rounded-full border border-white"><Play size={14} /></span> : <ArrowUpRight size={24} />}</span></Link>}
        </div>
      </div>
      <div aria-hidden="true" className="absolute bottom-8 right-0 top-8 hidden w-5 flex-col items-center gap-3 md:flex"><span className={`${styles.railNumber} text-[10px] text-white/50`}>{String(index + 1).padStart(2, '0')}</span><div className="relative w-px flex-1 bg-white/20"><div className={`${styles.railFill} absolute inset-0 bg-[#0085ff]`} /></div><span className="text-[10px] text-white/30">{String(total).padStart(2, '0')}</span></div>
    </article>
  );
}
