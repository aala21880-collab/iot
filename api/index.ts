import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { getDatabase } from '../server/db';
import { testMysqlConnection, getMysqlPool } from '../server/mysql';

const app = express();
app.use(express.json());

// Base API route
app.get('/api', (_req, res) => {
  res.json({ status: 'ok', service: 'AgriSteward API' });
});

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

  const db = await getDatabase();
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
    }

    const db = await getDatabase();
    await db.read();
    const existingIdx = db.data.lands.findIndex((l) => l.id === newLand.id);
    if (existingIdx >= 0) {
      db.data.lands[existingIdx] = newLand;
    } else {
      db.data.lands.unshift(newLand);
    }
    
    // Add activity log
    const logItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
      landName: newLand.name,
      event: `Penambahan Lahan Baru "${newLand.name}"`,
      status: 'INFO' as const
    };
    db.data.activityLogs.unshift(logItem);

    try {
      await db.write();
    } catch (wErr) {
      console.warn('Non-blocking LowDB write warning:', wErr);
    }
    res.status(201).json(newLand);
  } catch (err) {
    res.status(500).json({ error: 'Gagal membuat data lahan baru' });
  }
});

// PUT update land
app.put('/api/lands/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
    await db.read();
    const index = db.data.lands.findIndex((l) => l.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Lahan tidak ditemukan' });
      return;
    }
    db.data.lands[index] = { ...db.data.lands[index], ...req.body };
    try { await db.write(); } catch (e) {}

    const mysqlCheck = await testMysqlConnection();
    if (mysqlCheck.connected) {
      const pool = getMysqlPool();
      const updated = db.data.lands[index];
      await pool.query(
        `UPDATE lands SET name=?, location=?, areaHa=?, soilType=?, status=?, moisturePercent=?, phLevel=?, temperatureC=? WHERE id=?`,
        [updated.name, updated.location, updated.areaHa, updated.soilType, updated.status, updated.moisturePercent, updated.phLevel, updated.temperatureC, id]
      );
    }

    res.json(db.data.lands[index]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal memperbarui lahan' });
  }
});

// DELETE land
app.delete('/api/lands/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
    await db.read();
    const landToDelete = db.data.lands.find((l) => l.id === id);
    const landName = landToDelete ? landToDelete.name : `ID: ${id}`;
    
    db.data.lands = db.data.lands.filter((l) => l.id !== id);

    const newLog = {
      id: `log-del-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      landName: landName,
      event: `Penghapusan Lahan (${landName}) dari sistem`,
      category: 'PENGHAPUSAN' as const,
      status: 'WARNING' as const,
      user: 'Petani Pemilik'
    };
    db.data.activityLogs.unshift(newLog);
    try { await db.write(); } catch (e) {}

    const mysqlCheck = await testMysqlConnection();
    if (mysqlCheck.connected) {
      const pool = getMysqlPool();
      await pool.query('DELETE FROM lands WHERE id = ?', [id]);
    }

    res.json({ success: true, id, log: newLog });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus lahan' });
  }
});

// POST trigger irrigation
app.post('/api/lands/:id/irrigate', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
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
    try { await db.write(); } catch (e) {}

    res.json({ land, log: newLog });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengaktifkan irigasi' });
  }
});

// GET devices
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

  const db = await getDatabase();
  await db.read();
  res.json(db.data.devices || []);
});

// POST add new device
app.post('/api/devices', async (req, res) => {
  try {
    const newDevice = req.body;
    if (!newDevice.id) newDevice.id = `dev-${Date.now()}`;

    const db = await getDatabase();
    await db.read();
    db.data.devices.unshift(newDevice);
    try { await db.write(); } catch (e) {}

    res.status(201).json(newDevice);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mendaftarkan perangkat' });
  }
});

// PUT update device
app.put('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
    await db.read();
    const index = db.data.devices.findIndex((d) => d.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Perangkat tidak ditemukan' });
      return;
    }
    db.data.devices[index] = { ...db.data.devices[index], ...req.body };
    try { await db.write(); } catch (e) {}
    res.json(db.data.devices[index]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengupdate perangkat' });
  }
});

// DELETE device
app.delete('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
    await db.read();
    db.data.devices = db.data.devices.filter((d) => d.id !== id);
    try { await db.write(); } catch (e) {}
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

  const db = await getDatabase();
  await db.read();
  res.json(db.data.activityLogs || []);
});

// POST new activity log
app.post('/api/activity-logs', async (req, res) => {
  try {
    const log = req.body;
    if (!log.id) log.id = `log-${Date.now()}`;
    const db = await getDatabase();
    await db.read();
    db.data.activityLogs.unshift(log);
    try { await db.write(); } catch (e) {}
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambah activity log' });
  }
});

// DELETE clear activity logs
app.delete('/api/activity-logs', async (_req, res) => {
  try {
    const db = await getDatabase();
    await db.read();
    db.data.activityLogs = [];
    try { await db.write(); } catch (e) {}
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengosongkan activity logs' });
  }
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

  const db = await getDatabase();
  await db.read();
  res.json(db.data.notifications || []);
});

// PUT mark all notifications read
app.put('/api/notifications/read-all', async (_req, res) => {
  try {
    const db = await getDatabase();
    await db.read();
    db.data.notifications = db.data.notifications.map((n) => ({ ...n, read: true }));
    try { await db.write(); } catch (e) {}
    res.json(db.data.notifications);
  } catch (err) {
    res.status(500).json({ error: 'Gagal memperbarui notifikasi' });
  }
});

// DELETE clear notifications
app.delete('/api/notifications', async (_req, res) => {
  try {
    const db = await getDatabase();
    await db.read();
    db.data.notifications = [];
    try { await db.write(); } catch (e) {}
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

  const db = await getDatabase();
  await db.read();
  res.json(db.data.historicalReadings || []);
});

export default app;
