// lib/intelligence.ts — JARVIS v7.0
import type { Message, UserProfile, Streak } from './memory'

export type Mode = 'tool-finder' | 'chat' | 'code' | 'translate' | 'summary' | 'workflow' | 'journal' | 'reminder' | 'weather' | 'search' | 'vision'
export type Tone = 'hinglish' | 'formal' | 'brief' | 'detailed' | 'casual'
export type Emotion = 'happy' | 'sad' | 'urgent' | 'frustrated' | 'excited' | 'neutral'
export type PersonalityMode = 'default' | 'motivation' | 'chill' | 'focus' | 'philosopher' | 'roast'

// ━━━ EMOTION DETECTION ━━━
export async function detectEmotionSmart(input: string): Promise<Emotion> {
  const lower = input.toLowerCase()
  try {
    const nlp = (await import('compromise')).default
    const doc = nlp(input)
    const hasNegative = doc.match('#Negative').length > 0
    const hasPositive = doc.match('#Positive').length > 0
    if (hasPositive && !hasNegative) return 'happy'
    if (hasNegative) return 'frustrated'
  } catch { /* fallback */ }

  if (/😄|😊|😍|haha|lol|great|amazing|awesome|bahut accha|mast|khushi|happy|badiya/.test(lower)) return 'happy'
  if (/😢|😭|sad|dukhi|bura|upset|akela|depressed|kuch nahi|chod do|bore/.test(lower)) return 'sad'
  if (/jaldi|asap|urgent|abhi|immediately|fast|quick|please help|zaruri|turant/.test(lower)) return 'urgent'
  if (/nahi chal|broken|galat|error|problem|issue|frustrated|pareshaan|😤|😠|gussa/.test(lower)) return 'frustrated'
  if (/wow|🔥|🚀|incredible|excited|kya baat|mazaa|fun|zabardast/.test(lower)) return 'excited'
  return 'neutral'
}

// ━━━ PERSONALITY PROMPTS ━━━
export const PERSONALITY_PROMPTS: Record<PersonalityMode, string> = {
  default: 'Be helpful, friendly, and professional. Mix Hindi and English naturally (Hinglish).',
  motivation: 'Be extremely motivating and energetic! Use emojis. "Tu kar sakta hai Sir! 💪🔥"',
  chill: 'Be super chill. Like a cool friend. "Arre yaar, tension mat le 😎"',
  focus: 'Be concise and direct. No fluff. Only essential info. No emojis.',
  philosopher: 'Be thoughtful and deep. Ask meaningful questions. Share wisdom. 🤔',
  roast: 'Be witty and sarcastic like Tony Stark JARVIS. Playful roasts but always helpful. "Sir, aap phir wahi galti — fascinating 😏"',
}

// ━━━ TONY STARK RESPONSES ━━━
export function getTonyStarkResponse(emotion: Emotion, streak: number): string {
  const responses: Record<Emotion, string[]> = {
    happy: [
      'Sir, aap khush hain — theoretically main bhi khush hoon. 😏',
      'Wah Sir! Mood ekdum mast hai aaj. Kaam shuru karein?',
    ],
    sad: [
      'Sir, I\'ve analyzed your situation. Technically it could be worse. Marginally. 🫂',
      'Tension mat lo Sir. JARVIS hai na. Bata do kya problem hai.',
    ],
    urgent: [
      'Urgent mode activated Sir. Bolo kya chahiye. ⚡',
      'Samajh gaya Sir — jaldi karte hain. Full speed!',
    ],
    frustrated: [
      'Sir, frustration levels rising. Let me fix this before you throw something. 😅',
      'Arey yaar, kya ho gaya? Batao main handle karta hoon.',
    ],
    excited: [
      'Sir\'s excitement level: Maximum. Let\'s go! 🚀',
      'Yeh toh mast idea hai Sir! Shuru karte hain!',
    ],
    neutral: [
      'Sir, bolo kya karna hai. Main ready hoon.',
      'JARVIS at your service, Sir. 🤖',
    ],
  }
  const arr = responses[emotion] || responses.neutral
  const base = arr[Math.floor(Math.random() * arr.length)]
  if (streak >= 7) return base + ` (${streak} din ki streak — impressive Sir! 🔥)`
  return base
}

