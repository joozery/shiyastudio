"use client";

import React from "react";
import { 
  ArrowUpRight, 
  Mail,
  MapPin,
  Phone,
  Camera,
  Send,
  Code,
  Globe,
  Zap
} from "lucide-react";
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export const Footer = () => {
  const t = useTranslations('footer');

  return (
    <footer className="relative w-full bg-black text-white pt-24 pb-12 px-6 md:px-12 font-sans overflow-hidden border-t border-white/5">
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Section: Big CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-12 mb-16 md:mb-32">
          <div className="max-w-2xl text-left">
            <h2 
              className="text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6 md:mb-8"
              dangerouslySetInnerHTML={{ 
                __html: t.raw('cta').replace('<highlight>', '<span class="text-blue-600 underline decoration-blue-600/30 underline-offset-8">').replace('</highlight>', '</span>') 
              }}
            />
            <p className="text-white/40 text-[10px] sm:text-xs md:text-sm md:text-base font-medium max-w-md leading-relaxed">
               {t('rights')}
            </p>
          </div>
          
          <Link href="/contact" className="group relative ml-auto md:ml-0">
             <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full bg-white text-black flex items-center justify-center transition-all duration-500 hover:bg-blue-600 hover:text-white hover:scale-105 active:scale-95 shadow-xl group-hover:shadow-[0_0_50px_rgba(37,99,235,0.4)]">
                <ArrowUpRight className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 group-hover:rotate-12 transition-transform" />
             </div>
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500 text-white">
                {t('cta_btn')}
             </div>
          </Link>
        </div>

        {/* Middle Section: Links & Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 border-t border-white/10 pt-16 mb-24">
          
          {/* Column 1: Shiya info */}
          <div className="col-span-2 lg:col-span-2 text-left">
             <div className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                Shiya<span className="text-blue-600">Studio</span>
             </div>
             <div className="space-y-4 text-white/40 text-[13px]">
                <div className="flex items-center gap-3 group cursor-pointer text-left">
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                   </div>
                   <span className="group-hover:text-white transition-colors">hello@shiya.studio</span>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer text-left">
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                      <Phone className="w-3.5 h-3.5 text-blue-500" />
                   </div>
                   <span className="group-hover:text-white transition-colors">+66 99 123 4567</span>
                </div>
                <div className="flex items-start gap-3 group cursor-pointer text-left">
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                   </div>
                   <span className="max-w-[200px] group-hover:text-white transition-colors">Sukhumvit Rd, Khlong Toei, Bangkok 10110, Thailand</span>
                </div>
             </div>
          </div>

          {/* Column 2: Services */}
          <div>
             <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-8">{t('services')}</h4>
             <ul className="flex flex-col gap-4 text-sm font-medium text-white/60 text-left">
                {["Influencer/KOL", "Production", "Graphic Design", "VDO Motion"].map((item) => (
                   <li key={item} className="hover:text-blue-500 transition-colors cursor-pointer whitespace-nowrap">{item}</li>
                ))}
             </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
             <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-8 text-left">{t('legal')}</h4>
             <ul className="flex flex-col gap-4 text-sm font-medium text-white/60 text-left">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                   <li key={item} className="hover:text-blue-500 transition-colors cursor-pointer">{item}</li>
                ))}
             </ul>
          </div>

          {/* Column 4: Social */}
          <div className="flex flex-col text-left">
             <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-8">{t('social')}</h4>
             <div className="flex gap-4">
                {[Camera, Send, Code, Globe, Zap].map((Icon, idx) => (
                   <div key={idx} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-pointer">
                      <Icon className="w-4 h-4" />
                   </div>
                ))}
             </div>
          </div>

        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 text-center md:text-left">
           <div>© 2024 Shiya Studio. {t('rights')}</div>
           <div className="flex gap-8">
              <span className="hover:text-white cursor-pointer transition-colors">FB</span>
              <span className="hover:text-white cursor-pointer transition-colors">IG</span>
              <span className="hover:text-white cursor-pointer transition-colors">BE</span>
           </div>
        </div>

      </div>
    </footer>
  );
};
