import mysql from 'mysql2/promise';

export async function connectDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ MySQL Connected!");
    return connection;
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
    throw error;
  }
}