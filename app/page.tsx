'use client'

import { useState, useEffect } from 'react'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import Dashboard from '@/components/Dashboard'
import UserDashboard from '@/components/UserDashboard'
import TwoFactorVerify from '@/components/TwoFactorVerify'
import TwoFactorSetup from '@/components/TwoFactorSetup'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [userId, setUserId] = useState<number | null>(null)
  const [needs2FA, setNeeds2FA] = useState(false)
  const [show2FASetup, setShow2FASetup] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem('authenticated')
    const user = localStorage.getItem('username')
    const id = localStorage.getItem('userId')
    if (session === 'true' && user && id) {
      setIsAuthenticated(true)
      setUsername(user)
      setUserId(parseInt(id))
    }
  }, [])

  const handleLogin = (user: string, id: number, twoFactorEnabled: boolean) => {
    setUsername(user)
    setUserId(id)
    
    if (twoFactorEnabled) {
      // User has 2FA enabled, show verification
      setNeeds2FA(true)
    } else {
      // No 2FA, set authenticated directly
      setIsAuthenticated(true)
      localStorage.setItem('authenticated', 'true')
      localStorage.setItem('username', user)
      localStorage.setItem('userId', id.toString())
    }
  }

  const handle2FAVerified = () => {
    setNeeds2FA(false)
    setIsAuthenticated(true)
    localStorage.setItem('authenticated', 'true')
    localStorage.setItem('username', username)
    localStorage.setItem('userId', userId?.toString() || '')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUsername('')
    setUserId(null)
    setNeeds2FA(false)
    localStorage.removeItem('authenticated')
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
  }

  const handleRegisterSuccess = () => {
    setShowRegister(false)
  }

  const handle2FASetupComplete = () => {
    setShow2FASetup(false)
  }

  // Show 2FA verification modal if needed
  if (needs2FA && userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <TwoFactorVerify 
          userId={userId} 
          username={username}
          onVerified={handle2FAVerified}
          onCancel={() => {
            setNeeds2FA(false)
            setUsername('')
            setUserId(null)
          }}
        />
      </div>
    )
  }

  // Show 2FA setup modal if needed
  if (show2FASetup && userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <TwoFactorSetup 
          userId={userId} 
          onSuccess={handle2FASetupComplete}
        />
      </div>
    )
  }

  if (isAuthenticated && userId) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="max-w-6xl mx-auto">
          <UserDashboard 
            userId={userId} 
            username={username}
            onLogout={handleLogout}
            onEnable2FA={() => setShow2FASetup(true)}
          />
          <div className="mt-8">
            <Dashboard username={username} onLogout={handleLogout} />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {showRegister ? (
          <RegisterForm 
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <LoginForm 
            onLogin={handleLogin}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    </main>
  )
}
