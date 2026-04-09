"use client";

import React from "react";
import { Play } from "lucide-react";
import Image from "next/image";

const ITEMS = [
  { id: 1, img: "/project-1.png", author: "@aomiws", size: "tall" },
  { id: 2, img: "/project-2.png", author: "@cchanatt", size: "medium" },
  { id: 3, img: "/project-3.png", author: "@khunkooktayada", size: "tall" },
  { id: 4, img: "/service-production.png", author: "@shiya.studio", size: "large" },
  { id: 5, img: "/service-motion.png", author: "@expert.th", size: "medium" },
  { id: 6, img: "/service-influencer.png", author: "@lifestyle.th", size: "tall" },
];

const CATEGORIES = [
  "Influencer campaign",
  "Influencer commerce",
  "Always-on KOL campaign",
  "Live commerce",
  "Affiliate marketing"
];

export const InfluencerSection = () => {
  return (
    <section className="relative w-full py-24 bg-black text-white overflow-hidden font-sans">
      
      {/* Enhanced Styles for ultra-smooth scrolling */}
      <style jsx>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-scroll-up {
          animation: scrollUp 60s linear infinite;
        }
        .animate-scroll-down {
          animation: scrollDown 65s linear infinite;
        }
        .animate-scroll-up-fast {
          animation: scrollUp 55s linear infinite;
        }
        .animate-scroll-down-fast {
          animation: scrollDown 58s linear infinite;
        }
      `}</style>

      {/* Heading Block */}
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-10 mb-20 px-6">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.3em] leading-tight">
          INFLUENCER MARKETING<br />& COMMERCE
        </h2>

        {/* Categories / Pills */}
        <div className="flex flex-wrap justify-center gap-3">
           {CATEGORIES.map((cat, idx) => (
             <button 
               key={cat}
               className={`px-6 py-2 rounded-full border text-[9px] font-bold uppercase tracking-widest transition-all ${
                 idx === 0
                 ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                 : "bg-transparent text-white/40 border-white/10 hover:border-white/40"
               }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {/* Scrolling Grid Area with Deep Fading Masks */}
      <div className="relative h-[900px] w-full max-w-[1900px] mx-auto overflow-hidden">
        
        {/* Top Fade Overlay - Deep Softness */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-black via-black/80 via-black/40 to-transparent z-20 pointer-events-none" />
        
        {/* Bottom Fade Overlay - Deep Softness */}
        <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-black via-black/80 via-black/40 to-transparent z-20 pointer-events-none" />

        {/* Side Fades (Subtle) */}
        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none hidden md:block" />
        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none hidden md:block" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-20 h-full opacity-80">
          
          {/* Column 1: Scroll UP */}
          <div className="flex flex-col gap-4 animate-scroll-up">
             <ScrollColumn items={[...ITEMS, ...ITEMS]} />
          </div>

          {/* Column 2: Scroll DOWN */}
          <div className="flex flex-col gap-4 animate-scroll-down">
             <ScrollColumn items={[...ITEMS.slice().reverse(), ...ITEMS.slice().reverse()]} />
          </div>

          {/* Column 3: Scroll UP Fast */}
          <div className="flex flex-col gap-4 animate-scroll-up-fast">
             <ScrollColumn items={[...ITEMS.slice(2), ...ITEMS, ...ITEMS.slice(0, 2)]} />
          </div>

          {/* Column 4: Scroll DOWN Fast */}
          <div className="flex flex-col gap-4 animate-scroll-down-fast">
             <ScrollColumn items={[...ITEMS.slice(1), ...ITEMS, ...ITEMS.slice(0, 1)]} />
          </div>

        </div>
      </div>

    </section>
  );
};

function ScrollColumn({ items }: { items: any[] }) {
  return (
    <>
      {items.map((item, idx) => (
        <div 
          key={`${item.id}-${idx}`}
          className={`relative group overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 cursor-pointer 
            ${item.size === 'tall' ? 'aspect-[9/16]' : item.size === 'medium' ? 'aspect-[4/5]' : 'aspect-square'}
          `}
        >
           <Image 
             src={item.img} 
             alt={item.author} 
             fill 
             className="object-cover transition-transform duration-1000 group-hover:scale-110 brightness-[0.85] group-hover:brightness-100"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-30" />
           
           <div className="absolute bottom-6 left-6 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                 <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                    <Play size={10} className="fill-white text-white translate-x-[1px]" />
                 </div>
                 <span className="text-[10px] font-black tracking-tight text-white drop-shadow-md">TikTok</span>
              </div>
              <p className="text-[11px] font-bold text-white/60 drop-shadow-md">{item.author}</p>
           </div>
        </div>
      ))}
    </>
  );
}
