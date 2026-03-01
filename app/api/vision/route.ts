// app/api/vision/route.ts — JARVIS v7.0
import { NextRequest, NextResponse } from 'next/server'

const GEMINI_VISION_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType = 'image/jpeg', prompt = 'Yeh image mein kya hai? Hinglish mein batao. Koi interesting cheez ho toh zaroor mention karo.' } = await req.json()

    const key = process.env.GEMINI_API_KEY
    if (!key) return NextResponse.json({ error: 'No Gemini key' }, { status: 400 })
    if (!imageBase64) return NextResponse.json({ error: 'No image' }, { status: 400 })

    const res = await fetch(`${GEMINI_VISION_URL}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: imageBase64 } },
          ],
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
      }),
      signal: AbortSignal.timeout(12000),
    })

    if (!res.ok) throw new Error(`Vision API ${res.status}`)
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sir, image analyze nahi ho paya.'

    return NextResponse.json({ result: text })
  } catch {
    return NextResponse.json({ error: 'Vision analysis failed' }, { status: 500 })
  }
}
