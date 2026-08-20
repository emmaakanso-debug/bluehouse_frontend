export function CategoryChips({ categories, active, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
          !active
            ? 'bg-cream text-sage-deep'
            : 'bg-sage-deep/25 text-cream hover:bg-sage-deep/40'
        }`}
      >
        All kitchens
      </button>
      {categories.slice(0, 12).map((category) => (
        <button
          key={category.idCategory}
          type="button"
          onClick={() => onSelect(category.strCategory)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            active === category.strCategory
              ? 'bg-cream text-sage-deep'
              : 'bg-sage-deep/25 text-cream hover:bg-sage-deep/40'
          }`}
        >
          {category.strCategory}
        </button>
      ))}
    </div>
  )
}
