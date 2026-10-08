"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {ArrowRight,ShieldCheck,Loader2,ArrowLeft} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {useLocale} from 'next-intl';
import './Login.css';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requireOtp) {
          setStep('otp');
          toast.success('OTP sent to your registered email');
        } else {
          // If OTP is disabled for some reason
          toast.success('Login Successful!');
          const locale = window.location.pathname.split('/')[1] || 'th';
          router.push(`/${locale}/admin`);
        }
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch {
      toast.error('Connection error');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      if (res.ok) {
        toast.success('Verification successful!');
        const locale = window.location.pathname.split('/')[1] || 'th';
        router.push(`/${locale}/admin`);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Invalid OTP');
      }
    } catch {
      toast.error('Connection error');
    }
    setLoading(false);
  };

  const locale=useLocale();
  return <main className="admin-login">
    <aside className="admin-login-brand"><Image src="/logo/logo.png" alt="SHIYA STUDIO" width={90} height={90} preload/><p>SHIYA STUDIO / WORKSPACE</p><h1>พื้นที่ทำงาน<br/>ของทีม SHIYA</h1><span>ดูแลเนื้อหาเว็บไซต์ ผลงาน และเครือข่ายครีเอเตอร์ในที่เดียว</span></aside>
    <section className="admin-login-main"><Link href={`/${locale}`} className="admin-login-back"><ArrowLeft size={16}/>กลับไปเว็บไซต์</Link><div className="admin-login-form"><span className="admin-login-badge"><ShieldCheck size={22}/></span><p className="admin-login-eyebrow">ADMIN ACCESS</p><h2>{step==='login'?'เข้าสู่ระบบหลังบ้าน':'ยืนยันรหัส OTP'}</h2><p className="admin-login-description">{step==='login'?'เข้าสู่ระบบด้วยบัญชีผู้ดูแลของคุณ':`กรอกรหัส 6 หลักที่ส่งไปยัง ${email}`}</p>
      {step==='login'?<form onSubmit={handleLogin}><label htmlFor="admin-email">อีเมล<input id="admin-email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@shiyastudio.com" required/></label><label htmlFor="admin-password">รหัสผ่าน<input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="กรอกรหัสผ่าน" required/></label><button type="submit" disabled={loading}>{loading?<><Loader2 size={17} className="admin-login-spin"/>กำลังตรวจสอบ…</>:<>เข้าสู่ระบบ<ArrowRight size={18}/></>}</button></form>:<form onSubmit={handleVerifyOtp}><label htmlFor="admin-otp">รหัสยืนยัน<input id="admin-otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" value={otp} onChange={e=>setOtp(e.target.value)} className="admin-otp" placeholder="000000" required autoFocus/></label><button type="submit" disabled={loading}>{loading?<><Loader2 size={17} className="admin-login-spin"/>กำลังยืนยัน…</>:<>ยืนยันและเข้าสู่ระบบ<ArrowRight size={18}/></>}</button><button type="button" disabled={loading} className="admin-login-secondary" onClick={()=>setStep('login')}>กลับไปเข้าสู่ระบบ</button></form>}
      <p className="admin-login-footnote">สำหรับผู้ดูแล SHIYA STUDIO</p>
    </div></section>
  </main>;
}
