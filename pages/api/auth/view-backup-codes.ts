import { sql } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'
import speakeasy from 'speakeasy'
import { initDatabase } from '@/lib/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId, token } = req.body

  if (!userId || !token) {
    return res.status(400).json({ error: 'userId and token required' })
  }

  try {
    await initDatabase()

    // Get user's 2FA data
    const result = await sql`
      SELECT two_factor_secret, backup_codes, two_factor_enabled
      FROM users
      WHERE id = ${userId}
    `

    if (!result.rows.length || !result.rows[0].two_factor_enabled) {
      return res.status(400).json({ error: '2FA not enabled for this user' })
    }

    const { two_factor_secret, backup_codes } = result.rows[0]

    // Verify TOTP token
    const isValid = speakeasy.totp.verify({
      secret: two_factor_secret,
      encoding: 'base32',
      token,
      window: 2
    })

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid verification code' })
    }

    // Return backup codes
    res.status(200).json({
      success: true,
      backupCodes: backup_codes || []
    })
  } catch (error: any) {
    console.error('View backup codes error:', error)
    res.status(500).json({ error: error.message })
  }
}
