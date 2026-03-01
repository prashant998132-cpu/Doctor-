'use client'
import { useState, useEffect } from 'react'
import { Trash2, ExternalLink } from 'lucide-react'
import { getCollection, removeFromCollection } from '@/lib/memory'
import type { CollectionItem } from '@/lib/memory'

interface CollectionsProps {
  onSelect?: (content: string) => void
}

export function Collections({ onSelect }: CollectionsProps) {
  const [items, setItems] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const collection = getCollection()
    setItems(collection)
    setLoading(false)
  }, [])

  const handleRemove = (id: string) => {
    removeFromCollection(id)
    setItems(items.filter(i => i.id !== id))
  }

  if (loading) {
    return <div className="text-gray-400 text-sm p-4">Loading...</div>
  }

  if (items.length === 0) {
    return (
      <div className="text-gray-400 text-sm p-4 text-center">
        <p>📋 No saved responses yet</p>
        <p className="text-xs mt-2">Click the save button on any message to add it here!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 p-4">
      <h3 className="text-white font-bold text-sm">📋 Collections ({items.length})</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.map(item => (
          <div
            key={item.id}
            className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-lg p-3 group transition cursor-pointer"
            onClick={() => onSelect?.(item.content)}
          >
            <p className="text-sm text-gray-300 line-clamp-2 group-hover:text-white transition">
              {item.content}
            </p>
            {item.title && (
              <p className="text-xs text-gray-500 mt-1">{item.title}</p>
            )}
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {new Date(item.savedAt).toLocaleDateString()}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(item.id)
                }}
                className="text-gray-500 hover:text-red-400 transition"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
