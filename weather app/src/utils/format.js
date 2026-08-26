export function cToF(celsius) {
  return (celsius * 9) / 5 + 32
}

export function formatTemp(celsius, units) {
  const value = units === 'imperial' ? cToF(celsius) : celsius
  return `${Math.round(value)}°`
}

export function formatWind(metersPerSecond, units) {
  if (units === 'imperial') {
    return `${Math.round(metersPerSecond * 2.237)} mph`
  }
  return `${Math.round(metersPerSecond * 3.6)} km/h`
}

export function formatVisibility(meters, units) {
  if (units === 'imperial') {
    return `${(meters / 1609.34).toFixed(1)} mi`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

export function formatPressure(hPa) {
  return `${hPa} hPa`
}

export function cityTime(unixSeconds, timezoneOffset) {
  return new Date((unixSeconds + timezoneOffset) * 1000)
}

export function formatClock(unixSeconds, timezoneOffset) {
  const date = cityTime(unixSeconds, timezoneOffset)
  const hours = date.getUTCHours()
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${hour12}:${minutes} ${suffix}`
}

export function formatHour(unixSeconds, timezoneOffset) {
  const date = cityTime(unixSeconds, timezoneOffset)
  const hours = date.getUTCHours()
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${hour12} ${suffix}`
}

export function formatWeekday(unixSeconds, timezoneOffset) {
  const date = cityTime(unixSeconds, timezoneOffset)
  return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })
}

export function formatDateLabel(unixSeconds, timezoneOffset) {
  const date = cityTime(unixSeconds, timezoneOffset)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export function windDirection(degrees) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(degrees / 45) % 8]
}

export function groupDailyForecast(list, timezoneOffset) {
  const groups = new Map()

  for (const item of list) {
    const date = cityTime(item.dt, timezoneOffset)
    const key = date.toISOString().slice(0, 10)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(item)
  }

  return Array.from(groups.values())
    .slice(0, 5)
    .map((items) => {
      const temps = items.map((item) => item.main.temp)
      const midday =
        items.find((item) => {
          const hour = cityTime(item.dt, timezoneOffset).getUTCHours()
          return hour >= 11 && hour <= 14
        }) || items[Math.floor(items.length / 2)]

      return {
        dt: items[0].dt,
        min: Math.min(...temps),
        max: Math.max(...temps),
        weather: midday.weather[0],
        pop: Math.round(Math.max(...items.map((item) => item.pop || 0)) * 100),
      }
    })
}

export function placeId(place) {
  return `${place.name}|${place.country}|${place.lat.toFixed(2)}|${place.lon.toFixed(2)}`
}
