"use client";

import React from "react";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "@/navigation";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#050505] text-white pt-16 pb-8 border-t border-white/10 font-sans">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          
          {/* Col 1: Brand */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="flex flex-col tracking-widest">
              <span className="text-xl font-black tracking-[0.2em]">S H I Y A</span>
              <span className="text-[9px] font-bold tracking-[0.4em] text-white/70">STUDIO</span>
            </div>
            <p className="text-white/50 text-[10px] leading-relaxed pr-2">
              Creative branding agency & production studio. We create immersive content and meaningful connections.
            </p>
            <div className="flex items-center gap-2 mt-1">
               {/* Social Icons using inline SVGs to match design exactly */}
               <a href="#" className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors text-white/80">
                 <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
               </a>
               <a href="#" className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors text-white/80">
                 <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
               </a>
               <a href="#" className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors text-white/80">
                 <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
               </a>
               <a href="#" className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors text-white/80">
                 <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
               </a>
               <a href="#" className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors text-white/80">
                 <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
               </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="flex flex-col gap-4">
             <h4 className="text-[10px] font-bold tracking-widest uppercase">SERVICES</h4>
             <ul className="flex flex-col gap-2">
               {["Influencer Marketing", "Content Production", "Video Production", "Graphic Design", "Motion & Animation", "Audio Production"].map(link => (
                 <li key={link}><a href="#" className="text-white/60 hover:text-white text-[11px]">{link}</a></li>
               ))}
             </ul>
          </div>

          {/* Col 3: Company */}
          <div className="flex flex-col gap-4">
             <h4 className="text-[10px] font-bold tracking-widest uppercase">COMPANY</h4>
             <ul className="flex flex-col gap-2">
               {["About Us", "Our Work", "Blog", "Careers", "Contact"].map(link => (
                 <li key={link}><a href="#" className="text-white/60 hover:text-white text-[11px]">{link}</a></li>
               ))}
             </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="flex flex-col gap-4 lg:col-span-1">
             <h4 className="text-[10px] font-bold tracking-widest uppercase">CONTACT</h4>
             <ul className="flex flex-col gap-3">
                <li className="flex items-center gap-2 text-white/60 text-[11px] hover:text-[#0EA5E9] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-white shrink-0" /> 
                  <a href="mailto:shiya.studioo@gmail.com">shiya.studioo@gmail.com</a>
                </li>
                <li className="flex items-center gap-2 text-white/60 text-[11px] hover:text-[#0EA5E9] transition-colors">
                  <Phone className="w-3.5 h-3.5 text-white shrink-0" /> 
                  <a href="tel:0868329299">086-832-9299</a>
                </li>
                <li className="flex items-start gap-2 text-white/60 text-[11px] leading-relaxed hover:text-[#0EA5E9] transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" /> 
                  <a href="https://maps.google.com/?q=23/125+หมู่บ้าน+สถาปัตย์+ซอย+นวมินทร์161+แยก1-4+ถนน+นวมินทร์+แขวง+นวลจันทร์+เขต+บึงกุ่ม+กทม.+10230" target="_blank" rel="noopener noreferrer">
                    23/125 หมู่บ้าน สถาปัตย์ ซอย นวมินทร์161 แยก1-4<br/>ถนน นวมินทร์ แขวง นวลจันทร์ เขต บึงกุ่ม กทม. 10230
                  </a>
                </li>
             </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="flex flex-col gap-4 lg:col-span-1">
             <h4 className="text-[10px] font-bold tracking-widest uppercase">NEWSLETTER</h4>
             <p className="text-white/60 text-[11px] leading-relaxed mb-1">
               Get the latest updates on<br/>campaigns and insights.
             </p>
             <form className="relative w-full max-w-[240px]">
               <input 
                 type="email" 
                 placeholder="Your email" 
                 className="w-full bg-transparent border border-white/20 rounded-md py-2.5 pl-3 pr-10 text-[11px] text-white placeholder-white/40 focus:outline-none focus:border-[#0EA5E9] transition-colors"
               />
               <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0EA5E9] hover:text-white transition-colors p-1">
                 <ArrowRight className="w-3.5 h-3.5" />
               </button>
             </form>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-[10px]">
           <p>© 2026 หจก. ชิญ่า สตูดิโอ All rights reserved.</p>
           <div className="flex items-center gap-3">
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <span>|</span>
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
           </div>
        </div>
      </div>
    </footer>
  );
};