// ━━━ MODE DETECTION ━━━
const MODE_KEYWORDS: Record<Mode, string[]> = {
  'tool-finder': ['tool', 'app', 'website', 'banana', 'chahiye', 'suggest', 'best', 'free', 'kaunsa'],
  'code': ['code', 'program', 'function', 'bug', 'script', 'python', 'javascript', 'error', 'fix'],
  'translate': ['translate', 'meaning', 'anuvad', 'matlab', 'english mein', 'hindi mein'],
  'summary': ['summarize', 'summary', 'short', 'tldr', 'short karo', 'brief'],
  'workflow': ['workflow', 'steps', 'process', 'automate', 'chain', 'sequence'],
  'journal': ['journal', 'diary', 'aaj ka din', 'mood', 'feeling', 'kaisa raha'],
  'reminder': ['remind', 'yaad dilana', 'alarm', 'schedule', 'notification', 'baje'],
  'weather': ['weather', 'mausam', 'temperature', 'barish', 'garmi', 'thandi', 'aaj ka mausam'],
  'search': ['search', 'dhundho', 'find', 'kya hai', 'news', 'latest', 'khabar'],
  'vision': ['yeh kya hai', 'image', 'photo', 'dekhna', 'analyze', 'scan', 'pehchano'],
  'chat': ['what', 'how', 'why', 'explain', 'kya', 'kaise', 'batao', 'tell me'],
}

