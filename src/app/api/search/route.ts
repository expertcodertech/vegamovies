import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    if (!query.trim()) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    const searchTerm = `%${query}%`;

    // Search in posts by title and content
    const [rows] = await connection.query(
      `SELECT 
        ID as id,
        post_title as title,
        post_content,
        post_date,
        post_author,
        guid,
        post_type,
        post_status
      FROM wp_posts 
      WHERE (post_title LIKE ? OR post_content LIKE ?)
      ORDER BY post_date DESC
      LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.query(
      `SELECT COUNT(*) as total FROM wp_posts 
      WHERE (post_title LIKE ? OR post_content LIKE ?)`,
      [searchTerm, searchTerm]
    );

    connection.release();

    const totalCount = Array.isArray(countResult) ? (countResult[0] as any)?.total || 0 : 0;

    return NextResponse.json({
      results: rows,
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
      { error: 'Failed to search movies' },
      { status: 500 }
    );
  }
}
