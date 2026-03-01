'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { verifyPIN, setPIN, removePIN, isPINEnabled } from '@/lib/memory'

interface Props {
  onUnlock: () => void
}

export default function SmartPIN({ onUnlock }: Props) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [mode, setMode] = useState<'unlock' | 'setup' | 'confirm'>('unlock')
  const [setupPin, setSetupPin] = useState('')

  useEffect(() => {
    if (!isPINEnabled()) {
      onUnlock()
    }
  }, [onUnlock])

  const handleDigit = (d: string) => {
    if (pin.length >= 4) return
    const newPin = pin + d
    setPin(newPin)
    if (newPin.length === 4) {
      setTimeout(() => attempt(newPin), 150)
    }
  }

  const attempt = (p: string) => {
    if (mode === 'unlock') {
      if (verifyPIN(p)) {
        onUnlock()
      } else {
        setError(true)
        setShake(true)
        setPin('')
        setTimeout(() => { setError(false); setShake(false) }, 800)
      }
    } else if (mode === 'setup') {
      setSetupPin(p)
      setMode('confirm')
      setPin('')
    } else if (mode === 'confirm') {
      if (p === setupPin) {
        setPIN(p)
        onUnlock()
      } else {
        setError(true)
        setShake(true)
        setPin('')
        setSetupPin('')
        setMode('setup')
        setTimeout(() => { setError(false); setShake(false) }, 800)
      }
    }
  }

  const digits = ['1','2','3','4','5','6','7','8','9','*','0','⌫']

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'linear-gradient(135deg, #05050f 0%, #0d0d1f 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🤖</div>
          <div style={{ fontFamily: 'Courier New', fontSize: 22, color: '#ff1a88', letterSpacing: 3 }}>JARVIS</div>
          <div style={{ fontSize: 13, color: '#6b6b8a', marginTop: 4 }}>
            {mode === 'unlock' ? 'PIN enter karo' : mode === 'setup' ? 'Naya PIN banao' : 'PIN dobara enter karo'}
          </div>
        </div>

        {/* PIN dots */}
        <div style={{ display: 'flex', gap: 16 }}>
          {[0,1,2,3].map(i => (
            <motion.div
              key={i}
              animate={{ scale: pin.length > i ? 1.2 : 1 }}
              style={{
                width: 16, height: 16, borderRadius: '50%',
                background: pin.length > i
                  ? (error ? '#ff4444' : '#ff1a88')
                  : 'rgba(255,255,255,0.15)',
                border: `2px solid ${pin.length > i ? (error ? '#ff4444' : '#ff1a88') : 'rgba(255,255,255,0.2)'}`,
                transition: 'all 0.15s',
              }}
            />
          ))}
        </div>

        {/* Numpad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {digits.map(d => (
            <motion.button
              key={d}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (d === '⌫') setPin(p => p.slice(0, -1))
                else if (d === '*') { /* skip */ }
                else handleDigit(d)
              }}
              style={{
                width: 72, height: 72, borderRadius: '50%',
                background: d === '*' ? 'transparent' : 'rgba(255,255,255,0.07)',
                border: d === '*' ? 'none' : '1px solid rgba(255,26,136,0.2)',
                color: 'white', fontSize: d === '⌫' ? 20 : 24,
                fontWeight: 300, cursor: d === '*' ? 'default' : 'pointer',
                fontFamily: 'system-ui',
              }}
            >
              {d === '*' ? '' : d}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
