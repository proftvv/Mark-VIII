const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

const apiRoutes = {
    path.join('pages', 'api', 'auth', 'register.ts'): `import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { getDatabase } from '@/lib/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  try {
    const db = getDatabase()
    
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
    
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const result = db.prepare(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)'
    ).run(username, hashedPassword)

    res.status(201).json({ success: true, userId: result.lastInsertRowid })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
`,

    path.join('pages', 'api', 'auth', 'login.ts'): `import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { getDatabase } from '@/lib/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  try {
    const db = getDatabase()
    
    const user = db.prepare(
      'SELECT id, username, password_hash FROM users WHERE username = ?'
    ).get(username) as { id: number; username: string; password_hash: string } | undefined

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    res.status(200).json({ 
      success: true, 
      userId: user.id, 
      username: user.username 
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
`,

    path.join('pages', 'api', 'data', 'save.ts'): `import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/lib/database'
import { encryptData } from '@/lib/encryption'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, title, content, password } = req.body

  if (!username || !title || !content || !password) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const db = getDatabase()
    
    const user = db.prepare(
      'SELECT id FROM users WHERE username = ?'
    ).get(username) as { id: number } | undefined

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const encryptedContent = encryptData(content, password)

    const result = db.prepare(
      'INSERT INTO encrypted_data (user_id, title, encrypted_content) VALUES (?, ?, ?)'
    ).run(user.id, title, encryptedContent)

    res.status(201).json({ 
      success: true, 
      id: result.lastInsertRowid 
    })
  } catch (error) {
    console.error('Save error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
`,

    path.join('pages', 'api', 'data', 'list.ts'): `import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/lib/database'

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
    const db = getDatabase()
    
    const user = db.prepare(
      'SELECT id FROM users WHERE username = ?'
    ).get(username) as { id: number } | undefined

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const items = db.prepare(
      'SELECT id, title, encrypted_content, created_at, updated_at FROM encrypted_data WHERE user_id = ? ORDER BY created_at DESC'
    ).all(user.id)

    res.status(200).json({ success: true, items })
  } catch (error) {
    console.error('List error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
`,

    path.join('pages', 'api', 'data', 'delete.ts'): `import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '@/lib/database'

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
    const db = getDatabase()
    
    const result = db.prepare(
      'DELETE FROM encrypted_data WHERE id = ?'
    ).run(parseInt(id))

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' })
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
`
};

Object.entries(apiRoutes).forEach(([filePath, content]) => {
    const fullPath = path.join(baseDir, filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Created: ${filePath}`);
});

console.log('\n✓ API route files created successfully!');
