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

  const handleFileUpload = async (index: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
       toast.loading('Uploading image...', { id: 'upload' });
       const res = await fetch('/api/upload', {
         method: 'POST',
         body: formData
       });
       const data = await res.json();
       if (data.url) {
         handleUpdateSlide(index, 'img', data.url);
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
            
            <div className="flex-1 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Image URL / Upload</label>
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={slide.img} 
                         onChange={(e) => handleUpdateSlide(index, 'img', e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
                         placeholder="Image or Video URL (mp4, webm)"
                       />
                       <label className="flex items-center justify-center bg-slate-100 px-4 rounded-xl cursor-pointer hover:bg-slate-200 hover:text-blue-600 transition-all text-slate-600">
                          <ImageIcon size={18} />
                          <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => e.target.files && handleFileUpload(index, e.target.files[0])} />
                       </label>
                    </div>
                    {slide.img && (
                      <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 max-w-[240px] shadow-inner">
                         {slide.img.match(/\.(mp4|webm|mov|ogg)$/i) ? (
                            <video src={slide.img} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                          ) : (
                            <img src={slide.img} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                          )}
                      </div>
                    )}
                 </div>
                 
                 <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Slide Category</label>
                    <input 
                      type="text" 
                      value={slide.type} 
                      onChange={(e) => handleUpdateSlide(index, 'type', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700"
                      placeholder="branding, content, strategy"
                    />
                    <p className="text-[11px] font-medium text-slate-400 mt-2 leading-relaxed">
                       This is the translation key. Currently supported: <span className="text-blue-600 font-bold bg-blue-50 px-1 py-0.5 rounded">branding</span>, <span className="text-blue-600 font-bold bg-blue-50 px-1 py-0.5 rounded">content</span>, <span className="text-blue-600 font-bold bg-blue-50 px-1 py-0.5 rounded">strategy</span>.
                    </p>
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
