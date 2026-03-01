'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getPreferences, setPreferences, getProfile, exportAllData, deleteAllData,
  isPINEnabled, setPIN, removePIN,
  type Preferences
} from '@/lib/memory'
import { CustomInstructionsPanel } from '@/components/CustomInstructionsPanel'
import { StorageSettings } from '@/components/StorageSettings'

interface Props { isOpen: boolean; onClose: () => void }

export default function SmartSettings({ isOpen, onClose }: Props) {
  const [prefs, setPrefs] = useState<Preferences>(getPreferences())
  const [profile] = useState(getProfile())
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showPINSetup, setShowPINSetup] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinStep, setPinStep] = useState<'enter' | 'confirm'>('enter')
  const [pinTemp, setPinTemp] = useState('')
  const [pinError, setPinError] = useState('')

  const update = (key: keyof Preferences, value: unknown) => {
    const updated = { ...prefs, [key]: value } as Preferences
    setPrefs(updated)
    setPreferences(updated)
  }

  const MODES = [
    { key: 'default',     label: '🤖 Default' },
    { key: 'motivation',  label: '💪 Motivation' },
    { key: 'chill',       label: '😎 Chill' },
    { key: 'focus',       label: '🎯 Focus' },
    { key: 'philosopher', label: '🤔 Philosopher' },
    { key: 'roast',       label: '🔥 Roast' },
  ]

  const TOGGLES: { key: keyof Preferences; label: string }[] = [
    { key: 'voiceEnabled',        label: '🎤 Voice Mode' },
    { key: 'ttsEnabled',          label: '🔊 JARVIS Bolega' },
    { key: 'hapticEnabled',       label: '📳 Haptic Feedback' },
    { key: 'notificationsEnabled',label: '🔔 Notifications' },
    { key: 'lowPowerMode',        label: '🔋 Low Power Mode' },
    { key: 'autoTheme',           label: '🎨 Auto Theme (Time-based)' },
    { key: 'showConfidence',      label: '📊 AI Confidence Show' },
    { key: 'showAvatar',          label: '🤖 Avatar Show' },
  ]

  const handlePINDigit = (d: string) => {
    const next = pinInput + d
    if (next.length > 4) return
    setPinInput(next)
    if (next.length === 4) {
      if (pinStep === 'enter') {
        setPinTemp(next)
        setPinInput('')
        setPinStep('confirm')
      } else {
        if (next === pinTemp) {
          setPIN(next)
          update('pinEnabled', true)
          setShowPINSetup(false)
          setPinInput('')
          setPinStep('enter')
          setPinTemp('')
          setPinError('')
        } else {
          setPinError('PIN match nahi hua! Dobara try karo.')
          setPinInput('')
          setPinStep('enter')
          setPinTemp('')
        }
      }
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 8000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: '88vh',
                overflowY: 'auto', background: 'rgba(13,13,31,0.98)',
                border: '1px solid rgba(255,26,136,0.2)', borderRadius: '24px 24px 0 0',
                padding: '20px 16px 80px',
              }}
            >
              <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 4, margin: '0 auto 20px' }} />
              <h2 style={{ fontFamily: 'Courier New', fontSize: 18, color: '#ff1a88', letterSpacing: 2, marginBottom: 20 }}>
                ⚙️ SMART SETTINGS
              </h2>

              {/* Profile card */}
              {profile.name && (
                <div style={{ padding: '12px 16px', background: 'rgba(255,26,136,0.08)', borderRadius: 12, marginBottom: 16, border: '1px solid rgba(255,26,136,0.15)' }}>
                  <div style={{ fontSize: 12, color: '#6b6b8a' }}>Smart Profile</div>
                  <div style={{ fontSize: 14, color: '#f0f0ff', marginTop: 4 }}>
                    👤 {profile.name} · {profile.language}
                    {profile.goals?.length ? ` · ${profile.goals.length} goals` : ''}
                  </div>
                </div>
              )}

              {/* Custom Instructions */}
              <div style={{ marginBottom: 24, padding: '16px', background: 'rgba(255,26,136,0.06)', borderRadius: 12, border: '1px solid rgba(255,26,136,0.15)' }}>
                <CustomInstructionsPanel />
              </div>

              {/* Storage Management */}
              <div style={{ marginBottom: 24, padding: '16px', background: 'rgba(0,212,255,0.06)', borderRadius: 12, border: '1px solid rgba(0,212,255,0.15)' }}>
                <StorageSettings />
              </div>

              {/* Toggles */}
              <div style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 10, letterSpacing: 1 }}>PERSONALITY MODE</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
                {MODES.map(mode => (
                  <motion.button key={mode.key} whileTap={{ scale: 0.95 }}
                    onClick={() => update('personalityMode', mode.key as Preferences['personalityMode'])}
                    style={{
                      padding: '10px 12px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                      border: prefs.personalityMode === mode.key ? '1px solid rgba(255,26,136,0.5)' : '1px solid rgba(255,255,255,0.08)',
                      background: prefs.personalityMode === mode.key ? 'linear-gradient(135deg,rgba(255,26,136,0.3),rgba(124,58,237,0.3))' : 'rgba(255,255,255,0.05)',
                    }}>
                    <div style={{ fontSize: 13, color: '#f0f0ff', fontWeight: 600 }}>{mode.label}</div>
                  </motion.button>
                ))}
              </div>

              {/* Toggles */}
              <div style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 12, letterSpacing: 1 }}>SETTINGS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 24 }}>
                {TOGGLES.map(t => (
                  <div key={t.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 14, color: '#f0f0ff' }}>{t.label}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => update(t.key, !prefs[t.key])}
                      style={{
                        width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                        background: prefs[t.key] ? 'linear-gradient(90deg,#ff1a88,#7c3aed)' : 'rgba(255,255,255,0.1)',
                        position: 'relative', transition: 'background 0.3s',
                      }}
                    >
                      <motion.div
                        animate={{ x: prefs[t.key] ? 18 : 2 }}
                        style={{ position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%', background: 'white' }}
                      />
                    </motion.button>
                  </div>
                ))}
              </div>

              {/* PIN Lock */}
              <div style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 12, letterSpacing: 1 }}>SECURITY</div>
              <div style={{ marginBottom: 24, padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showPINSetup ? 16 : 0 }}>
                  <span style={{ fontSize: 14, color: '#f0f0ff' }}>🔐 PIN Lock</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (isPINEnabled()) { removePIN(); update('pinEnabled', false) }
                      else { setShowPINSetup(true); setPinError('') }
                    }}
                    style={{ padding: '6px 14px', borderRadius: 10, border: `1px solid ${isPINEnabled() ? 'rgba(255,68,68,0.4)' : 'rgba(255,26,136,0.4)'}`, background: 'none', color: isPINEnabled() ? '#ff4444' : '#ff1a88', fontSize: 12, cursor: 'pointer' }}
                  >
                    {isPINEnabled() ? 'Remove PIN' : 'Set PIN'}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showPINSetup && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <div style={{ fontSize: 13, color: '#6b6b8a', marginBottom: 12 }}>
                        {pinStep === 'enter' ? '4-digit PIN choose karo:' : 'PIN dobara enter karo (confirm):'}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        {[0,1,2,3].map(i => (
                          <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: pinInput.length > i ? '#ff1a88' : 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,26,136,0.3)' }} />
                        ))}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                        {['1','2','3','4','5','6','7','8','9','*','0','⌫'].map(d => (
                          <motion.button key={d} whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              if (d === '⌫') setPinInput(p => p.slice(0,-1))
                              else if (d !== '*') handlePINDigit(d)
                            }}
                            style={{ padding: '10px', borderRadius: 10, border: d === '*' ? 'none' : '1px solid rgba(255,26,136,0.2)', background: d === '*' ? 'transparent' : 'rgba(255,255,255,0.05)', color: 'white', fontSize: 18, cursor: d === '*' ? 'default' : 'pointer' }}>
                            {d === '*' ? '' : d}
                          </motion.button>
                        ))}
                      </div>
                      {pinError && <div style={{ fontSize: 12, color: '#ff4444', marginTop: 8 }}>{pinError}</div>}
                      <button onClick={() => { setShowPINSetup(false); setPinInput(''); setPinStep('enter') }}
                        style={{ marginTop: 8, background: 'none', border: 'none', color: '#6b6b8a', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Data Actions */}
              <div style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 12, letterSpacing: 1 }}>DATA</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={exportAllData}
                  style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.05)', color: '#00d4ff', fontSize: 14, cursor: 'pointer', textAlign: 'left' }}>
                  📤 Backup Export (JSON)
                </motion.button>

                {!confirmDelete ? (
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => setConfirmDelete(true)}
                    style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,68,68,0.3)', background: 'rgba(255,68,68,0.05)', color: '#ff4444', fontSize: 14, cursor: 'pointer', textAlign: 'left' }}>
                    🗑️ Sab Delete Karo
                  </motion.button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <motion.button whileTap={{ scale: 0.97 }}
                      onClick={() => { deleteAllData(); window.location.reload() }}
                      style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: '#ff4444', color: 'white', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>
                      Haan, Delete!
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.97 }}
                      onClick={() => setConfirmDelete(false)}
                      style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: '#6b6b8a', fontSize: 14, cursor: 'pointer' }}>
                      Cancel
                    </motion.button>
                  </div>
                )}
              </div>

              <div style={{ fontSize: 11, color: '#6b6b8a', textAlign: 'center', marginTop: 20 }}>
                JARVIS v7.0 · ₹0 Forever · Privacy First
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
