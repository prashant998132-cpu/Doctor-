// lib/cloudBackup.ts — GitHub Gist Integration for Cloud Backup

import { storageManager } from './storage'

export interface CloudBackup {
  id: string
  gistId: string
  fileName: string
  uploadedAt: number
  size: number
  dataHash: string // To prevent duplicate uploads
}

// ━━━ CLOUD BACKUP MANAGER ━━━
export class CloudBackupManager {
  private backups: CloudBackup[] = []
  private readonly GITHUB_GIST_API = 'https://api.github.com/gists'
  private backupHistory: CloudBackup[] = []

  constructor() {
    this.loadBackupHistory()
  }

  // ━━━ EXPORT TO CLOUD (GitHub Gist - Public) ━━━
  async exportToCloud(token: string): Promise<CloudBackup | null> {
    try {
      // Get all data
      const chats = await storageManager.getData('jarvis_chats')
      const profile = await storageManager.getData('jarvis_user_profile')
      const instructions = await storageManager.getData('jarvis_custom_instructions')
      const collections = await storageManager.getData('jarvis_collections')

      const backupData = {
        version: '7.0',
        exportDate: new Date().toISOString(),
        data: {
          chats,
          profile,
          instructions,
          collections,
        },
      }

      const json = JSON.stringify(backupData, null, 2)
      const hash = this.hashData(json)

      // Check if already backed up
      if (this.isDuplicateBackup(hash)) {
        console.log('Backup already exists with same data')
        return null
      }

      // Create GitHub Gist
      const gistResponse = await fetch(this.GITHUB_GIST_API, {
        method: 'POST',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public: true,
          files: {
            'jarvis-backup.json': {
              content: json,
            },
          },
          description: `JARVIS v7 Backup - ${new Date().toISOString()}`,
        }),
      })

      if (!gistResponse.ok) {
        throw new Error(`GitHub API error: ${gistResponse.statusText}`)
      }

      const gist = await gistResponse.json()

      const backup: CloudBackup = {
        id: `backup_${Date.now()}`,
        gistId: gist.id,
        fileName: 'jarvis-backup.json',
        uploadedAt: Date.now(),
        size: json.length,
        dataHash: hash,
      }

      this.backupHistory.push(backup)
      this.saveBackupHistory()

      return backup
    } catch (error) {
      console.error('Cloud export failed:', error)
      return null
    }
  }

  // ━━━ IMPORT FROM CLOUD ━━━
  async importFromCloud(gistId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.GITHUB_GIST_API}/${gistId}`)
      if (!response.ok) throw new Error('Failed to fetch gist')

      const gist = await response.json()
      const file = gist.files['jarvis-backup.json']

      if (!file) {
        throw new Error('Backup file not found in gist')
      }

      const content = file.content
      const backup = JSON.parse(content)

      // Validate version
      if (backup.version !== '7.0') {
        console.warn('Version mismatch - attempting import anyway')
      }

      // Import data
      const { chats, profile, instructions, collections } = backup.data

      if (chats) await storageManager.saveData('jarvis_chats', chats)
      if (profile) await storageManager.saveData('jarvis_user_profile', profile)
      if (instructions) await storageManager.saveData('jarvis_custom_instructions', instructions)
      if (collections) await storageManager.saveData('jarvis_collections', collections)

      return true
    } catch (error) {
      console.error('Cloud import failed:', error)
      return false
    }
  }

  // ━━━ AUTO-BACKUP (OPTIONAL) ━━━
  startAutoBackup(token: string, intervalHours: number = 24): void {
    const interval = intervalHours * 3600000

    setInterval(async () => {
      console.log('Running auto-backup...')
      const backup = await this.exportToCloud(token)
      if (backup) {
        console.log('✅ Auto-backup completed:', backup.gistId)
      }
    }, interval)
  }

  // ━━━ HELPER FUNCTIONS ━━━

  private hashData(data: string): string {
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16)
  }

  private isDuplicateBackup(hash: string): boolean {
    return this.backupHistory.some(b => b.dataHash === hash)
  }

  private saveBackupHistory(): void {
    storageManager.saveData('jarvis_backup_history', this.backupHistory).catch(console.error)
  }

  private async loadBackupHistory(): Promise<void> {
    const history = await storageManager.getData('jarvis_backup_history')
    if (history && Array.isArray(history)) {
      this.backupHistory = history as CloudBackup[]
    }
  }

  // Get backup history
  getBackupHistory(): CloudBackup[] {
    return this.backupHistory
  }

  // Get backup size
  getTotalBackupSize(): number {
    return this.backupHistory.reduce((sum, b) => sum + b.size, 0)
  }
}

// ━━━ EXPORT SINGLETON ━━━
export const cloudBackup = new CloudBackupManager()
