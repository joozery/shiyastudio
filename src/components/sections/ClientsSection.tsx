"use client";

import React, { useState, useEffect } from "react";
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

export const ClientsSection = () => {
  const t = useTranslations('clients');
  const [mounted, setMounted] = useState(false);
  const [clients, setClients] = useState<any[]>([
    { name: "Aether", image: "" },
    { name: "Lumina", image: "" },
    { name: "GlobalTech", image: "" },
    { name: "Horizon", image: "" },
    { name: "Vitality", image: "" },
    { name: "Sentinely", image: "" },
    { name: "Zenith", image: "" },
    { name: "Vertex", image: "" }
  ]);

  useEffect(() => {
    setMounted(true);
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => {
        if (data && data.clients && data.clients.length > 0) {
          setClients(data.clients);
        }
      })
      .catch(err => console.error('Failed to load clients', err));
  }, []);

  const reversedLogos = [...clients].reverse();

  return (
    <section className="relative w-full py-16 md:py-32 bg-black text-white px-4 md:px-12 font-sans overflow-hidden border-t border-white/5">
      
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
        <div className="relative w-full overflow-hidden flex flex-col gap-10 md:gap-16">
          {mounted && (
            <>
              {/* Row 1: Left to Right */}
              <div className="flex w-full overflow-hidden">
                 <div className="flex whitespace-nowrap animate-marquee gap-4 md:gap-6 items-center">
                    {[...clients, ...clients].map((client, idx) => (
                      <div key={idx} className="flex-shrink-0 group cursor-pointer">
                        <div className="w-36 h-16 rounded-2xl overflow-hidden border border-white/10 group-hover:border-blue-500/60 transition-all duration-500 bg-zinc-900">
                           {client.image ? (
                              <img src={client.image} alt={client.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors select-none">
                                  {client.name}
                                </span>
                              </div>
                           )}
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Row 2: Right to Left */}
              <div className="flex w-full overflow-hidden">
                 <div className="flex whitespace-nowrap animate-marquee2 gap-4 md:gap-6 items-center">
                    {[...reversedLogos, ...reversedLogos].map((client, idx) => (
                      <div key={idx} className="flex-shrink-0 group cursor-pointer">
                        <div className="w-36 h-16 rounded-2xl overflow-hidden border border-white/10 group-hover:border-blue-500/60 transition-all duration-500 bg-zinc-900">
                           {client.image ? (
                              <img src={client.image} alt={client.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-blue-400/60 transition-colors select-none">
                                  {client.name}
                                </span>
                              </div>
                           )}
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </>
          )}
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
