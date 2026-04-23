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
  AppWindow,
  Globe,
  Play,
  Shield
} from 'lucide-react';
import { Toaster } from 'sonner';
import Link from 'next/link';
import LogoutButton from '@/components/admin/LogoutButton';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'th';
  
  // Get User Info from DB
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  let userData = { email: 'Admin User', role: 'Senior Administrator', avatar: '' };
  
  try {
    if (session?.value) {
      let currentEmail = '';
      if (session.value.startsWith('{')) {
        const parsed = JSON.parse(session.value);
        currentEmail = parsed.email;
      } else if (session.value === 'authenticated') {
        currentEmail = 'admin@shiyastudio.com';
      }

      if (currentEmail) {
        const client = await clientPromise;
        const db = client.db('shiyastudio');
        const user = await db.collection('users').findOne({ email: currentEmail });
        if (user) {
          userData.email = user.email;
          userData.role = user.role || 'Senior Administrator';
          userData.avatar = user.avatar || '';
        }
      }
    }
  } catch (e) {
    console.error('Failed to fetch user in layout', e);
  }

  const avatarUrl = userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: { fontFamily: 'sans-serif', fontSize: '13px' },
        }}
      />
      {/* Sidebar - Reverted to Original Dark */}
      <aside className="w-64 border-r border-white/5 flex flex-col fixed h-full bg-[#080808] z-50 text-white print:hidden">
        
        {/* Workspace Switcher */}
        <div className="p-4 pt-6">
           <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all cursor-pointer group mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform text-left">
                <span className="text-white font-black text-xs">S.</span>
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-[11px] font-bold uppercase tracking-tighter leading-none mb-1 text-white">Shiya Main</p>
                <p className="text-[8px] font-medium text-white/20 uppercase tracking-[0.1em] truncate text-left">Creative Agency</p>
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
            <p className="px-4 text-[9px] font-bold text-white/10 uppercase tracking-[0.4em] mb-4">การจัดการ</p>
            <div className="space-y-1">
              <Link href={`/${locale}/admin/dashboard`} className="block outline-none">
                <NavItem icon={<AppWindow size={16} />} label="ภาพรวมระบบ" active />
              </Link>
              <Link href={`/${locale}/admin/projects`} className="block outline-none">
                <NavItem icon={<FileText size={16} />} label="โปรเจกต์ทั้งหมด" count={12} />
              </Link>
              <Link href={`/${locale}/admin/contacts`} className="block outline-none">
                <NavItem icon={<MessageSquare size={16} />} label="การติดต่อใหม่" count={5} />
              </Link>
              <Link href={`/${locale}/admin/quotations`} className="block outline-none">
                <NavItem icon={<ArrowLeftRight size={16} />} label="ใบเสนอราคา" />
              </Link>
              <Link href={`/${locale}/admin/users`} className="block outline-none">
                <NavItem icon={<Shield size={16} />} label="จัดการแอดมิน" />
              </Link>
            </div>
          </div>

          <div>
            <p className="px-4 text-[9px] font-bold text-white/10 uppercase tracking-[0.4em] mb-4">ฝ่ายผลิต</p>
            <div className="space-y-1">
              <NavItem icon={<Layers size={16} />} label="ทรัพยากรงาน" />
              <NavItem icon={<RefreshCw size={16} />} label="ฐานข้อมูล KOL" />
              <NavItem icon={<UserPlus size={16} />} label="ทีมงาน Shiya" />
            </div>
          </div>

          <div>
            <p className="px-4 text-[9px] font-bold text-white/10 uppercase tracking-[0.4em] mb-4">เว็บไซต์</p>
            <div className="space-y-1">
              <Link href={`/${locale}/admin/hero`} className="block outline-none">
                <NavItem icon={<AppWindow size={16} />} label="Hero Section" />
              </Link>
              <Link href={`/${locale}/admin/services`} className="block outline-none">
                <NavItem icon={<Layers size={16} />} label="Services Section" />
              </Link>
              <Link href={`/${locale}/admin/projects`} className="block outline-none">
                <NavItem icon={<FileText size={16} />} label="Projects Section" />
              </Link>
              <Link href={`/${locale}/admin/clients`} className="block outline-none">
                <NavItem icon={<Globe size={16} />} label="Clients Section" />
              </Link>
              <Link href={`/${locale}/admin/influencer`} className="block outline-none">
                <NavItem icon={<Play size={16} />} label="Influencer Section" />
              </Link>
            </div>
          </div>


        </nav>

        {/* Fixed Bottom Section */}
        <div className="p-4 border-t border-white/5 bg-[#080808] text-left">
           <div className="space-y-1">
             <Link href={`/${locale}/admin/settings`} className="block outline-none">
               <NavItem icon={<Settings size={16} />} label="ตั้งค่า" />
             </Link>
             <LogoutButton locale={locale} />
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-w-0 print:ml-0">
        {/* Header - Clean Professional Light Design */}
        <header className="h-16 flex items-center justify-between px-8 sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 transition-all print:hidden">
          <div className="flex items-center gap-8">
             {/* Left: Breadcrumbs & Status */}
             <nav className="flex items-center gap-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                <span className="hover:text-blue-600 transition-colors cursor-pointer">Shiya Ecosystem</span>
                <ChevronRight size={12} className="text-slate-300" />
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                   <span className="text-slate-900 font-semibold tracking-wide">Admin Dashboard</span>
                </div>
             </nav>
          </div>

          <div className="flex items-center gap-6">
             {/* Right: Actions & Profile */}
             <div className="flex items-center gap-2 pr-6 border-r border-slate-200">
                <HeaderButton icon={<Bell size={16} />} dot />
                <HeaderButton icon={<Mail size={16} />} />
                <HeaderButton icon={<HelpCircle size={16} />} />
             </div>
             
             <Link href={`/${locale}/admin/settings`} className="flex items-center gap-4 group cursor-pointer pl-2 outline-none">
                <div className="flex flex-col text-right hidden lg:block">
                   <p className="text-[12px] font-semibold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-[150px]">
                     {userData.email.split('@')[0]}
                   </p>
                   <p className="text-[9px] font-medium text-slate-500 mt-0.5 uppercase tracking-widest">{userData.role}</p>
                </div>
                <div className="relative">
                   <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 group-hover:border-blue-500 transition-all shadow-sm">
                      <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
                   </div>
                   <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                </div>
             </Link>
          </div>
        </header>

        {/* Content Area - Stays White */}
        <div className="p-8 print:p-0">
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
      ${active ? 'bg-white/[0.04] text-white' : 'text-white/60 hover:text-white hover:bg-white/[0.02]'}
    `}>
      {active && (
        <div className="absolute left-0 w-1 h-4 bg-blue-600 rounded-r-full shadow-[0_0_12px_rgba(37,99,235,0.8)]" />
      )}
      
      <div className="flex items-center gap-3 relative z-10 text-left">
        <div className={`${active ? 'text-blue-500' : 'group-hover:text-blue-500'} transition-transform group-hover:scale-110 duration-300`}>
          {icon}
        </div>
        <span className="text-[11px] font-medium tracking-widest uppercase">{label}</span>
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
    <button className="relative w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all cursor-pointer group">
      <div className="group-hover:scale-110 transition-transform">{icon}</div>
      {dot && <div className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-blue-600 rounded-full border border-white" />}
    </button>
  );
}
