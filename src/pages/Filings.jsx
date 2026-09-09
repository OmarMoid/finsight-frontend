import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FileText, ExternalLink, ArrowLeft, Clock, RefreshCw, BookOpen, Info,
} from 'lucide-react'
import { filingsAPI } from '../utils/api'
import useStore from '../store/useStore'
import SymbolPicker from '../components/common/SymbolPicker'
import Alert from '../components/common/Alert'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { SkeletonCard, SkeletonLines } from '../components/common/Skeleton'
import { formatDate } from '../utils/formatters'

/**
 * Filings — read what a company actually told the regulator.
 *
 * Three views in one page, because they are one task: pick a company, see what
 * it has filed, read one of them.
 *
 *   index  → every filing grouped by form, each group explaining what that
 *            form is and what to look for in it
 *   reader → one filing split into its Items, in full
 *   guide  → the standalone form reference
 *
 * The reading-list framing is deliberate. The brief was to learn from these
 * documents, and a bare list of accession numbers teaches nothing — so every
 * form carries "what this is", "when it appears" and "what to look for",
 * served from the backend so the list, the reader and the guide can't drift.
 */

const IMPORTANCE_STYLE = {
  essential: { label: 'Essential reading', colour: 'var(--accent)' },
  high: { label: 'Worth reading', colour: 'var(--positive)' },
  medium: { label: 'Situational', colour: 'var(--text-secondary)' },
  low: { label: 'Reference only', colour: 'var(--text-muted)' },
}

function ImportanceBadge({ importance }) {
  const style = IMPORTANCE_STYLE[importance] || IMPORTANCE_STYLE.low
  return (
    <span className="badge shrink-0" style={{ color: style.colour }}>{style.label}</span>
  )
}

