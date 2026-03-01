'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import type { Relationship } from '@/lib/memory'
import { getLevelProgress } from '@/lib/memory'

interface Props { relationship: Relationship; justLeveledUp: boolean }
const LEVEL_NAMES = ['', 'Stranger 👋', 'Acquaintance 🤝', 'Friend 😊', 'Best Friend 🔥', 'JARVIS MODE 🤖']
const LEVEL_COLORS = ['', '#6b6b8a', '#00d4ff', '#ff1a88', '#ff8800', '#7c3aed']

export default function RelationshipBar({ relationship, justLeveledUp }: Props) {
  const progress = getLevelProgress(relationship)
  const color = LEVEL_COLORS[relationship.level]

  useEffect(() => {
    if (!justLeveledUp) return
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 }, colors: ['#ff1a88', '#7c3aed', '#00d4ff', '#ff8800'] })
    })
  }, [justLeveledUp])

  return (
    <>
      <AnimatePresence>
        {justLeveledUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }} transition={{ type: 'spring', stiffness: 300 }}
            style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, padding: '10px 20px', background: 'linear-gradient(135deg,rgba(255,26,136,0.9),rgba(124,58,237,0.9))', borderRadius: 20, color: 'white', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}
          >
            🎉 Level {relationship.level} Unlocked — {LEVEL_NAMES[relationship.level]}!
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color, fontWeight: 600, whiteSpace: 'nowrap', minWidth: 90 }}>
          {LEVEL_NAMES[relationship.level]}
        </span>
        <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: `linear-gradient(90deg, ${color}, #ff1a88)`, borderRadius: 4 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          />
        </div>
        <span style={{ fontSize: 10, color: 'var(--muted)', minWidth: 50, textAlign: 'right' }}>
          {relationship.totalInteractions} chats
        </span>
      </div>
    </>
  )
}
