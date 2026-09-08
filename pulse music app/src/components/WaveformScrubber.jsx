import { useEffect, useRef } from 'react'
import { formatTime } from '../lib/formatTime'

export function WaveformScrubber({
  peaks,
  duration,
  timeRef,
  annotations = [],
  selection,
  onSelectionChange,
  onSeek,
  onAnnotateAt,
  mode,
  analyzing,
}) {
  const canvasRef = useRef(null)
  const dragRef = useRef(null)

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
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#0a0c14'
      ctx.fillRect(0, 0, width, height)

      const mid = height / 2
      if (peaks && peaks.length) {
        const barW = width / peaks.length
        for (let i = 0; i < peaks.length; i += 1) {
          const amp = peaks[i]
          const h = Math.max(2, amp * (height * 0.86))
          ctx.fillStyle = i % 2 === 0 ? '#2dd4bf' : '#67e8f9'
          ctx.globalAlpha = 0.55 + amp * 0.45
          ctx.fillRect(i * barW, mid - h / 2, Math.max(1, barW - 0.6), h)
        }
        ctx.globalAlpha = 1
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.35)'
        ctx.font = '13px Outfit, sans-serif'
        ctx.fillText(analyzing ? 'Decoding waveform…' : 'Load a track to see its waveform', 16, mid + 4)
      }

      const t = timeRef?.current ?? 0
      const progress = duration > 0 ? Math.min(1, t / duration) : 0
      ctx.fillStyle = 'rgba(232, 121, 249, 0.16)'
      ctx.fillRect(0, 0, width * progress, height)

      if (selection && duration > 0) {
        const x1 = (selection.start / duration) * width
        const x2 = (selection.end / duration) * width
        ctx.fillStyle = 'rgba(250, 204, 21, 0.22)'
        ctx.fillRect(x1, 0, x2 - x1, height)
        ctx.fillStyle = '#facc15'
        ctx.fillRect(x1 - 1, 0, 3, height)
        ctx.fillRect(x2 - 1, 0, 3, height)
      }

      ctx.fillStyle = '#f8fafc'
      ctx.fillRect(width * progress - 1, 0, 2, height)

      for (const note of annotations) {
        if (!duration) break
        const x = (note.time / duration) * width
        ctx.fillStyle = '#fb7185'
        ctx.beginPath()
        ctx.moveTo(x, 8)
        ctx.lineTo(x + 6, 18)
        ctx.lineTo(x - 6, 18)
        ctx.closePath()
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [peaks, duration, timeRef, annotations, selection, analyzing])

  function timeFromEvent(event) {
    const rect = canvasRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    return ratio * (duration || 0)
  }

  function handlePointerDown(event) {
    if (!duration) return
    canvasRef.current.setPointerCapture(event.pointerId)
    const time = timeFromEvent(event)
    if (mode === 'annotate') {
      onAnnotateAt?.(time)
      return
    }
    if (mode === 'slice') {
      dragRef.current = { start: time, current: time }
      onSelectionChange?.({ start: time, end: time })
      return
    }
    onSeek?.(time)
    dragRef.current = { seeking: true }
  }

  function handlePointerMove(event) {
    if (!dragRef.current || !duration) return
    const time = timeFromEvent(event)
    if (dragRef.current.seeking) {
      onSeek?.(time)
      return
    }
    const start = Math.min(dragRef.current.start, time)
    const end = Math.max(dragRef.current.start, time)
    dragRef.current.current = time
    onSelectionChange?.({ start, end })
  }

  function handlePointerUp() {
    dragRef.current = null
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="h-28 w-full cursor-ew-resize rounded-xl sm:h-32"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        aria-label="Interactive waveform scrubber"
      />
      <div className="mt-2 flex justify-between font-mono text-[11px] text-white/50">
        <span>0:00</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
