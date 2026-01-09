'use client'

import { useState } from 'react'

interface TwoFactorVerifyProps {
  userId: number
  username: string
  onVerified: () => void
  onCancel: () => void
}

export default function TwoFactorVerify({ userId, username, onVerified, onCancel }: TwoFactorVerifyProps) {
  const [code, setCode] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = async () => {
    if (!code) {
      setError('Please enter verification code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/2fa-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          token: code,
          useBackupCode
        })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      onVerified()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">Two-Factor Authentication</h2>
        <p className="text-slate-400 mb-6">Enter your 6-digit code or backup code</p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={useBackupCode ? "XXXXXXXX" : "000000"}
          maxLength={useBackupCode ? 8 : 6}
          autoComplete="off"
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-center text-2xl tracking-wider mb-4"
        />

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="backup"
            checked={useBackupCode}
            onChange={(e) => {
              setUseBackupCode(e.target.checked)
              setCode('')
            }}
            className="w-4 h-4 accent-cyan-500"
          />
          <label htmlFor="backup" className="ml-2 text-sm text-slate-300">
            Use backup code instead
          </label>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-slate-300 hover:text-white border border-slate-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={loading || !code}
            className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>
    </div>
  )
}
