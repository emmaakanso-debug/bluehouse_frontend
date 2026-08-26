import { formatHour, formatTemp } from '../utils/format'
import { WeatherIcon } from './WeatherIcon'

export function HourlyForecast({ forecast, units }) {
  const items = forecast.list.slice(0, 8)
  const timezone = forecast.city.timezone

  return (
    <section className="animate-fade-up">
      <h3 className="mb-3 text-lg font-semibold">Hourly forecast</h3>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {items.map((item) => (
          <article
            key={item.dt}
            className="glass-card min-w-[92px] rounded-2xl px-3 py-4 text-center"
          >
            <p className="text-xs text-white/70">{formatHour(item.dt, timezone)}</p>
            <WeatherIcon weather={item.weather[0]} className="mx-auto mt-2 h-10 w-10" />
            <p className="mt-2 text-lg font-semibold">{formatTemp(item.main.temp, units)}</p>
            <p className="text-[11px] text-white/65">{Math.round((item.pop || 0) * 100)}%</p>
          </article>
        ))}
      </div>
    </section>
  )
}
