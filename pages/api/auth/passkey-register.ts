import type { NextApiRequest, NextApiResponse } from 'next'
import { initDatabase, addPasskey } from '@/lib/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  await initDatabase()

  const { userId, credential } = req.body

  if (!userId || !credential) {
    return res.status(400).json({ error: 'User ID ve credential gerekli' })
  }

  try {
    const credentialId = credential.id || credential.rawId
    const publicKey = credential.response?.publicKey || JSON.stringify(credential.response)

    await addPasskey(userId, credentialId, publicKey)

    return res.status(200).json({
      success: true,
      message: 'Passkey başarıyla kaydedildi'
    })
  } catch (error) {
    console.error('Passkey register error:', error)
    return res.status(500).json({ error: 'Sunucu hatası' })
  }
}
