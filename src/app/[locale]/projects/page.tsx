"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowUpRight, Plus, Filter } from "lucide-react";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function ProjectsPage() {
  const t = useTranslations('all_projects');
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load projects', err);
        setLoading(false);
      });
  }, []);

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => (p.category || '').toLowerCase().includes(filter.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      <Navbar />

      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full -translate-y-1/2 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-32">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20">
          <div className="flex flex-col gap-6 max-w-2xl text-left">
            <div className="flex items-center gap-3">
               <div className="w-10 h-[1.5px] bg-blue-600" />
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500">Portfolio</span>
            </div>
            <h1 
              className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]"
              dangerouslySetInnerHTML={{ __html: t('title') }}
            />
            <p className="text-white/40 text-sm md:text-base font-medium max-w-md mt-4">
               {t('subtitle')}
            </p>
          </div>

          {/* Stats or Extra Info */}
          <div className="hidden lg:flex flex-col gap-2 text-right">
             <span className="text-[40px] font-black leading-none text-blue-600">50+</span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Successful Launches</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-16 border-b border-white/5 pb-8">
           {["all", "branding", "production", "content"].map((cat) => (
             <button 
               key={cat}
               onClick={() => setFilter(cat)}
               className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                 filter === cat 
                 ? "bg-white text-black border-white" 
                 : "bg-transparent text-white/40 border-white/10 hover:border-white/40"
               }`}
             >
               {cat === 'all' ? t('filter_all') : t(`filter_${cat}`)}
             </button>
           ))}
        </div>

        {/* Full Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12">
           {filteredProjects.map((project, idx) => (
             <Link key={project.id} href={`/projects/${project.slug}`}>
               <ProjectCard project={project} index={idx} buttonText={t('view_details')} />
             </Link>
           ))}
        </div>

      </div>

      <Footer />
    </main>
  );
}

function ProjectCard({ project, index, buttonText }: any) {
  return (
    <div className="group relative flex flex-col gap-6 cursor-pointer">
       {/* Image Container */}
       <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/5">
          <Image 
            src={project.coverImage || '/placeholder.png'} 
            alt={project.title} 
            fill 
            className="object-cover transition-transform duration-1000 group-hover:scale-110 brightness-[0.85] group-hover:brightness-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30" />
          
          {/* Hover Tag */}
          <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100 duration-500">
             <ArrowUpRight className="text-white" />
          </div>

          <div className="absolute bottom-8 left-8 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
             <span className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest">
                {buttonText}
             </span>
          </div>
       </div>

       {/* Project Info */}
       <div className="flex justify-between items-start px-4">
          <div className="flex flex-col gap-2 text-left">
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">{project.category}</span>
             <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter group-hover:text-blue-500 transition-colors">
                {project.title}
             </h3>
          </div>
          <span className="text-[10px] font-bold text-white/20 mt-2">{project.year}</span>
       </div>
    </div>
  );
}
