import { useEffect, useState } from 'react'
import { hasApiKey } from './api/weather'
import { CityChips } from './components/CityChips'
import { CurrentWeather } from './components/CurrentWeather'
import { DailyForecast } from './components/DailyForecast'
import { HourlyForecast } from './components/HourlyForecast'
import { SearchBar } from './components/SearchBar'
import { LoadingState, StatusCard } from './components/StatusCards'
import { UnitToggle } from './components/UnitToggle'
import { WeatherDetails } from './components/WeatherDetails'
import { WeatherEffects } from './components/WeatherEffects'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useWeather } from './hooks/useWeather'
import { placeId } from './utils/format'
import { getWeatherTheme } from './utils/weatherTheme'

const DEFAULT_CITY = {
  name: 'London',
  state: '',
  country: 'GB',
  lat: 51.5074,
  lon: -0.1278,
  label: 'London, GB',
}

export default function App() {
  const [units, setUnits] = useLocalStorage('weather-units', 'metric')
  const [favorites, setFavorites] = useLocalStorage('weather-favorites', [])
  const [recent, setRecent] = useLocalStorage('weather-recent', [])
  const [locating, setLocating] = useState(false)
  const { place, current, forecast, loading, error, setError, loadByCoords, loadByCity, refresh } =
    useWeather()

  const theme = getWeatherTheme(current)
  const favorite = place ? favorites.some((item) => placeId(item) === placeId(place)) : false

  useEffect(() => {
    if (!hasApiKey()) return
    detectLocation(true)
    // Startup geolocation / London fallback only.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function rememberPlace(nextPlace) {
    setRecent((list) => {
      const without = list.filter((item) => placeId(item) !== placeId(nextPlace))
      return [nextPlace, ...without].slice(0, 8)
    })
  }

  async function openPlace(nextPlace) {
    try {
      const resolved = await loadByCoords(nextPlace.lat, nextPlace.lon, nextPlace)
      rememberPlace(resolved)
    } catch {
      /* error is stored in useWeather */
    }
  }

  async function handleSearch(value) {
    try {
      const resolved =
        typeof value === 'string'
          ? await loadByCity(value)
          : await loadByCoords(value.lat, value.lon, value)
      rememberPlace(resolved)
    } catch (err) {
      setError(err.message)
    }
  }

  function detectLocation(allowFallback) {
    if (!navigator.geolocation) {
      if (allowFallback) openPlace(DEFAULT_CITY)
      else setError('Geolocation is not supported in this browser.')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const resolved = await loadByCoords(position.coords.latitude, position.coords.longitude)
          rememberPlace(resolved)
        } catch {
          if (allowFallback) await openPlace(DEFAULT_CITY)
        } finally {
          setLocating(false)
        }
      },
      async () => {
        setLocating(false)
        if (allowFallback) await openPlace(DEFAULT_CITY)
        else setError('Location access was blocked. Search for a city instead.')
      },
      { timeout: 8000 },
    )
  }

  function toggleFavorite() {
    if (!place) return
    setFavorites((list) => {
      const exists = list.some((item) => placeId(item) === placeId(place))
      if (exists) return list.filter((item) => placeId(item) !== placeId(place))
      return [place, ...list].slice(0, 12)
    })
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden transition-[background] duration-700"
      style={{ background: theme.gradient }}
    >
      <WeatherEffects effect={theme.effect} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(900px 420px at 85% -10%, ${theme.glow}, transparent 55%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/70">Weather Finder</p>
            <h1 className="font-display text-3xl font-semibold">Skyline</h1>
          </div>
          <div className="flex items-center gap-2">
            <UnitToggle units={units} onChange={setUnits} />
            <button
              type="button"
              onClick={() => refresh()}
              disabled={!place || loading}
              className="glass-input rounded-full px-4 py-2 text-sm disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </header>

        <div className="mb-6">
          <SearchBar
            onSelectCity={handleSearch}
            onUseLocation={() => detectLocation(false)}
            locating={locating}
          />
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-3">
            <CityChips
              title="Favorites"
              places={favorites}
              onSelect={openPlace}
              onRemove={(item) =>
                setFavorites((list) => list.filter((fav) => placeId(fav) !== placeId(item)))
              }
              emptyText="Save a city to jump back to it quickly."
            />
          </div>
          <CityChips
            title="Recent searches"
            places={recent}
            onSelect={openPlace}
            onRemove={(item) =>
              setRecent((list) => list.filter((entry) => placeId(entry) !== placeId(item)))
            }
            emptyText="Your recent cities will appear here."
          />
        </div>

        {!hasApiKey() && (
          <StatusCard
            title="Add your API key"
            message="Create a free key at openweathermap.org, put it in .env as VITE_OPENWEATHER_API_KEY, then restart npm run dev."
          />
        )}

        {hasApiKey() && error && !loading && (
          <div className="mb-6">
            <StatusCard title="Could not load weather" message={error} />
          </div>
        )}

        {hasApiKey() && loading && <LoadingState />}

        {hasApiKey() && current && forecast && place && !loading && (
          <div className="space-y-6">
            <CurrentWeather
              current={current}
              place={place}
              units={units}
              isFavorite={favorite}
              onToggleFavorite={toggleFavorite}
            />
            <WeatherDetails current={current} units={units} />
            <HourlyForecast forecast={forecast} units={units} />
            <DailyForecast forecast={forecast} units={units} />
          </div>
        )}

        <footer className="mt-10 text-center text-xs text-white/60">
          Weather data by OpenWeatherMap
        </footer>
      </div>
    </div>
  )
}
