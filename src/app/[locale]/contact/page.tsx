"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight,
  Camera,
  Globe,
  Zap,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('contact');
  const common = useTranslations('footer');

  return (
    <main className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Absolute Navbar over Banner */}
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Hero Banner Section */}
      <div className="relative w-full h-[45vh] md:h-[55vh] min-h-[400px] overflow-hidden">
        <Image 
          src="/contact-banner-wide.png" 
          alt="Contact Banner" 
          fill 
          className="object-cover brightness-[0.5] scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        {/* Banner Decorative Text */}
        <div className="absolute bottom-12 left-6 md:left-12 flex flex-col gap-2">
           <div className="flex items-center gap-3">
             <div className="w-8 h-[1px] bg-blue-500" />
             <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-blue-500">Contact Us</span>
           </div>
           <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">EST. 2024 / SHIYA STUDIO</p>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Side: Form */}
          <div className="flex flex-col gap-12 text-left">
            <div className="flex flex-col gap-4">
              <h1 
                className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]"
                dangerouslySetInnerHTML={{ __html: t('title') }}
              />
              <p className="text-white/40 text-sm md:text-base font-medium max-w-md mt-4">
                {t('subtitle')}
              </p>
            </div>

            <form className="space-y-8 max-w-xl">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">{t('label_name')}</label>
                     <input type="text" className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">{t('label_email')}</label>
                     <input type="email" className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium" />
                  </div>
               </div>

               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">{t('label_service')}</label>
                  <div className="flex flex-wrap gap-2">
                     {["Influencer", "Production", "Design", "Marketing"].map((s) => (
                        <button key={s} type="button" className="px-5 py-2 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                           {s}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">{t('label_message')}</label>
                  <textarea rows={4} className="bg-white/5 border border-white/10 rounded-[2rem] py-4 px-6 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium resize-none" />
               </div>

               <button className="group flex items-center gap-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full pl-8 pr-2 py-2 transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">{t('btn_send')}</span>
                  <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                     <ArrowUpRight size={18} />
                  </div>
               </button>
            </form>
          </div>

          {/* Right Side: Info */}
          <div className="flex flex-col gap-12 lg:pt-20">
            
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
               <InfoItem 
                  icon={<Mail className="text-blue-500 w-4 h-4" />} 
                  label="Email" 
                  value="hello@shiya.studio" 
               />
               <InfoItem 
                  icon={<Phone className="text-blue-500 w-4 h-4" />} 
                  label="Phone" 
                  value="+66 99 123 4567" 
               />
               <InfoItem 
                  icon={<MapPin className="text-blue-500 w-4 h-4" />} 
                  label={t('info_office')} 
                  value="Sukhumvit Rd, Khlong Toei, Bangkok 10110" 
               />
            </div>

            {/* Social Block - Redesigned */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
               <div className="flex justify-between items-center px-1">
                  <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">{t('info_social')}</h4>
                  <div className="text-[8px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1">
                    Connect <ChevronRight size={10} />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <SocialLink icon={<Camera size={16} />} name="Instagram" hoverColor="hover:text-pink-500" />
                  <SocialLink icon={<Send size={16} />} name="Facebook" hoverColor="hover:text-blue-500" />
                  <SocialLink icon={<Globe size={16} />} name="Behance" hoverColor="hover:text-blue-400" />
                  <SocialLink icon={<Zap size={16} />} name="TikTok" hoverColor="hover:text-purple-500" />
               </div>
            </div>

            {/* Bottom Slogan */}
            <div className="mt-auto pl-4 border-l border-white/5 flex flex-col gap-1">
               <p className="text-[30px] font-black uppercase tracking-tighter leading-none opacity-5">SHIYA<br/>STUDIO</p>
               <p className="text-[7px] font-bold uppercase tracking-[0.5em] text-white/10">Crafting Visual Narratives</p>
            </div>

          </div>

        </div>

        {/* Map Section */}
        <div className="mt-24 relative w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
           {/* Dark Map Overlay for extra mood */}
           <div className="absolute inset-0 z-10 pointer-events-none border-[12px] border-black/20 rounded-[2.5rem]" />
           
           <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.7601264426!2d100.5739678759024!3d13.731424186657922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f0322c36671%3A0x742728362ea700!2sThe%20Commons!5e0!3m2!1sen!2sth!4v1712674201021!5m2!1sen!2sth" 
             className="w-full h-full grayscale invert contrast-[1.2] opacity-60 hover:opacity-100 transition-opacity duration-700"
             style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(110%)' }}
             allowFullScreen={true}
             loading="lazy" 
             referrerPolicy="no-referrer-when-downgrade"
           />

           {/* Custom Floating Pin Label */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
              <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                 Shiya Studio
              </div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping" />
           </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}

function SocialLink({ icon, name, hoverColor }: any) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 transition-all cursor-pointer group ${hoverColor} hover:bg-white/[0.08]`}>
       <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-current/10 transition-colors">
          {icon}
       </div>
       <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 group-hover:text-current transition-colors">{name}</span>
    </div>
  );
}

function InfoItem({ icon, label, value }: any) {
  return (
    <div className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group cursor-pointer text-left">
       <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0 group-hover:bg-blue-600/20 transition-colors">
          {icon}
       </div>
       <div className="flex flex-col gap-0.5 text-left">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">{label}</span>
          <p className="text-xs md:text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{value}</p>
       </div>
    </div>
  );
}
