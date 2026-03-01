'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getStorageStatus, autoCleanStorage, type SmartStorageStatus } from '@/lib/memory'

export default function SmartStorageAlert() {
  const [status, setStatus] = useState<SmartStorageStatus | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [cleaning, setCleaning] = useState(false)

  useEffect(() => {
    const check = async () => {
      const s = await getStorageStatus()
      setStatus(s)
      setDismissed(false)
    }
    check()
    const interval = setInterval(check, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleClean = async () => {
    setCleaning(true)
    autoCleanStorage()
    await new Promise(r => setTimeout(r, 800))
    setStatus(await getStorageStatus())
    setCleaning(false)
    setDismissed(true)
  }

  if (!status || dismissed || (!status.warning && !status.critical)) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{
          position: 'fixed', top: 70, left: 16, right: 16, zIndex: 9000,
          background: status.critical ? 'rgba(255,68,68,0.15)' : 'rgba(255,136,0,0.12)',
          border: `1px solid ${status.critical ? 'rgba(255,68,68,0.4)' : 'rgba(255,136,0,0.3)'}`,
          borderRadius: 14, padding: '12px 16px', backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>{status.critical ? '🚨' : '⚠️'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: status.critical ? '#ff4444' : '#ff8800' }}>
              {status.critical
                ? 'Sir, storage critical! Auto-clean shuru karo!'
                : `Sir, storage ${status.percent}% bhar rahi hai!`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleClean} disabled={cleaning}
              style={{ padding: '6px 12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #ff1a88, #7c3aed)', color: 'white', fontSize: 12, cursor: 'pointer' }}>
              {cleaning ? '🔄' : '🗑️ Clean'}
            </motion.button>
            <button onClick={() => setDismissed(true)}
              style={{ padding: '6px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
              ✕
            </button>
          </div>
        </div>
        <div style={{ marginTop: 8, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
          <motion.div
            animate={{ width: `${Math.min(status.percent, 100)}%` }}
            style={{ height: '100%', borderRadius: 4, background: status.critical ? 'linear-gradient(90deg,#ff4444,#ff8800)' : 'linear-gradient(90deg,#ff8800,#ff1a88)' }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
