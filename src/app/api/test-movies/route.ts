import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  let connection: any = null;
  try {
    connection = await pool.getConnection();
    
    console.log('Test: Getting all post titles');
    
    const [rows] = await connection.query(
      `SELECT ID, post_title, post_date FROM wp_posts 
       WHERE post_status = 'publish' AND post_type = 'post'
       ORDER BY post_date DESC
       LIMIT 5`
    );
    
    console.log('Test: Got rows:', rows);
    
    return NextResponse.json({
      status: 'success',
      count: rows?.length || 0,
      data: rows || [],
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: String(error),
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        connection.release();
      } catch (e) {
        console.error('Error releasing connection:', e);
      }
    }
  }
}
