import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

export function ReviewSection({ mealId, mealName }) {
  const storageKey = `savory-reviews-${mealId}`
  const [reviews, setReviews] = useLocalStorage(storageKey, [])
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(5)

  const average =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  function handleSubmit(event) {
    event.preventDefault()
    if (!comment.trim()) return

    setReviews([
      {
        id: crypto.randomUUID(),
        name: name.trim() || 'Kitchen guest',
        comment: comment.trim(),
        rating,
        createdAt: new Date().toISOString(),
      },
      ...reviews,
    ])
    setName('')
    setComment('')
    setRating(5)
  }

  return (
    <section className="mt-8 border-t border-sage/15 pt-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl text-sage-deep">Reviews</h3>
          <p className="text-sm text-sage/80">
            {reviews.length === 0
              ? `Be the first to review ${mealName}.`
              : `${average.toFixed(1)} average · ${reviews.length} review${reviews.length === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-2xl bg-sage/5 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-sage-deep">Your rating</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-xl ${star <= rating ? 'text-terracotta' : 'text-sage/30'}`}
                aria-label={`${star} star${star === 1 ? '' : 's'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className="w-full rounded-xl border border-sage/15 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-terracotta/40"
        />
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          required
          rows={3}
          placeholder="How did this plate turn out?"
          className="w-full rounded-xl border border-sage/15 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-terracotta/40"
        />
        <button
          type="submit"
          className="rounded-xl bg-sage px-4 py-2 text-sm font-semibold text-cream hover:bg-sage-deep"
        >
          Post review
        </button>
      </form>

      <ul className="space-y-3">
        {reviews.map((review) => (
          <li key={review.id} className="rounded-2xl bg-white/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-sage-deep">{review.name}</p>
              <p className="text-sm text-terracotta">{'★'.repeat(review.rating)}</p>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-sage-deep/85">{review.comment}</p>
            <p className="mt-2 text-xs text-sage/60">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
