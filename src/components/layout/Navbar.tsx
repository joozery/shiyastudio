"use client";

import React, { useState } from "react";
import { Search, Globe, Menu, ChevronDown, X, ArrowUpRight, Camera, Send, Zap, Globe2 } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import Image from "next/image";
import { Link, usePathname, useRouter } from '@/navigation';

export const Navbar = () => {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLanguageToggle = () => {
    const nextLocale = locale === 'en' ? 'th' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const navLinks = [
    { name: t('home'), href: "/" },
    { name: t('projects'), href: "/projects" },
    { name: t('contact'), href: "/contact" }
  ];

  return (
    <>
      <nav className="relative w-full flex items-center justify-between px-4 md:px-12 py-6 bg-black text-white border-b border-white/5 z-[100]">
        {/* Logo Image */}
        <Link href="/" className="flex items-center gap-4 group relative z-[110]">
          <div className="relative w-32 h-8 md:w-48 md:h-12 transition-transform active:scale-95">
            <Image 
              src="/logo/logo.svg" 
              alt="Shiya Studio Logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
        </Link>
        
        {/* Desktop Menu Links */}
        <div className="hidden lg:flex items-center gap-12 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
          <Link href="/" className={`hover:opacity-50 transition-opacity ${pathname === '/' ? 'text-blue-500' : ''}`}>{t('home')}</Link>
          
          {/* Services Dropdown */}
          <div className="relative group cursor-pointer">
             <div className="flex items-center gap-1.5 hover:opacity-50 transition-opacity">
                {t('services')} <ChevronDown className="w-3 h-3 text-white/50 group-hover:rotate-180 transition-transform" />
             </div>
             
             <div className="absolute top-full left-0 pt-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                <div className="w-56 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden p-3 shadow-2xl">
                   {[
                      { name: "Influencer/KOL", href: "/services/influencer" },
                      { name: "Production", href: "/services/production" },
                      { name: "Graphic Design", href: "/services/graphic-design" },
                      { name: "VDO Motion", href: "/services/vdo-motion" },
                      { name: "Mix master Music", href: "/services/mix-master-music" }
                    ].map((sub) => (
                      <Link 
                        key={sub.name} 
                        href={sub.href}
                        className="block px-4 py-3 rounded-xl hover:bg-white/5 text-[9px] text-white/40 hover:text-white transition-all cursor-pointer"
                      >
                         {sub.name}
                      </Link>
                   ))}
                </div>
             </div>
          </div>

          <Link href="/projects" className={`hover:opacity-50 transition-opacity ${pathname.includes('/projects') ? 'text-blue-500' : ''}`}>
            {t('projects')}
          </Link>
          <Link href="/contact" className={`hover:opacity-50 transition-opacity ${pathname.includes('/contact') ? 'text-blue-500' : ''}`}>
            {t('contact')}
          </Link>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3 md:gap-6 relative z-[110]">
          <button 
            onClick={handleLanguageToggle}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all text-[9px] font-bold uppercase tracking-widest"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'TH' : 'EN'}</span>
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 bg-white/10 rounded-full text-white hover:bg-blue-600 transition-colors"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Premium Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#050505] z-[150] lg:hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
         
         {/* Immersive Background Elements */}
         <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-900/5 blur-[100px] rounded-full" />
         </div>

         <div className="relative h-full flex flex-col pt-24 pb-12 px-8 overflow-y-auto">
            {/* Mobile Header in Overlay */}
            <div className="flex items-center justify-between mb-16">
               <div className="relative w-24 h-6">
                 <Image src="/logo/logo.svg" alt="Shiya" fill className="object-contain" />
               </div>
               <button 
                 onClick={() => setIsMenuOpen(false)}
                 className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"
               >
                 <X size={20} />
               </button>
            </div>
            
            {/* Primary Navigation Links */}
            <div className="flex flex-col gap-4 mb-8">
               {[
                 { name: t('home'), href: "/" },
                 { name: t('projects'), href: "/projects" },
                 { name: t('contact'), href: "/contact" }
               ].map((link, idx) => (
                 <Link 
                   key={link.href} 
                   href={link.href}
                   onClick={() => setIsMenuOpen(false)}
                   className="group flex flex-col gap-1 transition-all"
                   style={{ transitionDelay: `${idx * 100}ms` }}
                 >
                    <div className="flex items-center gap-3">
                       <span className="text-[8px] font-black text-blue-600 uppercase tracking-[0.4em]">0{idx + 1}</span>
                       <span className={`text-2xl font-black uppercase tracking-tighter ${pathname === link.href ? 'text-white' : 'text-white/40'}`}>
                          {link.name}
                       </span>
                    </div>
                 </Link>
               ))}
            </div>

            {/* Services Focus (Complete List) */}
            <div className="mb-8">
               <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] mb-4 block font-sans">Strategic Services</span>
               <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: "Influencer/KOL", href: "/services/influencer" },
                    { name: "Production", href: "/services/production" },
                    { name: "Graphic Design", href: "/services/graphic-design" },
                    { name: "VDO Motion", href: "/services/vdo-motion" },
                    { name: "Mix master Music", href: "/services/mix-master-music" }
                  ].map((service) => (
                    <Link 
                      key={service.name} 
                      href={service.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5 hover:bg-white/10 transition-all"
                    >
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{service.name}</span>
                       <ArrowUpRight size={12} className="text-white/20" />
                    </Link>
                  ))}
               </div>
            </div>
            
            {/* Bottom Actions Stack */}
            <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-6">
               <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                     {[Camera, Send, Zap, Globe].map((Icon, idx) => (
                       <div key={idx} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                          <Icon size={14} />
                       </div>
                     ))}
                  </div>
                  <button 
                    onClick={handleLanguageToggle}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-[9px] font-black uppercase tracking-widest text-white"
                  >
                    {locale === 'en' ? 'ไทย' : 'English'}
                  </button>
               </div>
               
               <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-0.5 text-left">
                     <p className="text-[7px] font-bold uppercase tracking-[0.4em] text-white/10">© 2024 Shiya Studio</p>
                     <p className="text-[7px] font-bold uppercase tracking-[0.4em] text-white/10">All Rights Reserved</p>
                  </div>
                  <p className="text-[7px] font-bold uppercase tracking-[0.4em] text-blue-600/30">Based in Bangkok</p>
               </div>
            </div>

         </div>
      </div>
    </>
  );
};