// ── Form explainer, shared by the list and the reader header ────────────────
function FormExplainer({ guide, compact = false }) {
  if (!guide) return null
  return (
    <div className={compact ? '' : 'mt-2'}>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{guide.what}</p>
      {guide.cadence && (
        <p className="text-2xs text-[var(--text-muted)] mt-1.5 flex items-start gap-1.5">
          <Clock size={12} className="mt-0.5 shrink-0" />
          <span>{guide.cadence}</span>
        </p>
      )}
      {guide.look_for?.length > 0 && (
        <div className="mt-2.5">
          <div className="section-label mb-1">What to look for</div>
          <ul className="space-y-1">
            {guide.look_for.map((item) => (
              <li key={item} className="text-sm text-[var(--text-secondary)] flex gap-2 leading-relaxed">
                <span className="text-[var(--accent)] shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ── One group of filings (all the 10-Ks, all the 8-Ks, …) ───────────────────
function FormGroup({ group, onRead, expanded, onToggle }) {
  const visible = expanded ? group.filings : group.filings.slice(0, 4)

  return (
    <section className="card">
      <div className="card-head">
        <div className="min-w-0">
          <h2 className="card-title">
            <span className="font-mono">{group.form}</span>
            <span className="text-[var(--text-secondary)] font-normal"> · {group.name}</span>
          </h2>
        </div>
        <ImportanceBadge importance={group.importance} />
      </div>

      <FormExplainer guide={group} />

      <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="section-label mb-1.5">
          {group.count} filed · most recent {formatDate(group.latest)}
        </div>
        <div>
          {visible.map((filing) => (
            <div
              key={filing.accession}
              className="flex items-center justify-between gap-3 py-2 border-b last:border-0"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="min-w-0">
                <div className="text-sm text-[var(--text-primary)] font-mono">
                  {filing.form}
                  {filing.periodOfReport && (
                    <span className="text-[var(--text-muted)] font-sans">
                      {' '}· period ending {formatDate(filing.periodOfReport)}
                    </span>
                  )}
                </div>
                <div className="text-2xs text-[var(--text-muted)]">Filed {formatDate(filing.filed)}</div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {filing.readable && (
                  <button className="btn" onClick={() => onRead(filing)}>
                    <BookOpen size={13} /> Read
                  </button>
                )}
                <a
                  href={filing.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn"
                  aria-label={`Open ${filing.form} on EDGAR`}
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
        {group.filings.length > 4 && (
          <button className="text-sm text-[var(--accent)] mt-2" onClick={onToggle}>
            {expanded ? 'Show fewer' : `Show all ${group.filings.length}`}
          </button>
        )}
      </div>
    </section>
  )
}

// ── The reader ──────────────────────────────────────────────────────────────
function Reader({ symbol, filing, onBack }) {
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [active, setActive] = useState(null)
  const topRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    setFailed(false)
    const result = await filingsAPI.getDocument(symbol, {
      accession: filing.accession,
      document: filing.document,
      form: filing.canonicalForm,
    })
    if (result?.error) {
      setFailed(true)
      setDoc(null)
    } else {
      setDoc(result)
      setActive(result.sections?.[0]?.key ?? null)
    }
    setLoading(false)
  }, [symbol, filing])

  useEffect(() => { load() }, [load])

  const section = doc?.sections?.find((s) => s.key === active)

  return (
    <div ref={topRef}>
      <button className="btn mb-3" onClick={onBack}>
        <ArrowLeft size={14} /> All filings
      </button>

      <div className="card mb-4">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-mono text-lg font-bold text-[var(--text-primary)]">{filing.form}</span>
          <span className="text-base text-[var(--text-secondary)]">{doc?.guide?.name || ''}</span>
        </div>
        <div className="text-2xs text-[var(--text-muted)] mt-1">
          {symbol} · filed {formatDate(filing.filed)}
          {filing.periodOfReport && ` · period ending ${formatDate(filing.periodOfReport)}`}
        </div>
        {doc?.guide && <FormExplainer guide={doc.guide} />}
        <a
          href={doc?.url || filing.documentUrl}
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-[var(--accent)] mt-3"
        >
          Open the original on EDGAR <ExternalLink size={13} />
        </a>
      </div>

      {loading && (
        <div className="card">
          <LoadingSpinner label="Downloading and parsing the filing… the first read of a large 10-K takes a moment." />
        </div>
      )}

      {failed && (
        <Alert title="Couldn't read this filing" onRetry={load}>
          EDGAR didn&rsquo;t return the document. You can still open the original on their site.
        </Alert>
      )}

      {doc && !loading && (
        <>
          {/* Section switcher. A scrolling strip is right here — the number of
              Items varies by form and by filing, so it genuinely cannot be
              known in advance the way a fixed tab set can. */}
          {doc.sections.length > 1 && (
            <div className="tabs mb-4">
              {doc.sections.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActive(s.key)}
                  className={active === s.key ? 'is-active' : ''}
                >
                  {s.title.replace(/^(Item|Part II Item)\s*/, 'Item ').split('-')[0].trim()}
                </button>
              ))}
            </div>
          )}

          {section && (
            <article className="card">
              <h2 className="card-title" style={{ whiteSpace: 'normal' }}>{section.title}</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">{section.why}</p>
              <div className="text-2xs text-[var(--text-muted)] mt-1.5">
                {section.paragraphs.length} paragraphs · about a {section.readingMinutes} minute read
              </div>

              {/* `max-width: 68ch` is the one thing that makes a filing
                  readable rather than merely present: a full-width line of
                  10-K prose on a desktop is 160 characters and the eye loses
                  its place returning to the next line. */}
              <div
                className="mt-4 pt-4 border-t space-y-3"
                style={{ borderColor: 'var(--border)', maxWidth: '68ch' }}
              >
                {section.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className="text-sm text-[var(--text-secondary)]"
                    style={{ lineHeight: 1.7, overflowWrap: 'anywhere' }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </article>
          )}

          {/* An 8-K's own body is boilerplate; the substance is the exhibit. */}
          {doc.exhibits?.length > 0 && (
            <div className="stack mt-4">
              {doc.exhibits.map((ex) => (
                <article key={ex.url} className="card">
                  <div className="card-head">
                    <h2 className="card-title font-mono">{ex.name}</h2>
                    <a href={ex.url} target="_blank" rel="noreferrer" className="btn shrink-0">
                      <ExternalLink size={13} />
                    </a>
                  </div>
                  {ex.format === 'PDF' ? (
                    <p className="text-sm text-[var(--text-muted)]">
                      A PDF exhibit - usually the slide deck. Open it on EDGAR to view.
                    </p>
                  ) : (
                    <div className="space-y-2.5 mt-2" style={{ maxWidth: '68ch' }}>
                      {ex.paragraphs.map((para, i) => (
                        <p key={i} className="text-sm text-[var(--text-secondary)]"
                           style={{ lineHeight: 1.7, overflowWrap: 'anywhere' }}>
                          {para}
                        </p>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function Filings() {
  const [params, setParams] = useSearchParams()
  const activeMarket = useStore((s) => s.activeMarket)
  const recentlyViewed = useStore((s) => s.recentlyViewed)

  const initial =
    params.get('symbol') || recentlyViewed?.[0] || (activeMarket === 'asx' ? 'BHP.AX' : 'AAPL')
  const [symbol, setSymbol] = useState(initial.toUpperCase())
  const [index, setIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [reading, setReading] = useState(null)
  const [expanded, setExpanded] = useState({})
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setFailed(false)
    setReading(null)
    const result = await filingsAPI.getIndex(symbol)
    if (result?.error) {
      setFailed(true)
      setIndex(null)
    } else {
      setIndex(result)
    }
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

  const refresh = async () => {
    setRefreshing(true)
    await filingsAPI.refresh(symbol)
    // The backend re-checks EDGAR in the background, so give it a moment
    // before re-reading rather than racing it and showing the old index.
    setTimeout(async () => {
      await load()
      setRefreshing(false)
    }, 2500)
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="min-w-0">
          <h1 className="page-title flex items-center gap-2">
            <FileText size={18} className="text-[var(--accent)] shrink-0" />
            Filings
          </h1>
          <p className="page-sub">
            What a company told the SEC, in its own words - annual and quarterly reports,
            earnings releases, proxies and insider trades.
          </p>
        </div>
        {index?.available && !reading && (
          <button className="btn shrink-0" onClick={refresh} disabled={refreshing}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Check for new</span>
          </button>
        )}
      </div>

      <SymbolPicker value={symbol} onSubmit={pick} />

      {failed && (
        <Alert title="Couldn't reach EDGAR" onRetry={load}>
          The SEC&rsquo;s service didn&rsquo;t respond. Try again in a moment.
        </Alert>
      )}

      {loading ? (
        <div className="stack">
          <SkeletonCard lines={4} />
          <SkeletonCard lines={6} />
        </div>
      ) : reading ? (
        <Reader symbol={symbol} filing={reading} onBack={() => setReading(null)} />
      ) : index && !index.available ? (
        <div className="card">
          <div className="flex items-start gap-2.5">
            <Info size={16} className="text-[var(--text-muted)] mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold text-[var(--text-primary)]">No SEC filings for {symbol}</div>
              <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">{index.reason}</p>
            </div>
          </div>
        </div>
      ) : index ? (
        <div className="stack">
          <div className="card">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-mono text-lg font-bold text-[var(--text-primary)]">{symbol}</span>
              <span className="text-base text-[var(--text-secondary)]">{index.companyName}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {index.sic && <span className="badge">{index.sic}</span>}
              {(index.exchanges || []).map((x) => <span key={x} className="badge">{x}</span>)}
              <span className="badge font-mono">CIK {index.cik}</span>
            </div>
            {/* Never silently substitute one security for another: if these
                filings belong to the US ADR rather than the local line the
                user typed, say so. */}
            {index.matchedVia && (
              <p className="text-sm text-[var(--accent-gold)] mt-2.5 leading-relaxed">
                {symbol} isn&rsquo;t itself SEC-registered. These are the filings of its US listing,{' '}
                <span className="font-mono">{index.matchedVia}</span> - the same company, reporting to
                a different regulator, so the accounting standard may differ.
              </p>
            )}
            <a href={index.edgarUrl} target="_blank" rel="noreferrer"
               className="inline-flex items-center gap-1 text-sm text-[var(--accent)] mt-3">
              Browse the full history on EDGAR <ExternalLink size={13} />
            </a>
          </div>

          {index.groups.map((group) => (
            <FormGroup
              key={group.form}
              group={group}
              expanded={!!expanded[group.form]}
              onToggle={() => setExpanded((e) => ({ ...e, [group.form]: !e[group.form] }))}
              onRead={setReading}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
