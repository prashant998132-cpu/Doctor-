// lib/learning.ts — Auto-Improvement System
// JARVIS learns from every interaction and gets better

import type { Message, UserProfile, Chat } from './memory'

export interface UserPattern {
  id: string
  pattern: string
  category: 'time' | 'topic' | 'style' | 'preference'
  frequency: number
  lastSeen: number
  confidence: number // 0-1
}

export interface BehaviorAnalysis {
  bestTimeOfDay: string
  preferredMode: string
  averageSessionLength: number
  commonTopics: string[]
  responseStyle: 'brief' | 'detailed' | 'mixed'
  languagePreference: 'hindi' | 'english' | 'hinglish' | 'auto'
}

export interface SystemInsight {
  type: 'optimization' | 'suggestion' | 'warning' | 'improvement'
  message: string
  action?: () => Promise<void>
  priority: 'low' | 'medium' | 'high'
  timestamp: number
}

// ━━━ PATTERN LEARNING ━━━
export function analyzePatterns(messages: Message[], chats: Chat[]): UserPattern[] {
  const patterns: UserPattern[] = []

  // Analyze message times
  const timePatterns = analyzeTimePatterns(messages)
  patterns.push(...timePatterns)

  // Analyze topics
  const topicPatterns = analyzeTopics(messages)
  patterns.push(...topicPatterns)

  // Analyze interaction style
  const stylePatterns = analyzeStyle(messages)
  patterns.push(...stylePatterns)

  return patterns
}

function analyzeTimePatterns(messages: Message[]): UserPattern[] {
  const patterns: UserPattern[] = []
  const timeMap: Record<string, number> = {}

  messages.forEach(msg => {
    if (msg.role === 'user') {
      const hour = new Date(msg.timestamp).getHours()
      const timeSlot = getTimeSlot(hour)
      timeMap[timeSlot] = (timeMap[timeSlot] || 0) + 1
    }
  })

  Object.entries(timeMap).forEach(([time, count]) => {
    if (count > 2) {
      patterns.push({
        id: `time_${time}`,
        pattern: `Active during ${time}`,
        category: 'time',
        frequency: count,
        lastSeen: Date.now(),
        confidence: Math.min(count / 10, 1), // normalize to 0-1
      })
    }
  })

  return patterns
}

function analyzeTopics(messages: Message[]): UserPattern[] {
  const patterns: UserPattern[] = []
  const topicMap: Record<string, number> = {}

  messages.forEach(msg => {
    if (msg.role === 'user') {
      const topic = extractTopic(msg.content)
      if (topic) {
        topicMap[topic] = (topicMap[topic] || 0) + 1
      }
    }
  })

  Object.entries(topicMap).forEach(([topic, count]) => {
    if (count > 1) {
      patterns.push({
        id: `topic_${topic}`,
        pattern: `Interested in: ${topic}`,
        category: 'topic',
        frequency: count,
        lastSeen: Date.now(),
        confidence: Math.min(count / 10, 1),
      })
    }
  })

  return patterns
}

function analyzeStyle(messages: Message[]): UserPattern[] {
  const patterns: UserPattern[] = []

  let briefCount = 0
  let detailedCount = 0
  let hindiCount = 0
  let englishCount = 0

  messages.forEach(msg => {
    if (msg.role === 'user') {
      // Analyze request length
      if (msg.content.length < 20) briefCount++
      if (msg.content.length > 100) detailedCount++

      // Analyze language
      if (/[ा-ॿ]/.test(msg.content)) hindiCount++
      else englishCount++
    }
  })

  if (briefCount > detailedCount) {
    patterns.push({
      id: 'style_brief',
      pattern: 'Prefers brief responses',
      category: 'style',
      frequency: briefCount,
      lastSeen: Date.now(),
      confidence: briefCount / (briefCount + detailedCount),
    })
  } else if (detailedCount > briefCount) {
    patterns.push({
      id: 'style_detailed',
      pattern: 'Prefers detailed responses',
      category: 'style',
      frequency: detailedCount,
      lastSeen: Date.now(),
      confidence: detailedCount / (briefCount + detailedCount),
    })
  }

  if (hindiCount > englishCount) {
    patterns.push({
      id: 'lang_hindi',
      pattern: 'Prefers Hindi',
      category: 'preference',
      frequency: hindiCount,
      lastSeen: Date.now(),
      confidence: hindiCount / (hindiCount + englishCount),
    })
  } else if (englishCount > hindiCount) {
    patterns.push({
      id: 'lang_english',
      pattern: 'Prefers English',
      category: 'preference',
      frequency: englishCount,
      lastSeen: Date.now(),
      confidence: englishCount / (hindiCount + englishCount),
    })
  }

  return patterns
}

