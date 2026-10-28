import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'
import {
  CATEGORIES, LESSON_CONTENT, QUIZ_BANKS, PRACTICAL_WORKFLOWS, DEEP_DIVES,
  getTopicById, TOTAL_TOPICS, getCategoryTopics,
} from '../data/learningContent'
import {
  calculateDCF, calculateWACC, buildSensitivityTable, runMonteCarlo,
  calculateGordonGrowthDDM, calculateTwoStageDDM, calculateThreeStageDDM, calculateFrankingAdjustedYield,
  findImpliedGrowthRate, assessGrowthExpectation, runLBOModel, validateAssumptions,
  calculateGrahamNumber, calculateEPV, calculateResidualIncome,
} from '../utils/valuationEngines'
import { EXTRA_QUIZ } from '../data/quizExtra'
import { EXTRA_QUIZ_2 } from '../data/quizExtra2'
import { buildQuizAttempt, gradeAttempt, attemptSize } from '../utils/quizEngine'
import { getWorkedExample } from '../data/workedExamples'
import { stocksAPI, macroAPI } from '../utils/api'
import useStore from '../store/useStore'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Markdown from '../components/common/Markdown'
import { formatNumber, formatCurrency, formatPercent, getChangeCSSVar, symbolIsASX } from '../utils/formatters'

const LEVEL_COLOR = { Beginner: 'var(--positive)', Intermediate: 'var(--accent)', Advanced: 'var(--accent-purple)' }
const M = 1e6

// ── small inputs ────────────────────────────────────────────────────────────
function Num({ label, value, onChange, step = 0.1, suffix }) {
  return (
    <label className="block text-xs text-[var(--text-muted)] mb-2">{label}
      <div className="flex items-center gap-1">
        <input type="number" step={step} value={value} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
               className="w-full rounded-lg px-2 py-1.5 text-sm outline-none mt-1" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
        {suffix && <span className="text-xs text-[var(--text-muted)]">{suffix}</span>}
      </div>
    </label>
  )
}
function RO({ label, value }) {
  return <div className="rounded-lg px-2 py-1.5 mb-2" style={{ background: 'var(--bg-input)' }}><div className="text-2xs text-[var(--text-muted)]">{label}</div><div className="text-sm font-mono font-semibold text-[var(--accent)]">{value}</div></div>
}
function Alerts({ issues }) {
  if (!issues?.length) return null
  return <div className="space-y-2 mb-3">{issues.map((a, i) => (
    <div key={i} className="rounded-lg px-3 py-2 text-xs" style={{ background: a.severity === 'error' ? 'color-mix(in srgb, var(--negative) 10%, transparent)' : 'color-mix(in srgb, var(--accent-gold) 10%, transparent)', border: `1px solid ${a.severity === 'error' ? 'var(--negative)' : 'var(--accent-gold)'}`, color: a.severity === 'error' ? 'var(--negative)' : 'var(--accent-gold)' }}>
      {a.severity === 'error' ? '✗' : '⚠'} {a.message}
    </div>))}</div>
}

// ── Confetti ────────────────────────────────────────────────────────────────
function Confetti() {
  const colors = ['var(--accent)', 'var(--positive)', 'var(--accent-gold)', 'var(--accent-purple)']
  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden>
      {Array.from({ length: 50 }).map((_, i) => (
        <span key={i} style={{ position: 'absolute', left: `${Math.random() * 100}%`, top: '-10px', width: 8, height: 8, borderRadius: 2,
          background: colors[i % 4], animation: `confettiFall ${1.5 + Math.random() * 1.5}s linear ${Math.random()}s forwards` }} />
      ))}
      <style>{`@keyframes confettiFall{to{transform:translateY(105vh) rotate(${360}deg);opacity:0}}`}</style>
    </div>
  )
}

