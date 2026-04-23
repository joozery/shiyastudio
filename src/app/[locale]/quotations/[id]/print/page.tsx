"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Download, Printer, X } from 'lucide-react';

interface QuotationItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface Quotation {
  _id: string;
  quotationNumber: string;
  clientName: string;
  clientEmail: string;
  items: QuotationItem[];
  subtotal: number;
  vat: number;
  total: number;
  status: string;
  createdAt: string;
}

export default function QuotationPrintPage() {
  const params = useParams();
  const id = params.id as string;
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/quotations`)
        .then(res => res.json())
        .then(data => {
          // Find the specific quotation from the list for now
          // (In a real app, you'd have a GET /api/quotations/[id] route)
          const found = data.find((q: any) => q._id === id);
          setQuotation(found);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center font-sans">Loading quotation...</div>;
  if (!quotation) return <div className="p-8 text-center font-sans">Quotation not found.</div>;

  return (
    <div className="min-h-screen bg-slate-100 py-10 print:bg-white print:py-0">
      {/* Control Bar */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center px-4 print:hidden">
        <button onClick={() => window.close()} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
          <X size={16} /> Close Tab
        </button>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
            <Printer size={16} /> Print Document
          </button>
        </div>
      </div>

      {/* Document */}
      <div className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] print:shadow-none print:max-w-none">
        <div className="p-[40px] md:p-[60px] flex flex-col h-full text-slate-900 font-sans family-noto" id="printable-area">
           <div className="flex justify-between items-start mb-16">
              <div>
                <h1 className="text-4xl font-black tracking-tighter text-blue-600 mb-2">SHIYA STUDIO</h1>
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
                  Creative Agency & Production House<br />
                  Bangkok, Thailand | www.shiyastudio.com
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-900 mb-2">Quotation</h2>
                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                  No: {quotation.quotationNumber}<br />
                  Date: {new Date(quotation.createdAt).toLocaleDateString('th-TH')}
                </p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-12 mb-16 pb-12 border-b border-slate-100">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Customer Information</p>
                <p className="text-base font-bold text-slate-900 mb-1">{quotation.clientName}</p>
                <p className="text-sm font-medium text-slate-500">{quotation.clientEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Issued By</p>
                <p className="text-base font-bold text-slate-900 mb-1">Shiya Studio Co., Ltd.</p>
                <p className="text-sm font-medium text-slate-500">accounts@shiyastudio.com</p>
              </div>
           </div>

           <table className="w-full mb-16">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-4 text-left text-[11px] font-black uppercase tracking-widest">Description</th>
                  <th className="py-4 text-center text-[11px] font-black uppercase tracking-widest w-24">Qty</th>
                  <th className="py-4 text-right text-[11px] font-black uppercase tracking-widest w-32">Unit Price</th>
                  <th className="py-4 text-right text-[11px] font-black uppercase tracking-widest w-32">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotation.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-6 text-sm font-semibold text-slate-700">{item.description}</td>
                    <td className="py-6 text-sm font-bold text-slate-900 text-center">{item.quantity}</td>
                    <td className="py-6 text-sm font-bold text-slate-900 text-right">฿{item.price.toLocaleString()}</td>
                    <td className="py-6 text-sm font-black text-slate-900 text-right">฿{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
           </table>

           <div className="mt-auto flex justify-end">
              <div className="w-72 space-y-4">
                <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span>Subtotal</span>
                  <span>฿{quotation.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span>VAT (7%)</span>
                  <span>฿{quotation.vat.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t-2 border-slate-900 flex justify-between text-xl font-black text-slate-900">
                  <span>Total Amount</span>
                  <span>฿{quotation.total.toLocaleString()}</span>
                </div>
              </div>
           </div>

           <div className="mt-24 pt-16 border-t border-slate-100 grid grid-cols-2 gap-16">
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Terms & Conditions</p>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  1. Payment is due within 15 days from the date of invoice.<br />
                  2. Please make all checks payable to Shiya Studio Co., Ltd.<br />
                  3. Prices are subject to change after 30 days of issuance.
                </p>
              </div>
              <div className="flex flex-col items-center justify-end text-center">
                <div className="w-48 h-[1px] bg-slate-300 mb-4" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Authorized Signature</p>
              </div>
           </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          @page { margin: 0; }
        }
      `}</style>
    </div>
  );
}
