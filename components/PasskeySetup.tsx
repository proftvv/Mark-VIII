'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PasskeySetupProps {
  userId: number
  onSuccess: () => void
}

export default function PasskeySetup({ userId, onSuccess }: PasskeySetupProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSetupPasskey = async () => {
    if (!window.PublicKeyCredential) {
      setMessage({ type: 'error', text: 'Passkey bu cihazda desteklenmiyor' })
      return
    }

    setIsLoading(true)
    try {
      // WebAuthn API ile passkey oluştur
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rp: {
            name: 'Mark VIII',
            id: window.location.hostname
          },
          user: {
            id: crypto.getRandomValues(new Uint8Array(16)),
            name: `user-${userId}`,
            displayName: `User ${userId}`
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' },
            { alg: -257, type: 'public-key' }
          ],
          timeout: 60000,
          attestation: 'direct',
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            residentKey: 'preferred'
          }
        }
      })

      if (!credential) {
        setMessage({ type: 'error', text: 'Passkey oluşturulamadı' })
        return
      }

      // Server'a gönder
      const response = await fetch('/api/auth/passkey-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          credential: credential.toJSON()
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Passkey başarıyla oluşturuldu! Artık şifre olmadan giriş yapabilirsiniz.' })
        setTimeout(onSuccess, 1500)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Passkey kaydı başarısız' })
      }
    } catch (error: any) {
      console.error('Passkey setup error:', error)
      setMessage({ type: 'error', text: error.message || 'Passkey oluşturmada hata oluştu' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Passkey Nedir?</h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Passkey, yüz tanıma veya parmak izi gibi biyometrik veriler veya PIN kullanarak güvenli giriş yapar. Daha güvenli ve hızlı bir yöntemdir.
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        onClick={handleSetupPasskey}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
      >
        {isLoading ? 'Passkey Oluşturuluyor...' : 'Passkey Oluştur'}
      </button>
    </div>
  )
}
