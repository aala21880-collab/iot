import React, { useState, useEffect, useRef } from 'react';
import { User, Save, CheckCircle, ShieldCheck, Cpu, LogOut, Camera, Upload, Link, X, Check, Lock, LogIn, UserPlus } from 'lucide-react';
import { UserProfile } from '../types';
import { USER_AVATAR, TERRACED_RICE_IMAGE, MORNING_RICE_IMAGE } from '../data/mockData';

interface TampilanProfilProps {
  userProfile?: UserProfile | null;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
  onLogout?: () => void;
  onGoToLogin?: () => void;
  onGoToRegister?: () => void;
}

const PRESET_AVATARS = [
  { id: 'av1', label: 'Petani Default', url: USER_AVATAR },
  { id: 'av2', label: 'Petani Muda', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { id: 'av3', label: 'Petani Wanita', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
  { id: 'av4', label: 'Pemandangan Lahan 1', url: TERRACED_RICE_IMAGE },
  { id: 'av5', label: 'Pemandangan Lahan 2', url: MORNING_RICE_IMAGE },
  { id: 'av6', label: 'Ikon Komunitas', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80' },
];

export const TampilanProfil: React.FC<TampilanProfilProps> = ({
  userProfile,
  onUpdateProfile,
  onLogout,
  onGoToLogin,
  onGoToRegister,
}) => {
  const [farmerName, setFarmerName] = useState(userProfile?.name || '');
  const [farmLocation, setFarmLocation] = useState(userProfile?.location || '');
  const [whatsapp, setWhatsapp] = useState(userProfile?.phone || '');
  const [currentAvatar, setCurrentAvatar] = useState(userProfile?.avatar || USER_AVATAR);
  const [autoIrrigation, setAutoIrrigation] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('30');
  const [savedMsg, setSavedMsg] = useState(false);

  // Avatar Modal State
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      setFarmerName(userProfile.name);
      if (userProfile.location) setFarmLocation(userProfile.location);
      if (userProfile.phone) setWhatsapp(userProfile.phone);
      if (userProfile.avatar) setCurrentAvatar(userProfile.avatar);
    }
  }, [userProfile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: farmerName,
        location: farmLocation,
        phone: whatsapp,
        avatar: currentAvatar,
      });
    }
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handleSelectAvatar = (url: string) => {
    setCurrentAvatar(url);
    if (onUpdateProfile) {
      onUpdateProfile({ avatar: url });
    }
    setShowAvatarModal(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleSelectAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      handleSelectAvatar(customUrlInput.trim());
      setCustomUrlInput('');
    }
  };

  // If user is not logged in, show login requirement screen
  if (!userProfile) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="font-extrabold text-2xl md:text-3xl text-[#151c27]">Profil Pengguna</h2>
          <p className="text-sm text-[#3f4944] mt-1">
            Masuk ke akun Anda untuk melihat dan mengelola data profil pengelola lahan.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-[#bec9c2]/40 shadow-xs text-center space-y-6">
          <div className="w-20 h-20 bg-[#f0f3ff] rounded-full flex items-center justify-center mx-auto text-[#004532]">
            <Lock className="w-10 h-10 text-[#004532]" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-extrabold text-xl text-[#151c27]">Anda Belum Masuk Akun</h3>
            <p className="text-xs md:text-sm text-[#3f4944] leading-relaxed">
              Informasi profil pengelola, foto, lokasi operasional, dan pengaturan otomatisasi irigasi hanya ditampilkan setelah Anda masuk ke akun Agri Steward.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {onGoToLogin && (
              <button
                type="button"
                onClick={onGoToLogin}
                className="w-full sm:w-auto px-6 py-3 bg-[#004532] text-white font-bold text-xs md:text-sm rounded-xl hover:bg-[#065f46] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-[#a6f2d1]" />
                <span>Masuk ke Akun</span>
              </button>
            )}

            {onGoToRegister && (
              <button
                type="button"
                onClick={onGoToRegister}
                className="w-full sm:w-auto px-6 py-3 bg-[#f0f3ff] text-[#004532] border border-[#bec9c2] font-bold text-xs md:text-sm rounded-xl hover:bg-[#e2e8f8] transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-[#004532]" />
                <span>Daftar Akun Baru</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h2 className="font-extrabold text-2xl md:text-3xl text-[#151c27]">Profil & Pengaturan Sistem</h2>
        <p className="text-sm text-[#3f4944] mt-1">
          Atur informasi pemilik lahan, foto profil, ambang batas otomatisasi, dan preferensi notifikasi.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 bg-[#a6f2d1] border border-[#065f46] text-[#002116] rounded-xl text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle className="w-5 h-5 text-[#004532]" />
          <span>Pengaturan profil dan foto berhasil disimpan!</span>
        </div>
      )}

      {/* User Card */}
      <div className="bg-white p-6 rounded-xl border border-[#bec9c2]/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          {/* Avatar with Overlay Camera Button */}
          <div className="relative group cursor-pointer shrink-0" onClick={() => setShowAvatarModal(true)}>
            <img
              src={currentAvatar}
              alt="Avatar Profil"
              className="w-24 h-24 h-[96px] w-[96px] shrink-0 aspect-square rounded-full object-cover ring-4 ring-[#004532]/20 group-hover:opacity-85 transition-opacity"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-[#004532] text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform"
              title="Ganti Foto Profil"
            >
              <Camera className="w-4 h-4 text-[#a6f2d1]" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h3 className="font-bold text-xl text-[#151c27]">{farmerName}</h3>
              <span className="bg-[#a6f2d1] text-[#00513b] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                {userProfile?.role || 'Petani Terverifikasi'}
              </span>
            </div>
            <p className="text-xs text-[#3f4944]">{userProfile?.email || 'budi@petani.id'}</p>
            <p className="text-xs text-[#3f4944]">{farmLocation}</p>
            <p className="text-[10px] font-mono text-[#6f7973] pt-1">FARMER-ID: {userProfile?.id || 'ID-AGRI-882049'}</p>
            
            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              className="text-xs font-bold text-[#004532] hover:underline flex items-center gap-1 pt-1 justify-center md:justify-start"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Ganti Foto Profil</span>
            </button>
          </div>
        </div>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb4ab] rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar / Logout</span>
          </button>
        )}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Land Config */}
        <div className="bg-white p-6 rounded-xl border border-[#bec9c2]/40 shadow-xs space-y-4">
          <h4 className="font-bold text-base text-[#004532] flex items-center gap-2 border-b border-[#bec9c2]/30 pb-3">
            <User className="w-5 h-5" /> Informasi Pengelola Lahan
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#3f4944] mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#bec9c2] rounded-xl text-sm focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#3f4944] mb-1">
                Lokasi Pusat Operasional
              </label>
              <input
                type="text"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#bec9c2] rounded-xl text-sm focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#3f4944] mb-1">
                Nomor WhatsApp Notifikasi
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 bg-[#f0f3ff] border border-[#bec9c2] rounded-xl text-sm focus:bg-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Automation Thresholds */}
        <div className="bg-white p-6 rounded-xl border border-[#bec9c2]/40 shadow-xs space-y-4">
          <h4 className="font-bold text-base text-[#004532] flex items-center gap-2 border-b border-[#bec9c2]/30 pb-3">
            <Cpu className="w-5 h-5" /> Otomatisasi & LPWAN Gateway
          </h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-[#151c27]">Irigasi Otomatis Berbasis Sensor</p>
                <p className="text-xs text-[#3f4944]">
                  Aktifkan pompa otomatis jika kelembapan tanah turun di bawah 55%.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoIrrigation}
                onChange={(e) => setAutoIrrigation(e.target.checked)}
                className="w-5 h-5 accent-[#004532] rounded cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-[#bec9c2]/30 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-[#151c27]">Interval Streaming Data Sensor</p>
                <p className="text-xs text-[#3f4944]">Frekuensi pengambilan sampel oleh LPWAN Gateway.</p>
              </div>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="px-3 py-1.5 bg-[#f0f3ff] border border-[#bec9c2] rounded-xl text-xs font-bold outline-none"
              >
                <option value="15">Setiap 15 Detik</option>
                <option value="30">Setiap 30 Detik</option>
                <option value="60">Setiap 1 Menit</option>
              </select>
            </div>
          </div>
        </div>

        {/* System & AI Status */}
        <div className="bg-[#f0f3ff] p-6 rounded-xl border border-[#bec9c2]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#004532]" />
            <div>
              <p className="font-bold text-sm text-[#004532]">Server-side AI Advisor Active</p>
              <p className="text-xs text-[#3f4944]">Gemini 2.5 Flash / Pro Server Endpoint Connected</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-[#a6f2d1] text-[#00513b] font-bold text-xs rounded-full">
            Ready
          </span>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#004532] text-white font-bold text-sm rounded-xl hover:bg-[#065f46] transition-colors shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#a6f2d1]" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>

      {/* Avatar Changer Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-[#bec9c2] shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#bec9c2]/30 pb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#004532]" />
                <h3 className="font-bold text-lg text-[#151c27]">Pilih / Unggah Foto Profil</h3>
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="p-1 text-[#3f4944] hover:bg-[#f0f3ff] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload File Section */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-2">
                Unggah dari Perangkat Anda
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 border-2 border-dashed border-[#004532]/40 hover:border-[#004532] bg-[#f0f3ff] rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-[#004532] hover:bg-[#e2e8f8] transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih File Gambar (PNG, JPG, WEBP)</span>
              </button>
            </div>

            {/* Preset Avatars Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-2">
                Pilih dari Koleksi Avatar
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {PRESET_AVATARS.map((av) => {
                  const isSelected = currentAvatar === av.url;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => handleSelectAvatar(av.url)}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all p-0.5 ${
                        isSelected
                          ? 'border-[#004532] ring-2 ring-[#004532]/30 scale-105'
                          : 'border-transparent hover:border-[#bec9c2]'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-full aspect-square object-cover rounded-xl" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#004532]/40 flex items-center justify-center rounded-xl">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom URL Option */}
            <form onSubmit={handleCustomUrlSubmit} className="pt-2 border-t border-[#bec9c2]/30 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944]">
                Atau Gunakan Link URL Gambar
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link className="w-4 h-4 absolute left-3 top-3 text-[#6f7973]" />
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/foto-profil.jpg"
                    className="w-full bg-[#f0f3ff] border border-[#bec9c2] rounded-xl py-2 pl-9 pr-3 text-xs text-[#151c27] focus:bg-white outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#004532] text-white text-xs font-bold rounded-xl hover:bg-[#065f46] transition-colors"
                >
                  Terapkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
