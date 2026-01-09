import { sql } from '@vercel/postgres'

export async function initDatabase() {
  // Create tables if they don't exist (Postgres)
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  await sql`
    CREATE TABLE IF NOT EXISTS encrypted_data (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      encrypted_content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
}

export async function findUserByUsername(username: string) {
  const { rows } = await sql<{
    id: number
    username: string
    password_hash: string
  }>`SELECT id, username, password_hash FROM users WHERE username = ${username} LIMIT 1;`
  return rows[0] || null
}

export async function createUser(username: string, passwordHash: string) {
  const { rows } = await sql<{ id: number }>`
    INSERT INTO users (username, password_hash)
    VALUES (${username}, ${passwordHash})
    RETURNING id;
  `
  return rows[0]?.id
}

export async function insertEncryptedData(userId: number, title: string, encryptedContent: string) {
  const { rows } = await sql<{ id: number }>`
    INSERT INTO encrypted_data (user_id, title, encrypted_content)
    VALUES (${userId}, ${title}, ${encryptedContent})
    RETURNING id;
  `
  return rows[0]?.id
}

export async function listEncryptedData(userId: number) {
  const { rows } = await sql<{
    id: number
    title: string
    encrypted_content: string
    created_at: string
    updated_at: string
  }>`
    SELECT id, title, encrypted_content, created_at, updated_at
    FROM encrypted_data
    WHERE user_id = ${userId}
    ORDER BY created_at DESC;
  `
  return rows
}

export async function deleteEncryptedItem(id: number) {
  const result = await sql`DELETE FROM encrypted_data WHERE id = ${id};`
  return result.rowCount || 0
}
