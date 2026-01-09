'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface UserDashboardProps {
  userId: number
  username: string
}

interface ActivityLog {
  id: number
  action: string
  created_at: string
  ip_address?: string
}

export default function UserDashboard({ userId, username }: UserDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'activity'>('overview')
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(false)

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

  const handleLogout = async () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    router.push('/login')
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome, {username}</h2>
          <p className="text-slate-400 text-sm">User ID: {userId}</p>
        </div>
        <button
          onClick={handleLogout}
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
              <p>Account Type: <span className="text-green-400">Premium</span></p>
              <p>Encryption: <span className="text-green-400">AES-256</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Security Settings</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-300">Two-Factor Authentication</span>
                <span className="text-yellow-400">Enable</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-300">Password</span>
                <span className="text-cyan-400 cursor-pointer hover:underline">Change</span>
              </div>
            </div>
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
