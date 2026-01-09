import { sql } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'
import { initDatabase } from '@/lib/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({ error: 'userId required' })
  }

  try {
    await initDatabase()

    // Disable 2FA
    await sql`
      UPDATE users 
      SET 
        two_factor_enabled = FALSE,
        two_factor_secret = NULL,
        backup_codes = NULL
      WHERE id = ${userId}
    `

    res.status(200).json({
      success: true,
      message: '2FA disabled successfully'
    })
  } catch (error: any) {
    console.error('Disable 2FA error:', error)
    res.status(500).json({ error: error.message })
  }
}
