"use client";

import React, { use } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, ArrowUpRight, Calendar, Tag, User, Globe, Play, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";

const ALL_PROJECTS: any = {
  "aether-branding": {
    title: "Aether Branding",
    subtitle: "Reimagining the future of digital identity for the next generation.",
    cat: "Identity & Strategy",
    year: "2024",
    client: "Aether Dynamics",
    img: "/project-1.png",
    description: "A comprehensive brand overhaul for Aether Dynamics. We developed a visual language that speaks to both technical precision and human-centric design. The identity reflects a forward-thinking ethos with a focus on modularity and adaptability in a digital-first world.",
    challenge: "Developing a visual system that remains consistent across physical and digital mediums while maintaining a high-tech premium feel.",
    results: [
      { label: "Reach", val: "2.4M" },
      { label: "Recall", val: "+85%" },
      { label: "Growth", val: "30%" }
    ],
    media: [
      { type: "video", url: "https://cdn.pixabay.com/video/2021/04/12/70878-537443831_tiny.mp4", caption: "Brand Anthem Video" },
      { type: "image", url: "/project-1.png", caption: "Logo Construction & Grid" },
      { type: "image", url: "/project-2.png", caption: "Digital Assets Interface" },
      { type: "video", url: "https://cdn.pixabay.com/video/2022/05/23/117904-713210168_tiny.mp4", caption: "Motion Guidelines" },
      { type: "image", url: "/project-3.png", caption: "Physical Stationery Set" }
    ]
  },
  "lumina-digital": {
    title: "Lumina Digital",
    subtitle: "Next-gen digital production for interactive experiences.",
    cat: "Digital Production",
    year: "2024",
    client: "Lumina Co.",
    img: "/project-2.png",
    description: "Lumina Digital required a platform that matched their innovative 3D products. We produced a series of high-fidelity interactive assets and a cinematic production workflow that redefined their brand presence.",
    challenge: "Integrating high-performance 3D rendering with seamless web interaction without compromising speed.",
    results: [
       { label: "Speed", val: "+40%" },
       { label: "Engagement", val: "2x" },
       { label: "Impact", val: "High" }
    ],
    media: [
       { type: "video", url: "https://cdn.pixabay.com/video/2020/09/24/50172-460394348_tiny.mp4", caption: "3D Interaction Demo" },
       { type: "image", url: "/project-2.png", caption: "Core UI Elements" },
       { type: "image", url: "/service-production.png", caption: "Production Behind the Scenes" }
    ]
  }
};

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  const project = ALL_PROJECTS[slug] || ALL_PROJECTS["aether-branding"];

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-600/30 overflow-x-hidden">
      <Navbar />

      {/* Header Section - Refined & Compact */}
      <section className="pt-32 pb-16 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
         <div className="flex flex-col gap-8">
            <button 
              onClick={() => router.back()}
              className="group flex items-center gap-2 text-white/30 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em]"
            >
               <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
               Portfolio
            </button>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
               <div className="max-w-3xl">
                  <div className="flex items-center gap-3 mb-6">
                     <span className="h-[1px] w-8 bg-blue-600" />
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">{project.cat}</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                     {project.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/40 font-medium leading-relaxed max-w-2xl">
                     {project.subtitle}
                  </p>
               </div>
               
               <div className="flex gap-12 border-l border-white/10 pl-12 py-2">
                  <div className="flex flex-col gap-1">
                     <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Client</span>
                     <span className="text-xs font-bold uppercase">{project.client}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Year</span>
                     <span className="text-xs font-bold uppercase">{project.year}</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Hero Media - 60vh Height */}
      <section className="relative h-[65vh] w-full mx-auto px-4 md:px-8">
         <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-white/5">
            {project.media[0].type === "video" ? (
               <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                  <source src={project.media[0].url} type="video/mp4" />
               </video>
            ) : (
               <Image src={project.media[0].url} alt={project.title} fill className="object-cover" priority />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
         </div>
      </section>

      {/* Content & Intelligence Grid */}
      <section className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
         <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">The Narrative</h3>
               <p className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed">
                  {project.description}
               </p>
            </div>
            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Creative Strategy</h4>
               <p className="text-base text-white/50 leading-relaxed font-medium">
                  {project.challenge}
               </p>
            </div>
         </div>

         <div className="lg:col-span-5">
            <div className="sticky top-32 p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm space-y-10">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Performance Metrics</h4>
               <div className="grid grid-cols-1 gap-8">
                  {project.results.map((res: any, i: number) => (
                    <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4">
                       <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{res.label}</span>
                       <span className="text-4xl font-black text-blue-500">{res.val}</span>
                    </div>
                  ))}
               </div>
               <Link 
                 href="/contact"
                 className="flex items-center justify-between w-full p-6 mt-8 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all group"
               >
                  Start your project <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </Link>
            </div>
         </div>
      </section>

      {/* Immersive Gallery Section */}
      <section className="pb-32 px-4 md:px-8 space-y-8">
         <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
            <div className="space-y-4">
               <h3 className="text-4xl font-black uppercase tracking-tighter">Visual Showcase</h3>
               <p className="text-white/30 text-xs font-bold uppercase tracking-widest">A curated walk through the creative process.</p>
            </div>
            <span className="text-[40px] font-black text-white/5">01 - {project.media.length}</span>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1600px] mx-auto">
            {project.media.slice(1).map((item: any, i: number) => (
               <div 
                 key={i} 
                 className={`relative overflow-hidden rounded-[2.5rem] border border-white/5 group bg-zinc-900 ${
                   i === 1 ? "md:row-span-2 h-full min-h-[600px]" : "h-[450px]"
                 }`}
               >
                  {item.type === "video" ? (
                    <div className="relative w-full h-full">
                       <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-700">
                          <source src={item.url} type="video/mp4" />
                       </video>
                       <div className="absolute top-8 left-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play size={10} fill="white" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Live Motion</span>
                       </div>
                    </div>
                  ) : (
                    <Image 
                      src={item.url} 
                      alt={item.caption} 
                      fill 
                      className="object-cover brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000" 
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-8 left-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                     <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Concept {i+2}</p>
                     <p className="text-sm font-bold uppercase">{item.caption}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Next Project Teaser */}
      <section className="py-40 bg-zinc-950 border-y border-white/5">
         <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Next Project</span>
            <Link href="/projects/lumina-digital" className="block group">
               <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter group-hover:text-blue-600 transition-colors duration-500">Lumina Digital</h2>
            </Link>
            <div className="flex justify-center gap-4">
               <Link href="/projects" className="text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  View Full Portfolio <Maximize2 size={12} />
               </Link>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
