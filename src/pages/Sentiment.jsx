import { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea,
} from 'recharts'
import { AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { sentimentAPI, macroAPI } from '../utils/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { formatNumber, formatPercent, getChangeCSSVar } from '../utils/formatters'

const TABS = ['Global Overview', 'United States', 'Australia']

// Two-letter market codes rather than flag emoji: they render identically on
// every platform, sort visually with the mono figures beside them, and read as
// a market identifier rather than a decoration.
const MARKET_CODE = {
  '^GSPC': 'US', '^DJI': 'US', '^IXIC': 'US', '^FTSE': 'UK', '^GDAXI': 'DE',
  '^N225': 'JP', '^HSI': 'HK', '^AXJO': 'AU', '^BVSP': 'BR', '000001.SS': 'CN',
}

// Contrarian sentiment palette (per spec): fear = green, greed = red.
function sentColor(s) {
  if (s == null) return 'var(--text-muted)'
  if (s < 25) return 'var(--positive)'
  if (s < 45) return 'var(--accent)'
  if (s < 55) return 'var(--accent-gold)'
  if (s < 75) return 'var(--accent-gold)'
  return 'var(--negative)'
}

const last = (arr) => (Array.isArray(arr) && arr.length ? arr[arr.length - 1] : null)

function Card({ title, children, className = '' }) {
  return (
    <div className={`card fade-in ${className}`}>
      {title && <h3 className="card-title mb-3">{title}</h3>}
      {children}
    </div>
  )
}

// ── Fear & Greed semicircle gauge ──────────────────────────────────────────
function FngGauge({ score }) {
  const v = score == null ? 50 : Math.max(0, Math.min(100, score))
  const angle = (v / 100) * 180 - 90
  return (
    <svg width="220" height="124" viewBox="0 0 220 124">
      <path d="M14,114 A96,96 0 0,1 64,33" fill="none" stroke="var(--positive)" strokeWidth="13" />
      <path d="M64,33 A96,96 0 0,1 110,18" fill="none" stroke="var(--accent)" strokeWidth="13" />
      <path d="M110,18 A96,96 0 0,1 156,33" fill="none" stroke="var(--accent-gold)" strokeWidth="13" />
      <path d="M156,33 A96,96 0 0,1 206,114" fill="none" stroke="var(--negative)" strokeWidth="13" />
      <line x1="110" y1="114" x2="110" y2="40" stroke="var(--text-primary)" strokeWidth="3"
            transform={`rotate(${angle} 110 114)`} strokeLinecap="round" />
      <circle cx="110" cy="114" r="5" fill="var(--text-primary)" />
    </svg>
  )
}

// ── Macro time-series chart ─────────────────────────────────────────────────
function SeriesChart({ data, color, type = 'line', step = false }) {
  const chartData = (data || []).map((d) => ({ date: d.date, value: d.value }))
  if (!chartData.length) return <p className="text-sm text-[var(--text-muted)]">No data</p>
  const axis = { tick: { fill: 'var(--text-muted)', fontSize: 10 }, axisLine: { stroke: 'var(--border)' } }
  const tooltip = { contentStyle: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' } }
  return (
    <ResponsiveContainer width="100%" height={180}>
      {type === 'bar' ? (
        <BarChart data={chartData}>
          <XAxis dataKey="date" {...axis} tickFormatter={(d) => (d || '').slice(0, 7)} minTickGap={40} />
          <YAxis {...axis} width={40} />
          <Tooltip {...tooltip} />
          <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
        </BarChart>
      ) : (
        <LineChart data={chartData}>
          <XAxis dataKey="date" {...axis} tickFormatter={(d) => (d || '').slice(0, 7)} minTickGap={40} />
          <YAxis {...axis} width={40} domain={['auto', 'auto']} />
          <Tooltip {...tooltip} />
          <Line type={step ? 'stepAfter' : 'monotone'} dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      )}
    </ResponsiveContainer>
  )
}

// ── Global tab ──────────────────────────────────────────────────────────────
function GlobalTab() {
  const [fng, setFng] = useState(null)
  const [global, setGlobal] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.all([sentimentAPI.getFearGreed(), sentimentAPI.getGlobal()]).then(([f, g]) => {
      if (f?.error && g?.error) toast.error('Failed to load sentiment data - check API connection')
      setFng(f?.error ? null : f); setGlobal(g?.error ? null : g); setLoading(false)
    })
  }, [])
  if (loading) return <LoadingSpinner label="Loading sentiment…" />

  const hist = fng?.historical || []
  const fngAt = (days) => {
    if (!hist.length) return null
    const t = Date.now() - days * 86400000
    return hist.reduce((b, p) => (b === null || Math.abs(p.x - t) < Math.abs(b.x - t) ? p : b), null)
  }
  const comps = [
    { label: 'Previous Close', pt: fng?.previous_close != null ? { y: fng.previous_close } : fngAt(1) },
    { label: '1 Week Ago', pt: fngAt(7) }, { label: '1 Month Ago', pt: fngAt(30) }, { label: '1 Year Ago', pt: fngAt(365) },
  ]
  const chart30 = hist.slice(-30).map((p) => ({ date: new Date(p.x).toISOString().slice(5, 10), score: Math.round(p.y) }))
  const indices = [...(global?.indices || [])].sort((a, b) => (b.change_percent ?? -99) - (a.change_percent ?? -99))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Fear & Greed Index">
          <div className="flex flex-col items-center">
            <FngGauge score={fng?.score} />
            <div className="text-4xl font-bold font-mono" style={{ color: sentColor(fng?.score) }}>{fng?.score != null ? Math.round(fng.score) : '-'}</div>
            <div className="text-lg capitalize" style={{ color: sentColor(fng?.score) }}>{fng?.rating || ''}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {comps.map((c) => (
              <div key={c.label} className="stat">
                <div className="stat-label">{c.label}</div>
                <div className="stat-value text-base" style={{ color: sentColor(c.pt?.y) }}>{c.pt?.y != null ? Math.round(c.pt.y) : '-'}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="30-Day History">
          {chart30.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chart30}>
                <ReferenceArea y1={0} y2={25} fill="var(--positive)" fillOpacity={0.08} />
                <ReferenceArea y1={25} y2={45} fill="var(--accent)" fillOpacity={0.08} />
                <ReferenceArea y1={45} y2={55} fill="var(--accent-gold)" fillOpacity={0.08} />
                <ReferenceArea y1={55} y2={75} fill="var(--accent-gold)" fillOpacity={0.14} />
                <ReferenceArea y1={75} y2={100} fill="var(--negative)" fillOpacity={0.08} />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border)' }} minTickGap={30} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border)' }} width={28} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Line type="monotone" dataKey="score" stroke="var(--text-primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-[var(--text-muted)]">No history</p>}
        </Card>
      </div>

      <Card title="Global Markets">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {indices.map((idx) => (
            <div key={idx.symbol} className="stat">
              {/* The name wraps rather than truncating. In a two-column phone
                  grid "Shanghai Composite (China)" was being cut to
                  "Shanghai Composi…", which identifies nothing — and the
                  country in brackets is the part that disambiguates. */}
              <div className="flex items-start gap-1.5">
                <span className="badge shrink-0 mt-0.5">{MARKET_CODE[idx.symbol] || 'GL'}</span>
                <span className="text-xs text-[var(--text-secondary)] leading-snug">{idx.name}</span>
              </div>
              <div className="stat-value mt-1.5">{idx.price != null ? formatNumber(idx.price, 2) : '-'}</div>
              <div className="text-sm font-mono font-semibold" style={{ color: getChangeCSSVar(idx.change_percent ?? 0) }}>{idx.change_percent != null ? formatPercent(idx.change_percent) : '-'}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ── US tab ──────────────────────────────────────────────────────────────────
function USTab() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { macroAPI.getUS().then((r) => { if (r?.error) toast.error('Failed to load US macro data - check API connection'); setData(r?.error ? null : r); setLoading(false) }) }, [])
  if (loading) return <LoadingSpinner label="Loading US macro…" />
  if (!data) return <p className="text-sm text-[var(--text-muted)]">Macro data unavailable</p>

  const yc = data.yield_curve || {}
  const ff = last(data.fed_funds_rate)?.value
  const unemp = last(data.unemployment)?.value
  const spreadBps = yc.spread_2_10 != null ? (yc.spread_2_10 * 100).toFixed(0) : null

  const assessment = yc.inverted ? 'flashes a classic late-cycle warning sign'
    : (yc.spread_2_10 != null && yc.spread_2_10 < 0.5) ? 'is cautious but not yet alarming'
    : 'is broadly supportive of risk assets'
  const implication = yc.inverted
    ? 'Favour quality balance sheets and defensives (utilities, staples, healthcare) over high-beta growth.'
    : 'Cyclicals and growth can outperform, though rate-sensitive sectors warrant monitoring.'
  const summary = `With the Fed Funds Rate at ${ff != null ? ff.toFixed(2) : '-'}%, a ${(yc.spread_label || 'normal').toLowerCase()} yield curve (2Y–10Y spread: ${spreadBps ?? '-'}bps), and unemployment at ${unemp != null ? unemp.toFixed(1) : '-'}%, the macro backdrop for US equities ${assessment}. ${implication}`

  return (
    <div className="space-y-4">
      <Card title="Yield Curve">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[['2Y', yc['2y']], ['5Y', yc['5y']], ['10Y', yc['10y']], ['30Y', yc['30y']]].map(([k, v]) => (
            <div key={k} className="rounded-lg p-3" style={{ background: 'var(--bg-input)' }}>
              <div className="stat-label">{k}</div>
              <div className="text-xl font-mono font-semibold" style={{ color: 'var(--accent-gold)' }}>{v != null ? `${formatNumber(v, 2)}%` : '-'}</div>
            </div>
          ))}
          <div className="stat">
            <div className="stat-label">2Y–10Y Spread</div>
            <div className="text-xl font-mono font-semibold" style={{ color: yc.inverted ? 'var(--negative)' : 'var(--positive)' }}>{spreadBps != null ? `${spreadBps}bps` : '-'}</div>
          </div>
        </div>
        {yc.inverted && (
          <div className="mt-3 flex items-start gap-2 rounded-control px-3 py-2.5 text-sm" style={{ background: 'color-mix(in srgb, var(--negative) 10%, transparent)', border: '1px solid var(--negative)', color: 'var(--negative)' }}>
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <span>Inverted yield curve - historically precedes recession by 12–24 months.</span>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Fed Funds Rate">
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mb-1">{ff != null ? `${ff.toFixed(2)}%` : '-'}</div>
          <SeriesChart data={data.fed_funds_rate} color="var(--accent)" step />
        </Card>
        <Card title="CPI (Consumer Price Index)"><SeriesChart data={data.cpi} color="var(--accent-gold)" /></Card>
        <Card title="Unemployment Rate"><SeriesChart data={data.unemployment} color="var(--accent-green)" /></Card>
        <Card title="GDP (quarterly)"><SeriesChart data={data.gdp} color="var(--accent)" type="bar" /></Card>
      </div>

      <Card title="Macro Summary">
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{summary}</p>
      </Card>
    </div>
  )
}

// ── Australia tab ───────────────────────────────────────────────────────────
const ASX_DRIVERS = [
  ['Iron ore price', 'Resources', 'BHP, RIO, FMG, S32'],
  ['RBA cash rate', 'Banks (NIM), REITs', 'CBA, WBC, NAB, ANZ'],
  ['AUD/USD', 'All exporters', 'BHP, RIO, CSL, WDS'],
  ['China PMI', 'Materials, Energy', 'BHP, RIO, MIN'],
  ['US Fed policy', 'Growth tech', 'XRO, APX, WTC'],
  ['Housing market', 'Banks, construction', 'CBA, WBC'],
]
const SOURCES = [
  ['ABS', 'https://www.abs.gov.au'], ['RBA', 'https://www.rba.gov.au'],
  ['ASX', 'https://www.asx.com.au'], ['Trading Economics', 'https://tradingeconomics.com/australia'],
]

function AustraliaTab() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { sentimentAPI.getAustralia().then((r) => { if (r?.error) toast.error('Failed to load Australia macro data - check API connection'); setData(r?.error ? null : r); setLoading(false) }) }, [])
  if (loading) return <LoadingSpinner label="Loading AU macro…" />

  const rba = data?.rba_cash_rate?.rate
  const audusd = data?.aud_usd?.result ?? data?.aud_usd?.info?.rate ?? data?.exchange_rates?.rates?.USD

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="RBA Cash Rate">
          <div className="text-3xl font-bold font-mono" style={{ color: 'var(--accent)' }}>{rba != null ? `${formatNumber(rba, 2)}%` : '-'}</div>
          <p className="text-sm text-[var(--text-secondary)] mt-2">The cash rate is the RBA's primary monetary-policy lever, set monthly. It anchors mortgage rates, bank net interest margins, and the AUD.</p>
          <a href="https://www.rba.gov.au/statistics/cash-rate/" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent)] mt-2 inline-block">View at rba.gov.au →</a>
        </Card>
        <Card title="AUD / USD">
          <div className="text-3xl font-bold font-mono text-[var(--text-primary)]">{audusd != null ? formatNumber(audusd, 4) : '-'}</div>
          <p className="text-sm text-[var(--text-secondary)] mt-2">Driven by commodity prices, RBA–Fed rate differentials, and China demand.</p>
          <div className="mt-3 space-y-1 text-sm">
            <div className="text-[var(--text-secondary)]"><span style={{ color: 'var(--positive)' }}>▼ Lower AUD</span> benefits: BHP, RIO, FMG, CSL, WES (exporters)</div>
            <div className="text-[var(--text-secondary)]"><span style={{ color: 'var(--accent)' }}>▲ Higher AUD</span> benefits: importers, retailers</div>
          </div>
        </Card>
      </div>

      <Card title="ASX Macro Drivers">
        <div className="overflow-x-auto">
          <table className="data-table" style={{ minWidth: 420 }}>
            <thead><tr className="text-[var(--text-muted)] text-xs">
              <th className="text-left font-normal py-1">Indicator</th><th className="text-left font-normal py-1">Affected Sector</th><th className="text-left font-normal py-1">Key Stocks</th>
            </tr></thead>
            <tbody>
              {ASX_DRIVERS.map(([ind, sec, stocks]) => (
                <tr key={ind} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-2 text-[var(--text-primary)]">{ind}</td>
                  <td className="py-2 text-[var(--text-secondary)]">{sec}</td>
                  <td className="py-2 font-mono text-[var(--accent)]">{stocks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Data Sources">
        <div className="flex flex-wrap gap-2">
          {SOURCES.map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="chip" style={{ color: 'var(--accent)' }}>{name} →</a>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default function Sentiment() {
  const [tab, setTab] = useState('Global Overview')
  return (
    <div className="page">
      <div className="page-head"><h1 className="page-title">Market Sentiment</h1></div>
      <div className="tabs mb-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={tab === t ? 'is-active' : undefined}>{t}</button>
        ))}
      </div>
      {tab === 'Global Overview' && <GlobalTab />}
      {tab === 'United States' && <USTab />}
      {tab === 'Australia' && <AustraliaTab />}
    </div>
  )
}
