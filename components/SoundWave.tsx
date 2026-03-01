'use client'
import { useEffect, useRef, useState } from 'react'

interface Props { isActive: boolean; bars?: number; height?: number }

export default function SoundWave({ isActive, bars = 20, height = 32 }: Props) {
  const [heights, setHeights] = useState<number[]>(Array(bars).fill(4))
  const animRef = useRef<number>()
  const streamRef = useRef<MediaStream>()

  useEffect(() => {
    if (!isActive) {
      cancelAnimationFrame(animRef.current!)
      streamRef.current?.getTracks().forEach(t => t.stop())
      setHeights(Array(bars).fill(4))
      return
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      streamRef.current = stream
      const ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 64
      source.connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)
      const animate = () => {
        analyser.getByteFrequencyData(data)
        setHeights(Array.from({ length: bars }, (_, i) => Math.max(4, (data[Math.floor((i / bars) * data.length)] / 255) * height)))
        animRef.current = requestAnimationFrame(animate)
      }
      animate()
    }).catch(() => {
      const animate = () => {
        setHeights(Array(bars).fill(0).map(() => Math.max(4, Math.random() * height * 0.6)))
        animRef.current = requestAnimationFrame(animate)
      }
      animate()
    })
    return () => { cancelAnimationFrame(animRef.current!); streamRef.current?.getTracks().forEach(t => t.stop()) }
  }, [isActive, bars, height])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height }}>
      {heights.map((h, i) => (
        <div key={i} style={{ width: 3, height: isActive ? h : 4, background: 'var(--pink)', borderRadius: 2, transition: `height ${isActive ? '0.1s' : '0.3s'} ease`, opacity: isActive ? 0.8 + (h / height) * 0.2 : 0.3 }} />
      ))}
    </div>
  )
}