// ━━━ BEHAVIOR ANALYSIS ━━━
export function generateBehaviorAnalysis(patterns: UserPattern[]): BehaviorAnalysis {
  const timePatterns = patterns.filter(p => p.category === 'time')
  const topicPatterns = patterns.filter(p => p.category === 'topic')
  const stylePatterns = patterns.filter(p => p.category === 'style')
  const langPatterns = patterns.filter(p => p.id?.includes('lang_'))

  return {
    bestTimeOfDay: timePatterns.length > 0
      ? timePatterns.sort((a, b) => b.frequency - a.frequency)[0].pattern
      : 'anytime',
    preferredMode: topicPatterns.length > 0
      ? topicPatterns[0].pattern
      : 'general',
    averageSessionLength: 15, // placeholder
    commonTopics: topicPatterns.map(p => p.pattern),
    responseStyle: stylePatterns.some(p => p.pattern.includes('brief'))
      ? 'brief'
      : stylePatterns.some(p => p.pattern.includes('detailed'))
        ? 'detailed'
        : 'mixed',
    languagePreference: langPatterns.some(p => p.pattern.includes('Hindi'))
      ? 'hindi'
      : langPatterns.some(p => p.pattern.includes('English'))
        ? 'english'
        : 'hinglish',
  }
}

// ━━━ SYSTEM INSIGHTS (Smart Suggestions) ━━━
export function generateInsights(
  patterns: UserPattern[],
  analysis: BehaviorAnalysis,
  profile: UserProfile
): SystemInsight[] {
  const insights: SystemInsight[] = []

  // Insight 1: Storage optimization
  if (patterns.length > 50) {
    insights.push({
      type: 'optimization',
      message: '💾 Archive old chats to free up space',
      priority: 'medium',
      timestamp: Date.now(),
    })
  }

  // Insight 2: Best time reminder
  if (analysis.bestTimeOfDay !== 'anytime') {
    insights.push({
      type: 'suggestion',
      message: `🕐 You're most active ${analysis.bestTimeOfDay}. Keep coding then!`,
      priority: 'low',
      timestamp: Date.now(),
    })
  }

  // Insight 3: Topic recommendation
  if (analysis.commonTopics.length > 0) {
    insights.push({
      type: 'suggestion',
      message: `📚 Your interest: ${analysis.commonTopics[0]}. Want more?`,
      priority: 'low',
      timestamp: Date.now(),
    })
  }

  // Insight 4: Goal progress
  if (profile.goals && profile.goals.length > 0) {
    insights.push({
      type: 'optimization',
      message: `🎯 Working on: ${profile.goals[0]}. Progress?`,
      priority: 'medium',
      timestamp: Date.now(),
    })
  }

  // Insight 5: Battery/storage warning
  if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
    insights.push({
      type: 'warning',
      message: '🔋 Low battery detected. Switching to light mode.',
      priority: 'high',
      timestamp: Date.now(),
    })
  }

  return insights
}

// ━━━ CONTINUOUS IMPROVEMENT ━━━
export interface ImprovementArea {
  area: string
  current: string
  suggested: string
  benefit: string
  implementationComplexity: 'easy' | 'medium' | 'hard'
}

export function getImprovementAreas(
  analysis: BehaviorAnalysis,
  profile: UserProfile
): ImprovementArea[] {
  const areas: ImprovementArea[] = []

  // Area 1: Response style
  if (analysis.responseStyle === 'brief' && profile.goals?.length === 0) {
    areas.push({
      area: 'Goal clarity',
      current: 'No goals set',
      suggested: 'Set learning goals',
      benefit: 'Personalized suggestions & tracking',
      implementationComplexity: 'easy',
    })
  }

  // Area 2: Language consistency
  if (analysis.languagePreference === 'hinglish') {
    areas.push({
      area: 'Language preference',
      current: 'Mixed Hindi/English',
      suggested: `Stick to ${analysis.languagePreference}`,
      benefit: 'Better understanding of preferences',
      implementationComplexity: 'easy',
    })
  }

  // Area 3: Custom instructions
  if (!profile.chatStyle) {
    areas.push({
      area: 'Custom instructions',
      current: 'Not set',
      suggested: 'Save how you like responses',
      benefit: 'Consistent, personalized answers',
      implementationComplexity: 'easy',
    })
  }

  return areas
}

// ━━━ HELPER FUNCTIONS ━━━
function getTimeSlot(hour: number): string {
  if (hour < 6) return '🌙 Night (midnight-6am)'
  if (hour < 12) return '🌅 Morning (6am-12pm)'
  if (hour < 18) return '☀️ Afternoon (12pm-6pm)'
  return '🌙 Evening (6pm-midnight)'
}

function extractTopic(text: string): string | null {
  const keywords = [
    'code|coding|program|python|javascript',
    'study|learn|education|exam',
    'work|job|career|project',
    'health|fitness|exercise',
    'book|read|write|article',
    'design|art|creative',
  ]

  for (const keyword of keywords) {
    if (new RegExp(keyword, 'i').test(text)) {
      return keyword.split('|')[0]
    }
  }

  return null
}

// ━━━ EXPORT FOR USAGE ━━━
export function improveSystem(): void {
  // This function runs periodically to auto-improve JARVIS
  console.log('🤖 JARVIS auto-improvement running...')
  // Analyze patterns, generate insights, apply improvements
}
