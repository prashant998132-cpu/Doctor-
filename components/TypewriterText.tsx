'use client'
import { useState, useEffect, useRef } from 'react'

interface Props { text: string; speed?: number; onDone?: () => void }

export default function TypewriterText({ text, speed = 18, onDone }: Props) {
  const [displayed, setDisplayed] = useState('')
  const [cursor, setCursor] = useState(true)
  const idxRef = useRef(0)

  useEffect(() => {
    setDisplayed(''); idxRef.current = 0
    const interval = setInterval(() => {
      if (idxRef.current < text.length) { setDisplayed(text.slice(0, idxRef.current + 1)); idxRef.current++ }
      else { clearInterval(interval); setTimeout(() => setCursor(false), 800); onDone?.() }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, onDone])

  useEffect(() => {
    const blink = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(blink)
  }, [])

  return <span>{displayed}{cursor && <span style={{ color: 'var(--pink)', fontWeight: 'bold' }}>|</span>}</span>
}
