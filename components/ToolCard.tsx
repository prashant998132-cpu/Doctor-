'use client'
import { motion } from 'framer-motion'
import type { Tool } from '@/lib/links'
import { trackToolClick, getToolUsage } from '@/lib/memory'

const catEmoji: Record<string, string> = {
  image:'🎨', video:'🎬', audio:'🎵', code:'💻', design:'✏️',
  writing:'✍️', productivity:'📋', learning:'📚', chat:'🤖',
  'image-edit':'✂️', upscale:'⬆️', visual:'🎭', tts:'🗣️'
}

const catColor: Record<string, string> = {
  image:'rgba(255,100,200,0.12)', video:'rgba(100,100,255,0.12)',
  audio:'rgba(100,200,100,0.12)', code:'rgba(0,200,200,0.12)',
  design:'rgba(255,180,0,0.12)', writing:'rgba(180,100,255,0.12)',
  'image-edit':'rgba(255,150,50,0.12)', upscale:'rgba(0,200,150,0.12)',
  tts:'rgba(255,80,80,0.12)', chat:'rgba(100,180,255,0.12)',
  productivity:'rgba(200,200,100,0.12)', learning:'rgba(150,255,150,0.12)',
  visual:'rgba(255,100,150,0.12)',
}

export default function ToolCard({ tool }: { tool: Tool }) {
  const usage = getToolUsage(tool.id)

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => { trackToolClick(tool.id); window.open(tool.url, '_blank', 'noopener,noreferrer') }}
      style={{
        cursor: 'pointer',
        padding: '10px 12px',
        borderRadius: 10,
        background: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        transition: 'border-color 0.15s',
        minHeight: 90,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(255,26,136,0.3)'
        e.currentTarget.style.background = 'rgba(255,26,136,0.04)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.background = '#1a1a1a'
      }}
    >
      {/* Emoji icon */}
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: catColor[tool.category] || 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17,
      }}>
        {catEmoji[tool.category] || '🛠️'}
      </div>

      {/* Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{
          fontSize: 12, fontWeight: 700,
          color: '#ececec',
          flex: 1, lineHeight: 1.3,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as any,
        }}>
          {tool.name}
        </span>
        {tool.trending && (
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: 10, flexShrink: 0 }}
          >🔥</motion.span>
        )}
      </div>

      {/* Tag */}
      <span style={{
        fontSize: 10, color: '#777',
        lineHeight: 1.3, overflow: 'hidden',
        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {tool.tag}
      </span>

      {/* Free label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span style={{
          fontSize: 9, padding: '2px 7px',
          background: 'rgba(0,212,255,0.1)',
          color: '#00d4ff', borderRadius: 5,
          border: '1px solid rgba(0,212,255,0.2)',
          maxWidth: '85%', overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {tool.free}
        </span>
        {usage.usageCount > 0 && (
          <span style={{ fontSize: 9, color: '#555' }}>{usage.usageCount}x</span>
        )}
      </div>
    </motion.div>
  )
}
