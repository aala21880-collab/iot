import React, { useState } from 'react';
import { SensorNotification } from '../types';
import { Bell, AlertTriangle, CheckCircle2, Info, Check, Trash2 } from 'lucide-react';

interface TampilanNotifikasiProps {
  notifications: SensorNotification[];
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
}

export const TampilanNotifikasi: React.FC<TampilanNotifikasiProps> = ({
  notifications,
  onMarkAllRead,
  onClearNotifications,
}) => {
  const [filterLevel, setFilterLevel] = useState<'all' | 'urgent' | 'warning' | 'info'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filterLevel === 'all') return true;
    return n.level === filterLevel;
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-2xl md:text-3xl text-[#151c27]">Pusat Notifikasi IoT</h2>
          <p className="text-sm text-[#3f4944] mt-1">
            Peringatan otomatis dan laporan aktivitas harian dari lahan padi Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllRead}
            className="px-4 py-2 bg-[#f0f3ff] text-[#004532] border border-[#bec9c2] rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-[#e2e8f8] transition-colors"
          >
            <Check className="w-4 h-4 text-[#004532]" />
            <span>Tandai Semua Dibaca</span>
          </button>
          <button
            onClick={onClearNotifications}
            className="px-3 py-2 bg-white text-[#ba1a1a] border border-[#ffdad6] rounded-lg font-bold text-xs flex items-center gap-1.5 hover:bg-[#ffdad6]/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Bersihkan</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#bec9c2]/40 pb-2">
        <button
          onClick={() => setFilterLevel('all')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            filterLevel === 'all' ? 'bg-[#004532] text-white' : 'bg-white text-[#3f4944] hover:bg-[#f0f3ff]'
          }`}
        >
          Semua ({notifications.length})
        </button>
        <button
          onClick={() => setFilterLevel('urgent')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            filterLevel === 'urgent' ? 'bg-[#ba1a1a] text-white' : 'bg-white text-[#3f4944] hover:bg-[#f0f3ff]'
          }`}
        >
          Urgent ({notifications.filter((n) => n.level === 'urgent').length})
        </button>
        <button
          onClick={() => setFilterLevel('warning')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            filterLevel === 'warning' ? 'bg-[#004532] text-white' : 'bg-white text-[#3f4944] hover:bg-[#f0f3ff]'
          }`}
        >
          Warning ({notifications.filter((n) => n.level === 'warning').length})
        </button>
        <button
          onClick={() => setFilterLevel('info')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            filterLevel === 'info' ? 'bg-[#004532] text-white' : 'bg-white text-[#3f4944] hover:bg-[#f0f3ff]'
          }`}
        >
          Info ({notifications.filter((n) => n.level === 'info').length})
        </button>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-xl border border-[#bec9c2]/40 overflow-hidden shadow-xs divide-y divide-[#bec9c2]/20">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-[#3f4944] space-y-2">
            <Bell className="w-10 h-10 mx-auto text-[#bec9c2]" />
            <p className="font-bold text-base">Tidak ada notifikasi pada kategori ini</p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 transition-colors flex gap-4 items-start ${
                !notif.read ? 'bg-[#f0f3ff]/80 font-semibold' : 'hover:bg-[#f0f3ff]/40'
              }`}
            >
              <div className="mt-0.5">
                {notif.level === 'urgent' ? (
                  <div className="w-8 h-8 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                ) : notif.level === 'warning' ? (
                  <div className="w-8 h-8 rounded-full bg-[#fef3c7] text-[#b45309] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#c6e9c7] text-[#004532] flex items-center justify-center shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-[#151c27]">{notif.title}</h4>
                  <span className="text-[10px] text-[#3f4944] font-mono">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-[#3f4944] leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
