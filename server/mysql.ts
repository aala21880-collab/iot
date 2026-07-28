import mysql from 'mysql2/promise';

const DB_HOST = process.env.DB_HOST || process.env.MYSQL_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || process.env.MYSQL_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'agristeward';

let pool: mysql.Pool | null = null;

export function getMysqlPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 3000,
    });
  }
  return pool;
}

export async function testMysqlConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const connection = await getMysqlPool().getConnection();
    await connection.ping();
    connection.release();
    return {
      connected: true,
      message: `Terhubung ke MySQL XAMPP (${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME})`,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Tidak dapat terhubung ke MySQL XAMPP (${DB_HOST}:${DB_PORT}). Alasan: ${err.message || String(err)}`,
    };
  }
}
