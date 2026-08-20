export function SearchBar({
  query,
  onQueryChange,
  mode,
  onModeChange,
  onSubmit,
  loading,
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      className="glass-panel rounded-3xl p-3 sm:p-4"
    >
      <div className="mb-3 flex gap-2">
        {[
          { id: 'recipe', label: 'Recipes' },
          { id: 'ingredient', label: 'Ingredients' },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onModeChange(option.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              mode === option.id
                ? 'bg-sage text-cream shadow-sm'
                : 'bg-white/40 text-sage-deep hover:bg-white/70'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="recipe-search">
          Search
        </label>
        <input
          id="recipe-search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={
            mode === 'ingredient'
              ? 'Try garlic, salmon, or chickpeas…'
              : 'Search pasta, curry, chocolate cake…'
          }
          className="min-h-12 flex-1 rounded-2xl border border-sage/15 bg-white/80 px-4 text-base outline-none ring-terracotta/40 placeholder:text-sage/50 focus:ring-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 rounded-2xl bg-terracotta px-6 font-semibold text-cream shadow-lg shadow-terracotta-deep/25 transition hover:bg-terracotta-deep disabled:opacity-60"
        >
          {loading ? 'Searching…' : 'Find recipes'}
        </button>
      </div>
    </form>
  )
}
