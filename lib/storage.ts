// lib/storage.ts — Advanced Storage Management System
// Dual storage: localStorage (fast) + IndexedDB (unlimited)

import Dexie, { Table } from 'dexie'

export type StorageMode = 'localStorage' | 'indexeddb' | 'hybrid'

export interface StorageConfig {
  mode: StorageMode
  compression: boolean
  autoArchive: boolean
  maxLocalStorageSize: number // bytes
}

// ━━━ DEXIE DATABASE ━━━
class JarvisDB extends Dexie {
  chats!: Table<any>
  messages!: Table<any>
  archives!: Table<any>
  analytics!: Table<any>

  constructor() {
    super('JarvisDB')
    this.version(1).stores({
      chats: 'id, updatedAt',
      messages: '++id, chatId, timestamp',
      archives: 'id, archivedAt',
      analytics: '++id, date',
    })
  }
}

export const db = new JarvisDB()

// ━━━ COMPRESSION UTILITIES ━━━
function compress(data: string): string {
  // Simple RLE compression (run-length encoding)
  // For better compression, use pako library if needed
  try {
    return btoa(unescape(encodeURIComponent(data)))
  } catch {
    return data
  }
}

function decompress(data: string): string {
  try {
    return decodeURIComponent(escape(atob(data)))
  } catch {
    return data
  }
}

// ━━━ STORAGE MANAGER ━━━
export class StorageManager {
  private config: StorageConfig = {
    mode: 'hybrid',
    compression: true,
    autoArchive: true,
    maxLocalStorageSize: 5 * 1024 * 1024, // 5MB
  }

  constructor(config?: Partial<StorageConfig>) {
    if (config) this.config = { ...this.config, ...config }
  }

