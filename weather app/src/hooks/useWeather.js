import { useCallback, useState } from 'react'
import { getWeatherBundle, reverseGeocode, searchCities } from '../api/weather'

export function useWeather() {
  const [place, setPlace] = useState(null)
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadByCoords = useCallback(async (lat, lon, knownPlace) => {
    setLoading(true)
    setError('')

    try {
      const resolvedPlace = knownPlace || (await reverseGeocode(lat, lon))
      const bundle = await getWeatherBundle(lat, lon)
      setPlace(resolvedPlace)
      setCurrent(bundle.current)
      setForecast(bundle.forecast)
      return resolvedPlace
    } catch (err) {
      setError(err.message || 'Could not load weather.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const loadByCity = useCallback(
    async (query) => {
      setError('')
      const matches = await searchCities(query)
      if (!matches.length) {
        const message = 'City not found. Try another spelling or include the country.'
        setError(message)
        throw new Error(message)
      }
      const selected = matches[0]
      await loadByCoords(selected.lat, selected.lon, selected)
      return selected
    },
    [loadByCoords],
  )

  const refresh = useCallback(async () => {
    if (!place) return
    await loadByCoords(place.lat, place.lon, place)
  }, [loadByCoords, place])

  return {
    place,
    current,
    forecast,
    loading,
    error,
    setError,
    loadByCoords,
    loadByCity,
    refresh,
  }
}
