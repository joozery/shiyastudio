"use client";

import React from "react";
import { Search, Globe, Menu, ChevronDown } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import Image from "next/image";
import { Link, usePathname, useRouter } from '@/navigation';

export const Navbar = () => {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageToggle = () => {
    const nextLocale = locale === 'en' ? 'th' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <nav className="relative w-full flex items-center justify-between px-6 md:px-12 py-6 bg-black text-white border-b border-white/5 z-[100]">
      {/* Logo Image */}
      <Link href="/" className="flex items-center gap-4 group">
        <div className="relative w-40 h-10 md:w-48 md:h-12">
          <Image 
            src="/logo/logo.svg" 
            alt="Shiya Studio Logo" 
            fill 
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </div>
      </Link>
      
      {/* Menu Links */}
      <div className="hidden lg:flex items-center gap-12 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
        <Link href="/" className="hover:opacity-50 transition-opacity">{t('home')}</Link>
        
        {/* Services Dropdown */}
        <div className="relative group cursor-pointer">
           <div className="flex items-center gap-1.5 hover:opacity-50 transition-opacity">
              {t('services')} <ChevronDown className="w-3 h-3 text-white/50 group-hover:rotate-180 transition-transform" />
           </div>
           
           <div className="absolute top-full left-0 pt-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
              <div className="w-56 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden p-3 shadow-2xl">
                 {t.raw('s_list').map((sub: string) => (
                    <div key={sub} className="px-4 py-3 rounded-xl hover:bg-white/5 text-[9px] text-white/40 hover:text-white transition-all cursor-pointer">
                       {sub}
                    </div>
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
      <div className="flex items-center gap-3 md:gap-6">
        <button 
          onClick={handleLanguageToggle}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all text-[9px] font-bold uppercase tracking-widest"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{locale === 'en' ? 'TH' : 'EN'}</span>
        </button>
        <button className="hover:opacity-50 transition-opacity p-2 bg-white/10 rounded-full backdrop-blur-md">
          <Search className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button className="lg:hidden hover:opacity-50 transition-opacity p-2 bg-white/10 rounded-full">
          <Menu className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </nav>
  );
};
