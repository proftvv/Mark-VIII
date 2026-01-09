'use client'

import { useState } from 'react'

interface TwoFactorManageProps {
  userId: number
  enabled: boolean
  onEnable: () => void
}

export default function TwoFactorManage({ userId, enabled, onEnable }: TwoFactorManageProps) {
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [disabling, setDisabling] = useState(false)

  const handleViewBackupCodes = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/view-backup-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token: verificationCode })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setBackupCodes(data.backupCodes)
      setShowBackupCodes(true)
      setVerificationCode('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!confirm('2FA\'yı devre dışı bırakmak istediğinizden emin misiniz?\n\nBu işlem hesabınızı daha az güvenli hale getirecektir.')) {
      return
    }

    setDisabling(true)
    setError('')

    try {
      const res = await fetch('/api/auth/2fa-disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      alert('2FA başarıyla devre dışı bırakıldı')
      window.location.reload()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setDisabling(false)
    }
  }

  if (!enabled) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div>
          <p className="text-gray-900 dark:text-white font-medium">İki Faktörlü Kimlik Doğrulama Kapalı</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Hesabınızı daha güvenli hale getirmek için 2FA'yı etkinleştirin
          </p>
        </div>
        <button
          onClick={onEnable}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
        >
          2FA Etkinleştir
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-gray-900 dark:text-white font-medium">2FA Etkin</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Hesabınız iki faktörlü kimlik doğrulama ile korunuyor</p>
          </div>
        </div>
      </div>

      {/* View Backup Codes */}
      {!showBackupCodes ? (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Yedek Kodları Görüntüle</h4>
          <form onSubmit={handleViewBackupCodes} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Mevcut 2FA kodunuzu girin
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="6 haneli kod"
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                required
                autoComplete="off"
              />
            </div>
            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Doğrulanıyor...' : 'Yedek Kodları Göster'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Yedek Kodlarınız</h4>
            <button
              onClick={() => setShowBackupCodes(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
            Bu kodları güvenli bir yere kaydedin. Her kod sadece bir kez kullanılabilir.
          </p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {backupCodes.map((code, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-3 rounded-lg font-mono text-center text-sm border border-blue-200 dark:border-blue-700"
              >
                {code}
              </div>
            ))}
          </div>
          {backupCodes.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400 py-4">
              Tüm yedek kodlarınız kullanılmış. Lütfen 2FA'yı yeniden yapılandırın.
            </p>
          )}
        </div>
      )}

      {/* Disable 2FA */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
        <button
          onClick={handleDisable2FA}
          disabled={disabling}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {disabling ? 'Devre Dışı Bırakılıyor...' : '2FA\'yı Devre Dışı Bırak'}
        </button>
      </div>
    </div>
  )
}
