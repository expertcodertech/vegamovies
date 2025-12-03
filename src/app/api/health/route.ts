import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('SELECT 1 as health');
    connection.release();
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      result,
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        error: String(error),
      },
      { status: 500 }
    );
  }
}
