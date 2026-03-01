'use client'
import { motion } from 'framer-motion'

interface Props { isThinking?: boolean; isSpeaking?: boolean; level?: number; size?: number }

export default function JarvisAvatar({ isThinking = false, isSpeaking = false, level = 1, size = 56 }: Props) {
  const levelColors = [
    ['#ff1a88', '#7c3aed'], ['#ff1a88', '#7c3aed'],
    ['#ff1a88', '#00d4ff'], ['#ff8800', '#ff1a88'], ['#00d4ff', '#ff1a88'],
  ]
  const [c1, c2] = levelColors[level - 1] || levelColors[0]
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {(isSpeaking || isThinking) && (
        <motion.div
          style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: `2px solid ${c1}` }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      <motion.div
        style={{ width: size, height: size, background: `linear-gradient(135deg, ${c1}, ${c2})`, boxShadow: `0 0 20px ${c1}66, 0 0 40px ${c1}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
        animate={{ borderRadius: isThinking ? ['40% 60% 60% 40% / 40% 40% 60% 60%', '60% 40% 40% 60% / 60% 60% 40% 40%', '40% 60% 60% 40% / 40% 40% 60% 60%'] : ['50% 50% 50% 50%', '45% 55% 55% 45%', '50% 50% 50% 50%'], y: [0, -4, 0] }}
        transition={{ duration: isThinking ? 1.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }} />
        <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 40 40" style={{ position: 'relative', zIndex: 1 }}>
          <motion.ellipse cx="13" cy="16" rx="3" ry="3" fill="white" animate={{ ry: isThinking ? [3, 0.5, 3] : [3, 2.5, 3] }} transition={{ duration: isThinking ? 0.8 : 3, repeat: Infinity }} />
          <motion.ellipse cx="27" cy="16" rx="3" ry="3" fill="white" animate={{ ry: isThinking ? [3, 0.5, 3] : [3, 2.5, 3] }} transition={{ duration: isThinking ? 0.8 : 3, repeat: Infinity, delay: 0.1 }} />
          <motion.circle cx="14" cy="16" r="1.2" fill={c1} animate={{ cx: [14, 13, 14] }} transition={{ duration: 4, repeat: Infinity }} />
          <motion.circle cx="28" cy="16" r="1.2" fill={c1} animate={{ cx: [28, 27, 28] }} transition={{ duration: 4, repeat: Infinity }} />
          <motion.path stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"
            animate={{ d: isSpeaking ? ['M 12 26 Q 20 24 28 26', 'M 12 25 Q 20 28 28 25', 'M 12 26 Q 20 24 28 26'] : level >= 4 ? ['M 13 26 Q 20 30 27 26'] : ['M 13 26 Q 20 28 27 26'] }}
            transition={{ duration: isSpeaking ? 0.4 : 1, repeat: Infinity }}
          />
        </svg>
      </motion.div>
    </div>
  )
}
