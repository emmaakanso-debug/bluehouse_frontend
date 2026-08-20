import { RecipeCard } from './RecipeCard.jsx'

export function RecipeGrid({ meals, favorites, onOpen, onToggleFavorite }) {
  if (!meals.length) {
    return (
      <div className="glass-panel rounded-3xl px-6 py-16 text-center">
        <p className="font-display text-2xl text-sage-deep">No plates on this table yet</p>
        <p className="mt-2 text-sage/80">
          Try another recipe name, an ingredient, or pick a category above.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {meals.map((meal) => (
        <RecipeCard
          key={meal.idMeal}
          meal={meal}
          favorite={Boolean(favorites[meal.idMeal])}
          onOpen={onOpen}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
