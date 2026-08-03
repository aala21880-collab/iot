import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ViewType, Land, ActivityLog, SensorNotification, IoTDevice, HistoricalReading, UserProfile } from './types';
import {
  INITIAL_LANDS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_HISTORICAL_READINGS,
  INITIAL_DEVICES
} from './data/mockData';
import { api } from './services/api';

// Komponen Navigasi Bahasa Indonesia
import { BilahSamping } from './komponen/navigasi/BilahSamping';
import { BilahAtas } from './komponen/navigasi/BilahAtas';
import { NavigasiSeluler } from './komponen/navigasi/NavigasiSeluler';

// Tampilan (Views) Bahasa Indonesia
import { TampilanLanding } from './tampilan/TampilanLanding';
import { TampilanDasbor } from './tampilan/TampilanDasbor';
import { TampilanLahan } from './tampilan/TampilanLahan';
import { TampilanMonitoring } from './tampilan/TampilanMonitoring';
import { TampilanPerangkat } from './tampilan/TampilanPerangkat';
import { TampilanNotifikasi } from './tampilan/TampilanNotifikasi';
import { TampilanProfil } from './tampilan/TampilanProfil';
import { TampilanMasuk } from './tampilan/TampilanMasuk';
import { TampilanDaftar } from './tampilan/TampilanDaftar';

