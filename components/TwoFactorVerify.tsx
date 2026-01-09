'use client'

import { useState } from 'react'

interface TwoFactorVerifyProps {
  userId: number
  username: string
  onSuccess: () => void
  onCancel: () => void
}

export default function TwoFactorVerify({ userId, username, onSuccess, onCancel }: TwoFactorVerifyProps) {
  const [code, setCode] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/2fa-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token: code, useBackupCode })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">İki Faktörlü Doğrulama</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Merhaba, <span className="font-semibold">{username}</span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {useBackupCode ? 'Yedek Kod' : 'Doğrulama Kodu'}
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={useBackupCode ? '8 haneli yedek kod' : '6 haneli kod'}
                maxLength={useBackupCode ? 8 : 6}
                className="w-full px-4 py-3 text-center text-2xl font-mono border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white tracking-wider"
                required
                autoComplete="off"
                autoFocus
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {useBackupCode 
                  ? 'Yedek kodlarınızdan birini girin' 
                  : 'Authenticator uygulamanızdaki 6 haneli kodu girin'
                }
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || code.length < (useBackupCode ? 8 : 6)}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {loading ? 'Doğrulanıyor...' : 'Doğrula'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">veya</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setUseBackupCode(!useBackupCode)
                setCode('')
                setError('')
              }}
              className="w-full text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              {useBackupCode ? 'Authenticator Kodu Kullan' : 'Yedek Kod Kullan'}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium transition-colors"
            >
              İptal
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Uygulamanıza erişim sağlamıyor musunuz?<br />
            Yedek kodlarınızı kullanın.
          </p>
        </div>
      </div>
    </div>
  )
}
