export function RecipeCard({ meal, favorite, onOpen, onToggleFavorite }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-cream/90 shadow-lg shadow-sage-deep/15 ring-1 ring-white/40 transition hover:-translate-y-1 hover:shadow-xl">
      <button type="button" onClick={() => onOpen(meal)} className="block w-full text-left">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {meal.strCategory ? (
            <span className="absolute left-3 top-3 rounded-full bg-sage/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream">
              {meal.strCategory}
            </span>
          ) : null}
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold leading-snug text-sage-deep">
            {meal.strMeal}
          </h3>
          {meal.strArea ? (
            <p className="mt-1 text-sm text-sage/80">{meal.strArea} kitchen</p>
          ) : (
            <p className="mt-1 text-sm text-sage/80">Tap for the full plate</p>
          )}
        </div>
      </button>
      <div className="flex items-center justify-between border-t border-sage/10 px-4 py-3">
        <button
          type="button"
          onClick={() => onOpen(meal)}
          className="text-sm font-semibold text-terracotta hover:text-terracotta-deep"
        >
          View recipe
        </button>
        <button
          type="button"
          aria-label={favorite ? 'Remove from saved' : 'Save recipe'}
          onClick={() => onToggleFavorite(meal)}
          className={`rounded-full px-3 py-1 text-sm ${
            favorite ? 'bg-terracotta/15 text-terracotta-deep' : 'bg-sage/10 text-sage'
          }`}
        >
          {favorite ? '♥ Saved' : '♡ Save'}
        </button>
      </div>
    </article>
  )
}
