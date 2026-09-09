// Research — Jimmy's Research engine, integrated as a FinSight tab.
//
// Ported from the standalone Next.js app: same analysis, same layout, but the
// hardcoded dark palette is replaced with FinSight's theme CSS variables so it
// follows whichever theme is active, and it calls FinSight's own
// axios client (which returns an `{error:true}` object rather than throwing).
import { Fragment, useState, useCallback } from 'react'
import {
  Search,
  Download,
  Loader2,
  AlertCircle,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  ChevronUp,
  ScrollText,
  Calculator,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Target,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { researchAPI } from '../utils/api'
import { resolveUrl } from '../utils/apiBase'
import { saveBlob, saveResultMessage } from '../utils/download'

// ---------- formatting helpers ----------
function fmtNum(n, digits = 2) {
  if (n === null || n === undefined || n === '' || Number.isNaN(Number(n))) return '-'
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  })
}

// Prices always carry two decimals. fmtNum drops trailing zeros, which left
// "$529" sitting next to "$545.87" in the same row.
function fmtPrice(n) {
  if (n === null || n === undefined || n === '' || Number.isNaN(Number(n))) return '-'
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function fmtLargeUSD(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return '-'
  const v = Number(n)
  const abs = Math.abs(v)
  if (abs >= 1e12) return `$${(v / 1e12).toFixed(2)}T`
  if (abs >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
  if (abs >= 1e6) return `$${(v / 1e6).toFixed(2)}M`
  return `$${fmtNum(v)}`
}

function fmtDate(iso) {
  if (!iso) return '-'
  // Date-only strings ("YYYY-MM-DD") are calendar dates, not instants.
  // `new Date(iso)` parses those as UTC midnight, which reads back as the
  // previous day in any timezone behind UTC — parse the components as local
  // time instead. Full timestamps (with a time component) are left as-is.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

// Key-metric spec: raw backend key → [readable label, unit kind].
// kinds: money (abbrev $) | price ($) | pct (fraction→%) | ratio (x) | num
const KEY_METRIC_SPEC = [
  ['peRatioTTM', 'P/E (TTM)', 'ratio'],
  ['forwardPE', 'Forward P/E', 'ratio'],
  ['pegRatioTTM', 'PEG Ratio', 'ratio'],
  ['priceToBookTTM', 'Price / Book', 'ratio'],
  ['priceToSalesTTM', 'Price / Sales', 'ratio'],
  ['enterpriseValue', 'Enterprise Value', 'money'],
  ['enterpriseToEbitdaTTM', 'EV / EBITDA', 'ratio'],
  ['enterpriseToRevenueTTM', 'EV / Revenue', 'ratio'],
  ['returnOnEquityTTM', 'Return on Equity', 'pct'],
  ['returnOnAssetsTTM', 'Return on Assets', 'pct'],
  ['grossMarginTTM', 'Gross Margin', 'pct'],
  ['operatingMarginTTM', 'Operating Margin', 'pct'],
  ['netProfitMarginTTM', 'Net Profit Margin', 'pct'],
  ['debtToEquityTTM', 'Debt / Equity', 'ratio'],
  ['currentRatioTTM', 'Current Ratio', 'ratio'],
  ['quickRatioTTM', 'Quick Ratio', 'ratio'],
  ['dividendYieldTTM', 'Dividend Yield', 'pct'],
  ['payoutRatioTTM', 'Payout Ratio', 'pct'],
  ['bookValuePerShareTTM', 'Book Value / Share', 'price'],
  ['revenuePerShareTTM', 'Revenue / Share', 'price'],
  ['epsTrailingTTM', 'EPS (TTM)', 'price'],
  ['epsForward', 'Forward EPS', 'price'],
  ['freeCashFlowTTM', 'Free Cash Flow', 'money'],
  ['operatingCashFlowTTM', 'Operating Cash Flow', 'money'],
]

function fmtMetric(value, kind) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '-'
  const v = Number(value)
  switch (kind) {
    case 'money':
      return fmtLargeUSD(v)
    case 'price':
      return `$${fmtNum(v)}`
    case 'pct':
      return `${fmtNum(v * 100, 1)}%`
    case 'ratio':
      return `${fmtNum(v)}x`
    default:
      return fmtNum(v)
  }
}

// ---------- small presentational pieces ----------
function Card({ title, children, right }) {
  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

function Stat({ label, value }) {
  return (
    <div
      className="rounded-lg px-3 py-2"
      style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}
    >
      <div className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div
        className="text-sm font-medium mt-0.5 break-words"
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </div>
    </div>
  )
}

function EmptyRow({ cols, text }) {
  return (
    <tr>
      <td colSpan={cols} className="px-3 py-4 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        {text}
      </td>
    </tr>
  )
}

// Collapsible summarised narrative (Business, MD&A, Risk Factors, etc.).
// `block` = { summary, form, filed, url } — carries its own official source.
function NarrativeCard({ title, icon: Icon, block }) {
  const [expanded, setExpanded] = useState(false)
  const text = block?.summary
  if (!text) return null
  const long = text.length > 1600
  const shown = expanded || !long ? text : text.slice(0, 1600).trimEnd() + '…'
  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h3
          className="flex items-center gap-2 text-sm font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {Icon && <Icon size={15} style={{ color: 'var(--accent)' }} />}
          {title}
        </h3>
        {block.form && (
          <a
            href={resolveUrl(block.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
            title="Official source filing"
          >
            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
              {block.form}
            </span>
            <span>· filed {fmtDate(block.filed)}</span>
            <ExternalLink size={11} />
          </a>
        )}
      </div>
      <div className="p-4">
        <p
          className="whitespace-pre-wrap text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {shown}
        </p>
        {long && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium"
            style={{ color: 'var(--accent)' }}
          >
            {expanded ? (
              <>
                Show less <ChevronUp size={13} />
              </>
            ) : (
              <>
                Show more <ChevronDown size={13} />
              </>
            )}
          </button>
        )}
      </div>
    </section>
  )
}

// Format a single walkthrough step value by its kind.
function fmtStep(value, kind) {
  if (value === null || value === undefined) return '-'
  if (kind === 'text' || typeof value === 'string') return value
  switch (kind) {
    case 'money':
      return fmtLargeUSD(value)
    case 'price':
      return `$${fmtNum(value)}`
    case 'pct':
      return `${fmtNum(value * 100, 1)}%`
    default:
      return fmtNum(value)
  }
}

const ROLE_COLOR = {
  Primary: 'var(--accent)',
  Supporting: 'var(--text-secondary)',
  Floor: 'var(--accent-gold)',
}

// Expanded read-only walkthrough for one valuation model: role, note, and the
// ordered calculation steps (label · formula · value) straight from the backend.
function ModelWalkthrough({ model }) {
  const roleColor = ROLE_COLOR[model.role] || ROLE_COLOR.Supporting
  return (
    <div
      className="px-4 py-3"
      style={{ background: 'var(--bg-input)', borderTop: '1px solid var(--border)' }}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className="rounded px-2 py-0.5 text-[11px] font-semibold"
          style={{ color: roleColor, background: 'var(--bg-card)' }}
        >
          {model.role}
          {model.weight ? ` · ${fmtNum(model.weight * 100, 0)}% weight` : ''}
        </span>
        {model.note && (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {model.note}
          </span>
        )}
      </div>
      {model.steps?.length ? (
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="data-table table-tight text-xs" style={{ minWidth: 460 }}>
            <thead>
              <tr className="text-left uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                <th className="py-1 pr-3 font-medium">Step / data used</th>
                <th className="py-1 pr-3 font-medium">Formula</th>
                <th className="py-1 text-right font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {model.steps.map((st, i) => {
                const last = i === model.steps.length - 1
                return (
                  <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                    <td
                      className={`py-1 pr-3 ${last ? 'font-semibold' : ''}`}
                      style={{ color: last ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                    >
                      {st.label}
                    </td>
                    <td
                      className="py-1 pr-3 font-mono text-[11px]"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {st.formula}
                    </td>
                    <td
                      className={`py-1 text-right tabular-nums ${last ? 'font-semibold' : ''}`}
                      style={{ color: last ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                    >
                      {fmtStep(st.value, st.kind)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          No calculation steps available.
        </p>
      )}
    </div>
  )
}

// Split-line-item assumptions (EPS/revenue growth/net income/FCF/BVPS/dividend,
// each broken into TTM/prior-FY/forward rather than one blended figure) plus
// the growth reconciliation, collapsed by default since it's a lot of detail.
const ASSUMPTIONS_SPEC = [
  ['EPS - TTM / Latest FY', 'eps_ttm', 'price'],
  ['EPS - Prior FY', 'eps_prior_fy', 'price'],
  ['EPS - Forward / NTM Consensus', 'eps_forward_ntm', 'price'],
  ['Revenue Growth - Trailing CAGR', 'revenue_growth_trailing_cagr', 'pct'],
  ['Revenue Growth - Latest FY YoY', 'revenue_growth_latest_fy_yoy', 'pct'],
  ['Revenue Growth - Forward FY Consensus', 'revenue_growth_forward_fy', 'pct'],
  ['Net Income - TTM', 'net_income_ttm', 'money'],
  ['Net Income - Prior FY', 'net_income_prior_fy', 'money'],
  ['Net Income - Normalised Average', 'avg_net_income', 'money'],
  ['Free Cash Flow - TTM', 'free_cash_flow', 'money'],
  ['Free Cash Flow - 3yr Average', 'fcf_3yr_avg', 'money'],
  ['Book Value / Share', 'book_value_per_share', 'price'],
  ['Book Value / Share - Prior FY', 'book_value_per_share_prior_fy', 'price'],
  ['Dividend / Share', 'dividend_per_share', 'price'],
  ['Dividend / Share - Prior FY', 'dividend_per_share_prior_fy', 'price'],
  ['Growth Rate Used (capped anchor)', 'growth_rate', 'pct'],
  ['Market-Implied Growth (back-solved)', 'implied_growth_rate', 'pct'],
]

function AssumptionsPanel({ inputs }) {
  const [open, setOpen] = useState(false)
  const rows = ASSUMPTIONS_SPEC.filter(([, key]) => inputs?.[key] != null)
  if (!rows.length) return null
  return (
    <div className="mt-4 rounded-lg" style={{ border: '1px solid var(--border)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span>Assumptions &amp; Data ({rows.length} fields)</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div
          className="grid grid-cols-1 gap-x-6 gap-y-1 px-3 py-2 text-xs sm:grid-cols-2"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {rows.map(([label, key, kind]) => (
            <div key={key} className="flex justify-between gap-2 py-0.5">
              <span style={{ color: 'var(--text-muted)' }}>{label}</span>
              <span className="font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {fmtStep(inputs[key], kind)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// 5x5 fair-value-per-share grid across terminal growth (rows) x discount rate
// (columns), centered on the DCF's own assumptions — makes visible how much
// the verdict depends on two assumptions that a single point estimate hides.
function SensitivityTable({ sensitivity, ownTerminalGrowth, ownDiscountRate }) {
  if (!sensitivity?.grid?.length) return null
  const { terminal_growth_range: tgs, discount_rate_range: drs, grid } = sensitivity
  const isOwnCol = (dr) => ownDiscountRate != null && Math.abs(dr - ownDiscountRate) < 1e-6
  const isOwnRow = (tg) => ownTerminalGrowth != null && Math.abs(tg - ownTerminalGrowth) < 1e-6
  return (
    <div className="mt-4">
      <h4
        className="mb-2 text-xs font-semibold uppercase tracking-wide"
        style={{ color: 'var(--text-muted)' }}
      >
        DCF Sensitivity - Fair Value per Share
      </h4>
      <div className="overflow-x-auto">
        <table className="data-table table-tight text-xs" style={{ minWidth: 420 }}>
          <thead>
            <tr>
              <th className="px-2 py-1 text-left" style={{ color: 'var(--text-muted)' }}>
                Term. growth ↓ / Disc. rate →
              </th>
              {drs.map((dr, j) => (
                <th
                  key={j}
                  className="px-2 py-1 text-right"
                  style={{ color: isOwnCol(dr) ? 'var(--accent)' : 'var(--text-muted)' }}
                >
                  {fmtNum(dr * 100, 1)}%
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tgs.map((tg, i) => (
              <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                <td
                  className="px-2 py-1"
                  style={{ color: isOwnRow(tg) ? 'var(--accent)' : 'var(--text-muted)' }}
                >
                  {fmtNum(tg * 100, 1)}%
                </td>
                {grid[i].map((v, j) => {
                  const own = isOwnRow(tg) && isOwnCol(drs[j])
                  return (
                    <td
                      key={j}
                      className="px-2 py-1 text-right tabular-nums"
                      style={{
                        color: 'var(--text-primary)',
                        background: own ? 'var(--bg-card-hover)' : 'transparent',
                        fontWeight: own ? 600 : 400,
                      }}
                    >
                      {v != null ? `$${fmtNum(v)}` : '-'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------- the call: rating, price target, scenarios, macro ----------
const RATING_TONE = {
  'Strong Buy': 'positive',
  Buy: 'positive',
  Hold: 'neutral',
  Reduce: 'negative',
  Sell: 'negative',
}

function toneColor(tone) {
  if (tone === 'positive') return 'var(--positive)'
  if (tone === 'negative') return 'var(--negative)'
  return 'var(--text-secondary)'
}

function signed(n, digits = 1) {
  if (n == null || Number.isNaN(Number(n))) return '-'
  return `${Number(n) > 0 ? '+' : ''}${fmtNum(n, digits)}%`
}

/**
 * The headline call. Deliberately the first thing on the page: a research note
 * leads with the rating and the target, not with the model that produced them.
 */
function HouseViewCard({ houseView, price }) {
  const [showScale, setShowScale] = useState(false)
  if (!houseView) return null
  const tone = RATING_TONE[houseView.rating] || 'neutral'
  const color = toneColor(tone)
  const Icon = tone === 'positive' ? TrendingUp : tone === 'negative' ? TrendingDown : Minus

  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: `1px solid ${color}` }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h3
          className="flex items-center gap-2 text-sm font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          <Target size={15} style={{ color: 'var(--accent)' }} />
          The Call
        </h3>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {houseView.conviction} conviction
        </span>
      </div>

      <div className="grid gap-px sm:grid-cols-3" style={{ background: 'var(--border)' }}>
        <div className="px-4 py-4" style={{ background: 'var(--bg-card)' }}>
          <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Rating
          </div>
          <div className="mt-1 flex items-center gap-2" style={{ color }}>
            <Icon size={20} />
            <span className="text-2xl font-bold">{houseView.rating}</span>
          </div>
          <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            {houseView.rating_rationale}
          </div>
        </div>

        <div className="px-4 py-4" style={{ background: 'var(--bg-card)' }}>
          <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            12-month price target
          </div>
          <div className="mt-1 text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
            ${fmtPrice(houseView.price_target_12m)}
          </div>
          <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            vs ${fmtPrice(price)} today ·{' '}
            <span style={{ color: houseView.price_target_upside_pct >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
              {signed(houseView.price_target_upside_pct)}
            </span>
          </div>
        </div>

        <div className="px-4 py-4" style={{ background: 'var(--bg-card)' }}>
          <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Expected total return
          </div>
          <div
            className="mt-1 text-2xl font-bold font-mono"
            style={{ color: houseView.expected_total_return_pct >= 0 ? 'var(--positive)' : 'var(--negative)' }}
          >
            {signed(houseView.expected_total_return_pct)}
          </div>
          <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            incl. {fmtNum(houseView.dividend_yield_pct)}% dividend · hurdle{' '}
            {fmtNum(houseView.cost_of_equity * 100)}%
          </div>
        </div>
      </div>

      <div
        className="flex flex-wrap gap-x-5 gap-y-1 px-4 py-2.5 text-xs"
        style={{ background: 'var(--bg-input)', borderTop: '1px solid var(--border)' }}
      >
        {houseView.risk_reward_ratio && (
          <span style={{ color: 'var(--text-secondary)' }}>
            Risk/reward{' '}
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {houseView.risk_reward_ratio}:1
            </span>
          </span>
        )}
        <span style={{ color: 'var(--text-secondary)' }}>
          Model target{' '}
          <span className="font-mono" style={{ color: 'var(--text-primary)' }}>
            ${fmtPrice(houseView.model_only_target)}
          </span>
        </span>
        {houseView.consensus_target != null && (
          <span style={{ color: 'var(--text-secondary)' }}>
            Street{' '}
            <span className="font-mono" style={{ color: 'var(--text-primary)' }}>
              ${fmtPrice(houseView.consensus_target)}
            </span>{' '}
            ({fmtNum(houseView.consensus_weight * 100, 0)}% weight)
          </span>
        )}
        <button
          type="button"
          onClick={() => setShowScale((v) => !v)}
          className="inline-flex items-center gap-1"
          style={{ color: 'var(--accent)' }}
        >
          Rating scale {showScale ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {showScale && (
        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <ul className="space-y-1.5">
            {houseView.rating_scale?.map((r) => (
              <li key={r.rating} className="flex flex-wrap items-baseline gap-2 text-xs">
                <span
                  className="w-20 shrink-0 font-semibold"
                  style={{ color: toneColor(RATING_TONE[r.rating]) }}
                >
                  {r.rating}
                </span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>
                  {r.threshold_pct != null ? `≥ ${r.threshold_pct}%` : 'below'}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{r.meaning}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            {houseView.methodology}
          </p>
          {houseView.conviction_notes?.length > 0 && (
            <ul className="mt-2 space-y-1">
              {houseView.conviction_notes.map((n, i) => (
                <li key={i} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  · {n}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}

/** Bull / base / bear ladder with the probability weights behind the target. */
function ScenarioLadder({ scenarios, probabilities, price }) {
  if (!scenarios?.length) return null
  const values = scenarios.map((s) => s.value_per_share).filter((v) => v != null)
  if (!values.length) return null
  const lo = Math.min(...values, price || Infinity)
  const hi = Math.max(...values, price || 0)
  const span = hi - lo || 1
  const pos = (v) => `${((v - lo) / span) * 100}%`

  const tone = { bull: 'var(--positive)', base: 'var(--accent)', bear: 'var(--negative)' }

  return (
    <Card title="Scenario Ladder">
      {/* Visual range with the current price marked — the fastest read of
          whether today's price sits nearer the bull or the bear case. */}
      <div className="mb-5 mt-1 hidden sm:block">
        <div className="relative h-1.5 rounded-full" style={{ background: 'var(--bg-input)' }}>
          {scenarios.map((s) =>
            s.value_per_share == null ? null : (
              <span
                key={s.scenario}
                className="absolute -top-1 h-3.5 w-3.5 -translate-x-1/2 rounded-full"
                style={{ left: pos(s.value_per_share), background: tone[s.scenario], border: '2px solid var(--bg-card)' }}
                title={`${s.label}: $${fmtPrice(s.value_per_share)}`}
              />
            )
          )}
          {price != null && (
            <span
              className="absolute -top-2.5 h-6 w-0.5 -translate-x-1/2"
              style={{ left: pos(price), background: 'var(--text-primary)' }}
              title={`Current price $${fmtPrice(price)}`}
            />
          )}
        </div>
        <div className="mt-2 flex justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <span className="font-mono">${fmtPrice(lo)}</span>
          <span>current price marked in solid</span>
          <span className="font-mono">${fmtPrice(hi)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {scenarios.map((s) => {
          const upside = s.value_per_share != null && price ? s.value_per_share / price - 1 : null
          const p = probabilities?.[s.scenario]
          return (
            <div
              key={s.scenario}
              className="rounded-lg px-3 py-2.5"
              style={{ background: 'var(--bg-input)', borderLeft: `3px solid ${tone[s.scenario]}` }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-semibold" style={{ color: tone[s.scenario] }}>
                  {s.label}
                  {p != null && (
                    <span className="ml-2 font-normal" style={{ color: 'var(--text-muted)' }}>
                      {fmtNum(p * 100, 0)}% probability
                    </span>
                  )}
                </span>
                <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                  ${fmtPrice(s.value_per_share)}
                  {upside != null && (
                    <span
                      className="ml-2"
                      style={{ color: upside >= 0 ? 'var(--positive)' : 'var(--negative)' }}
                    >
                      {signed(upside * 100)}
                    </span>
                  )}
                </span>
              </div>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                {s.narrative}
              </p>
              {s.assumptions && (
                <p className="mt-1 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  growth {fmtNum(s.assumptions.growth_anchor * 100)}% · discount{' '}
                  {fmtNum(s.assumptions.discount_rate * 100)}% · terminal{' '}
                  {fmtNum(s.assumptions.terminal_growth * 100)}% · multiple{' '}
                  {signed(s.assumptions.multiple_adjustment * 100, 0)}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

/** The top-down half of the note: regime, rates, and the tilts they produced. */
function MacroOverlayCard({ macro }) {
  if (!macro) return null
  const rates = macro.rates || {}
  const inflation = macro.inflation || {}
  const labour = macro.labour || {}
  const overlay = macro.sector_overlay || {}
  const pct = (v, d = 2) => (v == null ? '-' : `${fmtNum(v * 100, d)}%`)

  return (
    <Card
      title="Macro Backdrop"
      right={
        <span className="text-xs" style={{ color: macro.available ? 'var(--accent)' : 'var(--text-muted)' }}>
          {macro.available ? 'Live · FRED' : 'Long-run assumptions'}
        </span>
      }
    >
      <div
        className="mb-3 rounded-lg px-3 py-2.5"
        style={{ background: 'var(--bg-input)' }}
      >
        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {macro.regime?.label}
        </div>
        {macro.regime?.reasons?.length > 0 && (
          <ul className="mt-1.5 space-y-1">
            {macro.regime.reasons.map((r, i) => (
              <li key={i} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                · {r}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat label="10Y Treasury" value={pct(rates.t10y)} />
        <Stat label="2s10s Spread" value={pct(rates.spread_2_10)} />
        <Stat label="Curve" value={rates.curve_label || '-'} />
        <Stat label="CPI (y/y)" value={pct(inflation.cpi_yoy, 1)} />
        <Stat label="Policy Rate" value={pct(rates.policy_rate)} />
        <Stat label="Unemployment" value={pct(labour.unemployment, 1)} />
      </div>

      {overlay.reasons?.length > 0 && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div
            className="mb-1.5 text-xs font-semibold uppercase tracking-wide"
            style={{ color: 'var(--text-muted)' }}
          >
            Sector overlay - {overlay.sector || 'n/a'}
          </div>
          <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
            <span style={{ color: 'var(--text-secondary)' }}>
              growth tilt{' '}
              <span style={{ color: overlay.growth_tilt >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
                {signed(overlay.growth_tilt * 100)}
              </span>
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              multiple tilt{' '}
              <span style={{ color: overlay.multiple_tilt >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
                {signed(overlay.multiple_tilt * 100)}
              </span>
            </span>
          </div>
          <ul className="space-y-1">
            {overlay.reasons.map((r, i) => (
              <li key={i} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                · {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}

function ValuationCard({ valuation }) {
  const [openModel, setOpenModel] = useState(null)
  if (!valuation?.models?.length) return null
  const s = valuation.summary || {}
  // Headline uses the analyst-weighted fair value (falls back to median).
  const headline = s.fair_value != null ? s.fair_value : s.median_value
  const headlineUpside =
    s.fair_value_upside_pct != null ? s.fair_value_upside_pct : s.median_upside_pct
  const verdictStyle =
    s.verdict === 'Undervalued'
      ? { color: 'var(--positive)', Icon: TrendingUp }
      : s.verdict === 'Overvalued'
      ? { color: 'var(--negative)', Icon: TrendingDown }
      : { color: 'var(--text-secondary)', Icon: Minus }
  const VIcon = verdictStyle.Icon
  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h3
          className="flex items-center gap-2 text-sm font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          <Calculator size={15} style={{ color: 'var(--accent)' }} />
          Intrinsic Value - Multi-Model
        </h3>
        <div className="flex items-center gap-2">
          {valuation.inputs?.growth_profile_label && (
            <span
              className="rounded px-2 py-0.5 text-[11px] font-semibold"
              style={{ color: 'var(--accent)', background: 'var(--bg-input)' }}
              title={(valuation.inputs.growth_profile_reasons || []).join(' · ')}
            >
              {valuation.inputs.growth_profile_label}
            </span>
          )}
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            per share · {s.models_applied} models
          </span>
        </div>
      </div>

      {/* Verdict banner */}
      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2" style={{ color: verdictStyle.color }}>
          <VIcon size={18} />
          <span className="text-base font-semibold">{s.verdict}</span>
        </div>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Fair value{' '}
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            ${fmtNum(headline)}
          </span>{' '}
          vs price{' '}
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            ${fmtNum(s.current_price)}
          </span>{' '}
          <span style={{ color: verdictStyle.color }}>
            ({headlineUpside > 0 ? '+' : ''}
            {fmtNum(headlineUpside)}%)
          </span>
        </div>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Range ${fmtNum(s.low_value)} – ${fmtNum(s.high_value)}
        </div>
      </div>

      {/* Street consensus — a reference for the intrinsic-value block below
          (the 12-month price target above does blend it; fair value does not). */}
      {s.analyst_consensus && (
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 text-sm"
          style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border)' }}
        >
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: 'var(--text-muted)' }}
          >
            Street consensus
          </span>
          <span style={{ color: 'var(--text-primary)' }}>
            Mean <span className="font-semibold">${fmtNum(s.analyst_consensus.mean)}</span>
            {' · '}Median <span className="font-semibold">${fmtNum(s.analyst_consensus.median)}</span>
            {' · '}Range ${fmtNum(s.analyst_consensus.low)}–${fmtNum(s.analyst_consensus.high)}
            {' · '}
            {s.analyst_consensus.count} analysts
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            (reference for Fair Value; blended into the price target above)
          </span>
        </div>
      )}

      {/* Models table — click a row to see how its value was derived */}
      <div className="overflow-x-auto p-4">
        <table className="data-table" style={{ minWidth: 360 }}>
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              <th className="px-3 py-2">Model</th>
              <th className="px-3 py-2 text-right">Value</th>
              <th className="px-3 py-2 text-right">Upside</th>
            </tr>
          </thead>
          <tbody>
            {valuation.models.map((m, i) => {
              const isOpen = openModel === i
              const clickable = m.applicable && m.steps?.length
              return (
                <Fragment key={i}>
                  <tr
                    className={clickable ? 'cursor-pointer' : ''}
                    style={{
                      borderTop: '1px solid var(--border)',
                      background: isOpen ? 'var(--bg-card-hover)' : 'transparent',
                    }}
                    onClick={() => clickable && setOpenModel(isOpen ? null : i)}
                  >
                    <td className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>
                      <span className="inline-flex items-center gap-1.5">
                        {clickable &&
                          (isOpen ? (
                            <ChevronUp size={13} style={{ color: 'var(--text-muted)' }} />
                          ) : (
                            <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
                          ))}
                        {m.model}
                      </span>
                      {m.role && (
                        <span className="ml-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {m.role}
                        </span>
                      )}
                      {m.blend_status === 'floor_only' && (
                        <span
                          className="ml-2 text-xs"
                          style={{ color: 'var(--accent-gold)' }}
                          title="Applicable, but this growth profile excludes it from the blend - shown as a reference floor only."
                        >
                          (floor only)
                        </span>
                      )}
                      {m.blend_status === 'not_applicable' && (
                        <span
                          className="ml-2 text-xs"
                          style={{ color: 'var(--text-muted)' }}
                          title={m.note || 'Not applicable'}
                        >
                          (n/a)
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right" style={{ color: 'var(--text-primary)' }}>
                      {m.value_per_share != null ? `$${fmtNum(m.value_per_share)}` : '-'}
                    </td>
                    <td
                      className="px-3 py-2 text-right"
                      style={{
                        color:
                          m.upside_pct == null
                            ? 'var(--text-muted)'
                            : m.upside_pct >= 0
                            ? 'var(--positive)'
                            : 'var(--negative)',
                      }}
                    >
                      {m.upside_pct != null
                        ? `${m.upside_pct > 0 ? '+' : ''}${fmtNum(m.upside_pct)}%`
                        : '-'}
                    </td>
                  </tr>
                  {isOpen && (
                    <tr>
                      <td colSpan={3} className="p-0">
                        <ModelWalkthrough model={m} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
        <p className="mt-3 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Fair value is a weighted blend whose mix depends on the company&rsquo;s growth profile
          {valuation.inputs?.growth_profile_label ? ` (${valuation.inputs.growth_profile_label})` : ''}
          {' '}- for a high-growth name that means DCF + Relative Valuation only, with
          Graham/EPV/DDM/Residual Income shown as floor-only references excluded from the blend;
          for a mature name those floors stay meaningful contributors. Click any model to see the
          exact data and step-by-step calculation. Discount rate = risk-free + β × equity risk
          premium
          {valuation.inputs?.discount_rate
            ? ` (${fmtNum(valuation.inputs.discount_rate * 100, 1)}%)`
            : ''}
          ; growth rate used
          {valuation.inputs?.growth_rate
            ? ` (${fmtNum(valuation.inputs.growth_rate * 100, 1)}%)`
            : ''}
          {valuation.inputs?.implied_growth_rate != null
            ? ` vs. market-implied growth (${fmtNum(valuation.inputs.implied_growth_rate * 100, 1)}%)`
            : ''}
          .
        </p>
        <SensitivityTable
          sensitivity={valuation.dcf_sensitivity}
          ownTerminalGrowth={valuation.inputs?.terminal_growth}
          ownDiscountRate={valuation.inputs?.discount_rate}
        />
        <AssumptionsPanel inputs={valuation.inputs} />
      </div>
    </section>
  )
}

// ---------- page ----------
export default function Research() {
  const [ticker, setTicker] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [downloading, setDownloading] = useState(false)

  async function runResearch(e) {
    e?.preventDefault()
    const symbol = ticker.trim().toUpperCase()
    if (!symbol) return
    setLoading(true)
    setError(null)
    // The shared axios client resolves errors into an {error:true} object
    // rather than throwing, so failures are checked, not caught.
    const result = await researchAPI.analyze(symbol)
    setLoading(false)
    if (!result || result.error) {
      const detail = result?.message
      setError(
        typeof detail === 'string'
          ? detail
          : detail?.detail || 'Research failed. Is the FinSight backend running?'
      )
      setData(null)
      return
    }
    setData(result)
  }

  // A bare <a href> to this route would skip the X-API-Key header the axios
  // client attaches, so fetch it as a blob (authenticated) and save that instead.
  // Saving is delegated to utils/download because the anchor-click trick that
  // works in a browser is a no-op inside the iOS WKWebView shell — there the
  // bytes have to be written to disk and handed to the share sheet.
  const handleDownload = useCallback(async () => {
    const path = data?.spreadsheet_url
    if (!path || downloading) return
    const filename = path.split('/').pop() || 'research.xlsx'
    setDownloading(true)
    const result = await researchAPI.downloadSpreadsheet(path)

    if (!result || result.error || !(result instanceof Blob)) {
      setDownloading(false)
      setError('Download failed - is the FinSight backend reachable?')
      return
    }

    const saved = await saveBlob(result, filename)
    setDownloading(false)
    if (!saved.ok) {
      setError(saved.message)
      return
    }
    toast.success(saveResultMessage(saved, filename))
  }, [data?.spreadsheet_url, downloading])

  const profile = data?.profile || {}
  const hasQualitative =
    data &&
    (data.business?.summary ||
      data.mdna?.summary ||
      data.risk_factors?.summary ||
      data.earnings_release?.summary ||
      data.transcript?.content)
  // Surface why the transcript is (or isn't) available, from source attribution.
  const transcriptSrc = data?.sources?.find((s) => s.name === 'Earnings Call Transcript')
  const onWatchlist = data?.finsight_context?.on_watchlist

  return (
    <div className="page space-y-5">
      {/* Page header */}
      <div>
        <h1 className="page-title">Research</h1>
        <p className="page-sub">
          Deep, fully-sourced company workup - SEC filings, 7 valuation models, and a
          downloadable Excel report.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={runResearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            size={18}
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter a ticker, e.g. AAPL"
            aria-label="Ticker symbol"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            className="input"
            style={{ paddingLeft: 38, paddingBlock: 11 }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !ticker.trim()}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          <span className="hidden sm:inline">{loading ? 'Researching…' : 'Research'}</span>
        </button>
      </form>

      {/* Error */}
      {error && (
        <div
          className="flex items-start gap-3 rounded-lg px-4 py-3 text-sm"
          style={{
            border: '1px solid var(--negative)',
            background: 'var(--bg-card)',
            color: 'var(--negative)',
          }}
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>
            <div className="font-medium">Research failed</div>
            <div style={{ opacity: 0.85 }}>{error}</div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && !data && (
        <div
          className="rounded-xl px-6 py-16 text-center"
          style={{ border: '1px dashed var(--border)', background: 'var(--bg-card)' }}
        >
          <Loader2 className="mx-auto animate-spin" size={32} style={{ color: 'var(--accent)' }} />
          <p className="mt-4 text-sm" style={{ color: 'var(--text-primary)' }}>
            Pulling filings, financials and running the models…
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            This takes about 10 seconds - SEC EDGAR, yfinance and peer multiples are all fetched
            live.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!data && !loading && !error && (
        <div
          className="rounded-xl px-6 py-16 text-center"
          style={{ border: '1px dashed var(--border)', background: 'var(--bg-card)' }}
        >
          <FileSpreadsheet
            className="mx-auto"
            size={40}
            strokeWidth={1.5}
            style={{ color: 'var(--accent)' }}
          />
          <p className="mt-4 text-sm" style={{ color: 'var(--text-primary)' }}>
            Research any public company.
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            Enter a ticker above to pull a sourced profile, news, peers, metrics, and a
            downloadable Excel report.
          </p>
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="space-y-6">
          {/* Header block: company + download */}
          <div className="card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {profile.companyName || data.ticker}
                  </h2>
                  <span
                    className="rounded px-2 py-0.5 text-xs font-medium"
                    style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}
                  >
                    {profile.symbol || data.ticker}
                  </span>
                  {onWatchlist && (
                    <span
                      className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium"
                      style={{ background: 'var(--bg-input)', color: 'var(--accent-gold)' }}
                      title="This ticker is on your FinSight watchlist"
                    >
                      <Star size={11} /> On watchlist
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {[profile.exchange, profile.sector, profile.industry].filter(Boolean).join(' · ') ||
                    'Company overview'}
                </p>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Generated {fmtDate(data.generated_at)} · sources verified
                </p>
              </div>
              {data?.spreadsheet_url && (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition shrink-0 disabled:opacity-60"
                  style={{
                    border: '1px solid var(--accent)',
                    background: 'var(--bg-input)',
                    color: 'var(--accent)',
                  }}
                >
                  {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  {downloading ? 'Downloading…' : 'Download Excel'}
                </button>
              )}
            </div>

            {/* Quick stats */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              <Stat label="Price" value={profile.price ? `$${fmtNum(profile.price)}` : '-'} />
              <Stat label="Market Cap" value={fmtLargeUSD(profile.marketCap || profile.mktCap)} />
              <Stat label="Beta" value={fmtNum(profile.beta)} />
              <Stat
                label="Change"
                value={
                  profile.changePercentage != null ? `${fmtNum(profile.changePercentage)}%` : '-'
                }
              />
              <Stat label="52w Range" value={profile.range || '-'} />
            </div>
          </div>

          {/* The call — rating and price target lead, workings follow */}
          <HouseViewCard
            houseView={data.valuation?.house_view}
            price={data.valuation?.summary?.current_price ?? profile.price}
          />

          {/* Top-down and scenario context, side by side on a wide screen */}
          {(data.valuation?.scenarios?.length || data.valuation?.macro) && (
            <div className="grid gap-6 lg:grid-cols-2">
              <ScenarioLadder
                scenarios={data.valuation?.scenarios}
                probabilities={data.valuation?.house_view?.scenario_probabilities}
                price={data.valuation?.summary?.current_price ?? profile.price}
              />
              <MacroOverlayCard macro={data.valuation?.macro} />
            </div>
          )}

          {/* Intrinsic valuation — the models behind the call */}
          <ValuationCard valuation={data.valuation} />

          {/* Two-column layout on desktop */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* News */}
            <Card title={`Recent News (${data.news?.length || 0})`}>
              {data.news?.length ? (
                <ul className="space-y-3">
                  {data.news.map((n, i) => (
                    <li key={i} className="pb-3 last:pb-0" style={{ borderBottom: '1px solid var(--border)' }}>
                      <a
                        href={n.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-1.5 text-sm"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <span className="flex-1">{n.headline}</span>
                        <ExternalLink size={13} className="mt-1 shrink-0 opacity-50" />
                      </a>
                      <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        {n.source} · {fmtDate(n.datetime)}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  No recent news found.
                </p>
              )}
            </Card>

            {/* Competitors */}
            <Card title={`Peers (${data.competitors?.length || 0})`}>
              <div className="overflow-x-auto">
                <table className="data-table" style={{ minWidth: 360 }}>
                  <thead>
                    <tr
                      className="text-left text-xs uppercase tracking-wide"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <th className="px-3 py-2">Symbol</th>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2 text-right">Price</th>
                      <th className="px-3 py-2 text-right">Mkt Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.competitors?.length ? (
                      data.competitors.map((c, i) => (
                        <tr
                          key={i}
                          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-primary)' }}
                        >
                          <td className="px-3 py-2 font-medium">{c.symbol}</td>
                          <td className="px-3 py-2" style={{ color: 'var(--text-muted)' }}>
                            {c.name || '-'}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {c.price ? `$${fmtNum(c.price)}` : '-'}
                          </td>
                          <td className="px-3 py-2 text-right">{fmtLargeUSD(c.market_cap)}</td>
                        </tr>
                      ))
                    ) : (
                      <EmptyRow cols={4} text="No peers found." />
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Key metrics */}
            <Card title="Key Metrics (TTM)">
              {data.key_metrics && Object.keys(data.key_metrics).length ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {KEY_METRIC_SPEC.filter(
                    ([key]) =>
                      data.key_metrics[key] !== undefined && data.key_metrics[key] !== null
                  ).map(([key, label, kind]) => (
                    <Stat key={key} label={label} value={fmtMetric(data.key_metrics[key], kind)} />
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  No key metrics available.
                </p>
              )}
            </Card>

            {/* Earnings + Sector P/E */}
            <Card title="Earnings & Sector">
              <div className="space-y-4">
                <div>
                  <div
                    className="mb-2 text-xs uppercase tracking-wide"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Sector P/E
                  </div>
                  <div className="flex items-center gap-3">
                    <Stat
                      label={data.sector_pe?.sector || 'Sector'}
                      value={fmtNum(data.sector_pe?.sector_pe)}
                    />
                    <Stat label="As of" value={fmtDate(data.sector_pe?.date)} />
                  </div>
                </div>
                <div>
                  <div
                    className="mb-2 text-xs uppercase tracking-wide"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Recent Earnings
                  </div>
                  <div className="overflow-x-auto">
                    <table className="data-table" style={{ minWidth: 280 }}>
                      <thead>
                        <tr
                          className="text-left text-xs uppercase tracking-wide"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <th className="px-2 py-1.5">Date</th>
                          <th className="px-2 py-1.5 text-right">EPS</th>
                          <th className="px-2 py-1.5 text-right">Est.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.earnings_calendar?.length ? (
                          data.earnings_calendar.map((e, i) => (
                            <tr
                              key={i}
                              style={{
                                borderTop: '1px solid var(--border)',
                                color: 'var(--text-primary)',
                              }}
                            >
                              <td className="px-2 py-1.5">{fmtDate(e.date)}</td>
                              <td className="px-2 py-1.5 text-right">{fmtNum(e.eps, 2)}</td>
                              <td className="px-2 py-1.5 text-right" style={{ color: 'var(--text-muted)' }}>
                                {fmtNum(e.eps_estimated, 2)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <EmptyRow cols={3} text="No earnings data." />
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Official qualitative narrative (SEC EDGAR + transcript) */}
          {hasQualitative && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <ScrollText size={16} style={{ color: 'var(--accent)' }} />
                <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Official Filings & Qualitative
                </h2>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  sourced from SEC EDGAR
                </span>
              </div>

              <NarrativeCard title="Business" icon={FileText} block={data.business} />
              <NarrativeCard
                title="Management's Discussion & Analysis (MD&A)"
                icon={FileText}
                block={data.mdna}
              />
              <NarrativeCard title="Risk Factors" icon={AlertCircle} block={data.risk_factors} />
              <NarrativeCard
                title="Earnings Release Highlights"
                icon={FileText}
                block={data.earnings_release}
              />
              {data.transcript?.content ? (
                <NarrativeCard
                  title={`Earnings Call Transcript - Q${data.transcript.quarter ?? ''} ${
                    data.transcript.year ?? ''
                  }`}
                  icon={ScrollText}
                  block={{
                    summary: data.transcript.content,
                    form: 'Transcript',
                    filed: data.transcript.date,
                  }}
                />
              ) : (
                <div
                  className="rounded-lg px-4 py-3 text-sm"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>Earnings-call transcript</span> -{' '}
                  {transcriptSrc?.note || 'not available on the current data plan'}. The earnings
                  press release above (filed with the SEC) is the closest official substitute.
                </div>
              )}

              {/* Filings index + presentation */}
              {(data.filings?.length || data.presentation) && (
                <Card title={`Recent SEC Filings (${data.filings?.length || 0})`}>
                  {data.presentation && (
                    <a
                      href={resolveUrl(data.presentation.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                      style={{
                        border: '1px solid var(--accent)',
                        background: 'var(--bg-input)',
                        color: 'var(--accent)',
                      }}
                    >
                      <FileText size={14} />
                      Investor Presentation ({data.presentation.format})
                      <ExternalLink size={12} />
                    </a>
                  )}
                  <ul>
                    {data.filings?.map((f, i) => (
                      <li
                        key={i}
                        className="flex flex-wrap items-center justify-between gap-2 py-2"
                        style={{ borderTop: i ? '1px solid var(--border)' : 'none' }}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className="w-16 shrink-0 rounded px-2 py-0.5 text-center text-xs font-medium"
                            style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                          >
                            {f.form}
                          </span>
                          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {fmtDate(f.date)}
                          </span>
                        </span>
                        <a
                          href={resolveUrl(f.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs"
                          style={{ color: 'var(--accent)' }}
                        >
                          Open on EDGAR <ExternalLink size={12} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          )}

          {/* Sources — attribution */}
          <Card title={`Sources (${data.sources?.length || 0})`}>
            <div className="overflow-x-auto">
              <table className="data-table" style={{ minWidth: 420 }}>
                <thead>
                  <tr
                    className="text-left text-xs uppercase tracking-wide"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <th className="px-3 py-2">Dataset</th>
                    <th className="px-3 py-2">Provider</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Retrieved</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sources?.map((s, i) => (
                    <tr
                      key={i}
                      style={{ borderTop: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    >
                      <td className="px-3 py-2">{s.name}</td>
                      <td className="px-3 py-2" style={{ color: 'var(--text-muted)' }}>
                        {s.provider}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          style={{ color: s.status === 'ok' ? 'var(--positive)' : 'var(--negative)' }}
                          title={s.note || ''}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-3 py-2" style={{ color: 'var(--text-muted)' }}>
                        {fmtDate(s.retrieved_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
