import type { NextApiRequest, NextApiResponse } from 'next'
import { initDatabase, getPasskeyByCredentialId } from '@/lib/database'
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

  const { credentialId, clientData, authenticatorData } = req.body

  if (!credentialId) {
    return res.status(400).json({ error: 'Credential ID gerekli' })
  }

  try {
    const passkey = await getPasskeyByCredentialId(credentialId)

    if (!passkey) {
      return res.status(401).json({ error: 'Passkey bulunamadı' })
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: passkey.user_id, method: 'passkey' },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      success: true,
      token,
      userId: passkey.user_id,
      message: 'Passkey ile giriş başarılı'
    })
  } catch (error) {
    console.error('Passkey login error:', error)
    return res.status(500).json({ error: 'Sunucu hatası' })
  }
}
