'use client'

import { useState, useEffect } from 'react'
import EncryptionPanel from './EncryptionPanel'
import DataList from './DataList'

interface DashboardProps {
  username: string
  onLogout: () => void
}

interface EncryptedItem {
  id: number
  title: string
  encrypted_content: string
  created_at: string
  updated_at: string
}

export default function Dashboard({ username, onLogout }: DashboardProps) {
  const [items, setItems] = useState<EncryptedItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadItems = async () => {
    try {
      const response = await fetch(`/api/data/list?username=${username}`)
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (err) {
      console.error('Failed to load items:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [username])

  const handleItemSaved = () => {
    loadItems()
  }

  const handleItemDeleted = async (id: number) => {
    try {
      const response = await fetch(`/api/data/delete?id=${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        loadItems()
      }
    } catch (err) {
      console.error('Failed to delete item:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Mark-VIII Encryption
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {username}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EncryptionPanel username={username} onSave={handleItemSaved} />
          <DataList items={items} loading={loading} onDelete={handleItemDeleted} onDecrypt={() => {}} />
        </div>
      </div>
    </div>
  )
}
