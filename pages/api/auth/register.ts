import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { initDatabase, findUserByEmailOrUsername, createUser } from '@/lib/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  await initDatabase()

  // Email + Username + Password ile kayıt
  const { email, username, password } = req.body

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, kullanıcı adı ve şifre gerekli' })
  }

  // Validation
  if (password.length < 8) {
    return res.status(400).json({ error: 'Şifre en az 8 karakter olmalı' })
  }

  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: 'Kullanıcı adı 3-20 karakter arası olmalı' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Geçerli bir email adresi girin' })
  }

  try {
    // Kontrolü email veya username zaten var mı
    const existing = await findUserByEmailOrUsername(email)
    if (existing && existing.email === email) {
      return res.status(400).json({ error: 'Bu email zaten kayıtlı' })
    }

    const existingUsername = await findUserByEmailOrUsername(username)
    if (existingUsername && existingUsername.username === username) {
      return res.status(400).json({ error: 'Bu kullanıcı adı zaten alınmış' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = await createUser(email, username, hashedPassword)

    return res.status(201).json({ 
      success: true, 
      userId, 
      email,
      username
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ error: 'Kayıt sırasında hata oluştu' })
  }
}
