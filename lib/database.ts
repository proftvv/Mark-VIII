import { sql } from '@vercel/postgres'

let isInitialized = false

export async function initDatabase() {
  // Initialize ONCE - Never drop users table
  if (isInitialized) return
  
  try {
    // Create users table if not exists - PERSISTENT
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        has_passkey BOOLEAN DEFAULT FALSE,
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        two_factor_secret TEXT,
        backup_codes TEXT[],
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Add email column if it doesn't exist (for existing databases)
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'email'
        ) THEN
          ALTER TABLE users ADD COLUMN email VARCHAR(255) UNIQUE;
        END IF;
        
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'has_passkey'
        ) THEN
          ALTER TABLE users ADD COLUMN has_passkey BOOLEAN DEFAULT FALSE;
        END IF;
      END $$;
    `

    // Create passkeys table
    await sql`
      CREATE TABLE IF NOT EXISTS passkeys (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        credential_id VARCHAR(500) UNIQUE NOT NULL,
        public_key TEXT NOT NULL,
        sign_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT passkeys_user_id_fkey 
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `

    // Create encrypted_data table
    await sql`
      CREATE TABLE IF NOT EXISTS encrypted_data (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        encrypted_content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT encrypted_data_user_id_fkey 
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `

    // Create activity_log table
    await sql`
      CREATE TABLE IF NOT EXISTS activity_log (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT activity_log_user_id_fkey 
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `
    
    isInitialized = true
    console.log('✅ Database initialized (Users table PERSISTENT)')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

// Email veya Username ile kullanıcı bul
export async function findUserByEmailOrUsername(identifier: string) {
  const { rows } = await sql<{
    id: number
    email: string
    username: string
    password_hash: string
    has_passkey: boolean
    two_factor_enabled: boolean
    two_factor_secret: string | null
    backup_codes: string[] | null
    last_login: Date | null
  }>`
    SELECT id, email, username, password_hash, has_passkey, two_factor_enabled, 
           two_factor_secret, backup_codes, last_login 
    FROM users 
    WHERE email = ${identifier} OR username = ${identifier} 
    LIMIT 1;
  `
  return rows[0] || null
}

// ID ile kullanıcı bul
export async function findUserById(id: number) {
  const { rows } = await sql<{
    id: number
    email: string
    username: string
    password_hash: string
    has_passkey: boolean
    two_factor_enabled: boolean
    two_factor_secret: string | null
    backup_codes: string[] | null
    last_login: Date | null
  }>`
    SELECT id, email, username, password_hash, has_passkey, two_factor_enabled, 
           two_factor_secret, backup_codes, last_login 
    FROM users 
    WHERE id = ${id} 
    LIMIT 1;
  `
  return rows[0] || null
}

// Yeni kullanıcı oluştur (email + username + password)
export async function createUser(email: string, username: string, passwordHash: string) {
  const { rows } = await sql<{ id: number }>`
    INSERT INTO users (email, username, password_hash)
    VALUES (${email}, ${username}, ${passwordHash})
    RETURNING id;
  `
  return rows[0]?.id
}

// Passkey ekle
export async function addPasskey(userId: number, credentialId: string, publicKey: string) {
  const { rows } = await sql<{ id: number }>`
    INSERT INTO passkeys (user_id, credential_id, public_key)
    VALUES (${userId}, ${credentialId}, ${publicKey})
    RETURNING id;
  `
  
  // Mark user as having passkey
  await sql`UPDATE users SET has_passkey = true WHERE id = ${userId};`
  
  return rows[0]?.id
}

// Passkey ile giriş
export async function getPasskeyByCredentialId(credentialId: string) {
  const { rows } = await sql<{
    id: number
    user_id: number
    public_key: string
    sign_count: number
  }>`
    SELECT id, user_id, public_key, sign_count 
    FROM passkeys 
    WHERE credential_id = ${credentialId} 
    LIMIT 1;
  `
  return rows[0] || null
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

// Activity logging
export async function logActivity(userId: number, action: string, ipAddress?: string, userAgent?: string) {
  await sql`
    INSERT INTO activity_log (user_id, action, ip_address, user_agent)
    VALUES (${userId}, ${action}, ${ipAddress || null}, ${userAgent || null});
  `
}
