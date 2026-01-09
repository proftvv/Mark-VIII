import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { initDatabase, findUserByEmailOrUsername, logActivity } from '@/lib/database'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  await initDatabase()

  // Email veya Username + Password ile giriş
  const { identifier, password } = req.body

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Email/Username ve şifre gerekli' })
  }

  try {
    const user = await findUserByEmailOrUsername(identifier)

    if (!user) {
      return res.status(401).json({ error: 'Geçersiz kimlik bilgileri' })
    }

    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return res.status(401).json({ error: 'Geçersiz kimlik bilgileri' })
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Activity log
    const ipAddress = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress
    const userAgent = req.headers['user-agent']
    await logActivity(user.id, 'login', ipAddress, userAgent)

    return res.status(200).json({ 
      success: true,
      token,
      userId: user.id, 
      email: user.email,
      username: user.username,
      hasPasskey: user.has_passkey,
      twoFactorEnabled: user.two_factor_enabled
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Sunucu hatası' })
  }
}
