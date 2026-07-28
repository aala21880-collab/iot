import React, { useState } from 'react';
import { Land, ActivityLog } from '../types';
import {
  MapPin,
  Filter,
  Edit2,
  Trash2,
  Trees,
  Search,
  ArrowUpDown,
  Droplets,
  Thermometer,
  FlaskConical,
  Sprout,
  Plus
} from 'lucide-react';
import { MORNING_RICE_IMAGE } from '../data/mockData';

interface TampilanLahanProps {
  lands: Land[];
  activityLogs: ActivityLog[];
  onOpenAddLand: () => void;
  onSelectLand: (land: Land) => void;
  onEditLand?: (land: Land) => void;
  onDeleteLand?: (id: string) => void;
  searchQuery: string;
}

export const TampilanLahan: React.FC<TampilanLahanProps> = ({
  lands,
  activityLogs,
  onOpenAddLand,
  onSelectLand,
  onEditLand,
  onDeleteLand,
  searchQuery,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'area' | 'status'>('name');
  const [localSearch, setLocalSearch] = useState<string>('');

  const activeSearch = searchQuery || localSearch;

  const safeLands = Array.isArray(lands) ? lands : [];

  const filteredLands = safeLands
    .filter((land) => {
      const name = String(land?.name || '').toLowerCase();
      const location = String(land?.location || '').toLowerCase();
      const soilType = String(land?.soilType || '').toLowerCase();
      const matchesSearch =
        name.includes(activeSearch.toLowerCase()) ||
        location.includes(activeSearch.toLowerCase()) ||
        soilType.includes(activeSearch.toLowerCase());

      if (filterType === 'all') return matchesSearch;
      if (filterType === 'subur') return matchesSearch && (land.status === 'Sangat Subur' || land.status === 'Optimal');
      if (filterType === 'perhatian') return matchesSearch && land.status === 'Butuh Perhatian';
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'area') return Number(b.areaHa || 0) - Number(a.areaHa || 0);
      if (sortBy === 'status') return String(a.status || '').localeCompare(String(b.status || ''));
      return String(a.name || '').localeCompare(String(b.name || ''));
    });

  const totalArea = safeLands.reduce((acc, curr) => acc + Number(curr.areaHa || 0), 0).toFixed(1);
  const featuredLand = safeLands[0];

  const getStatusBadgeClass = (status: Land['status']) => {
    switch (status) {
      case 'Sangat Subur':
        return 'bg-[#a6f2d1] text-[#00513b] font-bold';
      case 'Optimal':
        return 'bg-[#c6e9c7] text-[#00513b] font-bold';
      case 'Sedang':
        return 'bg-[#dce2f3] text-[#151c27] font-bold';
      case 'Butuh Perhatian':
        return 'bg-[#ffdad6] text-[#ba1a1a] font-bold';
      default:
        return 'bg-[#e2e8f8] text-[#151c27] font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-2xl md:text-3xl text-[#151c27] tracking-tight">
            Manajemen Lahan
          </h2>
          <p className="text-sm text-[#3f4944] mt-1">
            Kelola sektor pertanian, pantau kondisi tanah, dan sensor irigasi secara real-time.
          </p>
        </div>
        <div>
          <button
            onClick={onOpenAddLand}
            className="px-5 py-2.5 bg-[#004532] text-white rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-[#065f46] transition-all shadow-sm active:scale-95"
          >
            <MapPin className="w-4 h-4 text-[#a6f2d1]" />
            <span>Tambah Lahan</span>
          </button>
        </div>
      </div>

      {/* Featured Status Banner */}
      {featuredLand && (
        <div className="relative rounded-2xl overflow-hidden border border-[#bec9c2]/40 shadow-md bg-slate-900 group">
          <img
            src={featuredLand.imageUrl || MORNING_RICE_IMAGE}
            alt="Status Terakhir Lahan"
            className="w-full h-48 md:h-56 object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
          />
          {/* Clear, balanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#002d20]/95 via-[#003525]/40 to-black/20 p-5 md:p-6 flex flex-col justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a6f2d1] bg-[#003525]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#10b981]/40 shadow-sm">
                STATUS TERAKHIR LAHAN
              </span>
              <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm ${getStatusBadgeClass(featuredLand.status)}`}>
                {featuredLand.status}
              </span>
            </div>

            <div className="space-y-2 z-10">
              <h3 className="font-extrabold text-xl md:text-2xl text-white drop-shadow-md">
                {featuredLand.name}: {featuredLand.status}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-white font-semibold">
                <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 text-[#a6f2d1]">
                  <Droplets className="w-3.5 h-3.5 text-[#34d399]" /> Kelembaban {featuredLand.moisturePercent}%
                </span>
                <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 text-[#a6f2d1]">
                  <FlaskConical className="w-3.5 h-3.5 text-[#34d399]" /> pH {featuredLand.phLevel}
                </span>
                <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 text-[#a6f2d1]">
                  <Thermometer className="w-3.5 h-3.5 text-[#34d399]" /> {featuredLand.temperatureC}°C
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Bento & Filter Toolbar */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Total Area Box */}
        <div className="md:col-span-4 bg-[#f0f3ff] p-5 rounded-2xl border border-[#bec9c2]/50 shadow-xs flex justify-between items-center">
          <div>
            <p className="text-[10px] font-extrabold text-[#3f4944] uppercase tracking-wider mb-1">
              TOTAL LUAS LAHAN
            </p>
            <div className="flex items-baseline gap-1.5">
              <h3 className="font-extrabold text-3xl text-[#004532]">{totalArea}</h3>
              <span className="text-xs font-bold text-[#3f4944]">Hektar</span>
            </div>
            <p className="text-[11px] text-[#3f4944] mt-2 flex items-center gap-1 font-medium">
              <Trees className="w-3.5 h-3.5 text-[#004532]" />
              <span>Tersebar di {lands.length} Wilayah Sawah</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#004532] text-[#a6f2d1] flex items-center justify-center font-bold">
            <Sprout className="w-6 h-6" />
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="md:col-span-8 bg-white p-4 rounded-2xl border border-[#bec9c2]/30 shadow-xs flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4944]" />
            <input
              type="text"
              placeholder="Cari lahan atau lokasi..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-[#f0f3ff] text-xs pl-9 pr-3 py-2 rounded-xl border border-transparent focus:border-[#004532] focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Filter Status Buttons */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#3f4944]" />
            <div className="flex gap-1 bg-[#f0f3ff] p-1 rounded-xl">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterType === 'all'
                    ? 'bg-[#004532] text-white shadow-xs'
                    : 'text-[#3f4944] hover:text-[#004532]'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterType('subur')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterType === 'subur'
                    ? 'bg-[#004532] text-white shadow-xs'
                    : 'text-[#3f4944] hover:text-[#004532]'
                }`}
              >
                Subur
              </button>
              <button
                onClick={() => setFilterType('perhatian')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterType === 'perhatian'
                    ? 'bg-[#ba1a1a] text-white shadow-xs'
                    : 'text-[#3f4944] hover:text-[#ba1a1a]'
                }`}
              >
                Perhatian
              </button>
            </div>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-[#f0f3ff] px-3 py-1.5 rounded-xl border border-[#bec9c2]/40 text-xs font-bold text-[#3f4944]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#004532]" />
            <span>Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-[#004532] outline-none cursor-pointer"
            >
              <option value="name">Nama Lahan</option>
              <option value="area">Luas Lahan</option>
              <option value="status">Status Tanah</option>
            </select>
          </div>
        </div>
      </section>

      {/* Land Grid */}
      {filteredLands.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#bec9c2] bg-white p-8 text-center text-[#3f4944] shadow-xs">
          <p className="font-semibold text-lg text-[#151c27]">Belum ada lahan yang dapat ditampilkan</p>
          <p className="text-sm mt-2">Tambahkan lahan baru atau periksa filter pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLands.map((land) => (
            <div
              key={land.id}
              className="bg-white rounded-2xl border border-[#bec9c2]/40 shadow-xs overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between"
            >
            <div>
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={land.imageUrl}
                  alt={land.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] tracking-wider uppercase ${getStatusBadgeClass(land.status)}`}>
                    {land.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a6f2d1] animate-pulse" />
                  <span>3 Sensor Aktif</span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h4 className="font-extrabold text-lg text-[#151c27]">{land.name}</h4>
                  <p className="text-xs text-[#3f4944] flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#004532]" />
                    <span>{land.location}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#f0f3ff] p-3 rounded-xl border border-[#bec9c2]/20">
                  <div>
                    <span className="text-[10px] text-[#3f4944] block font-extrabold uppercase tracking-wider">AREA</span>
                    <span className="font-extrabold text-sm text-[#004532]">{land.areaHa} Ha</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#3f4944] block font-extrabold uppercase tracking-wider">TIPE TANAH</span>
                    <span className="font-bold text-xs text-[#151c27] truncate block">{land.soilType}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-[#3f4944] block uppercase font-bold">Kelembaban</span>
                    <span className="text-xs font-extrabold text-[#004532]">{land.moisturePercent}%</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-[#3f4944] block uppercase font-bold">pH Tanah</span>
                    <span className="text-xs font-extrabold text-[#151c27]">{land.phLevel}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-[#3f4944] block uppercase font-bold">Suhu</span>
                    <span className="text-xs font-extrabold text-[#151c27]">{land.temperatureC}°C</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#bec9c2]/30 bg-slate-50/50 flex justify-between items-center gap-2">
              <button
                onClick={() => onSelectLand(land)}
                className="flex-1 py-2 bg-[#004532] text-white rounded-xl font-bold text-xs hover:bg-[#065f46] transition-colors shadow-xs"
              >
                Detail Sensor
              </button>
              {onEditLand && (
                <button
                  onClick={() => onEditLand(land)}
                  className="p-2 text-[#3f4944] hover:bg-[#e2e8f8] hover:text-[#004532] rounded-xl transition-colors"
                  title="Edit Lahan"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDeleteLand && (
                <button
                  onClick={() => onDeleteLand(land.id)}
                  className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl transition-colors"
                  title="Hapus Lahan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

