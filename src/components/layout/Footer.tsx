"use client";

import Image from "next/image";
import styles from "./Footer.module.css";
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/navigation";

const services = [
  { name: "Influencer / KOL", href: "/services/influencer" },
  { name: "Creative Production", href: "/services/production" },
  { name: "Graphic Design", href: "/services/graphic-design" },
  { name: "Video & Motion", href: "/services/vdo-motion" },
  { name: "Audio & Music", href: "/services/mix-master-music" },
];
const address = "23/125 หมู่บ้าน สถาปัตย์ ซอย นวมินทร์161 แยก1-4 ถนน นวมินทร์ แขวง นวลจันทร์ เขต บึงกุ่ม กทม. 10230";
const linkStyle = "inline-flex min-h-9 items-center text-sm leading-relaxed text-white/65 transition-colors hover:text-blue-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400";

export const Footer = ({ showCta = true }: { showCta?: boolean }) => {
  const thai = useLocale() === "th";
  const nav = useTranslations("nav");
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16">
        {showCta && <div className="flex flex-col gap-7 border-b border-white/15 py-12 md:py-16 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <p className="mb-4 flex items-center gap-2.5 text-xs font-medium tracking-[0.1em] text-blue-300"><span className="size-1.5 rounded-full bg-blue-400" />LET’S WORK TOGETHER</p>
            <h2 className="max-w-2xl text-[clamp(1.75rem,3.5vw,3rem)] font-medium leading-[1.3] tracking-tight">
              {thai ? <>มีไอเดียดี ๆ ในใจ?<br /><span className="text-white/55">มาสร้างให้เกิดขึ้นจริง</span></> : <>Have something in mind?<br /><span className="text-white/55">Let’s bring it to life.</span></>}
            </h2>
          </div>
          <Link href="/contact" className="inline-flex min-h-12 w-fit shrink-0 items-center gap-8 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#0756c7] transition-colors hover:bg-blue-100">
            {thai ? 'เริ่มโปรเจกต์กับเรา' : 'Start a project'}<ArrowUpRight size={18} />
          </Link>
        </div>}
        <div className={`${styles.grid} grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-14`}>
          <div className={`${styles.brand} min-w-0 lg:col-span-3`}>
            <Link href="/" aria-label="Shiya Studio" className="inline-block"><Image src="/logo/logo.png" alt="Shiya Studio Logo" width={144} height={144} sizes="144px" className={`${styles.logo} size-36 object-contain`} /></Link>
            <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-white/65">{thai ? 'สตูดิโอสร้างสรรค์แบรนด์และโปรดักชัน เปลี่ยนไอเดียให้เป็นคอนเทนต์และความสัมพันธ์ที่มีความหมาย' : 'Creative branding agency & production studio. We create immersive content and meaningful connections.'}</p>
            <p className={`${styles.location} mt-5 text-xs tracking-[0.08em] text-white/40`}>BANGKOK, THAILAND</p>
          </div>
          <nav aria-label={thai ? 'บริการในส่วนท้าย' : 'Footer services'} className="min-w-0 lg:col-span-3">
            <h3 className="mb-5 text-xs font-semibold tracking-[0.1em] text-white/90">{thai ? 'บริการของเรา' : 'OUR SERVICES'}</h3>
            <ul className="space-y-1">{services.map(service => <li key={service.href}><Link href={service.href} className={linkStyle}>{service.name}</Link></li>)}</ul>
          </nav>
          <nav aria-label={thai ? 'เมนูในส่วนท้าย' : 'Footer navigation'} className="min-w-0 lg:col-span-2">
            <h3 className="mb-5 text-xs font-semibold tracking-[0.1em] text-white/90">{thai ? 'รู้จักเรา' : 'EXPLORE'}</h3>
            <ul className="space-y-1">{[{ name: nav('home'), href: '/' }, { name: nav('projects'), href: '/projects' }, { name: thai ? 'อินฟลูเอนเซอร์' : 'Creators', href: '/influencers' }, { name: nav('contact'), href: '/contact' }].map(link => <li key={link.href}><Link href={link.href} className={linkStyle}>{link.name}</Link></li>)}</ul>
          </nav>
          <div className={`${styles.contact} min-w-0 lg:col-span-4`}>
            <h3 className="mb-5 text-xs font-semibold tracking-[0.1em] text-white/90">{thai ? 'ติดต่อสตูดิโอ' : 'GET IN TOUCH'}</h3>
            <ul className="space-y-4">
              <li><a href="mailto:shiya.studioo@gmail.com" className={`${linkStyle} gap-3 break-all`}><Mail size={17} className="shrink-0 text-blue-300" />shiya.studioo@gmail.com</a></li>
              <li><a href="tel:0868329299" className={`${linkStyle} gap-3`}><Phone size={17} className="shrink-0 text-blue-300" />086-832-9299</a></li>
              <li><a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" className={`${linkStyle} items-start gap-3`}><MapPin size={17} className="mt-1 shrink-0 text-blue-300" /><span className="max-w-sm leading-7">{address}</span></a></li>
            </ul>
          </div>
        </div>
        <div className={`${styles.bottom} flex flex-col-reverse gap-5 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between`}>
          <p className="leading-relaxed">© 2026 {thai ? 'หจก. ชิญ่า สตูดิโอ' : 'Shiya Studio Limited Partnership'}. All rights reserved.</p>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })} className="inline-flex min-h-11 w-fit items-center gap-3 text-white/70 transition-colors hover:text-white">{thai ? 'กลับขึ้นด้านบน' : 'Back to top'}<span className="flex size-10 items-center justify-center rounded-full border border-white/20"><ArrowUp size={16} /></span></button>
        </div>
      </div>
    </footer>
  );
};
