'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import MatrixBoot from '@/components/MatrixBoot'

const ChatInterface = dynamic(() => import('@/components/ChatInterface'), { ssr: false })

export default function Home() {
  const [booted, setBooted] = useState(false)
  const [pinEnabled, setPinEnabled] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    try {
      const p = localStorage.getItem('jarvis_pin')
      if (p) {
        const d = JSON.parse(p)
        if (d.enabled && d.hash) { setPinEnabled(true); return }
      }
    } catch { }
    setUnlocked(true)
  }, [booted])

  return (
    <div id="app-root" style={{ display: 'flex', height: '100dvh', width: '100vw', overflow: 'hidden', position: 'fixed', inset: 0, background: '#0a0a0f' }}>
      {!booted && <MatrixBoot onDone={() => setBooted(true)} />}
      {booted && (unlocked || !pinEnabled) && <ChatInterface />}
    </div>
  )
}
