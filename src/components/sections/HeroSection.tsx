"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowDown, Pause, Play } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";

interface HeroSlide {
  id?: string | number;
  img?: string;
  mobileImg?: string;
  title?: string;
  [key: string]: unknown;
}

const isVideo = (source?: string) => !!source && /\.(mp4|webm|mov|ogg)(\?|$)/i.test(source);
const mobileQuery = '(max-width: 767px)';
const subscribeMobile = (callback: () => void) => {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};

const showcase: HeroSlide[] = [
  { img: "/hero-reference-v2.png", title: "Creative branding" },
  { img: "/service-production.png", title: "Creative production" },
  { img: "/service-motion.png", title: "Motion & storytelling" },
];

export const HeroSection = ({ initialData }: { initialData?: { slides?: HeroSlide[] } }) => {
  const locale = useLocale();
  const thai = locale === "th";
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const mobile = useSyncExternalStore(subscribeMobile, () => window.matchMedia(mobileQuery).matches, () => false);
  const configured = initialData?.slides ?? [];
  const slides = configured.length ? configured : showcase;
  const active = slides[current] || slides[0];
  const source = (mobile ? active.mobileImg || active.img : active.img) || '/hero-reference-v2.png';
  return (
    <section aria-label="Shiya Studio — Creative branding agency" className="relative isolate w-full aspect-video min-h-[320px] overflow-hidden bg-[#030910] text-white md:aspect-auto md:h-[min(900px,100svh)] md:min-h-[600px]">
      {isVideo(source) ? <BackgroundVideo key={source} source={source} paused={paused} /> : <Image key={source} src={source} alt={active.title || "Shiya Studio creative showcase"} fill sizes="100vw" preload className="object-cover object-[65%_center] md:object-center" />}

      <aside aria-label={thai ? 'เลือกภาพผลงาน' : 'Select showcase'} className="absolute bottom-8 right-5 flex items-center gap-3 md:bottom-auto md:right-10 md:top-1/2 md:-translate-y-1/2 md:flex-col md:items-end md:gap-4 lg:right-12">
        {slides.length > 1 && slides.map((slide, index) => <button key={slide.img || index} type="button" aria-label={`${thai ? 'ภาพผลงาน' : 'Showcase'} ${index + 1}`} aria-pressed={current === index} onClick={() => setCurrent(index)} className="group flex items-center gap-3">
          <span className={`hidden text-[10px] md:block ${current === index ? 'text-white' : 'text-white/45'}`}>{String(index + 1).padStart(2, '0')}</span>
          <span className={`relative block h-10 w-12 overflow-hidden rounded-md border transition-all md:h-16 md:w-20 lg:h-[74px] lg:w-[90px] ${current === index ? 'border-white shadow-[0_0_20px_#2385ff35]' : 'border-white/30 opacity-65 group-hover:opacity-100'}`}>{isVideo(slide.img) ? <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-950 to-black"><Play size={18} className="text-white/80" /></span> : <Image src={slide.img || '/hero-reference-v2.png'} alt="" fill sizes="90px" className="object-cover" />}</span>
        </button>)}
        {isVideo(source) && <button type="button" aria-label={paused ? (thai ? 'เล่นวิดีโอพื้นหลัง' : 'Play background video') : (thai ? 'พักวิดีโอพื้นหลัง' : 'Pause background video')} onClick={() => setPaused(!paused)} className="flex size-11 items-center justify-center rounded-full border border-white/45 md:mt-3">{paused ? <Play size={16} /> : <Pause size={16} />}</button>}
        <a href="#home-services" aria-label={thai ? 'เลื่อนไปดูบริการ' : 'Scroll to services'} className="mt-3 hidden size-11 items-center justify-center rounded-full border border-white/45 md:flex"><ArrowDown size={18} /></a>
      </aside>

    </section>
  );
};


function BackgroundVideo({ source, paused }: { source: string; paused: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let visible = true;
    const sync = () => {
      if (paused || !visible || document.hidden) video.pause();
      else void video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      video.pause();
    };
  }, [paused]);
  return <video ref={ref} src={source} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-[65%_center] md:object-center" />;
}
