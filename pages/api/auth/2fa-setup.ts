import { sql } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'
import speakeasy from 'speakeasy'

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
    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `Mark-VIII (${userId})`,
      issuer: 'Mark-VIII',
      length: 32
    })

    // Generate backup codes (8 codes)
    const backupCodes = Array.from({ length: 8 }, () =>
      Math.random().toString(36).substring(2, 10).toUpperCase()
    )

    // Don't save to database yet - user needs to verify first
    res.status(200).json({
      secret: secret.base32,
      qrCode: secret.otpauth_url,
      backupCodes,
      manualKey: secret.base32
    })
  } catch (error: any) {
    console.error('2FA setup error:', error)
    res.status(500).json({ error: error.message })
  }
}
