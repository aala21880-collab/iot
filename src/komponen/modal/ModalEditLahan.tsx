import React, { useState, useEffect } from 'react';
import { Land } from '../../types';
import { X, Edit, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

interface ModalEditLahanProps {
  land: Land | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLand: (id: string, updates: Partial<Land>) => void;
  onDeleteLand: (id: string) => void;
}

export const ModalEditLahan: React.FC<ModalEditLahanProps> = ({
  land,
  isOpen,
  onClose,
  onUpdateLand,
  onDeleteLand,
}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [areaHa, setAreaHa] = useState(0);
  const [soilType, setSoilType] = useState('');
  const [status, setStatus] = useState<Land['status']>('Sangat Subur');
  const [moisturePercent, setMoisturePercent] = useState(0);
  const [phLevel, setPhLevel] = useState(0);
  const [temperatureC, setTemperatureC] = useState(0);

  const [isDeleting, setIsDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (land) {
      setName(land.name);
      setLocation(land.location);
      setAreaHa(land.areaHa);
      setSoilType(land.soilType);
      setStatus(land.status);
      setMoisturePercent(land.moisturePercent);
      setPhLevel(land.phLevel);
      setTemperatureC(land.temperatureC);
      setIsDeleting(false);
      setSuccessMsg('');
    }
  }, [land]);

  if (!isOpen || !land) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLand(land.id, {
      name,
      location,
      areaHa: Number(areaHa),
      soilType,
      status,
      moisturePercent: Number(moisturePercent),
      phLevel: Number(phLevel),
      temperatureC: Number(temperatureC),
    });

    setSuccessMsg('Lahan berhasil diperbarui!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleDelete = () => {
    onDeleteLand(land.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#f9f9ff] w-full max-w-lg rounded-2xl border border-[#bec9c2] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-[#004532] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#a6f2d1]" />
            <h3 className="font-bold text-lg">Edit Data Lahan</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-14 h-14 text-[#065f46] mx-auto animate-bounce" />
            <h4 className="font-bold text-xl text-[#004532]">{successMsg}</h4>
          </div>
        ) : isDeleting ? (
          <div className="p-6 space-y-4 text-center">
            <AlertTriangle className="w-12 h-12 text-[#ba1a1a] mx-auto" />
            <h4 className="font-bold text-lg text-[#151c27]">Konfirmasi Hapus Lahan</h4>
            <p className="text-xs text-[#3f4944]">
              Data lahan <span className="font-bold">{land.name}</span> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 border border-[#bec9c2] text-[#3f4944] font-semibold text-xs rounded-xl hover:bg-[#e2e8f8]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2 bg-[#ba1a1a] text-white font-bold text-xs rounded-xl hover:bg-[#93000a] transition-colors"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                Nama Lahan
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                Lokasi
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                  Luas (Ha)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={areaHa}
                  onChange={(e) => setAreaHa(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                  Jenis Tanah
                </label>
                <input
                  type="text"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                  Status Lahan
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Land['status'])}
                  className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
                >
                  <option value="Sangat Subur">Sangat Subur</option>
                  <option value="Perlu Irigasi">Perlu Irigasi</option>
                  <option value="Perlu Pemupukan">Perlu Pemupukan</option>
                  <option value="Kritikal">Kritikal</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-[#bec9c2]/40 pt-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                  Kelembapan (%)
                </label>
                <input
                  type="number"
                  value={moisturePercent}
                  onChange={(e) => setMoisturePercent(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                  pH Tanah
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={phLevel}
                  onChange={(e) => setPhLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                  Suhu (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-[#bec9c2]/40">
              <button
                type="button"
                onClick={() => setIsDeleting(true)}
                className="px-3 py-2 bg-[#ffdad6] text-[#93000a] font-bold text-xs rounded-xl hover:bg-[#ffb4ab] transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Lahan</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#bec9c2] text-[#3f4944] font-semibold text-xs rounded-xl hover:bg-[#e2e8f8]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#004532] text-white font-bold text-xs rounded-xl hover:bg-[#065f46] transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
