import { Fragment, useState, useEffect, useCallback, createContext, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, ExternalLink } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import toast from 'react-hot-toast'
import { stocksAPI, watchlistAPI, macroAPI } from '../utils/api'
import useStore from '../store/useStore'
import PriceChart from '../components/charts/PriceChart'
import LoadingSpinner, { SkeletonBlock } from '../components/common/LoadingSpinner'
import { SkeletonChart } from '../components/common/Skeleton'
import {
  formatNumber, formatCurrency, formatPercent, formatVolume,
  formatDate, getChangeCSSVar, symbolIsASX, timeAgo, truncate,
  getPEContext, getAltmanZContext, getPiotroskiContext, getRSISignal,
} from '../utils/formatters'

// [button label, backend period]. 1D/1W come back as intraday bars, the rest
// daily (5Y is weekly) — see yfinance_service.PERIOD_SPECS.
const PERIODS = [
  ['1D', '1d'], ['1W', '5d'], ['1M', '1mo'], ['3M', '3mo'],
  ['6M', '6mo'], ['1Y', '1y'], ['3Y', '3y'], ['5Y', '5y'],
]
const TABS = ['Overview', 'Financials', 'Earnings', 'Valuation', 'Technicals', 'News', 'Dividends']

const pick = (...vals) => vals.find((v) => v != null && v !== '') ?? null

// ── Display currency ───────────────────────────────────────────────────────
// Every money figure on the page goes through this, so the A$ / $ toggle
// converts prices, targets, DCF and statements alike. Values default to the
// listing currency; statements arrive in the reporting currency (BHP: USD
// accounts, AUD shares) and are converted from that.
const MoneyContext = createContext(null)
const useMoney = () => useContext(MoneyContext)

function makeMoney(listing, display, fx) {
  const rates = fx?.rates || {}
  const conv = (v, from = listing) => {
    if (v == null || Number.isNaN(Number(v))) return null
    if (!from || from === display) return Number(v)
    const a = rates[from], b = rates[display]
    return a && b ? (Number(v) * b) / a : null
  }
  const sym = display === 'AUD' ? 'A$' : '$'
  return {
    listing, display, sym, fx,
    conv,
    // "A$57.56" — per-share prices
    price: (v, from, digits = 2) => {
      const c = conv(v, from)
      return c == null ? '-' : `${c < 0 ? '-' : ''}${sym}${formatNumber(Math.abs(c), digits)}`
    },
    // "A$292.6B" — totals
    big: (v, from) => formatCurrency(conv(v, from), display, true),
  }
}

function CurrencyToggle({ listing, display, onChange, fx }) {
  const usable = ['AUD', 'USD'].includes(listing) && fx?.rates?.USD
  if (!usable) return null
  const rate = fx.rates.USD
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="segmented" role="group" aria-label="Display currency">
        {[['AUD', 'A$'], ['USD', '$']].map(([code, label]) => (
          <button key={code} onClick={() => onChange(code)} aria-pressed={display === code}
                  title={code === listing ? `${label} (listing currency)` : `Convert to ${label}`}>
            {label}
          </button>
        ))}
      </div>
      {display !== listing && (
        <span className="text-2xs text-[var(--text-muted)]">
          Converted from {listing === 'AUD' ? 'A$' : '$'} at A$1 = ${formatNumber(rate, 4)}{fx.date ? ` (${formatDate(fx.date)})` : ''}
        </span>
      )}
    </div>
  )
}

function Pill({ label, value }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  )
}

// Extended-hours (pre/post-market) price line. Shows only when the market is
// in a pre/post session and Yahoo is reporting an extended-hours quote.
function ExtendedHours({ quote }) {
  const money = useMoney()
  const state = quote.market_state
  let label, price, chg, pct
  if (state === 'PRE' && quote.pre_market_price != null) {
    label = 'Pre-market'; price = quote.pre_market_price; chg = quote.pre_market_change; pct = quote.pre_market_change_percent
  } else if ((state === 'POST' || state === 'POSTPOST') && quote.post_market_price != null) {
    label = 'After hours'; price = quote.post_market_price; chg = quote.post_market_change; pct = quote.post_market_change_percent
  } else {
    return null
  }
  const color = chg == null ? 'var(--text-secondary)' : chg >= 0 ? 'var(--positive)' : 'var(--negative)'
  return (
    <div className="flex items-center gap-2 mt-1.5 text-sm">
      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide" style={{ background: 'var(--bg-input)', color: 'var(--accent-gold)' }}>{label}</span>
      <span className="font-mono font-medium text-[var(--text-primary)]">{money.price(price)}</span>
      <span className="font-mono" style={{ color }}>
        {chg != null ? `${chg >= 0 ? '+' : ''}${formatNumber(money.conv(chg), 2)}` : ''}{pct != null ? ` (${formatPercent(pct)})` : ''}
      </span>
    </div>
  )
}

function Badge({ children, color = 'var(--text-secondary)', bg = 'var(--bg-input)' }) {
  return <span className="badge" style={{ color, background: bg }}>{children}</span>
}

