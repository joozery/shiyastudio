"use client";

import React, { useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Play, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Link } from "@/navigation";
import { useParams } from "next/navigation";

interface GalleryItem {
  id: number;
  type: "VIDEO" | "PHOTO";
  image: string;
  duration?: string;
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

  const images: GalleryItem[] = project.gallery && project.gallery.length > 0
    ? project.gallery
    : [{ id: 0, type: "PHOTO", image: project.coverImage }];

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="flex border-b border-white/8 py-8 gap-0 group">
      {/* Left: Brand info */}
      <div className="w-[200px] md:w-[240px] shrink-0 pr-8 flex flex-col justify-start pt-1">
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
          {project.campaign}
        </p>
        {project.category && (
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
      </div>

      {/* Right: Horizontal scrollable gallery */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="flex gap-3 w-max pr-4">
          {images.map((item, idx) => {
            const isVidUrl = (u?: string) => !!u && /\.(mp4|mov|webm|m4v)(\?|$)/i.test(u);
            const thumb = (item.image && !isVidUrl(item.image)) ? item.image : '';
            const isVideoItem = item.type === "VIDEO" || isVidUrl(item.image) || !!(item as any).videoUrl;
            return (
              <Link
                key={item.id ?? idx}
                href={`/services/${slug}/${project.id}`}
                className="relative shrink-0 overflow-hidden bg-[#111] group/card"
                style={{ width: isVideoItem ? "220px" : "200px", height: "260px", borderRadius: "4px" }}
                draggable={false}
              >
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={project.brand}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    {isVideoItem ? <Play className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

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

export default function ServicePageClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [activeCategory, setActiveCategory] = useState("ALL WORKS");
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(["ALL WORKS"]);
  const [loading, setLoading] = useState(true);
  const [serviceInfo, setServiceInfo] = useState<{ title: string; description: string }>({
    title: slug,
    description: 'Explore our selected projects and campaigns.',
  });

  React.useEffect(() => {
    Promise.all([
      fetch("/api/service-works").then((res) => res.json()),
      fetch("/api/services").then((res) => res.json()),
    ])
      .then(([worksData, servicesRes]) => {
        const works: Project[] = worksData?.services?.[slug] || [];
        setProjects(works);

        const cats = ["ALL WORKS"];
        works.forEach((w) => {
          if (w.category && !cats.includes(w.category.toUpperCase())) {
            cats.push(w.category.toUpperCase());
          }
        });
        setCategories(cats);

        const dbServices = servicesRes.services || [];
        const currentService = dbServices.find((s: any) => s.slug === slug);
        if (currentService) {
          setServiceInfo({ title: currentService.title, description: currentService.description });
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const filteredProjects =
    activeCategory === "ALL WORKS"
      ? projects
      : projects.filter((p) => (p.category || "").toUpperCase() === activeCategory);

  return (
    <main className="min-h-screen font-sans selection:bg-[#0EA5E9] selection:text-black bg-[#050505] text-white">
      <Navbar />

      <div className="pt-32 px-6 md:px-12 max-w-[1400px] mx-auto min-h-[80vh] pb-24 animate-in fade-in duration-500">

        {/* Header */}
        <div className="mb-12 pt-8">
          <div className="flex items-center gap-2 text-[#0EA5E9] font-bold text-xs tracking-widest mb-4 uppercase">
            <span>&gt;</span>
            <span>Services</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 uppercase">
            {serviceInfo.title}
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-2xl leading-relaxed">
            {serviceInfo.description}
          </p>
        </div>

        <div className="w-full h-px bg-white/10 mb-12" />

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
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
