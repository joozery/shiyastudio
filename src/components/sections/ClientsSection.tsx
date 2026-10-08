"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/navigation";
import styles from "./ClientsSection.module.css";

interface Client {
  name: string;
  image?: string;
}

export const ClientsSection = ({ initialData }: { initialData?: { clients?: Client[] } }) => {
  const t = useTranslations("clients");
  const thai = useLocale() === "th";
  const clients = initialData?.clients ?? [];
  if (!clients.length) return null;

  return (
    <section aria-labelledby="clients-heading" className="bg-[#030910] bg-[url('/cover1.png')] bg-cover bg-center bg-no-repeat px-6 py-14 text-white md:px-10 md:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-9 grid gap-6 md:mb-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="mb-5 flex items-center gap-3 text-xs font-medium tracking-[0.12em] text-blue-300"><span className="size-1.5 rounded-full bg-blue-400" />OUR CLIENTS & PARTNERS</p>
            <h2 id="clients-heading" className="max-w-2xl text-[clamp(1.75rem,3.5vw,3rem)] font-medium leading-[1.35] tracking-tight">{thai ? <><span className="block">ได้รับความไว้วางใจ</span><span className="block">จากเหล่าผู้มีวิสัยทัศน์</span></> : t('label')}</h2>
          </div>
          <div className="max-w-md lg:col-span-5 lg:justify-self-end lg:pt-10">
            <p className="text-sm leading-7 text-white/65 md:text-base">{thai ? 'ความไว้วางใจจากแบรนด์ที่เราได้ร่วมสร้างสรรค์ผลงาน คือแรงผลักดันให้เราพัฒนาทุกไอเดียให้ดียิ่งขึ้น' : 'The trust of the brands we work with inspires us to make every idea stronger, every story clearer and every collaboration more meaningful.'}</p>
            <Link href="/contact" className="mt-4 inline-flex min-h-11 items-center gap-3 text-sm font-medium text-blue-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400">{t('cta')}<ArrowUpRight size={17} /></Link>
          </div>
        </div>

        <div className="space-y-4">
          {[clients.slice(0, Math.ceil(clients.length / 2)), clients.slice(Math.ceil(clients.length / 2))].filter(row => row.length).map((row, rowIndex) => (
            <div key={rowIndex} className={styles.viewport} tabIndex={0} role="region" aria-label={thai ? `โลโก้ลูกค้า แถว ${rowIndex + 1}` : `Client logos row ${rowIndex + 1}`}>
              <div className={`${styles.track} ${rowIndex === 1 ? styles.reverse : ''}`}>
                {[0, 1].map(copy => <ul key={copy} aria-hidden={copy === 1 ? true : undefined} className={styles.group}>
                  {row.map((client, index) => <li key={`${client.name}-${index}`} className="flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-blue-200/70 bg-[linear-gradient(135deg,#ffffff_0%,#edf4ff_100%)] p-1 shadow-[0_8px_30px_#0000001a] md:h-28 md:w-44 transition-colors hover:border-blue-400">
                    {client.image ? <div className="relative h-full w-full"><Image src={client.image} alt={copy === 0 ? client.name : ''} fill sizes="(max-width: 768px) 134px, 166px" className="object-contain" /></div> : <span className="px-3 text-center text-sm font-semibold text-[#263447]">{client.name}</span>}
                  </li>)}
                </ul>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
