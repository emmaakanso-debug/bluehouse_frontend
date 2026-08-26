import { formatDateLabel, formatTemp, formatWeekday, groupDailyForecast } from '../utils/format'
import { WeatherIcon } from './WeatherIcon'

export function DailyForecast({ forecast, units }) {
  const days = groupDailyForecast(forecast.list, forecast.city.timezone)

  return (
    <section className="animate-fade-up">
      <h3 className="mb-3 text-lg font-semibold">5-day forecast</h3>
      <div className="glass-card divide-y divide-white/15 rounded-3xl">
        {days.map((day, index) => (
          <article key={day.dt} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[140px_1fr_auto_auto]">
            <div>
              <p className="font-medium">{index === 0 ? 'Today' : formatWeekday(day.dt, forecast.city.timezone)}</p>
              <p className="text-xs text-white/65">{formatDateLabel(day.dt, forecast.city.timezone)}</p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <WeatherIcon weather={day.weather} className="h-9 w-9" />
              <span className="capitalize text-sm text-white/80">{day.weather.description}</span>
            </div>
            <WeatherIcon weather={day.weather} className="h-9 w-9 sm:hidden" />
            <p className="text-xs text-sky-100">{day.pop}%</p>
            <p className="text-right font-semibold">
              {formatTemp(day.max, units)}
              <span className="ml-2 font-normal text-white/65">{formatTemp(day.min, units)}</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
