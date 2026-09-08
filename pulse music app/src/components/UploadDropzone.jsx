export function UploadDropzone({ onFiles, disabled }) {
  function handleFiles(list) {
    const files = [...list].filter((file) => file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|flac)$/i.test(file.name))
    if (files.length) onFiles(files)
  }

  return (
    <label
      className="block cursor-pointer rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-6 text-center transition hover:border-teal-300/50 hover:bg-white/8"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        if (!disabled) handleFiles(event.dataTransfer.files)
      }}
    >
      <input
        type="file"
        accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/mp4,audio/*"
        multiple
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          handleFiles(event.target.files)
          event.target.value = ''
        }}
      />
      <p className="text-sm font-medium text-white">Drop MP3s or click to upload</p>
      <p className="mt-1 text-xs text-white/50">Stored locally in IndexedDB — never leaves this browser</p>
    </label>
  )
}
