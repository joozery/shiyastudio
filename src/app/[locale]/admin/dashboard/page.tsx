import React from 'react';
import { 
  TrendingUp, 
  Layers, 
  Users, 
  Briefcase, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Calendar,
  Clock
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-1000 max-w-[1400px] mx-auto font-sans">
      {/* Agency Snapshot Header */}
      <div className="flex justify-between items-end text-left px-1">
        <div>
          <h1 className="text-xl font-black tracking-tighter uppercase mb-0.5 text-slate-900">ภาพรวม <span className="text-blue-600">เอเจนซี่</span></h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">สรุปประสิทธิภาพการดำเนินงาน • ไตรมาสที่ 2 2026</p>
        </div>
        <div className="flex gap-2 text-left">
           <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all cursor-pointer shadow-sm">
              <Calendar size={10} className="text-blue-500" /> 01 เม.ย. - 30 เม.ย. <ChevronDown size={10} />
           </button>
        </div>
      </div>

      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        {/* Metric 1: Revenue */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl p-5 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 text-left">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-6 text-left">
               <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-white" size={20} />
               </div>
               <span className="text-[8px] bg-white/20 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1 uppercase tracking-widest text-white">
                  +12.4% <TrendingUp size={8} />
               </span>
            </div>
            <div className="text-left">
              <p className="text-white/70 text-[8px] font-bold uppercase tracking-[0.2em] mb-0.5">รายได้ประจำเดือน</p>
              <div className="flex items-baseline gap-1.5 text-left">
                 <span className="text-2xl font-black tracking-tighter text-white">฿4,982,520</span>
                 <span className="text-white/40 text-[8px] font-medium uppercase tracking-widest">THB</span>
              </div>
            </div>
          </div>
        </div>

        <MetricCard label="โปรเจกต์ที่กำลังทำ" val="24" sub="อยู่ระหว่างโปรดักชัน 8 งาน" icon={<Briefcase size={18} />} />
        <MetricCard label="อัตราการปิดดีล" val="3.8%" sub="จากการติดต่อสู่ใบเสนอราคา" icon={<Users size={18} />} />
      </div>

      {/* Main Agency Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 text-left">
         {/* Project Pipeline */}
         <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-left">
            <div className="flex justify-between items-start mb-6 text-left">
               <div>
                  <h3 className="font-black text-[11px] uppercase tracking-widest mb-0.5 text-slate-800">สถานะขั้นตอนงาน</h3>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">การกระจายงานในแต่ละแผนก</p>
               </div>
               <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-[9px] font-bold uppercase tracking-widest px-3.5 py-2 rounded-lg active:scale-95 transition-all text-white cursor-pointer shadow-md shadow-blue-500/20">
                  <Plus size={12} /> เพิ่มโปรเจกต์
               </button>
            </div>
            
            <div className="space-y-4">
               <PipelineStage label="วางกลยุทธ์ (Strategy)" count={4} color="blue" percent={15} />
               <PipelineStage label="ออกแบบสร้างสรรค์ (Creative)" count={9} color="slate" percent={40} />
               <PipelineStage label="โปรดักชัน (Production)" count={8} color="blue" percent={35} />
               <PipelineStage label="ส่งมอบงาน (Delivery)" count={3} color="slate" percent={10} />
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex gap-8 text-left">
               <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 text-left">เวลาเฉลี่ยที่ใช้</p>
                  <p className="text-sm font-black text-slate-900">14.2 วัน</p>
               </div>
               <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 text-left">สุขภาพของระบบงาน</p>
                  <p className="text-sm font-black text-green-600">ยอดเยี่ยม</p>
               </div>
            </div>
         </div>

         {/* Client Inquiries */}
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-left">
            <h3 className="font-black text-[11px] uppercase tracking-widest mb-6 text-slate-800">รายการติดต่อล่าสุด</h3>
            <div className="space-y-2">
               <InquiryRow name="Samsung Global" service="โปรดักชัน" urgency="High" time="2 ชม." />
               <InquiryRow name="TechVision Corp" service="แบรนด์ดิ้ง" urgency="Med" time="5 ชม." />
               <InquiryRow name="Luxe Estates" service="คอนเทนต์" urgency="Low" time="1 วัน" />
               <InquiryRow name="Future Mobility" service="กลยุทธ์" urgency="High" time="2 วัน" />
            </div>
            <button className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer">
               ดูลูกค้าทั้งหมด
            </button>
         </div>
      </div>

      {/* Deliverables */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-left">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-800">รายการที่ต้องส่งมอบ</h3>
            <div className="relative">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
               <input type="text" placeholder="ค้นหาโปรเจกต์..." className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-8 pr-3 text-[9px] focus:outline-none focus:border-blue-500/30 transition-all w-48 font-sans placeholder:text-slate-300" />
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            <ProjectDeliverable title="โฆษณา 30 วินาที" client="Samsung" deadline="24 เม.ย." progress={85} />
            <ProjectDeliverable title="แรนด์ดิ้ง Q2" client="TechVision" deadline="28 เม.ย." progress={45} />
            <ProjectDeliverable title="แคมเปญ KOL" client="Future Mob." deadline="02 พ.ค." progress={20} />
            <ProjectDeliverable title="พัฒนาเว็บ V2" client="Luxe Est." deadline="10 พ.ค." progress={65} />
         </div>
      </div>
    </div>
  );
}

function MetricCard({ label, val, sub, icon }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:bg-slate-50 transition-all group cursor-pointer text-left shadow-sm">
      <div className="flex justify-between items-start mb-6 text-left">
         <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            {icon}
         </div>
         <MoreHorizontal size={14} className="text-slate-200 group-hover:text-slate-400" />
      </div>
      <div className="text-left">
        <p className="text-slate-400 text-[8px] font-bold uppercase tracking-widest mb-0.5"> {label} </p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black tracking-tighter text-slate-900"> {val} </span>
        </div>
        <p className="text-[9px] text-slate-400 font-medium mt-1"> {sub} </p>
      </div>
    </div>
  );
}

