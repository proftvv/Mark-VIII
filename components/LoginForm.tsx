'use client'

import { useState } from 'react'

interface LoginFormProps {
  onLogin: (username: string, userId: number, twoFactorEnabled: boolean, token: string) => void
  onSwitchToRegister: () => void
}

export default function LoginForm({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('') // Email veya Username
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      })

      const data = await response.json()

      if (response.ok) {
        // Store user info including token
        localStorage.setItem('userId', data.userId)
        localStorage.setItem('username', data.username)
        localStorage.setItem('email', data.email)
        localStorage.setItem('token', data.token)
        localStorage.setItem('hasPasskey', data.hasPasskey ? 'true' : 'false')
        localStorage.setItem('twoFactorEnabled', data.twoFactorEnabled ? 'true' : 'false')
        
        onLogin(data.username, data.userId, data.twoFactorEnabled, data.token)
      } else {
        setError(data.error || 'Giriş başarısız')
      }
    } catch (err) {
      setError('Ağ bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  const handlePasskeyLogin = async () => {
    setError('')
    setLoading(true)

    try {
      if (!window.PublicKeyCredential) {
        setError('Passkey bu cihazda desteklenmiyor')
        return
      }

      // WebAuthn ile giriş (basit versiyon)
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          timeout: 60000,
          userVerification: 'preferred'
        }
      }) as any

      if (!credential) {
        setError('Passkey bulunamadı')
        return
      }

      const response = await fetch('/api/auth/passkey-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credentialId: credential.id,
          clientData: credential.response?.clientDataJSON,
          authenticatorData: credential.response?.authenticatorData
        })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.userId)
        alert('✅ Passkey ile giriş başarılı')
        window.location.href = '/app'
      } else {
        setError(data.error || 'Passkey giriş başarısız')
      }
    } catch (err: any) {
      console.error('Passkey login error:', err)
      setError('Passkey hatası: ' + (err.message || 'Bilinmeyen hata'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">
        Mark VIII
      </h1>
      <h2 className="text-lg font-semibold text-center mb-6 text-gray-600 dark:text-gray-300">
        Güvenli Giriş
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email veya Kullanıcı Adı
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            placeholder="ornek@email.com veya ornek"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Şifre
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Şifrenizi girin"
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
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>

        <button
          type="button"
          onClick={handlePasskeyLogin}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Passkey ile Giriş
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600 dark:text-gray-400 text-sm">
        Hesabınız yok mu?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Hesap Oluştur
        </button>
      </p>
    </div>
  )
}
