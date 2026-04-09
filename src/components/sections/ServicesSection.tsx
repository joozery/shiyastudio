"use client";

import React, { useRef, useMemo } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from 'next-intl';

export const ServicesSection = () => {
  const t = useTranslations('services');

  const services = useMemo(() => [
    {
      category: "MARKETING",
      title: t('influencer.title'),
      image: "/service-influencer.png",
      description: t('influencer.desc')
    },
    {
      category: "CREATIVE",
      title: t('production.title'),
      image: "/service-production.png",
      description: t('production.desc')
    },
    {
      category: "DESIGN",
      title: t('graphic.title'),
      image: "/service-graphic.png",
      description: t('graphic.desc')
    },
    {
      category: "MOTION",
      title: t('motion.title'),
      image: "/service-motion.png",
      description: t('motion.desc')
    }
  ], [t]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full py-20 px-6 md:px-12 bg-[#F6F6F6] text-black font-sans overflow-hidden">
      
      {/* Mixed Typography Header */}
      <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
        <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[4rem] lg:text-[5rem] tracking-tighter leading-[0.9] select-none uppercase">
          <span className="font-light text-zinc-400">{t('m')}</span> <span className="font-bold text-zinc-800">{t('y')}</span><br />
          <span className="font-bold text-zinc-800">{t('b')}</span> <span className="font-light text-zinc-400 italic">{t('n')}</span> <span className="font-bold text-blue-600">{t('g')}</span>
        </h2>
      </div>

      {/* Card Slider Section */}
      <div className="relative w-full max-w-[1400px] mx-auto group/slider">
        
        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-10 z-30 opacity-0 group-hover/slider:opacity-100 transition-opacity">
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-10 z-30 opacity-0 group-hover/slider:opacity-100 transition-opacity">
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-xl"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-16 px-4 md:px-20"
        >
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group relative flex-shrink-0 w-[80vw] sm:w-[50vw] md:w-[400px] aspect-[4/5] md:aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-black snap-center transition-all duration-700 hover:scale-[1.02] shadow-2xl"
            >
              {/* Background Still Image */}
              <div className="absolute inset-0">
                <Image 
                  src={service.image} 
                  fill 
                  alt={service.title} 
                  className="object-cover opacity-70 group-hover:opacity-90 transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              </div>

              {/* Top Label */}
              <div className="absolute top-8 left-8 z-20">
                 <div className="px-4 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-[8px] font-bold tracking-[0.2em] text-white/50 uppercase leading-none">
                    {service.category}
                 </div>
              </div>

              {/* Hover Play Button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                 <div className="w-16 h-16 rounded-full bg-blue-600/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                    <Play className="w-6 h-6 fill-white text-white ml-1" />
                 </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-end gap-12 text-left">
                 <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-[0.9] text-white tracking-tighter uppercase whitespace-normal">
                   {service.title.split(' ').map((word: string, idx: number) => (
                     <React.Fragment key={idx}>
                       {word} {idx === 1 && <br />}
                     </React.Fragment>
                   ))}
                 </h3>
                 <p className="hidden md:block text-[10px] text-white/40 max-w-[150px] leading-tight font-medium text-right mb-1">
                    {service.description}
                 </p>
              </div>
            </div>
          ))}
        </div>

        {/* Side Shadows for Slide Effect */}
        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-[#F6F6F6] to-transparent pointer-events-none z-10 hidden md:block" />
        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-[#F6F6F6] to-transparent pointer-events-none z-10 hidden md:block" />
      </div>

    </section>
  );
};
