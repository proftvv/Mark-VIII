import type { NextApiRequest, NextApiResponse } from 'next'
import { initDatabase, findUserByEmailOrUsername, insertEncryptedData } from '@/lib/database'
import { encryptData } from '@/lib/encryption'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Initialize database tables on first call
  await initDatabase()

  const { username, title, content, password } = req.body

  if (!username || !title || !content || !password) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    await initDatabase()
    const user = await findUserByEmailOrUsername(username)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const encryptedContent = encryptData(content, password)
    const id = await insertEncryptedData(user.id, title, encryptedContent)

    return res.status(201).json({ success: true, id })
  } catch (error) {
    console.error('Save error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
