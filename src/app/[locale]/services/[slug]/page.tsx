"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowUpRight, CheckCircle2, Play, Camera, Zap, Globe, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

const SERVICE_DATA: Record<string, any> = {
  "influencer": {
    id: "influencer",
    tKey: "influencer",
    title: "Influencer/KOL",
    icon: <Zap className="w-6 h-6" />,
    image: "/service-influencer.png",
    accent: "blue",
    projects: [
      { title: "Siam Discovery Campaign", category: "Micro Influencer", image: "/project-1.png" },
      { title: "TikTok Commerce Live", category: "Social Commerce", image: "/project-2.png" },
    ]
  },
  "production": {
    id: "production",
    tKey: "production",
    title: "Production",
    icon: <Camera className="w-6 h-6" />,
    image: "/service-production.png",
    accent: "blue",
    projects: [
      { title: "Genesis Brand Film", category: "Cinematic", image: "/project-3.png" },
      { title: "Horizon TVC", category: "Production", image: "/project-1.png" },
    ]
  },
  "graphic-design": {
    id: "graphic-design",
    tKey: "graphic",
    title: "Graphic Design",
    icon: <ImageIcon className="w-6 h-6" />,
    image: "/service-graphic.png",
    accent: "blue",
    projects: [
      { title: "Aurora Visual ID", category: "Identity", image: "/project-graphic-1.png" },
      { title: "Minimalist Packaging", category: "Package", image: "/project-1.png" },
    ]
  },
  "vdo-motion": {
    id: "vdo-motion",
    tKey: "motion",
    title: "VDO Motion",
    icon: <Play className="w-6 h-6" />,
    image: "/service-motion.png",
    accent: "blue",
    projects: [
      { title: "Lumina 3D Logo", category: "Motion", image: "/project-2.png" },
      { title: "Future Tech Motion", category: "Visual", image: "/project-3.png" },
    ]
  },
  "mix-master-music": {
    id: "mix-master-music",
    tKey: "music",
    title: "Mix master Music",
    icon: <Globe className="w-6 h-6" />,
    image: "/service-music.png",
    accent: "blue",
    projects: [
      { title: "Synthetic Echoes", category: "Sound Design", image: "/project-music-1.png" },
      { title: "Vocal Mastering", category: "Mastering", image: "/project-music-2.png" },
    ]
  }
};

export default function ServicePage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations('services');
  const navT = useTranslations('nav');
  
  // Find data by slug (handling potential key mismatch)
  const serviceKey = Object.keys(SERVICE_DATA).find(key => key === slug) || "influencer";
  const data = SERVICE_DATA[serviceKey];

  return (
    <main className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-20 px-4 md:px-12 flex flex-col items-center">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-600/10 blur-[150px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
           {/* Breadcrumb */}
           <div className="flex items-center gap-2 mb-10 opacity-40">
              <Link href="/" className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">{navT('home')}</Link>
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">{data.title}</span>
           </div>

           <h1 className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-center mb-12">
              {data.title.split('/').map((part: string, i: number) => (
                <React.Fragment key={i}>
                  {part} {i === 0 && data.title.includes('/') && <br className="hidden md:block" />}
                </React.Fragment>
              ))}
           </h1>

           <div className="relative w-full aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl mb-12">
              <Image 
                src={data.image} 
                alt={data.title} 
                fill 
                className="object-cover brightness-75"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
           </div>

           {/* Content Grid */}
           <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 items-start w-full">
              <div className="md:col-span-7 flex flex-col gap-8 text-left">
                 <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                    Premium <span className="text-blue-600">{data.title}</span> Solutions
                 </h2>
                 <p className="text-base md:text-xl text-white/60 leading-relaxed">
                    {t(`${data.tKey}.desc`)} 
                    Elevate your brand presence with our specialized expertise in {data.title}. We combine creative vision with technical precision to deliver high-impact results that resonate with your target audience.
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    {[
                      "Strategic Approach",
                      "Professional Execution",
                      "Premium Quality Assets",
                      "Creative Direction",
                      "Result-Oriented",
                      "Cross-Platform Mastery"
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                         <CheckCircle2 className="text-blue-500 w-5 h-5 flex-shrink-0" />
                         <span className="text-sm font-bold uppercase tracking-widest text-white/80">{feature}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="md:col-span-5 flex flex-col gap-10">
                 <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                    <h3 className="text-xl font-bold uppercase tracking-widest mb-6">Start your journey</h3>
                    <p className="text-sm text-white/40 mb-8 leading-relaxed">
                       Ready to transform your brand with our {data.title} service? Our team is ready to help you craft something extraordinary.
                    </p>
                    <Link href="/contact" className="w-full py-4 bg-blue-600 rounded-full flex items-center justify-center gap-3 group hover:bg-white hover:text-black transition-all">
                       <span className="text-xs font-black uppercase tracking-widest">Connect with us</span>
                       <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-12" />
                    </Link>
                 </div>

                 <div className="flex flex-col gap-6 text-left">
                    <div className="flex items-center gap-3 text-blue-500">
                       <div className="w-10 h-[1.5px] bg-blue-500" />
                       <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Next Service</span>
                    </div>
                    <Link href="/services" className="group flex flex-col gap-2">
                       <span className="text-2xl font-black uppercase tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity">Explore More</span>
                       <ArrowUpRight className="w-8 h-8 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-blue-500" />
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Selected Works Section */}
      <section className="w-full py-24 px-4 md:px-12 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
              <div className="text-left">
                 <div className="flex items-center gap-3 text-blue-500 mb-4">
                    <div className="w-10 h-[1.5px] bg-blue-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Portfolio</span>
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Selected Works</h2>
              </div>
              <Link href="/projects" className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">
                 View All Projects <ArrowUpRight className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {data.projects.map((project: any, idx: number) => (
                <div key={idx} className="group cursor-pointer">
                   <div className="relative w-full aspect-[16/10] rounded-[2rem] overflow-hidden mb-6">
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                      <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center">
                            <ArrowUpRight className="w-6 h-6" />
                         </div>
                      </div>
                   </div>
                   <div className="flex justify-between items-start text-left">
                      <div>
                         <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 mb-2 block">{project.category}</span>
                         <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight group-hover:text-blue-500 transition-colors">{project.title}</h3>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/4 translate-y-1/4" />

      <Footer />
    </main>
  );
}
