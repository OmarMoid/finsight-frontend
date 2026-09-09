import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Plus, RefreshCw, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { watchlistAPI, stocksAPI } from '../utils/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Alert from '../components/common/Alert'
import ImportPanel from '../components/watchlist/ImportPanel'
import { SkeletonTable, SkeletonRows } from '../components/common/Skeleton'
import {
  formatNumber, formatMarketCap, formatPercent, getChangeCSSVar, symbolIsASX, getCurrencySymbol,
} from '../utils/formatters'

export default function Watchlist() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('symbol')
  const [marketFilter, setMarketFilter] = useState('all')
  const [failed, setFailed] = useState(false)
  const [importing, setImporting] = useState(false)
  const debounceRef = useRef(null)
  const searchWrapRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await watchlistAPI.get()
    if (res?.error) toast.error('Failed to load watchlist - check API connection')
    setFailed(!!res?.error)
    setItems(Array.isArray(res) ? res : [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const h = (e) => { if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) setSearchOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const onSearch = (v) => {
    setQuery(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!v.trim()) { setSearchResults([]); setSearchOpen(false); return }
    debounceRef.current = setTimeout(async () => {
      const res = await stocksAPI.search(v, 'us')
      const list = Array.isArray(res?.result) ? res.result : []
      setSearchResults(list.slice(0, 6))
      setSearchOpen(true)
    }, 300)
  }

  const addSymbol = async (symbol) => {
    setAdding(true)
    const market = symbolIsASX(symbol) ? 'asx' : 'us'
    const res = await watchlistAPI.add({ symbol, market })
    setAdding(false)
    setQuery(''); setSearchResults([]); setSearchOpen(false)
    if (res?.error) {
      toast.error(res.status === 400 ? `${symbol} is already in your watchlist` : 'Could not add symbol')
    } else {
      toast.success(`Added ${symbol}`)
      load()
    }
  }

  const remove = async (e, symbol) => {
    e.stopPropagation()
    await watchlistAPI.remove(symbol)
    setItems((prev) => prev.filter((i) => i.symbol !== symbol))
    toast.success(`Removed ${symbol}`)
  }

  const gaining = items.filter((i) => (i.change_percent ?? 0) > 0).length
  const losing = items.filter((i) => (i.change_percent ?? 0) < 0).length

  const filtered = items
    .filter((i) => marketFilter === 'all' || i.market === marketFilter)
    .filter((i) => {
      if (!filter) return true
      const q = filter.toLowerCase()
      return i.symbol.toLowerCase().includes(q) || (i.name || '').toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sort === 'symbol') return a.symbol.localeCompare(b.symbol)
      if (sort === 'price') return (b.price ?? 0) - (a.price ?? 0)
      if (sort === 'change') return (b.change_percent ?? 0) - (a.change_percent ?? 0)
      if (sort === 'mktcap') return (b.market_cap ?? 0) - (a.market_cap ?? 0)
      return 0
    })

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">Watchlist</h1>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setImporting((v) => !v)} className="btn" aria-label="Import a watchlist">
            <Upload size={14} />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button onClick={load} className="btn" aria-label="Refresh watchlist">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {importing && (
        <div className="mb-4">
          <ImportPanel onClose={() => setImporting(false)} onImported={load} />
        </div>
      )}

      {/* ADD FORM */}
      <div ref={searchWrapRef} className="relative mb-4 w-full sm:max-w-[420px]">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input value={query} onChange={(e) => onSearch(e.target.value)} placeholder="Add a symbol…"
                 className="input" style={{ paddingLeft: 34 }}
                 autoCapitalize="characters" autoCorrect="off" spellCheck={false}
                 onKeyDown={(e) => { if (e.key === 'Enter' && query.trim()) addSymbol(query.trim().toUpperCase()) }} />
          {adding && <div className="absolute right-3 top-1/2 -translate-y-1/2"><LoadingSpinner size="sm" /></div>}
        </div>
        {searchOpen && searchResults.length > 0 && (
          <div className="absolute top-full mt-1.5 w-full rounded-card overflow-hidden z-10" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
            {searchResults.map((r, i) => (
              <button key={i} onClick={() => addSymbol(r.symbol)} className="flex items-center gap-3 w-full px-3 py-2.5 text-left text-sm hover:bg-[var(--bg-card-hover)]">
                <span className="font-mono font-semibold text-[var(--accent)] shrink-0" style={{ minWidth: 72 }}>{r.symbol}</span>
                <span className="flex-1 min-w-0 text-[var(--text-secondary)] truncate">{r.description}</span>
                <Plus size={14} className="text-[var(--text-muted)] shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        {[['Tracked', items.length, 'var(--text-primary)'], ['Gaining', gaining, 'var(--positive)'], ['Losing', losing, 'var(--negative)']].map(([label, value, color]) => (
          <div key={label} className="card">
            <div className="stat-label">{label}</div>
            <div className="text-xl font-bold font-mono mt-0.5" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter by symbol or name"
               className="input" style={{ flex: 1, minWidth: 160, width: 'auto' }} />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input" style={{ width: 'auto' }}>
          <option value="symbol">Sort: Symbol</option><option value="price">Sort: Price</option>
          <option value="change">Sort: Change</option><option value="mktcap">Sort: Mkt Cap</option>
        </select>
        <div className="segmented">
          {['all', 'us', 'asx'].map((m) => (
            <button key={m} onClick={() => setMarketFilter(m)} aria-pressed={marketFilter === m}>{m.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {/* RESULTS */}
      {loading ? (
        <>
          <div className="lg:hidden"><SkeletonRows rows={5} /></div>
          <div className="hidden lg:block"><SkeletonTable rows={6} cols={8} /></div>
        </>
      ) : failed ? (
        <Alert title="Couldn’t load your watchlist" onRetry={load}>
          The watchlist endpoint didn’t respond. Your saved symbols are safe - this is a
          connection problem, not a data loss.
        </Alert>
      ) : items.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-[var(--text-secondary)]">Your watchlist is empty.</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">Use the search box above to add stocks (e.g. AAPL, CBA.AX).</p>
        </div>
      ) : (
        <>
          {/* Phone: one tappable row per holding. A nine-column table only ever
              worked by scrolling sideways, which hid the change % — the one
              number you open a watchlist to see. */}
          <div className="lg:hidden card" style={{ padding: 0 }}>
            {filtered.map((i) => {
              const cur = getCurrencySymbol(i.symbol)
              return (
                <div key={i.symbol} onClick={() => navigate(`/stock/${i.symbol}`)}
                     className="flex items-center gap-3 px-3.5 py-3 cursor-pointer border-b last:border-0"
                     style={{ borderColor: 'var(--border)' }}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm font-semibold text-[var(--accent)]">{i.symbol}</span>
                      {i.market === 'asx' && <span className="badge" style={{ color: 'var(--accent-gold)' }}>ASX</span>}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] truncate mt-0.5">{i.name || '-'}</div>
                    <div className="text-2xs text-[var(--text-muted)] font-mono mt-1">
                      {i.market_cap != null ? formatMarketCap(i.market_cap) : '-'} · P/E {i.pe != null ? formatNumber(i.pe, 1) : '-'}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-sm font-semibold text-[var(--text-primary)]">
                      {i.price != null ? `${cur}${formatNumber(i.price, 2)}` : '-'}
                    </div>
                    <div className="font-mono text-sm font-semibold" style={{ color: getChangeCSSVar(i.change_percent ?? 0) }}>
                      {i.change_percent != null ? formatPercent(i.change_percent) : '-'}
                    </div>
                  </div>
                  <button onClick={(e) => remove(e, i.symbol)} className="shrink-0 p-1.5 -mr-1.5 text-[var(--text-muted)]" aria-label={`Remove ${i.symbol}`}>
                    <X size={16} />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Desktop: the full table, where there's room for every column. */}
          <div className="hidden lg:block card card-table">
            <table className="data-table">
              <thead><tr>
                {[
                  ['Symbol', false], ['Name', false], ['Price', true], ['Change%', true],
                  ['Mkt Cap', true], ['P/E', true], ['52W High', true], ['52W Low', true],
                  ['Market', false], ['', false],
                ].map(([h, numeric]) => (
                  <th key={h} className={numeric ? 'num' : undefined}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((i) => {
                  const cur = getCurrencySymbol(i.symbol)
                  return (
                    <tr key={i.symbol} onClick={() => navigate(`/stock/${i.symbol}`)} className="cursor-pointer group">
                      <td className="font-mono font-semibold text-[var(--accent)]">{i.symbol}</td>
                      <td className="trunc text-[var(--text-secondary)]" title={i.name || undefined}>{i.name || '-'}</td>
                      <td className="num">{i.price != null ? `${cur}${formatNumber(i.price, 2)}` : '-'}</td>
                      <td className="num font-semibold" style={{ color: getChangeCSSVar(i.change_percent ?? 0) }}>{i.change_percent != null ? formatPercent(i.change_percent) : '-'}</td>
                      <td className="num">{i.market_cap != null ? formatMarketCap(i.market_cap) : '-'}</td>
                      <td className="num">{i.pe != null ? formatNumber(i.pe, 1) : '-'}</td>
                      <td className="num">{i.fifty_two_week_high != null ? formatNumber(i.fifty_two_week_high, 2) : '-'}</td>
                      <td className="num">{i.fifty_two_week_low != null ? formatNumber(i.fifty_two_week_low, 2) : '-'}</td>
                      <td><span className="badge" style={{ color: i.market === 'asx' ? 'var(--accent-gold)' : 'var(--accent)' }}>{(i.market || 'us').toUpperCase()}</span></td>
                      <td><button onClick={(e) => remove(e, i.symbol)} className="hover-action text-[var(--text-muted)] hover:text-[var(--negative)]" aria-label={`Remove ${i.symbol}`}><X size={15} /></button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
