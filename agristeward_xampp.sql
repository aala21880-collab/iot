-- SQL Schema & Initial Data for AgriSteward IoT
-- Download / Import file ini ke phpMyAdmin di XAMPP (http://localhost/phpmyadmin)
-- 1. Buat database baru bernama: `agristeward`
-- 2. Pilih database `agristeward`, lalu klik tab "Import"
-- 3. Choose file ini dan klik "Go" / "Kirim"

CREATE DATABASE IF NOT EXISTS `agristeward` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `agristeward`;

-- --------------------------------------------------------

-- Table structure for `lands`
CREATE TABLE IF NOT EXISTS `lands` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `areaHa` DECIMAL(8,2) NOT NULL DEFAULT 1.0,
  `soilType` VARCHAR(100) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Sangat Subur',
  `activeSensors` INT NOT NULL DEFAULT 0,
  `imageUrl` TEXT,
  `moisturePercent` INT NOT NULL DEFAULT 60,
  `phLevel` DECIMAL(4,2) NOT NULL DEFAULT 6.5,
  `temperatureC` DECIMAL(4,1) NOT NULL DEFAULT 28.0,
  `nitrogenMgKg` INT NOT NULL DEFAULT 100,
  `phosphorusMgKg` INT NOT NULL DEFAULT 30,
  `potassiumMgKg` INT NOT NULL DEFAULT 150,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for `lands`
INSERT INTO `lands` (`id`, `name`, `location`, `areaHa`, `soilType`, `status`, `activeSensors`, `imageUrl`, `moisturePercent`, `phLevel`, `temperatureC`, `nitrogenMgKg`, `phosphorusMgKg`, `potassiumMgKg`) VALUES
('land-1', 'Lahan Utara', 'Kecamatan Sukamandi, Jawa Barat', 4.20, 'Lempung Aluvial', 'Sangat Subur', 3, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi1XEoRKyeNnl26A8K5xyNct6XxOBud6eX7YUaOxpGztn4UjyjaV4YShYEGW9gn5qFko2Rym_Y8uR2SciAtY9klmypBo7kFrZeIVbKN5NMTw2_8ueG4_YoTb5OMLycVOkXzWhC1uDug7FJa98tD7qLLcQhkwV5noL6GVaYWYXpcIztREf9h92wPf5ytxtADQjmMaR3KAhlUaKq-gzrlLHA1QH0YHzdcMMhz06IbYKZDkZv9j0A89rDXd8Fmm_gxxWQEohd3qDJiKdB', 72, 6.60, 27.5, 140, 45, 180),
('land-2', 'Lahan Selatan', 'Kecamatan Ciasem, Jawa Barat', 3.50, 'Tanah Grumosol', 'Sedang', 5, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtEz3WzRos1onmjrUMy324xpeOtkvy-MzSedpQ7cxjoB0rkTJrBfOILybgouYNxu4ORhMDRkRzqT8q_Bkgg9ZhKx1CG74gbUz5SdbcDrEwI9PRR5S87zpGVnfC3zju_EbNEWv1ADGMURDtaFDnNtSDxc9r2kP-qcwWMzGNW_-Z-F_-55FWs-cZRy3lzlBkqt-kU629VXFyi6CqH8H64IE6Cf6OUKnTVCslN-OIYsFeeUcvSsIbmkiJfIoWcgn9lTuixCo0xCynHc2s', 68, 6.50, 28.0, 120, 38, 160),
('land-3', 'Lahan Barat', 'Kecamatan Binong, Jawa Barat', 4.70, 'Tanah Latosol', 'Butuh Perhatian', 4, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcL0C2kkdJvClyKNktPh-65FE_mKZv8w1hnV5iCQBiW0-luoK38fFKnfwynhEeeKFYLW8va0zt7n_nQxOJ_cX61JdqG_kKuTdkeag2E--vxaDnYC2BgW69F7kJE7AIIUsT6UBDwRNE3FKSXchJD_sHSaRKrPsHBpldPkDhDlXM8VbZz41XeBHp5nJGcl1Fp4Jgu-txkSwXSUWLipBVaG-y9WZmFqiwebA-GgJTLrKelQSXj5OVqKRXlGMYvAZeV438VB8Hw_kZVaH5', 54, 4.20, 29.8, 85, 20, 110)
ON DUPLICATE KEY UPDATE `name`=`name`;

-- --------------------------------------------------------

-- Table structure for `devices`
CREATE TABLE IF NOT EXISTS `devices` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `landSector` VARCHAR(150) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Online',
  `batteryPercent` INT NOT NULL DEFAULT 100,
  `lastPing` VARCHAR(50) DEFAULT 'Terhubung',
  `firmware` VARCHAR(30) DEFAULT 'v1.0.0',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `devices` (`id`, `name`, `type`, `landSector`, `status`, `batteryPercent`, `lastPing`, `firmware`) VALUES
('dev-1', 'Probe-ST-001', 'Sensor Soil Probe', 'Lahan Utara - Sektor 01', 'Online', 92, '2 mins ago', 'v2.4.1'),
('dev-2', 'Probe-ST-002', 'Sensor Soil Probe', 'Lahan Selatan - Sektor 02', 'Online', 88, '5 mins ago', 'v2.4.1'),
('dev-3', 'Probe-ST-012', 'Sensor Soil Probe', 'Lahan Barat - Sektor 04', 'Offline', 12, '1 hour ago', 'v2.3.9'),
('dev-4', 'Hydro-Scan-X', 'Hydro Scan Gateway', 'Stasiun Utama Sukamandi', 'Online', 100, '1 min ago', 'v3.0.2'),
('dev-5', 'CAM-01 (Live Feed)', 'Cam Feed', 'Lahan Cianjur 01', 'Online', 95, '10 secs ago', 'v1.8.0'),
('dev-6', 'WeatherStation-Alpha', 'Weather Station', 'Menara Pemantau Lahan Utara', 'Online', 78, '4 mins ago', 'v2.1.0')
ON DUPLICATE KEY UPDATE `name`=`name`;

-- --------------------------------------------------------

-- Table structure for `activity_logs`
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` VARCHAR(64) PRIMARY KEY,
  `timestamp` VARCHAR(50) NOT NULL,
  `landName` VARCHAR(100) NOT NULL,
  `event` VARCHAR(255) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'INFO',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `activity_logs` (`id`, `timestamp`, `landName`, `event`, `status`) VALUES
('log-1', '12:30, 24 Okt', 'Lahan Utara', 'Irigasi diaktifkan otomatis', 'SELESAI'),
('log-2', '09:15, 24 Okt', 'Lahan Barat', 'pH tanah turun drastis (4.2)', 'WARNING'),
('log-3', '06:00, 24 Okt', 'Lahan Selatan', 'Update data sensor pagi', 'INFO'),
('log-4', '22:15, 23 Okt', 'Lahan Utara', 'Deteksi tingkat kelembapan optimal (72%)', 'INFO'),
('log-5', '18:00, 23 Okt', 'Lahan Barat', 'Sistem peringatan dini pupuk terpicu', 'WARNING')
ON DUPLICATE KEY UPDATE `event`=`event`;

-- --------------------------------------------------------

-- Table structure for `notifications`
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `timestamp` VARCHAR(50) NOT NULL,
  `level` VARCHAR(20) NOT NULL DEFAULT 'info',
  `read` TINYINT(1) NOT NULL DEFAULT 0,
  `landId` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `notifications` (`id`, `title`, `description`, `timestamp`, `level`, `read`, `landId`) VALUES
('notif-1', 'pH Lahan A rendah', 'Sensor ID-24 melaporkan penurunan pH drastis di sektor Timur (pH 5.2).', '15 menit yang lalu', 'urgent', 0, 'land-3'),
('notif-2', 'Koneksi Putus - Sensor 12', 'Gateway gagal menerima data dari Node 12 selama 1 jam terakhir.', '45 menit yang lalu', 'urgent', 0, NULL),
('notif-3', 'Jadwal Irigasi Selesai', 'Pompa Lahan B telah berhenti beroperasi sesuai jadwal pukul 12:00.', '2 jam yang lalu', 'info', 1, 'land-2'),
('notif-4', 'Peringatan Suhu Tinggi', 'Suhu tanah Lahan Barat mencapai 29.8°C melebihi rata-rata harian.', '3 jam yang lalu', 'warning', 1, 'land-3')
ON DUPLICATE KEY UPDATE `title`=`title`;

-- --------------------------------------------------------

-- Table structure for `historical_readings`
CREATE TABLE IF NOT EXISTS `historical_readings` (
  `id` VARCHAR(64) PRIMARY KEY,
  `timestamp` VARCHAR(50) NOT NULL,
  `landSector` VARCHAR(100) NOT NULL,
  `tempC` DECIMAL(4,1) NOT NULL,
  `humidityPercent` INT NOT NULL,
  `soilPh` DECIMAL(4,2) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `historical_readings` (`id`, `timestamp`, `landSector`, `tempC`, `humidityPercent`, `soilPh`, `status`) VALUES
('hr-1', 'May 21, 2024 · 14:00', 'West Sector A1', 28.4, 62, 6.80, 'Normal'),
('hr-2', 'May 21, 2024 · 13:30', 'West Sector A1', 27.9, 63, 6.70, 'Normal'),
('hr-3', 'May 21, 2024 · 13:00', 'West Sector A1', 29.1, 58, 6.80, 'High Temp'),
('hr-4', 'May 21, 2024 · 12:30', 'West Sector A1', 27.5, 65, 6.90, 'Normal'),
('hr-5', 'May 21, 2024 · 12:00', 'West Sector A1', 26.8, 68, 6.60, 'Normal'),
('hr-6', 'May 21, 2024 · 11:30', 'West Sector A1', 26.2, 70, 6.50, 'Normal'),
('hr-7', 'May 21, 2024 · 11:00', 'East Sector B3', 29.8, 54, 4.20, 'Low pH'),
('hr-8', 'May 21, 2024 · 10:30', 'East Sector B3', 29.2, 56, 4.50, 'Low pH')
ON DUPLICATE KEY UPDATE `status`=`status`;
