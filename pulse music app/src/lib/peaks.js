export function computePeaks(audioBuffer, barCount = 900) {
  const data = audioBuffer.getChannelData(0)
  const count = Math.max(32, Math.min(barCount, data.length))
  const peaks = new Float32Array(count)
  const samplesPerBar = data.length / count
  const step = Math.max(1, Math.floor(samplesPerBar / 24))

  for (let i = 0; i < count; i += 1) {
    const start = Math.floor(i * samplesPerBar)
    const end = Math.min(data.length, Math.floor((i + 1) * samplesPerBar))
    let max = 0
    for (let j = start; j < end; j += step) {
      const v = Math.abs(data[j])
      if (v > max) max = v
    }
    peaks[i] = max
  }

  return peaks
}
