import { sql } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Drop old tables
    await sql`DROP TABLE IF EXISTS encrypted_data CASCADE;`
    await sql`DROP TABLE IF EXISTS users CASCADE;`

    // Create fresh tables with correct schema
    await sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    await sql`
      CREATE TABLE encrypted_data (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        encrypted_content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT encrypted_data_user_id_fkey 
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `

    res.status(200).json({ 
      success: true, 
      message: 'Database reset successful - tables recreated with correct schema' 
    })
  } catch (error: any) {
    console.error('Reset error:', error)
    res.status(500).json({ error: error.message })
  }
}
