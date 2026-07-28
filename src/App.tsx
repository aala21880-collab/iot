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

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // User Auth State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('agri_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default logged in user
    return {
      id: 'usr-101',
      name: 'Budi Santoso',
      email: 'budi@petani.id',
      phone: '+62 812-3456-7890',
      location: 'Sukamandi, Subang, Jawa Barat',
      role: 'Petani Terverifikasi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
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

      if (Array.isArray(fetchedLands) && fetchedLands.length > 0) setLands(fetchedLands);
      if (Array.isArray(fetchedLogs) && fetchedLogs.length > 0) setActivityLogs(fetchedLogs);
      if (Array.isArray(fetchedNotifs) && fetchedNotifs.length > 0) setNotifications(fetchedNotifs);
      if (Array.isArray(fetchedDevices) && fetchedDevices.length > 0) setDevices(fetchedDevices);
      if (Array.isArray(fetchedReadings) && fetchedReadings.length > 0) setHistoricalReadings(fetchedReadings);
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
    try {
      await api.createLand(newLand);
    } catch (e) {
      console.error('API createLand error:', e);
    }
  };

  const handleUpdateLand = async (id: string, updates: Partial<Land>) => {
    setLands((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    try {
      await api.updateLand(id, updates);
    } catch (e) {
      console.error('API updateLand error:', e);
    }
  };

  const handleDeleteLand = async (id: string) => {
    setLands((prev) => prev.filter((l) => l.id !== id));
    try {
      await api.deleteLand(id);
    } catch (e) {
      console.error('API deleteLand error:', e);
    }
  };

  const handleAddDevice = async (newDevice: IoTDevice) => {
    setDevices((prev) => [newDevice, ...prev]);
    try {
      await api.createDevice(newDevice);
    } catch (e) {
      console.error('API createDevice error:', e);
    }
  };

  const handleUpdateDevice = async (id: string, updates: Partial<IoTDevice>) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    try {
      await api.updateDevice(id, updates);
    } catch (e) {
      console.error('API updateDevice error:', e);
    }
  };

  const handleDeleteDevice = async (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    try {
      await api.deleteDevice(id);
    } catch (e) {
      console.error('API deleteDevice error:', e);
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
                  onOpenCamModal={() => setIsCamModalOpen(true)}
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
    </div>
  );
};

export default App;
