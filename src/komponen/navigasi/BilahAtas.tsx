import React from 'react';
import { ViewType, UserProfile } from '../../types';
import { Search, Bell, Settings, Globe, LogOut, Database, History } from 'lucide-react';
import { USER_AVATAR } from '../../data/mockData';

interface BilahAtasProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDbConnected?: boolean;
  userProfile?: UserProfile | null;
  onLogout?: () => void;
  onOpenDbModal?: () => void;
  onOpenActivityModal?: () => void;
}

export const BilahAtas: React.FC<BilahAtasProps> = ({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  isDbConnected = true,
  userProfile,
  onLogout,
  onOpenDbModal,
  onOpenActivityModal,
}) => {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-4 md:px-8 w-full h-16 bg-[#f9f9ff] border-b border-[#bec9c2]/40 shadow-xs">
      {/* Search Input Bar */}
      <div className="relative w-48 sm:w-72 md:w-96">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4944]" />
        <input
          type="text"
          placeholder="Cari lahan, perangkat, sensor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#f0f3ff] text-xs md:text-sm pl-9 pr-4 py-2 rounded-full border border-transparent focus:border-[#004532] focus:bg-white focus:outline-none transition-all placeholder:text-[#3f4944]/70"
        />
      </div>

      <div className="flex items-center gap-2.5">
        {/* Landing Page Toggle Button */}
        <button
          onClick={() => setCurrentView('landing')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f3ff] hover:bg-[#e2e8f8] text-[#004532] rounded-lg text-xs font-semibold transition-colors"
          title="Lihat Halaman Depan / Landing Page"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Beranda Utama</span>
        </button>

        {/* Notifications Button */}
        <button
          onClick={() => setCurrentView('notifikasi')}
          className="p-2 text-[#3f4944] hover:bg-[#f0f3ff] rounded-full transition-colors relative"
          title="Notifikasi Sistem"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
        </button>

        {/* Profile Settings Button */}
        <button
          onClick={() => setCurrentView('profil')}
          className="p-2 text-[#3f4944] hover:bg-[#f0f3ff] rounded-full transition-colors"
          title="Pengaturan Profil"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Profile Avatar & Logout */}
        {userProfile ? (
          <div className="flex items-center gap-2 ml-1 pl-3 border-l border-[#bec9c2]/50">
            <div
              onClick={() => setCurrentView('profil')}
              className="flex items-center gap-2 cursor-pointer hover:bg-[#f0f3ff] p-1 rounded-full transition-colors shrink-0"
            >
              <img
                src={userProfile.avatar || USER_AVATAR}
                alt={userProfile.name}
                className="w-8 h-8 shrink-0 aspect-square rounded-full object-cover ring-2 ring-[#004532]/20"
              />
              <div className="hidden lg:block text-left">
                <p className="font-semibold text-xs text-[#151c27] truncate max-w-[120px]">{userProfile.name}</p>
                <p className="text-[10px] text-[#3f4944]">{userProfile.role || 'Petani Digital'}</p>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Logout / Keluar"
                className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6]/60 rounded-lg transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 ml-1 pl-3 border-l border-[#bec9c2]/50">
            <button
              onClick={() => setCurrentView('login')}
              className="px-3 py-1.5 text-xs font-bold text-[#004532] hover:bg-[#f0f3ff] rounded-lg transition-colors"
            >
              Masuk
            </button>
            <button
              onClick={() => setCurrentView('register')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#004532] hover:bg-[#065f46] rounded-lg transition-colors shadow-xs"
            >
              Daftar
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
