'use client'

import { useState, useEffect } from 'react'
import TwoFactorManage from './TwoFactorManage'

interface UserDashboardProps {
  username: string
  userId: number
  onLogout: () => void
  twoFactorEnabled: boolean
  onEnable2FA: () => void
}

type MenuSection = 'general' | 'security' | 'activity' | 'delete'

export default function UserDashboard({ 
  username, 
  userId, 
  onLogout,
  twoFactorEnabled,
  onEnable2FA
}: UserDashboardProps) {
  const [activeSection, setActiveSection] = useState<MenuSection>('general')
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [loadingActivity, setLoadingActivity] = useState(false)
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  useEffect(() => {
    if (activeSection === 'activity') {
      loadActivity()
    }
  }, [activeSection])

  const loadActivity = async () => {
    setLoadingActivity(true)
    try {
      const res = await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      const data = await res.json()
      if (res.ok) {
        setActivityLogs(data.logs || [])
      }
    } catch (err) {
      console.error('Failed to load activity:', err)
    } finally {
      setLoadingActivity(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currentPassword, newPassword })
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error)
      }

      setPasswordSuccess('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      setTimeout(() => setPasswordSuccess(''), 3000)
    } catch (err: any) {
      setPasswordError(err.message)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
      return
    }

    const confirmText = prompt('Type "DELETE" to confirm account deletion:')
    if (confirmText !== 'DELETE') {
      alert('Account deletion cancelled')
      return
    }

    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      alert('Account deleted successfully')
      onLogout()
    } catch (err: any) {
      alert('Failed to delete account: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mark-VIII</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{username}</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveSection('general')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeSection === 'general'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Genel</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('security')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeSection === 'security'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Güvenlik</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('activity')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeSection === 'activity'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Aktiviteler</span>
              </div>
            </button>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button
              onClick={() => setActiveSection('delete')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeSection === 'delete'
                  ? 'bg-red-500 text-white'
                  : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Hesabı Sil</span>
              </div>
            </button>

            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Çıkış Yap</span>
              </div>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeSection === 'general' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Hesap Bilgileri</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kullanıcı Adı</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{username}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kullanıcı ID</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">#{userId}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hesap Durumu</p>
                    <p className="text-lg font-semibold text-green-500">Aktif</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Şifreleme</p>
                    <p className="text-lg font-semibold text-blue-500">AES-256</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Güvenlik</h2>
              
              {/* 2FA Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">İki Faktörlü Kimlik Doğrulama</h3>
                <TwoFactorManage 
                  userId={userId}
                  enabled={twoFactorEnabled}
                  onEnable={onEnable2FA}
                />
              </div>

              {/* Password Change */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Şifre Değiştir</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mevcut Şifre
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Yeni Şifre
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                      autoComplete="new-password"
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Yeni Şifre (Tekrar)
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                      autoComplete="new-password"
                      minLength={6}
                    />
                  </div>
                  {passwordError && (
                    <div className="text-red-500 text-sm">{passwordError}</div>
                  )}
                  {passwordSuccess && (
                    <div className="text-green-500 text-sm">{passwordSuccess}</div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Şifreyi Değiştir
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeSection === 'activity' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Hesap Aktiviteleri</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                {loadingActivity ? (
                  <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                ) : activityLogs.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">Henüz aktivite yok.</p>
                ) : (
                  <div className="space-y-3">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white capitalize">{log.action}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            IP: {log.ip_address || 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(log.created_at).toLocaleString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'delete' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Hesabı Sil</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-red-800 dark:text-red-400 mb-2">Dikkat!</h3>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Hesabınızı silmek geri alınamaz bir işlemdir. Tüm verileriniz kalıcı olarak silinecektir:
                      </p>
                      <ul className="text-sm text-red-700 dark:text-red-300 mt-2 ml-4 list-disc space-y-1">
                        <li>Tüm şifrelenmiş verileriniz</li>
                        <li>Aktivite geçmişiniz</li>
                        <li>2FA ayarlarınız</li>
                        <li>Kullanıcı hesabınız</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Hesabımı Kalıcı Olarak Sil
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
