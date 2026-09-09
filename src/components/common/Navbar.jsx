// App chrome. Deliberately two different shells rather than one responsive bar:
//
//  • ≥1024px — a fixed left rail (Sidebar.jsx) carries the brand and all nine
//    destinations; this top bar keeps only the tools that act on the page you
//    are already on: market, search, theme, density, lock.
//  • <1024px — a compact top bar showing only where you are plus the two
//    controls you actually reach for (market, search), with navigation moved
//    to a native-style bottom tab bar. Search opens as a full-screen sheet
//    instead of trying to live in a 90px-wide box.
import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Search, X, Lock, ArrowLeft, MoreHorizontal } from 'lucide-react'
import useStore from '../../store/useStore'
import { stocksAPI } from '../../utils/api'
import { LogoMark } from './Logo'
import { truncate } from '../../utils/formatters'
import { NAV_LINKS, PRIMARY_TABS } from './navLinks'
import ThemeMenu from './ThemeMenu'
import DensityToggle from './DensityToggle'

function useSymbolSearch(activeMarket) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)

  const run = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    const res = await stocksAPI.search(q, activeMarket)
    setLoading(false)
    const items = Array.isArray(res?.result) ? res.result : Array.isArray(res) ? res : []
    setResults(items.slice(0, 8))
  }, [activeMarket])

  const onChange = (v) => {
    setQuery(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => run(v), 300)
  }

  const reset = () => {
    setQuery('')
    setResults([])
    setLoading(false)
  }

  return { query, results, loading, onChange, reset }
}

function ResultRow({ item, active, onSelect, onHover }) {
  return (
    <button
      onMouseEnter={onHover}
      onClick={onSelect}
      className="flex items-center gap-3 w-full px-3 py-2.5 text-left"
      style={{ background: active ? 'var(--bg-card-hover)' : 'transparent' }}
    >
      <span className="font-mono text-sm font-semibold shrink-0" style={{ color: 'var(--accent)', minWidth: 68 }}>
        {item.symbol || item.displaySymbol}
      </span>
      <span className="flex-1 min-w-0 text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
        {truncate(item.description || '', 44)}
      </span>
      {item.type && <span className="badge shrink-0">{item.type}</span>}
    </button>
  )
}

