"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/navigation";

interface Service {
  category: string;
  title: string;
  image: string;
  description: string;
  slug: string;
}

export const ServicesSection = ({ initialData }: { initialData?: { services?: Service[] } }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const scrollCards = (direction: number) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const card = slider.firstElementChild;
    const step = (card?.getBoundingClientRect().width ?? 360) + 20;
    slider.scrollBy({ left: direction * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const t = useTranslations("services");
  const thai = useLocale() === "th";
  const defaults: Service[] = [
    { category: "MARKETING", title: t("influencer.title"), image: "/service-influencer.png", description: t("influencer.desc"), slug: "influencer" },
    { category: "CREATIVE", title: t("production.title"), image: "/service-production.png", description: t("production.desc"), slug: "production" },
    { category: "DESIGN", title: t("graphic.title"), image: "/service-graphic.png", description: t("graphic.desc"), slug: "graphic-design" },
    { category: "MOTION", title: t("motion.title"), image: "/service-motion.png", description: t("motion.desc"), slug: "vdo-motion" },
    { category: "AUDIO", title: t("music.title"), image: "/service-music.png", description: t("music.desc"), slug: "mix-master-music" },
  ];
  const services = initialData?.services?.length ? initialData.services : defaults;

  return (
    <section aria-labelledby="services-heading" className="bg-[#f5f6f8] px-6 py-14 text-[#101820] md:px-10 md:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10 grid gap-7 pt-6 md:mb-12 lg:grid-cols-12 lg:gap-8">
          <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.12em] text-[#52606c] lg:col-span-2 lg:items-start lg:pt-2"><span className="text-blue-600">01</span>OUR EXPERTISE</p>
          <h2 id="services-heading" className="text-[clamp(1.75rem,3.5vw,3rem)] font-semibold leading-[1.3] tracking-tight lg:col-span-6">
            {thai ? <>ทุกสิ่งที่แบรนด์ต้องการ<br /><span className="text-blue-600">เพื่อก้าวไปข้างหน้า</span></> : <>Everything your brand needs.<br /><span className="text-blue-600">Built to move you forward.</span></>}
          </h2>
          <div className="max-w-sm lg:col-span-4 lg:pt-2">
            <p className="text-sm leading-7 text-[#52606c] md:text-base">{thai ? 'จากไอเดียสู่ผลงานจริง เราผสานกลยุทธ์ ความคิดสร้างสรรค์ และโปรดักชัน เพื่อสร้างงานที่ตอบโจทย์แบรนด์ของคุณ' : 'From the first idea to the final execution, we connect strategy, creativity and production to create work that moves your brand forward.'}</p>
            <Link href="/contact" className="mt-4 inline-flex min-h-11 items-center gap-3 text-sm font-medium text-blue-700 hover:text-blue-900">{thai ? 'คุยเรื่องโปรเจกต์ของคุณ' : 'Let’s discuss your project'}<ArrowUpRight size={17} /></Link>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-xs leading-relaxed text-[#52606c]">{thai ? 'เลื่อนเพื่อสำรวจบริการ · แตะหรือชี้เพื่อดูรายละเอียด' : 'Scroll to explore · Tap or hover for details'}</p>
          <div className="flex shrink-0 gap-2">
            <button type="button" aria-label={thai ? 'บริการก่อนหน้า' : 'Previous services'} onClick={() => scrollCards(-1)} className="flex size-11 items-center justify-center rounded-full border border-[#101820]/20 bg-white hover:border-blue-500 hover:text-blue-600"><ChevronLeft size={20} /></button>
            <button type="button" aria-label={thai ? 'บริการถัดไป' : 'Next services'} onClick={() => scrollCards(1)} className="flex size-11 items-center justify-center rounded-full border border-[#101820]/20 bg-white hover:border-blue-500 hover:text-blue-600"><ChevronRight size={20} /></button>
          </div>
        </div>
        <div ref={sliderRef} role="region" aria-label={thai ? 'สไลด์บริการ' : 'Services carousel'} className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-2">
          {services.map(service => {
            const open = openCard === service.slug;
            return <article key={service.slug} className="group relative aspect-square w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl bg-[#071018] sm:w-[calc((100%_-_20px)/2)] lg:w-[calc((100%_-_40px)/3)] xl:w-[calc((100%_-_60px)/4)]">
              <Image src={service.image || '/service-production.png'} alt={service.title} fill sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" className="object-cover" />
              <button type="button" aria-label={`${thai ? 'รายละเอียดบริการ' : 'Service details'}: ${service.title}`} aria-expanded={open} aria-controls={`service-details-${service.slug}`} onClick={() => setOpenCard(open ? null : service.slug)} className="absolute inset-0 z-10 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-blue-400" />
              <div id={`service-details-${service.slug}`} className={`pointer-events-none absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/50 to-transparent p-6 text-white transition-opacity duration-300 motion-reduce:transition-none group-hover:opacity-100 group-focus-within:opacity-100 ${open ? 'opacity-100' : 'opacity-0'}`}>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-white/70">{service.category}</p>
                <h3 className="mb-3 text-2xl font-semibold leading-[1.25] tracking-tight">{service.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-white/80">{service.description}</p>
                <Link href={`/services/${service.slug}`} className={`flex min-h-11 items-center justify-between border-t border-white/25 pt-3 text-sm font-medium group-hover:pointer-events-auto group-focus-within:pointer-events-auto ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                  {thai ? 'ดูบริการ' : 'Explore service'}<ArrowUpRight size={20} />
                </Link>
              </div>
            </article>;
          })}
        </div>


      </div>
    </section>
  );
};
