"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export const HeroSection = () => {
  const t = useTranslations('hero');
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<any[]>([
    { 
      id: 1, 
      img: '/hero_branding_new.png', 
      type: 'branding',
      title: 'CREATIVE BRANDING AGENCY',
      subtitle: 'From strategy to visual DNA — we help brands redefine, not just refresh.',
      description: 'ที่ซึ่งแบรนด์ถือกำเนิดใหม่และขอบเขตดิจิทัลของจินตนาการถูกกำหนดขึ้นใหม่ เราสร้างตัวตนที่โดดเด่น',
      thaiTitle: 'สร้างสรรค์ แบรนด์ดัง',
      stat1Label: 'Global Reach',
      stat1Value: '50+ Projects',
      stat2Label: 'Experience',
      stat2Value: '8 Years'
    },
    { 
      id: 2, 
      img: '/hero_content_new.png', 
      type: 'content',
      title: 'IMMERSIVE CONTENT CREATION',
      subtitle: 'Captivating stories told through cinematic visuals and motion design.',
      description: 'เรื่องราวที่น่าดึงดูดใจบอกเล่าผ่านภาพที่สวยงามและมีความเป็นภาพยนตร์ระดับสากล',
      thaiTitle: 'คอนเทนต์ ทรงพลัง',
      stat1Label: 'Daily Views',
      stat1Value: '1M+',
      stat2Label: 'Engagement',
      stat2Value: '85%'
    },
    { 
      id: 3, 
      img: '/hero_strategy_new.png', 
      type: 'strategy',
      title: 'STRATEGIC DIGITAL TRANSFORMATION',
      subtitle: 'Merging artisanal craft with future-proof digital strategies.',
      description: 'ผสานงานฝีมือประณีตเข้ากับกลยุทธ์ดิจิทัลที่รองรับอนาคต เพื่อการเติบโตที่ยั่งยืน',
      thaiTitle: 'กลยุทธ์ ล้ำสมัย',
      stat1Label: 'Ad Spend',
      stat1Value: '$2M+',
      stat2Label: 'ROI Rate',
      stat2Value: '4.5x'
    }
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
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const activeSlide = slides[current] || {};

  return (
    <section className="relative w-full md:h-[90vh] md:min-h-[550px] flex items-center justify-center p-2 md:p-8 bg-black overflow-hidden font-sans text-white">

      {/* Main Container - mobile: 16:9 to fit the whole horizontal cover; desktop: fills the tall hero */}
      <div className="relative w-full aspect-video md:aspect-auto md:h-full max-w-[1600px] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl bg-zinc-950">
        
        {/* Background Layer */}
        {slides.map((slide, index) => {
          const isActive = index === current;
          const isVideo = slide.img?.match(/\.(mp4|webm|mov|ogg)$/i);

          return (
             <div 
              key={slide.id || index}
              className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
            >
              {/* Desktop Asset - fills the tall hero (cropped as needed) */}
              <div className="hidden md:block relative h-full w-full">
                {isVideo ? (
                  <video src={slide.img} autoPlay muted loop playsInline className="w-full h-full object-cover scale-105" />
                ) : (
                  <Image src={slide.img || '/placeholder.png'} alt={slide.title || 'Slide'} fill className={`object-cover ${isActive ? 'scale-100' : 'scale-110'} transition-transform duration-[10s] ease-out`} priority={index === 0} />
                )}
              </div>

              {/* Mobile Asset - whole horizontal cover visible (container is 16:9, no black bars).
                  Uses a dedicated mobileImg if provided, otherwise the main landscape asset. */}
              <div className="block md:hidden relative h-full w-full bg-black">
                {(() => {
                  const mSrc = slide.mobileImg || slide.img || '/placeholder.png';
                  const mIsVideo = /\.(mp4|webm|mov|ogg)(\?|$)/i.test(mSrc);
                  return mIsVideo ? (
                    <video src={mSrc} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  ) : (
                    <Image src={mSrc} alt={slide.title || 'Slide'} fill className="object-cover" />
                  );
                })()}
              </div>

              {/* Subtle Gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
            </div>
          );
        })}

        {/* Dynamic Content Layers - Simplified to only Progress/Nav */}
        <div className="relative z-10 w-full h-full p-4 md:p-12 flex flex-col justify-end">
          
          {/* Bottom Bar: Minimal Progress & Nav */}
          <div className="flex justify-between items-center w-full max-w-[1200px] mx-auto">
             
             {/* Progress Indicator */}
             <div className="flex items-center gap-6 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full p-1.5 pl-5 pr-1.5 min-w-[200px]">
                <div className="flex gap-1.5">
                   {slides.map((_, index) => (
                      <div 
                        key={index}
                        className={`h-1 rounded-full transition-all duration-500 ${index === current ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`}
                      />
                   ))}
                </div>
                <div className="flex-1" />
                <div className="flex gap-1">
                   <button onClick={prevSlide} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white/60 hover:text-white">
                      <ChevronLeft size={16} />
                   </button>
                   <button onClick={nextSlide} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white/60 hover:text-white">
                      <ChevronRight size={16} />
                   </button>
                </div>
             </div>

             {/* Slide Counter */}
             <div className="hidden md:flex items-center gap-3">
                <span className="text-2xl font-black italic tracking-tighter opacity-20 italic">0{current + 1}</span>
                <div className="w-8 h-[1px] bg-white/10" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                   {activeSlide.type || 'Showcase'}
                </span>
             </div>

          </div>

        </div>

      </div>

    </section>
  );
};
