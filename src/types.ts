export type ViewType = 'landing' | 'dashboard' | 'lahan' | 'monitoring' | 'perangkat' | 'notifikasi' | 'profil' | 'login' | 'register';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role?: string;
  avatar?: string;
}

export interface Land {
  id: string;
  name: string;
  location: string;
  areaHa: number;
  soilType: string;
  status: 'Sangat Subur' | 'Optimal' | 'Sedang' | 'Butuh Perhatian';
  activeSensors: number;
  imageUrl: string;
  moisturePercent: number;
  phLevel: number;
  temperatureC: number;
  nitrogenMgKg?: number;
  phosphorusMgKg?: number;
  potassiumMgKg?: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  landName: string;
  event: string;
  status: 'SELESAI' | 'WARNING' | 'INFO';
}

export interface SensorNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  level: 'urgent' | 'warning' | 'info';
  read: boolean;
  landId?: string;
}

export interface HistoricalReading {
  id: string;
  timestamp: string;
  landSector: string;
  tempC: number;
  humidityPercent: number;
  soilPh: number;
  status: 'Normal' | 'High Temp' | 'Low pH' | 'Critical';
}

export interface IoTDevice {
  id: string;
  name: string;
  type: 'Sensor Soil Probe' | 'Hydro Scan Gateway' | 'Weather Station' | 'Cam Feed';
  landSector: string;
  status: 'Online' | 'Offline' | 'Battery Low' | 'Maintenance';
  batteryPercent: number;
  lastPing: string;
  firmware: string;
}
