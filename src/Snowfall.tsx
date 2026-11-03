import { useEffect, useRef } from "react"

type Flake = {
  x: number
  y: number
  radius: number
  speed: number
  sway: number
  phase: number
  opacity: number
}

// Gentle full-page snowfall drawn on a canvas. It sits above the page but
// never blocks clicks, and stays still for people who prefer reduced motion.
export default function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    let flakes: Flake[] = []
    let frame = 0
    let width = 0
    let height = 0

    const makeFlake = (anywhere: boolean): Flake => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : -10,
      radius: 1 + Math.random() * 2.6,
      speed: 0.35 + Math.random() * 0.9,
      sway: 0.3 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.45 + Math.random() * 0.5,
    })

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const count = Math.round(Math.min(110, (width * height) / 14000))
      flakes = Array.from({ length: count }, () => makeFlake(true))
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      for (const flake of flakes) {
        if (!reduceMotion) {
          flake.y += flake.speed
          flake.x += Math.sin(time / 1400 + flake.phase) * flake.sway * 0.35
          if (flake.y > height + 10) Object.assign(flake, makeFlake(false))
          if (flake.x > width + 10) flake.x = -10
          if (flake.x < -10) flake.x = width + 10
        }
        context.beginPath()
        context.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        context.shadowColor = "rgba(42, 91, 192, 0.45)"
        context.shadowBlur = 4
        context.fill()
      }
      if (!reduceMotion) frame = requestAnimationFrame(draw)
    }

    resize()
    frame = requestAnimationFrame(draw)
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[35] h-full w-full"
      ref={canvasRef}
    />
  )
}
