import { sql } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'
import { initDatabase } from '@/lib/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId } = req.query

  if (!userId) {
    return res.status(400).json({ error: 'userId required' })
  }

  try {
    await initDatabase()

    const result = await sql`
      SELECT id, action, ip_address, user_agent, created_at
      FROM activity_log
      WHERE user_id = ${parseInt(userId as string)}
      ORDER BY created_at DESC
      LIMIT 20
    `

    res.status(200).json(result.rows)
  } catch (error: any) {
    console.error('Activity fetch error:', error)
    res.status(500).json({ error: error.message })
  }
}
