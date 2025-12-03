import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const connection = await pool.getConnection();

    // Get the post
    const [postRows] = await connection.query(
      `SELECT 
        ID as id,
        post_title as title,
        post_content,
        post_date,
        post_author,
        guid,
        post_type,
        post_status,
        comment_count
      FROM wp_posts 
      WHERE ID = ?`,
      [id]
    );

    const postArray = Array.isArray(postRows) ? postRows : [];
    if (!postArray || postArray.length === 0) {
      connection.release();
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    const post = (postArray[0] as any);

    // Get post metadata (like categories, tags, etc.)
    const [metaRows] = await connection.query(
      `SELECT meta_key, meta_value FROM wp_postmeta WHERE post_id = ?`,
      [id]
    );

    // Get associated terms (categories, tags)
    const [termRows] = await connection.query(
      `SELECT t.term_id, t.name, t.slug, tr.taxonomy
       FROM wp_terms t
       JOIN wp_term_taxonomy tr ON t.term_id = tr.term_id
       JOIN wp_term_relationships trr ON trr.term_taxonomy_id = tr.term_taxonomy_id
       WHERE trr.object_id = ?`,
      [id]
    );

    connection.release();

    return NextResponse.json({
      ...post,
      metadata: metaRows,
      terms: termRows,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    );
  }
}
