import React from 'react';
import { motion } from 'motion/react';
import { ViewType } from '../../types';
import { LayoutDashboard, Sprout, Activity, Plus, Cpu } from 'lucide-react';

interface NavigasiSelulerProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  onOpenAddDevice: () => void;
}

export const NavigasiSeluler: React.FC<NavigasiSelulerProps> = ({
  currentView,
  setCurrentView,
  onOpenAddDevice,
}) => {
  const items = [
    { id: 'dashboard' as ViewType, label: 'Dash', icon: LayoutDashboard },
    { id: 'lahan' as ViewType, label: 'Lahan', icon: Sprout },
    { id: 'perangkat' as ViewType, label: 'IoT', icon: Cpu },
    { id: 'monitoring' as ViewType, label: 'Monitor', icon: Activity },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#f9f9ff] border-t border-[#bec9c2]/50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex items-center justify-around md:hidden z-50 px-2">
      {items.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`relative flex flex-col items-center gap-0.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
              isActive ? 'text-[#004532]' : 'text-[#3f4944]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="mobileNavActiveIndicator"
                className="absolute inset-0 bg-[#c6e9c7]/60 rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <Icon className="w-5 h-5 z-10" />
            <span className="text-[10px] z-10">{item.label}</span>
          </button>
        );
      })}

      {/* Floating Plus Action */}
      <div className="relative -top-4">
        <button
          onClick={onOpenAddDevice}
          className="w-12 h-12 bg-[#004532] text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {items.slice(2).map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`relative flex flex-col items-center gap-0.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
              isActive ? 'text-[#004532]' : 'text-[#3f4944]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="mobileNavActiveIndicator"
                className="absolute inset-0 bg-[#c6e9c7]/60 rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <Icon className="w-5 h-5 z-10" />
            <span className="text-[10px] z-10">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
