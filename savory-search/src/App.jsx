import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  filterByCategory,
  filterByIngredient,
  getCategories,
  getMealById,
  getRandomMeal,
  searchMeals,
} from './api/meals.js'
import { CategoryChips } from './components/CategoryChips.jsx'
import { RecipeGrid } from './components/RecipeGrid.jsx'
import { RecipeModal } from './components/RecipeModal.jsx'
import { SearchBar } from './components/SearchBar.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'

const FEATURED_QUERIES = ['chicken', 'pasta', 'salad', 'dessert']

export default function App() {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('recipe')
  const [meals, setMeals] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [headline, setHeadline] = useState('Tonight’s table')
  const [selectedId, setSelectedId] = useState(null)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [favorites, setFavorites] = useLocalStorage('savory-favorites', {})

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const loadFeatured = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const seed = FEATURED_QUERIES[Math.floor(Math.random() * FEATURED_QUERIES.length)]
      const results = await searchMeals(seed)
      setMeals(results.slice(0, 9))
      setHeadline('Chef’s picks to start you off')
      setActiveCategory(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFeatured()
  }, [loadFeatured])

  async function runSearch() {
    const term = query.trim()
    if (!term) {
      loadFeatured()
      return
    }

    setLoading(true)
    setError('')
    setShowSavedOnly(false)
    try {
      const results =
        mode === 'ingredient' ? await filterByIngredient(term) : await searchMeals(term)
      setMeals(results)
      setHeadline(
        mode === 'ingredient'
          ? `Recipes with ${term}`
          : `Results for “${term}”`,
      )
      setActiveCategory(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCategory(category) {
    setActiveCategory(category)
    setShowSavedOnly(false)
    setQuery('')
    if (!category) {
      loadFeatured()
      return
    }
    setLoading(true)
    setError('')
    try {
      const results = await filterByCategory(category)
      setMeals(results)
      setHeadline(`${category} from the pantry`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function surpriseMe() {
    setLoading(true)
    setError('')
    try {
      const meal = await getRandomMeal()
      if (meal) {
        setSelectedId(meal.idMeal)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedId) {
      setSelectedMeal(null)
      return
    }

    let cancelled = false
    setModalLoading(true)
    getMealById(selectedId)
      .then((meal) => {
        if (!cancelled) setSelectedMeal(meal)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setModalLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [selectedId])

  function toggleFavorite(meal) {
    setFavorites((current) => {
      const next = { ...current }
      if (next[meal.idMeal]) {
        delete next[meal.idMeal]
      } else {
        next[meal.idMeal] = {
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
          strCategory: meal.strCategory,
          strArea: meal.strArea,
        }
      }
      return next
    })
  }

  const visibleMeals = useMemo(() => {
    if (!showSavedOnly) return meals
    return Object.values(favorites)
  }, [favorites, meals, showSavedOnly])

  const savedCount = Object.keys(favorites).length

  return (
    <div className="kitchen-mesh min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cream/80">
              Modern kitchen · TheMealDB
            </p>
            <h1 className="mt-2 font-display text-4xl text-cream sm:text-6xl">
              Savory Search
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-cream/85">
              Hunt by dish name or what’s already in the fridge. Open any recipe for the
              full method, then leave a kitchen review.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={surpriseMe}
              className="rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-sage-deep shadow-md"
            >
              Surprise me
            </button>
            <button
              type="button"
              onClick={() => setShowSavedOnly((value) => !value)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold ${
                showSavedOnly
                  ? 'bg-terracotta text-cream'
                  : 'bg-sage-deep/40 text-cream'
              }`}
            >
              Saved ({savedCount})
            </button>
          </div>
        </header>

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          mode={mode}
          onModeChange={setMode}
          onSubmit={runSearch}
          loading={loading}
        />

        <div className="mt-6">
          <CategoryChips
            categories={categories}
            active={activeCategory}
            onSelect={handleCategory}
          />
        </div>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-cream sm:text-3xl">
              {showSavedOnly ? 'Your saved plates' : headline}
            </h2>
            {loading ? (
              <span className="text-sm text-cream/75">Stirring the pot…</span>
            ) : null}
          </div>
          {error ? (
            <p className="mb-4 rounded-2xl bg-cream/90 px-4 py-3 text-terracotta-deep">{error}</p>
          ) : null}
          <RecipeGrid
            meals={visibleMeals}
            favorites={favorites}
            onOpen={(meal) => setSelectedId(meal.idMeal)}
            onToggleFavorite={toggleFavorite}
          />
        </section>
      </div>

      {selectedId ? (
        <RecipeModal
          meal={selectedMeal}
          loading={modalLoading}
          favorite={Boolean(favorites[selectedId])}
          onClose={() => setSelectedId(null)}
          onToggleFavorite={toggleFavorite}
        />
      ) : null}
    </div>
  )
}
