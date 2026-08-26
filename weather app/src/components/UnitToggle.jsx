export function UnitToggle({ units, onChange }) {
  return (
    <div className="glass-input flex rounded-full p-1 text-sm font-medium">
      <button
        type="button"
        onClick={() => onChange('metric')}
        className={`rounded-full px-3 py-1 transition ${
          units === 'metric' ? 'bg-white text-slate-800' : 'text-white/80'
        }`}
      >
        °C
      </button>
      <button
        type="button"
        onClick={() => onChange('imperial')}
        className={`rounded-full px-3 py-1 transition ${
          units === 'imperial' ? 'bg-white text-slate-800' : 'text-white/80'
        }`}
      >
        °F
      </button>
    </div>
  )
}
