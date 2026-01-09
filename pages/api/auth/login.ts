import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { initDatabase, findUserByUsername } from '@/lib/database'
import { logActivity } from '@/lib/activity'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Initialize database tables on first call
  await initDatabase()

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  try {
    await initDatabase()
    const user = await findUserByUsername(username)

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Log login activity
    const ipAddress = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress
    const userAgent = req.headers['user-agent']
    await logActivity(user.id, 'login', ipAddress, userAgent)

    return res.status(200).json({ 
      success: true, 
      userId: user.id, 
      username: user.username,
      twoFactorEnabled: user.two_factor_enabled
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
