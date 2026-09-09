import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, Newspaper, ImageOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { marketAPI, sentimentAPI, newsAPI } from '../utils/api'
import useStore from '../store/useStore'
import { SkeletonBlock } from '../components/common/LoadingSpinner'
import { Line, SkeletonLines } from '../components/common/Skeleton'
import {
  formatNumber, formatPercent, getChangeCSSVar, timeAgo, truncate,
} from '../utils/formatters'
import { marketStatus, formatLongDateIn } from '../utils/timezone'

// ── helpers ────────────────────────────────────────────────────────────────
function fngColor(score) {
  if (score == null) return 'var(--text-muted)'
  if (score < 25) return 'var(--negative)'
  if (score < 45) return 'var(--accent-gold)'
  if (score < 55) return 'var(--text-secondary)'
  if (score < 75) return 'var(--positive)'
  return 'var(--positive)'
}

function parsePct(v) {
  if (typeof v === 'number') return v
  if (typeof v === 'string') return parseFloat(v.replace('%', ''))
  return null
}

// Market hours are minutes since midnight *in the market's own zone* — the
// NYSE bell is 09:30 in New York no matter where you are reading from. The
// clock the user reads is a separate, chosen zone; see utils/timezone.js.
// (Public holidays are not modelled.)
const MARKETS = [
  { name: 'NYSE / NASDAQ', tz: 'America/New_York', open: 570, close: 960 },  // 9:30–16:00 ET
  { name: 'ASX', tz: 'Australia/Sydney', open: 600, close: 960 },            // 10:00–16:00 AEST/AEDT
  { name: 'LSE', tz: 'Europe/London', open: 480, close: 990 },               // 8:00–16:30 GMT/BST
  { name: 'TSE (Tokyo)', tz: 'Asia/Tokyo', open: 540, close: 900 },          // 9:00–15:00 JST
]

