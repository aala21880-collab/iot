import React, { useState } from 'react';
import { Land } from '../../types';
import { X, Sprout, CheckCircle } from 'lucide-react';
import { TERRACED_RICE_IMAGE } from '../../data/mockData';

interface ModalTambahLahanProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLand: (land: Land) => void;
}

export const ModalTambahLahan: React.FC<ModalTambahLahanProps> = ({ isOpen, onClose, onAddLand }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Kecamatan Subang, Jawa Barat');
  const [areaHa, setAreaHa] = useState(3.0);
  const [soilType, setSoilType] = useState('Tanah Aluvial');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newLand: Land = {
      id: `land-${Date.now()}`,
      name: name.trim(),
      location,
      areaHa: Number(areaHa),
      soilType,
      status: 'Sangat Subur',
      activeSensors: 2,
      imageUrl: TERRACED_RICE_IMAGE,
      moisturePercent: 70,
      phLevel: 6.5,
      temperatureC: 27.0,
      nitrogenMgKg: 130,
      phosphorusMgKg: 40,
      potassiumMgKg: 170,
    };

    onAddLand(newLand);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setName('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#f9f9ff] w-full max-w-md rounded-2xl border border-[#bec9c2] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-[#004532] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-[#a6f2d1]" />
            <h3 className="font-bold text-lg">Tambah Lahan Baru</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-14 h-14 text-[#065f46] mx-auto animate-bounce" />
            <h4 className="font-bold text-xl text-[#004532]">Lahan Berhasil Didaftarkan!</h4>
            <p className="text-sm text-[#3f4944]">Lahan baru kini siap dipasangi sensor IoT AGRI STEWARD.</p>
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
                placeholder="Contoh: Lahan Timur - Blok 02"
                className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                Lokasi / Kecamatan
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                  Luas (Hektar)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={areaHa}
                  onChange={(e) => setAreaHa(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                  Tipe Tanah
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
                >
                  <option value="Lempung Aluvial">Lempung Aluvial</option>
                  <option value="Tanah Grumosol">Tanah Grumosol</option>
                  <option value="Tanah Latosol">Tanah Latosol</option>
                  <option value="Organosol/Gambut">Organosol/Gambut</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#bec9c2] text-[#3f4944] font-semibold text-sm rounded-xl hover:bg-[#e2e8f8]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#004532] text-white font-bold text-sm rounded-xl hover:bg-[#065f46] transition-colors"
              >
                Daftarkan Lahan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
