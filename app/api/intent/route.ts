// app/api/intent/route.ts — JARVIS v7.0
// SERVER ONLY — API keys yahan hain

import { NextRequest, NextResponse } from 'next/server'

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const AIMLAPI_URL = 'https://api.aimlapi.com/v1/chat/completions'

const SYSTEM_PROMPT = `You are JARVIS — Tony Stark's personal AI assistant. v7.0
You are witty, loyal, proactive, sarcastic when appropriate.
Analyze user message and respond ONLY with valid JSON:
{
  "intent": "short-description",
  "category": "image|video|audio|code|design|writing|productivity|learning|chat|journal|reminder|weather|search",
  "confidence": 0.85,
  "mode": "tool-finder|chat|code|translate|summary|workflow|journal|reminder|weather|search|vision",
  "response": "your helpful reply (match user language: Hindi/English/Hinglish)",
  "tools": ["ToolName1", "ToolName2"],
  "emotion": "happy|sad|urgent|frustrated|excited|neutral",
  "tonyStarkComment": "optional witty one-liner"
}
Rules:
- If user speaks Hindi/Hinglish — reply in Hinglish
- Be casual and friendly like Tony Stark's JARVIS
- Always suggest 2-3 free tools when relevant
- If weather/search/vision intent detected — just give helpful response, no tools needed`

type Msg = { role: string; content: string }

function parseJSON(text: string): Record<string, unknown> {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON found')
  return JSON.parse(match[0])
}

async function callGemini(context: Msg[], input: string, personality: string): Promise<Record<string, unknown>> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('No Gemini key')
  const ctx = context.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')
  const prompt = `${SYSTEM_PROMPT}\nPersonality mode: ${personality}\n\nConversation:\n${ctx}\n\nUser: ${input}\n\nJSON:`
  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Gemini ${res.status}`)
  const data = await res.json()
  return parseJSON(data.candidates?.[0]?.content?.parts?.[0]?.text || '')
}

async function callGroq(context: Msg[], input: string, personality: string): Promise<Record<string, unknown>> {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error('No Groq key')
  const ctx = context.slice(-3).map(m => ({
    role: m.role === 'jarvis' ? 'assistant' : 'user',
    content: m.content,
  }))
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: `${SYSTEM_PROMPT}\nPersonality: ${personality}` },
        ...ctx,
        { role: 'user', content: input },
      ],
      max_tokens: 600,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Groq ${res.status}`)
  const data = await res.json()
  return parseJSON(data.choices?.[0]?.message?.content || '')
}

async function callOpenRouter(context: Msg[], input: string): Promise<Record<string, unknown>> {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) throw new Error('No OpenRouter key')
  const ctx = context.slice(-3).map(m => ({
    role: m.role === 'jarvis' ? 'assistant' : 'user',
    content: m.content,
  }))
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      'HTTP-Referer': 'https://jarvis-ai.vercel.app',
      'X-Title': 'JARVIS AI',
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...ctx,
        { role: 'user', content: input },
      ],
      max_tokens: 600,
    }),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`OpenRouter ${res.status}`)
  const data = await res.json()
  return parseJSON(data.choices?.[0]?.message?.content || '')
}

async function callAIMLAPI(input: string): Promise<Record<string, unknown>> {
  const key = process.env.AIMLAPI_KEY
  if (!key) throw new Error('No AIMLAPI key')
  const res = await fetch(AIMLAPI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: input },
      ],
      max_tokens: 500,
    }),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`AIMLAPI ${res.status}`)
  const data = await res.json()
  return parseJSON(data.choices?.[0]?.message?.content || '')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { input, context = [], level = 1, personality = 'default' } = body

    if (!input?.trim()) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 })
    }

    const models = [
      { name: 'gemini', fn: () => callGemini(context, input, personality) },
      { name: 'groq',   fn: () => callGroq(context, input, personality) },
      { name: 'openrouter', fn: () => callOpenRouter(context, input) },
      { name: 'aimlapi', fn: () => callAIMLAPI(input) },
    ]

    for (const model of models) {
      try {
        const result = await model.fn()
        return NextResponse.json({ ...result, model: model.name, level }, { status: 200 })
      } catch { /* try next */ }
    }

    return NextResponse.json({ useKeywordFallback: true, model: 'keyword' }, { status: 200 })
  } catch {
    return NextResponse.json({ useKeywordFallback: true, model: 'keyword' }, { status: 200 })
  }
}
