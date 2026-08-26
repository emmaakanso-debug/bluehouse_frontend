import { formatTemp } from '../utils/format'
import { WeatherIcon } from './WeatherIcon'

export function CurrentWeather({ current, place, units, isFavorite, onToggleFavorite }) {
  const weather = current.weather[0]

  return (
    <section className="glass-card animate-fade-up rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Current weather</p>
          <h2 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">{place.label}</h2>
          <p className="mt-1 capitalize text-white/80">{weather.description}</p>
        </div>
        <button
          type="button"
          onClick={onToggleFavorite}
          className="glass-input rounded-full px-4 py-2 text-sm transition hover:bg-white/25"
        >
          {isFavorite ? '★ Saved' : '☆ Save city'}
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-6">
        <WeatherIcon weather={weather} className="h-28 w-28 drop-shadow-lg sm:h-32 sm:w-32" />
        <div>
          <p className="font-display text-7xl font-semibold leading-none sm:text-8xl">
            {formatTemp(current.main.temp, units)}
          </p>
          <p className="mt-3 text-lg text-white/80">
            Feels like {formatTemp(current.main.feels_like, units)}
          </p>
          <p className="text-sm text-white/70">
            H:{formatTemp(current.main.temp_max, units)} · L:{formatTemp(current.main.temp_min, units)}
          </p>
        </div>
      </div>
    </section>
  )
}
