export function WeatherEffects({ effect }) {
  if (effect === 'rain' || effect === 'thunder') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {effect === 'thunder' && (
          <div className="lightning-veil absolute inset-0 bg-white/40" />
        )}
        {Array.from({ length: 28 }, (_, index) => (
          <span
            key={index}
            className="raindrop"
            style={{
              left: `${(index * 3.7) % 100}%`,
              animationDuration: `${0.7 + (index % 5) * 0.18}s`,
              animationDelay: `${(index % 8) * 0.12}s`,
            }}
          />
        ))}
      </div>
    )
  }

  if (effect === 'snow') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 22 }, (_, index) => (
          <span
            key={index}
            className="snowflake"
            style={{
              left: `${(index * 4.6) % 100}%`,
              width: `${6 + (index % 4) * 2}px`,
              height: `${6 + (index % 4) * 2}px`,
              animationDuration: `${6 + (index % 6)}s`,
              animationDelay: `${(index % 7) * 0.3}s`,
            }}
          />
        ))}
      </div>
    )
  }

  if (effect === 'sun') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="sun-glow absolute -top-24 -right-16 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="sun-glow absolute top-10 right-10 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
      </div>
    )
  }

  if (effect === 'stars') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 24 }, (_, index) => (
          <span
            key={index}
            className="star"
            style={{
              top: `${(index * 17) % 80}%`,
              left: `${(index * 29) % 100}%`,
              animationDuration: `${2 + (index % 5)}s`,
            }}
          />
        ))}
      </div>
    )
  }

  if (effect === 'mist') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="cloud-blob top-24 left-10 h-32 w-80" />
        <div className="cloud-blob top-48 right-8 h-40 w-96" style={{ animationDuration: '22s' }} />
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="cloud-blob top-16 left-[8%] h-24 w-72" />
      <div className="cloud-blob top-32 right-[10%] h-28 w-80" style={{ animationDuration: '20s' }} />
    </div>
  )
}