// Komponen Modal Bahasa Indonesia
import { ModalTambahPerangkat } from './komponen/modal/ModalTambahPerangkat';
import { ModalEditPerangkat } from './komponen/modal/ModalEditPerangkat';
import { ModalTambahLahan } from './komponen/modal/ModalTambahLahan';
import { ModalEditLahan } from './komponen/modal/ModalEditLahan';
import { ModalDetailLahan } from './komponen/modal/ModalDetailLahan';
import { ModalKameraLive } from './komponen/modal/ModalKameraLive';
import { ModalStatusDatabase } from './komponen/modal/ModalStatusDatabase';
import { ModalRiwayatAktivitas } from './komponen/modal/ModalRiwayatAktivitas';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDbStatusModalOpen, setIsDbStatusModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // User Auth State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('agri_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clear old automatic test profile if it exists in visitor browser localStorage
        if (parsed && (parsed.id === 'usr-101' || parsed.email === 'budi@petani.id')) {
          localStorage.removeItem('agri_current_user');
          return null;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  // Domain states
  const [lands, setLands] = useState<Land[]>(INITIAL_LANDS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [notifications, setNotifications] = useState<SensorNotification[]>(INITIAL_NOTIFICATIONS);
  const [devices, setDevices] = useState<IoTDevice[]>(INITIAL_DEVICES);
  const [historicalReadings, setHistoricalReadings] = useState<HistoricalReading[]>(INITIAL_HISTORICAL_READINGS);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

  // Modal states
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<IoTDevice | null>(null);
  const [isAddLandOpen, setIsAddLandOpen] = useState(false);
  const [editingLand, setEditingLand] = useState<Land | null>(null);
  const [selectedLandForDetail, setSelectedLandForDetail] = useState<Land | null>(null);
  const [isCamModalOpen, setIsCamModalOpen] = useState(false);

  // Load data from Express Backend Database
  const loadDatabaseData = async () => {
    try {
      setIsLoading(true);
      const [fetchedLands, fetchedLogs, fetchedNotifs, fetchedDevices, fetchedReadings] = await Promise.all([
        api.getLands(),
        api.getActivityLogs(),
        api.getNotifications(),
        api.getDevices(),
        api.getHistoricalReadings(),
      ]);

      if (fetchedLands) setLands(fetchedLands);
      if (fetchedLogs) setActivityLogs(fetchedLogs);
      if (fetchedNotifs) setNotifications(fetchedNotifs);
      if (fetchedDevices) setDevices(fetchedDevices);
      if (fetchedReadings) setHistoricalReadings(fetchedReadings);
      setIsDbConnected(true);
    } catch (err) {
      console.warn('Gagal memuat data dari database backend, menggunakan data fallback lokal:', err);
      setIsDbConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, []);

  // Save user profile state changes
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    if (!userProfile) return;
    const newProfile = { ...userProfile, ...updated };
    setUserProfile(newProfile);
    localStorage.setItem('agri_current_user', JSON.stringify(newProfile));
  };

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem('agri_current_user');
    setCurrentView('landing');
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setUserProfile(user);
    localStorage.setItem('agri_current_user', JSON.stringify(user));
  };

  const handleRegisterSuccess = (user: UserProfile) => {
    setUserProfile(user);
    localStorage.setItem('agri_current_user', JSON.stringify(user));
  };

  // Handlers for Add/Edit/Delete
  const handleAddLand = async (newLand: Land) => {
    setLands((prev) => [newLand, ...prev]);
    const addLog: ActivityLog = {
      id: `log-add-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      landName: newLand.name,
      event: `Pendaftaran Lahan Baru (${newLand.name} - ${newLand.areaHa} Ha)`,
      category: 'PENAMBAHAN',
      status: 'SELESAI',
      user: userProfile?.name || 'Petani Pemilik'
    };
    setActivityLogs((prev) => [addLog, ...prev]);

    try {
      await api.createLand(newLand);
    } catch (e) {
      console.error('API createLand error:', e);
    }
  };

  const handleUpdateLand = async (id: string, updates: Partial<Land>) => {
    const existing = lands.find((l) => l.id === id);
    const landName = existing ? existing.name : 'Lahan';
    setLands((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));

    const updateLog: ActivityLog = {
      id: `log-upd-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      landName: updates.name || landName,
      event: `Pembaruan data parameter lahan '${updates.name || landName}'`,
      category: 'PEMBARUAN',
      status: 'INFO',
      user: userProfile?.name || 'Petani Pemilik'
    };
    setActivityLogs((prev) => [updateLog, ...prev]);

    try {
      await api.updateLand(id, updates);
    } catch (e) {
      console.error('API updateLand error:', e);
    }
  };

  const handleDeleteLand = async (id: string) => {
    const target = lands.find((l) => l.id === id);
    const landName = target ? target.name : `ID: ${id}`;
    
    setLands((prev) => prev.filter((l) => l.id !== id));

    const deleteLog: ActivityLog = {
      id: `log-del-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      landName: landName,
      event: `Penghapusan Lahan (${landName}) dari sistem`,
      category: 'PENGHAPUSAN',
      status: 'WARNING',
      user: userProfile?.name || 'Petani Pemilik'
    };
    setActivityLogs((prev) => [deleteLog, ...prev]);

    try {
      await api.deleteLand(id);
    } catch (e) {
      console.error('API deleteLand error:', e);
    }
  };

  const handleAddDevice = async (newDevice: IoTDevice) => {
    setDevices((prev) => [newDevice, ...prev]);

    const addLog: ActivityLog = {
      id: `log-add-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      landName: newDevice.landSector || 'Sektor Utama',
      event: `Pemasangan Perangkat IoT Baru (${newDevice.name} - ${newDevice.type})`,
      category: 'PENAMBAHAN',
      status: 'SELESAI',
      user: userProfile?.name || 'Petani Pemilik'
    };
    setActivityLogs((prev) => [addLog, ...prev]);

    try {
      await api.createDevice(newDevice);
    } catch (e) {
      console.error('API createDevice error:', e);
    }
  };

  const handleUpdateDevice = async (id: string, updates: Partial<IoTDevice>) => {
    const existing = devices.find((d) => d.id === id);
    const devName = existing ? existing.name : 'Perangkat';
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));

    const updateLog: ActivityLog = {
      id: `log-upd-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      landName: updates.landSector || existing?.landSector || 'Sektor Lahan',
      event: `Pembaruan status/konfigurasi perangkat '${updates.name || devName}'`,
      category: 'PEMBARUAN',
      status: 'INFO',
      user: userProfile?.name || 'Petani Pemilik'
    };
    setActivityLogs((prev) => [updateLog, ...prev]);

    try {
      await api.updateDevice(id, updates);
    } catch (e) {
      console.error('API updateDevice error:', e);
    }
  };

  const handleDeleteDevice = async (id: string) => {
    const target = devices.find((d) => d.id === id);
    const devName = target ? target.name : `ID: ${id}`;
    const sector = target ? target.landSector : 'Sektor Lahan';

    setDevices((prev) => prev.filter((d) => d.id !== id));

    const deleteLog: ActivityLog = {
      id: `log-del-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      landName: sector,
      event: `Penghapusan perangkat IoT (${devName}) dari sistem`,
      category: 'PENGHAPUSAN',
      status: 'WARNING',
      user: userProfile?.name || 'Petani Pemilik'
    };
    setActivityLogs((prev) => [deleteLog, ...prev]);

    try {
      await api.deleteDevice(id);
    } catch (e) {
      console.error('API deleteDevice error:', e);
    }
  };

  const handleClearActivityLogs = async () => {
    setActivityLogs([]);
    try {
      await api.clearActivityLogs();
    } catch (e) {
      console.error('Clear activity logs error:', e);
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.markAllNotificationsRead();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearNotifications = async () => {
    setNotifications([]);
    try {
      await api.clearNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerIrrigation = async (landId: string) => {
    const targetLand = lands.find((l) => l.id === landId);
    if (!targetLand) return;

    // Local state update
    const updatedMoisture = Math.min(100, targetLand.moisturePercent + 15);
    setLands((prev) =>
      prev.map((l) => (l.id === landId ? { ...l, moisturePercent: updatedMoisture } : l))
    );

    // Create log
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      landName: targetLand.name,
      event: 'Irigasi Otomatis Diaktifkan',
      status: 'SELESAI',
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    try {
      await api.createActivityLog(newLog);
      await api.updateLand(landId, { moisturePercent: updatedMoisture });
    } catch (e) {
      console.error('Trigger irrigation error:', e);
    }
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // View switch render logic
  const isLandingOrAuth = currentView === 'landing' || currentView === 'login' || currentView === 'register';

  if (isLandingOrAuth) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 10, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.995 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="min-h-screen"
        >
          {currentView === 'landing' && (
            <TampilanLanding onGoToApp={(view) => setCurrentView(view || 'dashboard')} />
          )}
          {currentView === 'login' && (
            <TampilanMasuk
              setCurrentView={setCurrentView}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
          {currentView === 'register' && (
            <TampilanDaftar
              setCurrentView={setCurrentView}
              onRegisterSuccess={handleRegisterSuccess}
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] flex flex-col md:flex-row selection:bg-[#a6f2d1] selection:text-[#004532]">
      {/* Sidebar Navigation */}
      <BilahSamping
        currentView={currentView}
        setCurrentView={setCurrentView}
        unreadCount={unreadNotifCount}
        onOpenAddDevice={() => setIsAddDeviceOpen(true)}
        onOpenActivityModal={() => setIsActivityModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 pb-20 md:pb-8">
        {/* Top Header */}
        <BilahAtas
          currentView={currentView}
          setCurrentView={setCurrentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isDbConnected={isDbConnected}
          userProfile={userProfile}
          onLogout={handleLogout}
          onOpenDbModal={() => setIsDbStatusModalOpen(true)}
          onOpenActivityModal={() => setIsActivityModalOpen(true)}
        />

        {/* Dynamic View Body */}
        <main className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto relative min-h-[80vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 12, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.995 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full h-full"
            >
              {currentView === 'dashboard' && (
                <TampilanDasbor
                  setCurrentView={setCurrentView}
                  lands={lands}
                  notifications={notifications}
                  activityLogs={activityLogs}
                  onOpenCamModal={() => setIsCamModalOpen(true)}
                  onOpenActivityModal={() => setIsActivityModalOpen(true)}
                />
              )}

              {currentView === 'lahan' && (
                <TampilanLahan
                  lands={lands}
                  activityLogs={activityLogs}
                  onOpenAddLand={() => setIsAddLandOpen(true)}
                  onSelectLand={(land) => setSelectedLandForDetail(land)}
                  onEditLand={(land) => setEditingLand(land)}
                  onDeleteLand={handleDeleteLand}
                  searchQuery={searchQuery}
                />
              )}

              {currentView === 'monitoring' && (
                <TampilanMonitoring
                  lands={lands}
                  historicalReadings={historicalReadings}
                  activityLogs={activityLogs}
                  onOpenActivityModal={() => setIsActivityModalOpen(true)}
                />
              )}

              {currentView === 'perangkat' && (
                <TampilanPerangkat
                  devices={devices}
                  onOpenAddDevice={() => setIsAddDeviceOpen(true)}
                  onEditDevice={(device) => setEditingDevice(device)}
                  onDeleteDevice={handleDeleteDevice}
                />
              )}

              {currentView === 'notifikasi' && (
                <TampilanNotifikasi
                  notifications={notifications}
                  onMarkAllRead={handleMarkAllRead}
                  onClearNotifications={handleClearNotifications}
                />
              )}

              {currentView === 'profil' && (
                <TampilanProfil
                  userProfile={userProfile}
                  onUpdateProfile={handleUpdateProfile}
                  onLogout={handleLogout}
                  onGoToLogin={() => setCurrentView('login')}
                  onGoToRegister={() => setCurrentView('register')}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <NavigasiSeluler
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenAddDevice={() => setIsAddDeviceOpen(true)}
      />

      {/* Modals */}
      <ModalTambahPerangkat
        isOpen={isAddDeviceOpen}
        onClose={() => setIsAddDeviceOpen(false)}
        onAddDevice={handleAddDevice}
        landOptions={lands.map((l) => l.name)}
      />

      <ModalEditPerangkat
        device={editingDevice}
        isOpen={Boolean(editingDevice)}
        onClose={() => setEditingDevice(null)}
        onUpdateDevice={handleUpdateDevice}
        onDeleteDevice={handleDeleteDevice}
        landOptions={lands.map((l) => l.name)}
      />

      <ModalTambahLahan
        isOpen={isAddLandOpen}
        onClose={() => setIsAddLandOpen(false)}
        onAddLand={handleAddLand}
      />

      <ModalEditLahan
        land={editingLand}
        isOpen={Boolean(editingLand)}
        onClose={() => setEditingLand(null)}
        onUpdateLand={handleUpdateLand}
        onDeleteLand={handleDeleteLand}
      />

      <ModalDetailLahan
        land={selectedLandForDetail}
        onClose={() => setSelectedLandForDetail(null)}
        onTriggerIrrigation={handleTriggerIrrigation}
      />

      <ModalKameraLive
        isOpen={isCamModalOpen}
        onClose={() => setIsCamModalOpen(false)}
      />

      <ModalStatusDatabase
        isOpen={isDbStatusModalOpen}
        onClose={() => setIsDbStatusModalOpen(false)}
      />

      <ModalRiwayatAktivitas
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        activityLogs={activityLogs}
        onClearLogs={handleClearActivityLogs}
      />
    </div>
  );
};

export default App;
