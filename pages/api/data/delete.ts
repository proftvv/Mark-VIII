import type { NextApiRequest, NextApiResponse } from 'next'
import { initDatabase, deleteEncryptedItem } from '@/lib/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID is required' })
  }

  try {
    await initDatabase()
    const changes = await deleteEncryptedItem(parseInt(id))
    if (!changes) {
      return res.status(404).json({ error: 'Item not found' })
    }
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
