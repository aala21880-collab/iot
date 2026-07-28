import { Land, ActivityLog, SensorNotification, HistoricalReading, IoTDevice } from '../types';

export const INITIAL_LANDS: Land[] = [
  {
    id: 'land-1',
    name: 'Lahan Utara',
    location: 'Kecamatan Sukamandi, Jawa Barat',
    areaHa: 4.2,
    soilType: 'Lempung Aluvial',
    status: 'Sangat Subur',
    activeSensors: 3,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpgQhg9Rqdlb_78qlyCUn-7N70jpJuC_zAGBRxGIdy9CJk82fUElc6hYeqjcHnb5r1U1ty6dYUDtsTG2272msie7fF3N-Z2VEsybWVDUtupz_grPrFk2VAyt7mVehjL5yj-QufOKdjMkokQDSerPha9g50SVik-JEybJP7vlWyizjjUI5Y0Uojni0ZiMwSDg00DoOWRhgLLQ5XXgCJ-t7kCgJ8KbFpMeh6vfqxY3ko6p_18PnXFe6PoFkEe2UqdSSs3_1WvspLkjkA',
    moisturePercent: 72,
    phLevel: 6.6,
    temperatureC: 27.5,
    nitrogenMgKg: 140,
    phosphorusMgKg: 45,
    potassiumMgKg: 180,
  },
  {
    id: 'land-2',
    name: 'Lahan Selatan',
    location: 'Kecamatan Ciasem, Jawa Barat',
    areaHa: 3.5,
    soilType: 'Tanah Grumosol',
    status: 'Sedang',
    activeSensors: 5,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtEz3WzRos1onmjrUMy324xpeOtkvy-MzSedpQ7cxjoB0rkTJrBfOILybgouYNxu4ORhMDRkRzqT8q_Bkgg9ZhKx1CG74gbUz5SdbcDrEwI9PRR5S87zpGVnfC3zju_EbNEWv1ADGMURDtaFDnNtSDxc9r2kP-qcwWMzGNW_-Z-F_-55FWs-cZRy3lzlBkqt-kU629VXFyi6CqH8H64IE6Cf6OUKnTVCslN-OIYsFeeUcvSsIbmkiJfIoWcgn9lTuixCo0xCynHc2s',
    moisturePercent: 68,
    phLevel: 6.5,
    temperatureC: 28.0,
    nitrogenMgKg: 120,
    phosphorusMgKg: 38,
    potassiumMgKg: 160,
  },
  {
    id: 'land-3',
    name: 'Lahan Barat',
    location: 'Kecamatan Binong, Jawa Barat',
    areaHa: 4.7,
    soilType: 'Tanah Latosol',
    status: 'Butuh Perhatian',
    activeSensors: 4,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcL0C2kkdJvClyKNktPh-65FE_mKZv8w1hnV5iCQBiW0-luoK38fFKnfwynhEeeKFYLW8va0zt7n_nQxOJ_cX61JdqG_kKuTdkeag2E--vxaDnYC2BgW69F7kJE7AIIUsT6UBDwRNE3FKSXchJD_sHSaRKrPsHBpldPkDhDlXM8VbZz41XeBHp5nJGcl1Fp4Jgu-txkSwXSUWLipBVaG-y9WZmFqiwebA-GgJTLrKelQSXj5OVqKRXlGMYvAZeV438VB8Hw_kZVaH5',
    moisturePercent: 54,
    phLevel: 4.2,
    temperatureC: 29.8,
    nitrogenMgKg: 85,
    phosphorusMgKg: 20,
    potassiumMgKg: 110,
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '12:30, 24 Okt',
    landName: 'Lahan Utara',
    event: 'Irigasi diaktifkan otomatis',
    status: 'SELESAI'
  },
  {
    id: 'log-2',
    timestamp: '09:15, 24 Okt',
    landName: 'Lahan Barat',
    event: 'pH tanah turun drastis (4.2)',
    status: 'WARNING'
  },
  {
    id: 'log-3',
    timestamp: '06:00, 24 Okt',
    landName: 'Lahan Selatan',
    event: 'Update data sensor pagi',
    status: 'INFO'
  },
  {
    id: 'log-4',
    timestamp: '22:15, 23 Okt',
    landName: 'Lahan Utara',
    event: 'Deteksi tingkat kelembapan optimal (72%)',
    status: 'INFO'
  },
  {
    id: 'log-5',
    timestamp: '18:00, 23 Okt',
    landName: 'Lahan Barat',
    event: 'Sistem peringatan dini pupuk terpicu',
    status: 'WARNING'
  }
];

