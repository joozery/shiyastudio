"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon, Video, Link as LinkIcon, Film, Tag, FolderOpen, Check } from 'lucide-react';
import { toast } from 'sonner';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'Other'];

export default function InfluencerAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');

  useEffect(() => {
    fetch('/api/influencer')
      .then(res => res.json())
      .then(data => {
        setItems(data.items || []);
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load influencer data');
        setLoading(false);
      });
  }, []);

  const handleAddItem = () => {
    setItems([...items, { 
      id: Date.now(), 
      img: "", 
      videoUrl: "", 
      author: "@new_creator", 
      size: "medium", 
      category: categories[0] || "Influencer campaign",
      platform: "TikTok"
    }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleUpdateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddCategory = () => {
    setCategories([...categories, "New Category"]);
  };

  const handleRemoveCategory = (index: number) => {
    const newCats = [...categories];
    newCats.splice(index, 1);
    setCategories(newCats);
  };

  const handleUpdateCategory = (index: number, value: string) => {
    const newCats = [...categories];
    newCats[index] = value;
    setCategories(newCats);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/influencer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, categories })
      });
      if (res.ok) {
        toast.success('Saved successfully');
      } else {
        toast.error('Failed to save');
      }
    } catch (e) {
      toast.error('Error saving');
    }
    setSaving(false);
  };

  const handleFileUpload = async (index: number, file: File, field: 'img' | 'videoUrl') => {
    const formData = new FormData();
    formData.append('file', file);
    try {
       toast.loading(field === 'img' ? 'Uploading thumbnail...' : 'Uploading video...', { id: 'upload' });
       const res = await fetch('/api/upload', {
         method: 'POST',
         body: formData
       });
       const data = await res.json();
       if (data.url) {
         handleUpdateItem(index, field, data.url);
         toast.success('Upload complete', { id: 'upload' });
       } else {
         toast.error('Upload failed', { id: 'upload' });
       }
    } catch (e) {
       toast.error('Upload error', { id: 'upload' });
    }
  };

  if (loading) return (
    <div className="p-8 font-sans flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 font-sans animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Influencer & Commerce</h1>
            <p className="text-sm text-slate-500 mt-1">จัดการวิดีโอ รูปภาพ หมวดหมู่ และ Creator ใน Section นี้</p>
         </div>
         <div className="flex gap-3">
           <div className="flex p-1 bg-slate-100 rounded-xl">
             <button onClick={() => setActiveTab('items')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'items' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
               <Film size={13} /> Media ({items.length})
             </button>
             <button onClick={() => setActiveTab('categories')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'categories' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
               <Tag size={13} /> Categories ({categories.length})
             </button>
           </div>
           <button 
             onClick={handleSave} 
             disabled={saving}
             className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-semibold text-sm"
           >
              <Save size={16} /> {saving ? 'Saving...' : 'Save All'}
           </button>
         </div>
      </div>

      {/* ── CATEGORIES TAB ── */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
            <strong>หมวดหมู่ (Pills)</strong> ที่สร้างที่นี่จะปรากฏบนหน้าเว็บไซต์ และสามารถใช้ Filter ไอเทมแต่ละรายการได้
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Category List</p>
            </div>
            <div className="p-6 space-y-3">
              {categories.map((cat, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="text-slate-200 cursor-grab">
                    <GripVertical size={18} />
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-xs font-black text-slate-300 w-6 text-center">{index + 1}</span>
                    <input 
                      type="text" 
                      value={cat} 
                      onChange={(e) => handleUpdateCategory(index, e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
                    />
                  </div>
                  <button onClick={() => handleRemoveCategory(index)} className="p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">ยังไม่มีหมวดหมู่ กด "Add Category" เพื่อเพิ่ม</p>
              )}
            </div>
            <div className="p-4 border-t border-slate-100">
              <button onClick={handleAddCategory} className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-sm font-bold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2">
                <Plus size={16} /> Add Category
              </button>
            </div>
          </div>

          {/* Preview */}
          {categories.length > 0 && (
            <div className="bg-slate-900 rounded-2xl p-6">
              <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">Preview on Website</p>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat, idx) => (
                  <span key={idx} className={`px-5 py-2 rounded-full border text-[9px] font-bold uppercase tracking-widest transition-all ${idx === 0 ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10'}`}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ITEMS TAB ── */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          {/* Stats bar */}
          <div className="flex gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full font-bold"><ImageIcon size={11} /> รูปภาพ: {items.filter(i => i.img && !i.videoUrl).length}</span>
            <span className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold"><Film size={11} /> มีวิดีโอ: {items.filter(i => i.videoUrl).length}</span>
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full font-bold"><FolderOpen size={11} /> รวม: {items.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item, index) => (
              <MediaItemCard
                key={index}
                item={item}
                index={index}
                categories={categories}
                onUpdate={handleUpdateItem}
                onRemove={handleRemoveItem}
                onFileUpload={handleFileUpload}
              />
            ))}

            {/* Add Card */}
            <button
              onClick={handleAddItem}
              className="min-h-[200px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all font-bold text-sm"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                <Plus size={22} />
              </div>
              เพิ่มไอเทมใหม่
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MediaItemCard({ item, index, categories, onUpdate, onRemove, onFileUpload }: any) {
  const [showVideoInput, setShowVideoInput] = useState(!!item.videoUrl);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasVideo = !!item.videoUrl;
  const hasThumbnail = !!item.img;

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-4 group relative hover:shadow-md transition-all">
      {/* Remove button */}
      <button onClick={() => onRemove(index)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10">
        <Trash2 size={14} />
      </button>

      {/* Media Preview Row */}
      <div className="flex gap-3">

        {/* Video Preview */}
        <div className="relative flex-1">
          <div className={`relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 flex items-center justify-center aspect-video`}>
            {hasVideo && item.videoUrl.startsWith('http') ? (
              <video
                ref={videoRef}
                src={item.videoUrl}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                poster={item.img || undefined}
                onMouseEnter={async () => { try { await videoRef.current?.play(); } catch (e) { /* AbortError — safe to ignore */ } }}
                onMouseLeave={() => { videoRef.current?.pause(); if(videoRef.current) videoRef.current.currentTime = 0; }}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-white/20">
                <Film size={28} />
                <span className="text-[9px] font-bold uppercase tracking-wide">ยังไม่มีวิดีโอ</span>
                <span className="text-[8px] text-white/10">Hover เพื่อเล่นอัตโนมัติ</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <label className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all">
              <Video size={12} /> อัปโหลดวิดีโอ
              <input type="file" className="hidden" accept="video/*" onChange={(e) => e.target.files && onFileUpload(index, e.target.files[0], 'videoUrl')} />
            </label>
            <button onClick={() => setShowVideoInput(!showVideoInput)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all">
              <LinkIcon size={12} /> URL
            </button>
          </div>
        </div>
      </div>

      {/* Video URL Input */}
      {showVideoInput && (
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Video URL</label>
          <input
            type="text"
            value={item.videoUrl}
            onChange={(e) => onUpdate(index, 'videoUrl', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500 transition-all text-slate-700"
            placeholder="https://... (MP4, WebM, HLS)"
          />
        </div>
      )}

      {/* Info Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Author / Handle</label>
          <input
            type="text"
            value={item.author}
            onChange={(e) => onUpdate(index, 'author', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500 transition-all text-slate-700"
            placeholder="@username"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Platform</label>
          <select
            value={item.platform || 'TikTok'}
            onChange={(e) => onUpdate(index, 'platform', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500 transition-all text-slate-700 appearance-none cursor-pointer"
          >
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">หมวดหมู่ (Category)</label>
          <select
            value={item.category || ''}
            onChange={(e) => onUpdate(index, 'category', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500 transition-all text-slate-700 appearance-none cursor-pointer"
          >
            {categories.map((c: string) => <option key={c} value={c}>{c}</option>)}
            <option value="">ไม่ระบุหมวดหมู่</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Grid Size</label>
          <select
            value={item.size}
            onChange={(e) => onUpdate(index, 'size', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500 transition-all text-slate-700 appearance-none cursor-pointer"
          >
            <option value="tall">Tall — 9:16</option>
            <option value="medium">Medium — 4:5</option>
            <option value="large">Square — 1:1</option>
          </select>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex gap-2 pt-1">
        {hasVideo && <span className="flex items-center gap-1 text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded-full"><Film size={10} /> Video</span>}
        {item.category && <span className="flex items-center gap-1 text-[9px] font-bold bg-violet-50 text-violet-600 border border-violet-100 px-2 py-1 rounded-full truncate max-w-[120px]"><Tag size={10} />{item.category}</span>}
      </div>
    </div>
  );
}