// ── Analyst consensus ──────────────────────────────────────────────────────
function AnalystConsensus({ rec, target, price, numAnalysts }) {
  const money = useMoney()
  const buy = (rec?.strongBuy || 0) + (rec?.buy || 0)
  const hold = rec?.hold || 0
  const sell = (rec?.sell || 0) + (rec?.strongSell || 0)
  const total = buy + hold + sell
  const hasConsensus = total > 0
  const hasTarget = target?.targetMedian != null || target?.targetMean != null

  // Both providers can come back empty (rate-limited or plan-gated) without
  // erroring, so this would otherwise render as a card that's just silently
  // missing with no indication anything went wrong. Say so instead.
  if (!hasConsensus && !hasTarget) {
    return (
      <div className="card mb-3">
        <div className="section-label">Analyst Forecasts</div>
        <p className="text-sm text-[var(--text-muted)] mt-1">Not available for this symbol right now.</p>
      </div>
    )
  }

  let label = 'Hold', color = 'var(--accent-gold)'
  if (hasConsensus) {
    const score = (buy * 1 + hold * 0 + sell * -1) / total
    if (score > 0.5) { label = 'Strong Buy'; color = 'var(--positive)' }
    else if (score > 0.15) { label = 'Buy'; color = 'var(--positive)' }
    else if (score < -0.5) { label = 'Strong Sell'; color = 'var(--negative)' }
    else if (score < -0.15) { label = 'Sell'; color = 'var(--negative)' }
  }

  const median = target?.targetMedian ?? target?.targetMean
  const mean = target?.targetMean ?? target?.targetMedian
  const low = target?.targetLow
  const high = target?.targetHigh
  const upside = median && price ? ((median / price - 1) * 100) : null
  const analystCount = numAnalysts ?? total

  return (
    <div className="card grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-3">
      <div>
        <div className="section-label">Consensus</div>
        {hasConsensus ? (
          <>
            <div className="text-lg font-bold" style={{ color }}>{label}</div>
            <div className="mt-2 h-2 rounded-full overflow-hidden flex">
              <div style={{ width: `${(buy / total) * 100}%`, background: 'var(--positive)' }} />
              <div style={{ width: `${(hold / total) * 100}%`, background: 'var(--accent-gold)' }} />
              <div style={{ width: `${(sell / total) * 100}%`, background: 'var(--negative)' }} />
            </div>
            {/* Ratings sit under the bar they describe on a phone, where the
                three-column desktop layout collapses to a single stack. */}
            <div className="flex items-center gap-5 mt-3">
              {[[buy, 'Buy', 'var(--positive)'], [hold, 'Hold', 'var(--accent-gold)'], [sell, 'Sell', 'var(--negative)']].map(([n, l, c]) => (
                <div key={l}>
                  <div className="text-lg font-bold font-mono leading-none" style={{ color: c }}>{n}</div>
                  <div className="text-2xs text-[var(--text-muted)] mt-1">{l}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-[var(--text-muted)] mt-1">Not available</p>
        )}
      </div>
      <div className="md:col-span-2">
        <div className="section-label">Median Price Target</div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-xl font-bold font-mono text-[var(--text-primary)]">{money.price(median)}</span>
          {upside != null && <span className="text-sm font-semibold font-mono" style={{ color: getChangeCSSVar(upside) }}>{formatPercent(upside)} upside</span>}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2.5">
          {[['Low', low, 'var(--negative)'], ['Mean', mean, 'var(--text-secondary)'], ['High', high, 'var(--positive)']].map(([l, v, c]) => (
            <div key={l} className="stat">
              <div className="stat-label">{l}</div>
              <div className="stat-value" style={{ color: c }}>{money.price(v)}</div>
            </div>
          ))}
        </div>
        <div className="text-2xs text-[var(--text-muted)] mt-1.5">{analystCount} analysts</div>
      </div>
    </div>
  )
}

// ── RSI gauge (semicircle) ─────────────────────────────────────────────────
function RSIGauge({ value }) {
  const v = value == null ? 50 : Math.max(0, Math.min(100, value))
  const angle = (v / 100) * 180 - 90  // -90 .. 90
  const sig = getRSISignal(value)
  return (
    <div className="card flex flex-col items-center">
      <div className="text-xs text-[var(--text-muted)] mb-2 self-start">RSI 14</div>
      <svg width="160" height="92" viewBox="0 0 160 92">
        <path d="M10,90 A70,70 0 0,1 53,24" fill="none" stroke="var(--positive)" strokeWidth="10" />
        <path d="M53,24 A70,70 0 0,1 107,24" fill="none" stroke="var(--text-muted)" strokeWidth="10" />
        <path d="M107,24 A70,70 0 0,1 150,90" fill="none" stroke="var(--negative)" strokeWidth="10" />
        <line x1="80" y1="90" x2="80" y2="30" stroke="var(--text-primary)" strokeWidth="3"
              transform={`rotate(${angle} 80 90)`} strokeLinecap="round" />
        <circle cx="80" cy="90" r="4" fill="var(--text-primary)" />
      </svg>
      <div className="text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{value != null ? value : '-'}</div>
      <div className="text-xs" style={{ color: sig.color.includes('positive') ? 'var(--positive)' : sig.color.includes('negative') ? 'var(--negative)' : 'var(--text-secondary)' }}>{sig.label}</div>
    </div>
  )
}

// ── Tabs ───────────────────────────────────────────────────────────────────
function OverviewTab({ symbol, profile }) {
  const navigate = useNavigate()
  const [peers, setPeers] = useState([])
  const [expanded, setExpanded] = useState(false)
  const yf = profile?.yfinance || {}
  const fmp = profile?.fmp || {}
  const desc = pick(yf.longBusinessSummary, fmp.description) || ''

  useEffect(() => {
    stocksAPI.getPeers(symbol).then((r) => setPeers(r?.peers || []))
  }, [symbol])

  const info = [
    ['Sector', pick(yf.sector, fmp.sector)],
    ['Industry', pick(yf.industry, fmp.industry)],
    ['Country', pick(yf.country, fmp.country)],
    ['Employees', yf.fullTimeEmployees ? formatNumber(yf.fullTimeEmployees, 0) : null],
    ['Website', pick(yf.website, fmp.website)],
  ]

  return (
    <div className="space-y-4">
      {desc && (
        <div className="card">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {expanded || desc.length <= 300 ? desc : truncate(desc, 300)}
          </p>
          {desc.length > 300 && (
            <button onClick={() => setExpanded((v) => !v)} className="mt-2 text-sm text-[var(--accent)]">
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
      <div className="card grid grid-cols-2 md:grid-cols-3 gap-3">
        {info.filter(([, v]) => v).map(([k, v]) => (
          <div key={k}>
            <div className="text-2xs text-[var(--text-muted)]">{k}</div>
            {k === 'Website'
              ? <a href={v.startsWith('http') ? v : `https://${v}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent)]">{v}</a>
              : <div className="text-sm text-[var(--text-primary)]">{v}</div>}
          </div>
        ))}
      </div>
      {peers.length > 0 && (
        <div className="card">
          <h4 className="card-title mb-2">Peers</h4>
          <div className="flex flex-wrap gap-2">
            {peers.map((p) => (
              <button key={p} onClick={() => navigate(`/stock/${p}`)} className="px-2.5 py-1 rounded-md text-sm font-mono" style={{ background: 'var(--bg-input)', color: 'var(--accent)' }}>{p}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MetricTile({ name, value, color }) {
  return (
    <div className="stat">
      <div className="stat-label">{name}</div>
      <div className="stat-value text-base" style={color ? { color } : undefined}>{value}</div>
    </div>
  )
}

// ── EPS breakdown: GAAP basic/diluted + normalised, quarterly & annual ──────
function EpsBreakdown({ symbol }) {
  const [eps, setEps] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('quarterly')

  useEffect(() => {
    setLoading(true)
    stocksAPI.getEPS(symbol).then((r) => { setEps(r?.error ? null : r); setLoading(false) })
  }, [symbol])

  if (loading) return <div className="card"><SkeletonBlock height={120} /></div>
  if (!eps) return null

  const rows = (view === 'quarterly' ? eps.quarterly : eps.annual) || []
  const fmt = (v) => (v != null ? formatNumber(v, 2) : '-')

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h4 className="card-title">Earnings per Share (EPS)</h4>
        <div className="flex items-center gap-1">
          {['quarterly', 'annual'].map((v) => (
            <button key={v} onClick={() => setView(v)} className="px-2.5 py-1 rounded-md text-xs capitalize"
                    style={{ background: view === v ? 'var(--accent)' : 'var(--bg-input)', color: view === v ? 'var(--accent-contrast)' : 'var(--text-secondary)' }}>{v}</button>
          ))}
        </div>
      </div>

      {/* Headline figures */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <MetricTile name="TTM (GAAP diluted)" value={fmt(eps.trailing_eps)} />
        <MetricTile name="Forward (est.)" value={fmt(eps.forward_eps)} color="var(--accent)" />
        <MetricTile name="Current Year (est.)" value={fmt(eps.current_year_eps)} />
        <MetricTile name="Fwd P/E" value={eps.forward_pe != null ? formatNumber(eps.forward_pe, 1) : '-'} />
      </div>
      <p className="text-xs text-[var(--text-muted)] mb-3">
        TTM is the sum of the last four reported quarters (GAAP). Forward and current-year are analyst estimates - usually higher than reported GAAP because they exclude one-off charges and assume growth. The table shows actual reported figures.
      </p>

      {/* Historical table */}
      {rows.length ? (
        <div className="table-scroll">
          <table className="data-table" style={{ minWidth: 380 }}>
            <thead>
              <tr className="text-[var(--text-muted)] text-xs">
                <th className="text-left font-normal py-1">Period</th>
                <th className="text-right font-normal py-1">Basic (GAAP)</th>
                <th className="text-right font-normal py-1">Diluted (GAAP)</th>
                <th className="text-right font-normal py-1">Normalised</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.date} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-1.5 text-[var(--text-secondary)]">{view === 'annual' ? (r.date || '').slice(0, 4) : formatDate(r.date)}</td>
                  <td className="py-1.5 text-right font-mono text-[var(--text-primary)]">{fmt(r.eps_basic)}</td>
                  <td className="py-1.5 text-right font-mono text-[var(--text-primary)]">{fmt(r.eps_diluted)}</td>
                  <td className="py-1.5 text-right font-mono" style={{ color: 'var(--accent)' }}>{fmt(r.eps_normalized)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="text-sm text-[var(--text-muted)]">No {view} EPS history available.</p>}
    </div>
  )
}

function FinancialsTab({ symbol, reported }) {
  const money = useMoney()
  const fmt = (v) => money.big(v, reported)
  const [period, setPeriod] = useState('annual')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    stocksAPI.getFinancials(symbol, period).then((r) => { setData(r?.error ? null : r); setLoading(false) })
  }, [symbol, period])

  if (loading) return <LoadingSpinner label="Loading financials…" />
  if (!data) return <p className="text-sm text-[var(--text-muted)]">Financials unavailable</p>

  const km = data.key_metrics_ttm || {}
  const rt = data.ratios_ttm || {}
  const income = (data.income_statement || []).slice(0, 4)
  const balance = (data.balance_sheet || [])[0] || {}
  const cash = (data.cash_flow || []).slice(0, 4)
  const scores = data.financial_scores || {}

  // FMP TTM ratios/metrics are fractions — always ×100 to display as a percent.
  const pct = (v) => (v != null ? formatPercent(v * 100, 1, false) : '-')
  const pe = rt.priceToEarningsRatioTTM ?? km.peRatioTTM
  const metrics = [
    ['P/E', pe, getPEContext(pe).color],
    ['P/B', rt.priceToBookRatioTTM ?? km.pbRatioTTM, null],
    ['P/S', rt.priceToSalesRatioTTM ?? km.priceToSalesRatioTTM, null],
    ['EV/EBITDA', km.evToEBITDATTM, null],
    ['ROE', km.returnOnEquityTTM != null ? pct(km.returnOnEquityTTM) : null, 'var(--positive)'],
    ['ROA', km.returnOnAssetsTTM != null ? pct(km.returnOnAssetsTTM) : null, null],
    ['ROIC', km.returnOnInvestedCapitalTTM != null ? pct(km.returnOnInvestedCapitalTTM) : null, null],
    ['FCF Yield', km.freeCashFlowYieldTTM != null ? pct(km.freeCashFlowYieldTTM) : null, null],
    ['Current Ratio', rt.currentRatioTTM ?? km.currentRatioTTM, null],
    ['Debt/Equity', rt.debtToEquityRatioTTM ?? km.debtToEquityTTM, null],
    ['Gross Margin', rt.grossProfitMarginTTM != null ? pct(rt.grossProfitMarginTTM) : null, null],
    ['Net Margin', rt.netProfitMarginTTM != null ? pct(rt.netProfitMarginTTM) : null, null],
  ]

  const incomeRows = [
    ['Revenue', (r) => fmt(r.revenue)],
    ['Gross Profit', (r) => fmt(r.grossProfit)],
    ['EBIT', (r) => fmt(r.operatingIncome)],
    ['Net Income', (r) => fmt(r.netIncome)],
    ['EBITDA', (r) => fmt(r.ebitda)],
    ['EPS Diluted', (r) => money.price(r.epsdiluted, reported)],
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {['annual', 'quarterly'].map((p) => (
          <button key={p} onClick={() => setPeriod(p)} className="px-3 py-1 rounded-md text-xs capitalize"
                  style={{ background: period === p ? 'var(--accent)' : 'var(--bg-input)', color: period === p ? 'var(--accent-contrast)' : 'var(--text-secondary)' }}>{p}</button>
        ))}
      </div>

      {reported && reported !== money.display && (
        <p className="text-2xs text-[var(--text-muted)]">
          Reported in {reported === 'AUD' ? 'A$' : reported === 'USD' ? '$' : reported}; shown in {money.sym} at today&rsquo;s exchange rate.
        </p>
      )}

      <EpsBreakdown symbol={symbol} />

      <div>
        <h4 className="card-title mb-2">Key Metrics (TTM)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {metrics.map(([n, v, c]) => (
            <MetricTile key={n} name={n} value={v != null ? (typeof v === 'number' ? formatNumber(v, 2) : v) : '-'} color={v != null ? c : null} />
          ))}
        </div>
      </div>

      <div className="card">
        <h4 className="card-title mb-2">Income Statement</h4>
        <div className="table-scroll">
        <table className="data-table" style={{ minWidth: 380 }}>
          <thead><tr className="text-[var(--text-muted)] text-xs">
            <th className="text-left font-normal py-1">Metric</th>
            {income.map((r) => <th key={r.date} className="text-right font-normal py-1">{r.calendarYear || (r.date || '').slice(0, 4)}</th>)}
          </tr></thead>
          <tbody>
            {incomeRows.map(([name, fn]) => (
              <tr key={name} className="border-t" style={{ borderColor: 'var(--border)' }}>
                <td className="py-1.5 text-[var(--text-secondary)]">{name}</td>
                {income.map((r, i) => <td key={i} className="py-1.5 text-right font-mono text-[var(--text-primary)] whitespace-nowrap">{fn(r)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <div className="card">
        <h4 className="card-title mb-2">Balance Sheet (latest)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <MetricTile name="Total Assets" value={fmt(balance.totalAssets)} />
          <MetricTile name="Total Liabilities" value={fmt(balance.totalLiabilities)} />
          <MetricTile name="Total Equity" value={fmt(balance.totalStockholdersEquity)} />
          <MetricTile name="Cash" value={fmt(balance.cashAndCashEquivalents)} />
          <MetricTile name="Total Debt" value={fmt(balance.totalDebt)} />
          <MetricTile name="Net Debt" value={fmt(balance.netDebt)} />
        </div>
      </div>

      <div className="card">
        <h4 className="card-title mb-2">Cash Flow</h4>
        <div className="table-scroll">
        <table className="data-table" style={{ minWidth: 380 }}>
          <thead><tr className="text-[var(--text-muted)] text-xs">
            <th className="text-left font-normal py-1">Metric</th>
            {cash.map((r) => <th key={r.date} className="text-right font-normal py-1">{r.calendarYear || (r.date || '').slice(0, 4)}</th>)}
          </tr></thead>
          <tbody>
            {[['Operating CF', 'operatingCashFlow'], ['Capex', 'capitalExpenditure'], ['Free Cash Flow', 'freeCashFlow'], ['Dividends Paid', 'dividendsPaid']].map(([name, key]) => (
              <tr key={name} className="border-t" style={{ borderColor: 'var(--border)' }}>
                <td className="py-1.5 text-[var(--text-secondary)]">{name}</td>
                {cash.map((r, i) => <td key={i} className="py-1.5 text-right font-mono text-[var(--text-primary)] whitespace-nowrap">{fmt(r[key])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(() => {
          // The backend marks Z not-applicable for banks, insurers and REITs
          // rather than printing the number the formula gives — unguarded it
          // calls every bank "Distress", which is a property of the model, not
          // the company.
          const detail = scores.altmanDetail
          const notApplicable = detail && detail.applicable === false
          const z = getAltmanZContext(scores.altmanZScore)
          return (
            <div className="card">
              <div className="text-xs text-[var(--text-muted)]">Altman Z-Score</div>
              {notApplicable ? (
                <>
                  <div className="text-lg font-semibold text-[var(--text-secondary)] mt-1">Not applicable</div>
                  <div className="text-2xs text-[var(--text-muted)] mt-1 leading-relaxed">{detail.reason}</div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
                    {scores.altmanZScore != null ? formatNumber(scores.altmanZScore, 2) : '-'}
                  </div>
                  <div className="text-sm" style={{ color: z.color.replace('text-[', '').replace(']', '') }}>{z.label}</div>
                  <div className="text-2xs text-[var(--text-muted)] mt-1">{z.description}</div>
                </>
              )}
            </div>
          )
        })()}
        {(() => {
          // `piotroskiOutOf` is the number of tests that had the data to run.
          // Showing "2/7" is honest where "2/9" would read as a failing grade
          // that two missing statements caused.
          const outOf = scores.piotroskiOutOf || 9
          const f = getPiotroskiContext(
            scores.piotroskiScore != null ? (scores.piotroskiScore / outOf) * 9 : null
          )
          return (
            <div className="card">
              <div className="text-xs text-[var(--text-muted)]">Piotroski F-Score</div>
              <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
                {scores.piotroskiScore != null ? scores.piotroskiScore : '-'}
                <span className="text-sm text-[var(--text-muted)]">/{outOf}</span>
              </div>
              <div className="text-sm">{f.label}</div>
              {outOf < 9 && (
                <div className="text-2xs text-[var(--text-muted)] mt-1">
                  {9 - outOf} of the nine tests need prior-year data that isn&rsquo;t available.
                </div>
              )}
            </div>
          )
        })()}
      </div>
    </div>
  )
}

// ── Valuation model cross-check ────────────────────────────────────────────
// No single model fits every company: a DCF misreads high-growth names,
// heavy reinvestors, cyclicals and banks. This grades each model's
// reliability for the company in view, blends the reliable ones, and says
// why the DCF and analysts' targets disagree. Guru reads the same payload.
const GRADE_COLOR = {
  High: 'var(--positive)', Medium: 'var(--accent-gold)', Low: 'var(--negative)',
  Floor: 'var(--text-muted)', 'N/A': 'var(--text-muted)',
}
const STATUS_LABEL = {
  aligned: ['Aligned', 'var(--positive)'],
  moderate: ['Moderate gap', 'var(--accent-gold)'],
  major: ['Major divergence', 'var(--negative)'],
}

function ModelCheckCard({ symbol }) {
  const money = useMoney()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)
  useEffect(() => {
    let live = true
    setLoading(true)
    stocksAPI.getModelCheck(symbol).then((r) => {
      if (!live) return
      setData(r?.error ? null : r)
      setLoading(false)
    })
    return () => { live = false }
  }, [symbol])

  if (loading) return <SkeletonBlock height={220} />
  if (!data) return null

  const pctText = (v) => (v != null ? formatPercent(v) : '-')
  const ratio = (v) => (v != null ? formatPercent(v * 100, 0, false) : 'n/a')
  const tri = data.triangulated
  const an = data.analyst
  const div = data.dcf_vs_analyst || {}
  const status = STATUS_LABEL[div.status]
  const g = data.growth || {}

  return (
    <div className="card">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <h4 className="card-title">Valuation Model Cross-Check</h4>
        <Badge color="var(--accent)">{data.archetype.label}</Badge>
      </div>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{data.archetype.description}</p>
      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        <span className="text-2xs uppercase tracking-wide text-[var(--text-muted)] mr-1">Analysts usually use</span>
        {data.archetype.preferred_methods.map((m) => <Badge key={m}>{m}</Badge>)}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
        <div className="stat">
          <div className="stat-label">Triangulated value</div>
          <div className="stat-value">{tri ? money.price(tri.value) : 'No reliable model'}</div>
          {tri && (
            <div className="text-xs">
              <span className="font-mono" style={{ color: getChangeCSSVar(tri.upside_pct) }}>{pctText(tri.upside_pct)}</span>
              <span className="text-[var(--text-muted)]"> vs price · {tri.confidence} confidence</span>
            </div>
          )}
        </div>
        <div className="stat">
          <div className="stat-label">Analyst mean target</div>
          <div className="stat-value">{an ? money.price(an.mean) : '-'}</div>
          {an && (
            <div className="text-xs">
              <span className="font-mono" style={{ color: getChangeCSSVar(an.upside_pct) }}>{pctText(an.upside_pct)}</span>
              <span className="text-[var(--text-muted)]"> vs price{an.count ? ` · ${an.count} analysts` : ''}</span>
            </div>
          )}
        </div>
        <div className="stat">
          <div className="stat-label">Market-implied</div>
          <div className="stat-value text-sm">{g.market_implied != null ? `${ratio(g.market_implied)} growth needed` : '-'}</div>
          <div className="text-xs text-[var(--text-muted)]">
            {g.market_implied_cost_of_equity != null
              ? `Price implies a ${formatPercent(g.market_implied_cost_of_equity * 100, 1, false)} cost of equity vs ${formatPercent(data.cost_of_equity * 100, 1, false)} used`
              : `Cost of equity used ${formatPercent(data.cost_of_equity * 100, 1, false)}`}
          </div>
        </div>
      </div>

      <div className="table-scroll mt-3">
        <table className="data-table" style={{ minWidth: 460 }}>
          <thead><tr className="text-[var(--text-muted)] text-xs">
            <th className="text-left font-normal py-1">Model</th>
            <th className="text-right font-normal py-1">Value</th>
            <th className="text-right font-normal py-1">vs price</th>
            <th className="text-left font-normal py-1 pl-3">Reliability here</th>
          </tr></thead>
          <tbody>
            {data.models.map((m) => (
              <Fragment key={m.key}>
                <tr className="border-t cursor-pointer" style={{ borderColor: 'var(--border)' }}
                    onClick={() => setOpen(open === m.key ? null : m.key)} aria-expanded={open === m.key}>
                  <td className="py-1.5 text-[var(--text-primary)]">
                    <span className="text-[var(--text-muted)] mr-1">{open === m.key ? '▾' : '▸'}</span>{m.name}
                  </td>
                  <td className="py-1.5 text-right font-mono text-[var(--text-primary)]">{m.value != null ? money.price(m.value) : '-'}</td>
                  <td className="py-1.5 text-right font-mono" style={{ color: m.upside_pct != null ? getChangeCSSVar(m.upside_pct) : 'var(--text-muted)' }}>{pctText(m.upside_pct)}</td>
                  <td className="py-1.5 pl-3">
                    <div className="flex items-center gap-2">
                      {m.reliability != null && (
                        <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ background: 'var(--bg-input)' }}>
                          <div className="h-full rounded-full" style={{ width: `${m.reliability}%`, background: GRADE_COLOR[m.grade] }} />
                        </div>
                      )}
                      <span className="text-xs font-semibold" style={{ color: GRADE_COLOR[m.grade] }}>{m.grade}</span>
                    </div>
                  </td>
                </tr>
                {open === m.key && (
                  <tr>
                    <td colSpan={4} className="pb-2 pt-0.5">
                      <div className="text-xs text-[var(--text-muted)] mb-1">{m.method}</div>
                      <ul className="list-disc pl-5 space-y-0.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                        {m.reasons.map((r) => <li key={r}>{r}</li>)}
                      </ul>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-2xs text-[var(--text-muted)] mt-1.5">
        Tap a model for its reasoning. The triangulated value blends models graded Medium or High, weighted by reliability; earnings power is a no-growth floor shown for reference.
      </p>

      <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h5 className="text-sm font-semibold text-[var(--text-primary)]">Why the DCF and analysts {div.status === 'aligned' ? 'agree' : 'disagree'}</h5>
          {status && <Badge color={status[1]}>{status[0]}{div.gap_pct != null ? ` · ${pctText(div.gap_pct)}` : ''}</Badge>}
        </div>
        <p className="text-sm text-[var(--text-secondary)]">{div.summary}</p>
        {div.reasons?.length > 0 && (
          <ol className="list-decimal pl-5 mt-2 space-y-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">
            {div.reasons.map((r) => (
              <li key={r.title}><span className="font-medium text-[var(--text-primary)]">{r.title}.</span> {r.detail}</li>
            ))}
          </ol>
        )}
        {an?.notes?.length > 0 && <p className="text-xs text-[var(--text-muted)] mt-2">{an.notes.join(' ')}</p>}
        <p className="text-sm text-[var(--text-primary)] mt-3 leading-relaxed">{data.verdict}</p>
      </div>
    </div>
  )
}

function ValuationTab({ symbol, price, fallbackTarget }) {
  const navigate = useNavigate()
  const money = useMoney()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { stocksAPI.getValuation(symbol).then((r) => { setData(r?.error ? null : r); setLoading(false) }) }, [symbol])
  if (loading) return <LoadingSpinner label="Loading valuation…" />
  if (!data) return <p className="text-sm text-[var(--text-muted)]">Valuation unavailable</p>

  // The backend returns the DCF in the listing currency (converting a
  // computed one from the reporting currency where they differ).
  const dcfVal = data.dcf?.dcf ?? data.dcf?.['dcf']
  // A locally-computed DCF reports *why* it declined to produce a number
  // (a bank's cash flows, a cash-burning company) rather than returning
  // nothing and leaving the card looking broken.
  const dcfReason = data.dcf?.applicable === false ? data.dcf.reason : null
  const dcfAssumptions = data.dcf?.assumptions || null
  const upside = dcfVal && price ? ((dcfVal / price - 1) * 100) : null
  // Finnhub price target, falling back to yfinance targets from the quote.
  const fh = data.price_target?.finnhub || {}
  const yft = data.price_target?.yfinance || {}
  const tgt = {
    targetHigh: fh.targetHigh ?? yft.targetHigh ?? fallbackTarget?.target_high,
    targetMedian: fh.targetMedian ?? yft.targetMedian ?? fallbackTarget?.target_median,
    targetLow: fh.targetLow ?? yft.targetLow ?? fallbackTarget?.target_low,
  }
  const grades = data.grades || []
  const gradeColor = (a) => {
    const s = (a || '').toLowerCase()
    if (s.includes('up')) return 'var(--positive)'
    if (s.includes('down')) return 'var(--negative)'
    if (s.includes('init')) return 'var(--accent)'
    return 'var(--text-muted)'
  }

  return (
    <div className="space-y-4">
      <div className="card">
        {dcfReason ? (
          <>
            <div className="text-xs text-[var(--text-muted)]">DCF Fair Value</div>
            <div className="text-lg font-semibold text-[var(--text-secondary)] mt-1">Not applicable</div>
            <p className="text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">{dcfReason}</p>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
              <div><div className="text-xs text-[var(--text-muted)]">DCF Fair Value</div>
                <div className="text-3xl font-bold font-mono" style={{ color: 'var(--positive)' }}>{money.price(dcfVal)}</div></div>
              <div><div className="text-xs text-[var(--text-muted)]">Current Price</div>
                <div className="text-2xl font-mono text-[var(--text-primary)]">{money.price(price)}</div></div>
              {upside != null && <div><div className="text-xs text-[var(--text-muted)]">Upside / (Downside)</div>
                <div className="text-2xl font-mono font-bold" style={{ color: getChangeCSSVar(upside) }}>{formatPercent(upside)}</div></div>}
            </div>
            {dcfAssumptions && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="text-2xs uppercase tracking-wide text-[var(--text-muted)] mb-1.5">Assumptions behind this number</div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    ['Discount rate', formatPercent(dcfAssumptions.discountRate * 100)],
                    ...(dcfAssumptions.riskFreeRate != null ? [[
                      dcfAssumptions.riskFreeLabel?.startsWith('Australian') ? 'Risk-free (AU 10y)' : 'Risk-free (US 10y)',
                      formatPercent(dcfAssumptions.riskFreeRate * 100, 2, false),
                    ]] : []),
                    ['Yr-1 growth', formatPercent(dcfAssumptions.stageOneGrowth * 100)],
                    ['Terminal growth', formatPercent(dcfAssumptions.terminalGrowth * 100)],
                    ['Adj. beta', formatNumber(dcfAssumptions.adjustedBeta, 2)],
                  ].map(([label, value]) => (
                    <div key={label} className="stat">
                      <div className="stat-label">{label}</div>
                      <div className="stat-value text-sm">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <p className="text-xs text-[var(--text-muted)] mt-3">
          DCF is model-dependent.{dcfAssumptions?.riskFreeLabel ? ` Discounted using the ${dcfAssumptions.riskFreeLabel} yield${dcfAssumptions.riskFreeAsOf ? ` (${formatDate(dcfAssumptions.riskFreeAsOf)})` : ''}.` : ''} How far to trust it for this company is graded in the cross-check below. See Valuation Lab to build your own model.
        </p>
        <button onClick={() => navigate(`/learning?symbol=${symbol}#lab`)} className="mt-2 text-sm text-[var(--accent)]">Open in Valuation Lab →</button>
      </div>

      <ModelCheckCard symbol={symbol} />

      <div className="card">
        <h4 className="card-title mb-3">Price Target</h4>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div><div className="text-2xs text-[var(--text-muted)]">Low</div><div className="font-mono text-[var(--text-primary)]">{money.price(tgt.targetLow)}</div></div>
          <div><div className="text-2xs text-[var(--text-muted)]">Median</div><div className="font-mono font-bold text-[var(--text-primary)]">{money.price(tgt.targetMedian)}</div></div>
          <div><div className="text-2xs text-[var(--text-muted)]">High</div><div className="font-mono text-[var(--text-primary)]">{money.price(tgt.targetHigh)}</div></div>
        </div>
      </div>

      {grades.length > 0 && (
        <div className="card">
          <h4 className="card-title mb-2">Recent Grade Changes</h4>
          <div className="table-scroll">
          <table className="data-table" style={{ minWidth: 420 }}>
            <thead><tr className="text-[var(--text-muted)] text-xs">
              <th className="text-left font-normal py-1">Date</th><th className="text-left font-normal py-1">Firm</th>
              <th className="text-left font-normal py-1">Change</th><th className="text-left font-normal py-1">Action</th></tr></thead>
            <tbody>
              {grades.slice(0, 8).map((g, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-1.5 text-[var(--text-secondary)]">{(g.date || '').slice(0, 10)}</td>
                  <td className="py-1.5 text-[var(--text-primary)]">{g.gradingCompany}</td>
                  <td className="py-1.5 text-[var(--text-secondary)]">{g.previousGrade ? `${g.previousGrade} → ` : ''}{g.newGrade}</td>
                  <td className="py-1.5"><Badge color={gradeColor(g.action)}>{g.action || '-'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  )
}

function TechnicalsTab({ symbol }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { stocksAPI.getTechnicals(symbol).then((r) => { setData(r?.error ? null : r); setLoading(false) }) }, [symbol])
  if (loading) return <LoadingSpinner label="Loading technicals…" />
  if (!data || data.error) return <p className="text-sm text-[var(--text-muted)]">Technicals unavailable</p>

  const sr = data.support_resistance?.levels || []
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[['SMA 20', data.sma20, data.price_vs_sma20], ['SMA 50', data.sma50, data.price_vs_sma50], ['SMA 200', data.sma200, data.price_vs_sma200], ['ATR 14', data.atr14, null]].map(([n, v, vs]) => (
          <div key={n} className="rounded-lg p-3" style={{ background: 'var(--bg-input)' }}>
            <div className="text-2xs text-[var(--text-muted)]">{n}</div>
            <div className="text-lg font-mono font-semibold text-[var(--text-primary)]">{v != null ? formatNumber(v, 2) : '-'}</div>
            {vs != null && <div className="text-xs font-mono" style={{ color: getChangeCSSVar(vs) }}>{formatPercent(vs)}</div>}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RSIGauge value={data.rsi14} />
        <div className="card">
          <div className="text-xs text-[var(--text-muted)] mb-2">Support / Resistance</div>
          {sr.length ? (
            <div className="space-y-2.5">
              {[['Resistance', data.support_resistance?.resistance || [], 'var(--negative)'],
                ['Support', data.support_resistance?.support || [], 'var(--positive)']].map(([label, levels, colour]) => (
                levels.length ? (
                  <div key={label}>
                    <div className="text-2xs uppercase tracking-wide text-[var(--text-muted)] mb-1">{label}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {levels.map((lvl, i) => (
                        <span key={i} className="px-2 py-1 rounded font-mono text-sm"
                              style={{ background: 'var(--bg-input)', color: colour }}>{formatNumber(lvl, 2)}</span>
                      ))}
                    </div>
                  </div>
                ) : null
              ))}
              <p className="text-2xs text-[var(--text-muted)] pt-1">
                Swing pivots over the last year, clustered within 1.5%. Levels touched more often are listed first.
              </p>
            </div>
          ) : <p className="text-sm text-[var(--text-muted)]">Not enough price history to identify levels.</p>}
        </div>
      </div>
    </div>
  )
}

function EarningsTab({ symbol }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { setLoading(true); stocksAPI.getEarnings(symbol).then((r) => { setData(r?.error ? null : r); setLoading(false) }) }, [symbol])
  if (loading) return <LoadingSpinner label="Loading earnings…" />
  if (!data || !(data.history || []).length) return <p className="text-sm text-[var(--text-muted)]">No earnings history available.</p>

  const last = data.last_reported
  const beat = last && last.surprise_percent != null ? last.surprise_percent >= 0 : null
  const fmt = (v) => (v != null ? formatNumber(v, 2) : '-')

  return (
    <div className="space-y-4">
      {/* Headline: latest report + next date */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card">
          <div className="text-xs text-[var(--text-muted)] mb-1">Last Reported</div>
          <div className="text-lg font-semibold text-[var(--text-primary)]">{last ? formatDate(last.date) : '-'}</div>
          {last && (
            <div className="mt-2 text-sm">
              <span className="text-[var(--text-secondary)]">Adj. EPS </span>
              <span className="font-mono font-semibold text-[var(--text-primary)]">{fmt(last.eps_reported)}</span>
              <span className="text-[var(--text-muted)]"> vs {fmt(last.eps_estimate)} est.</span>
            </div>
          )}
          {last && last.surprise_percent != null && (
            <div className="mt-1 text-sm font-medium" style={{ color: beat ? 'var(--positive)' : 'var(--negative)' }}>
              {beat ? 'Beat' : 'Missed'} by {formatNumber(Math.abs(last.surprise_percent), 2)}%
            </div>
          )}
        </div>
        <div className="card">
          <div className="text-xs text-[var(--text-muted)] mb-1">Next Earnings</div>
          <div className="text-lg font-semibold text-[var(--text-primary)]">{data.next_date ? formatDate(data.next_date) : 'TBA'}</div>
          <div className="mt-2 text-xs text-[var(--text-muted)]">Estimated report date</div>
        </div>
        <div className="card">
          <div className="text-xs text-[var(--text-muted)] mb-1">Beat Rate (last {data.history.length})</div>
          {(() => {
            const beats = data.history.filter((h) => h.surprise_percent != null && h.surprise_percent >= 0).length
            const tot = data.history.filter((h) => h.surprise_percent != null).length
            return <div className="text-lg font-semibold text-[var(--text-primary)]">{tot ? `${beats}/${tot}` : '-'}</div>
          })()}
          <div className="mt-2 text-xs text-[var(--text-muted)]">Quarters beating estimates</div>
        </div>
      </div>

      {/* History table */}
      <div className="card">
        <h4 className="card-title mb-3">Earnings History - Reported (adjusted) EPS vs Estimate</h4>
        <div className="table-scroll">
          <table className="data-table" style={{ minWidth: 380 }}>
            <thead>
              <tr className="text-[var(--text-muted)] text-xs">
                <th className="text-left font-normal py-1">Report Date</th>
                <th className="text-right font-normal py-1">Estimate</th>
                <th className="text-right font-normal py-1">Reported</th>
                <th className="text-right font-normal py-1">Surprise</th>
              </tr>
            </thead>
            <tbody>
              {data.history.map((h) => {
                const up = h.surprise_percent != null && h.surprise_percent >= 0
                return (
                  <tr key={h.date} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-1.5 text-[var(--text-secondary)]">{formatDate(h.date)}</td>
                    <td className="py-1.5 text-right font-mono text-[var(--text-primary)]">{fmt(h.eps_estimate)}</td>
                    <td className="py-1.5 text-right font-mono text-[var(--text-primary)]">{fmt(h.eps_reported)}</td>
                    <td className="py-1.5 text-right font-mono font-medium" style={{ color: h.surprise_percent == null ? 'var(--text-muted)' : up ? 'var(--positive)' : 'var(--negative)' }}>
                      {h.surprise_percent != null ? `${up ? '+' : ''}${formatNumber(h.surprise_percent, 2)}%` : '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-3">
          "Reported" is the company's adjusted (non-GAAP) EPS that analyst estimates track - this is the headline figure quoted on earnings day. It differs from the GAAP basic/diluted EPS in the Financials tab, which strips out the company's own adjustments. Source: Yahoo Finance.
        </p>
      </div>
    </div>
  )
}

function NewsTab({ symbol }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [src, setSrc] = useState('all')
  useEffect(() => { setLoading(true); stocksAPI.getNews(symbol).then((r) => { setData(r?.error ? null : r); setLoading(false) }) }, [symbol])
  if (loading) return <LoadingSpinner label="Loading news…" />

  // Normalise every source into one shape: { title, url, source, ts(ms), image }.
  const merged = []
  for (const a of (data?.finnhub || [])) merged.push({ feed: 'finnhub', title: a.headline, url: a.url, source: a.source || 'Finnhub', ts: a.datetime ? a.datetime * 1000 : null, image: a.image })
  for (const a of (data?.yfinance || [])) merged.push({ feed: 'yfinance', title: a.title, url: a.url, source: a.source || 'Yahoo Finance', ts: a.published ? Date.parse(a.published) || (typeof a.published === 'number' ? a.published * 1000 : null) : null, image: a.image })
  for (const a of (data?.newsapi || [])) merged.push({ feed: 'newsapi', title: a.title, url: a.url, source: a.source || 'NewsAPI', ts: a.published ? Date.parse(a.published) : null, image: a.image })

  // De-dupe by title, sort newest-first.
  const seen = new Set()
  const all = merged.filter((a) => a.title && a.url && !seen.has(a.title) && seen.add(a.title))
    .sort((x, y) => (y.ts || 0) - (x.ts || 0))

  const sources = ['all', ...['finnhub', 'yfinance', 'newsapi'].filter((f) => merged.some((m) => m.feed === f))]
  const items = (src === 'all' ? all : all.filter((a) => a.feed === src)).slice(0, 30)
  if (!all.length) return <p className="text-sm text-[var(--text-muted)]">No news available</p>

  const srcLabel = { all: 'All sources', finnhub: 'Finnhub', yfinance: 'Yahoo Finance', newsapi: 'NewsAPI' }
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 flex-wrap">
        {sources.map((f) => (
          <button key={f} onClick={() => setSrc(f)} className="px-2.5 py-1 rounded-md text-xs"
                  style={{ background: src === f ? 'var(--accent)' : 'var(--bg-input)', color: src === f ? 'var(--accent-contrast)' : 'var(--text-secondary)' }}>{srcLabel[f]}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((a, i) => (
          <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className="card group" style={{ padding: 12 }}>
            <div className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)]" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.title}</div>
            <div className="mt-1 text-xs text-[var(--text-muted)]">{a.source}{a.ts ? ` · ${timeAgo(a.ts)}` : ''}</div>
          </a>
        ))}
      </div>
    </div>
  )
}

function DividendsTab({ symbol }) {
  const [divs, setDivs] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { stocksAPI.getDividends(symbol).then((r) => { setDivs(Array.isArray(r) ? r : []); setLoading(false) }) }, [symbol])
  if (loading) return <LoadingSpinner label="Loading dividends…" />
  if (!divs || divs.length === 0) return <p className="text-sm text-[var(--text-muted)]">This company does not pay a dividend.</p>

  // Aggregate per year for the chart.
  const byYear = {}
  for (const d of divs) {
    const y = (d.date || '').slice(0, 4)
    if (!y) continue
    byYear[y] = (byYear[y] || 0) + (d.amount || 0)
  }
  const chartData = Object.entries(byYear).map(([year, amount]) => ({ year, amount: +amount.toFixed(2) })).slice(-10)
  const recent = [...divs].reverse().slice(0, 12)

  return (
    <div className="space-y-4">
      <div className="card">
        <h4 className="card-title mb-3">Dividend per Year</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={{ stroke: 'var(--border)' }} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={{ stroke: 'var(--border)' }} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
            <Bar dataKey="amount" fill="var(--accent)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h4 className="card-title mb-2">History</h4>
        <table className="data-table">
          <thead><tr className="text-[var(--text-muted)] text-xs"><th className="text-left font-normal py-1">Date</th><th className="text-right font-normal py-1">Amount</th></tr></thead>
          <tbody>
            {recent.map((d, i) => (
              <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                <td className="py-1.5 text-[var(--text-secondary)]">{formatDate(d.date)}</td>
                <td className="py-1.5 text-right font-mono text-[var(--text-primary)]">{formatNumber(d.amount, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── main ───────────────────────────────────────────────────────────────────
export default function StockDetail() {
  const { symbol } = useParams()
  const navigate = useNavigate()
  const addRecentlyViewed = useStore((s) => s.addRecentlyViewed)
  const isInWatchlist = useStore((s) => s.isInWatchlist)
  const addToWatchlist = useStore((s) => s.addToWatchlist)
  const removeFromWatchlist = useStore((s) => s.removeFromWatchlist)

  const [quote, setQuote] = useState(null)
  const [profile, setProfile] = useState(null)
  const [rec, setRec] = useState(null)
  const [target, setTarget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('Overview')
  const [period, setPeriod] = useState('1y')
  const [history, setHistory] = useState(null)
  const [fx, setFx] = useState(null)
  const [displayCur, setDisplayCur] = useState(null)
  const watching = isInWatchlist(symbol)

  useEffect(() => { macroAPI.getFX().then((r) => setFx(r?.error ? null : r)) }, [])
  // A new symbol starts in its own listing currency.
  useEffect(() => { setDisplayCur(null) }, [symbol])

  useEffect(() => {
    addRecentlyViewed(symbol)
    setLoading(true)
    Promise.all([
      stocksAPI.getQuote(symbol),
      stocksAPI.getProfile(symbol),
      stocksAPI.getRecommendation(symbol),
      stocksAPI.getValuation(symbol),
    ]).then(([q, p, r, v]) => {
      if (q?.error) toast.error(`Failed to load ${symbol} - check API connection`)
      setQuote(q?.error ? null : q)
      setProfile(p?.error ? null : p)
      setRec(Array.isArray(r) && r.length ? r[0] : null)
      setTarget(v?.price_target?.finnhub || null)
      setLoading(false)
    })
  }, [symbol, addRecentlyViewed])

  useEffect(() => {
    setHistory(null)
    stocksAPI.getHistory(symbol, period).then((r) => setHistory(Array.isArray(r) ? r : []))
  }, [symbol, period])

  const toggleWatch = () => {
    if (watching) { removeFromWatchlist(symbol); watchlistAPI.remove(symbol) }
    else {
      addToWatchlist({ symbol, market: symbolIsASX(symbol) ? 'asx' : 'us', name: quote?.name })
      watchlistAPI.add({ symbol, market: symbolIsASX(symbol) ? 'asx' : 'us', name: quote?.name })
    }
  }

  if (loading) return (
    <div className="page">
      <div className="card mb-3 space-y-3">
        <SkeletonBlock height={28} width="40%" />
        <SkeletonBlock height={36} width="55%" />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonBlock key={i} height={48} />)}
        </div>
      </div>
      <div className="card mb-4"><SkeletonChart height={300} /></div>
    </div>
  )
  if (!quote) return (
    <div className="page text-center" style={{ paddingTop: 64 }}>
      <p className="text-[var(--text-secondary)] mb-1">Could not load {symbol}.</p>
      <p className="text-sm text-[var(--text-muted)]">The symbol may be invalid or the data provider is unavailable. Try again or search another ticker.</p>
    </div>
  )

  const listing = quote.currency || (symbolIsASX(symbol) ? 'AUD' : 'USD')
  const money = makeMoney(listing, displayCur || listing, fx)
  const changeColor = getChangeCSSVar(quote.change ?? 0)

  return (
    <MoneyContext.Provider value={money}>
    <div className="page">
      {/* The phone gets a Back button in the app bar itself, so this one is
          desktop-only rather than a second, redundant control. */}
      <button onClick={() => navigate(-1)} className="hidden lg:flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-3">
        <ArrowLeft size={15} /> Back
      </button>

      {/* HEADER */}
      <div className="card mb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl font-bold font-mono text-[var(--text-primary)]">{quote.symbol}</span>
              {quote.exchange && <Badge>{quote.exchange}</Badge>}
              {symbolIsASX(symbol) && <Badge color="var(--accent-gold)">ASX</Badge>}
              {quote.sector && <Badge color="var(--accent-purple)">{quote.sector}</Badge>}
            </div>
            <div className="text-sm text-[var(--text-secondary)] mt-0.5 truncate">{quote.name}</div>
            <div className="flex items-baseline gap-2.5 flex-wrap mt-2.5">
              <span className="text-3xl font-bold font-mono text-[var(--text-primary)] leading-none">{money.price(quote.price)}</span>
              <span className="text-base font-semibold font-mono" style={{ color: changeColor }}>
                {quote.change != null ? `${quote.change > 0 ? '+' : ''}${formatNumber(money.conv(quote.change), 2)}` : ''} ({formatPercent(quote.change_percent)})
              </span>
            </div>
            <ExtendedHours quote={quote} />
            <span className="text-xs text-[var(--text-muted)] mt-1.5 block">At close{quote.previous_close != null ? ` · prev ${money.price(quote.previous_close)}` : ''}</span>
            <div className="mt-3"><CurrencyToggle listing={listing} display={money.display} onChange={setDisplayCur} fx={fx} /></div>
          </div>
          {/* Full-width on a phone so it's a real target, compact on desktop. */}
          <button onClick={toggleWatch} className="btn group w-full sm:w-auto shrink-0"
                  style={{ background: 'var(--bg-input)', color: watching ? 'var(--accent-gold)' : 'var(--text-secondary)' }}>
            <Star size={15} fill={watching ? 'var(--accent-gold)' : 'none'} />
            {watching ? <span><span className="group-hover:hidden">Watching</span><span className="hidden group-hover:inline">Remove?</span></span> : 'Add to Watchlist'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-3.5">
          <Pill label="52W High" value={money.price(quote['52w_high'])} />
          <Pill label="52W Low" value={money.price(quote['52w_low'])} />
          <Pill label="Open" value={money.price(quote.open)} />
          <Pill label="Prev Close" value={money.price(quote.previous_close)} />
          <Pill label="Div Yield" value={quote.dividend_yield != null ? formatPercent(quote.dividend_yield, 2, false) : '-'} />
          <Pill
            label="EPS TTM / Fwd"
            value={`${money.price(quote.eps)} / ${money.price(quote.eps_forward)}`}
          />
        </div>
      </div>

      <AnalystConsensus
        rec={rec}
        price={quote.price}
        numAnalysts={quote.num_analysts}
        target={{
          targetMean: target?.targetMean ?? quote.target_mean,
          targetMedian: target?.targetMedian ?? quote.target_median,
          targetHigh: target?.targetHigh ?? quote.target_high,
          targetLow: target?.targetLow ?? quote.target_low,
        }}
      />

      {/* CHART */}
      <div className="card mb-3">
        {/* Eight timeframes do not fit across a phone, so the strip scrolls
            horizontally and the "Advanced" link sits on its own row there. */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="segmented period-scroll">
            {PERIODS.map(([label, value]) => (
              <button key={value} onClick={() => setPeriod(value)} aria-pressed={period === value} className="font-mono">{label}</button>
            ))}
          </div>
          <button onClick={() => navigate(`/charts?symbol=${symbol}`)}
                  className="hidden sm:block text-xs font-semibold whitespace-nowrap shrink-0" style={{ color: 'var(--accent)' }}>
            Advanced chart →
          </button>
        </div>
        {history === null ? <SkeletonChart height={300} />
          : history.length ? <PriceChart data={history} height={300} showVolume />
          : <div className="flex items-center justify-center text-sm text-[var(--text-muted)]" style={{ height: 300 }}>No chart data available</div>}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 mt-3 text-xs text-[var(--text-muted)]">
          <span>Vol {formatVolume(quote.volume)} · Avg {formatVolume(quote.avg_volume)}</span>
          <span>Mkt Cap {money.big(quote.market_cap)}</span>
        </div>
        <button onClick={() => navigate(`/charts?symbol=${symbol}`)}
                className="sm:hidden btn w-full mt-3" style={{ color: 'var(--accent)' }}>
          Open advanced TradingView chart →
        </button>
      </div>

      {/* TABS */}
      <div className="tabs mb-3">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={tab === t ? 'is-active' : undefined}>{t}</button>
        ))}
      </div>

      <div>
        {tab === 'Overview' && <OverviewTab symbol={symbol} profile={profile} />}
        {tab === 'Financials' && <FinancialsTab symbol={symbol} reported={quote.financial_currency || listing} />}
        {tab === 'Earnings' && <EarningsTab symbol={symbol} />}
        {tab === 'Valuation' && <ValuationTab symbol={symbol} price={quote.price} fallbackTarget={quote} />}
        {tab === 'Technicals' && <TechnicalsTab symbol={symbol} />}
        {tab === 'News' && <NewsTab symbol={symbol} />}
        {tab === 'Dividends' && <DividendsTab symbol={symbol} />}
      </div>
    </div>
    </MoneyContext.Provider>
  )
}
