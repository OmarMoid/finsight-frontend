import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Building2, ExternalLink } from 'lucide-react'
import { stocksAPI } from '../utils/api'
import useStore from '../store/useStore'
import SymbolPicker from '../components/common/SymbolPicker'
import Alert from '../components/common/Alert'
import { SkeletonStatGrid, SkeletonLines, SkeletonCard } from '../components/common/Skeleton'
import {
  formatNumber, formatCurrency, formatPercent, formatDate,
  getChangeCSSVar, getPEContext,
} from '../utils/formatters'

/**
 * Fundamentals — company financials in FinSight's own typography.
 *
 * This replaces the TradingView "Financials" embed that used to sit in the
 * right-hand half of the Charts page. That widget was a cross-origin iframe,
 * so nothing inside it could be restyled: squeezed into a 460px half-column it
 * truncated almost every label to an ellipsis and ran its numbers off its own
 * edge, and there was no lever to fix it short of not using it. Rebuilt on the
 * data the backend already serves, every value can wrap, every table can size
 * to its content, and the page inherits the app's theme for free.
 *
 * The layout rule throughout: **labels wrap, numbers don't.** A metric name is
 * prose and can take two lines; a figure that breaks mid-number is unreadable,
 * so every value cell is `whitespace-nowrap` and wide tables scroll inside
 * their own container rather than stretching the page.
 */

// ── Small building blocks ───────────────────────────────────────────────────

function Metric({ label, value, hint, colour }) {
  return (
    <div className="stat">
      {/* The label is allowed to run to two lines — "Return on Invested
          Capital" truncated to "Return on Inv…" tells the reader nothing. */}
      <div className="stat-label" style={{ whiteSpace: 'normal' }}>{label}</div>
      <div className="stat-value" style={{ color: colour || undefined, whiteSpace: 'nowrap' }}>
        {value ?? '-'}
      </div>
      {hint && <div className="text-2xs text-[var(--text-muted)] mt-0.5">{hint}</div>}
    </div>
  )
}

