// components/AnimatedGlassBackground.tsx
'use client'
import { useEffect, useRef } from 'react'

export function AnimatedGlassBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Animation state
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      hue: number
    }> = []

    // Create initial particles
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: Math.random() * 100 + 50,
        hue: 200 + Math.random() * 60, // Blue-purple range
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      // Clear with dark background
      ctx.fillStyle = '#05050f'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        // Update position
        p.x += p.vx
        p.y += p.vy
        p.life--

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 150)
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${p.life / 150})`)
        gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 40%, ${p.life / 300})`)
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 20%, 0)`)

        ctx.fillStyle = gradient
        ctx.fillRect(p.x - 150, p.y - 150, 300, 300)

        // Remove dead particles and add new ones
        if (p.life <= 0) {
          particles.splice(i, 1)
          if (particles.length < 5) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              vx: (Math.random() - 0.5) * 0.5,
              vy: (Math.random() - 0.5) * 0.5,
              life: 100,
              hue: 200 + Math.random() * 60,
            })
          }
        }
      }

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i]
          const p2 = particles[j]
          const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y)

          if (distance < 300) {
            const alpha = (1 - distance / 300) * 0.3
            ctx.strokeStyle = `rgba(138, 43, 226, ${alpha})`
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
