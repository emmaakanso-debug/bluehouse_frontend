import { useEffect, useRef } from 'react'

const BAR_COUNT = 96

export function Visualizer({ analyserRef, playing }) {
  const canvasRef = useRef(null)
  const freqRef = useRef(null)
  const waveRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    let raf = 0

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const analyser = analyserRef.current
      ctx.clearRect(0, 0, width, height)

      const bg = ctx.createLinearGradient(0, 0, width, height)
      bg.addColorStop(0, '#0b1020')
      bg.addColorStop(1, '#120818')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, width, height)

      if (analyser) {
        if (!freqRef.current || freqRef.current.length !== analyser.frequencyBinCount) {
          freqRef.current = new Uint8Array(analyser.frequencyBinCount)
          waveRef.current = new Uint8Array(analyser.fftSize)
        }
        analyser.getByteFrequencyData(freqRef.current)
        analyser.getByteTimeDomainData(waveRef.current)

        const freq = freqRef.current
        const wave = waveRef.current
        const bass = (freq[2] + freq[4] + freq[8]) / 3 / 255
        const glow = ctx.createRadialGradient(
          width * 0.5,
          height * 0.62,
          10,
          width * 0.5,
          height * 0.62,
          width * (0.28 + bass * 0.22),
        )
        glow.addColorStop(0, `rgba(232, 121, 249, ${0.12 + bass * 0.28})`)
        glow.addColorStop(0.45, `rgba(45, 212, 191, ${0.08 + bass * 0.16})`)
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, width, height)

        const gap = 3
        const barWidth = (width - gap * (BAR_COUNT - 1)) / BAR_COUNT
        const step = Math.floor(freq.length / BAR_COUNT)
        for (let i = 0; i < BAR_COUNT; i += 1) {
          let sum = 0
          for (let j = 0; j < step; j += 1) sum += freq[i * step + j]
          const value = sum / step / 255
          const h = Math.max(4, value * height * 0.78)
          const x = i * (barWidth + gap)
          const y = height - h - 12
          const grad = ctx.createLinearGradient(0, y, 0, height)
          grad.addColorStop(0, '#5eead4')
          grad.addColorStop(0.55, '#22d3ee')
          grad.addColorStop(1, '#c026d3')
          ctx.fillStyle = grad
          ctx.globalAlpha = 0.35 + value * 0.65
          ctx.fillRect(x, y, barWidth, h)
        }
        ctx.globalAlpha = 1

        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = 'rgba(255,255,255,0.82)'
        const slice = width / wave.length
        for (let i = 0; i < wave.length; i += 1) {
          const v = wave[i] / 128
          const y = (v * height) / 2.6 + height * 0.18
          if (i === 0) ctx.moveTo(0, y)
          else ctx.lineTo(i * slice, y)
        }
        ctx.stroke()
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 48) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [analyserRef, playing])

  return (
    <canvas
      ref={canvasRef}
      className="h-[260px] w-full rounded-2xl sm:h-[320px]"
      aria-label="Realtime frequency and waveform visualizer"
    />
  )
}
