import React from 'react';
import { X, Video, RefreshCw, Radio } from 'lucide-react';
import { MORNING_RICE_IMAGE } from '../../data/mockData';

interface ModalKameraLiveProps {
  isOpen: boolean;
  onClose: () => void;
  camTitle?: string;
}

export const ModalKameraLive: React.FC<ModalKameraLiveProps> = ({
  isOpen,
  onClose,
  camTitle = 'LIVE FEED: CAM-01 (Lahan Subang 01)',
}) => {
  const [refreshing, setRefreshing] = React.useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#151c27] text-white w-full max-w-3xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-[#004532] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-[#a6f2d1]" />
            <h3 className="font-bold text-base">{camTitle}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-red-600/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              <Radio className="w-3 h-3" /> Live
            </span>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
          <img
            src={MORNING_RICE_IMAGE}
            alt="Live Camera Feed"
            className={`w-full h-full object-cover transition-opacity duration-300 ${refreshing ? 'opacity-40' : 'opacity-100'}`}
          />
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-[#8bd6b6] border border-white/10">
            FPS: 30 | 1080p Full HD | Latency: 120ms
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Lokasi Kamera</span>
              <span className="font-semibold text-white">Sektor Utama Subang - Sensor Tower #1</span>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#065f46] hover:bg-[#004532] text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Feed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
