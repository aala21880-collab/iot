import React from 'react';
import { motion } from 'motion/react';
import { ViewType } from '../../types';
import { LayoutDashboard, Sprout, Cpu, Activity, Bell, User, Plus } from 'lucide-react';
import { LogoAgriSteward } from '../LogoAgriSteward';

interface BilahSampingProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  unreadCount: number;
  onOpenAddDevice: () => void;
}

export const BilahSamping: React.FC<BilahSampingProps> = ({
  currentView,
  setCurrentView,
  unreadCount,
  onOpenAddDevice,
}) => {
  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'lahan' as ViewType, label: 'Lahan', icon: Sprout },
    { id: 'perangkat' as ViewType, label: 'Perangkat', icon: Cpu },
    { id: 'monitoring' as ViewType, label: 'Monitoring', icon: Activity },
    { id: 'notifikasi' as ViewType, label: 'Notifikasi', icon: Bell, badge: unreadCount },
    { id: 'profil' as ViewType, label: 'Profil', icon: User },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen flex flex-col p-4 border-r border-[#bec9c2] bg-[#f0f3ff] w-64 z-40 hidden md:flex">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 px-2 cursor-pointer group" onClick={() => setCurrentView('landing')}>
        <LogoAgriSteward className="w-10 h-10 shrink-0 drop-shadow-xs group-hover:scale-105 transition-transform" />
        <div>
          <h1 className="font-extrabold text-lg text-[#004532] leading-none tracking-tight">AGRI STEWARD</h1>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#3f4944] mt-1">
            Pengelola Pertanian
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 flex flex-col gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left relative overflow-hidden group ${
                isActive
                  ? 'text-[#00513b] font-bold'
                  : 'text-[#3f4944] hover:bg-[#e2e8f8]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicator"
                  className="absolute inset-0 bg-[#c6e9c7] rounded-xl shadow-xs"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 z-10 transition-colors ${isActive ? 'text-[#004532]' : 'text-[#3f4944]'}`} />
              <span className="z-10">{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="ml-auto bg-[#ba1a1a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Add New Device Action */}
      <div className="mt-auto p-1">
        <button
          onClick={onOpenAddDevice}
          className="w-full py-3 bg-[#004532] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98] shadow-xs"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Perangkat</span>
        </button>
      </div>
    </aside>
  );
};


