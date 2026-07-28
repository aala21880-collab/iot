import React, { useState, useEffect } from 'react';
import { IoTDevice } from '../../types';
import { X, Edit3, CheckCircle, Trash2 } from 'lucide-react';

interface ModalEditPerangkatProps {
  device: IoTDevice | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateDevice: (id: string, updates: Partial<IoTDevice>) => void;
  onDeleteDevice: (id: string) => void;
  landOptions: string[];
}

export const ModalEditPerangkat: React.FC<ModalEditPerangkatProps> = ({
  device,
  isOpen,
  onClose,
  onUpdateDevice,
  onDeleteDevice,
  landOptions,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<IoTDevice['type']>('Sensor Soil Probe');
  const [landSector, setLandSector] = useState('Lahan Utara');
  const [status, setStatus] = useState<IoTDevice['status']>('Online');
  const [batteryPercent, setBatteryPercent] = useState(100);
  const [firmware, setFirmware] = useState('v2.4.2');
  const [successMsg, setSuccessMsg] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (device) {
      setName(device.name);
      setType(device.type);
      setLandSector(device.landSector);
      setStatus(device.status);
      setBatteryPercent(device.batteryPercent);
      setFirmware(device.firmware);
      setShowConfirmDelete(false);
      setSuccessMsg('');
    }
  }, [device]);

  if (!isOpen || !device) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdateDevice(device.id, {
      name: name.trim(),
      type,
      landSector,
      status,
      batteryPercent: Number(batteryPercent),
      firmware,
    });

    setSuccessMsg('Perangkat berhasil diperbarui!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1000);
  };

  const handleDelete = () => {
    onDeleteDevice(device.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#f9f9ff] w-full max-w-md rounded-2xl border border-[#bec9c2] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-[#004532] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#a6f2d1]" />
            <h3 className="font-bold text-lg">Edit Perangkat IoT</h3>
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
        ) : showConfirmDelete ? (
          <div className="p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#93000a] flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg text-[#151c27]">Hapus Perangkat "{device.name}"?</h4>
            <p className="text-xs text-[#3f4944]">
              Data perangkat IoT ini akan dihapus dari sistem. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 border border-[#bec9c2] rounded-xl text-xs font-bold text-[#3f4944] hover:bg-[#e2e8f8]"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-[#ba1a1a] text-white rounded-xl text-xs font-bold hover:bg-[#93000a] transition-colors"
              >
                Ya, Hapus Perangkat
              </button>
            </div>
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

            <div className="pt-3 flex justify-between items-center border-t border-[#bec9c2]/40">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="px-3 py-2 text-[#ba1a1a] hover:bg-[#ffdad6]/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus</span>
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
