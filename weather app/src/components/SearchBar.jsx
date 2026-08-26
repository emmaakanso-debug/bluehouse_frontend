import { useEffect, useRef, useState } from 'react'
import { searchCities } from '../api/weather'

export function SearchBar({ onSelectCity, onUseLocation, locating }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const boxRef = useRef(null)

  useEffect(() => {
    const handleClick = (event) => {
      if (!boxRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (query.trim().length < 2) {
      return undefined
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true)
        const results = await searchCities(query)
        setSuggestions(results)
        setOpen(true)
      } catch {
        setSuggestions([])
      } finally {
        setSearching(false)
      }
    }, 280)

    return () => clearTimeout(timer)
  }, [query])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!query.trim()) return
    await onSelectCity(query)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label className="glass-input flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-3">
          <svg className="h-5 w-5 shrink-0 opacity-80" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => suggestions.length && setOpen(true)}
            placeholder="Search for a city..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/70"
            aria-label="Search for a city"
          />
          {searching && <span className="text-xs text-white/70">Finding...</span>}
        </label>
        <button
          type="button"
          onClick={onUseLocation}
          disabled={locating}
          className="glass-input grid h-[50px] w-[50px] shrink-0 place-items-center rounded-2xl transition hover:bg-white/25 disabled:opacity-60"
          aria-label="Use current location"
          title="Use current location"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </form>

      {open && query.trim().length >= 2 && suggestions.length > 0 && (
        <ul className="glass-card absolute z-20 mt-2 w-full overflow-hidden rounded-2xl py-1">
          {suggestions.map((place) => (
            <li key={`${place.lat}-${place.lon}`}>
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-white/10"
                onClick={async () => {
                  await onSelectCity(place)
                  setQuery('')
                  setOpen(false)
                }}
              >
                <span>{place.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
