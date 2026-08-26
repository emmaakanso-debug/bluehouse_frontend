export function CityChips({ title, places, onSelect, onRemove, emptyText }) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/75">{title}</h3>
      {places.length === 0 ? (
        <p className="text-sm text-white/65">{emptyText}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {places.map((place) => (
            <div key={`${place.lat}-${place.lon}`} className="glass-input flex items-center rounded-full">
              <button
                type="button"
                onClick={() => onSelect(place)}
                className="px-3 py-1.5 text-sm"
              >
                {place.name}
              </button>
              {onRemove && (
                <button
                  type="button"
                  aria-label={`Remove ${place.name}`}
                  onClick={() => onRemove(place)}
                  className="pr-3 text-white/70 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
