"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

const SLIDES = [
  { id: 1, img: '/hero_branding_new.png', type: 'branding' },
  { id: 2, img: '/hero_content_new.png', type: 'content' },
  { id: 3, img: '/hero_strategy_new.png', type: 'strategy' }
];

export const HeroSection = () => {
  const t = useTranslations('hero');
  const [current, setCurrent] = useState(0);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative w-full h-[90vh] md:h-[85vh] min-h-[600px] flex items-center justify-center p-4 md:p-8 bg-black overflow-hidden font-sans text-white text-left">
      
      {/* Main Container with rounded corners */}
      <div className="relative w-full h-full max-w-[1600px] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
        
        {/* Slider Background Layer */}
        {SLIDES.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image 
              src={slide.img} 
              alt={`Slide ${index}`} 
              fill 
              className="object-cover brightness-[0.6] transition-transform duration-[5s] ease-linear"
              style={{ transform: index === current ? 'scale(1)' : 'scale(1.1)' }}
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        ))}

        {/* Content Layers (Synced with Slider if needed, but keeping core layout stable) */}
        <div className="relative z-10 w-full h-full p-8 md:p-16 flex flex-col justify-between">
          
          {/* Top Row */}
          <div className="flex justify-end items-start pt-4">
            {/* Huge Floating Title */}
            <div className="text-right max-w-2xl">
               <h1 className="text-5xl md:text-8xl lg:text-[7.5rem] font-black uppercase leading-[0.8] tracking-tighter text-white animate-in fade-in slide-in-from-right-10 duration-700">
                  {t('title1')}<br />
                  {t('title2')}<br />
                  <span className="block text-transparent stroke-white stroke-[1px] md:stroke-[2px] opacity-30 mt-2" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>{t('title3')}</span>
               </h1>
            </div>
          </div>

          {/* Middle Row */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-12">
             
             {/* Left Description */}
             <div className="max-w-xs text-left">
                <p className="text-[11px] md:text-sm text-white/70 leading-relaxed font-medium transition-all duration-500">
                  {t('desc_l')}
                </p>
             </div>

             {/* Right Action Button */}
             <div className="flex flex-col items-center gap-6">
                <p className="hidden md:block text-[10px] text-white/40 text-right max-w-[250px] leading-relaxed mr-12">
                  {t('desc_r')}
                </p>
                <Link href="/contact" className="relative w-16 h-16 md:w-24 md:h-24 rounded-full bg-blue-600 flex items-center justify-center group hover:scale-110 transition-transform shadow-[0_0_40px_rgba(37,99,235,0.4)] cursor-pointer">
                   <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10 text-white group-hover:rotate-12 transition-transform" />
                </Link>
             </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 pt-12">
             
             {/* Slider Navigation Dots & Controls */}
             <div className="flex items-center gap-6 bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-4">
                <div className="flex gap-2 pr-4 border-r border-white/10">
                   <button onClick={prevSlide} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                      <ChevronLeft size={16} />
                   </button>
                   <button onClick={nextSlide} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                      <ChevronRight size={16} />
                   </button>
                </div>
                <div className="flex gap-3">
                   {SLIDES.map((_, index) => (
                      <button 
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${index === current ? 'w-8 bg-blue-600' : 'w-2 bg-white/20'}`}
                      />
                   ))}
                </div>
             </div>

             {/* Category Indicator (Matches Slider Content) */}
             <div className="flex gap-2 p-1.5 bg-black/40 backdrop-blur-md border border-white/5 rounded-full">
                {['branding', 'content', 'strategy'].map((type) => (
                  <button 
                    key={type}
                    className={`px-5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${SLIDES[current].type === type ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                  >
                    {SLIDES[current].type === type && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    {t(`b_${type}`)}
                  </button>
                ))}
             </div>

          </div>

        </div>

      </div>

      {/* Subtle corners dots (Decoration) */}
      <div className="absolute bottom-10 left-10 w-2 h-2 rounded-full bg-blue-600/30 blur-sm" />
      <div className="absolute bottom-10 right-10 w-2 h-2 rounded-full bg-blue-600/30 blur-sm animate-pulse" />
    </section>
  );
};
