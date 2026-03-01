'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COMMANDS = [
  { key: '/image',    label: 'Image Tools',         icon: '🎨', action: 'filter:image' },
  { key: '/video',    label: 'Video Tools',          icon: '🎬', action: 'filter:video' },
  { key: '/code',     label: 'Code Tools',           icon: '💻', action: 'filter:code' },
  { key: '/design',   label: 'Design Tools',         icon: '✏️', action: 'filter:design' },
  { key: '/audio',    label: 'Audio/Music Tools',    icon: '🎵', action: 'filter:audio' },
  { key: '/tts',      label: 'Voice TTS Tools',      icon: '🗣️', action: 'filter:tts' },
  { key: '/trending', label: 'Trending Now',         icon: '🔥', action: 'filter:trending' },
  { key: '/weather',  label: 'Aaj ka Mausam',        icon: '🌤️', action: 'weather' },
  { key: '/search',   label: 'Web Search',           icon: '🔍', action: 'search' },
  { key: '/camera',   label: 'Photo Analyze',        icon: '📸', action: 'vision' },
  { key: '/pdf',      label: 'Chat PDF Export',      icon: '📄', action: 'export-pdf' },
  { key: '/journal',  label: 'Aaj ka Journal',       icon: '📓', action: 'journal' },
  { key: '/badges',   label: 'My Badges',            icon: '🏆', action: 'badges' },
  { key: '/clear',    label: 'New Chat',             icon: '🗑️', action: 'clear' },
  { key: '/level',    label: 'My Level Info',        icon: '⭐', action: 'level' },
  { key: '/export',   label: 'Export Backup',        icon: '💾', action: 'export' },
  { key: '/privacy',  label: 'What JARVIS Knows',    icon: '👁️', action: 'privacy' },
  { key: '/streak',   label: 'My Streak',            icon: '🔥', action: 'streak' },
]

interface Props { isOpen: boolean; onClose: () => void; onAction: (action: string) => void }

export default function CommandPalette({ isOpen, onClose, onAction }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const filtered = COMMANDS.filter(c =>
    c.key.includes(query.toLowerCase()) || c.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            onClick={e => e.stopPropagation()}
            style={{ width: '90%', maxWidth: 480, background: 'rgba(13,13,31,0.98)', border: '1px solid rgba(255,26,136,0.3)', borderRadius: 16, overflow: 'hidden' }}
          >
            <input
              ref={inputRef}
              placeholder="/ command ya search karo..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,26,136,0.15)', color: '#f0f0ff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {filtered.length === 0
                ? <div style={{ padding: '16px 20px', color: '#6b6b8a', fontSize: 13 }}>Koi command nahi mila</div>
                : filtered.map(cmd => (
                  <div
                    key={cmd.key}
                    onClick={() => { onAction(cmd.action); onClose() }}
                    style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,26,136,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: 18 }}>{cmd.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, color: '#f0f0ff' }}>{cmd.label}</div>
                      <div style={{ fontSize: 11, color: '#6b6b8a' }}>{cmd.key}</div>
                    </div>
                  </div>
                ))
              }
            </div>
            <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 11, color: '#6b6b8a', display: 'flex', gap: 12 }}>
              <span>↵ select</span><span>Esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
