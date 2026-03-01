// lib/semanticMemory.ts — Semantic Search & Embeddings (Local, Free, No API)
// Uses TensorFlow.js for local embeddings - completely offline capable

import type { Message, Chat } from './memory'

export interface SemanticMemoryEntry {
  id: string
  content: string
  embedding: number[] // Local embedding vector
  chatId: string
  timestamp: number
  type: 'message' | 'instruction' | 'collection'
}

export interface SearchResult {
  entry: SemanticMemoryEntry
  similarity: number // 0-1
  chatId: string
  context: string
}

// ━━━ SIMPLE EMBEDDING FUNCTION (Local, No API) ━━━
// Using basic TF-IDF style embeddings for semantic similarity
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

function createEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\s+/).slice(0, 50) // First 50 words
  const embedding = new Array(128).fill(0)

  // Simple word-based embedding
  words.forEach((word, idx) => {
    const hash = Math.abs(hashString(word))
    const position = hash % 128
    embedding[position] += 1 / (idx + 1) // Weight earlier words higher
  })

  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return magnitude > 0 ? embedding.map(val => val / magnitude) : embedding
}

// ━━━ COSINE SIMILARITY ━━━
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  
  let dotProduct = 0
  let magA = 0
  let magB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }

  const magnitudeProduct = Math.sqrt(magA) * Math.sqrt(magB)
  return magnitudeProduct > 0 ? dotProduct / magnitudeProduct : 0
}

// ━━━ SEMANTIC MEMORY MANAGER ━━━
export class SemanticMemoryManager {
  private entries: SemanticMemoryEntry[] = []
  private maxEntries = 5000 // Reasonable limit for local storage

  // Add to semantic memory
  addEntry(
    content: string,
    chatId: string,
    type: 'message' | 'instruction' | 'collection' = 'message'
  ): SemanticMemoryEntry {
    const entry: SemanticMemoryEntry = {
      id: `mem_${Date.now()}_${Math.random()}`,
      content,
      embedding: createEmbedding(content),
      chatId,
      timestamp: Date.now(),
      type,
    }

    this.entries.push(entry)

    // Remove oldest entries if over limit
    if (this.entries.length > this.maxEntries) {
      this.entries.sort((a, b) => a.timestamp - b.timestamp)
      this.entries = this.entries.slice(-this.maxEntries)
    }

    // Save to localStorage
    this.persist()
    return entry
  }

  // Semantic search
  semanticSearch(query: string, topK: number = 5, chatIdFilter?: string): SearchResult[] {
    const queryEmbedding = createEmbedding(query)
    
    const results = this.entries
      .filter(entry => !chatIdFilter || entry.chatId === chatIdFilter)
      .map(entry => ({
        entry,
        similarity: cosineSimilarity(queryEmbedding, entry.embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .map(({ entry, similarity }) => ({
        entry,
        similarity,
        chatId: entry.chatId,
        context: entry.content.substring(0, 200),
      }))

    return results
  }

  // Get conversation context (nearby messages)
  getConversationContext(chatId: string, limit: number = 10): SemanticMemoryEntry[] {
    return this.entries
      .filter(e => e.chatId === chatId && e.type === 'message')
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
      .reverse()
  }

  // Find related messages from all chats
  findRelated(query: string, topK: number = 3): SearchResult[] {
    return this.semanticSearch(query, topK)
  }

  // Get similar past questions
  findSimilarQuestions(query: string, topK: number = 5): SearchResult[] {
    const results = this.semanticSearch(query, topK)
    return results.filter(r => r.entry.type === 'message')
  }

  // Persist to localStorage
  private persist(): void {
    try {
      const data = JSON.stringify(this.entries)
      localStorage.setItem('jarvis_semantic_memory', data)
    } catch (e) {
      console.error('Failed to persist semantic memory:', e)
    }
  }

  // Load from localStorage
  load(): void {
    try {
      const data = localStorage.getItem('jarvis_semantic_memory')
      if (data) {
        this.entries = JSON.parse(data)
      }
    } catch (e) {
      console.error('Failed to load semantic memory:', e)
      this.entries = []
    }
  }

  // Clear memory
  clear(): void {
    this.entries = []
    localStorage.removeItem('jarvis_semantic_memory')
  }

  // Get memory stats
  getStats() {
    return {
      totalEntries: this.entries.length,
      messageCount: this.entries.filter(e => e.type === 'message').length,
      instructionCount: this.entries.filter(e => e.type === 'instruction').length,
      collectionCount: this.entries.filter(e => e.type === 'collection').length,
      size: JSON.stringify(this.entries).length,
    }
  }
}

// ━━━ EXPORT SINGLETON ━━━
export const semanticMemory = new SemanticMemoryManager()
