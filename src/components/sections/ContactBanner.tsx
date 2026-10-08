"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/navigation";

export function ContactBanner() {
  const thai = useLocale() === "th";
  return (
    <section aria-labelledby="contact-banner-heading" className="relative isolate overflow-hidden bg-black text-white">
      <Image src="/hero-reference-v2.png" alt="" fill sizes="100vw" className="-z-20 object-cover object-[65%_center] md:object-center" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,8,20,0.65)_40%,rgba(0,0,0,0.08)_100%)]" />
      <div className="mx-auto flex min-h-[420px] max-w-[1600px] items-center px-6 py-16 md:min-h-[480px] md:px-10 lg:min-h-[540px] lg:px-16">
        <div className="max-w-2xl">
          <p className="mb-6 text-xs font-medium tracking-[0.14em] text-blue-200">LET’S WORK TOGETHER</p>
          <h2 id="contact-banner-heading" className="text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-tight">HAVE SOMETHING<br />IN <span className="text-blue-400">MIND?</span></h2>
          <p className="mt-6 max-w-md text-base leading-7 text-white/85 md:text-lg">{thai ? 'มาคุยกันว่าเราจะช่วยให้แบรนด์ของคุณเติบโตได้อย่างไร' : 'Let’s talk about how we can help your brand grow.'}</p>
          <Link href="/contact" className="mt-8 inline-flex min-h-12 items-center gap-8 rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#0756c7] transition-colors hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400">{thai ? 'เริ่มโปรเจกต์กับเรา' : 'Contact us'}<ArrowUpRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}
