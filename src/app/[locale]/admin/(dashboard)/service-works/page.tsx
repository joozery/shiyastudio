"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Film, 
  Folder, 
  X, 
  PlusCircle, 
  LayoutGrid,
  ChevronRight,
  Settings2
} from 'lucide-react';
import { toast } from 'sonner';

// Hardcoded services removed, fetched dynamically instead

interface GalleryItem {
  id: number;
  type: "VIDEO" | "PHOTO";
  image: string;
  videoUrl?: string;
  duration?: string;
  influencer?: { username: string; platform: string };
}

interface ServiceWork {
  id: string;
  brand: string;
  logoText: string;
  campaign: string;
  category: string;
  tags: string[];
  coverImage: string;
  isVideo: boolean;
  about: string;
  heroImage: string;
  stats: {
    reach: string;
    views: string;
    engagement: string;
  };
  gallery: GalleryItem[];
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function findDuplicateId(data: Record<string, ServiceWork[]>): { service: string; id: string } | null {
  for (const [service, works] of Object.entries(data)) {
    const seen = new Set<string>();
    for (const w of works) {
      if (seen.has(w.id)) return { service, id: w.id };
      seen.add(w.id);
    }
  }
  return null;
}

export default function ServiceWorksAdminPage() {
  const [activeService, setActiveService] = useState('influencer');
  const [dynamicServices, setDynamicServices] = useState<{id: string, label: string}[]>([]);
  const [servicesData, setServicesData] = useState<Record<string, ServiceWork[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedWork, setSelectedWork] = useState<ServiceWork | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Warn before closing/refreshing the tab if there are edits that haven't
  // been pushed via "Save All Changes" yet (field edits inside the modal
  // only update local state - see handleUpdateWork).
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    Promise.all([
      fetch('/api/service-works').then(res => res.json()),
      fetch('/api/services').then(res => res.json())
    ])
      .then(([worksData, servicesRes]) => {
        // Prepare dynamic tabs based on actual services
        const dbServices = servicesRes.services || [];
        const mappedServices = dbServices.map((s: any) => ({
          id: s.slug,
          label: s.title
        }));
        
        if (mappedServices.length > 0) {
           setDynamicServices(mappedServices);
           setActiveService(mappedServices[0].id);
        } else {
           const fallback = [
             { id: 'influencer', label: 'Influencer' },
             { id: 'production', label: 'Production' },
             { id: 'graphic-design', label: 'Graphic Design' },
             { id: 'vdo-motion', label: 'VDO Motion' },
             { id: 'mix-master-music', label: 'Music & Audio' }
           ];
           setDynamicServices(fallback);
           setActiveService(fallback[0].id);
        }

        setServicesData(worksData.services || {});
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load data');
        setLoading(false);
      });
  }, []);

  const currentWorks = servicesData[activeService] || [];

  const handleAddWork = async () => {
    const newWork: ServiceWork = {
      id: "new-project-" + Date.now(),
      brand: "New Brand",
      logoText: "LOGO TEXT",
      campaign: "New Campaign",
      category: "CATEGORY",
      tags: ["TAG1"],
      coverImage: "",
      isVideo: false,
      about: "About this project...",
      heroImage: "",
      stats: { reach: "1M+", views: "2M+", engagement: "5%" },
      gallery: []
    };
    
    setServicesData(prev => {
      const newServicesData = {
        ...prev,
        [activeService]: [...(prev[activeService] || []), newWork]
      };
      saveToServer(newServicesData);
      return newServicesData;
    });
  };

  const handleRemoveWork = async (index: number) => {
    if (!confirm('ต้องการลบโปรเจกต์นี้ใช่ไหม?')) return;
    
    setServicesData(prev => {
      const newWorks = [...(prev[activeService] || [])];
      newWorks.splice(index, 1);
      const newServicesData = {
        ...prev,
        [activeService]: newWorks
      };
      saveToServer(newServicesData);
      return newServicesData;
    });
  };

  const handleUpdateWork = (index: number, field: string, value: any) => {
    setServicesData(prev => {
      const newWorks = [...(prev[activeService] || [])];
      
      if (field.includes('.')) {
        const parts = field.split('.');
        let current: any = newWorks[index];
        for (let i = 0; i < parts.length - 1; i++) {
          if (current[parts[i]] == null) current[parts[i]] = {};
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
      } else {
        newWorks[index] = { ...newWorks[index], [field]: value };
      }

      const newServicesData = {
        ...prev,
        [activeService]: newWorks
      };
      
      if (selectedWork && selectedWork.id === newWorks[index].id) {
        setSelectedWork(newWorks[index]);
      }
      return newServicesData;
    });
    setHasUnsavedChanges(true);
  };

  const closeModal = () => {
    if (hasUnsavedChanges && !confirm('มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก ต้องการออกโดยไม่บันทึกใช่ไหม?')) {
      return;
    }
    setSelectedWork(null);
  };

  const saveToServer = async (payload: Record<string, ServiceWork[]>) => {
    try {
      const res = await fetch('/api/service-works', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: payload })
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        toast.error('บันทึกไม่สำเร็จ');
        console.error('Save error:', result);
      }
      return res.ok;
    } catch (e: any) {
      toast.error('เกิดข้อผิดพลาด: ' + e.message);
      return false;
    }
  };

  const handleSave = async () => {
    const dup = findDuplicateId(servicesData);
    if (dup) {
      toast.error(`ID "${dup.id}" ซ้ำกันในบริการ "${dup.service}" กรุณาแก้ไขให้ไม่ซ้ำก่อนบันทึก`);
      return;
    }

    setSaving(true);
    const ok = await saveToServer(servicesData);
    if (ok) {
      toast.success('บันทึกสำเร็จ!');
      setHasUnsavedChanges(false);
    }
    setSaving(false);
  };

  const handleFileUpload = async (file: File, callback: (url: string) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
       toast.loading('Uploading...', { id: 'upload' });
       const res = await fetch('/api/upload', {
         method: 'POST',
         body: formData
       });
       const data = await res.json();
       if (data.url) {
         callback(data.url);
         toast.success('Upload complete', { id: 'upload' });
       } else {
         toast.error('Upload failed', { id: 'upload' });
       }
    } catch (e) {
       toast.error('Upload error', { id: 'upload' });
    }
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 font-sans animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Service Portfolios</h1>
            <p className="text-sm text-slate-500 mt-1">จัดการพอร์ตโฟลิโอสำหรับแต่ละบริการ</p>
         </div>
         <button 
           onClick={handleSave} 
           disabled={saving}
           className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-bold text-sm"
         >
            <Save size={18} /> {saving ? 'Saving...' : 'Save All Changes'}
         </button>
      </div>

      {/* Service Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit">
        {dynamicServices.map(service => (
          <button
            key={service.id}
            onClick={() => setActiveService(service.id)}
            className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeService === service.id 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {service.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentWorks.map((work, index) => (
          <div key={work.id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
               {work.coverImage ? (
                  <img src={work.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
               ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                     <ImageIcon size={40} />
                  </div>
               )}
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => setSelectedWork(work)} className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold shadow-xl hover:scale-105 transition-all">Edit Details</button>
               </div>
               <div className="absolute top-4 right-4 z-10">
                  <button onClick={() => handleRemoveWork(index)} className="w-8 h-8 bg-white/20 backdrop-blur-md hover:bg-red-500 text-white rounded-lg flex items-center justify-center transition-all">
                     <Trash2 size={14} />
                  </button>
               </div>
               {work.isVideo && (
                 <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                   <Film size={12} className="text-black" />
                 </div>
               )}
            </div>
            <div className="p-5 flex-1 flex flex-col gap-3">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{work.category}</p>
                  <h3 className="text-base font-bold text-slate-900 truncate">{work.brand}</h3>
                  <p className="text-xs text-slate-500 truncate">{work.campaign}</p>
               </div>
               <button 
                  onClick={() => setSelectedWork(work)}
                  className="mt-auto w-full py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all flex items-center justify-center gap-2"
               >
                  <Settings2 size={12} /> Manage Content
               </button>
            </div>
          </div>
        ))}
        
        <button 
          onClick={handleAddWork}
          className="aspect-[4/3] md:aspect-auto border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-4 outline-none min-h-[250px]"
        >
           <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle size={24} />
           </div>
           <span className="text-xs uppercase tracking-widest">Add Project</span>
        </button>
      </div>

      {/* Editor Modal */}
      {selectedWork && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Edit: {selectedWork.brand}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
               {/* Basic Info */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID (URL Slug)</label>
                     <input type="text" value={selectedWork.id} onChange={(e) => handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'id', e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand Name</label>
                     <input type="text" value={selectedWork.brand} onChange={(e) => handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'brand', e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logo Text / Mini Title</label>
                     <input type="text" value={selectedWork.logoText || ''} onChange={(e) => handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'logoText', e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campaign Subtitle</label>
                     <input type="text" value={selectedWork.campaign} onChange={(e) => handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'campaign', e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                     <input type="text" value={selectedWork.category} onChange={(e) => handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'category', e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                   </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tags (comma separated)</label>
                      <input type="text" value={(selectedWork.tags || []).join(', ')} onChange={(e) => handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'tags', e.target.value.split(',').map(s => s.trim()))} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-purple-600">Move to Service (ย้ายหมวดหมู่)</label>
                      <select 
                        value={activeService}
                        onChange={(e) => {
                          const newServiceId = e.target.value;
                          if (newServiceId === activeService) return;
                          
                          if (!confirm(`ย้ายโปรเจกต์นี้ไปที่หมวดหมู่ใหม่ใช่หรือไม่?`)) return;

                          setServicesData(prev => {
                            const currentServiceWorks = [...(prev[activeService] || [])];
                            const itemIndex = currentServiceWorks.findIndex(w => w.id === selectedWork.id);
                            if (itemIndex > -1) {
                              currentServiceWorks.splice(itemIndex, 1);
                            }

                            const newServiceWorks = [...(prev[newServiceId] || [])];
                            newServiceWorks.push(selectedWork);

                            return {
                              ...prev,
                              [activeService]: currentServiceWorks,
                              [newServiceId]: newServiceWorks
                            };
                          });
                          
                          setHasUnsavedChanges(true);
                          setActiveService(newServiceId);
                          setSelectedWork(null);
                          toast.success(`ย้ายโปรเจกต์เรียบร้อยแล้ว (อย่าลืมกด Save All Changes)`);
                        }}
                        className="w-full px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl text-sm font-bold text-purple-700 outline-none"
                      >
                        {dynamicServices.map(s => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                 <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cover Image</label>
                      <div className="flex gap-2 mb-2">
                        <input type="text" value={selectedWork.coverImage} onChange={(e) => handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'coverImage', e.target.value)} className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                        <label className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl text-xs font-bold cursor-pointer">
                          Upload <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], (url) => handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'coverImage', url))} />
                        </label>
                      </div>
                      {selectedWork.coverImage && (
                        <img src={selectedWork.coverImage} alt="Cover preview" className="w-full h-28 object-cover rounded-lg border border-slate-200" />
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Banner Image (Detail Page)</label>
                      <div className="flex gap-2 mb-2">
                        <input type="text" value={selectedWork.heroImage || ''} onChange={(e) => handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'heroImage', e.target.value)} className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                        <label className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl text-xs font-bold cursor-pointer">
                          Upload <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], (url) => handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'heroImage', url))} />
                        </label>
                      </div>
                      {selectedWork.heroImage && (
                        <img src={selectedWork.heroImage} alt="Hero preview" className="w-full h-28 object-cover rounded-lg border border-slate-200" />
                      )}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold mt-4 cursor-pointer">
                        <input type="checkbox" checked={selectedWork.isVideo} onChange={(e) => handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'isVideo', e.target.checked)} className="w-4 h-4" />
                        Has Video Icon on Cover
                      </label>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">About Text</label>
                      <textarea rows={3} value={selectedWork.about || ''} onChange={(e) => handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'about', e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                    </div>
                 </div>
               </div>

               {/* Stats */}
               <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Stats</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reach</label>
                      <input type="text" value={selectedWork.stats?.reach || ''} onChange={(e) => handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'stats.reach', e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Views</label>
                      <input type="text" value={selectedWork.stats?.views || ''} onChange={(e) => handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'stats.views', e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Engagement</label>
                      <input type="text" value={selectedWork.stats?.engagement || ''} onChange={(e) => handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'stats.engagement', e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                    </div>
                  </div>
               </div>

               {/* Gallery */}
               <div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Gallery Content ({selectedWork.gallery.length})</h3>
                    <div className="flex gap-2">
                       <button onClick={() => {
                         const gallery = [...selectedWork.gallery, { id: Date.now(), type: 'PHOTO', image: '' }];
                         handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'gallery', gallery);
                       }} className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold">Add Photo Item</button>
                       <button onClick={() => {
                         const gallery = [...selectedWork.gallery, { id: Date.now(), type: 'VIDEO', image: '', videoUrl: '', duration: '00:15', influencer: { username: '@user', platform: 'Instagram' } }];
                         handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'gallery', gallery);
                       }} className="px-4 py-1.5 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg text-xs font-bold">Add Video Item</button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {selectedWork.gallery.map((gItem, gIdx) => (
                        <div key={gIdx} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex flex-col gap-3 relative">
                           <button onClick={() => {
                             if (!confirm('ลบไอเทมนี้ออกจาก gallery ใช่ไหม?')) return;
                             const gallery = [...selectedWork.gallery];
                             gallery.splice(gIdx, 1);
                             handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'gallery', gallery);
                           }} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-md"><Trash2 size={14}/></button>
                           
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                               {gItem.type === 'VIDEO' ? '🎬 VIDEO ITEM' : '📷 PHOTO ITEM'}
                            </div>
                            
                            {/* Thumbnail Preview (skip video files & social links) */}
                            {gItem.image && !gItem.image.includes('tiktok') && !gItem.image.includes('youtube') && !gItem.image.includes('instagram') && !/\.(mp4|mov|webm|m4v)(\?|$)/i.test(gItem.image) && (
                              <img src={gItem.image} className="w-full h-20 object-cover rounded-lg border" alt="preview" />
                            )}
                            
                            <div>
                              <div className="text-[9px] text-slate-400 mb-1 font-bold">📸 รูปภาพ Thumbnail (อัปโหลดหรือวาง URL รูป)</div>
                              <div className="flex gap-2">
                               <input type="text" placeholder="URL รูปภาพ (ไม่ใช่ลิงก์วิดีโอ)" value={gItem.image} onChange={(e) => {
                                  const gallery = [...selectedWork.gallery];
                                  gallery[gIdx].image = e.target.value;
                                  handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'gallery', gallery);
                               }} className="w-full px-2 py-1 text-xs border rounded-md" />
                               <label className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-[10px] font-bold cursor-pointer whitespace-nowrap">
                                 อัปโหลด <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], (url) => {
                                    const gallery = [...selectedWork.gallery];
                                    gallery[gIdx].image = url;
                                    handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'gallery', gallery);
                                 })} />
                               </label>
                              </div>
                            </div>
                           
                           {gItem.type === 'VIDEO' && (
                             <>
                                <div>
                                   <div className="text-[9px] text-slate-400 mb-1 font-bold">🔗 ลิงก์วิดีโอ TikTok / YouTube / Instagram หรือ อัปโหลดไฟล์วิดีโอ (กดแล้วจะเล่น/เปิดลิงก์นี้)</div>
                                   <div className="flex gap-2">
                                     <input type="text" placeholder="วางลิงก์ หรือ อัปโหลดไฟล์ด้านขวา" value={gItem.videoUrl || ''} onChange={(e) => {
                                      const gallery = [...selectedWork.gallery];
                                      gallery[gIdx].videoUrl = e.target.value;
                                      handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'gallery', gallery);
                                   }} className="w-full px-2 py-1 text-xs border rounded-md border-blue-200 bg-blue-50" />
                                     <label className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md text-[10px] font-bold cursor-pointer whitespace-nowrap">
                                       อัปวิดีโอ <input type="file" className="hidden" accept="video/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], (url) => {
                                          const gallery = [...selectedWork.gallery];
                                          gallery[gIdx].videoUrl = url;
                                          handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'gallery', gallery);
                                       })} />
                                     </label>
                                   </div>
                                   {gItem.videoUrl && /\.(mp4|mov|webm|m4v)(\?|$)/i.test(gItem.videoUrl) && (
                                     <p className="text-[9px] text-green-600 mt-1 font-bold truncate">✓ อัปโหลดไฟล์วิดีโอแล้ว</p>
                                   )}
                                </div>
                                <input type="text" placeholder="Duration (e.g. 00:30)" value={gItem.duration || ''} onChange={(e) => {
                                   const gallery = [...selectedWork.gallery];
                                   gallery[gIdx].duration = e.target.value;
                                   handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'gallery', gallery);
                                }} className="w-full px-2 py-1 text-xs border rounded-md" />
                                <div className="flex gap-2">
                                  <input type="text" placeholder="@username" value={gItem.influencer?.username || ''} onChange={(e) => {
                                     const gallery = [...selectedWork.gallery];
                                     if (!gallery[gIdx].influencer) gallery[gIdx].influencer = { username: '', platform: 'Instagram' };
                                     gallery[gIdx].influencer!.username = e.target.value;
                                     handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'gallery', gallery);
                                  }} className="w-full px-2 py-1 text-xs border rounded-md" />
                                  <select value={gItem.influencer?.platform || 'Instagram'} onChange={(e) => {
                                     const gallery = [...selectedWork.gallery];
                                     if (!gallery[gIdx].influencer) gallery[gIdx].influencer = { username: '', platform: 'Instagram' };
                                     gallery[gIdx].influencer!.platform = e.target.value;
                                     handleUpdateWork(currentWorks.findIndex(w => w.id === selectedWork.id), 'gallery', gallery);
                                  }} className="w-full px-2 py-1 text-xs border rounded-md">
                                    <option>Instagram</option>
                                    <option>TikTok</option>
                                    <option>YouTube</option>
                                    <option>Facebook</option>
                                  </select>
                                </div>
                             </>
                           )}
                        </div>
                     ))}
                  </div>
               </div>

            </div>
            
            <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold disabled:opacity-50">{saving ? 'กำลังบันทึก…' : 'บันทึกการเปลี่ยนแปลง'}</button>
              <button onClick={closeModal} className="px-10 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">Done Editing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