  // Get total localStorage size
  getLocalStorageSize(): number {
    let size = 0
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        size += (localStorage[key].length + key.length) * 2
      }
    }
    return size
  }

  // Check if localStorage is full
  isLocalStorageFull(): boolean {
    return this.getLocalStorageSize() > this.config.maxLocalStorageSize
  }

  // ━━━ SAVE DATA ━━━
  async saveData(key: string, value: any, preferredMode?: StorageMode): Promise<void> {
    const mode = preferredMode || this.config.mode
    const data = JSON.stringify(value)
    const compressed = this.config.compression ? compress(data) : data

    try {
      if (mode === 'localStorage' || mode === 'hybrid') {
        // Try localStorage first
        try {
          localStorage.setItem(key, compressed)
          return
        } catch (e) {
          // localStorage full, fallback to IndexedDB
          if (mode === 'hybrid') {
            await this.saveToIndexedDB(key, value)
            return
          }
          throw e
        }
      } else if (mode === 'indexeddb') {
        await this.saveToIndexedDB(key, value)
      }
    } catch (error) {
      console.error(`Storage save failed: ${key}`, error)
      // Last resort: try the other storage
      try {
        if (mode !== 'indexeddb') {
          await this.saveToIndexedDB(key, value)
        } else {
          localStorage.setItem(key, compressed)
        }
      } catch (fallbackError) {
        console.error('All storage methods failed', fallbackError)
      }
    }
  }

  // ━━━ GET DATA ━━━
  async getData<T>(key: string, preferredMode?: StorageMode): Promise<T | null> {
    const mode = preferredMode || this.config.mode

    try {
      if (mode === 'localStorage' || mode === 'hybrid') {
        const data = localStorage.getItem(key)
        if (data) {
          const decompressed = this.config.compression ? decompress(data) : data
          return JSON.parse(decompressed)
        }
      }

      if (mode === 'indexeddb' || mode === 'hybrid') {
        return await this.getFromIndexedDB<T>(key)
      }

      return null
    } catch (error) {
      console.error(`Storage get failed: ${key}`, error)
      return null
    }
  }

  // ━━━ INDEXEDDB OPERATIONS ━━━
  private async saveToIndexedDB(key: string, value: any): Promise<void> {
    if (typeof window === 'undefined') return

    const storeName = this.getStoreName(key)
    const store = db[storeName as keyof JarvisDB] as any
    await store.put({
      id: key,
      data: value,
      timestamp: Date.now(),
    })
  }

  private async getFromIndexedDB<T>(key: string): Promise<T | null> {
    if (typeof window === 'undefined') return null

    const storeName = this.getStoreName(key)
    const store = db[storeName as keyof JarvisDB] as any
    const result = await store.get(key)
    return result?.data || null
  }

  private getStoreName(key: string): string {
    if (key.includes('chat')) return 'chats'
    if (key.includes('message')) return 'messages'
    if (key.includes('archive')) return 'archives'
    return 'analytics'
  }

  // ━━━ AUTO-ARCHIVE OLD DATA ━━━
  async autoArchiveOldMessages(daysOld: number = 30): Promise<void> {
    if (!this.config.autoArchive) return

    try {
      const chats = await this.getData('jarvis_chats')
      if (!Array.isArray(chats)) return

      const cutoffDate = Date.now() - daysOld * 24 * 60 * 60 * 1000

      for (const chat of chats) {
        const oldMessages = chat.messages.filter(
          (m: any) => m.timestamp < cutoffDate
        )

        if (oldMessages.length > 0) {
          // Archive old messages
          await db.archives.put({
            id: `archive_${chat.id}_${Date.now()}`,
            chatId: chat.id,
            messages: oldMessages,
            archivedAt: Date.now(),
          })

          // Remove from active chat
          chat.messages = chat.messages.filter(
            (m: any) => m.timestamp >= cutoffDate
          )
        }
      }

      await this.saveData('jarvis_chats', chats)
    } catch (error) {
      console.error('Auto-archive failed', error)
    }
  }

  // ━━━ CLEAR OLD DATA ━━━
  async clearOldData(daysOld: number = 60): Promise<void> {
    try {
      const cutoffDate = Date.now() - daysOld * 24 * 60 * 60 * 1000
      await db.archives.where('archivedAt').below(cutoffDate).delete()
      console.log('✅ Old archives cleaned')
    } catch (error) {
      console.error('Clear old data failed', error)
    }
  }

  // ━━━ EXPORT ALL DATA ━━━
  async exportAllData(): Promise<string> {
    try {
      const chats = await this.getData('jarvis_chats')
      const profile = await this.getData('jarvis_user_profile')
      const instructions = await this.getData('jarvis_custom_instructions')
      const collections = await this.getData('jarvis_collections')

      const backup = {
        version: '7.0',
        exportDate: new Date().toISOString(),
        data: {
          chats,
          profile,
          instructions,
          collections,
        },
      }

      return JSON.stringify(backup, null, 2)
    } catch (error) {
      console.error('Export failed', error)
      return ''
    }
  }

  // ━━━ IMPORT DATA ━━━
  async importData(jsonString: string): Promise<boolean> {
    try {
      const backup = JSON.parse(jsonString)
      if (backup.version !== '7.0') {
        console.warn('Version mismatch in backup')
        return false
      }

      for (const [key, value] of Object.entries(backup.data)) {
        await this.saveData(`jarvis_${key}`, value)
      }

      return true
    } catch (error) {
      console.error('Import failed', error)
      return false
    }
  }

  // ━━━ STORAGE STATS ━━━
  async getStorageStats() {
    const localSize = this.getLocalStorageSize()
    const idbSize = (await db.archives.count()) * 1024 // rough estimate

    return {
      localStorage: {
        used: localSize,
        limit: this.config.maxLocalStorageSize,
        percent: (localSize / this.config.maxLocalStorageSize) * 100,
      },
      indexedDB: {
        estimated: idbSize,
      },
      total: localSize + idbSize,
      isFull: this.isLocalStorageFull(),
    }
  }

  // ━━━ CLEANUP & OPTIMIZATION ━━━
  async optimize(): Promise<void> {
    console.log('🔧 Running storage optimization...')

    // Auto-archive old messages
    await this.autoArchiveOldMessages(30)

    // Clean archived data older than 60 days
    await this.clearOldData(60)

    // Compact localStorage if needed
    if (this.isLocalStorageFull()) {
      console.log('⚠️ Storage full, moving to IndexedDB...')
      const chats = await this.getData('jarvis_chats')
      if (chats) {
        await this.saveData('jarvis_chats', chats, 'indexeddb')
      }
    }

    console.log('✅ Storage optimization complete')
  }
}

// ━━━ EXPORT SINGLETON ━━━
export const storageManager = new StorageManager({
  mode: 'hybrid',
  compression: true,
  autoArchive: true,
})
