"use client";

import React, { useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChevronLeft, ChevronRight, Play, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "@/navigation";
import { useParams } from "next/navigation";
import { useProjectsMotion } from "@/components/sections/useProjectsMotion";
import styles from "./Service.module.css";

interface GalleryItem {
  id: number;
  type: "VIDEO" | "PHOTO";
  image: string;
  duration?: string;
  videoUrl?: string;
  influencer?: { username: string; platform: string };
}

interface Project {
  id: string;
  brand: string;
  campaign: string;
  category?: string;
  coverImage: string;
  isVideo?: boolean;
  gallery?: GalleryItem[];
  logoText?: string;
}

function CampaignRow({ project, slug }: { project: Project; slug: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragged = useRef(false);
  const slide = (direction: number) => scrollRef.current?.scrollBy({ left: direction * 460, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });

  const images: GalleryItem[] = project.gallery && project.gallery.length > 0
    ? project.gallery
    : [{ id: 0, type: "PHOTO", image: project.coverImage }];

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragged.current = false;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 8) dragged.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className={`${styles.row} group`}>
      {/* Left: Brand info */}
      <div className={styles.info}>
        <div className="flex items-center gap-2">
          <h3 className="text-white font-black text-lg md:text-xl leading-tight tracking-tight">
            {project.brand}
          </h3>
          {project.isVideo && (
            <div className="w-5 h-5 shrink-0 bg-white rounded-full flex items-center justify-center">
              <Play className="w-2 h-2 text-black ml-0.5 fill-black" />
            </div>
          )}
        </div>
        <p className="text-white/40 text-xs mt-1.5 leading-relaxed">
          {project.campaign === "New Campaign" ? "" : project.campaign}
        </p>
        {project.category && project.category.toLowerCase() !== "category" && (
          <span className="mt-3 inline-block text-[9px] font-bold tracking-widest text-[#0EA5E9] uppercase border border-[#0EA5E9]/30 px-2 py-0.5 self-start">
            {project.category}
          </span>
        )}
        <Link
          href={`/services/${slug}/${project.id}`}
          className="mt-4 text-[10px] font-bold tracking-widest text-white/30 hover:text-[#0EA5E9] transition-colors uppercase flex items-center gap-1 group/link"
        >
          View Project
          <span className="transition-transform group-hover/link:translate-x-1">→</span>
        </Link>
        <div className={styles.controls}><button aria-label={`Previous content: ${project.brand}`} onClick={() => slide(-1)}><ChevronLeft size={18}/></button><button aria-label={`Next content: ${project.brand}`} onClick={() => slide(1)}><ChevronRight size={18}/></button><span>{images.length} CONTENTS</span></div>
      </div>

      {/* Right: Horizontal scrollable gallery */}
      <div
        ref={scrollRef}
        data-lenis-prevent-horizontal
        className={`${styles.track} scrollbar-hide cursor-grab active:cursor-grabbing select-none`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="flex gap-3 w-max pr-4">
          {images.map((item, idx) => {
            const isVidUrl = (u?: string) => !!u && /\.(mp4|mov|webm|m4v)(\?|$)/i.test(u);
            const thumb = (item.image && !isVidUrl(item.image)) ? item.image : '';
            const isVideoItem = item.type === "VIDEO" || isVidUrl(item.image) || !!item.videoUrl;
            return (
              <Link
                key={item.id ?? idx}
                href={`/services/${slug}/${project.id}`}
                className={`${styles.card} group/card`}
                onClick={event => { if (dragged.current) event.preventDefault(); }}
                draggable={false}
              >
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={project.brand}
                    fill
                    sizes="(max-width: 600px) 180px, 230px"
                    className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    {isVideoItem ? <Play className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
                  </div>
                )}
                <div className={`${styles.shade} absolute inset-0 pointer-events-none`} />

                {isVideoItem && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-2.5 h-2.5 text-black ml-0.5 fill-black" />
                    </div>
                    {item.duration && (
                      <span className="text-white text-[10px] font-bold tracking-wider">{item.duration}</span>
                    )}
                  </div>
                )}

                {item.influencer && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[9px] font-bold tracking-wider text-white/70 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-sm">
                      {item.influencer.platform}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ServicePageClient({ serviceInfo }: { serviceInfo: { title: string; description: string; image: string } }) {
  const params = useParams();
  const slug = params.slug as string;
  const page = useRef<HTMLElement>(null);

  const [activeCategory, setActiveCategory] = useState("ALL WORKS");
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(["ALL WORKS"]);
  const [loading, setLoading] = useState(true);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    const controller = new AbortController();
    fetch("/api/service-works", { signal: controller.signal })
      .then(res => { if (!res.ok) throw new Error("Works unavailable"); return res.json(); })
      .then(worksData => {
        if (controller.signal.aborted) return;
        const works: Project[] = worksData?.services?.[slug] || [];
        setProjects(works);

        const cats = ["ALL WORKS"];
        works.forEach((w) => {
          if (w.category && w.category.toLowerCase() !== "category" && !cats.includes(w.category.toUpperCase())) {
            cats.push(w.category.toUpperCase());
          }
        });
        setCategories(cats);

        setLoading(false);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.error(err);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [slug]);

  useProjectsMotion(page, `${slug}-${loading}`);

  const filteredProjects =
    activeCategory === "ALL WORKS"
      ? projects
      : projects.filter((p) => (p.category || "").toUpperCase() === activeCategory);

  return (
    <main ref={page} className="min-h-screen font-sans selection:bg-[#0EA5E9] selection:text-black bg-[#050505] text-white">
      <Navbar overlay />

      <section data-project-hero className={styles.hero} aria-labelledby="service-heading">
        {serviceInfo.image && <Image src={serviceInfo.image} alt="" fill sizes="100vw" priority className={styles.heroImage} />}
        <div className={styles.heroShade} />
        <motion.div className={styles.heroContent} initial={reducedMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          <p className={styles.heroEyebrow}><span className={styles.dot} />SHIYA STUDIO / SERVICES</p>
          <h1 id="service-heading">{serviceInfo.title}</h1>
          <p>{serviceInfo.description}</p>
          <a href="#service-works" className={styles.heroLink}>{slug === 'influencer' ? 'Explore our campaigns' : 'Explore our work'}<ChevronRight size={17}/></a>
        </motion.div>
        <span className={styles.heroIndex}>01 / {String(projects.length).padStart(2, '0')} PROJECTS</span>
      </section>

      <div className={styles.pageContent}>

        {/* Header */}
        <div id="service-works" className={styles.heading}>
          <div className="flex items-center gap-2 text-[#0EA5E9] font-bold text-xs tracking-widest mb-4 uppercase">
            <span className={styles.dot}/>
            <span>Selected work</span>
          </div>
          <h2 className={styles.title}>Campaigns & Projects</h2>
          <p className="text-white/60 text-base md:text-lg max-w-2xl leading-relaxed">
            {serviceInfo.description}
          </p>
        </div>

        <div className={styles.divider} />

        {/* Filter Tabs */}
        <div className={styles.filters}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                aria-pressed={isActive}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-sm text-[10px] md:text-xs font-bold tracking-wider transition-all duration-300 ${
                  isActive
                    ? "border border-[#0EA5E9] text-[#0EA5E9] bg-transparent"
                    : "border border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Campaign list */}
        {loading ? (
          <div className="py-20 flex justify-center text-white/50">Loading works...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 flex justify-center text-white/50">No works found.</div>
        ) : (
          <div className="mt-4">
            {filteredProjects.map((project) => (
              <CampaignRow key={project.id} project={project} slug={slug} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
