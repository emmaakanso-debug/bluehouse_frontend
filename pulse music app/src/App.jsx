import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnnotationPanel } from './components/AnnotationPanel'
import { PlaylistSidebar } from './components/PlaylistSidebar'
import { Transport } from './components/Transport'
import { UploadDropzone } from './components/UploadDropzone'
import { Visualizer } from './components/Visualizer'
import { WaveformScrubber } from './components/WaveformScrubber'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useLibrary } from './hooks/useLibrary'
import { deleteTrackAssets, getFile, getPeaks, saveFile, savePeaks } from './lib/audioStore'
import { uid } from './lib/id'
import { computePeaks } from './lib/peaks'
import { audioBufferToWav, createDemoBuffer, sliceAudioBuffer } from './lib/wav'

export default function App() {
  const library = useLibrary()
  const player = useAudioPlayer()
  const [peaks, setPeaks] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [mode, setMode] = useState('seek')
  const [selection, setSelection] = useState(null)
  const [loopEnabled, setLoopEnabled] = useState(false)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const currentTrack = useMemo(
    () => library.tracks.find((track) => track.id === player.trackId) ?? null,
    [library.tracks, player.trackId],
  )

  useEffect(() => {
    if (loopEnabled && selection) player.setLoopRegion(true, selection.start, selection.end)
    else player.setLoopRegion(false, 0, 0)
  }, [loopEnabled, player.setLoopRegion, selection])

  useEffect(() => {
    function onKey(event) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
      if (event.code === 'Space') {
        event.preventDefault()
        player.toggle()
      } else if (event.code === 'ArrowRight') {
        player.seek(player.timeRef.current + 2)
      } else if (event.code === 'ArrowLeft') {
        player.seek(player.timeRef.current - 2)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [player.seek, player.timeRef, player.toggle])

  const decodePeaks = useCallback(async (id, blob, ctx) => {
    const cached = await getPeaks(id)
    if (cached) {
      setPeaks(cached)
      return
    }
    setAnalyzing(true)
    try {
      const copy = await blob.arrayBuffer()
      const buffer = await ctx.decodeAudioData(copy)
      const next = computePeaks(buffer)
      await savePeaks(id, next)
      setPeaks(next)
    } finally {
      setAnalyzing(false)
    }
  }, [])

  const openTrack = useCallback(
    async (track, autoplay = true) => {
      const blob = await getFile(track.id)
      if (!blob) {
        setStatus('Audio file missing from local storage.')
        return
      }
      setSelection(null)
      setLoopEnabled(false)
      await player.loadTrack(blob, track.id)
      const ctx = player.ctxRef.current
      if (ctx) await decodePeaks(track.id, blob, ctx)
      if (autoplay) await player.play()
    },
    [decodePeaks, player],
  )

  const ingestBlob = useCallback(
    async (blob, name, extra = {}) => {
      const id = uid('tr')
      await saveFile(id, blob)
      const ctx = player.ctxRef.current
      let duration = 0
      if (ctx) {
        try {
          const buffer = await ctx.decodeAudioData(await blob.arrayBuffer())
          duration = buffer.duration
          const nextPeaks = computePeaks(buffer)
          await savePeaks(id, nextPeaks)
        } catch {
          duration = 0
        }
      }
      const track = {
        id,
        name,
        duration,
        mimeType: blob.type || 'audio/mpeg',
        createdAt: Date.now(),
        annotations: [],
        ...extra,
      }
      library.addTrack(track)
      return track
    },
    [library, player],
  )

  async function handleFiles(files) {
    setBusy(true)
    setStatus('')
    try {
      let last = null
      for (const file of files) {
        last = await ingestBlob(file, file.name.replace(/\.[^.]+$/, ''))
      }
      if (last) await openTrack(last)
      setStatus(`Imported ${files.length} track${files.length === 1 ? '' : 's'}.`)
    } catch (err) {
      setStatus(err.message || 'Import failed.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDemo() {
    const ctx = player.ctxRef.current
    if (!ctx) {
      setStatus('Audio engine is still starting. Try again in a moment.')
      return
    }
    await player.resumeCtx()
    setBusy(true)
    try {
      const buffer = createDemoBuffer(ctx)
      const blob = audioBufferToWav(buffer)
      const track = await ingestBlob(blob, 'Pulse demo sequence', { isDemo: true })
      await openTrack(track)
    } finally {
      setBusy(false)
    }
  }

  async function handleSlice() {
    if (!currentTrack || !selection || selection.end - selection.start < 0.05) {
      setStatus('Drag a slice region on the waveform first.')
      return
    }
    const ctx = player.ctxRef.current
    const blob = await getFile(currentTrack.id)
    if (!ctx || !blob) return
    setBusy(true)
    try {
      const buffer = await ctx.decodeAudioData(await blob.arrayBuffer())
      const sliced = sliceAudioBuffer(ctx, buffer, selection.start, selection.end)
      const wav = audioBufferToWav(sliced)
      const track = await ingestBlob(wav, `${currentTrack.name} (${selection.start.toFixed(1)}–${selection.end.toFixed(1)}s)`, {
        isSlice: true,
        parentId: currentTrack.id,
      })
      await openTrack(track)
      setStatus('Slice saved as a new track.')
    } catch (err) {
      setStatus(err.message || 'Slice failed.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDeleteTrack(id) {
    if (player.trackId === id) {
      player.pause()
      setPeaks(null)
    }
    await deleteTrackAssets(id)
    library.removeTrack(id)
  }

  function skip(offset) {
    const list = library.visibleTracks
    if (!list.length) return
    const index = list.findIndex((track) => track.id === player.trackId)
    const next = list[(index + offset + list.length) % list.length]
    if (next) openTrack(next)
  }

  return (
    <div className="pulse-shell min-h-screen">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)_280px]">
        <header className="flex items-end justify-between gap-3 lg:col-span-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-teal-200/70">Web Audio dashboard</p>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Pulse</h1>
            <p className="mt-1 max-w-xl text-sm text-white/55">
              Upload tracks, organize local playlists, and scrub an interactive waveform — slice regions or drop time-stamped notes while the analyser paints the room.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDemo}
            disabled={busy}
            className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm hover:bg-white/12 disabled:opacity-50"
          >
            Load demo tone
          </button>
        </header>

        <section className="panel max-lg:order-2">
          <UploadDropzone onFiles={handleFiles} disabled={busy} />
          <div className="mt-4 min-h-[320px]">
            <PlaylistSidebar
              playlists={library.playlists}
              activePlaylist={library.activePlaylist}
              tracks={library.visibleTracks}
              currentTrackId={player.trackId}
              playing={player.playing}
              onSelectPlaylist={library.setActivePlaylist}
              onCreatePlaylist={library.createPlaylist}
              onRenamePlaylist={library.renamePlaylist}
              onDeletePlaylist={library.deletePlaylist}
              onSelectTrack={(track) => openTrack(track)}
              onRenameTrack={library.renameTrack}
              onDeleteTrack={handleDeleteTrack}
              onAddToPlaylist={library.addTrackToPlaylist}
            />
          </div>
        </section>

        <section className="space-y-4 max-lg:order-1">
          <div className="panel overflow-hidden p-3">
            <Visualizer analyserRef={player.analyserRef} playing={player.playing} />
          </div>

          <div className="panel space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="truncate text-sm font-medium">{currentTrack?.name ?? 'No track loaded'}</p>
              <div className="flex rounded-full bg-black/30 p-1 text-xs">
                {['seek', 'slice', 'annotate'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    className={`rounded-full px-3 py-1 capitalize ${mode === item ? 'bg-white/15 text-white' : 'text-white/50'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <WaveformScrubber
              peaks={peaks}
              duration={player.duration}
              timeRef={player.timeRef}
              annotations={currentTrack?.annotations ?? []}
              selection={selection}
              onSelectionChange={setSelection}
              onSeek={player.seek}
              onAnnotateAt={(time) => {
                const text = window.prompt('Annotation')
                if (text && currentTrack) {
                  library.addAnnotation(currentTrack.id, { id: uid('note'), time, text })
                }
              }}
              mode={mode}
              analyzing={analyzing}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSlice}
                disabled={busy || !selection}
                className="rounded-full bg-amber-300/20 px-4 py-2 text-sm text-amber-100 disabled:opacity-40"
              >
                Slice selection to new track
              </button>
              <button
                type="button"
                onClick={() => setSelection(null)}
                className="rounded-full bg-white/10 px-4 py-2 text-sm"
              >
                Clear slice
              </button>
            </div>
            {(status || player.error) && (
              <p className="text-xs text-amber-200/90">{player.error || status}</p>
            )}
          </div>

          <Transport
            playing={player.playing}
            ready={player.ready}
            currentTime={player.currentTime}
            duration={player.duration}
            volume={player.volume}
            onToggle={player.toggle}
            onSeek={player.seek}
            onPrev={() => skip(-1)}
            onNext={() => skip(1)}
            onVolume={player.setVolume}
            loopEnabled={loopEnabled}
            onToggleLoop={() => setLoopEnabled((value) => !value)}
          />
        </section>

        <section className="panel max-lg:order-3">
          <AnnotationPanel
            track={currentTrack}
            playhead={player.currentTime}
            onAdd={(note) => currentTrack && library.addAnnotation(currentTrack.id, note)}
            onUpdate={(id, patch) => currentTrack && library.updateAnnotation(currentTrack.id, id, patch)}
            onRemove={(id) => currentTrack && library.removeAnnotation(currentTrack.id, id)}
            onJump={player.seek}
          />
        </section>
      </div>
    </div>
  )
}
