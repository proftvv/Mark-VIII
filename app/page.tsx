'use client'

import { useState, useEffect } from 'react'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const session = sessionStorage.getItem('authenticated')
    const user = sessionStorage.getItem('username')
    if (session === 'true' && user) {
      setIsAuthenticated(true)
      setUsername(user)
    }
  }, [])

  const handleLogin = (user: string) => {
    setIsAuthenticated(true)
    setUsername(user)
    sessionStorage.setItem('authenticated', 'true')
    sessionStorage.setItem('username', user)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUsername('')
    sessionStorage.removeItem('authenticated')
    sessionStorage.removeItem('username')
  }

  const handleRegisterSuccess = () => {
    setShowRegister(false)
  }

  if (isAuthenticated) {
    return <Dashboard username={username} onLogout={handleLogout} />
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
