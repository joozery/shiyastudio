"use client";

import React, { useState, useEffect } from "react";
import { Play } from "lucide-react";
import Image from "next/image";

export const InfluencerSection = () => {
  const [mounted, setMounted] = useState(false);
  const [allItems, setAllItems] = useState<any[]>([
    { id: 1, img: "/project-1.png", videoUrl: "", author: "@aomiws", size: "tall", category: "Influencer campaign", platform: "TikTok" },
    { id: 2, img: "/project-2.png", videoUrl: "", author: "@cchanatt", size: "medium", category: "Influencer commerce", platform: "TikTok" },
    { id: 3, img: "/project-3.png", videoUrl: "", author: "@khunkooktayada", size: "tall", category: "Always-on KOL campaign", platform: "Instagram" },
    { id: 4, img: "/service-production.png", videoUrl: "", author: "@shiya.studio", size: "large", category: "Live commerce", platform: "TikTok" },
    { id: 5, img: "/service-motion.png", videoUrl: "", author: "@expert.th", size: "medium", category: "Affiliate marketing", platform: "YouTube" },
    { id: 6, img: "/service-influencer.png", videoUrl: "", author: "@lifestyle.th", size: "tall", category: "Influencer campaign", platform: "Instagram" }
  ]);
  const [categories, setCategories] = useState<string[]>([
    "Influencer campaign",
    "Influencer commerce",
    "Always-on KOL campaign",
    "Live commerce",
    "Affiliate marketing"
  ]);
  const [activeCategory, setActiveCategory] = useState<string>("__all__");

  useEffect(() => {
    fetch('/api/influencer')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.items && data.items.length > 0) setAllItems(data.items);
          if (data.categories && data.categories.length > 0) setCategories(data.categories);
        }
      })
      .catch(err => console.error('Failed to load influencer data', err));
    
    setMounted(true);
  }, []);

  // Filter items based on active category
  const items = activeCategory === "__all__"
    ? allItems
    : allItems.filter(item => item.category === activeCategory);

  // Ensure enough items for 4 columns (minimum 4 per column = 16 total, duplicate if needed)
  const padded = items.length > 0
    ? Array.from({ length: Math.max(items.length, 8) }, (_, i) => items[i % items.length])
    : allItems; // fallback

  return (
    <section className="relative w-full py-24 bg-black text-white overflow-hidden font-sans">
      
      {/* Scroll animation styles */}
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
          animation: scrollUp 80s linear infinite; 
          will-change: transform;
        }
        .animate-scroll-down { 
          animation: scrollDown 85s linear infinite; 
          will-change: transform;
        }
        .animate-scroll-up-fast { 
          animation: scrollUp 70s linear infinite; 
          will-change: transform;
        }
        .animate-scroll-down-fast { 
          animation: scrollDown 75s linear infinite; 
          will-change: transform;
        }
      `}</style>

      {/* Heading Block */}
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-10 mb-20 px-4">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.3em] leading-tight">
          INFLUENCER MARKETING<br />& COMMERCE
        </h2>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {/* "All" pill */}
          <button
            onClick={() => setActiveCategory("__all__")}
            className={`px-6 py-2 rounded-full border text-[9px] font-bold uppercase tracking-widest transition-all ${
              activeCategory === "__all__"
                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                : "bg-transparent text-white/40 border-white/10 hover:border-white/40 hover:text-white/70"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full border text-[9px] font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  : "bg-transparent text-white/40 border-white/10 hover:border-white/40 hover:text-white/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Item count badge */}
        {activeCategory !== "__all__" && (
          <p className="text-[10px] text-white/30 font-bold -mt-6">
            แสดง {items.length} จาก {allItems.length} รายการ
          </p>
        )}
      </div>

      {/* Scrolling Grid */}
      <div className="relative h-[600px] md:h-[900px] w-full max-w-[1900px] mx-auto overflow-hidden">
        {/* Fade overlays */}
        <div className="absolute top-0 left-0 w-full h-[150px] md:h-[300px] bg-gradient-to-b from-black via-black/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[150px] md:h-[300px] bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none hidden md:block" />
        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none hidden md:block" />

        {!mounted ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-20 h-full opacity-80">
            <div className="flex flex-col gap-4 animate-scroll-up">
              <ScrollColumn items={[...padded, ...padded]} />
            </div>
            <div className="flex flex-col gap-4 animate-scroll-down">
              <ScrollColumn items={[...padded.slice().reverse(), ...padded.slice().reverse()]} />
            </div>
            <div className="flex flex-col gap-4 animate-scroll-up-fast">
              <ScrollColumn items={[...padded.slice(2), ...padded, ...padded.slice(0, 2)]} />
            </div>
            <div className="flex flex-col gap-4 animate-scroll-down-fast">
              <ScrollColumn items={[...padded.slice(1), ...padded, ...padded.slice(0, 1)]} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

function ScrollColumn({ items }: { items: any[] }) {
  return (
    <>
      {items.map((item, idx) => (
        <MediaCard key={`${item.id}-${idx}`} item={item} />
      ))}
    </>
  );
}

function MediaCard({ item }: { item: any }) {
  const hasVideo = !!item.videoUrl;

  const PLATFORM_ICONS: Record<string, string> = {
    TikTok: '▶',
    Instagram: '◈',
    YouTube: '▷',
    Facebook: 'f',
    Other: '●',
  };

  return (
    <div
      className={`relative group overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 cursor-pointer
        ${item.size === 'tall' ? 'aspect-[9/16]' : item.size === 'medium' ? 'aspect-[4/5]' : 'aspect-square'}
      `}
    >
      {/* Video — autoplay directly, no hover needed */}
      {hasVideo ? (
        <video
          src={item.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : item.img ? (
        /* Image fallback when no video */
        <Image
          src={item.img}
          alt={item.author}
          fill
          className="object-cover brightness-[0.85] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700"
        />
      ) : null}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

      {/* Bottom info */}
      <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <span className="text-[8px] font-black text-white">
                {PLATFORM_ICONS[item.platform || 'TikTok'] || '▶'}
              </span>
            </div>
            <span className="text-[10px] font-black tracking-tight text-white drop-shadow-md">
              {item.platform || 'TikTok'}
            </span>
          </div>
          <p className="text-[11px] font-bold text-white/60 drop-shadow-md">{item.author}</p>
        </div>
        {item.category && (
          <span className="text-[8px] font-bold text-white/40 bg-white/10 px-2 py-0.5 rounded-full border border-white/10 hidden md:block truncate max-w-[80px]">
            {item.category}
          </span>
        )}
      </div>
    </div>
  );
}
