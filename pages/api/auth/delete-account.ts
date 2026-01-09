import { sql } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'
import { initDatabase } from '@/lib/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({ error: 'userId required' })
  }

  try {
    await initDatabase()

    // Delete all user data
    await sql`DELETE FROM encrypted_data WHERE user_id = ${userId}`
    await sql`DELETE FROM activity_log WHERE user_id = ${userId}`
    await sql`DELETE FROM users WHERE id = ${userId}`

    res.status(200).json({ success: true, message: 'Account deleted successfully' })
  } catch (error: any) {
    console.error('Account deletion error:', error)
    res.status(500).json({ error: error.message })
  }
}
