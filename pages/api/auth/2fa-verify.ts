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

  const { userId, secret, token, backupCodes } = req.body

  if (!userId || !secret || !token || !backupCodes) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    await initDatabase()

    // Verify the TOTP token
    const isValidToken = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2
    })

    if (!isValidToken) {
      return res.status(400).json({ error: 'Invalid verification code' })
    }

    // Save 2FA secret and backup codes to database
    await sql`
      UPDATE users 
      SET 
        two_factor_enabled = TRUE,
        two_factor_secret = ${secret},
        backup_codes = ${JSON.stringify(backupCodes)}
      WHERE id = ${userId}
    `

    res.status(200).json({
      success: true,
      message: '2FA enabled successfully'
    })
  } catch (error: any) {
    console.error('2FA verification error:', error)
    res.status(500).json({ error: error.message })
  }
}
