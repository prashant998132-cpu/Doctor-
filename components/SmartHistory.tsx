'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getChats, deleteChat, type Chat } from '@/lib/memory'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelectChat: (chat: Chat) => void
}

export default function SmartHistory({ isOpen, onClose, onSelectChat }: Props) {
  const [chats, setChats] = useState<Chat[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (isOpen) setChats(getChats().sort((a, b) => b.updatedAt - a.updatedAt))
  }, [isOpen])

  const filtered = chats.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.messages.some(m => m.content.toLowerCase().includes(search.toLowerCase()))
  )

  const formatDate = (ts: number) => {
    const diff = Date.now() - ts
    if (diff < 86400000) return 'Aaj'
    if (diff < 172800000) return 'Kal'
    return new Date(ts).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })
  }

  return (
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
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '80vh',
              overflowY: 'auto', background: 'rgba(13,13,31,0.98)',
              border: '1px solid rgba(255,26,136,0.2)', borderRadius: '24px 24px 0 0',
              padding: '20px 0 80px',
            }}
          >
            <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 4, margin: '0 auto 16px' }} />
            <div style={{ padding: '0 16px', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Courier New', fontSize: 18, color: 'var(--pink)', letterSpacing: 2, marginBottom: 12 }}>
                📋 CHAT HISTORY
              </h2>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search chats..."
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,26,136,0.2)',
                  color: 'var(--text)', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                <div style={{ fontSize: 32 }}>💬</div>
                <div style={{ marginTop: 8 }}>Koi chat nahi mila</div>
              </div>
            ) : (
              filtered.map(chat => (
                <motion.div
                  key={chat.id} whileTap={{ scale: 0.98 }}
                  onClick={() => { onSelectChat(chat); onClose() }}
                  style={{
                    padding: '12px 16px', cursor: 'pointer',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: 'linear-gradient(135deg,rgba(255,26,136,0.2),rgba(124,58,237,0.2))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  }}>💬</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {chat.title || 'Untitled Chat'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                      {chat.messages.length} messages · {formatDate(chat.updatedAt)}
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deleteChat(chat.id); setChats(p => p.filter(c => c.id !== chat.id)) }}
                    style={{ padding: '6px', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 16 }}>
                    🗑️
                  </button>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
