"use client";

import React, { useState, useEffect } from 'react';
import { 
  AppWindow,
  Layers,
  FileText,
  Users,
  Video,
  ArrowUpRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Database,
  Activity,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  sections: {
    hero: { slides: number; lastUpdated: string | null };
    services: { count: number; lastUpdated: string | null };
    projects: { count: number; lastUpdated: string | null };
    clients: { count: number; lastUpdated: string | null };
    influencer: { items: number; categories: number; lastUpdated: string | null };
  };
  totals: {
    totalSections: number;
    totalItems: number;
    lastModified: string | null;
    configuredSections: number;
  };
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'ยังไม่เคยตั้งค่า';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'เมื่อกี้นี้';
  if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
  if (diffHrs < 24) return `${diffHrs} ชั่วโมงที่แล้ว`;
  return `${diffDays} วันที่แล้ว`;
}

const SECTION_CONFIG = [
  {
    key: 'hero',
    label: 'Hero Section',
    sublabel: 'แบนเนอร์หน้าแรก',
    icon: <AppWindow size={20} />,
    href: '/th/admin/hero',
    color: 'blue',
    getInfo: (d: DashboardData) => `${d.sections.hero.slides} สไลด์`,
    getUpdated: (d: DashboardData) => d.sections.hero.lastUpdated,
  },
  {
    key: 'services',
    label: 'Services Section',
    sublabel: 'บริการของบริษัท',
    icon: <Layers size={20} />,
    href: '/th/admin/services',
    color: 'violet',
    getInfo: (d: DashboardData) => `${d.sections.services.count} บริการ`,
    getUpdated: (d: DashboardData) => d.sections.services.lastUpdated,
  },
  {
    key: 'projects',
    label: 'Projects Section',
    sublabel: 'ผลงานพอร์ตโฟลิโอ',
    icon: <FileText size={20} />,
    href: '/th/admin/projects',
    color: 'sky',
    getInfo: (d: DashboardData) => `${d.sections.projects.count} โปรเจกต์`,
    getUpdated: (d: DashboardData) => d.sections.projects.lastUpdated,
  },
  {
    key: 'clients',
    label: 'Clients Section',
    sublabel: 'โลโก้ลูกค้า Marquee',
    icon: <Users size={20} />,
    href: '/th/admin/clients',
    color: 'emerald',
    getInfo: (d: DashboardData) => `${d.sections.clients.count} ลูกค้า`,
    getUpdated: (d: DashboardData) => d.sections.clients.lastUpdated,
  },
  {
    key: 'influencer',
    label: 'Influencer Section',
    sublabel: 'กริดสื่อ & หมวดหมู่',
    icon: <Video size={20} />,
    href: '/th/admin/influencer',
    color: 'rose',
    getInfo: (d: DashboardData) => `${d.sections.influencer.items} ไอเทม, ${d.sections.influencer.categories} หมวด`,
    getUpdated: (d: DashboardData) => d.sections.influencer.lastUpdated,
  },
];

