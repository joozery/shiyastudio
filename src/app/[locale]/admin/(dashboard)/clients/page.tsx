"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon, Upload, Link as LinkIcon, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientsAdminPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => {
        setClients(data.clients || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load clients');
        setLoading(false);
      });
  }, []);

  const handleAddClient = () => {
    setClients([...clients, { name: "Brand Name", image: "" }]);
  };

  const handleRemoveClient = (index: number) => {
    const newClients = [...clients];
    newClients.splice(index, 1);
    setClients(newClients);
  };

  const handleUpdateClient = (index: number, field: string, value: string) => {
    const newClients = [...clients];
    newClients[index][field] = value;
    setClients(newClients);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/clients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clients })
      });
      if (res.ok) {
        toast.success('บันทึกสำเร็จ');
      } else {
        toast.error('บันทึกไม่สำเร็จ');
      }
    } catch (e) {
      toast.error('เกิดข้อผิดพลาด');
    }
    setSaving(false);
  };

  const handleFileUpload = async (index: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingIndex(index);
    try {
      toast.loading('กำลังอัปโหลดโลโก้...', { id: 'upload' });
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        handleUpdateClient(index, 'image', data.url);
        toast.success('อัปโหลดโลโก้สำเร็จ', { id: 'upload' });
      } else {
        toast.error('อัปโหลดล้มเหลว', { id: 'upload' });
      }
    } catch (e) {
      toast.error('เกิดข้อผิดพลาดในการอัปโหลด', { id: 'upload' });
    }
    setUploadingIndex(null);
  };

  if (loading) return (
    <div className="p-8 font-sans flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
  );

  const withLogos = clients.filter(c => c.image).length;
  const withoutLogos = clients.filter(c => !c.image).length;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 font-sans animate-in fade-in duration-500 space-y-8">

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Brand Clients Manager</h1>
          <p className="text-sm text-slate-500 mt-1">จัดการโลโก้แบรนด์ที่แสดงใน Scrolling Marquee ของเว็บไซต์</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${previewMode ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
          >
            <Eye size={16} /> {previewMode ? 'ซ่อน Preview' : 'ดู Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-semibold text-sm"
          >
            <Save size={16} /> {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-black text-slate-900">{clients.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">แบรนด์ทั้งหมด</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-black text-green-700">{withLogos}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-green-500 mt-1">มีโลโก้</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-black text-amber-700">{withoutLogos}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mt-1">ยังไม่มีโลโก้</p>
        </div>
      </div>

      {/* ─── Live Preview ─── */}
      {previewMode && (
        <div className="bg-[#080808] rounded-3xl overflow-hidden border border-white/5 shadow-xl">
          {/* Label */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Live Preview — Website Marquee</p>
            </div>
            <span className="text-[9px] font-bold text-white/20">{clients.length} แบรนด์</span>
          </div>

          {/* Marquee Rows */}
          <div className="py-8 space-y-6 overflow-hidden relative">
            {/* Side fades */}
            <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

            {/* Row 1: Left → Right */}
            <div className="flex overflow-hidden">
              <div className="flex whitespace-nowrap gap-12 items-center animate-marquee-preview shrink-0">
                {[...clients, ...clients, ...clients].map((client, idx) => (
                  <LogoSlideItem key={`r1-${idx}`} client={client} />
                ))}
              </div>
            </div>

            {/* Row 2: Right → Left */}
            <div className="flex overflow-hidden">
              <div className="flex whitespace-nowrap gap-12 items-center animate-marquee-preview-rev shrink-0">
                {[...[...clients].reverse(), ...[...clients].reverse(), ...[...clients].reverse()].map((client, idx) => (
                  <LogoSlideItem key={`r2-${idx}`} client={client} dim />
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes marqueePreview {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }
            @keyframes marqueePreviewRev {
              0%   { transform: translateX(-33.333%); }
              100% { transform: translateX(0); }
            }
            .animate-marquee-preview     { animation: marqueePreview    18s linear infinite; }
            .animate-marquee-preview-rev { animation: marqueePreviewRev 22s linear infinite; }
          `}</style>
        </div>
      )}

      {/* ─── Brand Cards Grid ─── */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <span className="w-6 h-[1.5px] bg-slate-200 inline-block" /> รายการแบรนด์
          </h2>
          <button
            onClick={handleAddClient}
            className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
          >
            <Plus size={14} /> เพิ่มแบรนด์ใหม่
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client, index) => (
            <BrandCard
              key={index}
              client={client}
              index={index}
              isUploading={uploadingIndex === index}
              onUpdate={handleUpdateClient}
              onRemove={handleRemoveClient}
              onFileUpload={handleFileUpload}
            />
          ))}

          {/* Empty Add Card */}
          <button
            onClick={handleAddClient}
            className="min-h-[140px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/40 transition-all font-bold text-sm outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
              <Plus size={20} />
            </div>
            เพิ่มแบรนด์
          </button>
        </div>
      </div>

      {/* ─── Info Note ─── */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-500 flex gap-3 items-start">
        <span className="text-xl">💡</span>
        <div>
          <p className="font-semibold text-slate-700 mb-1">เกี่ยวกับ Marquee</p>
          <p className="text-xs leading-relaxed">โลโก้ที่เพิ่มเข้ามาจะวิ่งในแถบ Scrolling Marquee 2 แถว บนเว็บไซต์หน้าแรก ถ้าอัปโหลดโลโก้ใน R2/S3 โลโก้จะแสดงทับตัวไอคอน แนะนำให้ใช้ไฟล์ PNG พื้นหลังโปร่งใส ขนาด 200×80px ขึ้นไป</p>
        </div>
      </div>
    </div>
  );
}

function LogoSlideItem({ client, dim = false }: { client: any; dim?: boolean }) {
  return (
    <div className="flex-shrink-0 group cursor-pointer">
      <div className="w-36 h-16 rounded-2xl overflow-hidden border border-white/10 group-hover:border-blue-500/60 transition-all duration-500 bg-zinc-900">
        {client.image ? (
          <img
            src={client.image}
            alt={client.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors select-none">
              {client.name || 'BRAND'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function BrandCard({ client, index, isUploading, onUpdate, onRemove, onFileUpload }: any) {
  const [showUrlInput, setShowUrlInput] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm group relative hover:shadow-md transition-all flex flex-col gap-4">
      {/* Remove */}
      <button
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-110 z-10"
      >
        <Trash2 size={12} />
      </button>

      {/* Logo Upload Area */}
      <div className="relative">
        <div className="w-full h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group/logo cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-blue-500">
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <span className="text-[10px] font-bold">กำลังอัปโหลด...</span>
            </div>
          ) : client.image ? (
            <>
              <img src={client.image} alt={client.name} className="max-h-16 max-w-full object-contain" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/logo:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                <span className="text-white text-[10px] font-bold uppercase tracking-widest">เปลี่ยนโลโก้</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-300 group-hover/logo:text-blue-400 transition-colors">
              <Upload size={24} />
              <span className="text-[10px] font-bold uppercase tracking-wide">อัปโหลดโลโก้</span>
              <span className="text-[9px] text-slate-300">PNG, SVG (พื้นหลังโปร่งใส)</span>
            </div>
          )}
          <label className="absolute inset-0 cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => e.target.files && onFileUpload(index, e.target.files[0])}
            />
          </label>
        </div>

        {/* URL input toggle */}
        <button
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors"
        >
          <LinkIcon size={11} /> {showUrlInput ? 'ซ่อน URL' : 'ใส่ URL แทน'}
        </button>

        {showUrlInput && (
          <input
            type="text"
            value={client.image}
            onChange={(e) => onUpdate(index, 'image', e.target.value)}
            className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-mono focus:outline-none focus:border-blue-500 transition-all text-slate-600"
            placeholder="https://... (URL โลโก้)"
          />
        )}
      </div>

      {/* Brand Name */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">ชื่อแบรนด์</label>
        <input
          type="text"
          value={client.name}
          onChange={(e) => onUpdate(index, 'name', e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-900"
          placeholder="ชื่อแบรนด์"
        />
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2">
        {client.image ? (
          <span className="text-[9px] font-bold bg-green-50 text-green-600 border border-green-100 px-2 py-1 rounded-full">✓ มีโลโก้</span>
        ) : (
          <span className="text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 px-2 py-1 rounded-full">⚠ ใช้ไอคอนแทน</span>
        )}
        {client.name && (
          <span className="text-[9px] font-bold bg-slate-50 text-slate-500 border border-slate-100 px-2 py-1 rounded-full uppercase tracking-wide">
            {client.name}
          </span>
        )}
      </div>
    </div>
  );
}