function Card({ title, subtitle, children, action }) {
  return (
    <section className="card">
      {(title || action) && (
        <div className="card-head">
          <div className="min-w-0">
            {title && <h2 className="card-title">{title}</h2>}
            {subtitle && (
              <p className="text-2xs text-[var(--text-muted)] mt-0.5 leading-relaxed">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

/** A statement table: metric rows down the side, periods across the top. */
function StatementTable({ rows, periods, currency, render }) {
  if (!periods.length) {
    return <p className="text-sm text-[var(--text-muted)]">No periods reported.</p>
  }
  return (
    <div className="table-scroll">
      <table className="data-table" style={{ minWidth: 120 + periods.length * 96 }}>
        <thead>
          <tr>
            <th className="text-left">Metric</th>
            {periods.map((p) => (
              <th key={p.date} className="num">{String(p.calendarYear || p.date || '').slice(0, 4)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, key, fmt]) => (
            <tr key={label}>
              <td className="text-left text-[var(--text-secondary)]">{label}</td>
              {periods.map((p) => (
                <td key={p.date} className="num font-mono whitespace-nowrap">
                  {(fmt || render)(p[key], currency)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Growth helper ───────────────────────────────────────────────────────────
// Compound annual growth over the reported periods. Returns null rather than a
// misleading number when the earliest figure is zero or negative — a CAGR out
// of a loss year is arithmetic, not information.
function cagr(rows, key) {
  const values = rows.map((r) => r?.[key]).filter((v) => typeof v === 'number')
  if (values.length < 2) return null
  const latest = values[0]
  const earliest = values[values.length - 1]
  const years = values.length - 1
  if (!(earliest > 0) || !(latest > 0)) return null
  return (Math.pow(latest / earliest, 1 / years) - 1) * 100
}

function yoy(rows, key) {
  const [now, prev] = [rows?.[0]?.[key], rows?.[1]?.[key]]
  if (typeof now !== 'number' || typeof prev !== 'number' || prev === 0) return null
  return (now / Math.abs(prev) - 1) * 100
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function Fundamentals() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const activeMarket = useStore((s) => s.activeMarket)
  const recentlyViewed = useStore((s) => s.recentlyViewed)

  const initial =
    params.get('symbol') || recentlyViewed?.[0] || (activeMarket === 'asx' ? 'BHP.AX' : 'AAPL')
  const [symbol, setSymbol] = useState(initial.toUpperCase())
  const [period, setPeriod] = useState('annual')

  const [quote, setQuote] = useState(null)
  const [profile, setProfile] = useState(null)
  const [financials, setFinancials] = useState(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setFailed(false)
    const [q, p, f] = await Promise.all([
      stocksAPI.getQuote(symbol),
      stocksAPI.getProfile(symbol),
      stocksAPI.getFinancials(symbol, period),
    ])
    setQuote(q?.error ? null : q)
    setProfile(p?.error ? null : p)
    setFinancials(f?.error ? null : f)
    // Only a total miss is a failure: a symbol with no analyst coverage still
    // has statements worth showing, and vice versa.
    setFailed(!!(q?.error && f?.error))
    setLoading(false)
  }, [symbol, period])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const q = params.get('symbol')
    if (q && q.toUpperCase() !== symbol) setSymbol(q.toUpperCase())
  }, [params]) // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (next) => {
    setSymbol(next)
    setParams({ symbol: next })
  }

  const currency = quote?.currency || 'USD'
  const km = financials?.key_metrics_ttm || {}
  const rt = financials?.ratios_ttm || {}
  const income = financials?.income_statement || []
  const balance = financials?.balance_sheet || []
  const cash = financials?.cash_flow || []
  const scores = financials?.financial_scores || {}
  const ev = (financials?.enterprise_values || [])[0] || {}
  const fmpProfile = profile?.fmp || {}
  const yfProfile = profile?.yfinance || {}

  const description = fmpProfile.description || yfProfile.longBusinessSummary || null

  const pct = (v, digits = 1) => (v != null ? formatPercent(v * 100, digits, false) : null)
  const money = (v) => (v != null ? formatCurrency(v, currency, true) : '-')
  const plain = (v, d = 2) => (v != null ? formatNumber(v, d) : null)

  const pe = rt.priceToEarningsRatioTTM ?? km.peRatioTTM
  const valuationMetrics = [
    ['P/E (trailing)', plain(pe), getPEContext(pe).label],
    ['P/E (forward)', plain(quote?.pe_forward), null],
    ['P/B', plain(rt.priceToBookRatioTTM ?? km.pbRatioTTM), null],
    ['P/S', plain(rt.priceToSalesRatioTTM ?? km.priceToSalesRatioTTM), null],
    ['EV/EBITDA', plain(km.evToEBITDATTM), null],
    ['EV/Sales', plain(km.evToSalesTTM), null],
    ['PEG', plain(km.pegRatioTTM), null],
    ['FCF Yield', pct(km.freeCashFlowYieldTTM), null],
  ]

  const qualityMetrics = [
    ['Return on Equity', pct(km.returnOnEquityTTM)],
    ['Return on Assets', pct(km.returnOnAssetsTTM)],
    ['Return on Invested Capital', pct(km.returnOnInvestedCapitalTTM)],
    ['Gross Margin', pct(rt.grossProfitMarginTTM)],
    ['Operating Margin', pct(rt.operatingProfitMarginTTM)],
    ['Net Margin', pct(rt.netProfitMarginTTM)],
  ]

  const healthMetrics = [
    ['Current Ratio', plain(rt.currentRatioTTM ?? km.currentRatioTTM)],
    ['Quick Ratio', plain(rt.quickRatioTTM)],
    ['Debt / Equity', plain(rt.debtToEquityRatioTTM ?? km.debtToEquityTTM)],
    ['Total Debt', money(balance[0]?.totalDebt)],
    ['Cash & Equivalents', money(balance[0]?.cashAndCashEquivalents)],
    ['Enterprise Value', money(ev.enterpriseValue)],
  ]

  const growthRows = [
    ['Revenue', cagr(income, 'revenue'), yoy(income, 'revenue')],
    ['Gross Profit', cagr(income, 'grossProfit'), yoy(income, 'grossProfit')],
    ['Operating Income', cagr(income, 'operatingIncome'), yoy(income, 'operatingIncome')],
    ['Net Income', cagr(income, 'netIncome'), yoy(income, 'netIncome')],
    ['Diluted EPS', cagr(income, 'epsdiluted'), yoy(income, 'epsdiluted')],
    ['Free Cash Flow', cagr(cash, 'freeCashFlow'), yoy(cash, 'freeCashFlow')],
  ].filter(([, c, y]) => c != null || y != null)

  return (
    <div className="page">
      <div className="page-head">
        <div className="min-w-0">
          <h1 className="page-title flex items-center gap-2">
            <Building2 size={18} className="text-[var(--accent)] shrink-0" />
            Fundamentals
          </h1>
          <p className="page-sub">
            The full financial picture for one company - every figure in full, nothing abbreviated.
          </p>
        </div>
      </div>

      <SymbolPicker value={symbol} onSubmit={pick} />

      {failed && (
        <Alert title="Couldn't load fundamentals" onRetry={load}>
          The data service didn&rsquo;t respond for {symbol}. Check the symbol, or try again.
        </Alert>
      )}

      {loading ? (
        <div className="stack">
          <SkeletonCard lines={3} />
          <SkeletonStatGrid count={8} className="grid grid-cols-2 sm:grid-cols-4 gap-3" />
          <SkeletonCard lines={6} />
        </div>
      ) : (
        <div className="stack">
          {/* ── Identity ─────────────────────────────────────────────────── */}
          <Card>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-lg font-bold text-[var(--text-primary)]">{symbol}</span>
              {/* No truncate: a company's full name is short enough to wrap
                  and long enough to be unrecognisable when cut. */}
              <span className="text-base text-[var(--text-secondary)]">{quote?.name || '-'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {[quote?.exchange, quote?.sector, quote?.industry].filter(Boolean).map((t) => (
                <span key={t} className="badge">{t}</span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <Metric label="Price" value={quote?.price != null ? formatCurrency(quote.price, currency) : '-'} />
              <Metric
                label="Change"
                value={quote?.change_percent != null ? formatPercent(quote.change_percent) : '-'}
                colour={getChangeCSSVar(quote?.change_percent)}
              />
              <Metric label="Market Cap" value={money(quote?.market_cap)} />
              <Metric label="Beta" value={plain(quote?.beta) ?? '-'} hint="vs. the market" />
            </div>

            {description && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="section-label mb-1.5">Business</div>
                {/* The whole description, wrapped — this is the text the
                    TradingView widget cut off after roughly a line and a half. */}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
                {(fmpProfile.website || yfProfile.website) && (
                  <a
                    href={fmpProfile.website || yfProfile.website}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[var(--accent)] mt-2"
                  >
                    Company website <ExternalLink size={13} />
                  </a>
                )}
              </div>
            )}
          </Card>

          {/* ── Ratio panels ─────────────────────────────────────────────── */}
          <Card title="Valuation" subtitle="What the market is paying for each unit of earnings, book value, sales and cash flow.">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {valuationMetrics.map(([label, value, hint]) => (
                <Metric key={label} label={label} value={value ?? '-'} hint={hint} />
              ))}
            </div>
          </Card>

          <Card title="Profitability & Quality" subtitle="How much profit the business generates from the capital it employs.">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {qualityMetrics.map(([label, value]) => (
                <Metric key={label} label={label} value={value ?? '-'} />
              ))}
            </div>
          </Card>

          <Card title="Balance Sheet Health" subtitle="Whether the company can meet what it owes, and how much of it is borrowed.">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {healthMetrics.map(([label, value]) => (
                <Metric key={label} label={label} value={value ?? '-'} />
              ))}
            </div>
          </Card>

          {/* ── Growth ───────────────────────────────────────────────────── */}
          {growthRows.length > 0 && (
            <Card
              title="Growth"
              subtitle={`Compound annual growth across the ${income.length} reported periods, and the most recent year on year.`}
            >
              <div className="table-scroll">
                <table className="data-table" style={{ minWidth: 320 }}>
                  <thead>
                    <tr>
                      <th className="text-left">Line item</th>
                      <th className="num">CAGR</th>
                      <th className="num">Latest YoY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {growthRows.map(([label, c, y]) => (
                      <tr key={label}>
                        <td className="text-left text-[var(--text-secondary)]">{label}</td>
                        <td className="num font-mono whitespace-nowrap" style={{ color: getChangeCSSVar(c) }}>
                          {c != null ? formatPercent(c, 1) : '-'}
                        </td>
                        <td className="num font-mono whitespace-nowrap" style={{ color: getChangeCSSVar(y) }}>
                          {y != null ? formatPercent(y, 1) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ── Statements ───────────────────────────────────────────────── */}
          <Card
            title="Financial Statements"
            subtitle={`Reported in ${currency}. Source: ${financials?.data_source === 'yfinance' ? 'Yahoo Finance' : 'Financial Modeling Prep'}.`}
            action={
              <div className="segmented shrink-0">
                {['annual', 'quarterly'].map((p) => (
                  <button key={p} onClick={() => setPeriod(p)} aria-pressed={period === p} className="capitalize">
                    {p}
                  </button>
                ))}
              </div>
            }
          >
            <div className="stack">
              <div>
                <div className="section-label mb-1.5">Income Statement</div>
                <StatementTable
                  periods={income}
                  currency={currency}
                  render={(v, c) => (v != null ? formatCurrency(v, c, true) : '-')}
                  rows={[
                    ['Revenue', 'revenue'],
                    ['Cost of Revenue', 'costOfRevenue'],
                    ['Gross Profit', 'grossProfit'],
                    ['Operating Income (EBIT)', 'operatingIncome'],
                    ['EBITDA', 'ebitda'],
                    ['Interest Expense', 'interestExpense'],
                    ['Tax', 'incomeTaxExpense'],
                    ['Net Income', 'netIncome'],
                    ['Diluted EPS', 'epsdiluted', (v) => (v != null ? formatNumber(v, 2) : '-')],
                  ]}
                />
              </div>

              <div>
                <div className="section-label mb-1.5">Balance Sheet</div>
                <StatementTable
                  periods={balance}
                  currency={currency}
                  render={(v, c) => (v != null ? formatCurrency(v, c, true) : '-')}
                  rows={[
                    ['Total Assets', 'totalAssets'],
                    ['Current Assets', 'totalCurrentAssets'],
                    ['Cash & Equivalents', 'cashAndCashEquivalents'],
                    ['Total Liabilities', 'totalLiabilities'],
                    ['Current Liabilities', 'totalCurrentLiabilities'],
                    ['Total Debt', 'totalDebt'],
                    ['Net Debt', 'netDebt'],
                    ['Retained Earnings', 'retainedEarnings'],
                    ["Shareholders' Equity", 'totalStockholdersEquity'],
                  ]}
                />
              </div>

              <div>
                <div className="section-label mb-1.5">Cash Flow</div>
                <StatementTable
                  periods={cash}
                  currency={currency}
                  render={(v, c) => (v != null ? formatCurrency(v, c, true) : '-')}
                  rows={[
                    ['Operating Cash Flow', 'operatingCashFlow'],
                    ['Capital Expenditure', 'capitalExpenditure'],
                    ['Free Cash Flow', 'freeCashFlow'],
                    ['Dividends Paid', 'dividendsPaid'],
                    ['Depreciation & Amortisation', 'depreciationAndAmortization'],
                  ]}
                />
              </div>
            </div>
          </Card>

          {/* ── Scores ───────────────────────────────────────────────────── */}
          <Card
            title="Financial Strength Scores"
            subtitle="Two standard academic screens, computed from the statements above."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="stat">
                <div className="stat-label" style={{ whiteSpace: 'normal' }}>Altman Z-Score</div>
                {scores.altmanDetail?.applicable === false ? (
                  <>
                    <div className="text-base font-semibold text-[var(--text-secondary)] mt-0.5">Not applicable</div>
                    <p className="text-2xs text-[var(--text-muted)] mt-1 leading-relaxed">
                      {scores.altmanDetail.reason}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="stat-value">{plain(scores.altmanZScore) ?? '-'}</div>
                    <p className="text-2xs text-[var(--text-muted)] mt-1 leading-relaxed">
                      Bankruptcy risk. Above 3.0 is safe, below 1.8 is distress.
                    </p>
                  </>
                )}
              </div>
              <div className="stat">
                <div className="stat-label" style={{ whiteSpace: 'normal' }}>Piotroski F-Score</div>
                <div className="stat-value">
                  {scores.piotroskiScore != null ? scores.piotroskiScore : '-'}
                  <span className="text-sm text-[var(--text-muted)]">/{scores.piotroskiOutOf || 9}</span>
                </div>
                <p className="text-2xs text-[var(--text-muted)] mt-1 leading-relaxed">
                  Nine pass/fail tests of profitability, leverage and efficiency. 7+ is strong.
                </p>
              </div>
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            <button className="btn" onClick={() => navigate(`/stock/${symbol}`)}>
              Open full stock page
            </button>
            <button className="btn" onClick={() => navigate(`/charts?symbol=${symbol}`)}>
              Open chart
            </button>
            <button className="btn" onClick={() => navigate(`/filings?symbol=${symbol}`)}>
              Read the filings
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
