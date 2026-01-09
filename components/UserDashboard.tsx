'use client'

import { useState, useEffect } from 'react'

interface UserDashboardProps {
  userId: number
  username: string
  onLogout: () => void
  onEnable2FA: () => void
}

interface ActivityLog {
  id: number
  action: string
  created_at: string
  ip_address?: string
}

export default function UserDashboard({ userId, username, onLogout, onEnable2FA }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'activity'>('overview')
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Password change states
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'activity') {
      fetchActivityLogs()
    }
  }, [activeTab])

  const fetchActivityLogs = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/activity?userId=${userId}`)
      const data = await res.json()
      setActivityLogs(data)
    } catch (error) {
      console.error('Failed to fetch activity logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setPasswordLoading(true)

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          currentPassword,
          newPassword
        })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setSuccess('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This cannot be undone. All your data will be deleted.')) {
      return
    }

    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      alert('Account deleted. Logging out...')
      onLogout()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome, {username}</h2>
          <p className="text-slate-400 text-sm">User ID: {userId}</p>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-700">
        {['overview', 'security', 'activity'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Account Information</h3>
            <div className="space-y-2 text-slate-300">
              <p>Username: <span className="text-cyan-400 font-mono">{username}</span></p>
              <p>Account Status: <span className="text-green-400">Active</span></p>
              <p>Encryption: <span className="text-green-400">AES-256</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          {success && <div className="p-3 bg-green-900/30 border border-green-700 rounded text-green-400 text-sm">{success}</div>}
          {error && <div className="p-3 bg-red-900/30 border border-red-700 rounded text-red-400 text-sm">{error}</div>}

          <div className="bg-slate-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Security Settings</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-300">Two-Factor Authentication</span>
                <button
                  onClick={onEnable2FA}
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                >
                  Enable
                </button>
              </div>

              {!showPasswordForm ? (
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                  <span className="text-slate-300">Password</span>
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-slate-800 rounded border border-slate-700">
                  <p className="text-slate-300 font-medium mb-3">Change Password</p>
                  <div className="space-y-2">
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 text-sm"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 text-sm"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowPasswordForm(false)
                          setError('')
                        }}
                        className="flex-1 px-3 py-2 text-slate-300 hover:text-white border border-slate-600 rounded text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleChangePassword}
                        disabled={passwordLoading}
                        className="flex-1 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm disabled:opacity-50"
                      >
                        {passwordLoading ? 'Updating...' : 'Update'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
            <p className="text-slate-400 text-sm mb-3">Permanently delete your account and all associated data</p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div>
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">Recent Activity</h3>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : activityLogs.length === 0 ? (
            <p className="text-slate-400">No recent activity</p>
          ) : (
            <div className="space-y-2">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex justify-between items-center p-3 bg-slate-900 rounded">
                  <span className="text-slate-300">{log.action}</span>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                    {log.ip_address && (
                      <p className="text-slate-500 text-xs">{log.ip_address}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
