'use client'
import { useEffect, useRef, useState } from 'react'

const bootLines = [
  '> INITIALIZING JARVIS v6.0...',
  '> Loading AI models... ✓',
  '> Gemini Flash: CONNECTED ✓',
  '> Groq Llama3: CONNECTED ✓',
  '> OpenRouter: STANDBY ✓',
  '> AIMLAPI: STANDBY ✓',
  '> 145+ free tools: LOADED ✓',
  '> Emotion engine: ACTIVE ✓',
  '> Relationship system: ACTIVE ✓',
  '> Privacy mode: ON — zero server tracking ✓',
  '> HINDI + ENGLISH: READY ✓',
  '',
  '> JARVIS ONLINE 🤖',
]

export default function MatrixBoot({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'matrix' | 'text'>('matrix')
  const [textLines, setTextLines] = useState<string[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const chars = 'JARVIS01アイウエオカキクケコ日本語AI人工知能FREE₹0PRIVACY'
    const fontSize = 14
    const cols = Math.floor(canvas.width / fontSize)
    const drops = Array(cols).fill(0).map(() => Math.random() * -50)
    let frame = 0
    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px monospace`
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillStyle = i % 5 === 0 ? '#ff1a88' : 'rgba(255,26,136,0.4)'
        ctx.fillText(char, i * fontSize, y * fontSize)
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i] += 0.5
      })
      frame++
      if (frame > 120) { clearInterval(interval); setPhase('text') }
    }, 33)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (phase !== 'text') return
    let i = 0
    const interval = setInterval(() => {
      if (i < bootLines.length) { setTextLines(prev => [...prev, bootLines[i]]); i++ }
      else { clearInterval(interval); setTimeout(onDone, 600) }
    }, 180)
    return () => clearInterval(interval)
  }, [phase, onDone])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {phase === 'matrix' && <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />}
      {phase === 'text' && (
        <div style={{ fontFamily: 'Courier New, monospace', fontSize: 14, color: '#ff1a88', padding: 24, maxWidth: 500, width: '100%' }}>
          {textLines.map((line, i) => (
            <div key={i} style={{ marginBottom: 6, opacity: line ? 1 : 0.3 }}>{line || ' '}</div>
          ))}
          {textLines.length < bootLines.length && <span style={{ animation: 'blink 1s infinite' }}>█</span>}
        </div>
      )}
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  )
}
