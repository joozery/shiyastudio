"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export const HeroSection = () => {
  const t = useTranslations('hero');
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([
    { id: 1, img: '/hero_branding_new.png', type: 'branding' },
    { id: 2, img: '/hero_content_new.png', type: 'content' },
    { id: 3, img: '/hero_strategy_new.png', type: 'strategy' }
  ]);

  useEffect(() => {
    fetch('/api/hero')
      .then(res => res.json())
      .then(data => {
        if (data && data.slides && data.slides.length > 0) {
          setSlides(data.slides);
        }
      })
      .catch(err => console.error('Failed to load slides', err));
  }, []);

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full h-[75vh] md:h-[85vh] min-h-[500px] md:min-h-[600px] flex items-center justify-center p-4 md:p-8 bg-black overflow-hidden font-sans text-white text-left">
      
      {/* Main Container with rounded corners */}
      <div className="relative w-full h-full max-w-[1600px] rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        
        {/* Slider Background Layer */}
        {slides.map((slide, index) => (
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
        <div className="relative z-10 w-full h-full p-4 md:p-16 flex flex-col justify-between">
          
          {/* Top Row */}
          <div className="flex justify-center md:justify-end items-start pt-4">
            {/* Huge Floating Title */}
            <div className="text-center md:text-right max-w-full md:max-w-2xl">
               <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-[7.5rem] font-black uppercase leading-[0.9] md:leading-[0.8] tracking-tighter text-white animate-in fade-in slide-in-from-right-10 duration-700">
                  {t('title1')}<br />
                  {t('title2')}<br />
                  <span className="block text-transparent stroke-white stroke-[1px] md:stroke-[2px] opacity-30 mt-2" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>{t('title3')}</span>
               </h1>
            </div>
          </div>

          {/* Middle Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
             
             {/* Left Description */}
             <div className="max-w-xs text-center md:text-left">
                <p className="text-[10px] sm:text-[11px] md:text-sm text-white/70 leading-relaxed font-medium transition-all duration-500">
                  {t('desc_l')}
                </p>
             </div>

             {/* Right Action Button */}
             <div className="flex flex-col items-center gap-4 md:gap-6">
                <p className="hidden md:block text-[10px] text-white/40 text-right max-w-[250px] leading-relaxed mr-12">
                  {t('desc_r')}
                </p>
                <Link href="/contact" className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full bg-blue-600 flex items-center justify-center group hover:scale-110 transition-transform shadow-[0_0_40px_rgba(37,99,235,0.4)] cursor-pointer">
                   <ArrowUpRight className="w-6 h-6 sm:w-8 h-8 md:w-10 md:h-10 text-white group-hover:rotate-12 transition-transform" />
                </Link>
             </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-8 pb-4">
             
             {/* Slider Navigation Dots & Controls */}
             <div className="flex items-center gap-4 sm:gap-6 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-3 md:p-4">
                <div className="flex gap-1 md:gap-2 pr-3 md:pr-4 border-r border-white/10">
                   <button onClick={prevSlide} className="p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                      <ChevronLeft size={14} className="md:w-4 md:h-4" />
                   </button>
                   <button onClick={nextSlide} className="p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                      <ChevronRight size={14} className="md:w-4 md:h-4" />
                   </button>
                </div>
                <div className="flex gap-2 md:gap-3">
                   {slides.map((_, index) => (
                      <button 
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-1 md:h-1.5 rounded-full transition-all duration-500 cursor-pointer ${index === current ? 'w-6 md:w-8 bg-blue-600' : 'w-1.5 md:w-2 bg-white/20'}`}
                      />
                   ))}
                </div>
             </div>

             {/* Category Indicator (Matches Slider Content) */}
             <div className="flex gap-1 md:gap-2 p-1 md:p-1.5 bg-black/40 backdrop-blur-md border border-white/5 rounded-full overflow-x-auto max-w-full hide-scrollbar">
                {slides.map((slide, index) => (
                  <button 
                    key={slide.id || index}
                    onClick={() => setCurrent(index)}
                    className={`whitespace-nowrap px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 transition-all ${index === current ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                  >
                    {index === current && <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white animate-pulse" />}
                    {(() => {
                      // Using generic key if translation is missing
                      try { return t(`b_${slide.type}`); } 
                      catch { return slide.type; }
                    })()}
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
