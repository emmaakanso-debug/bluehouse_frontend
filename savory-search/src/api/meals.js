const BASE = 'https://www.themealdb.com/api/json/v1/1'

async function getJson(path) {
  const response = await fetch(`${BASE}${path}`)
  if (!response.ok) {
    throw new Error('Could not reach the recipe kitchen. Try again in a moment.')
  }
  return response.json()
}

export async function searchMeals(query) {
  const data = await getJson(`/search.php?s=${encodeURIComponent(query)}`)
  return data.meals ?? []
}

export async function filterByIngredient(ingredient) {
  const data = await getJson(`/filter.php?i=${encodeURIComponent(ingredient)}`)
  return data.meals ?? []
}

export async function filterByCategory(category) {
  const data = await getJson(`/filter.php?c=${encodeURIComponent(category)}`)
  return data.meals ?? []
}

export async function getMealById(id) {
  const data = await getJson(`/lookup.php?i=${id}`)
  return data.meals?.[0] ?? null
}

export async function getRandomMeal() {
  const data = await getJson('/random.php')
  return data.meals?.[0] ?? null
}

export async function getCategories() {
  const data = await getJson('/categories.php')
  return data.categories ?? []
}

export function parseIngredients(meal) {
  const items = []
  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`]?.trim()
    const measure = meal[`strMeasure${i}`]?.trim() ?? ''
    if (ingredient) {
      items.push({ ingredient, measure })
    }
  }
  return items
}

export function parseTags(meal) {
  return (meal.strTags ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}
