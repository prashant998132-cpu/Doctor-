'use client'
import { useEffect, useRef } from 'react'

const STATS = [
  { label: 'Free Tools', value: 145, suffix: '+' },
  { label: 'Relationship Levels', value: 5 },
  { label: 'AI Models', value: 4 },
  { label: 'Cost', value: 0, prefix: '₹' },
]

function CountUp({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    import('countup.js').then(({ CountUp }) => {
      const counter = new CountUp(el, value, { duration: 2, useEasing: true, prefix, suffix })
      if (!counter.error) counter.start()
    })
  }, [value, suffix, prefix])
  return <span ref={ref}>0</span>
}

export default function LiveStats() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: '8px 16px' }}>
      {STATS.map(stat => (
        <div key={stat.label} className="glass" style={{ padding: '10px 16px', textAlign: 'center', minWidth: 80 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--pink)' }}>
            <CountUp value={stat.value} suffix={stat.suffix || ''} prefix={stat.prefix || ''} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
