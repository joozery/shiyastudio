"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, ShieldCheck, Zap, Mail, Key } from 'lucide-react';
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
    } catch (err) {
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
    } catch (err) {
      toast.error('Connection error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-[380px] relative z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Logo Section - Scaled Down */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] mb-4 transition-transform hover:scale-105">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter uppercase mb-1">Shiya Console</h1>
          <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.4em]">Secure Access Portal</p>
        </div>

        {/* Login Card - More Compact */}
        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
          {step === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/10 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@shiyastudio.com"
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white text-xs focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-white/5"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Access Key</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/10 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white text-xs focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-white/5"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full group flex items-center justify-between bg-blue-600 hover:bg-blue-500 text-white rounded-xl pl-6 pr-1.5 py-1.5 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] mt-2 disabled:opacity-50"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{loading ? 'Verifying...' : 'Continue'}</span>
                <div className="w-9 h-9 bg-white text-black rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <ArrowRight size={16} />
                </div>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-2">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail size={18} className="text-emerald-500" />
                </div>
                <h3 className="text-sm font-bold text-white">Enter OTP</h3>
                <p className="text-[9px] text-white/40 mt-1 uppercase tracking-wider">Sent to admin@shiyastudio.com</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Verification Code</label>
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/10 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white text-center text-lg font-black tracking-[0.5em] focus:outline-none focus:border-emerald-500/30 transition-all placeholder:text-white/5"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full group flex items-center justify-between bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl pl-6 pr-1.5 py-1.5 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] mt-2 disabled:opacity-50"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{loading ? 'Checking...' : 'Verify & Login'}</span>
                <div className="w-9 h-9 bg-white text-black rounded-lg flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                  <ShieldCheck size={16} />
                </div>
              </button>

              <button 
                type="button"
                onClick={() => setStep('login')}
                className="w-full text-[9px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors pt-2"
              >
                Back to Login
              </button>
            </form>
          )}

          {/* Compact Footer */}
          <div className="mt-8 flex items-center justify-center gap-3 border-t border-white/5 pt-6">
            <div className="flex items-center gap-1 opacity-20">
               <Zap size={8} className="text-white" />
               <span className="text-[7px] font-bold text-white uppercase tracking-widest">v2.4.0</span>
            </div>
            <div className="w-1 h-1 bg-white/10 rounded-full" />
            <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Shiya Studio</span>
          </div>
        </div>
      </div>
    </div>
  );
}
