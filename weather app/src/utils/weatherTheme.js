const themes = {
  thunder: {
    gradient: 'linear-gradient(160deg, #1b1140 0%, #312e81 48%, #0f172a 100%)',
    effect: 'thunder',
    glow: 'rgba(167, 139, 250, 0.35)',
  },
  drizzle: {
    gradient: 'linear-gradient(160deg, #334155 0%, #1e3a5f 50%, #164e63 100%)',
    effect: 'rain',
    glow: 'rgba(125, 211, 252, 0.28)',
  },
  rain: {
    gradient: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 46%, #155e75 100%)',
    effect: 'rain',
    glow: 'rgba(56, 189, 248, 0.3)',
  },
  snow: {
    gradient: 'linear-gradient(160deg, #64748b 0%, #94a3b8 42%, #e2e8f0 100%)',
    effect: 'snow',
    glow: 'rgba(255, 255, 255, 0.45)',
  },
  mist: {
    gradient: 'linear-gradient(160deg, #57534e 0%, #78716c 48%, #a8a29e 100%)',
    effect: 'mist',
    glow: 'rgba(226, 232, 240, 0.28)',
  },
  clearDay: {
    gradient: 'linear-gradient(160deg, #0ea5e9 0%, #38bdf8 38%, #fbbf24 100%)',
    effect: 'sun',
    glow: 'rgba(251, 191, 36, 0.45)',
  },
  clearNight: {
    gradient: 'linear-gradient(160deg, #020617 0%, #1e1b4b 50%, #312e81 100%)',
    effect: 'stars',
    glow: 'rgba(129, 140, 248, 0.35)',
  },
  cloudsDay: {
    gradient: 'linear-gradient(160deg, #64748b 0%, #7dd3fc 45%, #93c5fd 100%)',
    effect: 'clouds',
    glow: 'rgba(255, 255, 255, 0.3)',
  },
  cloudsNight: {
    gradient: 'linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    effect: 'clouds',
    glow: 'rgba(148, 163, 184, 0.28)',
  },
  default: {
    gradient: 'linear-gradient(160deg, #0369a1 0%, #1d4ed8 50%, #4f46e5 100%)',
    effect: 'clouds',
    glow: 'rgba(147, 197, 253, 0.3)',
  },
}

export function getWeatherTheme(current) {
  if (!current?.weather?.[0]) return themes.default

  const id = current.weather[0].id
  const isNight = String(current.weather[0].icon).endsWith('n')

  if (id >= 200 && id < 300) return themes.thunder
  if (id >= 300 && id < 400) return themes.drizzle
  if (id >= 500 && id < 600) return themes.rain
  if (id >= 600 && id < 700) return themes.snow
  if (id >= 700 && id < 800) return themes.mist
  if (id === 800) return isNight ? themes.clearNight : themes.clearDay
  if (id > 800) return isNight ? themes.cloudsNight : themes.cloudsDay
  return themes.default
}

export function iconKind(weather) {
  const id = weather?.id
  const isNight = String(weather?.icon || '').endsWith('n')

  if (id >= 200 && id < 300) return 'thunder'
  if (id >= 300 && id < 500) return 'drizzle'
  if (id >= 500 && id < 600) return 'rain'
  if (id >= 600 && id < 700) return 'snow'
  if (id >= 700 && id < 800) return 'mist'
  if (id === 800) return isNight ? 'clear-night' : 'clear-day'
  if (id === 801 || id === 802) return isNight ? 'partly-night' : 'partly-day'
  return isNight ? 'clouds-night' : 'clouds'
}
