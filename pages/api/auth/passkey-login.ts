import type { NextApiRequest, NextApiResponse } from 'next'
import { initDatabase, getPasskeyByCredentialId, findUserById } from '@/lib/database'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Passkey ile giriş (WebAuthn)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  await initDatabase()

  const { credentialId } = req.body

  if (!credentialId) {
    return res.status(400).json({ error: 'Credential ID gerekli' })
  }

  try {
    const passkey = await getPasskeyByCredentialId(credentialId)

    if (!passkey) {
      return res.status(401).json({ error: 'Passkey bulunamadı' })
    }

    // User'ı bul
    const user = await findUserById(passkey.user_id)
    if (!user) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı' })
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      success: true,
      token,
      userId: user.id,
      email: user.email,
      username: user.username
    })
  } catch (error) {
    console.error('Passkey login error:', error)
    return res.status(500).json({ error: 'Passkey giriş hatası' })
  }
}
