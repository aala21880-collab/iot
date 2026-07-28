import { Land, ActivityLog, SensorNotification, HistoricalReading, IoTDevice } from '../types';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Health
  checkHealth: () => fetchJson<{ status: string; database: string }>('/api/health'),

  // Lands
  getLands: () => fetchJson<Land[]>('/api/lands'),
  createLand: (land: Land) => fetchJson<{ land: Land; log: ActivityLog }>('/api/lands', {
    method: 'POST',
    body: JSON.stringify(land),
  }),
  updateLand: (id: string, updates: Partial<Land>) => fetchJson<Land>(`/api/lands/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
  deleteLand: (id: string) => fetchJson<{ success: boolean; id: string }>(`/api/lands/${id}`, {
    method: 'DELETE',
  }),
  irrigateLand: (id: string) => fetchJson<{ land: Land; log: ActivityLog }>(`/api/lands/${id}/irrigate`, {
    method: 'POST',
  }),

  // Devices
  getDevices: () => fetchJson<IoTDevice[]>('/api/devices'),
  createDevice: (device: IoTDevice) => fetchJson<IoTDevice>('/api/devices', {
    method: 'POST',
    body: JSON.stringify(device),
  }),
  updateDevice: (id: string, updates: Partial<IoTDevice>) => fetchJson<IoTDevice>(`/api/devices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
  deleteDevice: (id: string) => fetchJson<{ success: boolean; id: string }>(`/api/devices/${id}`, {
    method: 'DELETE',
  }),

  // Activity Logs
  getActivityLogs: () => fetchJson<ActivityLog[]>('/api/activity-logs'),
  createActivityLog: (log: Omit<ActivityLog, 'id'>) => fetchJson<ActivityLog>('/api/activity-logs', {
    method: 'POST',
    body: JSON.stringify(log),
  }),

  // Notifications
  getNotifications: () => fetchJson<SensorNotification[]>('/api/notifications'),
  markAllNotificationsRead: () => fetchJson<SensorNotification[]>('/api/notifications/read-all', {
    method: 'PUT',
  }),
  clearNotifications: () => fetchJson<{ success: boolean }>('/api/notifications', {
    method: 'DELETE',
  }),

  // Historical Readings
  getHistoricalReadings: () => fetchJson<HistoricalReading[]>('/api/historical-readings'),
  createReading: (reading: HistoricalReading) => fetchJson<HistoricalReading>('/api/historical-readings', {
    method: 'POST',
    body: JSON.stringify(reading),
  }),
};
