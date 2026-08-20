import { useEffect } from 'react'
import { parseIngredients, parseTags } from '../api/meals.js'
import { ReviewSection } from './ReviewSection.jsx'

export function RecipeModal({ meal, loading, favorite, onClose, onToggleFavorite }) {
  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const ingredients = meal ? parseIngredients(meal) : []
  const tags = meal ? parseTags(meal) : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-sage-deep/55 p-0 sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-title"
        className="modal-scroll max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-cream shadow-2xl sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        {loading || !meal ? (
          <div className="p-10 text-center text-sage">Pulling this plate from the kitchen…</div>
        ) : (
          <>
            <div className="relative">
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="h-56 w-full object-cover sm:h-72"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-deep/70 to-transparent" />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-sm font-semibold text-sage-deep"
              >
                Close
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <p className="text-sm font-medium uppercase tracking-wider text-cream/80">
                  {[meal.strArea, meal.strCategory].filter(Boolean).join(' · ')}
                </p>
                <h2 id="recipe-title" className="font-display text-3xl text-cream sm:text-4xl">
                  {meal.strMeal}
                </h2>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <div className="mb-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(meal)}
                  className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-cream"
                >
                  {favorite ? '♥ Saved to kitchen' : '♡ Save this recipe'}
                </button>
                {meal.strYoutube ? (
                  <a
                    href={meal.strYoutube}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-cream"
                  >
                    Watch on YouTube
                  </a>
                ) : null}
                {meal.strSource ? (
                  <a
                    href={meal.strSource}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-sage-deep"
                  >
                    Original source
                  </a>
                ) : null}
              </div>

              {tags.length ? (
                <div className="mb-6 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-brass/25 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sage-deep"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <h3 className="font-display text-2xl text-sage-deep">Ingredients</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {ingredients.map((item) => (
                  <li
                    key={`${item.ingredient}-${item.measure}`}
                    className="rounded-xl bg-white/70 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-sage-deep">{item.ingredient}</span>
                    {item.measure ? (
                      <span className="text-sage/70"> — {item.measure}</span>
                    ) : null}
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 font-display text-2xl text-sage-deep">Method</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-sage-deep/90">
                {meal.strInstructions}
              </p>

              <ReviewSection mealId={meal.idMeal} mealName={meal.strMeal} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
