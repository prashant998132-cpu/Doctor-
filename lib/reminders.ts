// lib/reminders.ts — Proactive Reminders System (No Backend Needed)

import { storageManager } from './storage'

export interface Reminder {
  id: string
  title: string
  description: string
  scheduledTime: number // timestamp
  type: 'weather' | 'task' | 'health' | 'event' | 'custom'
  isActive: boolean
  createdAt: number
}

export interface ProactiveReminder extends Reminder {
  trigger: 'time-based' | 'weather-based' | 'pattern-based'
}

// ━━━ REMINDER MANAGER ━━━
export class ReminderManager {
  private reminders: Reminder[] = []
  private notificationWorker: Worker | null = null
  private checkInterval: number | null = null

  constructor() {
    this.loadReminders()
    this.initNotificationWorker()
    this.startReminderCheck()
  }

  // Create reminder
  createReminder(
    title: string,
    description: string,
    scheduledTime: number,
    type: Reminder['type'] = 'custom'
  ): Reminder {
    const reminder: Reminder = {
      id: `rem_${Date.now()}`,
      title,
      description,
      scheduledTime,
      type,
      isActive: true,
      createdAt: Date.now(),
    }

    this.reminders.push(reminder)
    this.saveReminders()
    return reminder
  }

  // Parse natural language to time
  parseNaturalTime(text: string): number | null {
    const now = Date.now()
    const patterns = [
      { regex: /tomorrow\s+at\s+(\d+):(\d+)/i, handler: (m: string[], h: number, mi: number) => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(h, mi, 0, 0)
        return tomorrow.getTime()
      }},
      { regex: /in\s+(\d+)\s+hours?/i, handler: (m: string[], hours: number) => now + hours * 3600000 },
      { regex: /in\s+(\d+)\s+minutes?/i, handler: (m: string[], mins: number) => now + mins * 60000 },
      { regex: /at\s+(\d+):(\d+)\s*(am|pm)?/i, handler: (m: string[], h: number, mi: number, ampm: string) => {
        const time = new Date()
        let hours = h
        if (ampm?.toLowerCase() === 'pm' && h !== 12) hours += 12
        if (ampm?.toLowerCase() === 'am' && h === 12) hours = 0
        time.setHours(hours, mi, 0, 0)
        return time.getTime()
      }},
      { regex: /next\s+week/i, handler: () => {
        const date = new Date()
        date.setDate(date.getDate() + 7)
        return date.getTime()
      }},
    ]

    for (const pattern of patterns) {
      const match = text.match(pattern.regex)
      if (match) {
        const groups = match.slice(1).map((g: string) => {
          const num = parseInt(g)
          return isNaN(num) ? g : num
        })
        return pattern.handler(match, ...groups)
      }
    }

    return null
  }

  // Create reminder from natural language
  createFromNaturalLanguage(text: string): Reminder | null {
    // Example: "Remind me tomorrow at 9am to call mom"
    const timeMatch = this.parseNaturalTime(text)
    if (!timeMatch) return null

    // Extract title/description
    const cleanText = text.replace(/remind me|at|in|tomorrow|next week|hours?|minutes?|am|pm/gi, '').trim()

    return this.createReminder(
      cleanText.substring(0, 50),
      cleanText,
      timeMatch,
      'custom'
    )
  }

  // ━━━ PROACTIVE SUGGESTIONS ━━━
  getProactiveSuggestions(): ProactiveReminder[] {
    const suggestions: ProactiveReminder[] = []
    const now = Date.now()
    const dayOfWeek = new Date().getDay()

    // Suggestion 1: Recurring task
    if (dayOfWeek === 1) { // Monday
      suggestions.push({
        id: `prem_${Date.now()}_1`,
        title: 'Weekly Review',
        description: 'Review your progress from last week',
        scheduledTime: now + 3600000,
        type: 'task',
        isActive: true,
        createdAt: now,
        trigger: 'pattern-based',
      })
    }

    // Suggestion 2: Health reminder (every day at noon)
    const noon = new Date()
    noon.setHours(12, 0, 0, 0)
    if (now < noon.getTime()) {
      suggestions.push({
        id: `prem_${Date.now()}_2`,
        title: 'Stay Hydrated',
        description: 'Time to drink some water!',
        scheduledTime: noon.getTime(),
        type: 'health',
        isActive: true,
        createdAt: now,
        trigger: 'pattern-based',
      })
    }

    return suggestions
  }

  // ━━━ NOTIFICATION WORKER ━━━
  private initNotificationWorker(): void {
    if (typeof Worker === 'undefined') {
      console.warn('Web Workers not supported, using polling instead')
      return
    }

    try {
      // Create worker from function
      const workerCode = `
        let reminders = [];
        
        self.onmessage = (e) => {
          const { type, reminders: newReminders } = e.data;
          
          if (type === 'update') {
            reminders = newReminders;
          }
          
          if (type === 'check') {
            const now = Date.now();
            const dueReminders = reminders.filter(r => 
              r.isActive && r.scheduledTime <= now
            );
            
            if (dueReminders.length > 0) {
              self.postMessage({ type: 'reminder', reminders: dueReminders });
            }
          }
        };
      `

      const blob = new Blob([workerCode], { type: 'application/javascript' })
      const workerUrl = URL.createObjectURL(blob)
      this.notificationWorker = new Worker(workerUrl)

      this.notificationWorker.onmessage = (e) => {
        if (e.data.type === 'reminder') {
          e.data.reminders.forEach((r: Reminder) => {
            this.showNotification(r)
          })
        }
      }
    } catch (error) {
      console.error('Failed to create worker:', error)
    }
  }

  // ━━━ CHECK & NOTIFY ━━━
  private startReminderCheck(): void {
    this.checkInterval = window.setInterval(() => {
      const now = Date.now()
      const dueReminders = this.reminders.filter(
        r => r.isActive && r.scheduledTime <= now && r.scheduledTime > now - 60000
      )

      dueReminders.forEach(r => {
        this.showNotification(r)
        r.isActive = false // Mark as shown
      })

      this.saveReminders()
    }, 60000) // Check every minute
  }

  // ━━━ SHOW NOTIFICATION ━━━
  private showNotification(reminder: Reminder): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(reminder.title, {
        body: reminder.description,
        icon: '🤖',
        tag: reminder.id,
      })
    }
  }

  // ━━━ SAVE/LOAD ━━━
  private saveReminders(): void {
    storageManager.saveData('jarvis_reminders', this.reminders).catch(console.error)
  }

  private loadReminders(): void {
    storageManager.getData('jarvis_reminders').then((data: any) => {
      if (data) this.reminders = data
    }).catch(console.error)
  }

  // ━━━ PERMISSION ━━━
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  // Get all reminders
  getReminders(): Reminder[] {
    return this.reminders
  }

  // Delete reminder
  deleteReminder(id: string): void {
    this.reminders = this.reminders.filter(r => r.id !== id)
    this.saveReminders()
  }

  // Update reminder
  updateReminder(id: string, updates: Partial<Reminder>): void {
    const reminder = this.reminders.find(r => r.id === id)
    if (reminder) {
      Object.assign(reminder, updates)
      this.saveReminders()
    }
  }
}

// ━━━ EXPORT SINGLETON ━━━
export const reminderManager = new ReminderManager()
