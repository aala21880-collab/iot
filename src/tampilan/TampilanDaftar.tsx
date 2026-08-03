import React, { useState } from 'react';
import { ViewType, UserProfile } from '../types';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { USER_AVATAR } from '../data/mockData';
import { LogoAgriSteward } from '../komponen/LogoAgriSteward';

interface TampilanDaftarProps {
  setCurrentView: (view: ViewType) => void;
  onRegisterSuccess: (user: UserProfile) => void;
}

export const TampilanDaftar: React.FC<TampilanDaftarProps> = ({ setCurrentView, onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !password) {
      setErrorMsg('Harap lengkapi semua kolom bertanda wajib.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Kata sandi minimal terdiri dari 4 karakter.');
      return;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: phone || '+62 812-3456-7890',
      location: location || 'Sukamandi, Subang, Jawa Barat',
      password,
      role: 'Petani Terverifikasi',
      avatar: USER_AVATAR,
    };

    let existingUsers: any[] = [];
    try {
      const stored = localStorage.getItem('agri_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          existingUsers = parsed;
        }
      }
    } catch (err) {
      console.error('Gagal membaca data pengguna:', err);
    }
    existingUsers.push(newUser);
    try {
      localStorage.setItem('agri_users', JSON.stringify(existingUsers));
    } catch (err) {
      console.error('Gagal menyimpan data pengguna:', err);
    }

    const loggedUser: UserProfile = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      location: newUser.location,
      role: newUser.role,
      avatar: newUser.avatar,
    };

    setSuccessMsg('Pendaftaran berhasil! Mengalihkan ke Dasbor...');
    setTimeout(() => {
      onRegisterSuccess(loggedUser);
      setCurrentView('dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center p-4 selection:bg-[#a6f2d1]">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#bec9c2]/40 shadow-xl overflow-hidden p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 my-8">
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
          <h2 className="font-extrabold text-2xl text-[#151c27]">Daftar Akun Baru</h2>
          <p className="text-xs text-[#3f4944] mt-1">
            Bergabunglah dengan platform IoT pemantauan lahan dan otomatisasi irigasi.
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
              Nama Lengkap *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4944]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Budi Santoso"
                className="w-full bg-[#f0f3ff] border border-[#bec9c2] text-xs py-2.5 pl-9 pr-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#004532] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
              Email *
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                WhatsApp / No HP
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4944]" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812-3456-7890"
                  className="w-full bg-[#f0f3ff] border border-[#bec9c2] text-xs py-2.5 pl-9 pr-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#004532] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                Lokasi Lahan Utama
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4944]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Subang, Jawa Barat"
                  className="w-full bg-[#f0f3ff] border border-[#bec9c2] text-xs py-2.5 pl-9 pr-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#004532] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                Kata Sandi *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4944]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f0f3ff] border border-[#bec9c2] text-xs py-2.5 pl-9 pr-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#004532] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                Konfirmasi Kata Sandi *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4944]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f0f3ff] border border-[#bec9c2] text-xs py-2.5 pl-9 pr-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#004532] outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#004532] text-white font-bold text-xs rounded-xl hover:bg-[#065f46] transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Daftar Akun</span>
            <ArrowRight className="w-4 h-4 text-[#a6f2d1]" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#bec9c2]/30 text-xs text-[#3f4944]">
          Sudah punya akun?{' '}
          <button
            onClick={() => setCurrentView('login')}
            className="font-bold text-[#004532] hover:underline"
          >
            Masuk Di Sini
          </button>
        </div>
      </div>
    </div>
  );
};
