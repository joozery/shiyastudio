"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, Globe, Menu, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/navigation";

const services = [
  { name: "Influencer / KOL", href: "/services/influencer" },
  { name: "Production", href: "/services/production" },
  { name: "Graphic Design", href: "/services/graphic-design" },
  { name: "Video & Motion", href: "/services/vdo-motion" },
  { name: "Audio & Music", href: "/services/mix-master-music" },
];

const subscribeScroll = (callback: () => void) => {
  window.addEventListener('scroll', callback, { passive: true });
  return () => window.removeEventListener('scroll', callback);
};

export const Navbar = ({ overlay = false }: { overlay?: boolean }) => {
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 24, () => false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setServicesOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !menuOpen) return;
    const menuButton = menuButtonRef.current;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const query = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (query.matches) setMenuOpen(false); };
    query.addEventListener("change", closeOnDesktop);
    return () => {
      query.removeEventListener("change", closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      dialog.close();
      menuButton?.focus();
    };
  }, [menuOpen]);

  const toggleLanguage = () => {
    setMenuOpen(false);
    router.replace(pathname, { locale: locale === "en" ? "th" : "en" });
  };
  const links = [{ name: t("home"), href: "/" }, { name: t("projects"), href: "/projects" }, { name: locale === "th" ? "อินฟลูเอนเซอร์" : "Creators", href: "/influencers" }];
  const linkClass = (active: boolean) => `relative px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 ${active ? "text-white after:absolute after:bottom-0 after:left-3 after:h-0.5 after:w-5 after:bg-blue-500" : "text-white/75 hover:text-white"}`;

  return (
    <header style={{ backgroundColor: overlay && !scrolled ? 'transparent' : 'rgba(3, 9, 16, 0.95)', backdropFilter: overlay && !scrolled ? 'none' : 'blur(12px)', borderBottom: overlay && !scrolled ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)' }} className={`${overlay ? "fixed inset-x-0 top-0" : "sticky top-0"} z-50 px-5 transition-colors duration-300 md:px-10 lg:px-16`}>
      <nav aria-label={locale === "th" ? "เมนูหลัก" : "Main navigation"} className={`mx-auto flex max-w-[1600px] items-center justify-between gap-4 text-white transition-[padding] duration-300 ${scrolled ? "py-1.5 md:py-2" : "py-2 md:py-3"}`}>
        <Link href="/" aria-label="Shiya Studio" className="flex shrink-0 items-center gap-2.5">
          <Image src="/logo/logo.png" alt="Shiya Studio Logo" width={100} height={100} sizes="(max-width: 768px) 56px, 64px" preload className={`object-contain transition-[width,height] duration-300 ${scrolled ? "size-12 md:size-14" : "size-14 md:size-16"}`} />
          {<span className="hidden sm:block"><span className="block text-sm font-semibold tracking-[0.12em]">SHIYA STUDIO</span><span className="mt-1 block text-[9px] text-white/50">Ideas. Content. People. Impact.</span></span>}
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className={linkClass(pathname === "/")}>{t("home")}</Link>
          <div className="relative" ref={dropdownRef}>
            <button type="button" aria-expanded={servicesOpen} aria-controls="desktop-services" onClick={() => setServicesOpen(!servicesOpen)} className={`${linkClass(pathname.startsWith('/services'))} flex items-center gap-2`}>
              {t("services")}<ChevronDown size={14} className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </button>
            {servicesOpen && <div id="desktop-services" className="absolute left-0 top-full mt-4 w-72 rounded-2xl border border-white/15 bg-[#151517] p-2 shadow-2xl">
              {services.map(service => <Link key={service.href} href={service.href} onClick={() => setServicesOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10">
                {service.name}<ArrowUpRight size={15} />
              </Link>)}
            </div>}
          </div>
          <Link href="/projects" aria-current={pathname.startsWith("/projects") ? "page" : undefined} className={linkClass(pathname.startsWith("/projects"))}>{t("projects")}</Link>
          <Link href="/influencers" aria-current={pathname.startsWith("/influencers") ? "page" : undefined} className={linkClass(pathname.startsWith("/influencers"))}>{locale === "th" ? "อินฟลูเอนเซอร์" : "Creators"}</Link>
          <Link href="/contact" className={linkClass(pathname.startsWith("/contact"))}>{t("contact")}</Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button type="button" onClick={toggleLanguage} aria-label={locale === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"} className="flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <Globe size={15} /><span>{locale === "th" ? "EN" : "TH"}</span>
          </button>
          <Link href="/contact" className="hidden items-center gap-4 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-200 lg:flex">{locale === 'th' ? 'คุยกับเรา' : "Let’s Talk"}<ArrowUpRight size={14} /></Link>
          <button ref={menuButtonRef} type="button" aria-label={locale === "th" ? "เปิดเมนู" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(true)} className="flex size-11 items-center justify-center rounded-full border border-white/15 hover:bg-white/10 lg:hidden"><Menu size={20} /></button>
        </div>
      </nav>
      <dialog ref={dialogRef} id="mobile-navigation" aria-label={locale === "th" ? "เมนูหลัก" : "Main navigation"} onCancel={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)} className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-[#101012] p-6 text-white backdrop:bg-black/70">
        <div className="mx-auto flex h-full max-w-xl flex-col overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <span className="text-sm tracking-[0.2em]">SHIYA STUDIO</span>
            <button type="button" aria-label={locale === "th" ? "ปิดเมนู" : "Close menu"} onClick={() => setMenuOpen(false)} className="flex size-11 items-center justify-center rounded-full border border-white/20"><X size={20} /></button>
          </div>
          <div className="flex flex-col gap-5 py-8">
            {[...links, { name: t("contact"), href: "/contact" }].map((link, index) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between text-3xl font-medium tracking-tight hover:text-blue-300"><span><span className="mr-4 text-xs text-white/40">0{index + 1}</span>{link.name}</span><ArrowUpRight size={24} /></Link>)}
          </div>
          <p className="mb-3 text-xs tracking-widest text-white/40">{t("services")}</p>
          <div className="divide-y divide-white/10">{services.map(service => <Link key={service.href} href={service.href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-4 text-sm text-white/70 hover:text-white">{service.name}<ArrowUpRight size={16} /></Link>)}</div>
          <div className="mt-auto flex items-center justify-between pt-8 text-xs text-white/50"><span>CREATIVE STUDIO · BANGKOK</span><button type="button" onClick={toggleLanguage} className="rounded-full border border-white/20 px-4 py-3">{locale === "th" ? "English" : "ไทย"}</button></div>
        </div>
      </dialog>
    </header>
  );
};
