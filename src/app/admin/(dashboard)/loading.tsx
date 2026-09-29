/**
 * Shown the instant an admin link is clicked (and prefetched with the link),
 * while the page's data loads — so navigation never feels frozen.
 */
export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite" className="flex animate-pulse flex-col gap-8">
      <span className="sr-only">Memuat…</span>
      <div className="flex flex-col gap-3">
        <div className="h-8 w-56 rounded-xl bg-brand-100/70" />
        <div className="h-4 w-full max-w-md rounded-lg bg-brand-50" />
      </div>
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-soft">
        <div className="h-11 border-b border-line bg-surface-soft" />
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-6 border-b border-line px-5 py-4 last:border-0">
            <div className="h-4 flex-1 rounded-lg bg-brand-50" />
            <div className="h-4 w-24 rounded-lg bg-brand-50" />
            <div className="h-6 w-24 rounded-full bg-brand-50" />
            <div className="h-8 w-20 rounded-xl bg-brand-50" />
          </div>
        ))}
      </div>
    </div>
  )
}
