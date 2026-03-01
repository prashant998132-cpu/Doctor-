'use client'
import { Copy, RotateCcw, Bookmark, Trash2, Share2, BookmarkCheck } from 'lucide-react'
import { motion } from 'framer-motion'

interface MessageActionsProps {
  messageId: string
  content: string
  onAction: (action: 'copy' | 'regenerate' | 'pin' | 'delete' | 'share') => void
  isPinned?: boolean
}

export function MessageActions({ messageId, content, onAction, isPinned }: MessageActionsProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    onAction('copy')
  }

  return (
    <motion.div
      className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
    >
      <button
        onClick={handleCopy}
        className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-gray-300"
        title="Copy"
      >
        <Copy size={14} />
      </button>

      <button
        onClick={() => onAction('regenerate')}
        className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-gray-300"
        title="Regenerate"
      >
        <RotateCcw size={14} />
      </button>

      <button
        onClick={() => onAction('pin')}
        className={`p-1 rounded hover:bg-white/10 transition ${
          isPinned ? 'text-pink-400' : 'text-gray-400 hover:text-gray-300'
        }`}
        title={isPinned ? 'Unpin' : 'Pin'}
      >
        {isPinned ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
      </button>

      <button
        onClick={() => onAction('delete')}
        className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-red-400"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>

      <button
        onClick={() => onAction('share')}
        className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-gray-300"
        title="Share"
      >
        <Share2 size={14} />
      </button>
    </motion.div>
  )
}