// ── Worked example (live data) ────────────────────────────────────────────────
// Loads a real stock and applies the current lesson to its live metrics.
function WorkedExample({ topic }) {
  const [sym, setSym] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = async (s) => {
    const symbol = (s || sym).trim().toUpperCase()
    if (!symbol) return
    setLoading(true)
    const [quote, fin] = await Promise.all([stocksAPI.getQuote(symbol), stocksAPI.getFinancials(symbol)])
    if (quote?.error || !quote?.price) { toast.error(`Could not load ${symbol}`); setLoading(false); return }
    setData({ quote, fin, symbol }); setLoading(false)
  }

  const ex = data ? getWorkedExample(topic, data) : null

  return (
    <div className="card mb-3" style={{ borderLeft: '3px solid var(--positive)' }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--positive)' }}>Worked Example - live data</span>
      </div>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <input value={sym} onChange={(e) => setSym(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()}
               placeholder="Apply to a stock (e.g. AAPL, BHP.AX)" className="rounded-lg px-2 py-1.5 text-sm outline-none flex-1" style={{ minWidth: 180, background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
        <button onClick={() => load()} className="px-3 py-1.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--positive)', color: 'var(--accent-contrast)' }}>Apply</button>
        {['AAPL', 'MSFT', 'BHP.AX'].map((s) => (
          <button key={s} onClick={() => { setSym(s); load(s) }} className="px-2 py-1 rounded-md text-xs font-mono" style={{ background: 'var(--bg-input)', color: 'var(--accent)' }}>{s}</button>
        ))}
      </div>
      {loading && <LoadingSpinner size="sm" label="Loading live data…" />}
      {!loading && !ex && <p className="text-xs text-[var(--text-muted)]">Load a stock to see this chapter applied to its real, up-to-date metrics.</p>}
      {!loading && ex && (
        <div>
          <p className="text-sm text-[var(--text-secondary)] mb-2">{ex.intro}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
            {ex.rows.map(([label, value]) => (
              <div key={label} className="rounded-lg px-2.5 py-1.5" style={{ background: 'var(--bg-input)' }}>
                <div className="text-2xs text-[var(--text-muted)]">{label}</div>
                <div className="text-sm font-mono font-semibold text-[var(--text-primary)]">{value}</div>
              </div>
            ))}
          </div>
          <ol className="space-y-1">
            {ex.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                <span className="font-mono font-semibold" style={{ color: 'var(--positive)' }}>{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// CURRICULUM TAB
// ============================================================================
function Curriculum() {
  const learningProgress = useStore((s) => s.learningProgress)
  const markTopicComplete = useStore((s) => s.markTopicComplete)

  const [catKey, setCatKey] = useState('fundamentals')
  const [levelFilter, setLevelFilter] = useState('All')
  const [topicId, setTopicId] = useState(null)
  const [quizOpen, setQuizOpen] = useState(false)
  const [deepOpen, setDeepOpen] = useState(false)
  // topicId -> question keys already served, so retakes rotate through the pool.
  const seenRef = useRef({})
  const [attempt, setAttempt] = useState([])     // current shuffled question set
  const [answers, setAnswers] = useState({})     // questionIndex -> chosen option index
  const [submitted, setSubmitted] = useState(false)
  const [attemptNo, setAttemptNo] = useState(1)
  const [confetti, setConfetti] = useState(false)

  const allTopics = CATEGORIES.flatMap((c) => c.topics)
  const completeCount = allTopics.filter((t) => learningProgress[t.id]).length
  const pct = Math.round((completeCount / TOTAL_TOPICS) * 100)
  const level = pct <= 33 ? 'Beginner' : pct <= 66 ? 'Intermediate' : 'Advanced'
  const studyHours = (allTopics.filter((t) => learningProgress[t.id]).reduce((n, t) => n + t.duration, 0) / 60).toFixed(1)

  const topics = getCategoryTopics(catKey).filter((t) => levelFilter === 'All' || t.level === levelFilter)
  const topic = topicId ? getTopicById(topicId) : null
  const lesson = topic ? LESSON_CONTENT[topic.id] : null
  const workflow = topic ? PRACTICAL_WORKFLOWS[topic.id] : null
  const deepDive = topic ? DEEP_DIVES[topic.id] : null
  // Combined pool: original bank + two supplemental batches. The engine draws a
  // fresh subset (with shuffled options) each attempt, preferring questions it
  // hasn't served recently - tracked per topic in `seenRef`, which is a ref
  // rather than state because updating it must not trigger a re-render.
  const poolFor = (t) =>
    t ? [...(QUIZ_BANKS[t.id] || []), ...(EXTRA_QUIZ[t.id] || []), ...(EXTRA_QUIZ_2[t.id] || [])] : []
  const pool = poolFor(topic)

  const startAttempt = (t = topic) => {
    const p = poolFor(t)
    const seen = t ? seenRef.current[t.id] || [] : []
    const { questions, servedKeys } = buildQuizAttempt(p, attemptSize(p.length), seen)
    if (t) seenRef.current[t.id] = servedKeys
    setAttempt(questions)
    setAnswers({})
    setSubmitted(false)
  }
  const openTopic = (id) => {
    const t = getTopicById(id)
    setTopicId(id); setQuizOpen(false); setDeepOpen(false); setAttemptNo(1)
    startAttempt(t)
  }
  const retakeQuiz = () => { setAttemptNo((n) => n + 1); startAttempt() }

  const passMark = Math.ceil(0.6 * (attempt.length || 1))   // 60% to pass
  const score = gradeAttempt(attempt, answers)
  const submitQuiz = () => {
    setSubmitted(true)
    if (score >= passMark) markTopicComplete(topic.id)
    if (attempt.length && score >= Math.ceil(0.8 * attempt.length)) { setConfetti(true); setTimeout(() => setConfetti(false), 3000) }
  }
  const nextTopic = () => {
    const idx = topics.findIndex((t) => t.id === topicId)
    if (idx >= 0 && idx < topics.length - 1) openTopic(topics[idx + 1].id)
  }
  const letter = (i) => ['A', 'B', 'C', 'D', 'E', 'F'][i]

  return (
    <div>
      {confetti && <Confetti />}
      {/* HEADER */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--text-secondary)]">{completeCount}/{TOTAL_TOPICS} topics complete</span>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg-input)', color: LEVEL_COLOR[level] }}>{level}</span>
            <span className="text-xs text-[var(--text-muted)]">{studyHours}h studied</span>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-input)' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--gradient-accent)' }} />
        </div>
      </div>

      {/* CATEGORY BUTTONS */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((c) => {
          const done = c.topics.filter((t) => learningProgress[t.id]).length
          return (
            <button key={c.key} onClick={() => { setCatKey(c.key); setTopicId(null) }}
                    className={`chip ${catKey === c.key ? 'is-active' : ''}`}>
              {c.label} <span className="opacity-70">{done}/{c.topics.length}</span>
            </button>
          )
        })}
      </div>

      {/* TWO COLUMN */}
      <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-4">
        {/* LEFT */}
        <div>
          <div className="segmented mb-2 flex w-full">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((l) => (
              <button key={l} onClick={() => setLevelFilter(l)} aria-pressed={levelFilter === l} className="flex-1">{l}</button>
            ))}
          </div>
          <div className="space-y-1">
            {topics.map((t) => (
              <button key={t.id} onClick={() => openTopic(t.id)} className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg"
                      style={{ background: topicId === t.id ? 'var(--bg-card)' : 'transparent', borderLeft: topicId === t.id ? '3px solid var(--accent)' : '3px solid transparent' }}>
                <span style={{ color: learningProgress[t.id] ? 'var(--positive)' : 'var(--text-muted)' }}>{learningProgress[t.id] ? '✓' : '○'}</span>
                <span className="flex-1 text-sm text-[var(--text-primary)]">{t.title}</span>
                <span className="badge" style={{ color: LEVEL_COLOR[t.level], background: 'var(--bg-input)' }}>{t.level[0]}</span>
                <span className="text-2xs text-[var(--text-muted)]">{t.duration}m</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {!topic ? (
            <div className="card text-center py-12">
              <p className="text-[var(--text-secondary)]">Select a topic to begin.</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">{TOTAL_TOPICS} topics · {completeCount} complete · {studyHours}h studied</p>
            </div>
          ) : (
            <>
              <div className="card mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge" style={{ color: LEVEL_COLOR[topic.level], background: 'var(--bg-input)' }}>{topic.level}</span>
                  <span className="text-xs text-[var(--text-muted)]">{topic.categoryLabel} · {topic.duration} min</span>
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{topic.title}</h2>
              </div>

              <div className="card mb-3">
                {lesson ? <Markdown text={lesson} /> : <p className="text-sm text-[var(--text-muted)]">Full lesson content for this topic is being added. The quiz and structure are available; check back soon.</p>}
              </div>

              {/* Advanced extension. Collapsed by default so the main lesson
                  stays a clean first read and the depth is opt-in. */}
              {deepDive && (
                <div className="card mb-3" style={{ borderLeft: '3px solid var(--accent-purple)' }}>
                  <button
                    onClick={() => setDeepOpen((v) => !v)}
                    className="flex w-full items-center justify-between gap-2 text-left"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent-purple)' }}>
                      Going Deeper
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {deepOpen ? 'Hide −' : 'Read +'}
                    </span>
                  </button>
                  {deepOpen && <div className="mt-2">{<Markdown text={deepDive} />}</div>}
                </div>
              )}

              {workflow && (
                <div className="card mb-3" style={{ borderLeft: '3px solid var(--accent)', background: 'var(--bg-card)' }}>
                  <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>Practical Walkthrough</span>
                  </div>
                  {<Markdown text={workflow} />}
                </div>
              )}

              <WorkedExample key={topic.id} topic={topic} />

              <div className="flex gap-2 mb-3 flex-wrap">
                {pool.length > 0 && <button onClick={() => setQuizOpen((v) => !v)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>{quizOpen ? 'Hide Quiz' : learningProgress[topic.id] ? 'Reattempt Quiz' : 'Take Quiz'}</button>}
                {!learningProgress[topic.id] && <button onClick={() => markTopicComplete(topic.id)} className="px-4 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>Mark Complete</button>}
              </div>

              {quizOpen && pool.length > 0 && (
                <div className="card">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Quiz - {attempt.length} questions <span className="text-[var(--text-muted)] font-normal">· attempt {attemptNo} · {pool.length} in pool</span></h3>
                    <button onClick={retakeQuiz} className="text-xs px-2.5 py-1 rounded-md" style={{ background: 'var(--bg-input)', color: 'var(--accent)' }}>↻ New questions</button>
                  </div>
                  {attempt.map((q, qi) => (
                    <div key={qi} className="mb-4">
                      <div className="text-sm text-[var(--text-primary)] mb-2">{qi + 1}. {q.question}</div>
                      <div className="space-y-1">
                        {q.options.map((opt, oi) => {
                          const chosen = answers[qi] === oi
                          const correct = submitted && opt.correct
                          const wrong = submitted && chosen && !opt.correct
                          return (
                            <button key={oi} disabled={submitted} onClick={() => setAnswers({ ...answers, [qi]: oi })}
                                    className="flex items-center gap-2 w-full text-left px-3 py-1.5 rounded-lg text-sm"
                                    style={{ background: correct ? 'color-mix(in srgb, var(--positive) 15%, transparent)' : wrong ? 'color-mix(in srgb, var(--negative) 15%, transparent)' : chosen ? 'var(--bg-card-hover)' : 'var(--bg-input)',
                                      border: `1px solid ${correct ? 'var(--positive)' : wrong ? 'var(--negative)' : 'transparent'}`, color: 'var(--text-secondary)' }}>
                              <span className="font-mono" style={{ color: 'var(--accent)' }}>{letter(oi)}</span> {opt.text}
                            </button>
                          )
                        })}
                      </div>
                      {submitted && <div className="text-xs mt-1 text-[var(--text-muted)]">{q.explanation}</div>}
                    </div>
                  ))}
                  {!submitted ? (
                    <button onClick={submitQuiz} disabled={Object.keys(answers).length < attempt.length} className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>Submit ({Object.keys(answers).length}/{attempt.length})</button>
                  ) : (
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-lg font-bold" style={{ color: score >= passMark ? 'var(--positive)' : 'var(--negative)' }}>Score: {score}/{attempt.length}</span>
                      {score >= passMark ? <span className="text-xs" style={{ color: 'var(--positive)' }}>✓ Passed - topic complete</span> : <span className="text-xs" style={{ color: 'var(--negative)' }}>Need {passMark}/{attempt.length} to pass</span>}
                      <button onClick={retakeQuiz} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>Retake →</button>
                      <button onClick={nextTopic} className="ml-auto px-3 py-1.5 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--accent)' }}>Next Topic →</button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// VALUATION LAB
// ============================================================================
const MODELS = ['DCF', 'Monte Carlo', 'Comps', 'DDM', 'Reverse DCF', 'LBO', 'Graham', 'EPV', 'Residual Income']

function Lab({ initialSymbol }) {
  const [symInput, setSymInput] = useState(initialSymbol || '')
  const [ctx, setCtx] = useState(null)       // {symbol, quote, fin, derived}
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState('DCF')
  const [loadedAt, setLoadedAt] = useState(null)

  const load = async (sym) => {
    const symbol = (sym || symInput).trim().toUpperCase()
    if (!symbol) return
    setLoading(true)
    const [quote, fin, yc] = await Promise.all([
      stocksAPI.getQuote(symbol), stocksAPI.getFinancials(symbol), macroAPI.getYieldCurve(),
    ])
    if (quote?.error || !quote?.price) { toast.error(`Could not load ${symbol}`); setLoading(false); return }
    const inc = fin?.income_statement?.[0] || {}
    const bal = fin?.balance_sheet?.[0] || {}
    const cf = fin?.cash_flow?.[0] || {}
    const rev = inc.revenue || 0
    // Valuation models need fundamentals. If the data provider returns no
    // financials (e.g. FMP free-tier daily limit reached), don't present a
    // misleading $0 model — tell the user plainly and stop.
    if (!rev) {
      toast.error(`Financial statements unavailable for ${symbol} - the data provider may be rate-limited. Try again later.`)
      setLoading(false)
      return
    }
    const shares = quote.market_cap && quote.price ? quote.market_cap / quote.price : (inc.weightedAverageShsOutDil || 0)
    const derived = {
      lastRevenue: rev,
      lastEBITDA: inc.ebitda || 0,
      lastFCF: cf.freeCashFlow || 0,
      ebitMargin: rev ? (inc.operatingIncome || 0) / rev : 0.2,
      daPercent: rev ? Math.abs(cf.depreciationAndAmortization || inc.depreciationAndAmortization || rev * 0.03) / rev : 0.03,
      capexPercent: rev ? Math.abs(cf.capitalExpenditure || rev * 0.03) / rev : 0.03,
      netDebt: bal.netDebt ?? 0,
      shares,
      beta: quote.beta || 1.1,
      riskFree: (yc?.['10y'] ?? 4.5) / 100,
      price: quote.price,
      taxRate: symbolIsASX(symbol) ? 0.30 : 0.21,
      // Extra anchors for the Graham / EPV / Residual-Income models.
      lastEBIT: inc.operatingIncome || (rev ? rev * (rev ? (inc.operatingIncome || 0) / rev : 0.2) : 0),
      equity: bal.totalStockholdersEquity || 0,
      bvps: shares ? (bal.totalStockholdersEquity || 0) / shares : 0,
      eps: quote.eps ?? (shares && inc.netIncome ? inc.netIncome / shares : null),
      roe: bal.totalStockholdersEquity ? (inc.netIncome || 0) / bal.totalStockholdersEquity : 0.12,
    }
    setCtx({ symbol, quote, fin, derived })
    setLoadedAt(new Date())
    setLoading(false)
    toast.success('Data loaded - inputs pre-populated')
  }

  useEffect(() => { if (initialSymbol) load(initialSymbol) }, []) // eslint-disable-line

  return (
    <div>
      {/* STOCK SELECTOR */}
      <div className="card mb-4">
        <div className="flex items-center gap-2">
          <input value={symInput} onChange={(e) => setSymInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()}
                 placeholder="Enter a symbol (e.g. AAPL, BHP.AX)" className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
                 style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <button onClick={() => load()} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>Load</button>
          {loadedAt && <button onClick={() => load(ctx?.symbol)} title="Refresh" className="px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>↻</button>}
        </div>
        {loading && <div className="mt-3"><LoadingSpinner size="sm" label="Loading…" /></div>}
        {ctx && !loading && (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div><div className="text-2xs text-[var(--text-muted)]">{ctx.quote.name}</div><div className="font-mono text-[var(--text-primary)]">{formatCurrency(ctx.derived.price, 'USD')}</div></div>
            <div><div className="text-2xs text-[var(--text-muted)]">Sector</div><div className="text-[var(--text-secondary)]">{ctx.quote.sector || '-'}</div></div>
            <div><div className="text-2xs text-[var(--text-muted)]">Mkt Cap</div><div className="font-mono text-[var(--text-primary)]">{formatCurrency(ctx.quote.market_cap, 'USD', true)}</div></div>
            <div><div className="text-2xs text-[var(--text-muted)]">P/E</div><div className="font-mono text-[var(--text-primary)]">{ctx.quote.pe_ratio != null ? formatNumber(ctx.quote.pe_ratio, 1) : '-'}</div></div>
            <div><div className="text-2xs text-[var(--text-muted)]">Last Revenue</div><div className="font-mono text-[var(--text-primary)]">{formatCurrency(ctx.derived.lastRevenue, 'USD', true)}</div></div>
            <div><div className="text-2xs text-[var(--text-muted)]">Last EBITDA</div><div className="font-mono text-[var(--text-primary)]">{formatCurrency(ctx.derived.lastEBITDA, 'USD', true)}</div></div>
            <div><div className="text-2xs text-[var(--text-muted)]">Last FCF</div><div className="font-mono text-[var(--text-primary)]">{formatCurrency(ctx.derived.lastFCF, 'USD', true)}</div></div>
            <div><div className="text-2xs text-[var(--text-muted)]">Data as of</div><div className="text-xs text-[var(--text-muted)]">{loadedAt?.toLocaleTimeString()}</div></div>
          </div>
        )}
      </div>

      {!ctx ? (
        <div className="card text-center py-12 text-[var(--text-secondary)]">Load a stock to run live valuation models against real data.</div>
      ) : (
        <>
          <div className="tabs mb-4">
            {MODELS.map((m) => (
              <button key={m} onClick={() => setModel(m)} className={model === m ? 'is-active' : undefined}>{m}</button>
            ))}
          </div>
          {model === 'DCF' && <DCFModel ctx={ctx} />}
          {model === 'Monte Carlo' && <MonteCarloModel ctx={ctx} />}
          {model === 'Comps' && <CompsModel ctx={ctx} />}
          {model === 'DDM' && <DDMModel ctx={ctx} />}
          {model === 'Reverse DCF' && <ReverseDCFModel ctx={ctx} />}
          {model === 'LBO' && <LBOModel ctx={ctx} />}
          {model === 'Graham' && <GrahamModel ctx={ctx} />}
          {model === 'EPV' && <EPVModel ctx={ctx} />}
          {model === 'Residual Income' && <ResidualIncomeModel ctx={ctx} />}
        </>
      )}
    </div>
  )
}

// ── DCF ─────────────────────────────────────────────────────────────────────
function DCFModel({ ctx }) {
  const d = ctx.derived
  const saveScenario = useStore((s) => s.saveScenario)
  const [inp, setInp] = useState({
    g13: 0.08, g45: 0.05, ebitMargin: +(d.ebitMargin).toFixed(3), taxRate: d.taxRate,
    daPercent: +(d.daPercent).toFixed(3), capexPercent: +(d.capexPercent).toFixed(3), nwcPercent: 0.02,
    riskFree: +(d.riskFree).toFixed(4), erp: 0.055, beta: +(d.beta).toFixed(2), preTaxKd: 0.05,
    debtWeight: 0.2, terminalGrowth: 0.025, terminalMethod: 'gordon', terminalMultiple: 10,
    netDebt: d.netDebt, scenarioName: '',
  })
  const set = (k, v) => setInp((s) => ({ ...s, [k]: v }))

  const wacc = useMemo(() => calculateWACC({
    riskFreeRate: inp.riskFree, equityRiskPremium: inp.erp, beta: inp.beta, preTaxCostOfDebt: inp.preTaxKd,
    taxRate: inp.taxRate, debtWeight: inp.debtWeight, equityWeight: 1 - inp.debtWeight,
  }), [inp])

  const dcfInputs = {
    lastRevenue: d.lastRevenue, revenueGrowth1to3: inp.g13, revenueGrowth4to5: inp.g45, ebitMargin: inp.ebitMargin,
    taxRate: inp.taxRate, daPercent: inp.daPercent, capexPercent: inp.capexPercent, nwcPercent: inp.nwcPercent,
    wacc: wacc.wacc, terminalGrowthRate: inp.terminalGrowth, terminalMethod: inp.terminalMethod, terminalMultiple: inp.terminalMultiple,
    netDebt: inp.netDebt, sharesOutstanding: d.shares,
  }
  const r = useMemo(() => calculateDCF(dcfInputs), [JSON.stringify(dcfInputs)])
  const issues = validateAssumptions('dcf', { ...dcfInputs, riskFreeRate: inp.riskFree })
  const upside = d.price ? (r.fairValuePerShare / d.price - 1) * 100 : null

  const waccRange = [-0.02, -0.015, -0.01, -0.005, 0, 0.005, 0.01, 0.015, 0.02].map((x) => +(wacc.wacc + x).toFixed(4))
  const tgrRange = [-0.015, -0.01, -0.005, 0, 0.005, 0.01, 0.015].map((x) => +(inp.terminalGrowth + x).toFixed(4))
  const sens = useMemo(() => buildSensitivityTable(dcfInputs, waccRange, tgrRange), [JSON.stringify(dcfInputs)])

  const projRev = r.projectedFCFs.map((p) => p.revenue)

  const exportText = () => {
    const txt = `=== FINSIGHT VALUATION ANALYSIS ===\nCompany: ${ctx.symbol} | Model: DCF | Date: ${new Date().toLocaleDateString()}\nFair Value: ${formatCurrency(r.fairValuePerShare, 'USD')} | Current: ${formatCurrency(d.price, 'USD')} | Upside: ${formatPercent(upside)}\nKey Assumptions: WACC ${formatPercent(wacc.wacc * 100, 2, false)}, TGR ${formatPercent(inp.terminalGrowth * 100, 2, false)}, Growth ${formatPercent(inp.g13 * 100, 1, false)}\n================================`
    navigator.clipboard.writeText(txt); toast.success('Analysis copied')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-4">
      {/* INPUTS */}
      <div className="card">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Assumptions</h3>
        <div className="text-[10px] text-[var(--text-muted)] mb-2">Anchor: Rev {formatCurrency(d.lastRevenue, 'USD', true)} · Shares {formatNumber(d.shares / M, 0)}M</div>
        <div className="grid grid-cols-2 gap-x-3">
          <Num label="Growth Yr1-3 (%)" value={inp.g13 * 100} onChange={(v) => set('g13', v / 100)} step={0.5} />
          <Num label="Growth Yr4-5 (%)" value={inp.g45 * 100} onChange={(v) => set('g45', v / 100)} step={0.5} />
          <Num label="EBIT Margin (%)" value={+(inp.ebitMargin * 100).toFixed(1)} onChange={(v) => set('ebitMargin', v / 100)} step={0.5} />
          <Num label="Tax Rate (%)" value={inp.taxRate * 100} onChange={(v) => set('taxRate', v / 100)} step={1} />
          <Num label="D&A (% rev)" value={+(inp.daPercent * 100).toFixed(1)} onChange={(v) => set('daPercent', v / 100)} step={0.5} />
          <Num label="Capex (% rev)" value={+(inp.capexPercent * 100).toFixed(1)} onChange={(v) => set('capexPercent', v / 100)} step={0.5} />
          <Num label="ΔNWC (% rev)" value={inp.nwcPercent * 100} onChange={(v) => set('nwcPercent', v / 100)} step={0.5} />
          <Num label="Net Debt ($M)" value={+(inp.netDebt / M).toFixed(0)} onChange={(v) => set('netDebt', v * M)} step={100} />
        </div>
        <div className="text-[10px] text-[var(--text-muted)] mb-1 mt-1">Yr1-5 revenue: {projRev.map((v) => formatCurrency(v, 'USD', true)).join(' · ')}</div>
        <h4 className="text-xs font-semibold text-[var(--text-secondary)] mt-3 mb-1">WACC</h4>
        <div className="grid grid-cols-2 gap-x-3">
          <Num label="Risk-Free (%)" value={+(inp.riskFree * 100).toFixed(2)} onChange={(v) => set('riskFree', v / 100)} step={0.1} />
          <Num label="ERP (%)" value={inp.erp * 100} onChange={(v) => set('erp', v / 100)} step={0.1} />
          <Num label="Beta" value={inp.beta} onChange={(v) => set('beta', v)} step={0.05} />
          <Num label="Pre-tax Kd (%)" value={inp.preTaxKd * 100} onChange={(v) => set('preTaxKd', v / 100)} step={0.1} />
          <Num label="Debt Weight (%)" value={inp.debtWeight * 100} onChange={(v) => set('debtWeight', v / 100)} step={5} />
        </div>
        <RO label={`Cost of Equity`} value={formatPercent(wacc.costOfEquity * 100, 2, false)} />
        <RO label="WACC" value={formatPercent(wacc.wacc * 100, 2, false)} />
        <h4 className="text-xs font-semibold text-[var(--text-secondary)] mt-2 mb-1">Terminal Value</h4>
        <div className="flex gap-2 mb-2 text-xs">
          {['gordon', 'multiple'].map((m) => <button key={m} onClick={() => set('terminalMethod', m)} className="px-2 py-1 rounded" style={{ background: inp.terminalMethod === m ? 'var(--accent)' : 'var(--bg-input)', color: inp.terminalMethod === m ? 'var(--accent-contrast)' : 'var(--text-secondary)' }}>{m === 'gordon' ? 'Gordon Growth' : 'Exit Multiple'}</button>)}
        </div>
        <div className="grid grid-cols-2 gap-x-3">
          <Num label="Terminal Growth (%)" value={+(inp.terminalGrowth * 100).toFixed(2)} onChange={(v) => set('terminalGrowth', v / 100)} step={0.25} />
          {inp.terminalMethod === 'multiple' && <Num label="Exit EV/EBITDA" value={inp.terminalMultiple} onChange={(v) => set('terminalMultiple', v)} step={0.5} />}
        </div>
      </div>

      {/* OUTPUTS */}
      <div>
        <Alerts issues={issues} />
        <div className="card mb-3">
          {[['PV of FCFs (Yr 1-5)', formatCurrency(r.pvFCFs, 'USD', true)], ['PV of Terminal Value', formatCurrency(r.pvTerminalValue, 'USD', true)],
            ['% from Terminal Value', formatPercent(r.terminalValuePercent, 0, false)], ['Enterprise Value', formatCurrency(r.enterpriseValue, 'USD', true)],
            ['Less: Net Debt', formatCurrency(inp.netDebt, 'USD', true)], ['Equity Value', formatCurrency(r.equityValue, 'USD', true)]].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm py-0.5"><span className="text-[var(--text-secondary)]">{k}</span><span className="font-mono text-[var(--text-primary)]">{v}</span></div>
          ))}
          <hr className="my-2" style={{ borderColor: 'var(--border)' }} />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[var(--text-primary)]">FAIR VALUE</span>
            <span className="text-2xl font-bold font-mono" style={{ color: 'var(--positive)' }}>{formatCurrency(r.fairValuePerShare, 'USD')}</span>
          </div>
          <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Current Price</span><span className="font-mono text-[var(--text-primary)]">{formatCurrency(d.price, 'USD')}</span></div>
          <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Upside / (Downside)</span><span className="font-mono font-semibold" style={{ color: getChangeCSSVar(upside) }}>{formatPercent(upside)}</span></div>
        </div>

        <div className="card mb-3 overflow-x-auto">
          <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2">FCF Projection ($M)</h4>
          <table className="w-full text-xs" style={{ minWidth: 520 }}>
            <thead><tr className="text-[var(--text-muted)]">{['Year', 'Revenue', 'EBIT', 'NOPAT', 'D&A', 'Capex', 'ΔNWC', 'FCF', 'PV'].map((h) => <th key={h} className="text-right font-normal py-1">{h}</th>)}</tr></thead>
            <tbody>{r.projectedFCFs.map((p) => (
              <tr key={p.year} className="border-t" style={{ borderColor: 'var(--border)' }}>
                <td className="text-right py-1 text-[var(--text-secondary)]">{p.year}</td>
                {[p.revenue, p.ebit, p.nopat, p.da, p.capex, p.nwc, p.fcf, p.pvFCF].map((v, i) => <td key={i} className="text-right py-1 font-mono text-[var(--text-primary)]">{formatNumber(v / M, 0)}</td>)}
              </tr>))}
              <tr className="border-t" style={{ borderColor: 'var(--border)' }}><td className="text-right py-1 text-[var(--accent)]">TV</td><td colSpan={6}></td><td className="text-right py-1 font-mono text-[var(--accent)]">{formatNumber(r.terminalValue / M, 0)}</td><td className="text-right py-1 font-mono text-[var(--accent)]">{formatNumber(r.pvTerminalValue / M, 0)}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="card mb-3 overflow-x-auto">
          <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2">Sensitivity - WACC (rows) × Terminal Growth (cols)</h4>
          <table className="text-xs" style={{ minWidth: 480 }}>
            <thead><tr><th className="p-1"></th>{tgrRange.map((t) => <th key={t} className="p-1 font-mono text-[var(--text-muted)]">{(t * 100).toFixed(1)}%</th>)}</tr></thead>
            <tbody>{sens.map((row, ri) => (
              <tr key={ri}><td className="p-1 font-mono text-[var(--text-muted)]">{(waccRange[ri] * 100).toFixed(1)}%</td>
                {row.map((cell, ci) => {
                  const isBase = Math.abs(waccRange[ri] - wacc.wacc) < 1e-6 && Math.abs(tgrRange[ci] - inp.terminalGrowth) < 1e-6
                  return <td key={ci} className="p-1 text-center font-mono" style={{ background: cell > d.price ? 'color-mix(in srgb, var(--positive) 12%, transparent)' : 'color-mix(in srgb, var(--negative) 12%, transparent)', color: 'var(--text-primary)', border: isBase ? '2px solid var(--accent)' : 'none' }}>{formatNumber(cell, 0)}</td>
                })}
              </tr>))}</tbody>
          </table>
        </div>

        <div className="card flex flex-wrap items-center gap-2">
          <input value={inp.scenarioName} onChange={(e) => set('scenarioName', e.target.value)} placeholder="Scenario name" className="rounded-lg px-2 py-1.5 text-sm outline-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)', flex: 1, minWidth: 140 }} />
          <button onClick={() => { saveScenario({ name: inp.scenarioName || `${ctx.symbol} DCF`, symbol: ctx.symbol, model: 'DCF', fairValue: r.fairValuePerShare, inputs: inp }); toast.success('Scenario saved') }} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>Save Scenario</button>
          <button onClick={exportText} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>Export</button>
        </div>
      </div>
    </div>
  )
}

// ── Monte Carlo ─────────────────────────────────────────────────────────────
function MonteCarloModel({ ctx }) {
  const d = ctx.derived
  const tri = (base) => ({ bear: +(base * 0.7).toFixed(4), base, bull: +(base * 1.3).toFixed(4) })
  const [vars, setVars] = useState({
    revenueGrowth1: tri(0.08), revenueGrowth2: tri(0.05), ebitMargin: tri(+d.ebitMargin.toFixed(3)),
    wacc: tri(0.09), terminalGrowthRate: tri(0.025),
  })
  const [sims, setSims] = useState(5000)
  const [running, setRunning] = useState(false)
  const [res, setRes] = useState(null)
  const setV = (k, f, val) => setVars((s) => ({ ...s, [k]: { ...s[k], [f]: val } }))

  const run = () => {
    setRunning(true)
    setTimeout(() => {
      const out = runMonteCarlo({
        ...vars, currentPrice: d.price,
        fixed: { netDebt: d.netDebt, sharesOutstanding: d.shares, lastRevenue: d.lastRevenue, taxRate: d.taxRate, daPercent: d.daPercent, capexPercent: d.capexPercent, nwcPercent: 0.02 },
      }, sims)
      setRes(out); setRunning(false)
    }, 50)
  }

  const ROWS = [['revenueGrowth1', 'Revenue Growth Yr1-3'], ['revenueGrowth2', 'Revenue Growth Yr4-5'], ['ebitMargin', 'EBIT Margin'], ['wacc', 'WACC'], ['terminalGrowthRate', 'Terminal Growth']]
  const hist = res ? res.histogram.map((b) => ({ x: +b.bucket.toFixed(1), count: b.count })) : []

  return (
    <div>
      <div className="card mb-3 text-sm text-[var(--text-secondary)]">Monte Carlo assigns probability distributions to your key assumptions and runs thousands of simulations, showing the range of plausible fair values and the probability the stock is currently undervalued.</div>
      <div className="card mb-3 overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 480 }}>
          <thead><tr className="text-[var(--text-muted)] text-xs"><th className="text-left font-normal py-1">Variable</th><th className="font-normal py-1">Bear (P5)</th><th className="font-normal py-1">Base (P50)</th><th className="font-normal py-1">Bull (P95)</th></tr></thead>
          <tbody>{ROWS.map(([k, label]) => (
            <tr key={k} className="border-t" style={{ borderColor: 'var(--border)' }}>
              <td className="py-1.5 text-[var(--text-secondary)]">{label}</td>
              {['bear', 'base', 'bull'].map((f) => (
                <td key={f} className="py-1.5 text-center"><input type="number" step={0.5} value={+(vars[k][f] * 100).toFixed(2)} onChange={(e) => setV(k, f, Number(e.target.value) / 100)}
                  className="w-20 rounded px-2 py-1 text-sm text-center outline-none font-mono" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} /></td>
              ))}
            </tr>))}</tbody>
        </table>
        <div className="flex items-center gap-3 mt-3">
          <select value={sims} onChange={(e) => setSims(Number(e.target.value))} className="rounded-lg px-2 py-1.5 text-sm" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            <option value={1000}>1,000</option><option value={5000}>5,000</option><option value={10000}>10,000</option>
          </select>
          <button onClick={run} disabled={running} className="px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>{running ? 'Running…' : 'Run Simulation'}</button>
        </div>
      </div>

      {res && (
        <>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {[['P5', res.p5], ['P25', res.p25], ['P50', res.p50], ['P75', res.p75], ['P95', res.p95]].map(([l, v]) => (
              <div key={l} className="card text-center"><div className="text-2xs text-[var(--text-muted)]">{l}</div><div className="font-mono font-semibold text-[var(--text-primary)]">{formatCurrency(v, 'USD')}</div></div>
            ))}
          </div>
          <div className="card mb-3 text-center">
            <div className="text-3xl font-bold" style={{ color: res.probabilityUndervalued > 50 ? 'var(--positive)' : 'var(--negative)' }}>{formatNumber(res.probabilityUndervalued, 1)}%</div>
            <div className="text-sm text-[var(--text-secondary)]">probability the stock is undervalued under your assumptions (fair value &gt; current price of {formatCurrency(d.price, 'USD')})</div>
          </div>
          <div className="card mb-3">
            <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2">Distribution ({res.results.length} sims)</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={hist}>
                <XAxis dataKey="x" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border)' }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border)' }} width={32} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <ReferenceLine x={+d.price.toFixed(1)} stroke="var(--text-primary)" strokeDasharray="3 3" />
                <Bar dataKey="count">{hist.map((b, i) => <Cell key={i} fill={b.x >= d.price ? 'var(--positive)' : 'var(--negative)'} fillOpacity={0.5} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[['Mean', formatCurrency(res.mean, 'USD')], ['Median', formatCurrency(res.p50, 'USD')], ['Std Dev', formatNumber(res.stdDev, 2)], ['Skewness', formatNumber(res.skewness, 2)]].map(([l, v]) => (
              <div key={l} className="card text-center"><div className="text-2xs text-[var(--text-muted)]">{l}</div><div className="font-mono text-[var(--text-primary)]">{v}</div></div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Comps ───────────────────────────────────────────────────────────────────
function CompsModel({ ctx }) {
  const [rows, setRows] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addSym, setAddSym] = useState('')

  const loadRow = async (sym, isSubject) => {
    const [q, f] = await Promise.all([stocksAPI.getQuote(sym), stocksAPI.getFinancials(sym)])
    if (q?.error || !q?.price) return null
    const inc = f?.income_statement?.[0] || {}; const km = f?.key_metrics_ttm || {}; const rt = f?.ratios_ttm || {}
    const ev = (q.market_cap || 0) + 0  // EV approximated by market cap when net debt unavailable here
    return {
      symbol: sym, subject: isSubject, name: q.name, mktCap: q.market_cap, ev,
      revenue: inc.revenue, ebitda: inc.ebitda, netInc: inc.netIncome,
      evEbitda: km.evToEBITDATTM, pe: q.pe_ratio, pb: rt.priceToBookRatioTTM, evRev: km.evToSalesTTM, divYield: q.dividend_yield,
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true)
      const peersRes = await stocksAPI.getPeers(ctx.symbol)
      const peers = (peersRes?.peers || []).slice(0, 6)
      const all = await Promise.all([loadRow(ctx.symbol, true), ...peers.map((p) => loadRow(p, false))])
      setRows(all.filter(Boolean)); setLoading(false)
    })()
  }, [ctx.symbol])

  const addPeer = async () => {
    const s = addSym.trim().toUpperCase(); if (!s) return
    const row = await loadRow(s, false)
    if (row) { setRows((r) => [...r, row]); setAddSym('') } else toast.error(`Could not load ${s}`)
  }
  const removePeer = (sym) => setRows((r) => r.filter((x) => x.symbol !== sym || x.subject))

  if (loading) return <LoadingSpinner label="Loading peers…" />
  if (!rows?.length) return <p className="text-sm text-[var(--text-muted)]">No peer data available.</p>

  const peers = rows.filter((r) => !r.subject)
  const med = (key) => { const v = peers.map((p) => p[key]).filter((x) => x != null).sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : null }
  const subject = rows.find((r) => r.subject)
  const medEvEbitda = med('evEbitda'), medPe = med('pe')
  const impliedFromEvEbitda = medEvEbitda && subject.ebitda ? (medEvEbitda * subject.ebitda - (ctx.derived.netDebt || 0)) / ctx.derived.shares : null
  const impliedFromPe = medPe && subject.netInc ? (medPe * subject.netInc) / ctx.derived.shares : null

  const fmtX = (v) => v != null ? formatNumber(v, 1) + '×' : '-'
  return (
    <div>
      <div className="card mb-3 overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 720 }}>
          <thead><tr className="text-[var(--text-muted)]">{['Company', 'Mkt Cap', 'Revenue', 'EBITDA', 'Net Inc', 'EV/EBITDA', 'P/E', 'P/B', 'Div Yld', ''].map((h) => <th key={h} className="text-right font-normal py-1">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.symbol} className="border-t" style={{ borderColor: 'var(--border)', background: r.subject ? 'var(--bg-input)' : 'transparent' }}>
                <td className="text-left py-1.5 font-mono text-[var(--accent)]">{r.symbol}{r.subject && <span className="text-[9px] text-[var(--text-muted)] ml-1">(subject)</span>}</td>
                <td className="text-right py-1.5 font-mono text-[var(--text-primary)]">{formatCurrency(r.mktCap, 'USD', true)}</td>
                <td className="text-right py-1.5 font-mono text-[var(--text-secondary)]">{formatCurrency(r.revenue, 'USD', true)}</td>
                <td className="text-right py-1.5 font-mono text-[var(--text-secondary)]">{formatCurrency(r.ebitda, 'USD', true)}</td>
                <td className="text-right py-1.5 font-mono text-[var(--text-secondary)]">{formatCurrency(r.netInc, 'USD', true)}</td>
                <td className="text-right py-1.5 font-mono text-[var(--text-primary)]">{fmtX(r.evEbitda)}</td>
                <td className="text-right py-1.5 font-mono text-[var(--text-primary)]">{fmtX(r.pe)}</td>
                <td className="text-right py-1.5 font-mono text-[var(--text-primary)]">{fmtX(r.pb)}</td>
                <td className="text-right py-1.5 font-mono text-[var(--text-secondary)]">{r.divYield != null ? formatPercent(r.divYield, 1, false) : '-'}</td>
                <td className="text-right py-1.5">{!r.subject && <button onClick={() => removePeer(r.symbol)} className="text-[var(--text-muted)] hover:text-[var(--negative)]">×</button>}</td>
              </tr>
            ))}
            <tr className="border-t" style={{ borderColor: 'var(--border-light)' }}>
              <td className="text-left py-1.5 text-[var(--text-muted)]">Peer Median</td><td colSpan={4}></td>
              <td className="text-right py-1.5 font-mono text-[var(--accent-gold)]">{fmtX(medEvEbitda)}</td>
              <td className="text-right py-1.5 font-mono text-[var(--accent-gold)]">{fmtX(medPe)}</td><td colSpan={3}></td>
            </tr>
          </tbody>
        </table>
        <div className="flex items-center gap-2 mt-2">
          <input value={addSym} onChange={(e) => setAddSym(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addPeer()} placeholder="Add peer symbol" className="rounded-lg px-2 py-1 text-sm outline-none" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <button onClick={addPeer} className="px-3 py-1 rounded-lg text-sm" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>Add</button>
        </div>
      </div>

      <div className="card">
        <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2">Valuation Bridge (implied price for {ctx.symbol})</h4>
        <div className="space-y-1 text-sm">
          {impliedFromEvEbitda != null && <div className="text-[var(--text-secondary)]">At peer median EV/EBITDA of {fmtX(medEvEbitda)} → <span className="font-mono font-semibold text-[var(--text-primary)]">{formatCurrency(impliedFromEvEbitda, 'USD')}</span></div>}
          {impliedFromPe != null && <div className="text-[var(--text-secondary)]">At peer median P/E of {fmtX(medPe)} → <span className="font-mono font-semibold text-[var(--text-primary)]">{formatCurrency(impliedFromPe, 'USD')}</span></div>}
          <div className="text-[var(--text-muted)] text-xs mt-1">Current price: {formatCurrency(ctx.derived.price, 'USD')}</div>
        </div>
      </div>
    </div>
  )
}

// ── DDM ─────────────────────────────────────────────────────────────────────
function DDMModel({ ctx }) {
  const d = ctx.derived
  const annualDiv = (ctx.quote.dividend_yield && d.price) ? (ctx.quote.dividend_yield / 100) * d.price : 1.0
  const ke0 = d.riskFree + d.beta * 0.055
  const [type, setType] = useState('gordon')
  const [inp, setInp] = useState({ d0: +annualDiv.toFixed(2), g: 0.04, ke: +ke0.toFixed(4), g1: 0.08, years1: 5, g2: 0.03, years2: 5, g3: 0.025, franking: 100 })
  const set = (k, v) => setInp((s) => ({ ...s, [k]: v }))
  const isASX = symbolIsASX(ctx.symbol)

  let result, schedule
  if (type === 'gordon') result = calculateGordonGrowthDDM(inp.d0, inp.g, inp.ke)
  else if (type === '2stage') { result = calculateTwoStageDDM(inp.d0, inp.g1, inp.years1, inp.g2, inp.ke); schedule = result.dividendSchedule }
  else { result = calculateThreeStageDDM(inp.d0, inp.g1, inp.years1, inp.g2, inp.years2, inp.g3, inp.ke); schedule = result.dividendSchedule }

  const iv = result.intrinsicValue
  const mos = (iv && d.price) ? (1 - d.price / iv) * 100 : null
  const franking = isASX ? calculateFrankingAdjustedYield(annualDiv, inp.franking, 0.30) : null
  const issues = validateAssumptions('ddm', { ke: inp.ke, g: type === 'gordon' ? inp.g : inp.g3 })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card">
        <div className="flex gap-1 mb-3 text-xs">
          {[['gordon', 'Gordon Growth'], ['2stage', '2-Stage'], ['3stage', '3-Stage']].map(([k, l]) => <button key={k} onClick={() => setType(k)} className="px-2 py-1 rounded" style={{ background: type === k ? 'var(--accent)' : 'var(--bg-input)', color: type === k ? 'var(--accent-contrast)' : 'var(--text-secondary)' }}>{l}</button>)}
        </div>
        <div className="grid grid-cols-2 gap-x-3">
          <Num label="D₀ Dividend ($)" value={inp.d0} onChange={(v) => set('d0', v)} step={0.05} />
          <Num label="Cost of Equity Ke (%)" value={+(inp.ke * 100).toFixed(2)} onChange={(v) => set('ke', v / 100)} step={0.25} />
          {type === 'gordon' && <Num label="Growth g (%)" value={+(inp.g * 100).toFixed(2)} onChange={(v) => set('g', v / 100)} step={0.25} />}
          {type !== 'gordon' && <Num label="High Growth g₁ (%)" value={+(inp.g1 * 100).toFixed(1)} onChange={(v) => set('g1', v / 100)} step={0.5} />}
          {type !== 'gordon' && <Num label="High Growth Years" value={inp.years1} onChange={(v) => set('years1', v)} step={1} />}
          {type !== 'gordon' && <Num label={type === '3stage' ? 'Transition g₂ (%)' : 'Stable g₂ (%)'} value={+(inp.g2 * 100).toFixed(1)} onChange={(v) => set('g2', v / 100)} step={0.25} />}
          {type === '3stage' && <Num label="Transition Years" value={inp.years2} onChange={(v) => set('years2', v)} step={1} />}
          {type === '3stage' && <Num label="Terminal g₃ (%)" value={+(inp.g3 * 100).toFixed(2)} onChange={(v) => set('g3', v / 100)} step={0.25} />}
        </div>
        <div className="text-[10px] text-[var(--text-muted)] mt-2">Helper · Ke (CAPM) = {formatPercent(ke0 * 100, 2, false)} · sustainable g = ROE × (1 − payout)</div>
        {isASX && (
          <div className="mt-3 rounded-lg p-2" style={{ background: 'var(--bg-input)' }}>
            <Num label="Franking % (fully franked = 100)" value={inp.franking} onChange={(v) => set('franking', v)} step={10} />
            {franking && <div className="text-xs text-[var(--text-secondary)]">Grossed-up dividend: <span className="font-mono text-[var(--text-primary)]">{formatCurrency(franking.grossedUpDividend, 'AUD')}</span> · franking credit {formatCurrency(franking.frankingCredit, 'AUD')}</div>}
            <div className="text-[10px] text-[var(--text-muted)] mt-1">Australian residents can claim franking credits against tax. A fully-franked dividend's effective pre-tax yield is significantly higher.</div>
          </div>
        )}
      </div>

      <div>
        <Alerts issues={issues} />
        <div className="card mb-3">
          {type === 'gordon' && <div className="text-xs font-mono text-[var(--text-muted)] mb-2">{result.formula}</div>}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[var(--text-primary)]">Intrinsic Value</span>
            <span className="text-2xl font-bold font-mono" style={{ color: isFinite(iv) ? 'var(--positive)' : 'var(--negative)' }}>{isFinite(iv) ? formatCurrency(iv, isASX ? 'AUD' : 'USD') : '∞'}</span>
          </div>
          <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Current Price</span><span className="font-mono text-[var(--text-primary)]">{formatCurrency(d.price, isASX ? 'AUD' : 'USD')}</span></div>
          {mos != null && isFinite(mos) && <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Margin of Safety</span><span className="font-mono font-semibold" style={{ color: getChangeCSSVar(mos) }}>{formatPercent(mos)}</span></div>}
        </div>
        {schedule && (
          <div className="card overflow-x-auto">
            <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2">Dividend Schedule</h4>
            <table className="w-full text-xs"><thead><tr className="text-[var(--text-muted)]"><th className="text-left font-normal py-1">Year</th><th className="text-right font-normal py-1">Dividend</th><th className="text-right font-normal py-1">PV</th></tr></thead>
              <tbody>{schedule.map((r) => <tr key={r.year} className="border-t" style={{ borderColor: 'var(--border)' }}><td className="py-1 text-[var(--text-secondary)]">{r.year}</td><td className="text-right py-1 font-mono text-[var(--text-primary)]">{formatNumber(r.dividend, 3)}</td><td className="text-right py-1 font-mono text-[var(--text-secondary)]">{formatNumber(r.pv, 3)}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Reverse DCF ─────────────────────────────────────────────────────────────
function ReverseDCFModel({ ctx }) {
  const d = ctx.derived
  const [inp, setInp] = useState({ wacc: 0.09, terminalGrowth: 0.025, ebitMargin: +d.ebitMargin.toFixed(3), taxRate: d.taxRate, historical: 0.08, analyst: 0.10, industry: 0.07 })
  const set = (k, v) => setInp((s) => ({ ...s, [k]: v }))

  const fixed = {
    lastRevenue: d.lastRevenue, ebitMargin: inp.ebitMargin, taxRate: inp.taxRate, daPercent: d.daPercent,
    capexPercent: d.capexPercent, nwcPercent: 0.02, wacc: inp.wacc, terminalGrowthRate: inp.terminalGrowth,
    terminalMethod: 'gordon', netDebt: d.netDebt, sharesOutstanding: d.shares,
  }
  const out = useMemo(() => findImpliedGrowthRate(d.price, fixed), [JSON.stringify(fixed), d.price])
  const assess = assessGrowthExpectation(out.impliedGrowthRate, inp.historical, inp.analyst)
  const color = assess.color.replace('text-[', '').replace(']', '')

  const bars = [
    { label: 'Implied', v: out.impliedGrowthRate * 100 }, { label: 'Historical', v: inp.historical * 100 },
    { label: 'Analyst', v: inp.analyst * 100 }, { label: 'Industry', v: inp.industry * 100 },
  ]
  const scenarios = [-0.05, 0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30].map((g) => {
    const r = calculateDCF({ ...fixed, revenueGrowth1to3: g, revenueGrowth4to5: g })
    return { g, fv: r.fairValuePerShare, vs: (r.fairValuePerShare / d.price - 1) * 100 }
  })

  return (
    <div>
      <div className="card mb-3 text-sm text-[var(--text-secondary)]">The reverse DCF answers: what growth rate is the market pricing in? If that implied growth looks unrealistic, the stock may be overvalued - and vice versa.</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2">Fixed Assumptions</h4>
          <div className="grid grid-cols-2 gap-x-3">
            <Num label="WACC (%)" value={+(inp.wacc * 100).toFixed(2)} onChange={(v) => set('wacc', v / 100)} step={0.25} />
            <Num label="Terminal Growth (%)" value={+(inp.terminalGrowth * 100).toFixed(2)} onChange={(v) => set('terminalGrowth', v / 100)} step={0.25} />
            <Num label="EBIT Margin (%)" value={+(inp.ebitMargin * 100).toFixed(1)} onChange={(v) => set('ebitMargin', v / 100)} step={0.5} />
            <Num label="Tax Rate (%)" value={inp.taxRate * 100} onChange={(v) => set('taxRate', v / 100)} step={1} />
            <Num label="Historical Growth (%)" value={+(inp.historical * 100).toFixed(1)} onChange={(v) => set('historical', v / 100)} step={0.5} />
            <Num label="Analyst Consensus (%)" value={+(inp.analyst * 100).toFixed(1)} onChange={(v) => set('analyst', v / 100)} step={0.5} />
            <Num label="Industry Avg (%)" value={+(inp.industry * 100).toFixed(1)} onChange={(v) => set('industry', v / 100)} step={0.5} />
          </div>
        </div>
        <div>
          <div className="card mb-3">
            <div className="text-xs font-semibold text-[var(--text-muted)] mb-2">MARKET-IMPLIED GROWTH ANALYSIS</div>
            <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Current Market Price</span><span className="font-mono text-[var(--text-primary)]">{formatCurrency(d.price, 'USD')}</span></div>
            <div className="flex justify-between text-sm mb-2"><span className="text-[var(--text-secondary)]">Implied Annual Rev Growth</span><span className="font-mono text-lg font-bold" style={{ color }}>{formatPercent(out.impliedGrowthRate * 100, 1, false)}</span></div>
            <div className="text-xs text-[var(--text-muted)]">For context · Historical {formatPercent(inp.historical * 100, 1, false)} · Analyst {formatPercent(inp.analyst * 100, 1, false)}</div>
            <div className="mt-2 text-sm font-semibold" style={{ color }}>{assess.label}</div>
            <div className="text-xs text-[var(--text-secondary)]">{assess.description}</div>
          </div>
          <div className="card">
            <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2">Growth Comparison</h4>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={bars} layout="vertical">
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <YAxis type="category" dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} width={70} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="v" radius={[0, 3, 3, 0]}>{bars.map((b, i) => <Cell key={i} fill={i === 0 ? color : 'var(--text-muted)'} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="card mt-3 overflow-x-auto">
        <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2">Scenario Table</h4>
        <table className="w-full text-xs" style={{ minWidth: 420 }}><thead><tr className="text-[var(--text-muted)]"><th className="text-left font-normal py-1">Growth</th><th className="text-right font-normal py-1">Fair Value</th><th className="text-right font-normal py-1">vs Current</th></tr></thead>
          <tbody>{scenarios.map((s) => (
            <tr key={s.g} className="border-t" style={{ borderColor: 'var(--border)' }}>
              <td className="py-1 text-[var(--text-secondary)]">{(s.g * 100).toFixed(0)}%</td>
              <td className="text-right py-1 font-mono text-[var(--text-primary)]">{formatCurrency(s.fv, 'USD')}</td>
              <td className="text-right py-1 font-mono" style={{ color: getChangeCSSVar(s.vs) }}>{formatPercent(s.vs)}</td>
            </tr>))}</tbody>
        </table>
      </div>
    </div>
  )
}

// ── LBO ─────────────────────────────────────────────────────────────────────
function LBOModel({ ctx }) {
  const d = ctx.derived
  const [inp, setInp] = useState({
    entryMultiple: 10, transactionFeesPct: 0.02, financingFeesPct: 0.02, seniorDebtPct: 0.40, seniorRate: 0.07,
    subDebtPct: 0.20, subRate: 0.10, revenueGrowthRate: 0.05, ebitdaMarginTarget: +(d.lastRevenue ? d.lastEBITDA / d.lastRevenue : 0.25).toFixed(3),
    capexPct: +d.capexPercent.toFixed(3), nwcChangePct: 0.02, holdPeriod: 5, exitMultiple: 11,
  })
  const set = (k, v) => setInp((s) => ({ ...s, [k]: v }))

  const lboInputs = {
    ltmEBITDA: d.lastEBITDA, ltmRevenue: d.lastRevenue, ltmFCF: d.lastFCF, ...inp,
    existingNetDebt: d.netDebt, sharesOutstanding: d.shares, currentSharePrice: d.price, taxRate: d.taxRate,
  }
  const r = useMemo(() => runLBOModel(lboInputs), [JSON.stringify(lboInputs)])
  const leverage = inp.entryMultiple * (inp.seniorDebtPct + inp.subDebtPct)
  const issues = validateAssumptions('lbo', { leverage, irr: r.irr })

  return (
    <div>
      <div className="card mb-3 text-sm text-[var(--text-secondary)]">Private equity firms pay the maximum price that still delivers their target IRR (20–25%). This tells you the LBO floor valuation - below which a PE firm could potentially buy the whole company.</div>
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-4">
        <div className="card">
          <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2">Transaction & Structure</h4>
          <div className="grid grid-cols-2 gap-x-3">
            <Num label="Entry EV/EBITDA" value={inp.entryMultiple} onChange={(v) => set('entryMultiple', v)} step={0.5} />
            <Num label="Exit EV/EBITDA" value={inp.exitMultiple} onChange={(v) => set('exitMultiple', v)} step={0.5} />
            <Num label="Senior Debt (% EV)" value={inp.seniorDebtPct * 100} onChange={(v) => set('seniorDebtPct', v / 100)} step={5} />
            <Num label="Senior Rate (%)" value={inp.seniorRate * 100} onChange={(v) => set('seniorRate', v / 100)} step={0.25} />
            <Num label="Sub Debt (% EV)" value={inp.subDebtPct * 100} onChange={(v) => set('subDebtPct', v / 100)} step={5} />
            <Num label="Sub Rate (%)" value={inp.subRate * 100} onChange={(v) => set('subRate', v / 100)} step={0.25} />
            <Num label="Revenue Growth (%)" value={inp.revenueGrowthRate * 100} onChange={(v) => set('revenueGrowthRate', v / 100)} step={0.5} />
            <Num label="EBITDA Margin Tgt (%)" value={+(inp.ebitdaMarginTarget * 100).toFixed(1)} onChange={(v) => set('ebitdaMarginTarget', v / 100)} step={0.5} />
            <Num label="Hold Period (yrs)" value={inp.holdPeriod} onChange={(v) => set('holdPeriod', v)} step={1} />
            <Num label="Txn Fees (% EV)" value={inp.transactionFeesPct * 100} onChange={(v) => set('transactionFeesPct', v / 100)} step={0.5} />
          </div>
          <div className="mt-2 text-xs" style={{ color: leverage > 7 ? 'var(--negative)' : 'var(--text-muted)' }}>Total Leverage: {formatNumber(leverage, 1)}× EBITDA {leverage > 7 && '⚠ aggressive'}</div>
        </div>

        <div>
          <Alerts issues={issues} />
          <div className="card mb-3">
            <div className="text-xs font-semibold text-[var(--text-muted)] mb-2">LBO RETURN ANALYSIS</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Hold</span><span className="font-mono text-[var(--text-primary)]">{inp.holdPeriod}y</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Entry Equity</span><span className="font-mono text-[var(--text-primary)]">{formatCurrency(r.entryEquity, 'USD', true)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Exit Equity</span><span className="font-mono text-[var(--text-primary)]">{formatCurrency(r.exitEquity, 'USD', true)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Entry Premium</span><span className="font-mono" style={{ color: getChangeCSSVar(r.entryPremium * 100) }}>{r.entryPremium != null ? formatPercent(r.entryPremium * 100) : '-'}</span></div>
            </div>
            <div className="flex justify-around mt-3">
              <div className="text-center"><div className="text-2xl font-bold font-mono text-[var(--text-primary)]">{formatNumber(r.moic, 2)}×</div><div className="text-2xs text-[var(--text-muted)]">MOIC</div></div>
              <div className="text-center"><div className="text-2xl font-bold font-mono" style={{ color: r.irr >= 0.2 ? 'var(--positive)' : r.irr >= 0.15 ? 'var(--accent-gold)' : 'var(--negative)' }}>{r.irr != null ? formatPercent(r.irr * 100, 1, false) : '-'}</div><div className="text-2xs text-[var(--text-muted)]">IRR</div></div>
            </div>
            <div className="mt-2 text-center text-sm font-semibold" style={{ color: r.assessment.color.replace('text-[', '').replace(']', '') }}>{r.assessment.label}</div>
          </div>

          <div className="card overflow-x-auto">
            <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2">Year-by-Year ($M)</h4>
            <table className="w-full text-xs" style={{ minWidth: 480 }}><thead><tr className="text-[var(--text-muted)]">{['Yr', 'Rev', 'EBITDA', 'Interest', 'FCF', 'Debt Repaid', 'Debt Bal'].map((h) => <th key={h} className="text-right font-normal py-1">{h}</th>)}</tr></thead>
              <tbody>{r.yearByYear.map((y) => (
                <tr key={y.year} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="text-right py-1 text-[var(--text-secondary)]">{y.year}</td>
                  {[y.revenue, y.ebitda, y.interest, y.fcf, y.debtRepaid, y.debtBalance].map((v, i) => <td key={i} className="text-right py-1 font-mono text-[var(--text-primary)]">{formatNumber(v / M, 0)}</td>)}
                </tr>))}</tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card mt-3 overflow-x-auto">
        <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2">IRR Sensitivity - Entry (rows) × Exit (cols) multiple</h4>
        <table className="text-xs"><thead><tr><th className="p-1"></th>{r.sensitivityAxes.exitRange.map((x) => <th key={x} className="p-1 font-mono text-[var(--text-muted)]">{x}×</th>)}</tr></thead>
          <tbody>{r.sensitivityTable.map((row, ri) => (
            <tr key={ri}><td className="p-1 font-mono text-[var(--text-muted)]">{r.sensitivityAxes.entryRange[ri]}×</td>
              {row.map((irr, ci) => <td key={ci} className="p-1 text-center font-mono" style={{ background: irr == null ? 'transparent' : irr >= 0.2 ? 'color-mix(in srgb, var(--positive) 15%, transparent)' : irr >= 0.15 ? 'color-mix(in srgb, var(--accent-gold) 15%, transparent)' : 'color-mix(in srgb, var(--negative) 15%, transparent)', color: 'var(--text-primary)' }}>{irr != null ? (irr * 100).toFixed(0) + '%' : '-'}</td>)}
            </tr>))}</tbody>
        </table>
      </div>
    </div>
  )
}

// ── Graham Number ─────────────────────────────────────────────────────────────
function GrahamModel({ ctx }) {
  const d = ctx.derived
  const [inp, setInp] = useState({ eps: +(d.eps || 0).toFixed(2), bvps: +(d.bvps || 0).toFixed(2) })
  const set = (k, v) => setInp((s) => ({ ...s, [k]: v }))
  const r = useMemo(() => calculateGrahamNumber({ eps: inp.eps, bvps: inp.bvps, currentPrice: d.price }), [inp, d.price])
  const issues = validateAssumptions('graham', inp)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-4">
      <div className="card">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Graham Number</h3>
        <p className="text-xs text-[var(--text-muted)] mb-3">Benjamin Graham’s defensive fair-value screen: √(22.5 × EPS × Book Value/Share). The 22.5 caps the stock at 15× earnings and 1.5× book.</p>
        <div className="grid grid-cols-2 gap-x-3">
          <Num label="EPS (TTM)" value={inp.eps} onChange={(v) => set('eps', v)} step={0.1} />
          <Num label="Book Value / Share" value={inp.bvps} onChange={(v) => set('bvps', v)} step={0.5} />
        </div>
        <div className="text-[10px] text-[var(--text-muted)] mt-1">Auto-filled from {ctx.symbol}: EPS {formatNumber(d.eps, 2)} · BVPS {formatNumber(d.bvps, 2)}</div>
      </div>
      <div>
        <Alerts issues={issues} />
        <div className="card mb-3">
          {r.valid ? (
            <>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[var(--text-primary)]">GRAHAM NUMBER</span>
                <span className="text-2xl font-bold font-mono" style={{ color: 'var(--positive)' }}>{formatCurrency(r.grahamNumber, 'USD')}</span>
              </div>
              <div className="flex justify-between text-sm mt-1"><span className="text-[var(--text-secondary)]">Current Price</span><span className="font-mono text-[var(--text-primary)]">{formatCurrency(d.price, 'USD')}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Upside / (Downside)</span><span className="font-mono font-semibold" style={{ color: getChangeCSSVar(r.upside) }}>{formatPercent(r.upside)}</span></div>
              <hr className="my-2" style={{ borderColor: 'var(--border)' }} />
              <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Implied P/E at fair value</span><span className="font-mono text-[var(--text-primary)]">{formatNumber(r.impliedPE, 1)}×</span></div>
              <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Implied P/B at fair value</span><span className="font-mono text-[var(--text-primary)]">{formatNumber(r.impliedPB, 1)}×</span></div>
            </>
          ) : <p className="text-sm text-[var(--text-muted)]">The Graham Number needs positive EPS and book value - it does not apply to loss-making or negative-equity companies.</p>}
        </div>
        <div className="card text-xs text-[var(--text-secondary)]">Graham intended this as a conservative ceiling for defensive investors, not a target. It suits stable, profitable, asset-backed companies and understates the value of high-return, capital-light franchises.</div>
      </div>
    </div>
  )
}

// ── Earnings Power Value ──────────────────────────────────────────────────────
function EPVModel({ ctx }) {
  const d = ctx.derived
  const [inp, setInp] = useState({
    normalizedEBIT: Math.round(d.lastEBIT || 0),
    taxRate: d.taxRate,
    wacc: +(d.riskFree + d.beta * 0.055).toFixed(4),
    netDebt: d.netDebt,
  })
  const set = (k, v) => setInp((s) => ({ ...s, [k]: v }))
  const r = useMemo(() => calculateEPV({
    normalizedEBIT: inp.normalizedEBIT, taxRate: inp.taxRate, wacc: inp.wacc,
    netDebt: inp.netDebt, sharesOutstanding: d.shares, currentPrice: d.price,
  }), [inp, d.shares, d.price])
  const issues = validateAssumptions('epv', inp)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-4">
      <div className="card">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Earnings Power Value</h3>
        <p className="text-xs text-[var(--text-muted)] mb-3">Greenwald’s no-growth anchor: capitalise sustainable after-tax operating profit at the cost of capital. EPV = NOPAT / WACC, less net debt. The gap vs price is what the market pays for growth.</p>
        <div className="grid grid-cols-2 gap-x-3">
          <Num label="Normalised EBIT ($M)" value={+(inp.normalizedEBIT / M).toFixed(0)} onChange={(v) => set('normalizedEBIT', v * M)} step={100} />
          <Num label="Tax Rate (%)" value={+(inp.taxRate * 100).toFixed(0)} onChange={(v) => set('taxRate', v / 100)} step={1} />
          <Num label="WACC (%)" value={+(inp.wacc * 100).toFixed(2)} onChange={(v) => set('wacc', v / 100)} step={0.25} />
          <Num label="Net Debt ($M)" value={+(inp.netDebt / M).toFixed(0)} onChange={(v) => set('netDebt', v * M)} step={100} />
        </div>
        <div className="text-[10px] text-[var(--text-muted)] mt-1">Anchor EBIT from {ctx.symbol}: {formatCurrency(d.lastEBIT, 'USD', true)}</div>
      </div>
      <div>
        <Alerts issues={issues} />
        <div className="card">
          {r.valid ? (
            <>
              {[['NOPAT (EBIT × (1−tax))', formatCurrency(r.nopat, 'USD', true)],
                ['EPV - Enterprise (NOPAT / WACC)', formatCurrency(r.epvEnterprise, 'USD', true)],
                ['Less: Net Debt', formatCurrency(inp.netDebt, 'USD', true)],
                ['EPV - Equity', formatCurrency(r.epvEquity, 'USD', true)]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm py-0.5"><span className="text-[var(--text-secondary)]">{k}</span><span className="font-mono text-[var(--text-primary)]">{v}</span></div>
              ))}
              <hr className="my-2" style={{ borderColor: 'var(--border)' }} />
              <div className="flex justify-between items-center"><span className="font-semibold text-[var(--text-primary)]">EPV / SHARE</span><span className="text-2xl font-bold font-mono" style={{ color: 'var(--positive)' }}>{formatCurrency(r.epvPerShare, 'USD')}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Current Price</span><span className="font-mono text-[var(--text-primary)]">{formatCurrency(d.price, 'USD')}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Upside / (Downside)</span><span className="font-mono font-semibold" style={{ color: getChangeCSSVar(r.upside) }}>{formatPercent(r.upside)}</span></div>
              <p className="text-xs text-[var(--text-muted)] mt-2">{r.upside > 0 ? 'EPV exceeds the price - the market is pricing little or no growth.' : 'Price exceeds EPV - the market is paying a premium for expected growth.'}</p>
            </>
          ) : <p className="text-sm text-[var(--text-muted)]">Enter a positive normalised EBIT and WACC to compute EPV.</p>}
        </div>
      </div>
    </div>
  )
}

// ── Residual Income Model ─────────────────────────────────────────────────────
function ResidualIncomeModel({ ctx }) {
  const d = ctx.derived
  const [inp, setInp] = useState({
    bvps: +(d.bvps || 0).toFixed(2),
    roe: +(d.roe || 0.12).toFixed(3),
    ke: +(d.riskFree + d.beta * 0.055).toFixed(4),
    payoutRatio: 0.4, years: 5, terminalGrowth: 0.0,
  })
  const set = (k, v) => setInp((s) => ({ ...s, [k]: v }))
  const r = useMemo(() => calculateResidualIncome({
    bookValuePerShare: inp.bvps, roe: inp.roe, ke: inp.ke,
    payoutRatio: inp.payoutRatio, years: inp.years, terminalGrowth: inp.terminalGrowth, currentPrice: d.price,
  }), [inp, d.price])
  const issues = validateAssumptions('rim', { ke: inp.ke, bookValuePerShare: inp.bvps })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-4">
      <div className="card">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Residual Income Model</h3>
        <p className="text-xs text-[var(--text-muted)] mb-3">Value = current book value + PV of residual income, where residual income = (ROE − Ke) × book value. A company only creates value when ROE exceeds the cost of equity.</p>
        <div className="grid grid-cols-2 gap-x-3">
          <Num label="Book Value / Share" value={inp.bvps} onChange={(v) => set('bvps', v)} step={0.5} />
          <Num label="ROE (%)" value={+(inp.roe * 100).toFixed(1)} onChange={(v) => set('roe', v / 100)} step={0.5} />
          <Num label="Cost of Equity Ke (%)" value={+(inp.ke * 100).toFixed(2)} onChange={(v) => set('ke', v / 100)} step={0.25} />
          <Num label="Payout Ratio (%)" value={+(inp.payoutRatio * 100).toFixed(0)} onChange={(v) => set('payoutRatio', v / 100)} step={5} />
          <Num label="Horizon (yrs)" value={inp.years} onChange={(v) => set('years', Math.max(1, Math.round(v)))} step={1} />
          <Num label="Terminal RI Growth (%)" value={+(inp.terminalGrowth * 100).toFixed(1)} onChange={(v) => set('terminalGrowth', v / 100)} step={0.5} />
        </div>
        <div className="text-[10px] text-[var(--text-muted)] mt-1">From {ctx.symbol}: BVPS {formatNumber(d.bvps, 2)} · ROE {formatPercent(d.roe * 100, 1, false)}</div>
      </div>
      <div>
        <Alerts issues={issues} />
        <div className="card mb-3">
          {r.valid ? (
            <>
              {[['Starting Book Value', formatCurrency(r.startingBookValue, 'USD')],
                ['PV of Residual Income', formatCurrency(r.pvResidualIncome, 'USD')],
                ['PV of Terminal RI', formatCurrency(r.pvTerminal, 'USD')]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm py-0.5"><span className="text-[var(--text-secondary)]">{k}</span><span className="font-mono text-[var(--text-primary)]">{v}</span></div>
              ))}
              <hr className="my-2" style={{ borderColor: 'var(--border)' }} />
              <div className="flex justify-between items-center"><span className="font-semibold text-[var(--text-primary)]">FAIR VALUE / SHARE</span><span className="text-2xl font-bold font-mono" style={{ color: 'var(--positive)' }}>{formatCurrency(r.valuePerShare, 'USD')}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Upside / (Downside)</span><span className="font-mono font-semibold" style={{ color: getChangeCSSVar(r.upside) }}>{formatPercent(r.upside)}</span></div>
            </>
          ) : <p className="text-sm text-[var(--text-muted)]">Enter positive book value and cost of equity to run the model.</p>}
        </div>
        {r.valid && r.schedule.length > 0 && (
          <div className="card overflow-x-auto">
            <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2">Residual Income Schedule (per share)</h4>
            <table className="w-full text-xs" style={{ minWidth: 420 }}>
              <thead><tr className="text-[var(--text-muted)]">{['Yr', 'Open BV', 'EPS', 'Residual Inc', 'PV'].map((h) => <th key={h} className="text-right font-normal py-1">{h}</th>)}</tr></thead>
              <tbody>{r.schedule.map((s) => (
                <tr key={s.year} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="text-right py-1 text-[var(--text-secondary)]">{s.year}</td>
                  {[s.openingBV, s.eps, s.residualIncome, s.pv].map((v, i) => <td key={i} className="text-right py-1 font-mono text-[var(--text-primary)]">{formatNumber(v, 2)}</td>)}
                </tr>))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
export default function Learning() {
  const [params] = useSearchParams()
  const initialSymbol = params.get('symbol')
  const [tab, setTab] = useState(initialSymbol || window.location.hash.includes('lab') ? 'lab' : 'curriculum')

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="page-title">{tab === 'curriculum' ? 'Learning' : 'Valuation Lab'}</h1>
        <div className="segmented shrink-0">
          <button onClick={() => setTab('curriculum')} aria-pressed={tab === 'curriculum'}>Curriculum</button>
          <button onClick={() => setTab('lab')} aria-pressed={tab === 'lab'}>Lab</button>
        </div>
      </div>
      {tab === 'curriculum' ? <Curriculum /> : <Lab initialSymbol={initialSymbol} />}
    </div>
  )
}
