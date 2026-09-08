# Pulse — Interactive Audio Visualizer

A browser dashboard for local MP3 playlists, Web Audio analysis, and an interactive waveform you can scrub, slice, and annotate.

## What it does

- Upload audio files (MP3/WAV/OGG) and keep them in **IndexedDB** (blobs are too large for `localStorage`)
- Organize tracks into playlists persisted in **localStorage**
- Real-time **Canvas** visualizer driven by an `AnalyserNode` (`requestAnimationFrame`, not React state)
- Custom **`useAudioPlayer`** hook: media element source → analyser → gain → destination
- Waveform bar: seek, drag a slice region, or drop time-stamped notes
- **Slice selection** exports a new WAV track from the decoded `AudioBuffer`

## Run

```bash
npm install
npm run dev
```

Use **Load demo tone** if you want to try the visualizer without uploading a file.

## Shortcuts

- `Space` play/pause
- `←` / `→` seek 2 seconds