function PipelineStage({ label, count, percent, color }: any) {
  return (
    <div className="group cursor-pointer">
       <div className="flex justify-between items-end mb-1.5 text-left">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-800 transition-colors"> {label} </p>
          <p className="text-[8px] font-bold text-blue-600"> {count} โปรเจกต์ </p>
       </div>
       <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-1000 ${color === 'blue' ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'bg-slate-300'}`} style={{ width: `${percent}%` }} />
       </div>
    </div>
  );
}

function InquiryRow({ name, service, urgency, time }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-transparent hover:border-slate-200 hover:bg-white transition-all cursor-pointer group shadow-sm hover:shadow-md">
       <div className="flex items-center gap-3 text-left">
          <div className={`w-1.5 h-1.5 rounded-full ${urgency === 'High' ? 'bg-red-500 shadow-[0_0_5px_red]' : urgency === 'Med' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
          <div className="text-left">
             <p className="text-[10px] font-bold group-hover:text-blue-600 transition-colors uppercase tracking-tight text-slate-800"> {name} </p>
             <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0"> {service} </p>
          </div>
       </div>
       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest"> {time} </p>
    </div>
  );
}

function ProjectDeliverable({ title, client, deadline, progress }: any) {
  return (
    <div className="p-4 rounded-xl bg-slate-50/30 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group shadow-sm hover:shadow-lg text-left">
       <div className="flex justify-between items-start mb-3 text-left">
          <div className="text-left">
             <h4 className="text-[10px] font-black uppercase tracking-tight mb-0.5 group-hover:text-blue-600 transition-colors truncate w-24 text-slate-800"> {title} </h4>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest"> {client} </p>
          </div>
          <span className="text-[9px] font-black text-blue-600"> {progress}% </span>
       </div>
       <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${progress}%` }} />
       </div>
       <div className="flex items-center gap-1.5 text-slate-400 text-[8px] font-bold uppercase tracking-widest text-left">
          <Clock size={8} /> กำหนดส่ง: {deadline}
       </div>
    </div>
  );
}
