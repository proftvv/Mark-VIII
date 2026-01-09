const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const componentsDir = path.join(baseDir, 'components');

if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
}

const components = {
    'LoginForm.tsx': `'use client'

import { useState } from 'react'
import { checkBiometricAvailability, authenticateWithBiometric } from '@/lib/biometric'

interface LoginFormProps {
  onLogin: (username: string) => void
  onSwitchToRegister: () => void
}

export default function LoginForm({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [biometricAvailable, setBiometricAvailable] = useState(false)

  useState(() => {
    checkBiometricAvailability().then(setBiometricAvailable)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok) {
        onLogin(username)
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleBiometricLogin = async () => {
    if (!username) {
      setError('Please enter username first')
      return
    }

    setLoading(true)
    setError('')

    try {
      const success = await authenticateWithBiometric(username)
      if (success) {
        onLogin(username)
      } else {
        setError('Biometric authentication failed')
      }
    } catch (err) {
      setError('Biometric authentication error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Mark-VIII Encryption
      </h1>
      <h2 className="text-xl font-semibold text-center mb-6 text-gray-600 dark:text-gray-300">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {biometricAvailable && (
          <button
            type="button"
            onClick={handleBiometricLogin}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            Login with Biometric
          </button>
        )}
      </form>

      <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Register
        </button>
      </p>
    </div>
  )
}
`,

    'RegisterForm.tsx': `'use client'

import { useState } from 'react'
import { checkBiometricAvailability, registerBiometric } from '@/lib/biometric'

interface RegisterFormProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [enableBiometric, setEnableBiometric] = useState(false)
  const [biometricAvailable, setBiometricAvailable] = useState(false)

  useState(() => {
    checkBiometricAvailability().then(setBiometricAvailable)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok) {
        if (enableBiometric && biometricAvailable) {
          await registerBiometric(username)
        }
        alert('Registration successful! Please login.')
        onSuccess()
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Mark-VIII Encryption
      </h1>
      <h2 className="text-xl font-semibold text-center mb-6 text-gray-600 dark:text-gray-300">
        Register
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {biometricAvailable && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="biometric"
              checked={enableBiometric}
              onChange={(e) => setEnableBiometric(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="biometric" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Enable biometric authentication
            </label>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Login
        </button>
      </p>
    </div>
  )
}
`,

    'Dashboard.tsx': `'use client'

import { useState, useEffect } from 'react'
import EncryptionPanel from './EncryptionPanel'
import DataList from './DataList'

interface DashboardProps {
  username: string
  onLogout: () => void
}

interface EncryptedItem {
  id: number
  title: string
  encrypted_content: string
  created_at: string
  updated_at: string
}

export default function Dashboard({ username, onLogout }: DashboardProps) {
  const [items, setItems] = useState<EncryptedItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadItems = async () => {
    try {
      const response = await fetch(\`/api/data/list?username=\${username}\`)
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (err) {
      console.error('Failed to load items:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [username])

  const handleItemSaved = () => {
    loadItems()
  }

  const handleItemDeleted = async (id: number) => {
    try {
      const response = await fetch(\`/api/data/delete?id=\${id}\`, {
        method: 'DELETE'
      })
      if (response.ok) {
        loadItems()
      }
    } catch (err) {
      console.error('Failed to delete item:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Mark-VIII Encryption
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {username}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EncryptionPanel username={username} onSave={handleItemSaved} />
          <DataList items={items} loading={loading} onDelete={handleItemDeleted} onDecrypt={() => {}} />
        </div>
      </div>
    </div>
  )
}
`,

    'EncryptionPanel.tsx': `'use client'

import { useState } from 'react'

interface EncryptionPanelProps {
  username: string
  onSave: () => void
}

export default function EncryptionPanel({ username, onSave }: EncryptionPanelProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleEncrypt = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/data/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, title, content, password })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Data encrypted and saved successfully!')
        setTitle('')
        setContent('')
        setPassword('')
        onSave()
      } else {
        setError(data.error || 'Failed to save data')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Encrypt Data
      </h2>

      <form onSubmit={handleEncrypt} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content to Encrypt
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Encryption Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This password will be needed to decrypt the data later
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-500 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Encrypting...' : 'Encrypt & Save'}
        </button>
      </form>
    </div>
  )
}
`,

    'DataList.tsx': `'use client'

import { useState } from 'react'
import { decryptData } from '@/lib/encryption'

interface EncryptedItem {
  id: number
  title: string
  encrypted_content: string
  created_at: string
  updated_at: string
}

interface DataListProps {
  items: EncryptedItem[]
  loading: boolean
  onDelete: (id: number) => void
  onDecrypt: () => void
}

export default function DataList({ items, loading, onDelete }: DataListProps) {
  const [decryptingId, setDecryptingId] = useState<number | null>(null)
  const [decryptPassword, setDecryptPassword] = useState('')
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null)
  const [decryptError, setDecryptError] = useState('')

  const handleDecrypt = (item: EncryptedItem) => {
    setDecryptingId(item.id)
    setDecryptedContent(null)
    setDecryptError('')
    setDecryptPassword('')
  }

  const performDecrypt = (item: EncryptedItem) => {
    try {
      const decrypted = decryptData(item.encrypted_content, decryptPassword)
      if (decrypted) {
        setDecryptedContent(decrypted)
        setDecryptError('')
      } else {
        setDecryptError('Decryption failed - invalid password')
      }
    } catch (err) {
      setDecryptError('Decryption failed - invalid password')
    }
  }

  const handleCancelDecrypt = () => {
    setDecryptingId(null)
    setDecryptedContent(null)
    setDecryptError('')
    setDecryptPassword('')
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Your Encrypted Data
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Your Encrypted Data
      </h2>

      {items.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No encrypted data yet. Create your first encrypted item!
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {item.title}
                </h3>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Created: {new Date(item.created_at).toLocaleString()}
              </p>

              {decryptingId === item.id ? (
                <div className="space-y-3">
                  {!decryptedContent ? (
                    <>
                      <input
                        type="password"
                        value={decryptPassword}
                        onChange={(e) => setDecryptPassword(e.target.value)}
                        placeholder="Enter decryption password"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      {decryptError && (
                        <p className="text-red-500 text-sm">{decryptError}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => performDecrypt(item)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Decrypt
                        </button>
                        <button
                          onClick={handleCancelDecrypt}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                          Decrypted Content:
                        </p>
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                          {decryptedContent}
                        </p>
                      </div>
                      <button
                        onClick={handleCancelDecrypt}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Hide
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleDecrypt(item)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  View Decrypted
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
`
};

Object.entries(components).forEach(([filename, content]) => {
    const filePath = path.join(componentsDir, filename);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Created: components/${filename}`);
});

console.log('\n✓ Component files created successfully!');
