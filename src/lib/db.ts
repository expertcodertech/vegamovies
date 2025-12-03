import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'u882663019_52ejx',
  password: process.env.DB_PASSWORD || 'XZ5w9AsQK0',
  database: process.env.DB_NAME || 'u882663019_S5IUV',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
