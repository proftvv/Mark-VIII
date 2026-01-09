'use client'

import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface TwoFactorSetupProps {
  userId: number
  onSuccess: () => void
}

export default function TwoFactorSetup({ userId, onSuccess }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [secret, setSecret] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verifyCode, setVerifyCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Generate QR code when canvas and qrUrl are ready
    if (canvasRef.current && secret && step === 'verify') {
      const otpauthUrl = `otpauth://totp/Mark-VIII:${userId}?secret=${secret}&issuer=Mark-VIII`
      QRCode.toCanvas(canvasRef.current, otpauthUrl, { width: 200 }, (err) => {
        if (err) console.error('QR code generation error:', err)
      })
    }
  }, [secret, step, userId])

  const handleRequestSetup = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/2fa-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setSecret(data.secret)
      setBackupCodes(data.backupCodes)
      setStep('verify')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/2fa-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          secret,
          token: verifyCode,
          backupCodes
        })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      window.showToast('2FA başarıyla etkinleştirildi! Yedek kodlarınızı güvenli bir yere kaydedin.', 'success')
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'request') {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-semibold mb-4 text-cyan-400">Enable Two-Factor Authentication</h3>
        <p className="text-slate-300 mb-4">
          Add an extra layer of security to your account. You'll need an authenticator app like Authy or Google Authenticator.
        </p>
        <button
          onClick={handleRequestSetup}
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Start Setup'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-semibold mb-4 text-cyan-400">Scan QR Code</h3>
      
      <div className="bg-white p-4 rounded-lg mb-4 inline-block">
        <canvas ref={canvasRef} />
      </div>

      <div className="mb-4 p-4 bg-slate-900 rounded-lg">
        <p className="text-sm text-slate-400 mb-2">Or enter this key manually:</p>
        <code className="text-cyan-400 font-mono break-all">{secret}</code>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Enter 6-digit code from your authenticator app:
        </label>
        <input
          type="text"
          value={verifyCode}
          onChange={(e) => setVerifyCode(e.target.value)}
          maxLength={6}
          placeholder="000000"
          autoComplete="off"
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500"
        />
      </div>

      {!showBackupCodes && (
        <button
          onClick={() => setShowBackupCodes(true)}
          className="text-cyan-400 text-sm mb-4 hover:underline"
        >
          Show Backup Codes
        </button>
      )}

      {showBackupCodes && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">Save these backup codes in a safe place:</p>
          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((code) => (
              <code key={code} className="text-red-400 font-mono text-sm">
                {code}
              </code>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setStep('request')}
          className="px-4 py-2 text-slate-300 hover:text-white"
        >
          Back
        </button>
        <button
          onClick={handleVerify}
          disabled={loading || verifyCode.length !== 6}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify & Enable'}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
