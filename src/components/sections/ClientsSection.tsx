"use client";

import React from "react";
import { 
  Zap, 
  Cpu, 
  Globe, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Eclipse, 
  Hexagon 
} from "lucide-react";
import { useTranslations } from 'next-intl';

const clientLogos = [
  { name: "Aether", icon: <Zap className="w-6 h-6" /> },
  { name: "Lumina", icon: <Cpu className="w-6 h-6" /> },
  { name: "GlobalTech", icon: <Globe className="w-6 h-6" /> },
  { name: "Horizon", icon: <Layers className="w-6 h-6" /> },
  { name: "Vitality", icon: <Activity className="w-6 h-6" /> },
  { name: "Sentinely", icon: <ShieldCheck className="w-6 h-6" /> },
  { name: "Zenith", icon: <Eclipse className="w-6 h-6" /> },
  { name: "Vertex", icon: <Hexagon className="w-6 h-6" /> },
];

export const ClientsSection = () => {
  const t = useTranslations('clients');
  // Create a reversed copy to avoid mutating the original array (Fixes Hydration error)
  const reversedLogos = [...clientLogos].reverse();

  return (
    <section className="relative w-full py-24 md:py-32 bg-black text-white px-6 md:px-12 font-sans overflow-hidden border-t border-white/5">
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] -translate-y-1/2 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Subtle Label */}
        <div className="flex items-center gap-3 mb-10 opacity-40">
           <div className="w-12 h-[1px] bg-white" />
           <span className="text-[10px] font-bold uppercase tracking-[0.4em]">{t('label')}</span>
           <div className="w-12 h-[1px] bg-white" />
        </div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden flex flex-col gap-16">
          
          {/* Row 1: Left to Right */}
          <div className="flex w-full overflow-hidden">
             <div className="flex whitespace-nowrap animate-marquee gap-20 items-center">
                {[...clientLogos, ...clientLogos].map((client, idx) => (
                  <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-blue-500 group-hover:bg-blue-500/10 transition-all duration-500">
                       <span className="text-white/40 group-hover:text-blue-400 transition-colors">
                          {client.icon}
                       </span>
                    </div>
                    <span className="text-xl md:text-3xl font-black uppercase tracking-tighter text-white/10 group-hover:text-white transition-all duration-500 select-none italic">
                       {client.name}
                    </span>
                  </div>
                ))}
             </div>
          </div>

          {/* Row 2: Right to Left */}
          <div className="flex w-full overflow-hidden">
             <div className="flex whitespace-nowrap animate-marquee2 gap-20 items-center">
                {[...reversedLogos, ...reversedLogos].map((client, idx) => (
                  <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-blue-500 group-hover:bg-blue-500/10 transition-all duration-500">
                       <span className="text-white/40 group-hover:text-blue-400 transition-colors">
                          {client.icon}
                       </span>
                    </div>
                    <span className="text-xl md:text-3xl font-bold uppercase tracking-tighter text-white/20 group-hover:text-blue-400 transition-all duration-500 select-none">
                       {client.name}
                    </span>
                  </div>
                ))}
             </div>
          </div>

        </div>

        {/* Bottom Call to Action */}
        <div className="mt-24 text-center">
           <p className="text-sm md:text-base text-white/40 max-w-lg mx-auto leading-relaxed">
             {t('desc')}
           </p>
           <button className="mt-8 px-8 py-3 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              {t('cta')}
           </button>
        </div>

      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 35s linear infinite;
        }
      `}</style>
    </section>
  );
};
