import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  SlidersHorizontal, ChevronDown, ChevronUp, Gem, Coins, Building2,
  TrendingUp, Cpu, Landmark, Pickaxe, Flame,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { screenerAPI } from '../utils/api'
import useStore from '../store/useStore'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Alert from '../components/common/Alert'
import { SkeletonTable, SkeletonRows } from '../components/common/Skeleton'
import { formatNumber, formatMarketCap, formatPercent, getChangeCSSVar } from '../utils/formatters'

const PRESETS = [
  { key: 'value', icon: Gem, label: 'Value' },
  { key: 'dividend', icon: Coins, label: 'Dividend' },
  { key: 'large_cap', icon: Building2, label: 'Large Cap' },
  { key: 'growth', icon: TrendingUp, label: 'Growth' },
  { key: 'tech', icon: Cpu, label: 'Technology' },
  { key: 'financials', icon: Landmark, label: 'Financials' },
  { key: 'resources', icon: Pickaxe, label: 'Resources' },
  { key: 'momentum', icon: Flame, label: 'Momentum' },
]

const US_SECTORS = ['Technology', 'Financial Services', 'Healthcare', 'Consumer Cyclical', 'Industrials', 'Communication Services', 'Consumer Defensive', 'Energy', 'Basic Materials', 'Real Estate', 'Utilities']
const ASX_SECTORS = ['Technology', 'Financials', 'Healthcare', 'Materials', 'Energy', 'Consumer Discretionary', 'Consumer Staples', 'Industrials', 'Real Estate', 'Utilities', 'Communication Services']
const US_EXCHANGES = ['NYSE', 'NASDAQ', 'AMEX']

// Columns that get right-aligned monospace treatment. Everything else is a
// label and stays left-aligned in the UI font.
const NUMERIC_COLS = new Set(['price', 'changePct', 'marketCap', 'pe', 'divYield'])

const EMPTY = {
  min_market_cap: '', max_market_cap: '', min_price: '', max_price: '',
  min_pe: '', max_pe: '', sector: '', exchange: '', min_dividend_yield: '', limit: 50,
}

function normalizeRow(r) {
  // US and ASX both return the same yfinance shape from the backend.
  return {
    symbol: r.symbol, name: r.name, price: r.price, changePct: r.changePct ?? null,
    marketCap: r.marketCap, pe: r.pe ?? null, divYield: r.dividendYield ?? null,
    sector: r.sector, tag: r.exchange || r.currency,
  }
}

