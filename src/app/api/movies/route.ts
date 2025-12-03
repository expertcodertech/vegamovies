import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  let connection: any = null;
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = (page - 1) * limit;

    connection = await pool.getConnection();
    
    console.log('Fetching movies with limit:', limit, 'offset:', offset);
    
    // Query WordPress posts table for movies with featured image
    const [rows] = await connection.query(
      `SELECT 
        p.ID as id,
        p.post_title as title,
        p.post_content,
        p.post_date,
        p.post_author,
        p.guid,
        p.post_type,
        p.post_status,
        IFNULL(a.guid, '') as poster_path
      FROM wp_posts p
      LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id AND pm.meta_key = '_thumbnail_id'
      LEFT JOIN wp_posts a ON pm.meta_value IS NOT NULL AND CAST(pm.meta_value AS UNSIGNED) = a.ID AND a.post_type = 'attachment'
      WHERE p.post_status = 'publish' AND p.post_type = 'post'
      ORDER BY p.post_date DESC
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    console.log('Got', rows?.length || 0, 'movies');

    // Get total count for pagination
    const [countResult] = await connection.query(
      `SELECT COUNT(*) as total FROM wp_posts 
      WHERE post_status = 'publish' AND post_type = 'post'`
    );

    const totalCount = Array.isArray(countResult) ? (countResult[0] as any)?.total || 0 : 0;
    
    return NextResponse.json({
      movies: rows || [],
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies', details: String(error) },
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
