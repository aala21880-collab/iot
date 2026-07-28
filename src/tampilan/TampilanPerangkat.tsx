import React, { useState } from 'react';
import { IoTDevice } from '../types';
import { Cpu, Battery, Radio, Plus, RefreshCw, Edit3, Trash2 } from 'lucide-react';

interface TampilanPerangkatProps {
  devices: IoTDevice[];
  onOpenAddDevice: () => void;
  onEditDevice?: (device: IoTDevice) => void;
  onDeleteDevice?: (id: string) => void;
}

export const TampilanPerangkat: React.FC<TampilanPerangkatProps> = ({
  devices,
  onOpenAddDevice,
  onEditDevice,
  onDeleteDevice,
}) => {
  const [pingingId, setPingingId] = useState<string | null>(null);
  const [pingResult, setPingResult] = useState<{ id: string; ms: number } | null>(null);
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');

  const handlePing = (id: string) => {
    setPingingId(id);
    setPingResult(null);
    setTimeout(() => {
      const randomLatency = Math.floor(Math.random() * 80) + 18;
      setPingResult({ id, ms: randomLatency });
      setPingingId(null);
    }, 800);
  };

  const filteredDevices = devices.filter((dev) => {
    if (filter === 'online') return dev.status === 'Online';
    if (filter === 'offline') return dev.status === 'Offline' || dev.status === 'Battery Low';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-2xl md:text-3xl text-[#151c27]">Manajemen Perangkat IoT</h2>
          <p className="text-sm text-[#3f4944] mt-1">
            Status konektivitas, baterai, dan firmware sensor AGRI STEWARD.
          </p>
        </div>

        <button
          onClick={onOpenAddDevice}
          className="px-5 py-2.5 bg-[#004532] text-white rounded-lg font-bold flex items-center gap-2 hover:bg-[#065f46] transition-colors shadow-xs"
        >
          <Plus className="w-5 h-5 text-[#a6f2d1]" />
          <span>Tambah Node Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#bec9c2]/40 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            filter === 'all' ? 'bg-[#004532] text-white' : 'bg-white text-[#3f4944] hover:bg-[#f0f3ff]'
          }`}
        >
          Semua ({devices.length})
        </button>
        <button
          onClick={() => setFilter('online')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            filter === 'online' ? 'bg-[#004532] text-white' : 'bg-white text-[#3f4944] hover:bg-[#f0f3ff]'
          }`}
        >
          Online ({devices.filter((d) => d.status === 'Online').length})
        </button>
        <button
          onClick={() => setFilter('offline')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            filter === 'offline' ? 'bg-[#004532] text-white' : 'bg-white text-[#3f4944] hover:bg-[#f0f3ff]'
          }`}
        >
          Offline / Warning ({devices.filter((d) => d.status !== 'Online').length})
        </button>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device) => (
          <div
            key={device.id}
            className="bg-white rounded-xl border border-[#bec9c2]/40 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all space-y-4"
          >
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f0f3ff] flex items-center justify-center text-[#004532]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#151c27]">{device.name}</h3>
                    <p className="text-xs text-[#3f4944] font-medium">{device.type}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    device.status === 'Online'
                      ? 'bg-[#c6e9c7] text-[#00513b]'
                      : device.status === 'Battery Low'
                      ? 'bg-[#ffdad6] text-[#ba1a1a]'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {device.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-[#f0f3ff] p-3 rounded-xl mt-4">
                <div>
                  <span className="text-[10px] text-[#3f4944] block font-semibold uppercase">Sektor Lahan</span>
                  <span className="font-bold text-[#151c27]">{device.landSector}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#3f4944] block font-semibold uppercase">Baterai Node</span>
                  <span className="font-bold text-[#004532] flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5" />
                    {device.batteryPercent}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-[#3f4944] pt-3">
                <span>Firmware: {device.firmware}</span>
                <span>Ping: {device.lastPing}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#bec9c2]/30 flex justify-between items-center gap-2">
              <button
                onClick={() => handlePing(device.id)}
                disabled={pingingId === device.id}
                className="flex-1 py-1.5 bg-[#f0f3ff] hover:bg-[#e2e8f8] text-[#004532] rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${pingingId === device.id ? 'animate-spin' : ''}`} />
                <span>
                  {pingingId === device.id
                    ? 'Ping...'
                    : pingResult?.id === device.id
                    ? `${pingResult.ms}ms (OK)`
                    : 'Tes Ping LPWAN'}
                </span>
              </button>

              {onEditDevice && (
                <button
                  onClick={() => onEditDevice(device)}
                  className="p-2 text-[#3f4944] hover:bg-[#e2e8f8] rounded-lg transition-colors"
                  title="Edit Perangkat"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {onDeleteDevice && (
                <button
                  onClick={() => onDeleteDevice(device.id)}
                  className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors"
                  title="Hapus Perangkat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
