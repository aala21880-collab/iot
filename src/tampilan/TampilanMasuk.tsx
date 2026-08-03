import React, { useState } from 'react';
import { ViewType, UserProfile } from '../types';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { USER_AVATAR } from '../data/mockData';
import { LogoAgriSteward } from '../komponen/LogoAgriSteward';

interface TampilanMasukProps {
  setCurrentView: (view: ViewType) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const TampilanMasuk: React.FC<TampilanMasukProps> = ({ setCurrentView, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Harap isi email dan kata sandi Anda.');
      return;
    }

    let savedUsers: any[] = [];
    try {
      const stored = localStorage.getItem('agri_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          savedUsers = parsed;
        }
      }
    } catch (err) {
      console.error('Gagal membaca data pengguna:', err);
    }

    const foundUser = savedUsers.find(
      (u: any) => u && typeof u.email === 'string' && u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    let loggedUser: UserProfile;

    if (foundUser) {
      loggedUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone || '+62 812-3456-7890',
        location: foundUser.location || 'Sukamandi, Subang, Jawa Barat',
        role: 'Petani Terverifikasi',
        avatar: foundUser.avatar || USER_AVATAR,
      };
    } else {
      loggedUser = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0] || 'Petani Digital',
        email: email,
        phone: '+62 812-3456-7890',
        location: 'Sukamandi, Subang, Jawa Barat',
        role: 'Petani Terverifikasi',
        avatar: USER_AVATAR,
      };
    }

    setSuccessMsg('Login berhasil! Mengalihkan ke Dasbor...');
    setTimeout(() => {
      onLoginSuccess(loggedUser);
      setCurrentView('dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center p-4 selection:bg-[#a6f2d1]">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#bec9c2]/40 shadow-xl overflow-hidden p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#3f4944] hover:text-[#004532] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ke Beranda</span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('landing')}>
            <LogoAgriSteward className="w-8 h-8" />
            <span className="font-bold text-sm text-[#004532]">AGRI STEWARD</span>
          </div>
        </div>

        <div>
          <h2 className="font-extrabold text-2xl text-[#151c27]">Masuk ke Akun Anda</h2>
          <p className="text-xs text-[#3f4944] mt-1">
            Akses data lahan, sensor IoT real-time, dan kontrol irigasi otomatis.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#ffdad6] text-[#93000a] rounded-xl text-xs font-semibold border border-[#ffb4ab]">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-[#a6f2d1] text-[#004532] rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#004532]" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4944]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@petani.id"
                className="w-full bg-[#f0f3ff] border border-[#bec9c2] text-xs py-2.5 pl-9 pr-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#004532] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4944]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f0f3ff] border border-[#bec9c2] text-xs py-2.5 pl-9 pr-10 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#004532] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3f4944] hover:text-[#151c27]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#004532] text-white font-bold text-xs rounded-xl hover:bg-[#065f46] transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Masuk Sekarang</span>
            <ArrowRight className="w-4 h-4 text-[#a6f2d1]" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#bec9c2]/30 text-xs text-[#3f4944]">
          Belum punya akun?{' '}
          <button
            onClick={() => setCurrentView('register')}
            className="font-bold text-[#004532] hover:underline"
          >
            Daftar Akun Baru
          </button>
        </div>
      </div>
    </div>
  );
};
