import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import useStore from '../../store/useStore'

/**
 * The ticker box that sits at the top of every symbol-scoped page
 * (Fundamentals, Filings, Analyst Coach).
 *
 * Three pages had grown their own copy of this and they had already drifted —
 * different placeholder, different capitalisation handling, one of them not
 * offering recents at all. One component keeps them identical and means a
 * change to how symbols are entered happens once.
 *
 * The submitted value is uppercased and trimmed: the backend routes are
 * case-sensitive on the path segment and " aapl " is a very easy thing to
 * paste.
 */
export default function SymbolPicker({
  value,
  onSubmit,
  placeholder = 'Symbol (e.g. AAPL, MSFT, BHP.AX)',
  label,
  suggestions,
}) {
  const [input, setInput] = useState(value || '')
  const recentlyViewed = useStore((s) => s.recentlyViewed)
  const watchlist = useStore((s) => s.watchlist)

  // Keep the box in step when the symbol changes from outside (a chip click,
  // a URL parameter), without stealing what the user is mid-way through typing.
  useEffect(() => {
    setInput(value || '')
  }, [value])

  const submit = (e) => {
    e?.preventDefault?.()
    const next = (input || '').trim().toUpperCase()
    if (next) onSubmit(next)
  }

  // Recents first, then the watchlist — the two lists overlap heavily, so
  // de-duplicate before capping rather than after, or the row silently holds
  // fewer than it looks like it should.
  const quick = suggestions ?? [
    ...new Set([
      ...(recentlyViewed || []),
      ...(watchlist || []).map((w) => w.symbol).filter(Boolean),
    ]),
  ].slice(0, 8)

  return (
    <div className="mb-4">
      {label && <div className="section-label mb-1.5">{label}</div>}
      <form onSubmit={submit} className="flex items-center gap-2">
        <div className="relative flex-1" style={{ maxWidth: 360 }}>
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="input"
            style={{ paddingLeft: 34 }}
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Stock symbol"
          />
        </div>
        <button type="submit" className="btn btn-primary">Load</button>
      </form>

      {quick.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {quick.map((sym) => (
            <button
              key={sym}
              onClick={() => onSubmit(sym)}
              className={`chip font-mono${sym === value ? ' is-active' : ''}`}
            >
              {sym}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
