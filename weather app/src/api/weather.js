const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const GEO_URL = 'https://api.openweathermap.org/geo/1.0'
const DATA_URL = 'https://api.openweathermap.org/data/2.5'

export function hasApiKey() {
  return Boolean(API_KEY && API_KEY !== 'your_openweathermap_api_key_here')
}

function requireKey() {
  if (!hasApiKey()) {
    throw new Error(
      'Add your OpenWeatherMap API key to the .env file as VITE_OPENWEATHER_API_KEY, then restart the dev server.',
    )
  }
}

async function request(url) {
  const response = await fetch(url)

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('The weather API key looks invalid. Check VITE_OPENWEATHER_API_KEY in .env.')
    }
    if (response.status === 404) {
      throw new Error('City not found. Try another spelling or include the country.')
    }
    throw new Error('Weather data is unavailable right now. Please try again.')
  }

  return response.json()
}

export async function searchCities(query) {
  requireKey()
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  const url = `${GEO_URL}/direct?q=${encodeURIComponent(trimmed)}&limit=6&appid=${API_KEY}`
  const results = await request(url)

  return results.map((place) => ({
    name: place.name,
    state: place.state || '',
    country: place.country,
    lat: place.lat,
    lon: place.lon,
    label: [place.name, place.state, place.country].filter(Boolean).join(', '),
  }))
}

export async function reverseGeocode(lat, lon) {
  requireKey()
  const url = `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
  const results = await request(url)
  const place = results[0]

  if (!place) {
    return {
      name: 'Current location',
      state: '',
      country: '',
      lat,
      lon,
      label: 'Current location',
    }
  }

  return {
    name: place.name,
    state: place.state || '',
    country: place.country,
    lat: place.lat,
    lon: place.lon,
    label: [place.name, place.state, place.country].filter(Boolean).join(', '),
  }
}

export async function getCurrentWeather(lat, lon) {
  requireKey()
  return request(`${DATA_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
}

export async function getForecast(lat, lon) {
  requireKey()
  return request(`${DATA_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
}

export async function getWeatherBundle(lat, lon) {
  const [current, forecast] = await Promise.all([
    getCurrentWeather(lat, lon),
    getForecast(lat, lon),
  ])
  return { current, forecast }
}
