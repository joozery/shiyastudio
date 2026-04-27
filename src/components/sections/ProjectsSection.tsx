"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from 'next-intl';

export const ProjectsSection = () => {
  const t = useTranslations('projects');
  const [projects, setProjects] = useState<any[]>([
    { title: "AETHER BRANDING", category: "IDENTITY / CONCEPT", image: "/project-1.png", description: "Reimagining modern minimalism for global luxury brands." },
    { title: "LUMINA DIGITAL", category: "MOTION / 3D SCULPT", image: "/project-2.png", description: "Creating liquid visual identities for futuristic ecosystems." },
    { title: "GENESIS CAMPAIGN", category: "PRODUCTION / AD", image: "/project-3.png", description: "High-octane commercial production with cinematic lens." }
  ]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data && data.projects && data.projects.length > 0) {
          setProjects(data.projects);
        }
      })
      .catch(err => console.error('Failed to load projects', err));
  }, []);

  return (
    <section className="relative w-full py-20 px-4 md:px-12 bg-black text-white font-sans overflow-hidden">
      
      {/* Removed Decorative vertical label */}

      <div className="max-w-7xl mx-auto flex flex-col gap-12 md:gap-24 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 text-left">
          <div className="flex flex-col gap-4 text-left">
             <div className="flex items-center gap-3">
               <div className="w-10 h-[1.5px] bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500">{t('label')}</span>
             </div>
             <h2 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase" dangerouslySetInnerHTML={{ __html: t('title') }} />
          </div>
          
          <div className="flex flex-col gap-2 max-w-xs md:text-right text-left">
             <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/20">{t('tagline')}</span>
             <p className="text-[10px] md:text-sm text-white/40 leading-relaxed font-medium">✨ Artisanal code meets digital curatorial precision.</p>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {projects.map((project, index) => (
            <div key={index} className="group cursor-pointer relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-zinc-900 border border-white/5 transition-all hover:scale-[1.02] hover:border-white/10 shadow-2xl">
              
              {/* Background Still Image */}
              <div className="absolute inset-0 z-0 text-left">
                {(project.image || project.coverImage) ? (
                  <Image 
                     src={project.image || project.coverImage} 
                     alt={project.title} 
                     fill 
                     className="object-cover transition-transform duration-1000 group-hover:scale-110 brightness-[0.85] group-hover:brightness-100"
                     suppressHydrationWarning
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <span className="text-white/10 text-[10px] font-black uppercase tracking-widest">No Image</span>
                  </div>
                )}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" 
                  suppressHydrationWarning
                />
              </div>

              {/* Project Info Overlay */}
              <div className="relative z-10 h-full w-full flex flex-col justify-end p-8 md:p-12 text-white">
                 <div className="flex flex-col gap-4 text-left">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{project.category}</span>
                    <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight uppercase group-hover:text-blue-400 transition-colors">{project.title}</h3>
                    <p className="text-[10px] md:text-sm text-white/40 leading-relaxed font-medium line-clamp-2 max-w-xs opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">{project.description}</p>
                 </div>
                 
                 <div className="absolute top-10 right-10 w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-4 group-hover:translate-y-0 transition-all duration-500 backdrop-blur-md hover:bg-white hover:text-black transition-colors">
                    <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8" />
                 </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 pointer-events-none bg-blue-600/5 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
    </section>
  );
};
