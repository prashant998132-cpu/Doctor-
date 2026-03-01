'use client'
import { useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export default function ParticlesBackground() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    initParticlesEngine(async (engine) => { await loadSlim(engine) }).then(() => setReady(true))
  }, [])
  if (!ready) return null
  return (
    <Particles id="tsparticles"
      options={{
        fpsLimit: 30,
        interactivity: { events: { onHover: { enable: true, mode: 'grab' }, onClick: { enable: true, mode: 'push' } }, modes: { grab: { distance: 120, links: { opacity: 0.4 } }, push: { quantity: 2 } } },
        particles: { number: { value: 50, density: { enable: true } }, color: { value: ['#ff1a88', '#7c3aed', '#00d4ff'] }, links: { enable: true, distance: 130, color: '#ff1a88', opacity: 0.15, width: 1 }, move: { enable: true, speed: 0.6, random: true }, opacity: { value: { min: 0.1, max: 0.4 } }, size: { value: { min: 1, max: 3 } }, shape: { type: 'circle' } },
        detectRetina: true,
      }}
      style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}
    />
  )
}