export const INITIAL_NOTIFICATIONS: SensorNotification[] = [
  {
    id: 'notif-1',
    title: 'pH Lahan A rendah',
    description: 'Sensor ID-24 melaporkan penurunan pH drastis di sektor Timur (pH 5.2).',
    timestamp: '15 menit yang lalu',
    level: 'urgent',
    read: false,
    landId: 'land-3'
  },
  {
    id: 'notif-2',
    title: 'Koneksi Putus - Sensor 12',
    description: 'Gateway gagal menerima data dari Node 12 selama 1 jam terakhir.',
    timestamp: '45 menit yang lalu',
    level: 'urgent',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Jadwal Irigasi Selesai',
    description: 'Pompa Lahan B telah berhenti beroperasi sesuai jadwal pukul 12:00.',
    timestamp: '2 jam yang lalu',
    level: 'info',
    read: true,
    landId: 'land-2'
  },
  {
    id: 'notif-4',
    title: 'Peringatan Suhu Tinggi',
    description: 'Suhu tanah Lahan Barat mencapai 29.8°C melebihi rata-rata harian.',
    timestamp: '3 jam yang lalu',
    level: 'warning',
    read: true,
    landId: 'land-3'
  }
];

export const INITIAL_HISTORICAL_READINGS: HistoricalReading[] = [
  { id: 'hr-1', timestamp: 'May 21, 2024 · 14:00', landSector: 'West Sector A1', tempC: 28.4, humidityPercent: 62, soilPh: 6.8, status: 'Normal' },
  { id: 'hr-2', timestamp: 'May 21, 2024 · 13:30', landSector: 'West Sector A1', tempC: 27.9, humidityPercent: 63, soilPh: 6.7, status: 'Normal' },
  { id: 'hr-3', timestamp: 'May 21, 2024 · 13:00', landSector: 'West Sector A1', tempC: 29.1, humidityPercent: 58, soilPh: 6.8, status: 'High Temp' },
  { id: 'hr-4', timestamp: 'May 21, 2024 · 12:30', landSector: 'West Sector A1', tempC: 27.5, humidityPercent: 65, soilPh: 6.9, status: 'Normal' },
  { id: 'hr-5', timestamp: 'May 21, 2024 · 12:00', landSector: 'West Sector A1', tempC: 26.8, humidityPercent: 68, soilPh: 6.6, status: 'Normal' },
  { id: 'hr-6', timestamp: 'May 21, 2024 · 11:30', landSector: 'West Sector A1', tempC: 26.2, humidityPercent: 70, soilPh: 6.5, status: 'Normal' },
  { id: 'hr-7', timestamp: 'May 21, 2024 · 11:00', landSector: 'East Sector B3', tempC: 29.8, humidityPercent: 54, soilPh: 4.2, status: 'Low pH' },
  { id: 'hr-8', timestamp: 'May 21, 2024 · 10:30', landSector: 'East Sector B3', tempC: 29.2, humidityPercent: 56, soilPh: 4.5, status: 'Low pH' },
];

export const INITIAL_DEVICES: IoTDevice[] = [
  { id: 'dev-1', name: 'Probe-ST-001', type: 'Sensor Soil Probe', landSector: 'Lahan Utara - Sektor 01', status: 'Online', batteryPercent: 92, lastPing: '2 mins ago', firmware: 'v2.4.1' },
  { id: 'dev-2', name: 'Probe-ST-002', type: 'Sensor Soil Probe', landSector: 'Lahan Selatan - Sektor 02', status: 'Online', batteryPercent: 88, lastPing: '5 mins ago', firmware: 'v2.4.1' },
  { id: 'dev-3', name: 'Probe-ST-012', type: 'Sensor Soil Probe', landSector: 'Lahan Barat - Sektor 04', status: 'Offline', batteryPercent: 12, lastPing: '1 hour ago', firmware: 'v2.3.9' },
  { id: 'dev-4', name: 'Hydro-Scan-X', type: 'Hydro Scan Gateway', landSector: 'Stasiun Utama Sukamandi', status: 'Online', batteryPercent: 100, lastPing: '1 min ago', firmware: 'v3.0.2' },
  { id: 'dev-5', name: 'CAM-01 (Live Feed)', type: 'Cam Feed', landSector: 'Lahan Cianjur 01', status: 'Online', batteryPercent: 95, lastPing: '10 secs ago', firmware: 'v1.8.0' },
  { id: 'dev-6', name: 'WeatherStation-Alpha', type: 'Weather Station', landSector: 'Menara Pemantau Lahan Utara', status: 'Online', batteryPercent: 78, lastPing: '4 mins ago', firmware: 'v2.1.0' },
];

