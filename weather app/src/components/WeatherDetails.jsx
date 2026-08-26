import { formatClock, formatPressure, formatVisibility, formatWind, windDirection } from '../utils/format'

function Detail({ label, value }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wider text-white/65">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  )
}

export function WeatherDetails({ current, units }) {
  return (
    <section className="animate-fade-up">
      <h3 className="mb-3 text-lg font-semibold">Weather details</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Detail label="Humidity" value={`${current.main.humidity}%`} />
        <Detail
          label="Wind"
          value={`${formatWind(current.wind.speed, units)} ${windDirection(current.wind.deg || 0)}`}
        />
        <Detail label="Pressure" value={formatPressure(current.main.pressure)} />
        <Detail label="Visibility" value={formatVisibility(current.visibility || 0, units)} />
        <Detail label="Clouds" value={`${current.clouds?.all ?? 0}%`} />
        <Detail label="Sunrise" value={formatClock(current.sys.sunrise, current.timezone)} />
        <Detail label="Sunset" value={formatClock(current.sys.sunset, current.timezone)} />
        <Detail label="Condition" value={current.weather[0].main} />
      </div>
    </section>
  )
}
