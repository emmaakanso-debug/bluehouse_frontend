import { formatTime } from '../lib/formatTime'

export function PlaylistSidebar({
  playlists,
  activePlaylist,
  tracks,
  currentTrackId,
  playing,
  onSelectPlaylist,
  onCreatePlaylist,
  onRenamePlaylist,
  onDeletePlaylist,
  onSelectTrack,
  onRenameTrack,
  onDeleteTrack,
  onAddToPlaylist,
}) {
  return (
    <aside className="flex h-full flex-col gap-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Playlists</h2>
          <button
            type="button"
            className="rounded-full bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20"
            onClick={() => {
              const name = window.prompt('Playlist name')
              if (name) onCreatePlaylist(name)
            }}
          >
            New
          </button>
        </div>
        <ul className="space-y-1">
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <button
                type="button"
                onClick={() => onSelectPlaylist(playlist.id)}
                onDoubleClick={() => {
                  if (playlist.id === 'library') return
                  const name = window.prompt('Rename playlist', playlist.name)
                  if (name) onRenamePlaylist(playlist.id, name)
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm ${
                  activePlaylist?.id === playlist.id ? 'bg-teal-400/20 text-teal-100' : 'text-white/70 hover:bg-white/8'
                }`}
              >
                <span>{playlist.name}</span>
                {playlist.id !== 'library' && (
                  <span
                    role="button"
                    tabIndex={0}
                    className="text-xs text-white/40 hover:text-rose-300"
                    onClick={(event) => {
                      event.stopPropagation()
                      onDeletePlaylist(playlist.id)
                    }}
                  >
                    ✕
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="min-h-0 flex-1 overflow-auto pr-1">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Tracks</h2>
        {tracks.length === 0 && (
          <p className="text-sm text-white/45">No tracks in this playlist yet.</p>
        )}
        <ul className="space-y-1">
          {tracks.map((track) => (
            <li key={track.id}>
              <button
                type="button"
                onClick={() => onSelectTrack(track)}
                className={`w-full rounded-xl px-3 py-2 text-left ${
                  currentTrackId === track.id ? 'bg-fuchsia-500/20 ring-1 ring-fuchsia-300/40' : 'hover:bg-white/8'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">
                    {currentTrackId === track.id && playing ? '▶ ' : ''}
                    {track.name}
                  </p>
                  <span className="shrink-0 font-mono text-[11px] text-white/45">{formatTime(track.duration)}</span>
                </div>
                <div className="mt-1 flex gap-2 text-[11px] text-white/40">
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation()
                      const name = window.prompt('Rename track', track.name)
                      if (name) onRenameTrack(track.id, name)
                    }}
                  >
                    Rename
                  </span>
                  {playlists
                    .filter((item) => item.id !== 'library')
                    .map((playlist) => (
                      <span
                        key={playlist.id}
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.stopPropagation()
                          onAddToPlaylist(track.id, playlist.id)
                        }}
                      >
                        + {playlist.name}
                      </span>
                    ))}
                  <span
                    role="button"
                    tabIndex={0}
                    className="ml-auto text-rose-300/80"
                    onClick={(event) => {
                      event.stopPropagation()
                      onDeleteTrack(track.id)
                    }}
                  >
                    Delete
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
