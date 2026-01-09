import type { NextApiRequest, NextApiResponse } from 'next'
import { initDatabase, findUserByUsername, listEncryptedData } from '@/lib/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username } = req.query

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' })
  }

  try {
    await initDatabase()
    const user = await findUserByUsername(username)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const items = await listEncryptedData(user.id)
    return res.status(200).json({ success: true, items })
  } catch (error) {
    console.error('List error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
