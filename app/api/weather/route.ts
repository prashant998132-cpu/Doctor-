// app/api/weather/route.ts — JARVIS v7.0
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const city = searchParams.get('city')

    const key = process.env.WEATHER_API_KEY
    if (!key) {
      return NextResponse.json({ error: 'No weather key' }, { status: 400 })
    }

    const query = lat && lon ? `lat=${lat}&lon=${lon}` : `q=${city || 'Delhi'}`
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${key}&units=metric&lang=hi`,
      { signal: AbortSignal.timeout(5000) }
    )

    if (!res.ok) throw new Error(`Weather API ${res.status}`)
    const data = await res.json()

    return NextResponse.json({
      city: data.name,
      temp: Math.round(data.main.temp),
      feels: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      icon: data.weather[0].icon,
      wind: Math.round(data.wind.speed),
    })
  } catch {
    return NextResponse.json({ error: 'Weather fetch failed' }, { status: 500 })
  }
}
