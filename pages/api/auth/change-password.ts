import { sql } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { initDatabase } from '@/lib/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId, currentPassword, newPassword } = req.body

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  try {
    await initDatabase()

    // Get current password hash
    const result = await sql`
      SELECT password_hash FROM users WHERE id = ${userId}
    `

    if (!result.rows.length) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, result.rows[0].password_hash)
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10)

    // Update password
    await sql`
      UPDATE users SET password_hash = ${newHash} WHERE id = ${userId}
    `

    res.status(200).json({ success: true, message: 'Password changed successfully' })
  } catch (error: any) {
    console.error('Password change error:', error)
    res.status(500).json({ error: error.message })
  }
}
