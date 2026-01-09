'use client'

import { useState, useEffect } from 'react'

export default function DownloadButton() {
  const [downloadUrl, setDownloadUrl] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [tempUrl, setTempUrl] = useState('')

  useEffect(() => {
    // Load APK URL from localStorage
    const savedUrl = localStorage.getItem('apk_download_url')
    if (savedUrl) {
      setDownloadUrl(savedUrl)
    }
  }, [])

  const handleSaveUrl = () => {
    localStorage.setItem('apk_download_url', tempUrl)
    setDownloadUrl(tempUrl)
    setShowUrlInput(false)
    alert('APK linki kaydedildi!')
  }

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
    } else {
      alert('APK henüz hazır değil. Lütfen daha sonra tekrar deneyin.')
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
        {/* APK Download Button */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="font-semibold">APK İndir</span>
        </button>

        {/* Admin Link Set Button (Long press to show) */}
        <button
          onContextMenu={(e) => {
            e.preventDefault()
            setShowUrlInput(true)
            setTempUrl(downloadUrl)
          }}
          className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 text-center"
        >
          {downloadUrl ? '✓ Link ayarlandı' : '⚙ Link ayarla (sağ tıkla)'}
        </button>
      </div>

      {/* URL Input Modal */}
      {showUrlInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              APK İndirme Linkini Ayarla
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Drive / Direkt İndirme Linki
                </label>
                <input
                  type="url"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Google Drive linkini "Paylaş" → "Linki olan herkes" yaparak ekleyin
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveUrl}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Kaydet
                </button>
                <button
                  onClick={() => setShowUrlInput(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