function Card({ title, titleColor, children, className = '' }) {
  return (
    <div className={`card fade-in ${className}`}>
      {title && (
        <h3 className="card-title mb-3" style={titleColor ? { color: titleColor } : undefined}>
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

// ── Index card ───────────────────────────────────────────────────────────
// Sized to show two-and-a-bit cards on a phone, so it's obvious the strip
// scrolls without needing a visible scrollbar.
function IndexCard({ idx }) {
  const c = getChangeCSSVar(idx.change_percent ?? 0)
  return (
    <div className="card">
      <div className="text-2xs font-mono text-[var(--text-muted)] truncate">{idx.symbol}</div>
      <div className="text-sm font-medium text-[var(--text-primary)] truncate">{idx.name}</div>
      <div className="mt-1.5 text-lg font-semibold font-mono text-[var(--text-primary)]">
        {idx.price != null ? formatNumber(idx.price, 2) : '-'}
      </div>
      <div className="text-sm font-semibold font-mono" style={{ color: c }}>
        {idx.change_percent != null ? formatPercent(idx.change_percent) : '-'}
      </div>
    </div>
  )
}

// ── Mover row ──────────────────────────────────────────────────────────────
// The company name is dropped below `sm`: the movers feed rarely carries one,
// and an empty flex column just pushed the numbers apart on a phone.
function MoverRow({ symbol, name, price, changePct, onClick }) {
  const c = getChangeCSSVar(changePct ?? 0)
  return (
    <button onClick={onClick} className="flex items-center gap-2 w-full py-2 text-left border-b last:border-0"
            style={{ borderColor: 'var(--border)' }}>
      <span className="font-mono text-sm font-semibold text-[var(--accent)] shrink-0" style={{ minWidth: 62 }}>{symbol}</span>
      {name && <span className="hidden sm:block flex-1 text-sm text-[var(--text-secondary)] truncate">{name}</span>}
      <span className="flex-1 text-sm font-mono text-[var(--text-primary)] text-right">{price != null ? formatNumber(price, 2) : '-'}</span>
      <span className="text-sm font-semibold font-mono shrink-0" style={{ width: 74, textAlign: 'right', color: c }}>
        {changePct != null ? formatPercent(changePct) : '-'}
      </span>
    </button>
  )
}

// ── News row ───────────────────────────────────────────────────────────────
// Flat divided rows rather than a card per article: cards-inside-a-card gave
// every headline two competing borders and wasted ~20px of width per item.
function NewsRow({ article }) {
  const [imgErr, setImgErr] = useState(false)
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer"
       className="group flex gap-3 py-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
      <div className="shrink-0 rounded-control overflow-hidden flex items-center justify-center"
           style={{ width: 56, height: 56, background: 'var(--bg-input)' }}>
        {article.image && !imgErr ? (
          <img src={article.image} alt="" loading="lazy" onError={() => setImgErr(true)}
               style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <ImageOff size={18} className="text-[var(--text-muted)]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="clamp-2 text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
          {article.title}
        </div>
        <div className="mt-1 text-xs text-[var(--text-muted)]">
          {article.source}{article.date ? ` · ${timeAgo(article.date)}` : ''}
        </div>
      </div>
    </a>
  )
}

// ── main ───────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const activeMarket = useStore((s) => s.activeMarket)
  const settings = useStore((s) => s.settings)
  const timezone = settings.timezone
  const recentlyViewed = useStore((s) => s.recentlyViewed)

  const [overview, setOverview] = useState(null)
  const [global, setGlobal] = useState(null)
  const [fng, setFng] = useState(null)
  const [news, setNews] = useState({ fmp: [], finnhub: [] })
  const [loading, setLoading] = useState(true)
  const [newsFilter, setNewsFilter] = useState('all')
  const [countdown, setCountdown] = useState(settings.autoRefreshInterval || 0)
  const countdownRef = useRef(countdown)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [ov, gl, fg, nw] = await Promise.all([
      marketAPI.getOverview(activeMarket),
      sentimentAPI.getGlobal(),
      sentimentAPI.getFearGreed(),
      newsAPI.getLatest(activeMarket),
    ])
    setOverview(ov?.error ? null : ov)
    setGlobal(gl?.error ? null : gl)
    setFng(fg?.error ? null : fg)
    setNews(nw?.error ? { fmp: [], finnhub: [] } : nw)
    if (ov?.error && gl?.error && fg?.error && nw?.error) {
      toast.error('Failed to load market data - check API connection')
    } else if (ov?.error) {
      toast.error('Failed to load market overview - check API connection')
    }
    setLoading(false)
    countdownRef.current = settings.autoRefreshInterval || 0
    setCountdown(settings.autoRefreshInterval || 0)
  }, [activeMarket, settings.autoRefreshInterval])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Re-fetch on market change broadcast from the Navbar.
  useEffect(() => {
    const handler = () => fetchAll()
    window.addEventListener('market-changed', handler)
    return () => window.removeEventListener('market-changed', handler)
  }, [fetchAll])

  // Auto-refresh countdown.
  useEffect(() => {
    if (!settings.autoRefreshInterval || settings.autoRefreshInterval <= 0) return
    const id = setInterval(() => {
      countdownRef.current -= 1
      if (countdownRef.current <= 0) {
        fetchAll()
      } else {
        setCountdown(countdownRef.current)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [settings.autoRefreshInterval, fetchAll])

  const isUS = activeMarket === 'us'
  // Rendered in the chosen display zone, not the device's: near midnight the
  // two genuinely disagree about what day it is, and the date sits directly
  // above market data belonging to that other day.
  const dateStr = formatLongDateIn(new Date(), timezone)

  // Movers (US only — Alpha Vantage top gainers/losers).
  const movers = overview?.movers || {}
  const gainers = (movers.top_gainers || []).slice(0, 7)
  const losers = (movers.top_losers || []).slice(0, 7)

  // Global indices sorted by absolute change.
  const globalIndices = [...(global?.indices || [])]
    .filter((i) => i.change_percent != null)
    .sort((a, b) => Math.abs(b.change_percent) - Math.abs(a.change_percent))
    .slice(0, 8)

  // Fear & Greed comparisons derived from historical series.
  const fngHist = fng?.historical || []
  const fngAt = (daysAgo) => {
    if (!fngHist.length) return null
    const target = Date.now() - daysAgo * 86400000
    let best = null
    for (const p of fngHist) {
      if (best === null || Math.abs(p.x - target) < Math.abs(best.x - target)) best = p
    }
    return best
  }
  const fngCompare = [
    { label: 'Previous Close', pt: fng?.previous_close != null ? { y: fng.previous_close, rating: '' } : fngAt(1) },
    { label: '1 Week Ago', pt: fngAt(7) },
    { label: '1 Month Ago', pt: fngAt(30) },
    { label: '1 Year Ago', pt: fngAt(365) },
  ]

  // News normalisation.
  const normalized = []
  if (newsFilter === 'all' || newsFilter === 'finnhub') {
    for (const a of (news.finnhub || [])) {
      normalized.push({ title: a.headline, image: a.image, source: a.source || 'Finnhub', date: a.datetime ? a.datetime * 1000 : null, url: a.url })
    }
  }
  if (newsFilter === 'all' || newsFilter === 'newsapi') {
    for (const a of (news.newsapi || [])) {
      normalized.push({ title: a.title, image: a.image, source: a.source || 'NewsAPI', date: a.published ? Date.parse(a.published) : null, url: a.url })
    }
  }
  if (newsFilter === 'all' || newsFilter === 'fmp') {
    for (const a of (news.fmp || [])) {
      normalized.push({ title: a.title, image: a.image, source: a.site || a.publisher || 'FMP', date: a.publishedDate ? Date.parse(a.publishedDate) : null, url: a.url })
    }
  }
  // De-dupe by title and sort newest-first.
  const seenTitles = new Set()
  const articles = normalized
    .filter((a) => a.title && !seenTitles.has(a.title) && seenTitles.add(a.title))
    .sort((x, y) => (y.date || 0) - (x.date || 0))
    .slice(0, 12)

  return (
    <div className="page">
      {/* HEADER */}
      <div className="page-head">
        <div className="min-w-0">
          <h1 className="page-title">{isUS ? 'US Markets' : 'ASX Markets'}</h1>
          <p className="page-sub">{dateStr}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {settings.autoRefreshInterval > 0 && (
            <span className="hidden sm:inline text-xs text-[var(--text-muted)] font-mono">↻ {countdown}s</span>
          )}
          <button onClick={fetchAll} className="btn" aria-label="Refresh market data">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* INDEX CARDS
          A wrapping grid rather than a horizontal carousel: five indices fit
          on any screen in two rows, and the carousel's edge bleed left this
          row starting half a gutter closer to the bezel than every card below
          it. */}
      <div className="tile-grid mb-5">
        {loading && !overview
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonBlock key={i} height={104} />)
          : (overview?.indices || []).map((idx) => <IndexCard key={idx.symbol} idx={idx} />)}
      </div>

      {/* THREE COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 mb-4">
        {/* LEFT */}
        <div className="stack">
          <Card title="Fear &amp; Greed Index">
            {fng?.score != null ? (
              <>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-4xl font-bold font-mono leading-none" style={{ color: fngColor(fng.score) }}>{Math.round(fng.score)}</span>
                  <span className="text-base font-semibold capitalize" style={{ color: fngColor(fng.score) }}>{fng.rating}</span>
                </div>
                <div className="relative mt-3.5 h-2.5 rounded-full"
                     style={{ background: 'linear-gradient(90deg, var(--positive), var(--accent-gold), var(--negative))' }}>
                  <div style={{ position: 'absolute', left: `${fng.score}%`, top: -6, transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid var(--text-primary)' }} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {fngCompare.map((c) => (
                    <div key={c.label} className="stat">
                      <div className="stat-label">{c.label}</div>
                      <div className="stat-value text-base" style={{ color: fngColor(c.pt?.y) }}>
                        {c.pt?.y != null ? Math.round(c.pt.y) : '-'}
                        {c.pt?.rating && (
                          <span className="ml-1.5 text-2xs font-sans font-medium">
                            {c.pt.rating.charAt(0).toUpperCase() + c.pt.rating.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : loading ? <SkeletonLines rows={4} /> : <p className="text-sm text-[var(--text-muted)]">Sentiment unavailable</p>}
          </Card>

          {recentlyViewed.length > 0 && (
            <Card title="Recently Viewed">
              <div className="flex flex-wrap gap-1.5">
                {recentlyViewed.slice(0, 8).map((sym) => (
                  <button key={sym} onClick={() => navigate(`/stock/${sym}`)}
                          className="chip font-mono" style={{ color: 'var(--accent)' }}>
                    {sym}
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* CENTRE */}
        <div className="stack">
          <Card title="Top Gainers" titleColor="var(--positive)">
            {gainers.length ? gainers.map((g, i) => (
              <MoverRow key={i} symbol={g.ticker} name={g.name} price={parsePct(g.price)} changePct={parsePct(g.change_percentage)}
                        onClick={() => navigate(`/stock/${g.ticker}`)} />
            )) : loading ? <SkeletonLines rows={5} /> : <p className="text-sm text-[var(--text-muted)]">Movers unavailable right now</p>}
          </Card>
          <Card title="Top Losers" titleColor="var(--negative)">
            {losers.length ? losers.map((l, i) => (
              <MoverRow key={i} symbol={l.ticker} name={l.name} price={parsePct(l.price)} changePct={parsePct(l.change_percentage)}
                        onClick={() => navigate(`/stock/${l.ticker}`)} />
            )) : loading ? <SkeletonLines rows={5} /> : <p className="text-sm text-[var(--text-muted)]">Movers unavailable right now</p>}
          </Card>
        </div>

        {/* RIGHT */}
        <div className="stack">
          <Card title="Global Markets">
            {globalIndices.length ? globalIndices.map((g) => (
              <div key={g.symbol} className="flex items-center justify-between gap-3 py-1.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                {/* Wraps instead of truncating — the index name is the only
                    thing identifying the row, so cutting it is worse than
                    letting it take a second line. */}
                <span className="text-sm text-[var(--text-secondary)] leading-snug">{g.name}</span>
                <span className="text-sm font-mono font-semibold shrink-0" style={{ color: getChangeCSSVar(g.change_percent) }}>
                  {formatPercent(g.change_percent)}
                </span>
              </div>
            )) : loading ? <SkeletonLines rows={4} /> : <p className="text-sm text-[var(--text-muted)]">Unavailable</p>}
          </Card>

          <Card title="Market Status">
            {MARKETS.map((m) => {
              const st = marketStatus(m.tz, m.open, m.close, timezone)
              return (
                <div key={m.name} className="flex items-start justify-between gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <div className="min-w-0">
                    <div className="text-sm text-[var(--text-secondary)] truncate">{m.name}</div>
                    <div className="text-2xs text-[var(--text-muted)] font-mono">
                      {st.marketTime} {st.marketZoneLabel}
                      {/* The same instant on the user's own clock, shown only
                          when the two zones actually differ — otherwise it is
                          the same number printed twice. */}
                      {st.displayTime !== st.marketTime && (
                        <span className="text-[var(--text-muted)]"> · {st.displayTime} {st.displayZoneLabel}</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="badge" style={{ color: st.open ? 'var(--positive)' : 'var(--text-muted)' }}>
                      {st.open ? '● Open' : '○ Closed'}
                    </span>
                    {st.untilLabel && (
                      <div className="text-2xs text-[var(--text-muted)] mt-0.5 whitespace-nowrap">{st.untilLabel}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </Card>
        </div>
      </div>

      {/* NEWS */}
      <Card>
        <div className="flex items-center justify-between gap-3 mb-1">
          <h3 className="card-title flex items-center gap-2">
            <Newspaper size={14} /> Latest News
          </h3>
          <div className="segmented">
            {['all', 'finnhub', 'newsapi'].map((f) => (
              <button key={f} onClick={() => setNewsFilter(f)} aria-pressed={newsFilter === f}>
                {f === 'all' ? 'All' : f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {articles.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
            {articles.map((a, i) => <NewsRow key={i} article={a} />)}
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 mt-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3 py-3" style={{ borderTop: i > 1 ? '1px solid var(--border)' : undefined }}>
                <Line w={64} h={48} r={6} />
                <div className="flex-1">
                  <Line w="100%" h={11} />
                  <div style={{ height: 7 }} />
                  <Line w="72%" h={11} />
                  <div style={{ height: 9 }} />
                  <Line w={92} h={8} />
                </div>
              </div>
            ))}
          </div>
        ) : <p className="mt-3 text-sm text-[var(--text-muted)]">No news available</p>}
      </Card>
    </div>
  )
}
