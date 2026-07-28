import React, { useState } from 'react';
import { HistoricalReading, Land } from '../types';
import {
  Download,
  Calendar,
  Filter,
  Search,
  Activity,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface TampilanMonitoringProps {
  lands: Land[];
  historicalReadings: HistoricalReading[];
}

export const TampilanMonitoring: React.FC<TampilanMonitoringProps> = ({ lands, historicalReadings }) => {
  const [selectedLand, setSelectedLand] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('today');
  const [searchTable, setSearchTable] = useState<string>('');
  const [downloadNotice, setDownloadNotice] = useState<string>('');

  const chartData = [
    { time: '08:00', temp: 25.2, humidity: 78, ph: 6.6 },
    { time: '09:00', temp: 26.0, humidity: 75, ph: 6.6 },
    { time: '10:00', temp: 27.5, humidity: 70, ph: 6.5 },
    { time: '11:00', temp: 28.8, humidity: 65, ph: 6.4 },
    { time: '12:00', temp: 29.5, humidity: 62, ph: 6.4 },
    { time: '13:00', temp: 29.8, humidity: 58, ph: 6.3 },
    { time: '14:00', temp: 28.4, humidity: 62, ph: 6.5 },
  ];

  const filteredReadings = historicalReadings.filter((hr) =>
    hr.landSector.toLowerCase().includes(searchTable.toLowerCase()) ||
    hr.status.toLowerCase().includes(searchTable.toLowerCase()) ||
    hr.timestamp.toLowerCase().includes(searchTable.toLowerCase())
  );

  const handleExportCSV = () => {
    const csvHeader = 'Timestamp,Land Sector,Temp (C),Humidity (%),Soil pH,Status\n';
    const csvRows = historicalReadings
      .map(
        (r) =>
          `"${r.timestamp}","${r.landSector}",${r.tempC},${r.humidityPercent},${r.soilPh},"${r.status}"`
      )
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agristeward_monitoring_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadNotice('Laporan CSV berhasil diunduh!');
    setTimeout(() => setDownloadNotice(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-2xl md:text-3xl text-[#151c27]">
            Real-time Monitoring & Analytics
          </h2>
          <p className="text-sm text-[#3f4944] mt-1">
            Analisis mendalam kondisi tanah dan lingkungan secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#004532] text-white rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-[#065f46] transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#a6f2d1]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-[#a6f2d1] border border-[#065f46] text-[#002116] rounded-xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#004532]" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl border border-[#bec9c2]/40 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#bec9c2]/30 pb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#004532]" />
            <h3 className="font-bold text-lg text-[#151c27]">Grafik Fluktuasi Parameter Lahan</h3>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedLand}
              onChange={(e) => setSelectedLand(e.target.value)}
              className="bg-[#f0f3ff] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#bec9c2] outline-none"
            >
              <option value="all">Semua Lahan</option>
              {lands.map((land) => (
                <option key={land.id} value={land.id}>
                  {land.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f8" />
              <XAxis dataKey="time" stroke="#3f4944" fontSize={11} />
              <YAxis stroke="#3f4944" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#004532',
                  color: '#fff',
                  borderRadius: '12px',
                  border: 'none',
                }}
              />
              <Line type="monotone" dataKey="humidity" stroke="#004532" strokeWidth={3} name="Kelembapan (%)" />
              <Line type="monotone" dataKey="temp" stroke="#ba1a1a" strokeWidth={2} name="Suhu (°C)" />
              <Line type="monotone" dataKey="ph" stroke="#8bd6b6" strokeWidth={2} name="pH Tanah" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Telemetry Log Table */}
      <div className="bg-white rounded-xl border border-[#bec9c2]/40 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#bec9c2]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base text-[#151c27]">Log Telemetri Sensor Lengkap</h4>
            <p className="text-xs text-[#3f4944]">Daftar sampel data telemetri historis dari node sensor.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3f4944]" />
            <input
              type="text"
              placeholder="Cari log telemetri..."
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              className="w-full bg-[#f0f3ff] text-xs pl-9 pr-3 py-2 rounded-xl border border-transparent focus:border-[#004532] outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f0f3ff] text-[#3f4944] uppercase tracking-wider font-bold border-b border-[#bec9c2]/40">
              <tr>
                <th className="py-3 px-4">Waktu Sampel</th>
                <th className="py-3 px-4">Sektor Lahan</th>
                <th className="py-3 px-4">Suhu (°C)</th>
                <th className="py-3 px-4">Kelembapan (%)</th>
                <th className="py-3 px-4">pH Tanah</th>
                <th className="py-3 px-4">Status Telemetri</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bec9c2]/30 text-[#151c27]">
              {filteredReadings.map((reading) => (
                <tr key={reading.id} className="hover:bg-[#f0f3ff]/50 transition-colors">
                  <td className="py-3 px-4 font-mono">{reading.timestamp}</td>
                  <td className="py-3 px-4 font-bold">{reading.landSector}</td>
                  <td className="py-3 px-4">{reading.tempC} °C</td>
                  <td className="py-3 px-4">{reading.humidityPercent} %</td>
                  <td className="py-3 px-4">{reading.soilPh} pH</td>
                  <td className="py-3 px-4">
                    <span className="bg-[#c6e9c7] text-[#00513b] font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      {reading.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
