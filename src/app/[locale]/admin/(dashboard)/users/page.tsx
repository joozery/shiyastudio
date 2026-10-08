"use client";
import {useConfirm} from '@/components/admin/ConfirmDialog';

import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Shield, 
  Trash2, 
  Edit2, 
  Search, 
  Mail, 
  Clock,
  MoreVertical,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'Super Admin' | 'Editor' | 'Viewer';
  lastActive: string;
  status: 'active' | 'inactive';
}

export default function AdminManagementPage() {
 const confirmAction=useConfirm();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Editor'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if(!res.ok)throw new Error('โหลดข้อมูลไม่สำเร็จ');
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      toast.error('Failed to load admins');
    }
    setLoading(false);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Admin added successfully');
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'Editor' });
        fetchUsers();
      }
    } catch (e) {
      toast.error('Failed to add admin');
    }
  };

  const handleDelete = async (id: string) => {
    if (await confirmAction('ต้องการลบผู้ดูแลคนนี้ใช่ไหม?')) {
      try {
        const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Admin removed successfully');
          fetchUsers();
        }
      } catch (e) {
        toast.error('Delete failed');
      }
    }
  };

  const visibleUsers=users.filter(user=>[user.name,user.email].join(' ').toLowerCase().includes(searchQuery.trim().toLowerCase()));

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
         <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">จัดการแอดมิน</h1>
            <p className="text-xs text-slate-500 mt-1">จัดการบัญชีผู้ดูแลและสิทธิ์การใช้งาน</p>
         </div>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-bold text-xs"
         >
            <UserPlus size={16} /> เพิ่มแอดมิน
         </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
               <Shield size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-normal">แอดมินทั้งหมด</p>
               <p className="text-xl font-semibold text-slate-900">{users.length}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
               <CheckCircle2 size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-normal">บัญชีที่เปิดใช้งาน</p>
               <p className="text-xl font-semibold text-slate-900">{users.filter(user=>user.status==='active').length}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
               <Clock size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-normal">บัญชีที่ปิดใช้งาน</p>
               <p className="text-xl font-semibold text-slate-900">{users.filter(user=>user.status==='inactive').length}</p>
            </div>
         </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="ค้นหาชื่อหรืออีเมล…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-blue-500/50 transition-all"
               />
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                     <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-normal">ผู้ดูแล</th>
                     <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-normal">Role</th>
                     <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-normal">ใช้งานล่าสุด</th>
                     <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-normal">Status</th>
                     <th className="px-6 py-4 text-right"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">{loading&&<tr><td colSpan={5} className="p-8 text-center text-slate-400" role="status">กำลังโหลดแอดมิน…</td></tr>}{!loading&&!visibleUsers.length&&<tr><td colSpan={5} className="p-8 text-center text-slate-400">{searchQuery?'ไม่พบแอดมินที่ค้นหา':'ยังไม่มีรายการแอดมิน'}</td></tr>}
                  {visibleUsers.map((user, index) => (
                     <tr key={user._id || user.id || index} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                 <img loading="lazy" decoding="async" src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                    alt={user.name} 
                                    className="w-full h-full object-cover"
                                  />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                 <p className="text-xs text-slate-500">{user.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-normal border ${
                              user.role === 'Super Admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                           }`}>
                              {user.role}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                           {user.lastActive}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                              <span className="text-xs font-bold uppercase tracking-normal text-slate-600">{user.status}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                              <button onClick={() => handleDelete(user._id || user.id || '')} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-900">เพิ่มแอดมินistrator</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-normal ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="e.g. Felix Van"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-normal ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="admin@shiyastudio.com"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-normal ml-1">Password</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-normal ml-1">Role Permission</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all appearance-none"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all mt-4"
              >
                Create ผู้ดูแล
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
