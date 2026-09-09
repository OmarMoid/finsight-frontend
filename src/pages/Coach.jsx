import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Compass, ChevronLeft, ChevronRight, MapPin, HelpCircle, Check,
} from 'lucide-react'
import { stocksAPI } from '../utils/api'
import useStore from '../store/useStore'
import SymbolPicker from '../components/common/SymbolPicker'
import Alert from '../components/common/Alert'
import { SkeletonCard } from '../components/common/Skeleton'
import { STEPS, VERDICT_COLOURS } from '../data/analystPlaybook'
import { formatNumber, formatCurrency, formatPercent } from '../utils/formatters'

/**
 * Analyst Coach — a guided walkthrough of analysing one real company.
 *
 * Every number on this page is this company's live data, and every
 * interpretation is a stated rule applied to it. No AI: the walkthrough works
 * with no API key, cannot invent a figure, and — the point — always shows the
 * threshold it judged against, so the reasoning is inspectable rather than
 * asserted. See data/analystPlaybook.js for the rules themselves.
 *
 * The tour also functions as a map of FinSight: each step names the page where
 * that data lives, so working through it once teaches both the method and
 * where everything is.
 */

// Compound annual growth over the reported periods. Null rather than a
// misleading figure when the earliest value is not positive.
function cagr(rows, key) {
  const values = (rows || []).map((r) => r?.[key]).filter((v) => typeof v === 'number')
  if (values.length < 2) return null
  const [latest, earliest] = [values[0], values[values.length - 1]]
  if (!(earliest > 0) || !(latest > 0)) return null
  return (Math.pow(latest / earliest, 1 / (values.length - 1)) - 1) * 100
}

function StepMetric({ metric }) {
  const colour = metric.reading ? VERDICT_COLOURS[metric.reading.verdict] : 'var(--text-secondary)'
  return (
    <div className="py-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-baseline justify-between gap-3">
        {/* The label wraps and the value does not — a metric name is prose,
            a figure broken across lines is unreadable. */}
        <span className="text-sm text-[var(--text-secondary)]">{metric.label}</span>
        <span className="text-base font-mono font-semibold whitespace-nowrap" style={{ color: colour }}>
          {metric.value}
        </span>
      </div>
      {metric.reading && (
        <p className="text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">{metric.reading.note}</p>
      )}
    </div>
  )
}