export const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpgQhg9Rqdlb_78qlyCUn-7N70jpJuC_zAGBRxGIdy9CJk82fUElc6hYeqjcHnb5r1U1ty6dYUDtsTG2272msie7fF3N-Z2VEsybWVDUtupz_grPrFk2VAyt7mVehjL5yj-QufOKdjMkokQDSerPha9g50SVik-JEybJP7vlWyizjjUI5Y0Uojni0ZiMwSDg00DoOWRhgLLQ5XXgCJ-t7kCgJ8KbFpMeh6vfqxY3ko6p_18PnXFe6PoFkEe2UqdSSs3_1WvspLkjkA';
export const SENSOR_PROBE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI91LVymuWn67upXmK4ooBrKwH0bUtVmvLs8BVhOLuX76bPgxHPvY8hDflUyqRp4OI_eOArFdQMyz6JrOr3NAPDrWrWJuQRmWjz0G2VyX82cqndsbUezNF7KPSR6Iyds9YE50RZOx5DLH_lXqs2nl7I3aeX4HPGCkPxR5Ynd04xPd1ApKXxjuPOQxQdoXtfDYTPjbA0RZWjfl9i8FCXzWmAJFrUq-1xDzqV-zT0th8FMyfvVG1E0aqxKBPTN3FZl1ndBui08yCFiwT';
export const GIS_DASHBOARD_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMQja109MLoxzUyi3g3s6syTAjkbEIRjNXuCI3yua03C6ocGLF-2e7FP18LYkB9Z8hhSOSrHf5ls_zrIwv8ocsDpStDv--bf08cnwiG9PxOow80P2-gzpMi1sLc_rq9hKU7uw-07amEHxjG3dREoFvhuH4TaTPgN1OPdN1hr5YfD_tEf1qx1kUV60avlSb16n3sXP9Y9h-VZop2VAbXmnGGtQ2gYNoG-ntUN103Vmq53fX24xJdwloYL-BudTOxkbr1Wqh0QaejvMF';
export const TERRACED_RICE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjY9a2nYGpRfgty2foXJ1IcP_JHgRsIAqM9Up_cD3wwWuH9-CPLjwDC1SBzRLfjt57lxFmWuFfUpFCa-UHTYYZvRjg2IgSrf1PUj6dM_Bue2LfwpnJS0R7_qmPQyjA4iKgjmzq-WKxfA2NR6Ho_uMUoyxhOw8BZ_O2r9rlhm609Rr33zkOtTz4gStwFDQURv-FuGtChF-U0E6fakza8f4ApRui79YdKv81KH7YwHaoOoVoT9tXMpehPhiK0MEg_qWZh5tlCh63lMfO';
export const MAP_OVERLAY_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYWy-bOPbCh7mD6lS87ssBZ0lGsKnBZ7eEuYlXy5u6nLK8SQtf-ZgJSrpS467ee7SQETGpDeoDqMGHV-azsEUrUIklFxsNU1o776we8_16Qlp2sI-DKLHoEszBxhI7c3NvOuFAVNaD3W_QcmZ0EBDgqQgz5ORhafkZ8G0ZQVi8Wvo-H_Kl1WwP2QzaIKXsSRTn6hg3rzJuwLHVG3IIMj65i0KiRQw6YCD_CmA4n3QqM-7aOGO4FaQiww6Yf4Wk513LPAj-gFr6tLWv';
export const MORNING_RICE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA71il0q3WQ_ug_QnZzUDiUsVi1sUsOylABID2oDNaDSXkz-1UZDCYOilajkQR6VfbQmUoZsLTY_ZcQGm6uqpzum25djmWMCRO4gDAA3g9nrvcilSLWrwAv69Yvpiw0wNtyAW3vIZmDK3KgorqT6TeAm0wS4zgUZNzWR4WiRXoZ0r_h_ZQaXz6dwP-wWXn50qywT533exA8gja8rfrGVUzXrsUxzYyl9_3wTM0_f66mrLO21F084lzzObVt4QZe4dz8IxwX1o3Ca6qh';
export const USER_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPgMuHqbvx1JteOxhpxTUCNfvOQ__9Iu7eH8GPifLrEKDDjS97brBIBSbUyhDAcbI5abW7RwoirDnKJEx8Ay7CVj9wbeh7SNNFEHzQGz19D3_oNF_HxJEwvix_IIJ3szcfnypJTYA_Hi1dPaD-QueOzri5TliBcqtc-0THR01nBsPES9s2dnJH2MOQ5-fO7XkASU7ovbirf2xhgSVf66dzVyhOc6yK0rOQEWcE5s-c8kIYfYKDXHqbLYxU8cSGXilEGVu3rshFFp8P';
