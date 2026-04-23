"use client";

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  User, 
  Mail, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  Search,
  Calendar,
  Filter,
  MoreHorizontal,
  ChevronRight,
  MailOpen
} from 'lucide-react';
import { toast } from 'sonner';

interface Contact {
  _id: string;
  name: string;
  email: string;
  services: string[];
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contacts');
      const data = await res.json();
      setContacts(data);
    } catch (e) {
      toast.error('Failed to load contact messages');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' });
      // Note: Need to add DELETE method to API if not already there
      if (res.ok) {
        toast.success('Deleted');
        fetchContacts();
        if (selectedContact?._id === id) setSelectedContact(null);
      }
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Contact Messages</h1>
        <p className="text-xs text-slate-500 mt-1">จัดการข้อมูลการติดต่อและสอบถามจากลูกค้า</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Messages List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search messages..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="py-10 text-center text-slate-400 animate-pulse">Loading messages...</div>
            ) : contacts.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                <MessageSquare size={32} className="mx-auto mb-4 opacity-20" />
                <p className="text-[10px] font-bold uppercase tracking-widest">No messages yet</p>
              </div>
            ) : contacts.map((contact) => (
              <button 
                key={contact._id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-2 group relative ${
                  selectedContact?._id === contact._id 
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-md"
                }`}
              >
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedContact?._id === contact._id ? "bg-white/20" : "bg-slate-50"
                      }`}>
                         <User size={18} className={selectedContact?._id === contact._id ? "text-white" : "text-slate-400"} />
                      </div>
                      <div>
                         <p className={`text-sm font-bold truncate max-w-[150px] ${
                           selectedContact?._id === contact._id ? "text-white" : "text-slate-900"
                         }`}>{contact.name}</p>
                         <p className={`text-[10px] font-medium ${
                           selectedContact?._id === contact._id ? "text-white/60" : "text-slate-400"
                         }`}>{new Date(contact.createdAt).toLocaleDateString('th-TH')}</p>
                      </div>
                   </div>
                   {contact.status === 'unread' && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                   )}
                </div>
                <p className={`text-[11px] line-clamp-2 leading-relaxed ${
                  selectedContact?._id === contact._id ? "text-white/80" : "text-slate-500"
                }`}>
                  {contact.message}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                   {contact.services.slice(0, 2).map((s, i) => (
                      <span key={i} className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        selectedContact?._id === contact._id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      }`}>{s}</span>
                   ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Detail View */}
        <div className="lg:col-span-7">
          {selectedContact ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px] animate-in slide-in-from-right-4 duration-300">
               {/* Detail Header */}
               <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                        <MailOpen size={20} />
                     </div>
                     <div>
                        <h2 className="text-lg font-bold text-slate-900">{selectedContact.name}</h2>
                        <p className="text-[11px] font-medium text-slate-500">{selectedContact.email}</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(selectedContact._id)}
                    className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                     <Trash2 size={18} />
                  </button>
               </div>

               {/* Detail Content */}
               <div className="p-6 flex-1 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Received Date</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                           <Calendar size={14} className="text-blue-500" />
                           {new Date(selectedContact.createdAt).toLocaleString('th-TH')}
                        </div>
                     </div>
                     <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Interested Services</p>
                        <div className="flex flex-wrap justify-end gap-1.5 mt-2">
                           {selectedContact.services.map((s, i) => (
                              <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[9px] font-bold border border-slate-200">
                                 {s}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Message Body</p>
                     <div className="bg-slate-50 rounded-2xl p-6 text-slate-700 text-xs leading-relaxed whitespace-pre-wrap min-h-[150px]">
                        {selectedContact.message || "No message content provided."}
                     </div>
                  </div>
               </div>

               {/* Detail Actions */}
               <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex gap-3">
                  <a 
                    href={`mailto:${selectedContact.email}`}
                    className="flex-1 flex items-center justify-center gap-3 bg-blue-600 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                  >
                     <Mail size={16} /> Reply via Email
                  </a>
                  <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">
                     Mark as Read
                  </button>
               </div>
            </div>
          ) : (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                  <MessageSquare size={24} className="opacity-20" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em]">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
