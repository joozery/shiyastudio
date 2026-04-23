"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Shield, 
  Key, 
  Save, 
  LogOut, 
  Smartphone,
  Mail,
  Camera,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState({
    _id: '',
    name: 'Admin User',
    role: 'Senior Administrator',
    email: 'admin@shiyastudio.com',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      const currentEmail = meData.email;

      if (!currentEmail) return;

      const res = await fetch('/api/users');
      const users = await res.json();
      const currentUser = users.find((u: any) => u.email === currentEmail);
      
      if (currentUser) {
        setProfile(currentUser);
      } else {
        setProfile(prev => ({ 
          ...prev, 
          email: currentEmail, 
          name: currentEmail.split('@')[0] 
        }));
      }
    } catch (e) {
      toast.error('Failed to load profile');
    }
  };

  const handleSave = async () => {
    if (!profile._id) {
      toast.error('Profile not synced with database. Please refresh.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: profile._id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar
        })
      });
      if (res.ok) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update');
      }
    } catch (e) {
      toast.error('Connection error');
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setProfile({ ...profile, avatar: data.url });
        toast.success('Image uploaded! Click Save to apply changes.');
      } else {
        toast.error('Upload failed');
      }
    } catch (err) {
      toast.error('Upload error');
    }
    setUploading(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (err) {
      window.location.href = '/admin/login';
    }
  };

  const avatarUrl = profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 font-sans">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleImageUpload} 
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
         <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">Profile Settings</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your administrative identity</p>
         </div>
         <div className="flex gap-2 w-full sm:w-auto">
           <button 
             onClick={handleLogout}
             className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-red-100 text-red-500 px-4 py-2 rounded-xl hover:bg-red-50 transition font-bold text-[10px] uppercase tracking-widest"
           >
              <LogOut size={14} /> Logout
           </button>
           <button 
             onClick={handleSave}
             disabled={loading}
             className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-bold text-[10px] uppercase tracking-widest disabled:opacity-50"
           >
              <Save size={14} /> {loading ? 'Saving...' : 'Save'}
           </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Brief Profile */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="h-20 bg-slate-900" />
              <div className="px-6 pb-6 -mt-10 text-center">
                 <div className="relative inline-block group">
                    <div className="w-24 h-24 rounded-2xl border-4 border-white bg-slate-100 overflow-hidden shadow-md relative">
                       {uploading && (
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                            <Loader2 className="animate-spin text-white" size={24} />
                         </div>
                       )}
                       <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all z-20"
                    >
                       <Camera size={14} />
                    </button>
                 </div>
                 <h3 className="text-base font-bold text-slate-900 mt-4">{profile.name}</h3>
                 <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1">{profile.role}</p>
                 
                 <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-center gap-4">
                    <div className="text-center">
                       <p className="text-xs font-bold text-slate-900">Active</p>
                       <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Status</p>
                    </div>
                    <div className="w-px h-6 bg-slate-100" />
                    <div className="text-center">
                       <p className="text-xs font-bold text-slate-900">Admin</p>
                       <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Access</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Detailed Forms */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                    <User size={16} />
                 </div>
                 <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Account Information</h2>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">Basic profile details</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Display Name</label>
                    <input 
                      type="text" 
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500 transition-all"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Connection</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                      <input 
                        type="email" 
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full px-11 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
