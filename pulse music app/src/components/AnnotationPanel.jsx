import { uid } from '../lib/id'
import { formatTimeMs } from '../lib/formatTime'

export function AnnotationPanel({ track, onAdd, onUpdate, onRemove, onJump, playhead }) {
  if (!track) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/50">
        Select a track to leave time-stamped notes on the waveform.
      </div>
    )
  }

  const notes = track.annotations ?? []

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Annotations</h2>
        <button
          type="button"
          className="rounded-full bg-rose-400/20 px-3 py-1 text-xs text-rose-100 hover:bg-rose-400/30"
          onClick={() => {
            const text = window.prompt('Note at playhead')
            if (text) onAdd({ id: uid('note'), time: playhead, text })
          }}
        >
          Note @ playhead
        </button>
      </div>
      {notes.length === 0 && <p className="text-sm text-white/45">Click the waveform in Annotate mode, or add a note at the playhead.</p>}
      <ul className="space-y-2 overflow-auto">
        {notes.map((note) => (
          <li key={note.id} className="rounded-xl bg-black/25 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                className="font-mono text-xs text-teal-200 hover:underline"
                onClick={() => onJump(note.time)}
              >
                {formatTimeMs(note.time)}
              </button>
              <button
                type="button"
                className="text-[11px] text-rose-300"
                onClick={() => onRemove(note.id)}
              >
                Remove
              </button>
            </div>
            <p className="mt-1 text-sm text-white/80">{note.text}</p>
            <button
              type="button"
              className="mt-1 text-[11px] text-white/40 hover:text-white/70"
              onClick={() => {
                const text = window.prompt('Edit note', note.text)
                if (text != null) onUpdate(note.id, { text })
              }}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
