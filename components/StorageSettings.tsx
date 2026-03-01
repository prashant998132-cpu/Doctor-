'use client'
import { useState, useEffect } from 'react'
import { HardDrive, Database } from 'lucide-react'
import { storageManager } from '@/lib/storage'

export function StorageSettings() {
  const [stats, setStats] = useState<any>(null)
  const [storageMode, setStorageMode] = useState<'localStorage' | 'indexeddb' | 'hybrid'>('hybrid')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      const s = await storageManager.getStorageStats()
      setStats(s)
      setLoading(false)
    }
    loadStats()
  }, [])

  const handleModeChange = async (mode: 'localStorage' | 'indexeddb' | 'hybrid') => {
    setStorageMode(mode)
    // Storage mode is set in storageManager config
    localStorage.setItem('jarvis_storage_mode', mode)
  }

  const handleExport = async () => {
    const data = await storageManager.exportAllData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jarvis-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const success = await storageManager.importData(text)
    if (success) {
      alert('✅ Data imported successfully! Please refresh the page.')
    } else {
      alert('❌ Import failed. Check file format.')
    }
  }

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading storage info...</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-sm">💾 Storage Management</h3>

      {/* Storage Stats */}
      {stats && (
        <div className="space-y-3">
          {/* localStorage Stats */}
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive size={16} className="text-blue-400" />
              <span className="text-sm font-semibold text-white">Local Storage</span>
            </div>
            <div className="ml-6 space-y-1">
              <div className="text-xs text-gray-400">
                {(stats.localStorage.used / 1024 / 1024).toFixed(2)} MB / {(stats.localStorage.limit / 1024 / 1024).toFixed(0)} MB
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    stats.localStorage.percent > 80 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(stats.localStorage.percent, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">
                {Math.round(stats.localStorage.percent)}% used
              </div>
            </div>
          </div>

          {/* IndexedDB Stats */}
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Database size={16} className="text-purple-400" />
              <span className="text-sm font-semibold text-white">IndexedDB (Unlimited)</span>
            </div>
            <div className="ml-6">
              <div className="text-xs text-gray-400">
                ~{(stats.indexedDB.estimated / 1024).toFixed(2)} MB (Estimated)
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ✅ Unlimited storage, no quota
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Storage Mode Selection */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400 block">Storage Mode</label>
        <div className="space-y-2">
          {(['localStorage', 'indexeddb', 'hybrid'] as const).map(mode => (
            <label key={mode} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-white/5 transition">
              <input
                type="radio"
                name="storage-mode"
                value={mode}
                checked={storageMode === mode}
                onChange={(e) => handleModeChange(e.target.value as any)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-300">
                {mode === 'localStorage' && '💾 Local Storage (Fast, 5-10MB limit)'}
                {mode === 'indexeddb' && '🗄️ IndexedDB (Unlimited, unlimited)'}
                {mode === 'hybrid' && '⚡ Hybrid (Smart fallback, recommended)'}
              </span>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {storageMode === 'hybrid'
            ? '⚡ Uses localStorage first, automatically moves to IndexedDB when full'
            : storageMode === 'localStorage'
              ? '💾 Uses only browser local storage'
              : '🗄️ Uses unlimited IndexedDB storage'}
        </p>
      </div>

      {/* Export/Import */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400 block">Backup & Restore</label>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
          >
            📥 Export Backup
          </button>
          <label className="flex-1">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={(e) => {
                const input = (e.target as HTMLElement).parentElement?.querySelector('input[type="file"]') as HTMLInputElement
                input?.click()
              }}
              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition cursor-pointer"
            >
              📤 Import Backup
            </button>
          </label>
        </div>
      </div>

      {/* Storage Warning */}
      {stats?.isFull && (
        <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-3">
          <div className="text-sm text-red-300">
            ⚠️ <strong>Storage Full!</strong> Automatically moved to IndexedDB. Data is safe.
          </div>
        </div>
      )}
    </div>
  )
}