const COLOR_MAP: Record<string, { bg: string; icon: string; badge: string; border: string; ring: string }> = {
  blue:    { bg: 'bg-blue-50',    icon: 'text-blue-600 bg-blue-100',   badge: 'bg-blue-600/10 text-blue-600 border-blue-600/10', border: 'border-blue-100', ring: 'ring-blue-500' },
  violet:  { bg: 'bg-violet-50',  icon: 'text-violet-600 bg-violet-100', badge: 'bg-violet-600/10 text-violet-600 border-violet-600/10', border: 'border-violet-100', ring: 'ring-violet-500' },
  sky:     { bg: 'bg-sky-50',     icon: 'text-sky-600 bg-sky-100',     badge: 'bg-sky-600/10 text-sky-600 border-sky-600/10', border: 'border-sky-100', ring: 'ring-sky-500' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600 bg-emerald-100', badge: 'bg-emerald-600/10 text-emerald-600 border-emerald-600/10', border: 'border-emerald-100', ring: 'ring-emerald-500' },
  rose:    { bg: 'bg-rose-50',    icon: 'text-rose-600 bg-rose-100',   badge: 'bg-rose-600/10 text-rose-600 border-rose-600/10', border: 'border-rose-100', ring: 'ring-rose-500' },
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      setData(json);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'อรุณสวัสดิ์' : hour < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น';

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 font-sans space-y-8 animate-in fade-in duration-700">

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-xs font-semibold text-blue-600 mb-1">{greeting} 👋</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-none">
            Website Content <span className="text-blue-600">Overview</span>
          </h1>
          <p className="text-xs text-slate-400 mt-2">ดูภาพรวมและจัดการเนื้อหาทั้งหมดของเว็บไซต์จากที่นี่</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className={`flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm ${refreshing ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> รีเฟรช
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-green-700">ระบบพร้อมใช้งาน</span>
          </div>
        </div>
      </div>

      {/* ─── Summary KPIs ─── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4 text-red-700">
          <AlertCircle size={24} /> <span className="font-semibold text-sm">ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาตรวจสอบ MONGODB_URI ใน .env</span>
        </div>
      ) : data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Section ทั้งหมด"
            value={`${data.totals.configuredSections}/${data.totals.totalSections}`}
            sub={`${data.totals.totalSections - data.totals.configuredSections} ยังไม่ได้ตั้งค่า`}
            icon={<Database size={18} />}
            iconClass="text-blue-600 bg-blue-100"
            valueClass="text-slate-900"
          />
          <KpiCard
            label="รายการทั้งหมด"
            value={String(data.totals.totalItems)}
            sub="Items across all sections"
            icon={<Activity size={18} />}
            iconClass="text-violet-600 bg-violet-100"
            valueClass="text-slate-900"
          />
          <KpiCard
            label="อัพเดตล่าสุด"
            value={data.totals.lastModified ? timeAgo(data.totals.lastModified) : '—'}
            sub={data.totals.lastModified ? new Date(data.totals.lastModified).toLocaleDateString('th-TH') : 'ยังไม่มีข้อมูล'}
            icon={<Clock size={18} />}
            iconClass="text-emerald-600 bg-emerald-100"
            valueClass="text-slate-900"
          />
          <KpiCard
            label="สถานะระบบ"
            value="ปกติ"
            sub="MongoDB connected"
            icon={<Sparkles size={18} />}
            iconClass="text-rose-600 bg-rose-100"
            valueClass="text-green-600"
          />
        </div>
      )}

      {/* ─── Section Cards Grid ─── */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
          <span className="w-6 h-[1.5px] bg-slate-200 inline-block" /> จัดการ Sections
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : error ? null : data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTION_CONFIG.map((sec) => {
              const c = COLOR_MAP[sec.color];
              const updatedAt = sec.getUpdated(data);
              const isConfigured = updatedAt !== null;
              return (
                <Link
                  key={sec.key}
                  href={sec.href}
                  className={`group relative bg-white border ${c.border} rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[180px] focus:outline-none focus:ring-2 ${c.ring}`}
                >
                  {/* Top Row */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${c.icon} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      {sec.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      {isConfigured ? (
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${c.badge}`}>
                          <CheckCircle2 size={10} /> ตั้งค่าแล้ว
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
                          <AlertCircle size={10} /> ใช้ค่าเริ่มต้น
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-blue-600 transition-colors">{sec.label}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{sec.sublabel}</p>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-base font-black text-slate-900">{sec.getInfo(data)}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock size={9} /> {timeAgo(updatedAt)}
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Quick Guide Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[180px] text-white">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">คำแนะนำ</p>
                <h3 className="font-bold text-base text-white leading-snug">เริ่มต้นตั้งค่าเนื้อหาเว็บไซต์</h3>
                <p className="text-xs text-white/50 mt-2 leading-relaxed">คลิกที่แต่ละ Section เพื่อแก้ไขข้อมูล รูปภาพ และข้อความที่แสดงบนหน้าเว็บไซต์</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {SECTION_CONFIG.map((sec) => (
                  <Link key={sec.key} href={sec.href} className={`text-[9px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-slate-900 transition-all`}>
                    {sec.label.replace(' Section', '')}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Detailed Table ─── */}
      {!loading && !error && data && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center">
            <h2 className="font-black text-sm uppercase tracking-tight text-slate-900">รายละเอียด Section</h2>
            <span className="text-[10px] text-slate-400 font-medium">ข้อมูล Real-time จาก MongoDB</span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Section</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">รายการ</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden lg:table-cell">อัพเดตล่าสุด</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">สถานะ</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400"></th>
              </tr>
            </thead>
            <tbody>
              {SECTION_CONFIG.map((sec, idx) => {
                const c = COLOR_MAP[sec.color];
                const updatedAt = sec.getUpdated(data);
                const isConfigured = updatedAt !== null;
                return (
                  <tr key={sec.key} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${idx === SECTION_CONFIG.length - 1 ? 'border-0' : ''}`}>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${c.icon} text-sm`}>
                          {sec.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{sec.label}</p>
                          <p className="text-[10px] text-slate-400">{sec.sublabel}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-sm font-bold text-slate-700">{sec.getInfo(data)}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-xs text-slate-500">{timeAgo(updatedAt)}</span>
                    </td>
                    <td className="px-4 py-4">
                      {isConfigured ? (
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${c.badge}`}>
                          <CheckCircle2 size={10} /> Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                          <AlertCircle size={10} /> Default
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Link href={sec.href} className="text-[10px] font-black text-blue-600 hover:underline flex items-center gap-1">
                        จัดการ <ArrowUpRight size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

function KpiCard({ label, value, sub, icon, iconClass, valueClass }: {
  label: string; value: string; sub: string;
  icon: React.ReactNode; iconClass: string; valueClass: string;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${iconClass}`}>{icon}</div>
      <p className={`text-xl font-black tracking-tight ${valueClass}`}>{value}</p>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{label}</p>
      <p className="text-[10px] text-slate-400 mt-1">{sub}</p>
    </div>
  );
}
