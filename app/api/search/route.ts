// app/api/search/route.ts — JARVIS v7.0
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')
    if (!query) return NextResponse.json({ error: 'No query' }, { status: 400 })

    // DuckDuckGo Instant Answer API — free, no key needed
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1&skip_disambig=1`,
      { signal: AbortSignal.timeout(6000) }
    )

    if (!res.ok) throw new Error('DDG failed')
    const data = await res.json()

    const results = {
      abstract: data.Abstract || '',
      abstractSource: data.AbstractSource || '',
      abstractURL: data.AbstractURL || '',
      answer: data.Answer || '',
      answerType: data.AnswerType || '',
      definition: data.Definition || '',
      heading: data.Heading || '',
      relatedTopics: (data.RelatedTopics || []).slice(0, 5).map((t: any) => ({
        text: t.Text || '',
        url: t.FirstURL || '',
      })).filter((t: any) => t.text),
    }

    return NextResponse.json(results)
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