export default function Screener() {
  const navigate = useNavigate()
  const activeMarket = useStore((s) => s.activeMarket)
  const sectors = activeMarket === 'asx' ? ASX_SECTORS : US_SECTORS

  const [filters, setFilters] = useState(EMPTY)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingPreset, setLoadingPreset] = useState(null)
  const [panelOpen, setPanelOpen] = useState(true)
  const [sort, setSort] = useState({ col: 'marketCap', dir: 'desc' })
  const [ran, setRan] = useState(false)
  // A toast disappears; an empty results area does not explain itself. Both
  // fire, but this is what stays on screen.
  const [failed, setFailed] = useState(false)

  const update = (k, v) => setFilters((f) => ({ ...f, [k]: v }))

  const runPreset = async (key) => {
    setLoadingPreset(key)
    const res = await screenerAPI.preset(key, activeMarket)
    if (res?.error) toast.error('Failed to load screener results - check API connection')
    setFailed(!!res?.error)
    setResults((res?.results || []).map(normalizeRow))
    setRan(true)
    setLoadingPreset(null)
  }

  const runScreen = async () => {
    setLoading(true)
    const payload = { market: activeMarket, limit: Number(filters.limit) }
    const num = (v) => (v === '' || v == null ? undefined : Number(v))
    if (num(filters.min_market_cap) != null) payload.min_market_cap = num(filters.min_market_cap) * 1e9
    if (num(filters.max_market_cap) != null) payload.max_market_cap = num(filters.max_market_cap) * 1e9
    payload.min_price = num(filters.min_price)
    payload.max_price = num(filters.max_price)
    payload.min_pe = num(filters.min_pe)
    payload.max_pe = num(filters.max_pe)
    payload.min_dividend_yield = num(filters.min_dividend_yield)
    if (filters.sector) payload.sector = filters.sector
    if (filters.exchange) payload.exchange = filters.exchange
    const res = await screenerAPI.screen(payload)
    if (res?.error) toast.error('Failed to load screener results - check API connection')
    setFailed(!!res?.error)
    setResults((res?.results || []).map(normalizeRow))
    setRan(true)
    setLoading(false)
  }

  const clear = () => { setFilters(EMPTY); setResults([]); setRan(false); setFailed(false) }

  const sorted = [...results].sort((a, b) => {
    const av = a[sort.col], bv = b[sort.col]
    if (av == null) return 1
    if (bv == null) return -1
    if (typeof av === 'string') return sort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    return sort.dir === 'asc' ? av - bv : bv - av
  })

  const setSortCol = (col) => setSort((s) => ({ col, dir: s.col === col && s.dir === 'desc' ? 'asc' : 'desc' }))

  // Labels wrap their own control, so the label text is the field's caption.
  const fieldCls = 'text-xs text-[var(--text-muted)] flex flex-col gap-1'

  const cols = [
    ['symbol', 'Symbol'], ['name', 'Company'], ['price', 'Price'], ['changePct', 'Change%'],
    ['marketCap', 'Mkt Cap'], ['pe', 'P/E'], ['divYield', 'Div Yield'], ['sector', 'Sector'], ['tag', activeMarket === 'asx' ? 'Currency' : 'Exch/Country'],
  ]

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Screener</h1>
          <p className="page-sub">{activeMarket === 'asx' ? 'ASX universe (yFinance)' : 'US universe (yFinance)'}</p>
        </div>
      </div>

      {/* PRESETS */}
      <div className="section-label">Presets</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap gap-2 mb-5">
        {PRESETS.map((p) => {
          const Icon = p.icon
          return (
            <button key={p.key} onClick={() => runPreset(p.key)} disabled={loadingPreset === p.key}
                    className="btn justify-start lg:justify-center">
              {loadingPreset === p.key
                ? <LoadingSpinner size="sm" />
                : <Icon size={15} style={{ color: 'var(--accent)' }} />}
              {p.label}
            </button>
          )
        })}
      </div>

      {/* CUSTOM FILTERS */}
      <div className="card mb-4">
        <button onClick={() => setPanelOpen((v) => !v)} className="flex items-center justify-between w-full">
          <span className="card-title flex items-center gap-2"><SlidersHorizontal size={14} /> Custom Filters</span>
          {panelOpen ? <ChevronUp size={16} className="text-[var(--text-muted)]" /> : <ChevronDown size={16} className="text-[var(--text-muted)]" />}
        </button>
        {panelOpen && <div className="h-3" />}
        {panelOpen && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className={fieldCls}>Min Mkt Cap ($B)<input type="number" className="input" value={filters.min_market_cap} onChange={(e) => update('min_market_cap', e.target.value)} /></label>
              <label className={fieldCls}>Max Mkt Cap ($B)<input type="number" className="input" value={filters.max_market_cap} onChange={(e) => update('max_market_cap', e.target.value)} /></label>
              <label className={fieldCls}>Min Price ($)<input type="number" className="input" value={filters.min_price} onChange={(e) => update('min_price', e.target.value)} /></label>
              <label className={fieldCls}>Max Price ($)<input type="number" className="input" value={filters.max_price} onChange={(e) => update('max_price', e.target.value)} /></label>
              <label className={fieldCls}>Min P/E<input type="number" className="input" value={filters.min_pe} onChange={(e) => update('min_pe', e.target.value)} /></label>
              <label className={fieldCls}>Max P/E<input type="number" className="input" value={filters.max_pe} onChange={(e) => update('max_pe', e.target.value)} /></label>
              <label className={fieldCls}>Min Div Yield (%)<input type="number" className="input" value={filters.min_dividend_yield} onChange={(e) => update('min_dividend_yield', e.target.value)} /></label>
              <label className={fieldCls}>Limit
                <select className="input" value={filters.limit} onChange={(e) => update('limit', e.target.value)}>
                  <option value={25}>25</option><option value={50}>50</option><option value={100}>100</option>
                </select>
              </label>
              <label className={fieldCls}>Sector
                <select className="input" value={filters.sector} onChange={(e) => update('sector', e.target.value)}>
                  <option value="">Any</option>{sectors.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              {activeMarket === 'us' && (
                <label className={fieldCls}>Exchange
                  <select className="input" value={filters.exchange} onChange={(e) => update('exchange', e.target.value)}>
                    <option value="">Any</option>{US_EXCHANGES.map((x) => <option key={x} value={x}>{x}</option>)}
                  </select>
                </label>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={runScreen} disabled={loading} className="btn btn-primary">
                {loading ? 'Screening…' : 'Run Screen'}
              </button>
              <button onClick={clear} className="btn">Clear Filters</button>
            </div>
          </>
        )}
      </div>

      {/* RESULTS */}
      {(loading || loadingPreset) ? (
        // Result-shaped placeholder rather than a spinner: the table lands in
        // the space the skeleton already occupies, so nothing jumps.
        <>
          <div className="lg:hidden"><SkeletonRows rows={7} /></div>
          <div className="hidden lg:block"><SkeletonTable rows={10} cols={9} /></div>
        </>
      ) : failed ? (
        <Alert title="Screener unavailable" onRetry={ran ? runScreen : undefined}>
          The screening endpoint did not respond. Check that the backend is running and reachable.
        </Alert>
      ) : ran && (
        sorted.length === 0 ? (
          <div className="card"><p className="text-sm text-[var(--text-muted)]">No matches. Try widening your filters.</p></div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-sm text-[var(--text-secondary)]">{sorted.length} results</span>
              {/* The phone has no column headers to click, so sorting gets its
                  own control rather than being unreachable. */}
              <select value={sort.col} onChange={(e) => setSortCol(e.target.value)} className="input lg:hidden" style={{ width: 'auto' }}>
                {cols.filter(([c]) => c !== 'name' && c !== 'tag').map(([col, label]) => (
                  <option key={col} value={col}>Sort: {label}</option>
                ))}
              </select>
            </div>

            {/* Phone: compact result rows. */}
            <div className="lg:hidden card" style={{ padding: 0 }}>
              {sorted.map((r, i) => (
                <div key={r.symbol + i} onClick={() => navigate(`/stock/${r.symbol}`)}
                     className="flex items-center gap-3 px-3.5 py-3 cursor-pointer border-b last:border-0"
                     style={{ borderColor: 'var(--border)' }}>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-sm font-semibold text-[var(--accent)]">{r.symbol}</div>
                    <div className="text-xs text-[var(--text-secondary)] truncate mt-0.5">{r.name || '-'}</div>
                    <div className="text-2xs text-[var(--text-muted)] font-mono mt-1">
                      {r.marketCap != null ? formatMarketCap(r.marketCap) : '-'} · P/E {r.pe != null ? formatNumber(r.pe, 1) : '-'}
                      {r.divYield != null ? ` · Yld ${formatPercent(r.divYield, 2, false)}` : ''}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-sm font-semibold text-[var(--text-primary)]">{r.price != null ? formatNumber(r.price, 2) : '-'}</div>
                    <div className="font-mono text-sm font-semibold" style={{ color: getChangeCSSVar(r.changePct ?? 0) }}>
                      {r.changePct != null ? formatPercent(r.changePct) : '-'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: sortable table. Zebra striping, a sticky header and
                the density switch all come from .data-table — the numeric
                columns just declare themselves with .num so they right-align
                in monospace and the decimal points line up down the column. */}
            <div className="hidden lg:block card card-table">
              <table className="data-table">
                <thead>
                  <tr>
                    {cols.map(([col, label]) => {
                      const numeric = NUMERIC_COLS.has(col)
                      return (
                        <th
                          key={col}
                          onClick={() => setSortCol(col)}
                          data-sortable=""
                          className={numeric ? 'num' : undefined}
                          aria-sort={sort.col === col ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                        >
                          {label}{sort.col === col ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ''}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r, i) => (
                    <tr key={r.symbol + i} onClick={() => navigate(`/stock/${r.symbol}`)} className="cursor-pointer">
                      <td className="font-mono font-semibold text-[var(--accent)] whitespace-nowrap">{r.symbol}</td>
                      <td className="trunc text-[var(--text-secondary)]" title={r.name || undefined}>{r.name}</td>
                      <td className="num">{r.price != null ? formatNumber(r.price, 2) : '-'}</td>
                      <td className="num font-semibold" style={{ color: getChangeCSSVar(r.changePct ?? 0) }}>{r.changePct != null ? formatPercent(r.changePct) : '-'}</td>
                      <td className="num">{r.marketCap != null ? formatMarketCap(r.marketCap) : '-'}</td>
                      <td className="num">{r.pe != null ? formatNumber(r.pe, 1) : '-'}</td>
                      <td className="num">{r.divYield != null ? formatPercent(r.divYield, 2, false) : '-'}</td>
                      <td className="text-[var(--text-secondary)] whitespace-nowrap">{r.sector || '-'}</td>
                      <td className="text-[var(--text-muted)] whitespace-nowrap">{r.tag || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      )}
    </div>
  )
}
