"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Download, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MoreVertical,
  Mail,
  User,
  DollarSign,
  Calendar,
  ChevronRight,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface QuotationItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface Quotation {
  _id?: string;
  quotationNumber: string;
  clientName: string;
  clientEmail: string;
  items: QuotationItem[];
  subtotal: number;
  vat: number;
  total: number;
  status: 'pending' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function QuotationsAdminPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentQuotation, setCurrentQuotation] = useState<Partial<Quotation>>({
    quotationNumber: `SQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    clientName: '',
    clientEmail: '',
    items: [{ description: '', quantity: 1, price: 0, total: 0 }],
    subtotal: 0,
    vat: 0,
    total: 0,
    status: 'pending'
  });

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quotations');
      const data = await res.json();
      setQuotations(data);
    } catch (e) {
      toast.error('Failed to load quotations');
    }
    setLoading(false);
  };

  const handleAddItem = () => {
    const items = [...(currentQuotation.items || []), { description: '', quantity: 1, price: 0, total: 0 }];
    setCurrentQuotation({ ...currentQuotation, items });
  };

  const handleRemoveItem = (index: number) => {
    const items = [...(currentQuotation.items || [])];
    items.splice(index, 1);
    calculateTotals(items);
  };

  const handleItemChange = (index: number, field: keyof QuotationItem, value: any) => {
    const items = [...(currentQuotation.items || [])];
    const item = { ...items[index], [field]: value };
    item.total = item.quantity * item.price;
    items[index] = item;
    calculateTotals(items);
  };

  const calculateTotals = (items: QuotationItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const vat = subtotal * 0.07;
    const total = subtotal + vat;
    setCurrentQuotation({ ...currentQuotation, items, subtotal, vat, total });
  };

  const handleSave = async () => {
    if (!currentQuotation.clientName) return toast.error('Please enter client name');
    
    try {
      const method = currentQuotation._id ? 'PUT' : 'POST';
      const body = currentQuotation._id 
        ? { id: currentQuotation._id, ...currentQuotation } 
        : currentQuotation;

      const res = await fetch('/api/quotations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        toast.success(currentQuotation._id ? 'Updated successfully' : 'Created successfully');
        setShowModal(false);
        fetchQuotations();
      } else {
        toast.error('Save failed');
      }
    } catch (e) {
      toast.error('Error saving quotation');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quotation?')) return;
    try {
      const res = await fetch(`/api/quotations?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deleted successfully');
        fetchQuotations();
      }
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'sent': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle2 size={12} />;
      case 'rejected': return <XCircle size={12} />;
      case 'sent': return <Mail size={12} />;
      default: return <Clock size={12} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Quotations</h1>
          <p className="text-xs text-slate-500 mt-1">จัดการและออกใบเสนอราคาสำหรับลูกค้า</p>
        </div>
        <button 
          onClick={() => {
            setCurrentQuotation({
              quotationNumber: `SQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
              clientName: '',
              clientEmail: '',
              items: [{ description: '', quantity: 1, price: 0, total: 0 }],
              subtotal: 0,
              vat: 0,
              total: 0,
              status: 'pending'
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-bold text-xs"
        >
          <Plus size={16} /> Create Quotation
        </button>
      </div>

      {/* Stats / Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Quotations" value={quotations.length} icon={<FileText className="text-blue-500" />} />
        <StatCard title="Pending" value={quotations.filter(q => q.status === 'pending').length} icon={<Clock className="text-slate-400" />} />
        <StatCard title="Accepted" value={quotations.filter(q => q.status === 'accepted').length} icon={<CheckCircle2 className="text-green-500" />} />
        <StatCard title="Revenue (Accepted)" value={quotations.filter(q => q.status === 'accepted').reduce((s, q) => s + q.total, 0).toLocaleString()} icon={<DollarSign className="text-emerald-500" />} />
      </div>

      {/* List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Number</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Client</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : quotations.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No quotations found.</td></tr>
              ) : quotations.map((q) => (
                <tr key={q._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-slate-900">{q.quotationNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{q.clientName}</span>
                      <span className="text-[10px] text-slate-400">{q.clientEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-900">฿{q.total.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(q.status)}`}>
                      {getStatusIcon(q.status)}
                      {q.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {new Date(q.createdAt).toLocaleDateString('th-TH')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={`/${window.location.pathname.split('/')[1]}/quotations/${q._id}/print`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" 
                        title="Print in New Tab"
                      >
                        <Download size={14} />
                      </a>
                      <button onClick={() => { setCurrentQuotation(q); setShowModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit"><Edit3 size={14} /></button>
                      <button onClick={() => handleDelete(q._id!)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{currentQuotation._id ? 'Edit Quotation' : 'New Quotation'}</h2>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">{currentQuotation.quotationNumber}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text" 
                      value={currentQuotation.clientName}
                      onChange={(e) => setCurrentQuotation({...currentQuotation, clientName: e.target.value})}
                      placeholder="เช่น บจก. เอบีซี ครีเอทีฟ"
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="email" 
                      value={currentQuotation.clientEmail}
                      onChange={(e) => setCurrentQuotation({...currentQuotation, clientEmail: e.target.value})}
                      placeholder="client@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Items / Services</label>
                  <button onClick={handleAddItem} className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase tracking-widest">
                    <Plus size={14} /> Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {currentQuotation.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start group">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Description of service..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div className="w-20">
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-center focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div className="w-32">
                        <input 
                          type="number" 
                          value={item.price}
                          onChange={(e) => handleItemChange(idx, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="Price"
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div className="w-32 py-3 text-right font-black text-slate-900 text-sm">
                        ฿{item.total.toLocaleString()}
                      </div>
                      <button onClick={() => handleRemoveItem(idx)} className="p-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Summary */}
              <div className="flex flex-col md:flex-row gap-8 items-end pt-4 border-t border-slate-100">
                <div className="flex-1 w-full space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quotation Status</label>
                  <select 
                    value={currentQuotation.status}
                    onChange={(e) => setCurrentQuotation({...currentQuotation, status: e.target.value as any})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="sent">Sent to Client</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div className="w-full md:w-64 bg-slate-50 rounded-3xl p-6 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Subtotal</span>
                    <span>฿{currentQuotation.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>VAT (7%)</span>
                    <span>฿{currentQuotation.vat?.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                    <span>Total</span>
                    <span>฿{currentQuotation.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={handleSave} className="px-8 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2">
                <Save size={16} /> Save Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: any, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-lg font-black text-slate-900 leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}
