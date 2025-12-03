import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const connection = await pool.getConnection();

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
      LEFT JOIN wp_posts a ON CAST(pm.meta_value AS UNSIGNED) = a.ID AND a.post_type = 'attachment'
      WHERE p.post_status = 'publish' AND p.post_type = 'post'
      ORDER BY p.post_date DESC
      LIMIT 5`
    );

    connection.release();

    return NextResponse.json(rows, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
