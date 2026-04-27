"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  GripVertical, 
  Image as ImageIcon, 
  Film, 
  Folder, 
  X, 
  PlusCircle, 
  Upload,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';
import { toast } from 'sonner';

interface ProjectMedia {
  url: string;
  type: 'image' | 'video';
}

interface Project {
  id: string | number;
  title: string;
  category: string;
  coverImage: string;
  description: string;
  media: ProjectMedia[];
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load projects');
        setLoading(false);
      });
  }, []);

  const handleAddProject = () => {
    const newProject: Project = { 
      id: Date.now(),
      title: "New Project Folder", 
      category: "Branding / Motion", 
      coverImage: "", 
      description: "Description of the work folder.",
      media: []
    };
    setProjects([...projects, newProject]);
  };

  const handleRemoveProject = (index: number) => {
    if (!confirm('Are you sure you want to delete this folder?')) return;
    const newProjects = [...projects];
    newProjects.splice(index, 1);
    setProjects(newProjects);
  };

  const handleUpdateProject = (index: number, field: keyof Project, value: any) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProjects(newProjects);
    if (selectedProject && selectedProject.id === newProjects[index].id) {
      setSelectedProject(newProjects[index]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects })
      });
      if (res.ok) {
        toast.success('All changes saved successfully');
      } else {
        toast.error('Failed to save changes');
      }
    } catch (e) {
      toast.error('Error saving');
    }
    setSaving(false);
  };

  const handleFileUpload = async (file: File, type: 'image' | 'video', callback: (url: string) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
       toast.loading(`Uploading ${type}...`, { id: 'upload' });
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
         <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Projects Gallery</h1>
            <p className="text-sm text-slate-500 mt-1">จัดการโฟลเดอร์งานและสื่อต่างๆ ในพอร์ตโฟลิโอ</p>
         </div>
         <button 
           onClick={handleSave} 
           disabled={saving}
           className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-bold text-sm"
         >
            <Save size={18} /> {saving ? 'Saving...' : 'Save All Changes'}
         </button>
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div key={project.id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            {/* Cover Image Preview */}
            <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
               {project.coverImage ? (
                  <img src={project.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={project.title} />
               ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                     <Folder size={40} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">No Cover Image</span>
                  </div>
               )}
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => setSelectedProject(project)} className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold shadow-xl hover:scale-105 transition-all">Open Folder</button>
               </div>
               <div className="absolute top-4 right-4 z-10">
                  <button onClick={() => handleRemoveProject(index)} className="w-8 h-8 bg-white/20 backdrop-blur-md hover:bg-red-500 text-white rounded-lg flex items-center justify-center transition-all">
                     <Trash2 size={14} />
                  </button>
               </div>
               <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-1.5 border border-white/10">
                  <LayoutGrid size={10} /> {project.media?.length || 0} ITEMS
               </div>
            </div>

            {/* Folder Info */}
            <div className="p-5 flex-1 flex flex-col gap-3">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{project.category}</p>
                  <h3 className="text-base font-bold text-slate-900 truncate">{project.title}</h3>
               </div>
               <button 
                  onClick={() => setSelectedProject(project)}
                  className="mt-auto w-full py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all flex items-center justify-center gap-2"
               >
                  Manage Gallery <ChevronRight size={12} />
               </button>
            </div>
          </div>
        ))}

        {/* Add Folder Button */}
        <button 
          onClick={handleAddProject}
          className="aspect-[16/10] md:aspect-auto border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-4 outline-none min-h-[250px]"
        >
           <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle size={24} />
           </div>
           <span className="text-xs uppercase tracking-widest">Create Work Folder</span>
        </button>
      </div>

      {/* Media Manager Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
                  <Folder size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Folder: {selectedProject.title}</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{selectedProject.media.length} Media Files</p>
                </div>
              </div>
              <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
               {/* Folder Settings */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Title</label>
                        <input 
                           type="text" 
                           value={selectedProject.title}
                           onChange={(e) => {
                              const projectIdx = projects.findIndex(p => p.id === selectedProject.id);
                              handleUpdateProject(projectIdx, 'title', e.target.value);
                              // Auto generate slug if title changes
                              if (!selectedProject.slug || selectedProject.slug === generateSlug(selectedProject.title)) {
                                 handleUpdateProject(projectIdx, 'slug', generateSlug(e.target.value));
                              }
                           }}
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 transition-all"
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slug (URL)</label>
                           <input 
                              type="text" 
                              value={selectedProject.slug}
                              onChange={(e) => handleUpdateProject(projects.findIndex(p => p.id === selectedProject.id), 'slug', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-blue-500 transition-all"
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Year</label>
                           <input 
                              type="text" 
                              value={selectedProject.year}
                              onChange={(e) => handleUpdateProject(projects.findIndex(p => p.id === selectedProject.id), 'year', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 transition-all"
                           />
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                        <input 
                           type="text" 
                           value={selectedProject.category}
                           onChange={(e) => handleUpdateProject(projects.findIndex(p => p.id === selectedProject.id), 'category', e.target.value)}
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 transition-all"
                        />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cover Image</label>
                     <div className="relative aspect-[16/8] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                        {selectedProject.coverImage ? (
                           <img src={selectedProject.coverImage} className="w-full h-full object-cover" alt="Cover" />
                        ) : (
                           <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                              <ImageIcon size={32} />
                              <span className="text-[8px] font-bold">Select Cover</span>
                           </div>
                        )}
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-bold uppercase tracking-widest">
                           {selectedProject.coverImage ? 'Change Cover' : 'Upload Cover'}
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'image', (url) => handleUpdateProject(projects.findIndex(p => p.id === selectedProject.id), 'coverImage', url))} />
                        </label>
                     </div>
                  </div>
               </div>

               {/* Media Gallery List */}
               <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><LayoutGrid size={16} className="text-blue-600" /> Gallery Items</h3>
                     <div className="flex gap-2">
                        <label className="px-4 py-2 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2">
                           <ImageIcon size={14} /> Add Image
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                              if (e.target.files) {
                                 handleFileUpload(e.target.files[0], 'image', (url) => {
                                    const projectIdx = projects.findIndex(p => p.id === selectedProject.id);
                                    const media = [...selectedProject.media, { url, type: 'image' }];
                                    handleUpdateProject(projectIdx, 'media', media);
                                 });
                              }
                           }} />
                        </label>
                        <label className="px-4 py-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2">
                           <Film size={14} /> Add Video
                           <input type="file" className="hidden" accept="video/*" onChange={(e) => {
                              if (e.target.files) {
                                 handleFileUpload(e.target.files[0], 'video', (url) => {
                                    const projectIdx = projects.findIndex(p => p.id === selectedProject.id);
                                    const media = [...selectedProject.media, { url, type: 'video' }];
                                    handleUpdateProject(projectIdx, 'media', media);
                                 });
                              }
                           }} />
                        </label>
                     </div>
                  </div>

                  {selectedProject.media.length === 0 ? (
                     <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-300">
                        <p className="text-xs font-bold uppercase tracking-widest">No media in this folder yet.</p>
                     </div>
                  ) : (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedProject.media.map((item, idx) => (
                           <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
                              {item.type === 'image' ? (
                                 <img src={item.url} className="w-full h-full object-cover" alt="Gallery" />
                              ) : (
                                 <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white/40">
                                    <Film size={32} />
                                 </div>
                              )}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <button onClick={() => {
                                    const projectIdx = projects.findIndex(p => p.id === selectedProject.id);
                                    const media = [...selectedProject.media];
                                    media.splice(idx, 1);
                                    handleUpdateProject(projectIdx, 'media', media);
                                 }} className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl">
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                              {item.type === 'video' && (
                                 <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[8px] font-bold uppercase tracking-widest">Video</div>
                              )}
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-slate-100 flex justify-end bg-slate-50/50">
              <button onClick={() => setSelectedProject(null)} className="px-10 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">Done Managing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
