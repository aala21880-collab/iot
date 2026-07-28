import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { createServer as createViteServer } from 'vite';
import { getDatabase } from './server/db';
import { testMysqlConnection, getMysqlPool } from './server/mysql';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Database initialization (LowDB fallback & JSON local storage)
  const db = await getDatabase();

  // Test MySQL XAMPP connection status on boot
  const mysqlStatus = await testMysqlConnection();
  console.log('[AgriSteward DB Check]:', mysqlStatus.message);

  // --- API ROUTES ---

  // Health check & Database Status
  app.get('/api/health', async (_req, res) => {
    const liveMysql = await testMysqlConnection();
    res.json({
      status: 'ok',
      engine: liveMysql.connected ? 'MySQL (XAMPP)' : 'LowDB (JSON Persistence)',
      mysql: liveMysql,
      timestamp: new Date().toISOString()
    });
  });

  // Download XAMPP SQL Dump
  app.get('/api/download-sql', (_req, res) => {
    const sqlPath = path.join(process.cwd(), 'agristeward_xampp.sql');
    if (fs.existsSync(sqlPath)) {
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="agristeward_xampp.sql"');
      res.sendFile(sqlPath);
    } else {
      res.status(404).json({ error: 'File SQL tidak ditemukan' });
    }
  });

  // GET all lands
  app.get('/api/lands', async (_req, res) => {
    try {
      const mysqlCheck = await testMysqlConnection();
      if (mysqlCheck.connected) {
        const pool = getMysqlPool();
        const [rows] = await pool.query('SELECT * FROM lands ORDER BY created_at DESC');
        res.json(rows);
        return;
      }
    } catch (err) {
      console.warn('Fallback ke LowDB:', err);
    }

    await db.read();
    res.json(db.data.lands || []);
  });

  // POST create land
  app.post('/api/lands', async (req, res) => {
    try {
      const newLand = req.body;
      if (!newLand.id) {
        newLand.id = `land-${Date.now()}`;
      }

      // Try MySQL
      const mysqlCheck = await testMysqlConnection();
      if (mysqlCheck.connected) {
        const pool = getMysqlPool();
        await pool.query(
          `INSERT INTO lands (id, name, location, areaHa, soilType, status, activeSensors, imageUrl, moisturePercent, phLevel, temperatureC, nitrogenMgKg, phosphorusMgKg, potassiumMgKg)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name)`,
          [
            newLand.id,
            newLand.name,
            newLand.location,
            newLand.areaHa || 1.0,
            newLand.soilType || 'Lempung',
            newLand.status || 'Sangat Subur',
            newLand.activeSensors || 0,
            newLand.imageUrl || '',
            newLand.moisturePercent || 60,
            newLand.phLevel || 6.5,
            newLand.temperatureC || 28.0,
            newLand.nitrogenMgKg || 100,
            newLand.phosphorusMgKg || 30,
            newLand.potassiumMgKg || 150
          ]
        );
        console.log(`[MySQL] Berhasil INSERT lahan baru '${newLand.name}' (ID: ${newLand.id}) ke database MySQL!`);
      } else {
        console.log(`[MySQL] Server tidak terhubung ke MySQL (${mysqlCheck.message}). Menyimpan ke LowDB.`);
      }

      // Sync LowDB
      await db.read();
      db.data.lands.push(newLand);

      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: 'Baru Saja',
        landName: newLand.name,
        event: 'Pendaftaran lahan baru dan pemasangan sensor',
        status: 'SELESAI' as const,
      };
      db.data.activityLogs.unshift(newLog);

      await db.write();
      res.status(201).json({ land: newLand, log: newLog });
    } catch (err) {
      res.status(500).json({ error: 'Gagal menambah lahan', details: String(err) });
    }
  });

  // PUT update land
  app.put('/api/lands/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.read();
      const index = db.data.lands.findIndex((l) => l.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Lahan tidak ditemukan' });
        return;
      }
      db.data.lands[index] = { ...db.data.lands[index], ...req.body };
      await db.write();

      const mysqlCheck = await testMysqlConnection();
      if (mysqlCheck.connected) {
        const pool = getMysqlPool();
        const updated = db.data.lands[index];
        await pool.query(
          `UPDATE lands SET name=?, location=?, areaHa=?, soilType=?, status=?, moisturePercent=?, phLevel=?, temperatureC=? WHERE id=?`,
          [
            updated.name,
            updated.location,
            updated.areaHa,
            updated.soilType,
            updated.status,
            updated.moisturePercent,
            updated.phLevel,
            updated.temperatureC,
            id
          ]
        );
        console.log(`[MySQL] Berhasil UPDATE lahan '${updated.name}' (ID: ${id}) di database MySQL XAMPP!`);
      }

      res.json(db.data.lands[index]);
    } catch (err) {
      res.status(500).json({ error: 'Gagal memperbarui lahan', details: String(err) });
    }
  });

  // DELETE land
  app.delete('/api/lands/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.read();
      db.data.lands = db.data.lands.filter((l) => l.id !== id);
      await db.write();

      const mysqlCheck = await testMysqlConnection();
      if (mysqlCheck.connected) {
        const pool = getMysqlPool();
        await pool.query('DELETE FROM lands WHERE id = ?', [id]);
        console.log(`[MySQL] Berhasil DELETE lahan ID '${id}' dari database MySQL XAMPP!`);
      }

      res.json({ success: true, id });
    } catch (err) {
      res.status(500).json({ error: 'Gagal menghapus lahan' });
    }
  });

  // POST trigger irrigation
  app.post('/api/lands/:id/irrigate', async (req, res) => {
    try {
      const { id } = req.params;
      await db.read();
      const land = db.data.lands.find((l) => l.id === id);
      if (!land) {
        res.status(404).json({ error: 'Lahan tidak ditemukan' });
        return;
      }

      land.moisturePercent = Math.min(95, land.moisturePercent + 12);

      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: 'Baru Saja',
        landName: land.name,
        event: 'Irigasi otomatis diaktifkan via server',
        status: 'SELESAI' as const,
      };
      db.data.activityLogs.unshift(newLog);

      await db.write();

      const mysqlCheck = await testMysqlConnection();
      if (mysqlCheck.connected) {
        const pool = getMysqlPool();
        await pool.query('UPDATE lands SET moisturePercent = ? WHERE id = ?', [land.moisturePercent, id]);
        await pool.query('INSERT INTO activity_logs (id, timestamp, landName, event, status) VALUES (?, ?, ?, ?, ?)', [
          newLog.id,
          newLog.timestamp,
          newLog.landName,
          newLog.event,
          newLog.status
        ]);
      }

      res.json({ land, log: newLog });
    } catch (err) {
      res.status(500).json({ error: 'Gagal mengaktifkan irigasi' });
    }
  });

  // GET all IoT devices
  app.get('/api/devices', async (_req, res) => {
    try {
      const mysqlCheck = await testMysqlConnection();
      if (mysqlCheck.connected) {
        const pool = getMysqlPool();
        const [rows] = await pool.query('SELECT * FROM devices ORDER BY created_at DESC');
        res.json(rows);
        return;
      }
    } catch (err) {
      console.warn('Fallback ke LowDB:', err);
    }

    await db.read();
    res.json(db.data.devices || []);
  });

  // POST add new device
  app.post('/api/devices', async (req, res) => {
    try {
      const newDevice = req.body;
      if (!newDevice.id) {
        newDevice.id = `dev-${Date.now()}`;
      }

      const mysqlCheck = await testMysqlConnection();
      if (mysqlCheck.connected) {
        const pool = getMysqlPool();
        await pool.query(
          `INSERT INTO devices (id, name, type, landSector, status, batteryPercent, lastPing, firmware)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newDevice.id,
            newDevice.name,
            newDevice.type,
            newDevice.landSector,
            newDevice.status || 'Online',
            newDevice.batteryPercent || 100,
            newDevice.lastPing || 'Baru Saja',
            newDevice.firmware || 'v1.0.0'
          ]
        );
      }

      await db.read();
      db.data.devices.unshift(newDevice);
      await db.write();

      res.status(201).json(newDevice);
    } catch (err) {
      res.status(500).json({ error: 'Gagal mendaftarkan perangkat' });
    }
  });

  // PUT update device
  app.put('/api/devices/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      await db.read();
      const index = db.data.devices.findIndex((d) => d.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Perangkat tidak ditemukan' });
        return;
      }

      db.data.devices[index] = { ...db.data.devices[index], ...updates };
      await db.write();

      const mysqlCheck = await testMysqlConnection();
      if (mysqlCheck.connected) {
        const pool = getMysqlPool();
        await pool.query(
          `UPDATE devices SET name=?, type=?, landSector=?, status=?, batteryPercent=?, firmware=? WHERE id=?`,
          [
            db.data.devices[index].name,
            db.data.devices[index].type,
            db.data.devices[index].landSector,
            db.data.devices[index].status,
            db.data.devices[index].batteryPercent,
            db.data.devices[index].firmware,
            id,
          ]
        );
      }

      res.json(db.data.devices[index]);
    } catch (err) {
      res.status(500).json({ error: 'Gagal mengupdate perangkat' });
    }
  });

  // DELETE device
  app.delete('/api/devices/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.read();
      db.data.devices = db.data.devices.filter((d) => d.id !== id);
      await db.write();

      const mysqlCheck = await testMysqlConnection();
      if (mysqlCheck.connected) {
        const pool = getMysqlPool();
        await pool.query('DELETE FROM devices WHERE id = ?', [id]);
        console.log(`[MySQL] Berhasil DELETE perangkat ID '${id}' dari database MySQL XAMPP!`);
      }

      res.json({ success: true, id });
    } catch (err) {
      res.status(500).json({ error: 'Gagal menghapus perangkat' });
    }
  });

  // GET activity logs
  app.get('/api/activity-logs', async (_req, res) => {
    try {
      const mysqlCheck = await testMysqlConnection();
      if (mysqlCheck.connected) {
        const pool = getMysqlPool();
        const [rows] = await pool.query('SELECT * FROM activity_logs ORDER BY created_at DESC');
        res.json(rows);
        return;
      }
    } catch (err) {
      console.warn('Fallback ke LowDB:', err);
    }

    await db.read();
    res.json(db.data.activityLogs || []);
  });

  // GET notifications
  app.get('/api/notifications', async (_req, res) => {
    try {
      const mysqlCheck = await testMysqlConnection();
      if (mysqlCheck.connected) {
        const pool = getMysqlPool();
        const [rows] = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
        res.json(rows);
        return;
      }
    } catch (err) {
      console.warn('Fallback ke LowDB:', err);
    }

    await db.read();
    res.json(db.data.notifications || []);
  });

  // PUT mark all notifications read
  app.put('/api/notifications/read-all', async (_req, res) => {
    try {
      await db.read();
      db.data.notifications = db.data.notifications.map((n) => ({ ...n, read: true }));
      await db.write();

      const mysqlCheck = await testMysqlConnection();
      if (mysqlCheck.connected) {
        const pool = getMysqlPool();
        await pool.query('UPDATE notifications SET `read` = 1');
      }

      res.json(db.data.notifications);
    } catch (err) {
      res.status(500).json({ error: 'Gagal memperbarui notifikasi' });
    }
  });

  // DELETE clear notifications
  app.delete('/api/notifications', async (_req, res) => {
    try {
      await db.read();
      db.data.notifications = [];
      await db.write();

      const mysqlCheck = await testMysqlConnection();
      if (mysqlCheck.connected) {
        const pool = getMysqlPool();
        await pool.query('DELETE FROM notifications');
      }

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Gagal membersihkan notifikasi' });
    }
  });

  // GET historical readings
  app.get('/api/historical-readings', async (_req, res) => {
    try {
      const mysqlCheck = await testMysqlConnection();
      if (mysqlCheck.connected) {
        const pool = getMysqlPool();
        const [rows] = await pool.query('SELECT * FROM historical_readings ORDER BY created_at DESC');
        res.json(rows);
        return;
      }
    } catch (err) {
      console.warn('Fallback ke LowDB:', err);
    }

    await db.read();
    res.json(db.data.historicalReadings || []);
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server AgriSteward running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Gagal menjalankan server:', err);
});
