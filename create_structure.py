import os
import json

# Base directory
base_dir = r'z:\Mark-VIII'

# Directory structure
directories = [
    'app',
    'lib',
    'components',
    'pages/api/auth',
    'pages/api/data',
    'public'
]

# Create directories
for directory in directories:
    dir_path = os.path.join(base_dir, directory)
    os.makedirs(dir_path, exist_ok=True)
    print(f'Created: {directory}')

# File contents
files = {
    'app/globals.css': '''@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
''',

    'app/layout.tsx': '''import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mark-VIII Encryption System',
  description: 'Secure encryption system with biometric authentication',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
''',

    'app/page.tsx': ''''use client'

import { useState, useEffect } from 'react'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const session = sessionStorage.getItem('authenticated')
    const user = sessionStorage.getItem('username')
    if (session === 'true' && user) {
      setIsAuthenticated(true)
      setUsername(user)
    }
  }, [])

  const handleLogin = (user: string) => {
    setIsAuthenticated(true)
    setUsername(user)
    sessionStorage.setItem('authenticated', 'true')
    sessionStorage.setItem('username', user)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUsername('')
    sessionStorage.removeItem('authenticated')
    sessionStorage.removeItem('username')
  }

  const handleRegisterSuccess = () => {
    setShowRegister(false)
  }

  if (isAuthenticated) {
    return <Dashboard username={username} onLogout={handleLogout} />
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {showRegister ? (
          <RegisterForm 
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <LoginForm 
            onLogin={handleLogin}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    </main>
  )
}
''',

    'lib/database.ts': '''import Database from 'better-sqlite3'
import { join } from 'path'

const dbPath = join(process.cwd(), 'data.db')
let db: Database.Database | null = null

export function getDatabase() {
  if (!db) {
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS encrypted_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        encrypted_content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
  }
  
  return db
}

export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}
''',

    'lib/encryption.ts': '''import CryptoJS from 'crypto-js'

export function encryptData(data: string, password: string): string {
  return CryptoJS.AES.encrypt(data, password).toString()
}

export function decryptData(encryptedData: string, password: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, password)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export function generateHash(data: string): string {
  return CryptoJS.SHA256(data).toString()
}
''',

    'lib/biometric.ts': '''export async function checkBiometricAvailability(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  
  if (!window.PublicKeyCredential) {
    return false
  }
  
  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    return available
  } catch (error) {
    console.error('Biometric check failed:', error)
    return false
  }
}

export async function registerBiometric(username: string): Promise<boolean> {
  try {
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)
    
    const publicKeyOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Mark-VIII Encryption",
        id: window.location.hostname
      },
      user: {
        id: new TextEncoder().encode(username),
        name: username,
        displayName: username
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },
        { alg: -257, type: "public-key" }
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required"
      },
      timeout: 60000,
      attestation: "none"
    }
    
    const credential = await navigator.credentials.create({
      publicKey: publicKeyOptions
    })
    
    if (credential) {
      localStorage.setItem(`biometric_${username}`, 'registered')
      return true
    }
    return false
  } catch (error) {
    console.error('Biometric registration failed:', error)
    return false
  }
}

export async function authenticateWithBiometric(username: string): Promise<boolean> {
  try {
    const registered = localStorage.getItem(`biometric_${username}`)
    if (!registered) return false
    
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)
    
    const publicKeyOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      rpId: window.location.hostname,
      timeout: 60000,
      userVerification: "required"
    }
    
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyOptions
    })
    
    return assertion !== null
  } catch (error) {
    console.error('Biometric authentication failed:', error)
    return false
  }
}
'''
}

# Create all files
for file_path, content in files.items():
    full_path = os.path.join(base_dir, file_path)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Created: {file_path}')

print('\nCore files created successfully!')
