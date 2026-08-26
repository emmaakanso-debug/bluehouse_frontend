export function StatusCard({ title, message, children }) {
  return (
    <div className="glass-card animate-fade-up rounded-3xl p-8 text-center">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-white/80">{message}</p>
      {children}
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="grid gap-4">
      <div className="glass-card h-56 animate-pulse rounded-3xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="glass-card h-24 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
