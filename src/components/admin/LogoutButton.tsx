"use client";

import React from 'react';
import { LogOut } from 'lucide-react';

export default function LogoutButton({ locale }: { locale: string }) {
  return (
    <button 
      onClick={async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
          window.location.href = `/${locale}/admin/login`;
        } catch (err) {
          console.error('Logout failed', err);
          // Fallback redirect
          window.location.href = `/${locale}/admin/login`;
        }
      }}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-red-500/5 group cursor-pointer transition-all outline-none"
    >
       <div className="flex items-center gap-3 text-left">
          <LogOut size={16} className="text-white/20 group-hover:text-red-500 transition-colors" />
          <span className="text-[11px] font-medium tracking-wide uppercase text-white/20 group-hover:text-white transition-colors">ออกจากระบบ</span>
       </div>
    </button>
  );
}
