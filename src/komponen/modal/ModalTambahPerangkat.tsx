import React, { useState } from 'react';
import { IoTDevice } from '../../types';
import { X, Cpu, CheckCircle } from 'lucide-react';

interface ModalTambahPerangkatProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDevice: (device: IoTDevice) => void;
  landOptions: string[];
}

export const ModalTambahPerangkat: React.FC<ModalTambahPerangkatProps> = ({
  isOpen,
  onClose,
  onAddDevice,
  landOptions,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<IoTDevice['type']>('Sensor Soil Probe');
  const [landSector, setLandSector] = useState(landOptions[0] || 'Lahan Utara');
  const [status, setStatus] = useState<IoTDevice['status']>('Online');
  const [batteryPercent, setBatteryPercent] = useState(100);
  const [firmware, setFirmware] = useState('v2.4.2');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newDevice: IoTDevice = {
      id: `dev-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      type,
      landSector,
      status,
      batteryPercent: Number(batteryPercent),
      lastPing: 'Baru saja',
      firmware,
    };

    onAddDevice(newDevice);
    setSuccessMsg('Perangkat berhasil ditambahkan!');
    setTimeout(() => {
      setSuccessMsg('');
      setName('');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#f9f9ff] w-full max-w-md rounded-2xl border border-[#bec9c2] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-[#004532] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#a6f2d1]" />
            <h3 className="font-bold text-lg">Tambah Perangkat IoT</h3>
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
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                Nama Perangkat / Node ID
              </label>
              <input
                type="text"
                required
                placeholder="mis. Node Sensor - Lahan Barat"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                  Tipe Perangkat
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as IoTDevice['type'])}
                  className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
                >
                  <option value="Sensor Soil Probe">Sensor Soil Probe</option>
                  <option value="Hydro Scan Gateway">Hydro Scan Gateway</option>
                  <option value="Weather Station">Weather Station</option>
                  <option value="Cam Feed">Cam Feed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as IoTDevice['status'])}
                  className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Battery Low">Battery Low</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                  Sektor Lahan
                </label>
                <select
                  value={landSector}
                  onChange={(e) => setLandSector(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
                >
                  {landOptions.map((land) => (
                    <option key={land} value={land}>
                      {land}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3f4944] mb-1">
                  Baterai (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={batteryPercent}
                  onChange={(e) => setBatteryPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#bec9c2] rounded-xl text-sm focus:ring-2 focus:ring-[#004532] outline-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-[#bec9c2]/40">
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
                Simpan Perangkat
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
