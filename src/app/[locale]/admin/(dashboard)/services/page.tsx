"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function ServicesAdminPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data.services || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load services');
        setLoading(false);
      });
  }, []);

  const handleAddService = () => {
    setServices([...services, { 
      category: "NEW", 
      title: "New Service", 
      image: "", 
      description: "Service description here.", 
      slug: "new-service-" + Date.now() 
    }]);
  };

  const handleRemoveService = (index: number) => {
    const newServices = [...services];
    newServices.splice(index, 1);
    setServices(newServices);
  };

  const handleUpdateService = (index: number, field: string, value: string) => {
    const newServices = [...services];
    newServices[index][field] = value;
    setServices(newServices);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services })
      });
      if (res.ok) {
        toast.success('Services saved successfully');
      } else {
        toast.error('Failed to save services');
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
         handleUpdateService(index, 'image', data.url);
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
    <div className="max-w-5xl mx-auto p-4 md:p-8 font-sans animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
         <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Services Manager</h1>
            <p className="text-sm text-slate-500 mt-1">Manage the core service offerings of Shiya Studio</p>
         </div>
         <button 
           onClick={handleSave} 
           disabled={saving}
           className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-semibold"
         >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
         </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {services.map((service, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-start transition-all hover:shadow-md">
            <div className="pt-2 text-slate-300 cursor-grab hover:text-blue-500 hidden md:block">
               <GripVertical size={24} />
            </div>
            
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-6">
               <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Preview & Upload</label>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group">
                     {service.image ? (
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                           <ImageIcon size={32} />
                        </div>
                     )}
                     <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-xs font-bold uppercase">
                        Change Image
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(index, e.target.files[0])} />
                     </label>
                  </div>
                  <input 
                     type="text" 
                     value={service.image} 
                     onChange={(e) => handleUpdateService(index, 'image', e.target.value)}
                     className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none text-slate-400"
                     placeholder="Image URL..."
                  />
               </div>

               <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Category Tag</label>
                        <input 
                           type="text" 
                           value={service.category} 
                           onChange={(e) => handleUpdateService(index, 'category', e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Display Title</label>
                        <input 
                           type="text" 
                           value={service.title} 
                           onChange={(e) => handleUpdateService(index, 'title', e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all font-semibold"
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Slug (URL Path)</label>
                        <div className="flex gap-2">
                           <input 
                              type="text" 
                              value={service.slug} 
                              onChange={(e) => handleUpdateService(index, 'slug', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all text-blue-600 font-mono"
                           />
                           <a href={`/th/services/${service.slug}`} target="_blank" className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
                              <ExternalLink size={16} />
                           </a>
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Short Description</label>
                        <textarea 
                           rows={2}
                           value={service.description} 
                           onChange={(e) => handleUpdateService(index, 'description', e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all resize-none"
                        />
                     </div>
                  </div>
               </div>
            </div>

            <button onClick={() => handleRemoveService(index)} className="p-2 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all self-start md:self-center">
               <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={handleAddService}
        className="mt-6 w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 outline-none"
      >
         <Plus size={20} /> Add New Service
      </button>
    </div>
  );
}
