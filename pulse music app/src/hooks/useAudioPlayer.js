import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function useAudioPlayer() {
  const audioRef = useRef(null)
  const ctxRef = useRef(null)
  const analyserRef = useRef(null)
  const gainRef = useRef(null)
  const timeRef = useRef(0)
  const objectUrlRef = useRef(null)
  const loopRef = useRef({ enabled: false, start: 0, end: 0 })
  const playingRef = useRef(false)

  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolumeState] = useState(0.85)
  const [ready, setReady] = useState(false)
  const [trackId, setTrackId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    playingRef.current = playing
  }, [playing])

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.crossOrigin = 'anonymous'

    const AudioCtx = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioCtx()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 2048
    analyser.smoothingTimeConstant = 0.82
    const gain = ctx.createGain()
    gain.gain.value = 0.85
    const source = ctx.createMediaElementSource(audio)
    source.connect(analyser)
    analyser.connect(gain)
    gain.connect(ctx.destination)

    audioRef.current = audio
    ctxRef.current = ctx
    analyserRef.current = analyser
    gainRef.current = gain

    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => {
      setPlaying(false)
      setCurrentTime(audio.duration || 0)
    }

    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('durationchange', onMeta)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)

    let lastPublish = 0
    let raf = 0
    const tick = (now) => {
      const t = audio.currentTime || 0
      timeRef.current = t
      const loop = loopRef.current
      if (loop.enabled && t >= loop.end - 0.02) {
        audio.currentTime = loop.start
      }
      if (now - lastPublish > 50) {
        lastPublish = now
        setCurrentTime(t)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      audio.pause()
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('durationchange', onMeta)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      ctx.close()
    }
  }, [])

  const resumeCtx = useCallback(async () => {
    const ctx = ctxRef.current
    if (ctx && ctx.state === 'suspended') await ctx.resume()
  }, [])

  const loadTrack = useCallback(async (blob, id) => {
    const audio = audioRef.current
    if (!audio || !blob) return
    setError('')
    setReady(false)
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(blob)
    objectUrlRef.current = url

    await new Promise((resolve, reject) => {
      const ok = () => {
        audio.removeEventListener('error', fail)
        resolve()
      }
      const fail = () => {
        audio.removeEventListener('loadedmetadata', ok)
        reject(new Error('This file could not be decoded by the browser.'))
      }
      audio.addEventListener('loadedmetadata', ok, { once: true })
      audio.addEventListener('error', fail, { once: true })
      audio.src = url
      audio.load()
    }).catch((err) => {
      setError(err.message)
      throw err
    })

    setTrackId(id)
    setCurrentTime(0)
    timeRef.current = 0
    setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    setReady(true)
  }, [])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio?.src) return
    await resumeCtx()
    await audio.play()
  }, [resumeCtx])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(async () => {
    if (playingRef.current) pause()
    else await play()
  }, [pause, play])

  const seek = useCallback((seconds) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(seconds)) return
    const next = Math.max(0, Math.min(seconds, audio.duration || seconds))
    audio.currentTime = next
    timeRef.current = next
    setCurrentTime(next)
  }, [])

  const setVolume = useCallback((value) => {
    const next = Math.max(0, Math.min(1, value))
    setVolumeState(next)
    if (gainRef.current) gainRef.current.gain.value = next
    if (audioRef.current) audioRef.current.volume = 1
  }, [])

  const setLoopRegion = useCallback((enabled, start = 0, end = 0) => {
    loopRef.current = { enabled, start, end }
  }, [])

  return useMemo(
    () => ({
      analyserRef,
      ctxRef,
      timeRef,
      playing,
      duration,
      currentTime,
      volume,
      ready,
      trackId,
      error,
      loadTrack,
      play,
      pause,
      toggle,
      seek,
      setVolume,
      setLoopRegion,
      resumeCtx,
    }),
    [
      playing,
      duration,
      currentTime,
      volume,
      ready,
      trackId,
      error,
      loadTrack,
      play,
      pause,
      toggle,
      seek,
      setVolume,
      setLoopRegion,
      resumeCtx,
    ],
  )
}