// ── Market toggle ───────────────────────────────────────────────────────────
function MarketToggle({ activeMarket, onChange }) {
  return (
    <div className="segmented">
      {['us', 'asx'].map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          aria-pressed={activeMarket === m}
          aria-label={m === 'us' ? 'US markets' : 'ASX markets'}
        >
          {m.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

// ── Phone: full-screen search sheet ─────────────────────────────────────────
function SearchOverlay({ activeMarket, onClose }) {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const { query, results, loading, onChange } = useSymbolSearch(activeMarket)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const select = (item) => {
    const symbol = item.symbol || item.displaySymbol
    if (!symbol) return
    onClose()
    navigate(`/stock/${symbol}`)
  }

  return (
    <div className="fixed inset-0 z-[70] flex flex-col" style={{ background: 'var(--bg)' }}>
      <div
        className="flex items-center gap-2"
        style={{
          paddingTop: 'calc(10px + env(safe-area-inset-top))',
          paddingBottom: 10,
          paddingLeft: 'max(12px, env(safe-area-inset-left))',
          paddingRight: 'max(12px, env(safe-area-inset-right))',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <button onClick={onClose} className="p-2 -ml-1 shrink-0" style={{ color: 'var(--text-secondary)' }} aria-label="Close search">
          <ArrowLeft size={20} />
        </button>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search symbols"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            className="input"
            style={{ paddingRight: 34 }}
          />
          {loading && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ width: 15, height: 15, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}
            />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {results.map((r, i) => (
          <div key={(r.symbol || i) + '-' + i} style={{ borderBottom: '1px solid var(--border)' }}>
            <ResultRow item={r} onSelect={() => select(r)} />
          </div>
        ))}
        {!loading && query.trim() && results.length === 0 && (
          <p className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            No symbols match “{query.trim()}”.
          </p>
        )}
        {!query.trim() && (
          <p className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Search any US or ASX listing by ticker or company name.
          </p>
        )}
      </div>
    </div>
  )
}

// ── Phone: "More" sheet for the destinations that don't fit the tab bar ─────
function MoreSheet({ onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const setAuthenticated = useStore((s) => s.setAuthenticated)

  const secondary = NAV_LINKS.filter((l) => !PRIMARY_TABS.includes(l.to))

  const go = (to) => {
    onClose()
    navigate(to)
  }

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label="More destinations">
        <div className="sheet-grabber" />
        <div className="grid grid-cols-3 gap-2">
          {secondary.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <button
                key={to}
                onClick={() => go(to)}
                className="flex flex-col items-center justify-center gap-2 rounded-control py-4"
                style={{
                  background: active ? 'color-mix(in srgb, var(--accent) 14%, var(--bg-input))' : 'var(--bg-input)',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  border: `1px solid ${active ? 'color-mix(in srgb, var(--accent) 45%, transparent)' : 'transparent'}`,
                }}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{label}</span>
              </button>
            )
          })}
        </div>

        {/* The phone has no room for these in the bar itself, but they are
            global settings and belong with navigation rather than buried in
            the Settings page. */}
        <div
          className="mt-3 pt-3 flex items-center justify-between gap-2"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Density</span>
          <DensityToggle />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Theme</span>
          <ThemeMenu />
        </div>

        <button
          onClick={() => { onClose(); setAuthenticated(false); navigate('/') }}
          className="btn w-full mt-3"
          style={{ color: 'var(--negative)' }}
        >
          <Lock size={15} /> Lock
        </button>
      </div>
    </>
  )
}

// ── Desktop: inline search with keyboard navigation ─────────────────────────
function DesktopSearch({ activeMarket }) {
  const navigate = useNavigate()
  const wrapRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const { query, results, loading, onChange, reset } = useSymbolSearch(activeMarket)

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (item) => {
    const symbol = item?.symbol || item?.displaySymbol
    if (!symbol) return
    reset()
    setOpen(false)
    navigate(`/stock/${symbol}`)
  }

  const onKeyDown = (e) => {
    if (!open || results.length === 0) {
      if (e.key === 'Escape') e.currentTarget.blur()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      select(results[highlight >= 0 ? highlight : 0])
    } else if (e.key === 'Escape') {
      setOpen(false)
      e.currentTarget.blur()
    }
  }

  return (
    <div ref={wrapRef} className="relative" style={{ width: 280 }}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
      <input
        id="navbar-search"
        value={query}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setHighlight(-1) }}
        onKeyDown={onKeyDown}
        onFocus={() => results.length && setOpen(true)}
        placeholder="Search symbols"
        className="input"
        style={{ paddingLeft: 34, paddingRight: 30, paddingBlock: 7 }}
      />
      {loading ? (
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ width: 14, height: 14, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}
        />
      ) : query ? (
        <button onClick={() => { reset(); setOpen(false) }} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} aria-label="Clear search">
          <X size={14} />
        </button>
      ) : (
        <kbd
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded px-1.5 py-0.5 text-2xs font-medium pointer-events-none"
          style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          /
        </kbd>
      )}

      {open && results.length > 0 && (
        <div
          className="absolute top-full mt-1.5 w-full rounded-card overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
        >
          {results.map((r, i) => (
            <ResultRow
              key={(r.symbol || i) + '-' + i}
              item={r}
              active={highlight === i}
              onHover={() => setHighlight(i)}
              onSelect={() => select(r)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Bar ─────────────────────────────────────────────────────────────────────
export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const activeMarket = useStore((s) => s.activeMarket)
  const setActiveMarket = useStore((s) => s.setActiveMarket)
  const setAuthenticated = useStore((s) => s.setAuthenticated)

  const [searchOpen, setSearchOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Close the phone sheets on navigation so a back-swipe never leaves one up.
  useEffect(() => {
    setSearchOpen(false)
    setMoreOpen(false)
  }, [location.pathname])

  // Every page already prints its own heading. Rather than show that name
  // twice on a phone, the bar title stays hidden until the heading has
  // scrolled away — the same hand-off iOS uses for large titles.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 44)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  const handleMarket = (market) => {
    setActiveMarket(market)
    if (location.pathname === '/dashboard') {
      window.dispatchEvent(new CustomEvent('market-changed', { detail: market }))
    }
  }

  const isActive = (to) => location.pathname === to

  // What the phone bar shows instead of a squeezed-in nav: where you are.
  const current = NAV_LINKS.find((l) => l.to === location.pathname)
  const title = current?.label || (location.pathname.startsWith('/stock/') ? location.pathname.split('/')[2] : 'FinSight')
  const onStockPage = location.pathname.startsWith('/stock/')

  const iconBtn = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
  }

  return (
    <>
      <nav className="app-navbar flex items-center gap-2.5">
        {/* Brand — on a phone this collapses to a Back affordance on stock pages,
            where getting out is more useful than getting home. */}
        {onStockPage ? (
          <button
            onClick={() => navigate(-1)}
            className="lg:hidden flex items-center justify-center shrink-0 rounded-control"
            style={{ ...iconBtn, width: 32, height: 32 }}
            aria-label="Back"
          >
            <ArrowLeft size={17} />
          </button>
        ) : (
          <Link to="/dashboard" className="lg:hidden flex items-center shrink-0" aria-label="Dashboard">
            <LogoMark size={30} />
          </Link>
        )}

        {/* Desktop: the current page's name. The brand lockup moved to the
            rail, so the bar is free to say where you are instead of repeating
            what app you're in. */}
        <span
          className="hidden lg:block shrink-0 text-base font-semibold"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.015em' }}
        >
          {NAV_LINKS.find((l) => l.to === location.pathname)?.label ||
            (location.pathname.startsWith('/stock/') ? location.pathname.split('/')[2] : '')}
        </span>

        {/* Phone: the page you're on, once its own heading has scrolled off. */}
        <span
          className="lg:hidden flex-1 min-w-0 truncate text-base font-semibold"
          style={{
            color: 'var(--text-primary)',
            letterSpacing: '-0.015em',
            opacity: scrolled ? 1 : 0,
            transform: scrolled ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity 0.18s ease, transform 0.18s ease',
          }}
          aria-hidden={!scrolled}
        >
          {title}
        </span>

        {/* Desktop: page tools, right-aligned. Search first because it is the
            one control used from every page. */}
        <div className="hidden lg:flex items-center gap-2 ml-auto shrink-0">
          <DesktopSearch activeMarket={activeMarket} />
          <MarketToggle activeMarket={activeMarket} onChange={handleMarket} />
          <DensityToggle />
          <ThemeMenu />
          <button
            onClick={() => { setAuthenticated(false); navigate('/') }}
            title="Lock & log out"
            className="flex items-center justify-center rounded-control"
            style={{ ...iconBtn, width: 32, height: 32 }}
          >
            <Lock size={15} />
          </button>
        </div>

        {/* Phone controls: only the two you actually reach for up here. */}
        <div className="lg:hidden flex items-center gap-2 shrink-0">
          <MarketToggle activeMarket={activeMarket} onChange={handleMarket} />
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center justify-center rounded-control"
            style={{ ...iconBtn, width: 32, height: 32 }}
            aria-label="Search symbols"
          >
            <Search size={16} />
          </button>
        </div>
      </nav>

      {/* Bottom tab bar — phone/tablet only, hidden by CSS at ≥1024px. */}
      <nav className="app-tabbar" aria-label="Primary">
        {PRIMARY_TABS.map((to) => {
          const link = NAV_LINKS.find((l) => l.to === to)
          const Icon = link.icon
          const active = isActive(to)
          return (
            <Link key={to} to={to} className={active ? 'is-active' : undefined} aria-current={active ? 'page' : undefined}>
              <Icon size={20} strokeWidth={active ? 2.3 : 1.9} />
              {link.label}
            </Link>
          )
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className={moreOpen || NAV_LINKS.some((l) => !PRIMARY_TABS.includes(l.to) && isActive(l.to)) ? 'is-active' : undefined}
        >
          <MoreHorizontal size={20} strokeWidth={1.9} />
          More
        </button>
      </nav>

      {searchOpen && <SearchOverlay activeMarket={activeMarket} onClose={() => setSearchOpen(false)} />}
      {moreOpen && <MoreSheet onClose={() => setMoreOpen(false)} />}
    </>
  )
}
