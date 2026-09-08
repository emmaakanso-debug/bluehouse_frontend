function writeString(view, offset, text) {
  for (let i = 0; i < text.length; i += 1) {
    view.setUint8(offset + i, text.charCodeAt(i))
  }
}

export function sliceAudioBuffer(ctx, buffer, startSec, endSec) {
  const rate = buffer.sampleRate
  const start = Math.max(0, Math.floor(startSec * rate))
  const end = Math.min(buffer.length, Math.floor(endSec * rate))
  const length = Math.max(1, end - start)
  const sliced = ctx.createBuffer(buffer.numberOfChannels, length, rate)

  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    sliced.getChannelData(channel).set(buffer.getChannelData(channel).subarray(start, end))
  }

  return sliced
}

export function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const samples = buffer.length
  const bytesPerSample = 2
  const blockAlign = numChannels * bytesPerSample
  const dataSize = samples * blockAlign
  const arrayBuffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(arrayBuffer)

  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)

  const channels = Array.from({ length: numChannels }, (_, i) => buffer.getChannelData(i))
  let offset = 44
  for (let i = 0; i < samples; i += 1) {
    for (let c = 0; c < numChannels; c += 1) {
      const sample = Math.max(-1, Math.min(1, channels[c][i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      offset += 2
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' })
}

export function createDemoBuffer(ctx) {
  const duration = 18
  const rate = ctx.sampleRate
  const length = Math.floor(duration * rate)
  const buffer = ctx.createBuffer(2, length, rate)
  const left = buffer.getChannelData(0)
  const right = buffer.getChannelData(1)
  const notes = [220, 277.18, 329.63, 369.99, 329.63, 277.18, 246.94, 196]
  const beat = 0.45

  for (let i = 0; i < length; i += 1) {
    const t = i / rate
    const note = notes[Math.floor(t / beat) % notes.length]
    const env = Math.min(1, (t % beat) < 0.02 ? (t % beat) / 0.02 : 1) * Math.exp(-((t % beat) * 3.4))
    const bass = Math.sin(2 * Math.PI * (note / 2) * t) * 0.22 * env
    const lead = Math.sin(2 * Math.PI * note * t) * 0.38 * env
    const harm = Math.sin(2 * Math.PI * note * 2 * t) * 0.12 * env
    const noise = (Math.random() * 2 - 1) * 0.015 * env
    const pad = Math.sin(2 * Math.PI * (note * 1.5) * t) * 0.08 * (0.5 + 0.5 * Math.sin(t * 0.7))
    const sample = bass + lead + harm + noise + pad
    left[i] = sample
    right[i] = sample * 0.92 + Math.sin(2 * Math.PI * (note * 1.01) * t) * 0.08 * env
  }

  return buffer
}
