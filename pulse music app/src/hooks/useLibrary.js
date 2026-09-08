import { useCallback, useMemo } from 'react'
import { uid } from '../lib/id'
import { useLocalStorage } from './useLocalStorage'

const DEFAULT = {
  playlists: [{ id: 'library', name: 'Library' }],
  tracks: [],
  activePlaylistId: 'library',
}

export function useLibrary() {
  const [data, setData] = useLocalStorage('pulse-library-v1', DEFAULT)

  const activePlaylist = useMemo(
    () => data.playlists.find((item) => item.id === data.activePlaylistId) ?? data.playlists[0],
    [data],
  )

  const visibleTracks = useMemo(() => {
    if (!activePlaylist) return data.tracks
    if (activePlaylist.id === 'library') return data.tracks
    const ids = new Set(activePlaylist.trackIds ?? [])
    return data.tracks.filter((track) => ids.has(track.id))
  }, [activePlaylist, data.tracks])

  const setActivePlaylist = useCallback(
    (id) => setData((prev) => ({ ...prev, activePlaylistId: id })),
    [setData],
  )

  const createPlaylist = useCallback(
    (name) => {
      const playlist = { id: uid('pl'), name: name.trim() || 'Untitled', trackIds: [] }
      setData((prev) => ({
        ...prev,
        playlists: [...prev.playlists, playlist],
        activePlaylistId: playlist.id,
      }))
      return playlist
    },
    [setData],
  )

  const renamePlaylist = useCallback(
    (id, name) => {
      setData((prev) => ({
        ...prev,
        playlists: prev.playlists.map((item) =>
          item.id === id ? { ...item, name: name.trim() || item.name } : item,
        ),
      }))
    },
    [setData],
  )

  const deletePlaylist = useCallback(
    (id) => {
      if (id === 'library') return
      setData((prev) => ({
        ...prev,
        playlists: prev.playlists.filter((item) => item.id !== id),
        activePlaylistId: prev.activePlaylistId === id ? 'library' : prev.activePlaylistId,
      }))
    },
    [setData],
  )

  const addTrack = useCallback(
    (track, playlistId) => {
      setData((prev) => {
        const targetId = playlistId || prev.activePlaylistId
        return {
          ...prev,
          tracks: [track, ...prev.tracks],
          playlists: prev.playlists.map((item) => {
            if (item.id === 'library') return item
            if (item.id !== targetId) return item
            return { ...item, trackIds: [track.id, ...(item.trackIds ?? [])] }
          }),
        }
      })
    },
    [setData],
  )

  const removeTrack = useCallback(
    (id) => {
      setData((prev) => ({
        ...prev,
        tracks: prev.tracks.filter((track) => track.id !== id),
        playlists: prev.playlists.map((item) => ({
          ...item,
          trackIds: (item.trackIds ?? []).filter((trackId) => trackId !== id),
        })),
      }))
    },
    [setData],
  )

  const renameTrack = useCallback(
    (id, name) => {
      setData((prev) => ({
        ...prev,
        tracks: prev.tracks.map((track) =>
          track.id === id ? { ...track, name: name.trim() || track.name } : track,
        ),
      }))
    },
    [setData],
  )

  const addAnnotation = useCallback(
    (trackId, annotation) => {
      setData((prev) => ({
        ...prev,
        tracks: prev.tracks.map((track) =>
          track.id === trackId
            ? {
                ...track,
                annotations: [...(track.annotations ?? []), annotation].sort((a, b) => a.time - b.time),
              }
            : track,
        ),
      }))
    },
    [setData],
  )

  const updateAnnotation = useCallback(
    (trackId, annotationId, patch) => {
      setData((prev) => ({
        ...prev,
        tracks: prev.tracks.map((track) =>
          track.id === trackId
            ? {
                ...track,
                annotations: (track.annotations ?? []).map((item) =>
                  item.id === annotationId ? { ...item, ...patch } : item,
                ),
              }
            : track,
        ),
      }))
    },
    [setData],
  )

  const removeAnnotation = useCallback(
    (trackId, annotationId) => {
      setData((prev) => ({
        ...prev,
        tracks: prev.tracks.map((track) =>
          track.id === trackId
            ? {
                ...track,
                annotations: (track.annotations ?? []).filter((item) => item.id !== annotationId),
              }
            : track,
        ),
      }))
    },
    [setData],
  )

  const addTrackToPlaylist = useCallback(
    (trackId, playlistId) => {
      setData((prev) => ({
        ...prev,
        playlists: prev.playlists.map((item) => {
          if (item.id !== playlistId || item.id === 'library') return item
          const ids = item.trackIds ?? []
          if (ids.includes(trackId)) return item
          return { ...item, trackIds: [...ids, trackId] }
        }),
      }))
    },
    [setData],
  )

  return {
    playlists: data.playlists,
    tracks: data.tracks,
    activePlaylist,
    visibleTracks,
    setActivePlaylist,
    createPlaylist,
    renamePlaylist,
    deletePlaylist,
    addTrack,
    removeTrack,
    renameTrack,
    addAnnotation,
    updateAnnotation,
    removeAnnotation,
    addTrackToPlaylist,
  }
}
