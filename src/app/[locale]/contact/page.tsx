"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Check, CheckCircle2, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/navigation";

const address = "23/125 หมู่บ้าน สถาปัตย์ ซอย นวมินทร์161 แยก1-4 ถนน นวมินทร์ แขวง นวลจันทร์ เขต บึงกุ่ม กทม. 10230";
const mapQuery = encodeURIComponent(address);
const serviceOptions = ["Influencer", "Production", "Design", "Marketing"];
const inputStyle = "min-h-12 w-full rounded-lg border border-[#dce1e8] bg-[#f8f9fb] px-4 py-3 text-base text-[#101820] placeholder:text-[#8b95a3] focus:border-blue-500 focus:bg-white focus:outline-2 focus:outline-blue-500/20 transition-colors disabled:opacity-60";

export default function ContactPage() {
  const t = useTranslations("contact");
  const thai = useLocale() === "th";
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (service: string) => {
    setSelectedServices(previous => previous.includes(service) ? previous.filter(value => value !== service) : [...previous, service]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error(thai ? "กรุณากรอกชื่อและอีเมล" : "Please enter your name and email.");
      return;
    }
    setLoading(true);
    setStatus("idle");
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, name: formData.name.trim(), email: formData.email.trim(), services: selectedServices }),
      });
      if (!response.ok) throw new Error("Contact submission failed");
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setSelectedServices([]);
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f2f4f7] text-[#101820]">
      <Navbar overlay />
      <section aria-labelledby="contact-heading" className="relative isolate overflow-hidden bg-[#030910] text-white">
        <Image src="/contact-banner-wide.png" alt="" fill sizes="100vw" preload className="-z-20 object-cover object-[center_60%]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#02070ff2_0%,#041127cc_50%,#02070f55_100%)]" />
        <div className="mx-auto max-w-[1600px] px-6 pb-14 pt-36 md:px-10 md:pb-20 md:pt-44 lg:px-16">
          <div className="mb-8 flex items-center gap-3 text-xs text-white/55"><Link href="/" className="transition-colors hover:text-white">{thai ? 'หน้าแรก' : 'Home'}</Link><span>/</span><span className="text-blue-300">{thai ? 'ติดต่อเรา' : 'Contact'}</span></div>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="mb-5 text-xs font-medium tracking-[0.16em] text-blue-300">LET’S MAKE IT HAPPEN</p>
              <h1 id="contact-heading" className="text-[clamp(2.25rem,4.6vw,4.5rem)] font-medium leading-[1.25] tracking-tight">{thai ? <>มาเริ่มโปรเจกต์<br /><span className="text-blue-400">ครั้งใหม่ด้วยกัน</span></> : <>Let’s start a<br /><span className="text-blue-400">new project.</span></>}</h1>
            </div>
            <div className="max-w-md lg:col-span-4 lg:pb-2"><p className="text-sm leading-7 text-white/70 md:text-base">{t('subtitle')}</p><a href="#project-inquiry" className="mt-6 inline-flex min-h-11 items-center gap-3 text-sm font-medium text-white">{thai ? 'เล่าไอเดียของคุณให้เราฟัง' : 'Tell us what you have in mind'}<span className="flex size-9 items-center justify-center rounded-full border border-white/30"><ArrowDown size={16} /></span></a></div>
          </div>
        </div>
      </section>

      <section id="project-inquiry" aria-labelledby="inquiry-heading" className="scroll-mt-24">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-6 py-12 md:px-10 md:py-20 lg:grid-cols-12 lg:gap-12 lg:px-16">
          <div className="rounded-2xl border border-[#e3e7ed] bg-white p-6 md:p-10 lg:col-span-7">
            <p className="mb-3 text-xs font-medium tracking-[0.14em] text-blue-600">YOUR NEXT PROJECT</p>
            <h2 id="inquiry-heading" className="text-2xl font-medium tracking-tight md:text-3xl">{thai ? 'ไอเดียดี ๆ เริ่มต้นจากการคุยกัน' : 'Good ideas start with a conversation.'}</h2>
            <p className="mt-3 text-sm leading-7 text-[#697586]">{thai ? 'ฝากรายละเอียดไว้ แล้วทีมของเราจะติดต่อกลับเพื่อคุยเรื่องโปรเจกต์ของคุณ' : 'Share a few details and our team will get in touch to discuss your project.'}</p>
            <form onSubmit={handleSubmit} className="mt-8" aria-busy={loading}>
              <fieldset disabled={loading} className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div><label htmlFor="contact-name" className="mb-2 block text-sm font-medium">{t('label_name')} <span className="text-blue-600">*</span></label><input id="contact-name" name="name" autoComplete="name" required maxLength={200} value={formData.name} onChange={event => setFormData({ ...formData, name: event.target.value })} placeholder={thai ? 'ชื่อของคุณ' : 'Your name'} className={inputStyle} /></div>
                  <div><label htmlFor="contact-email" className="mb-2 block text-sm font-medium">{t('label_email')} <span className="text-blue-600">*</span></label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={formData.email} onChange={event => setFormData({ ...formData, email: event.target.value })} placeholder="you@company.com" className={inputStyle} /></div>
                </div>
                <fieldset><legend className="mb-3 text-sm font-medium">{t('label_service')} <span className="ml-1 text-xs font-normal text-[#697586]">{thai ? '(เลือกได้หลายบริการ)' : '(select all that apply)'}</span></legend><div className="flex flex-wrap gap-2">{serviceOptions.map(service => <label key={service} className={`relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-500 ${selectedServices.includes(service) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-[#dce1e8] text-[#586577] hover:border-blue-400'}`}><input type="checkbox" name="services" value={service} checked={selectedServices.includes(service)} onChange={() => toggleService(service)} className="sr-only" />{selectedServices.includes(service) && <Check size={14} />}{service}</label>)}</div></fieldset>
                <div><label htmlFor="contact-message" className="mb-2 block text-sm font-medium">{t('label_message')}</label><textarea id="contact-message" name="message" rows={5} maxLength={10000} value={formData.message} onChange={event => setFormData({ ...formData, message: event.target.value })} placeholder={thai ? 'แบรนด์ของคุณ เป้าหมาย หรือไอเดียที่อยากทำ…' : 'Your brand, goals or the idea you’d like to explore…'} className={`${inputStyle} min-h-36 resize-y`} /></div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-6 text-[#697586]">{thai ? '* ช่องที่จำเป็นต้องกรอก' : '* Required fields'}</p><button type="submit" disabled={loading} className="inline-flex min-h-12 items-center justify-center gap-6 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 disabled:cursor-wait disabled:opacity-60">{loading ? (thai ? 'กำลังส่งข้อความ…' : 'Sending…') : t('btn_send')}{loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowUpRight size={18} />}</button></div>
              </fieldset>
              <div aria-live="polite" aria-atomic="true">{status === 'success' && <p className="mt-5 flex items-start gap-2 rounded-lg bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"><CheckCircle2 size={18} className="mt-0.5 shrink-0" />{thai ? 'ได้รับข้อความแล้ว ขอบคุณที่สนใจร่วมงานกับเรา ทีมงานจะติดต่อกลับครับ' : 'Thank you! We’ve received your message and our team will be in touch.'}</p>}{status === 'error' && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-4 text-sm leading-6 text-red-700">{thai ? 'ส่งข้อความไม่สำเร็จ กรุณาลองอีกครั้ง หรือติดต่อเราทางอีเมลหรือโทรศัพท์' : 'Your message could not be sent. Please try again or contact us by email or phone.'}</p>}</div>
            </form>
          </div>

          <aside aria-labelledby="details-heading" className="flex flex-col gap-6 lg:col-span-5">
            <div className="rounded-2xl bg-[linear-gradient(145deg,#061126,#0c2855)] p-6 text-white md:p-9">
              <p className="mb-3 text-xs font-medium tracking-[0.14em] text-blue-300">DIRECT CONNECTION</p><h2 id="details-heading" className="text-2xl font-medium">{thai ? 'คุยกับเราได้โดยตรง' : 'Let’s connect directly.'}</h2>
              <div className="mt-7 divide-y divide-white/15">
                <a href="mailto:shiya.studioo@gmail.com" className="group flex items-start gap-4 py-5"><Mail size={20} className="mt-1 shrink-0 text-blue-300" /><span className="min-w-0 flex-1"><span className="mb-2 block text-xs text-white/50">{thai ? 'อีเมล' : 'Email'}</span><span className="break-all text-base font-medium transition-colors group-hover:text-blue-300 md:text-lg">shiya.studioo@gmail.com</span></span><ArrowUpRight size={18} className="mt-1 shrink-0 text-white/40" /></a>
                <a href="tel:0868329299" className="group flex items-start gap-4 py-5"><Phone size={20} className="mt-1 shrink-0 text-blue-300" /><span className="flex-1"><span className="mb-2 block text-xs text-white/50">{thai ? 'โทรศัพท์' : 'Phone'}</span><span className="text-lg font-medium transition-colors group-hover:text-blue-300">086-832-9299</span></span><ArrowUpRight size={18} className="mt-1 text-white/40" /></a>
              </div>
            </div>
            <div className="flex-1 rounded-2xl border border-[#e3e7ed] bg-white p-6 md:p-9"><div className="mb-5 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-blue-50 text-blue-600"><MapPin size={20} /></span><h3 className="text-lg font-medium">{t('info_office')}</h3></div><p className="max-w-md text-sm leading-7 text-[#697586]">{address}</p><a href={`https://maps.google.com/?q=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-3 text-sm font-medium text-blue-600 hover:text-blue-800">{thai ? 'เปิดเส้นทางใน Google Maps' : 'Open in Google Maps'}<ArrowUpRight size={17} /></a><p className="mt-8 text-xs tracking-[0.14em] text-[#8b95a3]">SHIYA STUDIO / BANGKOK</p></div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="location-heading" className="mx-auto max-w-[1600px] px-6 pb-12 md:px-10 md:pb-20 lg:px-16">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-medium tracking-[0.14em] text-blue-600">FIND THE STUDIO</p><h2 id="location-heading" className="text-2xl font-medium">{thai ? 'แล้วพบกันที่สตูดิโอ' : 'Find us in Bangkok.'}</h2></div><a href={`https://maps.google.com/?q=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 text-sm text-[#697586] hover:text-blue-600">Google Maps<ArrowUpRight size={16} /></a></div>
        <div className="h-72 overflow-hidden rounded-2xl border border-[#dce1e8] bg-[#e8edf3] md:h-96"><iframe title={thai ? 'แผนที่ที่อยู่ Shiya Studio' : 'Shiya Studio address map'} src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`} className="h-full w-full border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
      </section>
      <Footer showCta={false} />
    </main>
  );
}