export default function Coach() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const activeMarket = useStore((s) => s.activeMarket)
  const recentlyViewed = useStore((s) => s.recentlyViewed)

  const initial =
    params.get('symbol') || recentlyViewed?.[0] || (activeMarket === 'asx' ? 'BHP.AX' : 'AAPL')
  const [symbol, setSymbol] = useState(initial.toUpperCase())
  const [stepIndex, setStepIndex] = useState(0)
  const [done, setDone] = useState({})

  const [raw, setRaw] = useState(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setFailed(false)
    setStepIndex(0)
    setDone({})
    // One fan-out for the whole walkthrough. Every step reads from this, so
    // moving between steps is instant — a tour that re-fetched on each Next
    // would feel like ten separate pages.
    const [quote, financials, technicals, valuation, earnings] = await Promise.all([
      stocksAPI.getQuote(symbol),
      stocksAPI.getFinancials(symbol),
      stocksAPI.getTechnicals(symbol),
      stocksAPI.getValuation(symbol),
      stocksAPI.getEarnings(symbol),
    ])
    const clean = (r) => (r?.error ? null : r)
    setRaw({
      quote: clean(quote),
      financials: clean(financials),
      technicals: clean(technicals),
      valuation: clean(valuation),
      earnings: clean(earnings),
    })
    setFailed(!!(quote?.error && financials?.error))
    setLoading(false)
  }, [symbol])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const q = params.get('symbol')
    if (q && q.toUpperCase() !== symbol) setSymbol(q.toUpperCase())
  }, [params]) // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (next) => {
    setSymbol(next)
    setParams({ symbol: next })
  }

  // The shape the playbook's `metrics(data)` functions expect. Formatters are
  // passed in rather than imported there so the playbook stays pure data +
  // rules, with no rendering concerns.
  const data = useMemo(() => {
    if (!raw) return null
    const currency = raw.quote?.currency || 'USD'
    const income = raw.financials?.income_statement || []
    const cash = raw.financials?.cash_flow || []
    return {
      ...raw,
      growth: [
        { label: 'Revenue', cagr: cagr(income, 'revenue') },
        { label: 'Net income', cagr: cagr(income, 'netIncome') },
        { label: 'Free cash flow', cagr: cagr(cash, 'freeCashFlow') },
      ],
      fmt: {
        money: (v) => (v != null ? formatCurrency(v, currency, true) : '-'),
        plain: (v, d = 2) => (typeof v === 'number' && isFinite(v) ? formatNumber(v, d) : '-'),
        pct: (v, d = 1) => (typeof v === 'number' && isFinite(v) ? formatPercent(v * 100, d, false) : '-'),
      },
    }
  }, [raw])

  // Every step's metrics, computed once — the last step needs the tally of all
  // the readings, so they all have to exist before any of them renders.
  const computed = useMemo(() => {
    if (!data) return []
    const withoutFinal = STEPS.slice(0, -1).map((step) => {
      let metrics = []
      try {
        metrics = (step.metrics(data) || []).filter(Boolean)
      } catch {
        // A step that cannot compute from partial data is skipped, not fatal:
        // a thinly covered symbol should still get the rest of the tour.
        metrics = []
      }
      return { step, metrics }
    })

    const tally = { good: 0, watch: 0, poor: 0 }
    for (const { metrics } of withoutFinal) {
      for (const m of metrics) {
        if (m.reading?.verdict && tally[m.reading.verdict] !== undefined) tally[m.reading.verdict] += 1
      }
    }

    const finalStep = STEPS[STEPS.length - 1]
    let finalMetrics = []
    try {
      finalMetrics = (finalStep.metrics({ ...data, tally }) || []).filter(Boolean)
    } catch {
      finalMetrics = []
    }
    return [...withoutFinal, { step: finalStep, metrics: finalMetrics }]
  }, [data])

  const current = computed[stepIndex]
  const completedCount = Object.values(done).filter(Boolean).length

  return (
    <div className="page page-narrow">
      <div className="page-head">
        <div className="min-w-0">
          <h1 className="page-title flex items-center gap-2">
            <Compass size={18} className="text-[var(--accent)] shrink-0" />
            Analyst Coach
          </h1>
          <p className="page-sub">
            Ten steps through a real company, using its live figures - what each number is,
            how to read it, and where in FinSight it lives.
          </p>
        </div>
      </div>

      <SymbolPicker value={symbol} onSubmit={pick} />

      {failed && (
        <Alert title="Couldn't load data for this symbol" onRetry={load}>
          Check the ticker, or try again in a moment.
        </Alert>
      )}

      {loading ? (
        <div className="stack">
          <SkeletonCard lines={2} />
          <SkeletonCard lines={8} />
        </div>
      ) : current ? (
        <>
          {/* Progress. A wrapping grid rather than a scrolling strip: with ten
              steps, a sideways scroller hides half the journey behind a
              gesture and you lose the sense of how far through you are. */}
          <div className="card mb-4">
            <div className="flex items-baseline justify-between gap-3 mb-2.5">
              <span className="section-label">
                Step {stepIndex + 1} of {STEPS.length}
              </span>
              <span className="text-2xs text-[var(--text-muted)]">
                {completedCount} of {STEPS.length} marked done
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {computed.map(({ step }, i) => (
                <button
                  key={step.id}
                  onClick={() => setStepIndex(i)}
                  title={step.title}
                  aria-label={`Step ${i + 1}: ${step.title}`}
                  aria-current={i === stepIndex ? 'step' : undefined}
                  className="rounded text-2xs font-mono py-1.5"
                  style={{
                    background: i === stepIndex
                      ? 'var(--accent)'
                      : done[step.id] ? 'var(--accent-soft)' : 'var(--bg-input)',
                    color: i === stepIndex
                      ? 'var(--accent-contrast)'
                      : done[step.id] ? 'var(--accent)' : 'var(--text-muted)',
                  }}
                >
                  {done[step.id] && i !== stepIndex ? '✓' : i + 1}
                </button>
              ))}
            </div>
          </div>

          <article className="card">
            <h2 className="card-title" style={{ whiteSpace: 'normal' }}>{current.step.title}</h2>
            <p className="text-base text-[var(--text-primary)] mt-1.5 leading-relaxed">
              {current.step.question}
            </p>
            <div className="flex items-start gap-1.5 mt-2 text-2xs text-[var(--text-muted)]">
              <MapPin size={12} className="mt-0.5 shrink-0" />
              <span>In FinSight: {current.step.where}</span>
            </div>

            {/* What the numbers mean, before the numbers themselves — reading
                a metric you don't understand teaches nothing. */}
            <div className="mt-4 pt-4 border-t space-y-2.5" style={{ borderColor: 'var(--border)' }}>
              {current.step.teaching.map((para, i) => (
                <p key={i} className="text-sm text-[var(--text-secondary)] leading-relaxed">{para}</p>
              ))}
            </div>

            {current.metrics.length > 0 && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="section-label mb-1">{symbol} right now</div>
                {current.metrics.map((metric) => (
                  <StepMetric key={metric.label} metric={metric} />
                ))}
              </div>
            )}

            <div
              className="mt-4 p-3 rounded-lg"
              style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-control)' }}
            >
              <div className="flex items-start gap-2">
                <HelpCircle size={14} className="text-[var(--accent)] mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="section-label">Check yourself</div>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
                    {current.step.checkYourself}
                  </p>
                </div>
              </div>
            </div>

            {current.step.action && (
              <button
                className="btn mt-3"
                onClick={() => navigate(current.step.action.to(symbol))}
              >
                {current.step.action.label}
              </button>
            )}
          </article>

          <div className="flex items-center gap-2 mt-4">
            <button
              className="btn"
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={stepIndex === 0}
            >
              <ChevronLeft size={14} /> Back
            </button>
            <button
              className={`btn${done[current.step.id] ? '' : ' btn-primary'}`}
              onClick={() => setDone((d) => ({ ...d, [current.step.id]: !d[current.step.id] }))}
            >
              <Check size={14} /> {done[current.step.id] ? 'Done' : 'Mark done'}
            </button>
            <button
              className="btn ml-auto"
              onClick={() => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))}
              disabled={stepIndex === STEPS.length - 1}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}
