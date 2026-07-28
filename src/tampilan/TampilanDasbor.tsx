import React, { useState, useEffect } from 'react';
import { ViewType, Land, SensorNotification } from '../types';
import {
  Calendar,
  CheckCircle,
  Radio,
  Sprout,
  Thermometer,
  Droplets,
  FlaskConical,
  AlertTriangle,
  Layers,
  Fullscreen,
  Video,
  Activity,
  Wifi,
  Zap,
  RefreshCw,
  Sun,
  ChevronRight,
  Eye,
  Play,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Filter,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import {
  MORNING_RICE_IMAGE,
  MAP_OVERLAY_IMAGE,
  TERRACED_RICE_IMAGE,
  SENSOR_PROBE_IMAGE
} from '../data/mockData';

interface TampilanDasborProps {
  setCurrentView: (view: ViewType) => void;
  lands: Land[];
  notifications: SensorNotification[];
  onOpenCamModal: () => void;
}

const TELEMETRY_24H = [
  { time: '00:00', kelembapan: 76, suhu: 24.1, ph: 6.6, n: 135, p: 42, k: 175 },
  { time: '03:00', kelembapan: 79, suhu: 23.5, ph: 6.6, n: 138, p: 43, k: 178 },
  { time: '06:00', kelembapan: 83, suhu: 25.0, ph: 6.5, n: 140, p: 45, k: 180 },
  { time: '09:00', kelembapan: 72, suhu: 27.8, ph: 6.5, n: 138, p: 44, k: 176 },
  { time: '12:00', kelembapan: 61, suhu: 30.2, ph: 6.4, n: 130, p: 40, k: 168 },
  { time: '15:00', kelembapan: 64, suhu: 29.1, ph: 6.5, n: 134, p: 42, k: 172 },
  { time: '18:00', kelembapan: 72, suhu: 26.5, ph: 6.6, n: 139, p: 45, k: 178 },
  { time: '21:00', kelembapan: 75, suhu: 25.1, ph: 6.6, n: 140, p: 45, k: 180 },
];

export const TampilanDasbor: React.FC<TampilanDasborProps> = ({
  setCurrentView,
  lands,
  notifications,
  onOpenCamModal,
}) => {
  const [selectedLandId, setSelectedLandId] = useState<string>('all');
  const [chartMetric, setChartMetric] = useState<'kelembapan' | 'suhu_ph' | 'npk'>('kelembapan');
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [activeCam, setActiveCam] = useState<'cam-01' | 'cam-02'>('cam-01');

  // Live ticking clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const urgentCount = notifications.filter((n) => n.level === 'urgent' && !n.read).length;

  // Filtered land stats
  const activeLand = lands.find((l) => l.id === selectedLandId) || lands[0] || {
    id: 'land-1',
    name: 'Lahan Utama Sukamandi',
    location: 'Sukamandi, Subang',
    moisturePercent: 68,
    temperatureC: 28.4,
    phLevel: 6.5,
    status: 'Sangat Subur'
  };

  const handleTriggerIrrigation = () => {
    setIsIrrigating(true);
    setTimeout(() => {
      setIsIrrigating(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-[#003525] via-[#004532] to-[#047857] rounded-2xl p-6 text-white shadow-lg border border-[#10b981]/20 relative overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40 text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                SISTEM IoT ONLINE
              </span>
              <span className="text-xs text-[#a6f2d1]/80 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {currentTime || 'Realtime Sync'}
              </span>
            </div>

            <h2 className="font-extrabold text-2xl md:text-3xl tracking-tight">
              Pusat Kendali Lahan Pertanian Presisi
            </h2>
            <p className="text-xs md:text-sm text-[#a6f2d1]/90 max-w-2xl leading-relaxed">
              Pantau kelembapan, suhu, keasaman pH, dan status irigasi nirkabel LoRaWAN secara langsung dari jaringan sensor persawahan Anda.
            </p>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex flex-wrap md:flex-col gap-2.5 items-start md:items-end shrink-0">
            <button
              onClick={handleTriggerIrrigation}
              disabled={isIrrigating}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                isIrrigating
                  ? 'bg-[#34d399] text-[#003525] animate-pulse cursor-not-allowed'
                  : 'bg-[#a6f2d1] text-[#003525] hover:bg-white hover:scale-[1.02] active:scale-95'
              }`}
            >
              <Zap className={`w-4 h-4 ${isIrrigating ? 'animate-spin' : ''}`} />
              <span>{isIrrigating ? 'Irigasi Aktif Menyiram...' : 'Aktifkan Irigasi Pompa'}</span>
            </button>

            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <Sun className="w-4 h-4 text-[#a6f2d1]" />
              <span>28.4°C Sukamandi · Cerah</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sektor Filter Bar & Quick Stats Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#004532]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#3f4944]">Filter Sektor:</span>
          <select
            value={selectedLandId}
            onChange={(e) => setSelectedLandId(e.target.value)}
            className="bg-white border border-[#bec9c2]/50 font-semibold text-xs text-[#004532] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#004532] shadow-xs cursor-pointer"
          >
            <option value="all">Semua Sektor (Rata-rata Lahan)</option>
            {lands.map((land) => (
              <option key={land.id} value={land.id}>
                {land.name} ({land.areaHa} Ha)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('lahan')}
            className="text-xs font-bold text-[#004532] hover:bg-[#a6f2d1]/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <Sprout className="w-4 h-4" />
            <span>Kelola {lands.length} Sektor</span>
          </button>
          <button
            onClick={() => setCurrentView('notifikasi')}
            className="text-xs font-bold text-[#ba1a1a] bg-[#ffdad6]/60 hover:bg-[#ffdad6] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{urgentCount} Peringatan Kritis</span>
          </button>
        </div>
      </div>

      {/* Modern Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kelembapan Tanah */}
        <div className="bg-white p-5 rounded-2xl border border-[#bec9c2]/30 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-[#004532] text-[#a6f2d1] flex items-center justify-center shadow-xs">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c6e9c7] text-[#004532]">
              OPTIMAL
            </span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3f4944]">
              KELEMBAPAN TANAH
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-black text-[#151c27]">
                {selectedLandId === 'all' ? '68%' : `${activeLand.moisturePercent}%`}
              </p>
              <span className="text-[11px] font-bold text-[#004532] flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +2.1%
              </span>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#10b981] h-full rounded-full transition-all duration-700"
                style={{ width: `${selectedLandId === 'all' ? 68 : activeLand.moisturePercent}%` }}
              />
            </div>
            <p className="text-[10px] text-[#3f4944] flex justify-between font-medium">
              <span>Batas Kritis: 40%</span>
              <span>Target: 70%</span>
            </p>
          </div>
        </div>

        {/* Suhu Lahan */}
        <div className="bg-white p-5 rounded-2xl border border-[#bec9c2]/30 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-[#047857] text-white flex items-center justify-center shadow-xs">
              <Thermometer className="w-5 h-5 text-[#a6f2d1]" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c6e9c7] text-[#004532]">
              NORMAL
            </span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3f4944]">
              SUHU LINGKUNGAN
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-black text-[#151c27]">
                {selectedLandId === 'all' ? '28.4 °C' : `${activeLand.temperatureC} °C`}
              </p>
              <span className="text-[11px] font-semibold text-[#3f4944]">Stabil</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#047857] h-full rounded-full transition-all duration-700"
                style={{
                  width: `${
                    ((selectedLandId === 'all' ? 28.4 : activeLand.temperatureC) / 40) * 100
                  }%`
                }}
              />
            </div>
            <p className="text-[10px] text-[#3f4944] flex justify-between font-medium">
              <span>Min: 22°C</span>
              <span>Maks Aman: 33°C</span>
            </p>
          </div>
        </div>

        {/* pH Keasaman Tanah */}
        <div className="bg-white p-5 rounded-2xl border border-[#bec9c2]/30 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-[#004532] text-white flex items-center justify-center shadow-xs">
              <FlaskConical className="w-5 h-5 text-[#a6f2d1]" />
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                (selectedLandId === 'all' ? 6.5 : activeLand.phLevel) < 5.5
                  ? 'bg-red-100 text-red-700'
                  : 'bg-[#c6e9c7] text-[#004532]'
              }`}
            >
              {(selectedLandId === 'all' ? 6.5 : activeLand.phLevel) < 5.5 ? 'PERHATIAN' : 'IDEAL'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3f4944]">
              KEASAMAN pH TANAH
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-black text-[#151c27]">
                {selectedLandId === 'all' ? '6.5 pH' : `${activeLand.phLevel} pH`}
              </p>
              <span className="text-[11px] font-semibold text-[#3f4944]">Netral</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#10b981] h-full rounded-full transition-all duration-700"
                style={{
                  width: `${
                    ((selectedLandId === 'all' ? 6.5 : activeLand.phLevel) / 14) * 100
                  }%`
                }}
              />
            </div>
            <p className="text-[10px] text-[#3f4944] flex justify-between font-medium">
              <span>Asam (0)</span>
              <span>Netral (6.5 - 7)</span>
              <span>Basa (14)</span>
            </p>
          </div>
        </div>

        {/* Nutrisi NPK Tanah */}
        <div className="bg-white p-5 rounded-2xl border border-[#bec9c2]/30 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-[#004532] text-[#a6f2d1] flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c6e9c7] text-[#004532]">
              KECUKUPAN PUPUK
            </span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3f4944]">
              NUTRISI KANDUNGAN NPK
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-xl font-black text-[#151c27]">140 : 45 : 180</p>
              <span className="text-[10px] font-bold text-[#004532]">mg/kg</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#3f4944]">
            <span className="px-1.5 py-0.5 bg-[#10b981]/20 text-[#004532] rounded border border-[#10b981]/30">N: 140</span>
            <span className="px-1.5 py-0.5 bg-[#047857]/20 text-[#004532] rounded border border-[#047857]/30">P: 45</span>
            <span className="px-1.5 py-0.5 bg-[#004532]/10 text-[#004532] rounded border border-[#004532]/20">K: 180</span>
          </div>
        </div>
      </div>

      {/* Chart Telemetry & CCTV Live Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Telemetry Analytics Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#bec9c2]/30 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#004532]" />
                <h3 className="font-bold text-lg text-[#151c27]">Grafik Telemetri Realtime 24 Jam</h3>
              </div>
              <p className="text-xs text-[#3f4944]">
                Tren rekaman sensor otomatis setiap 3 jam
              </p>
            </div>

            {/* Metric Switcher Tabs */}
            <div className="flex items-center gap-1 bg-[#f0f3ff] p-1 rounded-xl border border-[#bec9c2]/30 self-start">
              <button
                onClick={() => setChartMetric('kelembapan')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartMetric === 'kelembapan'
                    ? 'bg-[#004532] text-white shadow-xs'
                    : 'text-[#3f4944] hover:text-[#004532]'
                }`}
              >
                Kelembapan (%)
              </button>
              <button
                onClick={() => setChartMetric('suhu_ph')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartMetric === 'suhu_ph'
                    ? 'bg-[#004532] text-white shadow-xs'
                    : 'text-[#3f4944] hover:text-[#004532]'
                }`}
              >
                Suhu & pH
              </button>
              <button
                onClick={() => setChartMetric('npk')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartMetric === 'npk'
                    ? 'bg-[#004532] text-white shadow-xs'
                    : 'text-[#3f4944] hover:text-[#004532]'
                }`}
              >
                NPK Nutrisi
              </button>
            </div>
          </div>

          {/* Recharts Area Container */}
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartMetric === 'kelembapan' ? (
                <AreaChart data={TELEMETRY_24H} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorKelembapan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#003525',
                      borderColor: '#10b981',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="kelembapan"
                    name="Kelembapan Tanah (%)"
                    stroke="#004532"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorKelembapan)"
                  />
                </AreaChart>
              ) : chartMetric === 'suhu_ph' ? (
                <AreaChart data={TELEMETRY_24H} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSuhu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#047857" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#047857" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#003525',
                      borderColor: '#10b981',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="suhu" name="Suhu (°C)" stroke="#047857" strokeWidth={2.5} fill="url(#colorSuhu)" />
                  <Area type="monotone" dataKey="ph" name="pH Tanah" stroke="#10b981" strokeWidth={2.5} fill="url(#colorPh)" />
                </AreaChart>
              ) : (
                <BarChart data={TELEMETRY_24H} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#003525',
                      borderColor: '#10b981',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="n" name="Nitrogen (N)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="p" name="Fosfor (P)" fill="#047857" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="k" name="Kalium (K)" fill="#004532" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live CCTV Video Feed Panel */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#bec9c2]/30 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-[#004532]" />
              <h4 className="font-bold text-base text-[#151c27]">Kamera Pantau CCTV</h4>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setActiveCam('cam-01')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeCam === 'cam-01' ? 'bg-[#004532] text-white' : 'bg-slate-100 text-[#3f4944]'
                }`}
              >
                CAM-01
              </button>
              <button
                onClick={() => setActiveCam('cam-02')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeCam === 'cam-02' ? 'bg-[#004532] text-white' : 'bg-slate-100 text-[#3f4944]'
                }`}
              >
                CAM-02
              </button>
            </div>
          </div>

          <div
            onClick={onOpenCamModal}
            className="relative h-48 rounded-xl overflow-hidden group cursor-pointer border border-[#bec9c2]/40 bg-black"
          >
            <img
              src={activeCam === 'cam-01' ? MORNING_RICE_IMAGE : TERRACED_RICE_IMAGE}
              alt="Live Feed"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-red-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                LIVE
              </span>
              <span className="text-[10px] text-white font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                1080p · 30 FPS
              </span>
            </div>

            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs p-1.5 rounded-full text-white hover:bg-[#004532]">
              <Fullscreen className="w-4 h-4 text-[#a6f2d1]" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-[#004532]/90 backdrop-blur-xs text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
              <div>
                <p className="text-xs font-bold">{activeCam === 'cam-01' ? 'Lahan Subang Utara' : 'Lahan Ciasem Selatan'}</p>
                <p className="text-[10px] text-slate-300">Sensor Pemantau Tanaman Padi</p>
              </div>
              <span className="text-[10px] font-mono text-[#a6f2d1]">{currentTime}</span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs text-[#3f4944] bg-[#f0f3ff] p-2.5 rounded-xl border border-[#bec9c2]/30">
            <span className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#004532]" />
              Integritas Kamera Terverifikasi
            </span>
            <button
              onClick={onOpenCamModal}
              className="font-bold text-[#004532] hover:underline text-[11px]"
            >
              Perbesar Layar
            </button>
          </div>
        </div>
      </div>

      {/* GIS Spatial Map & Sector List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive GIS Spatial Preview */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#bec9c2]/30 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-lg text-[#151c27] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#004532]" />
                  Peta Spasial GIS Persawahan
                </h4>
                <p className="text-xs text-[#3f4944]">Visualisasi sektor lahan dan jangkauan gateway LoRaWAN</p>
              </div>
              <button
                onClick={() => setCurrentView('lahan')}
                className="text-xs font-bold text-white bg-[#004532] hover:bg-[#003525] px-3.5 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Fullscreen className="w-3.5 h-3.5 text-[#a6f2d1]" />
                <span>Buka Peta Penuh</span>
              </button>
            </div>

            <div className="relative h-72 rounded-2xl overflow-hidden border border-[#bec9c2]/40 bg-slate-900 group">
              <img
                src={MAP_OVERLAY_IMAGE}
                alt="Peta Spasial Lahan"
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

              {/* Top Glassmorphic Status Bar */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                <div className="bg-[#003525]/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#a6f2d1] border border-[#10b981]/30 shadow-md flex items-center gap-2 pointer-events-auto">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  <span>Subang Smart Grid · LPWAN Node Active</span>
                </div>
                <div className="bg-[#003525]/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-mono text-[#a6f2d1]/90 border border-[#10b981]/20 hidden sm:flex items-center gap-1 pointer-events-auto">
                  <span>GPS: -6.3312°, 107.7281°</span>
                </div>
              </div>

              {/* Interactive Sensor Pin 1 */}
              <div className="absolute top-[38%] left-[28%] transform -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer z-10">
                <div className="w-5 h-5 rounded-full bg-[#10b981] animate-ping absolute inset-0 opacity-75" />
                <div className="w-6 h-6 rounded-full bg-[#004532] border-2 border-white relative z-10 shadow-lg flex items-center justify-center text-[10px] text-white font-black">
                  1
                </div>
                <div className="hidden group-hover/pin:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#003525] text-white text-[10px] p-2.5 rounded-xl shadow-2xl whitespace-nowrap border border-[#10b981]/50 z-30">
                  <p className="font-bold text-[#a6f2d1]">Sektor 01: Lahan Utara</p>
                  <p className="text-[9px] text-slate-200">Kelembapan: 72% · pH: 6.6 · Temp: 27.5°C</p>
                  <span className="text-[8px] bg-[#10b981]/30 text-[#34d399] px-1.5 py-0.5 rounded mt-1 inline-block">Status: Sangat Subur</span>
                </div>
              </div>

              {/* Interactive Sensor Pin 2 */}
              <div className="absolute top-[52%] left-[65%] transform -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer z-10">
                <div className="w-5 h-5 rounded-full bg-[#10b981] animate-ping absolute inset-0 opacity-75" />
                <div className="w-6 h-6 rounded-full bg-[#004532] border-2 border-white relative z-10 shadow-lg flex items-center justify-center text-[10px] text-white font-black">
                  2
                </div>
                <div className="hidden group-hover/pin:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#003525] text-white text-[10px] p-2.5 rounded-xl shadow-2xl whitespace-nowrap border border-[#10b981]/50 z-30">
                  <p className="font-bold text-[#a6f2d1]">Sektor 02: Lahan Selatan</p>
                  <p className="text-[9px] text-slate-200">Kelembapan: 68% · pH: 6.5 · Temp: 28.0°C</p>
                  <span className="text-[8px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded mt-1 inline-block">Status: Sedang</span>
                </div>
              </div>

              {/* Interactive Sensor Pin 3 */}
              <div className="absolute top-[68%] left-[42%] transform -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer z-10">
                <div className="w-5 h-5 rounded-full bg-[#34d399] animate-ping absolute inset-0 opacity-75" />
                <div className="w-6 h-6 rounded-full bg-[#047857] border-2 border-white relative z-10 shadow-lg flex items-center justify-center text-[10px] text-white font-black">
                  3
                </div>
                <div className="hidden group-hover/pin:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#003525] text-white text-[10px] p-2.5 rounded-xl shadow-2xl whitespace-nowrap border border-[#10b981]/50 z-30">
                  <p className="font-bold text-[#a6f2d1]">Sektor 03: Lahan Barat</p>
                  <p className="text-[9px] text-slate-200">Kelembapan: 54% · pH: 4.2 · Temp: 29.8°C</p>
                  <span className="text-[8px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded mt-1 inline-block">Status: Butuh Perhatian</span>
                </div>
              </div>

              {/* Bottom GIS Live Legend */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-[10px]">
                <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 font-medium">
                  3 Node Aktif · Radius 5.2 km
                </span>
                <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 font-mono text-[#a6f2d1]">
                  Akurasi Spasial 99.4%
                </span>
              </div>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs text-[#004532] bg-[#f0f4f1] p-2.5 rounded-xl border border-[#bec9c2]/40">
            <span className="font-bold flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#004532]" />
              Infrastruktur Jaringan LoRaWAN & Kamera Lahan Beroperasi Normal
            </span>
            <span className="text-[10px] text-[#3f4944] font-mono hidden md:inline">Latency: 14ms</span>
          </div>
        </div>

        {/* Land Sectors List */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#bec9c2]/30 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg text-[#151c27]">Daftar Sektor Lahan</h4>
                <p className="text-xs text-[#3f4944]">Kondisi kesehatan & kelembapan tanah per blok</p>
              </div>
              <button
                onClick={() => setCurrentView('lahan')}
                className="text-xs font-bold text-[#004532] hover:bg-[#a6f2d1]/30 px-2.5 py-1 rounded-lg transition-colors"
              >
                Lihat Semua ({lands.length})
              </button>
            </div>

            <div className="space-y-3">
              {lands.slice(0, 3).map((land) => {
                const isUrgent = land.status === 'Butuh Perhatian';
                const isVeryGood = land.status === 'Sangat Subur';
                return (
                  <div
                    key={land.id}
                    onClick={() => setCurrentView('lahan')}
                    className="p-3.5 bg-[#f0f4f1]/80 rounded-2xl flex flex-col gap-2 hover:bg-[#f0f4f1] cursor-pointer transition-all border border-[#bec9c2]/30 hover:border-[#004532]/40 hover:shadow-xs group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#003525] to-[#047857] text-[#a6f2d1] border border-[#10b981]/30 flex flex-col items-center justify-center font-black text-xs shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <span>{land.areaHa}</span>
                          <span className="text-[8px] font-normal text-white/80 uppercase">Ha</span>
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-[#151c27] group-hover:text-[#004532] transition-colors">
                            {land.name}
                          </h5>
                          <p className="text-[10px] text-[#3f4944]">{land.location}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${
                          isVeryGood
                            ? 'bg-[#a6f2d1] text-[#004532] border-[#004532]/20'
                            : isUrgent
                            ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/30'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        {land.status}
                      </span>
                    </div>

                    {/* Mini telemetry metrics bar per land */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#004532] pt-1.5 border-t border-[#bec9c2]/30">
                      <span className="flex items-center gap-1 font-semibold">
                        <Droplets className="w-3 h-3 text-[#004532]" />
                        {land.moisturePercent}% Lembap
                      </span>
                      <span className="flex items-center gap-1 text-[#3f4944]">
                        <FlaskConical className="w-3 h-3 text-[#004532]" />
                        pH {land.phLevel}
                      </span>
                      <span className="flex items-center gap-1 text-[#3f4944]">
                        <Thermometer className="w-3 h-3 text-[#004532]" />
                        {land.temperatureC}°C
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setCurrentView('lahan')}
            className="w-full py-2.5 bg-[#004532] hover:bg-[#003525] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 mt-2"
          >
            <span>Tambah & Kelola Sektor Lahan</span>
            <ChevronRight className="w-4 h-4 text-[#a6f2d1]" />
          </button>
        </div>
      </div>
    </div>
  );
};
