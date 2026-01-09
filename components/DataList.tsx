'use client'

import { useState } from 'react'
import { decryptData } from '@/lib/encryption'

interface EncryptedItem {
  id: number
  title: string
  encrypted_content: string
  created_at: string
  updated_at: string
}

interface DataListProps {
  items: EncryptedItem[]
  loading: boolean
  onDelete: (id: number) => void
  onDecrypt: () => void
}

export default function DataList({ items, loading, onDelete }: DataListProps) {
  const [decryptingId, setDecryptingId] = useState<number | null>(null)
  const [decryptPassword, setDecryptPassword] = useState('')
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null)
  const [decryptError, setDecryptError] = useState('')

  const handleDecrypt = (item: EncryptedItem) => {
    setDecryptingId(item.id)
    setDecryptedContent(null)
    setDecryptError('')
    setDecryptPassword('')
  }

  const performDecrypt = (item: EncryptedItem) => {
    try {
      const decrypted = decryptData(item.encrypted_content, decryptPassword)
      if (decrypted) {
        setDecryptedContent(decrypted)
        setDecryptError('')
      } else {
        setDecryptError('Decryption failed - invalid password')
      }
    } catch (err) {
      setDecryptError('Decryption failed - invalid password')
    }
  }

  const handleCancelDecrypt = () => {
    setDecryptingId(null)
    setDecryptedContent(null)
    setDecryptError('')
    setDecryptPassword('')
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Your Encrypted Data
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Your Encrypted Data
      </h2>

      {items.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No encrypted data yet. Create your first encrypted item!
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {item.title}
                </h3>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Created: {new Date(item.created_at).toLocaleString()}
              </p>

              {decryptingId === item.id ? (
                <div className="space-y-3">
                  {!decryptedContent ? (
                    <>
                      <input
                        type="password"
                        value={decryptPassword}
                        onChange={(e) => setDecryptPassword(e.target.value)}
                        placeholder="Enter decryption password"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      {decryptError && (
                        <p className="text-red-500 text-sm">{decryptError}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => performDecrypt(item)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Decrypt
                        </button>
                        <button
                          onClick={handleCancelDecrypt}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                          Decrypted Content:
                        </p>
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                          {decryptedContent}
                        </p>
                      </div>
                      <button
                        onClick={handleCancelDecrypt}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Hide
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleDecrypt(item)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  View Decrypted
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
