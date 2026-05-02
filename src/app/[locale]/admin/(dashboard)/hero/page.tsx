"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function HeroAdminPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/hero')
      .then(res => res.json())
      .then(data => {
        setSlides(data.slides || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load slides');
        setLoading(false);
      });
  }, []);

  const handleAddSlide = () => {
    setSlides([...slides, { id: Date.now(), img: '', type: 'branding' }]);
  };

  const handleRemoveSlide = (index: number) => {
    const newSlides = [...slides];
    newSlides.splice(index, 1);
    setSlides(newSlides);
  };

  const handleUpdateSlide = (index: number, field: string, value: string) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides })
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

  const handleFileUpload = async (index: number, file: File, field: string = 'img') => {
    const formData = new FormData();
    formData.append('file', file);
    try {
       toast.loading(`Uploading ${field}...`, { id: 'upload' });
       const res = await fetch('/api/upload', {
         method: 'POST',
         body: formData
       });
       const data = await res.json();
       if (data.url) {
         handleUpdateSlide(index, field, data.url);
         toast.success('Upload complete', { id: 'upload' });
       } else {
         toast.error('Upload failed', { id: 'upload' });
       }
    } catch (e) {
       toast.error('Upload error', { id: 'upload' });
    }
  };

  if (loading) return <div className="p-8 font-sans">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 font-sans animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
         <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hero Section Manager</h1>
            <p className="text-sm text-slate-500 mt-1">Manage the hero slides on the website homepage</p>
         </div>
         <button 
           onClick={handleSave} 
           disabled={saving}
           className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-semibold"
         >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
         </button>
      </div>

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div key={slide.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-6 items-start transition-all hover:shadow-md">
            <div className="pt-2 text-slate-300 cursor-grab hover:text-blue-500">
               <GripVertical size={24} />
            </div>
            
            <div className="flex-1 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Desktop Image/Video URL</label>
                        <div className="flex gap-2">
                           <input 
                             type="text" 
                             value={slide.img} 
                             onChange={(e) => handleUpdateSlide(index, 'img', e.target.value)}
                             className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
                             placeholder="URL..."
                           />
                           <label className="flex items-center justify-center bg-slate-100 px-4 rounded-xl cursor-pointer hover:bg-slate-200 hover:text-blue-600 transition-all">
                              <ImageIcon size={18} />
                              <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => e.target.files && handleFileUpload(index, e.target.files[0], 'img')} />
                           </label>
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-blue-600 mb-2 uppercase tracking-wide">Mobile Image/Video (Optional)</label>
                        <div className="flex gap-2">
                           <input 
                             type="text" 
                             value={slide.mobileImg || ''} 
                             onChange={(e) => handleUpdateSlide(index, 'mobileImg', e.target.value)}
                             className="w-full bg-blue-50/30 border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
                             placeholder="Mobile URL..."
                           />
                           <label className="flex items-center justify-center bg-blue-100/50 px-4 rounded-xl cursor-pointer hover:bg-blue-200 hover:text-blue-700 transition-all text-blue-600">
                              <ImageIcon size={18} />
                              <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => e.target.files && handleFileUpload(index, e.target.files[0], 'mobileImg')} />
                           </label>
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Slide Type/Tab Name</label>
                        <input 
                           type="text" 
                           value={slide.type || ''} 
                           onChange={(e) => handleUpdateSlide(index, 'type', e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
                           placeholder="branding, content..."
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     {slide.img && (
                        <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                           {slide.img.match(/\.(mp4|webm|mov|ogg)$/i) ? (
                              <video src={slide.img} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                           ) : (
                              <img src={slide.img} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                           )}
                        </div>
                     )}
                  </div>
               </div>

               {/* New Dynamic Text Fields */}
               <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Title (Left Side)</label>
                        <input 
                           type="text" 
                           value={slide.title || ''} 
                           onChange={(e) => handleUpdateSlide(index, 'title', e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
                           placeholder="Creative Branding Agency"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subtitle (Middle Box)</label>
                        <input 
                           type="text" 
                           value={slide.subtitle || ''} 
                           onChange={(e) => handleUpdateSlide(index, 'subtitle', e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm italic focus:outline-none focus:border-blue-500 transition-all"
                           placeholder="From strategy to visual DNA..."
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Description (Below Title)</label>
                     <textarea 
                        value={slide.description || ''} 
                        onChange={(e) => handleUpdateSlide(index, 'description', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm min-h-[80px] focus:outline-none focus:border-blue-500 transition-all"
                        placeholder="Where brands are reborn..."
                     />
                  </div>

                  {/* Right Side Content Fields */}
                  <div className="pt-4 border-t border-slate-50 space-y-4">
                     <div className="space-y-2">
                        <label className="block text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Thai Title Overlay (Right Side)</label>
                        <input 
                           type="text" 
                           value={slide.thaiTitle || ''} 
                           onChange={(e) => handleUpdateSlide(index, 'thaiTitle', e.target.value)}
                           className="w-full bg-blue-50/30 border border-blue-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
                           placeholder="สร้างสรรค์ แบรนด์ดัง"
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Stat 1 (Label & Value)</label>
                           <div className="flex gap-2">
                              <input type="text" value={slide.stat1Label || ''} onChange={(e) => handleUpdateSlide(index, 'stat1Label', e.target.value)} className="w-1/2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[11px]" placeholder="Label" />
                              <input type="text" value={slide.stat1Value || ''} onChange={(e) => handleUpdateSlide(index, 'stat1Value', e.target.value)} className="w-1/2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[11px] font-bold" placeholder="Value" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Stat 2 (Label & Value)</label>
                           <div className="flex gap-2">
                              <input type="text" value={slide.stat2Label || ''} onChange={(e) => handleUpdateSlide(index, 'stat2Label', e.target.value)} className="w-1/2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[11px]" placeholder="Label" />
                              <input type="text" value={slide.stat2Value || ''} onChange={(e) => handleUpdateSlide(index, 'stat2Value', e.target.value)} className="w-1/2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[11px] font-bold" placeholder="Value" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <button onClick={() => handleRemoveSlide(index)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
               <Trash2 size={20} />
            </button>
          </div>
        ))}
        {slides.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed text-slate-500">
            No slides configured. Setup your first slide below.
          </div>
        )}
      </div>

      <button 
        onClick={handleAddSlide}
        className="mt-6 w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 outline-none"
      >
         <Plus size={20} /> Add New Slide
      </button>
    </div>
  );
}
