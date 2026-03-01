'use client'
import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { getCustomInstructions, saveCustomInstruction, deleteCustomInstruction } from '@/lib/memory'
import type { CustomInstruction } from '@/lib/memory'

export function CustomInstructionsPanel() {
  const [instructions, setInstructions] = useState<CustomInstruction[]>([])
  const [newText, setNewText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const insts = getCustomInstructions()
    setInstructions(insts)
    setLoading(false)
  }, [])

  const handleAdd = () => {
    if (newText.trim()) {
      const instruction: CustomInstruction = {
        id: `inst_${Date.now()}`,
        text: newText,
        category: 'general',
        savedAt: Date.now(),
      }
      saveCustomInstruction(instruction)
      setInstructions([...instructions, instruction])
      setNewText('')
    }
  }

  const handleDelete = (id: string) => {
    deleteCustomInstruction(id)
    setInstructions(instructions.filter(i => i.id !== id))
  }

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-white font-bold text-sm mb-3">🧠 Custom Instructions</h3>
        <p className="text-gray-400 text-xs mb-3">
          Tell JARVIS how to behave. These will be remembered forever!
        </p>
      </div>

      {/* Saved Instructions */}
      {instructions.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {instructions.map(inst => (
            <div
              key={inst.id}
              className="flex justify-between items-start bg-white/5 hover:bg-white/8 p-3 rounded-lg border border-white/10 transition"
            >
              <p className="text-sm text-gray-300 flex-1 pr-2">{inst.text}</p>
              <button
                onClick={() => handleDelete(inst.id)}
                className="text-gray-500 hover:text-red-400 transition flex-shrink-0"
                title="Delete"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {instructions.length === 0 && (
        <p className="text-gray-500 text-xs italic">No instructions yet. Add one below!</p>
      )}

      {/* Add New */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="e.g., Always respond in Hindi"
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500/50 transition"
        />
        <button
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="px-3 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded flex items-center gap-1 transition"
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  )
}