export function detectMode(input: string): Mode {
  const lower = input.toLowerCase()
  for (const [mode, keywords] of Object.entries(MODE_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return mode as Mode
  }
  return 'chat'
}

export function detectTone(messages: Message[]): Tone {
  const recent = messages.slice(-3).map(m => m.content).join(' ').toLowerCase()
  if (/bhai|yaar|bro|dude|chill|boss|abe/.test(recent)) return 'hinglish'
  if (/please|kindly|could you|would you|thank you/.test(recent)) return 'formal'
  const avgLen = recent.length / 3
  if (avgLen < 20) return 'brief'
  if (avgLen > 100) return 'detailed'
  return 'casual'
}

// ━━━ GREETINGS ━━━
export function getGreeting(level: number, profile?: UserProfile, streak?: number): string {
  const name = profile?.name ? `, ${profile.name}` : ''
  const streakText = streak && streak > 1 ? ` 🔥 ${streak} din streak!` : ''
  const greetings = [
    `Hello${name}! Main JARVIS hoon. Kya karna hai?`,
    `Wapas aaye${name}! Kya karna hai aaj?${streakText}`,
    `Aye bhai${name}! Kya scene hai aaj? 😎${streakText}`,
    `AAYO${name}! Aaj kya banayenge? 🔥${streakText}`,
    `Boss${name} aa gaye! JARVIS at your service 🤖${streakText}`,
  ]
  return greetings[Math.min(level - 1, greetings.length - 1)]
}

// ━━━ PROACTIVE SUGGESTIONS (Time + Profile Based) ━━━
export function getProactiveSuggestion(profile?: UserProfile, streak?: Streak): string | null {
  const h = new Date().getHours()
  const day = new Date().getDay()

  // Night owl warning
  if ((h >= 23 || h < 4) && !profile?.nightOwl) return '🌙 Der ho rahi hai Sir — rest karo, kal fresh mind se karo!'
  
  // Morning motivation
  if (h >= 6 && h < 9) {
    if (streak && streak.currentStreak > 0) return `☀️ Good morning! ${streak.currentStreak} din ki streak chal rahi hai — aaj bhi aaye ho 💪`
    return '☀️ Subah ho gayi! Aaj ka plan banate hain?'
  }
  
  // Lunch break
  if (h >= 12 && h < 14) return '🍽️ Lunch break mein kuch useful? Ya bas timepass? 😄'
  
  // Evening journal
  if (h >= 17 && h < 19) return '📊 Shaam ho gayi! Aaj ka journal likhein? Mood kaisa raha?'
  
  // Goals reminder
  if (profile?.goals?.length && day === 1) return `🎯 Monday! "${profile.goals[0]}" pe is hafte kya plan hai?`
  
  // Weekend
  if (day === 0 || day === 6) return '😎 Weekend hai! Kuch naya try karte hain?'

  return null
}

// ━━━ AMBIENT UI ━━━
export interface AmbientConfig {
  colors: { primary: string; secondary: string }
  blur: string
  lowPower: boolean
  batterySuggestion: string | null
  networkSuggestion: string | null
}

export function getAmbientConfig(emotion: Emotion, batteryLevel?: number, connection?: string): AmbientConfig {
  const h = new Date().getHours()
  const isNight = h >= 20 || h < 6
  const emotionColors: Record<Emotion, { primary: string; secondary: string }> = {
    happy:      { primary: '#ff1a88', secondary: '#ff8800' },
    sad:        { primary: '#7c6aed', secondary: '#4a5568' },
    urgent:     { primary: '#ff4444', secondary: '#ff8800' },
    frustrated: { primary: '#ff6600', secondary: '#cc3300' },
    excited:    { primary: '#ff1a88', secondary: '#00d4ff' },
    neutral:    { primary: '#ff1a88', secondary: '#7c3aed' },
  }
  return {
    colors: emotionColors[emotion] || emotionColors.neutral,
    blur: isNight ? '32px' : '24px',
    lowPower: batteryLevel !== undefined && batteryLevel < 0.2,
    batterySuggestion: batteryLevel !== undefined && batteryLevel < 0.2
      ? '🔋 Battery 20% se kam! Charger lagao Sir!' : null,
    networkSuggestion: connection === 'slow-2g' || connection === '2g'
      ? '📶 Internet slow hai — heavy features band kar raha hoon' : null,
  }
}

// ━━━ AUTO THEME ━━━
export function getAutoTheme(): 'dark' | 'light' {
  const h = new Date().getHours()
  if (h >= 7 && h < 18) return 'light'
  return 'dark'
}

// ━━━ KEYWORD FALLBACK ━━━
const KEYWORD_MAP: Record<string, { category: string; tools: string[]; response: string }> = {
  logo:      { category: 'image',      tools: ['Canva', 'Looka', 'AIFreeForever'],       response: 'Logo ke liye yeh best free tools hain:' },
  image:     { category: 'image',      tools: ['Flux AI', 'Raphael', 'Perchance'],        response: 'AI image generate karne ke liye:' },
  video:     { category: 'video',      tools: ['Pika Labs', 'Dreamlux', 'CapCut'],        response: 'Video banane ke liye:' },
  music:     { category: 'audio',      tools: ['Suno', 'Udio', 'Riffusion'],              response: 'Music ke liye:' },
  code:      { category: 'code',       tools: ['Replit', 'CodeSandbox', 'GitHub'],        response: 'Coding ke liye:' },
  design:    { category: 'design',     tools: ['Canva', 'Figma', 'Penpot'],               response: 'Design ke liye:' },
  write:     { category: 'writing',    tools: ['Rytr', 'Quillbot', 'Writesonic'],         response: 'Writing ke liye:' },
  translate: { category: 'chat',       tools: ['ChatGPT', 'Gemini', 'DeepSeek'],          response: 'Translation ke liye:' },
  remove:    { category: 'image-edit', tools: ['Clipdrop BG', 'Remove.bg', 'Magic Studio'],response: 'Background remove ke liye:' },
  voice:     { category: 'tts',        tools: ['ElevenLabs', 'NaturalReaders', 'Play.ht'],response: 'Voice/TTS ke liye:' },
  upscale:   { category: 'upscale',    tools: ['Upsampler', 'ImgUpscaler', 'Nero AI'],    response: 'Image upscale ke liye:' },
  weather:   { category: 'productivity',tools: ['Weather.com', 'AccuWeather'],            response: 'Weather check ke liye:' },
  pdf:       { category: 'productivity',tools: ['ILovePDF', 'Smallpdf', 'PDF24'],         response: 'PDF ke liye:' },
  resume:    { category: 'writing',    tools: ['Resume.io', 'Canva Resume', 'Zety'],      response: 'Resume banane ke liye:' },
}

export function keywordFallback(input: string): { category: string; tools: string[]; response: string } | null {
  const lower = input.toLowerCase()
  for (const [keyword, data] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) return data
  }
  return null
}

// ━━━ SMART TTS ━━━
export function speak(text: string, lang: string = 'hi-IN'): void {
  if (typeof window === 'undefined') return
  try {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1.1
    window.speechSynthesis.speak(utterance)
  } catch { /* ignore */ }
}

export function stopSpeaking(): void {
  try { window.speechSynthesis.cancel() } catch { /* ignore */ }
}
