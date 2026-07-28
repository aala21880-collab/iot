import React, { useState } from 'react';
import { Land } from '../../types';
import { X, Thermometer, Droplets, Activity, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ModalDetailLahanProps {
  land: Land | null;
  onClose: () => void;
  onTriggerIrrigation: (landId: string) => void;
}

export const ModalDetailLahan: React.FC<ModalDetailLahanProps> = ({
  land,
  onClose,
  onTriggerIrrigation,
}) => {
  const [irrigating, setIrrigating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!land) return null;

  const handleStartIrrigation = () => {
    setIrrigating(true);
    setTimeout(() => {
      onTriggerIrrigation(land.id);
      setIrrigating(false);
      setSuccessMsg('Pompa irigasi otomatis diaktifkan!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1000);
  };

  const getStatusBadgeClass = (status: Land['status']) => {
    switch (status) {
      case 'Sangat Subur':
        return 'bg-[#065f46] text-[#8bd6b7]';
      case 'Optimal':
        return 'bg-[#c6e9c7] text-[#4b6a4f]';
      case 'Sedang':
        return 'bg-[#c8ebca] text-[#03210c]';
      case 'Butuh Perhatian':
        return 'bg-[#ffdad6] text-[#93000a]';
      default:
        return 'bg-[#e2e8f8] text-[#151c27]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#f9f9ff] w-full max-w-2xl rounded-2xl border border-[#bec9c2] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header Banner */}
        <div className="relative h-48 bg-slate-800 overflow-hidden">
          <img src={land.imageUrl} alt={land.name} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 text-white hover:bg-black/70 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadgeClass(land.status)}`}>
                {land.status}
              </span>
              <h2 className="font-bold text-2xl text-white mt-1">{land.name}</h2>
              <p className="text-xs text-slate-300">{land.location}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-300 block">Sensor Aktif</span>
              <span className="text-xl font-bold text-[#a6f2d1]">{land.activeSensors} Node</span>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-6">
          {successMsg && (
            <div className="p-3 bg-[#a6f2d1] border border-[#065f46] text-[#002116] rounded-xl text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#004532]" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Realtime Metric Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#bec9c2]/50 shadow-xs">
              <div className="flex items-center gap-2 text-[#3f4944] text-xs font-semibold mb-1">
                <Droplets className="w-4 h-4 text-[#004532]" />
                <span>KELEMBAPAN TANAH</span>
              </div>
              <p className="text-2xl font-bold text-[#004532]">{land.moisturePercent}%</p>
              <span className="text-[10px] text-[#3f4944]">Target: 65% - 80%</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#bec9c2]/50 shadow-xs">
              <div className="flex items-center gap-2 text-[#3f4944] text-xs font-semibold mb-1">
                <Activity className="w-4 h-4 text-[#47664b]" />
                <span>TINGKAT pH</span>
              </div>
              <p className={`text-2xl font-bold ${land.phLevel < 5.5 ? 'text-[#ba1a1a]' : 'text-[#004532]'}`}>
                {land.phLevel} pH
              </p>
              <span className="text-[10px] text-[#3f4944]">Netral (6.0 - 7.0)</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#bec9c2]/50 shadow-xs">
              <div className="flex items-center gap-2 text-[#3f4944] text-xs font-semibold mb-1">
                <Thermometer className="w-4 h-4 text-[#ba1a1a]" />
                <span>SUHU LINGKUNGAN</span>
              </div>
              <p className="text-2xl font-bold text-[#151c27]">{land.temperatureC}°C</p>
              <span className="text-[10px] text-[#3f4944]">Suhu Rata-rata</span>
            </div>
          </div>

          {/* NPK Fertilizer Levels */}
          <div className="bg-white p-5 rounded-xl border border-[#bec9c2]/50 space-y-3">
            <h4 className="font-bold text-sm text-[#151c27] flex items-center justify-between">
              <span>Rasio Nutrisi NPK (mg/kg)</span>
              <span className="text-xs text-[#3f4944] font-normal">Kondisi Terakhir Sensor</span>
            </h4>
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-[#f0f3ff] rounded-xl text-center">
                <span className="text-[10px] font-bold text-[#3f4944] block">NITROGEN (N)</span>
                <span className="text-lg font-bold text-[#004532]">{land.nitrogenMgKg} mg/kg</span>
              </div>
              <div className="p-3 bg-[#f0f3ff] rounded-xl text-center">
                <span className="text-[10px] font-bold text-[#3f4944] block">FOSFOR (P)</span>
                <span className="text-lg font-bold text-[#004532]">{land.phosphorusMgKg} mg/kg</span>
              </div>
              <div className="p-3 bg-[#f0f3ff] rounded-xl text-center">
                <span className="text-[10px] font-bold text-[#3f4944] block">KALIUM (K)</span>
                <span className="text-lg font-bold text-[#004532]">{land.potassiumMgKg} mg/kg</span>
              </div>
            </div>
          </div>

          {/* Action Trigger Box */}
          <div className="bg-[#f0f3ff] p-5 rounded-xl border border-[#bec9c2]/40 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-[#004532]">Kontrol Otomatisasi Irigasi</h4>
              <p className="text-xs text-[#3f4944] mt-0.5">
                Siram lahan secara otomatis berdasarkan sensor kelembapan tanah.
              </p>
            </div>
            <button
              onClick={handleStartIrrigation}
              disabled={irrigating}
              className="px-5 py-2.5 bg-[#004532] hover:bg-[#065f46] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-[#a6f2d1]" />
              <span>{irrigating ? 'Memproses...' : 'Siram Lahan Sekarang'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
