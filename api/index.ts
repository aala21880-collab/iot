import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { getDatabase } from '../server/db';
import { testMysqlConnection, getMysqlPool } from '../server/mysql';

const app = express();
app.use(express.json());

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

export default app;

