import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const connection = await pool.getConnection();

    // Check if there are any featured images in postmeta
    const [metaCheck] = await connection.query(
      `SELECT COUNT(*) as count FROM wp_postmeta WHERE meta_key = '_thumbnail_id' LIMIT 5`
    );

    // Get sample post with featured image
    const [postsWithMeta] = await connection.query(
      `SELECT 
        p.ID, 
        p.post_title,
        pm.meta_key,
        pm.meta_value as thumbnail_id,
        a.ID as attachment_id,
        a.guid as image_url,
        a.post_type
      FROM wp_posts p
      LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id AND pm.meta_key = '_thumbnail_id'
      LEFT JOIN wp_posts a ON CAST(pm.meta_value AS UNSIGNED) = a.ID
      WHERE p.post_status = 'publish' AND p.post_type = 'post'
      LIMIT 10`
    );

    // Check attachments in wp_posts
    const [attachments] = await connection.query(
      `SELECT ID, post_title, guid, post_type FROM wp_posts 
      WHERE post_type = 'attachment' LIMIT 10`
    );

    connection.release();

    return NextResponse.json({
      metaCount: (metaCheck as any[])[0],
      postsWithFeaturedImages: postsWithMeta,
      attachments: attachments,
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
