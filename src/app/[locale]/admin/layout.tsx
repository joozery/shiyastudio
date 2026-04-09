import React from 'react';
import { 
  LayoutDashboard, 
  BarChart2, 
  ArrowLeftRight, 
  FileText, 
  RefreshCw, 
  UserPlus, 
  MessageSquare,
  Search,
  Bell,
  Mail,
  HelpCircle,
  ChevronRight,
  Settings,
  ChevronDown,
  Layers,
  LogOut,
  AppWindow
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      
      {/* Sidebar - Reverted to Original Dark */}
      <aside className="w-64 border-r border-white/5 flex flex-col fixed h-full bg-[#080808] z-50 text-white">
        
        {/* Workspace Switcher */}
        <div className="p-4 pt-6">
           <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all cursor-pointer group mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform text-left">
                <span className="text-white font-black text-xs">S.</span>
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-[11px] font-black uppercase tracking-tighter leading-none mb-1 text-white">Shiya Main</p>
                <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.1em] truncate text-left">Creative Agency</p>
              </div>
              <ChevronDown size={14} className="text-white/20 group-hover:text-blue-500 transition-colors" />
           </div>
        </div>

        {/* Quick Action / Search */}
        <div className="px-4 mb-6 text-left">
          <div className="relative group text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="ค้นหาด่วน..." 
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[10px] focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-white/10 text-white"
            />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 overflow-y-auto space-y-6 scrollbar-hide text-left">
          
          <div>
            <p className="px-4 text-[9px] font-black text-white/10 uppercase tracking-[0.4em] mb-4">การจัดการ</p>
            <div className="space-y-1">
              <NavItem icon={<AppWindow size={16} />} label="ภาพรวมระบบ" active />
              <NavItem icon={<FileText size={16} />} label="โปรเจกต์ทั้งหมด" count={12} />
              <NavItem icon={<MessageSquare size={16} />} label="การติดต่อใหม่" count={5} />
              <NavItem icon={<ArrowLeftRight size={16} />} label="ใบเสนอราคา" />
            </div>
          </div>

          <div>
            <p className="px-4 text-[9px] font-black text-white/10 uppercase tracking-[0.4em] mb-4">ฝ่ายผลิต</p>
            <div className="space-y-1">
              <NavItem icon={<Layers size={16} />} label="ทรัพยากรงาน" />
              <NavItem icon={<RefreshCw size={16} />} label="ฐานข้อมูล KOL" />
              <NavItem icon={<UserPlus size={16} />} label="ทีมงาน Shiya" />
            </div>
          </div>

          <div className="px-2">
            <div className="bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-600/10 rounded-2xl p-4 relative overflow-hidden group cursor-pointer hover:border-blue-600/30 transition-all text-left">
               <div className="relative z-10 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest text-left">Premium Plan</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse text-left" />
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-3 text-left">
                    <div className="w-3/4 h-full bg-blue-600 text-left" />
                  </div>
                  <p className="text-[9px] text-white/40 leading-relaxed font-bold uppercase tracking-tight text-left text-left">ขยายศักยภาพเอเจนซี่ของคุณ</p>
               </div>
            </div>
          </div>
        </nav>

        {/* Fixed Bottom Section */}
        <div className="p-4 border-t border-white/5 bg-[#080808] text-left">
           <div className="space-y-1">
             <NavItem icon={<Settings size={16} />} label="ตั้งค่า" />
             <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-red-500/5 group cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                   <LogOut size={16} className="text-white/20 group-hover:text-red-500 transition-colors" />
                   <span className="text-[11px] font-bold tracking-wide uppercase text-white/20 group-hover:text-white transition-colors">ออกจากระบบ</span>
                </div>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Header - Solid Dark (Bolder) */}
        <header className="h-16 flex items-center justify-between px-10 sticky top-0 bg-[#080808] border-b border-white/5 z-40 transition-all">
          <div className="flex items-center gap-6">
             <nav className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] overflow-hidden text-left">
                <span className="text-white/20 hover:text-white transition-colors cursor-pointer whitespace-nowrap">Shiya Studio</span>
                <ChevronRight size={10} className="text-white/10" />
                <span className="text-white whitespace-nowrap">แผงควบคุมหลัก</span>
             </nav>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 border-r border-white/5 pr-4">
                <HeaderButton icon={<Bell size={16} />} dot />
                <HeaderButton icon={<Mail size={16} />} />
             </div>
             
             <div className="flex items-center gap-3 group cursor-pointer pl-2">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 group-hover:border-blue-500 transition-all shadow-xl">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                </div>
                <div className="flex flex-col text-left">
                   <p className="text-[10px] font-black uppercase tracking-tight leading-none text-white group-hover:text-blue-500 transition-colors">Admin Shiya</p>
                   <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Superuser</p>
                </div>
             </div>
          </div>
        </header>

        {/* Content Area - Stays White */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, count }: { icon: React.ReactNode, label: string, active?: boolean, count?: number }) {
  return (
    <div className={`
      relative group flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-300
      ${active ? 'bg-white/[0.04] text-white' : 'text-white/40 hover:text-white hover:bg-white/[0.02]'}
    `}>
      {active && (
        <div className="absolute left-0 w-1 h-4 bg-blue-600 rounded-r-full shadow-[0_0_12px_rgba(37,99,235,0.8)]" />
      )}
      
      <div className="flex items-center gap-3 relative z-10 text-left">
        <div className={`${active ? 'text-blue-500' : 'group-hover:text-blue-500'} transition-transform group-hover:scale-110 duration-300`}>
          {icon}
        </div>
        <span className="text-[11px] font-black tracking-widest uppercase">{label}</span>
      </div>
      
      {count && (
        <span className="relative z-10 text-[9px] font-black text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded-[4px] border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all text-left">
          {count}
        </span>
      )}
    </div>
  );
}

function HeaderButton({ icon, dot = false }: { icon: React.ReactNode, dot?: boolean }) {
  return (
    <button className="relative w-9 h-9 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer group">
      <div className="group-hover:scale-110 transition-transform">{icon}</div>
      {dot && <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-600 rounded-full border border-[#050505]" />}
    </button>
  );
}
