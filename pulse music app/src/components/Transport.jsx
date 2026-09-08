import { formatTime } from '../lib/formatTime'

export function Transport({
  playing,
  ready,
  currentTime,
  duration,
  volume,
  onToggle,
  onSeek,
  onPrev,
  onNext,
  onVolume,
  loopEnabled,
  onToggleLoop,
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex items-center gap-2">
        <button type="button" className="icon-btn" onClick={onPrev} aria-label="Previous track">
          ⏮
        </button>
        <button
          type="button"
          disabled={!ready}
          onClick={onToggle}
          className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-teal-300 to-fuchsia-400 text-lg font-bold text-slate-950 disabled:opacity-40"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '❚❚' : '▶'}
        </button>
        <button type="button" className="icon-btn" onClick={onNext} aria-label="Next track">
          ⏭
        </button>
      </div>

      <div className="min-w-[180px] flex-1">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.01}
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => onSeek(Number(event.target.value))}
          className="w-full accent-teal-300"
          disabled={!ready}
        />
        <div className="mt-1 flex justify-between font-mono text-[11px] text-white/50">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs text-white/60">
        Vol
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(event) => onVolume(Number(event.target.value))}
          className="w-24 accent-fuchsia-300"
        />
      </label>

      <button
        type="button"
        onClick={onToggleLoop}
        className={`rounded-full px-3 py-1 text-xs ${loopEnabled ? 'bg-amber-300/20 text-amber-100' : 'bg-white/10 text-white/60'}`}
      >
        Loop slice
      </button>
    </div>
  )
}
