import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Palette, SlidersHorizontal, RefreshCw, Bot, Lock, Globe, Info, AlertTriangle, Server, Check,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { settingsAPI, healthAPI } from '../utils/api'
import { getApiBase, setApiBase, clearApiBase, defaultApiBase, isNative } from '../utils/apiBase'
import useStore from '../store/useStore'
import { TIME_ZONES, TIME_ZONE_GROUPS, zoneAbbreviation, formatTimeIn } from '../utils/timezone'
import {
  THEMES, THEME_NAMES, THEME_ORDER, DEFAULT_THEME, DEFAULT_LIGHT_THEME,
} from '../themes'
import DensityToggle from '../components/common/DensityToggle'

const DEFAULT_SETTINGS = {
  defaultMarket: 'us', defaultCurrency: 'USD', passcode: '2024', showChangeAsPercent: true,
  compactNumbers: true, autoRefreshInterval: 60, decimalPlaces: 2, showVolume: true, showBeta: true,
  showDividendYield: true, newsSource: 'all', chartType: 'area', chartPeriodDefault: '1y',
  showTechnicalOverlays: true, guruResponseStyle: 'detailed', guruMarket: 'both', followSystemTheme: false,
}

const NAV = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'display', label: 'Display Preferences', icon: SlidersHorizontal },
  { id: 'data', label: 'Data & Refresh', icon: RefreshCw },
  { id: 'guru', label: 'Guru AI', icon: Bot },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'server', label: 'Server Connection', icon: Server },
  { id: 'api', label: 'API Status', icon: Globe },
  { id: 'about', label: 'About', icon: Info },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
]

// Derived from themes.js rather than duplicated, so a palette change here can
// never drift out of sync with the palette actually applied. Swatches preview
// the page background, a card surface, and the accent.
const THEME_CARDS = THEME_ORDER.filter((key) => THEMES[key]).map((key) => ({
  key,
  name: THEME_NAMES[key].label,
  desc: THEME_NAMES[key].description,
  swatches: [THEMES[key].bg, THEMES[key].bgCard, THEMES[key].accent],
}))

const API_ROWS = [
  ['FMP', 'Financials, DCF, Screener', 'Paid'],
  ['Finnhub', 'Quotes, news, recommendations', 'Free'],
  ['Alpha Vantage', 'Technical indicators', '25/day'],
  ['FRED', 'US macro data', 'Free (Federal Reserve)'],
  ['ABS', 'Australian macro', 'Free (Government)'],
  ['yFinance', 'Price history, ASX', 'Free (no key)'],
  ['CNN F&G', 'Fear & Greed Index', 'Free (public)'],
  ['Exchange Rates', 'Currency conversion', 'Paid'],
]
const API_KEY_MAP = { 'FMP': 'FMP', 'Finnhub': 'Finnhub', 'Alpha Vantage': 'Alpha Vantage', 'FRED': 'FRED', 'ABS': 'ABS', 'yFinance': 'yFinance', 'CNN F&G': 'CNN', 'Exchange Rates': 'Exchange Rates' }

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-20 mb-8">
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">{title}</h2>
      {children}
    </section>
  )
}
function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} className="relative w-10 h-6 rounded-full transition-colors"
            style={{ background: checked ? 'var(--accent)' : 'var(--border)' }}>
      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: checked ? 18 : 2 }} />
    </button>
  )
}
function Row({ label, children }) {
  return <div className="flex items-center justify-between py-2"><span className="text-sm text-[var(--text-secondary)]">{label}</span>{children}</div>
}
const sel = { background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }

export default function Settings() {
  const navigate = useNavigate()
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)
  const activeTheme = useStore((s) => s.activeTheme)
  const setActiveTheme = useStore((s) => s.setActiveTheme)
  const setAuthenticated = useStore((s) => s.setAuthenticated)
  const guruHistory = useStore((s) => s.guruHistory)
  const clearGuruHistory = useStore((s) => s.clearGuruHistory)
  const resetProgress = useStore((s) => s.resetProgress)
  const setWatchlist = useStore((s) => s.setWatchlist)

  const [hasKey, setHasKey] = useState(null)
  const [apiStatus, setApiStatus] = useState(null)
  const [apiChecking, setApiChecking] = useState(false)
  const [apiCheckedAt, setApiCheckedAt] = useState(null)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState(null)

  // A live clock under the timezone picker, so the effect of the choice is
  // visible at the moment it is made rather than only on the dashboard.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const clockPreview = formatTimeIn(now, settings.timezone, { seconds: true })

  useEffect(() => { healthAPI.get().then((r) => setHasKey(!!(r?.has_ai_key ?? r?.has_anthropic_key))) }, [])

  // Follow-OS preference watcher.
  useEffect(() => {
    if (!settings.followSystemTheme) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => setActiveTheme(mq.matches ? DEFAULT_THEME : DEFAULT_LIGHT_THEME)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [settings.followSystemTheme, setActiveTheme])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const checkApis = async () => {
    setApiChecking(true)
    const res = await settingsAPI.checkAPIStatus()
    setApiStatus(res?.error ? null : res)
    setApiCheckedAt(new Date())
    setApiChecking(false)
  }

  const updatePasscode = async () => {
    setPwMsg(null)
    if (pw.next.length < 4 || pw.next.length > 8) return setPwMsg({ ok: false, t: 'New passcode must be 4–8 characters' })
    if (pw.next !== pw.confirm) return setPwMsg({ ok: false, t: 'New passcodes do not match' })
    const res = await settingsAPI.updatePasscode(pw.current, pw.next)
    if (res?.success) { setPwMsg({ ok: true, t: 'Passcode updated' }); setPw({ current: '', next: '', confirm: '' }) }
    else setPwMsg({ ok: false, t: res?.status === 401 ? 'Current passcode is incorrect' : 'Update failed' })
  }

  const logout = () => { setAuthenticated(false); navigate('/') }

  const badge = (st) => {
    const map = { ok: ['● OK', 'var(--positive)'], rate_limited: ['● Rate limited', 'var(--accent-gold)'], error: ['● Error', 'var(--negative)'] }
    const [label, color] = map[st] || ['- Not Checked', 'var(--text-muted)']
    return <span className="text-xs px-2 py-0.5 rounded" style={{ color, background: 'var(--bg-input)' }}>{label}</span>
  }

  return (
    <div className="page">
      <div className="page-head"><h1 className="page-title">Settings</h1></div>
      {/* Phone: the sidebar has nowhere to live, so the same jump links become
          a chip row. It wraps rather than scrolling sideways — with nine
          sections, a scroller hid four of them behind a gesture nothing on
          screen advertised. */}
      <div className="lg:hidden flex flex-wrap gap-1.5 mb-4">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => scrollTo(id)} className="chip">
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* LEFT NAV */}
        <nav className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-20 space-y-1">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => scrollTo(id)} className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-card)]">
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        </nav>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          {/* APPEARANCE */}
          <Section id="appearance" title="Appearance & Themes">
            {/* Five themes fit as proper preview tiles. Each swatch block is a
                miniature of the real page: background, card, accent bar — so
                you can tell them apart without applying each one. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEME_CARDS.map((t) => {
                const selected = activeTheme === t.key
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTheme(t.key)}
                    aria-pressed={selected}
                    className="card flex items-center gap-3 text-left transition"
                    style={{
                      padding: 12,
                      borderColor: selected ? 'var(--accent)' : 'var(--border)',
                      boxShadow: selected ? '0 0 0 3px var(--accent-soft)' : 'none',
                    }}
                  >
                    <span
                      className="flex shrink-0 flex-col justify-between overflow-hidden rounded-lg p-1.5"
                      style={{ width: 52, height: 40, background: t.swatches[0], border: '1px solid var(--border)' }}
                    >
                      <span className="block h-2.5 rounded-sm" style={{ background: t.swatches[1] }} />
                      <span className="block h-1.5 w-2/3 rounded-sm" style={{ background: t.swatches[2] }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[var(--text-primary)]">{t.name}</span>
                      <span className="block text-xs text-[var(--text-muted)]">{t.desc}</span>
                    </span>
                    {selected && (
                      <span className="flex shrink-0 items-center justify-center rounded-full"
                            style={{ width: 20, height: 20, background: 'var(--accent)', color: 'var(--accent-contrast)' }}>
                        <Check size={13} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="card mt-3">
              <Row label="Follow OS dark/light preference"><Toggle checked={settings.followSystemTheme} onChange={(v) => updateSettings({ followSystemTheme: v })} /></Row>
              <Row label="Table row density"><DensityToggle showLabels /></Row>
            </div>
          </Section>

          {/* DISPLAY */}
          <Section id="display" title="Display Preferences">
            <div className="card divide-y" style={{ borderColor: 'var(--border)' }}>
              <Row label="Default Market">
                <select value={settings.defaultMarket} onChange={(e) => updateSettings({ defaultMarket: e.target.value })} className="rounded-lg px-2 py-1 text-sm" style={sel}><option value="us">US</option><option value="asx">ASX</option></select>
              </Row>
              {/* Every clock in the app reads from this — market open/closed,
                  news timestamps, the dashboard date line. See
                  utils/timezone.js for why it is an app preference rather
                  than just the device's zone. */}
              <Row label="Timezone">
                <div className="text-right">
                  <select
                    value={settings.timezone || 'auto'}
                    onChange={(e) => updateSettings({ timezone: e.target.value })}
                    className="rounded-lg px-2 py-1 text-sm max-w-[13rem]"
                    style={sel}
                  >
                    {TIME_ZONE_GROUPS.map((group) => {
                      const zones = TIME_ZONES.filter((z) => z.group === group)
                      if (!zones.length) return null
                      return (
                        <optgroup key={group} label={group}>
                          {zones.map((z) => <option key={z.value} value={z.value}>{z.label}</option>)}
                        </optgroup>
                      )
                    })}
                  </select>
                  <div className="text-2xs text-[var(--text-muted)] mt-1 font-mono">
                    {clockPreview} {zoneAbbreviation(settings.timezone)}
                  </div>
                </div>
              </Row>
              <Row label="Currency Display">
                <select value={settings.defaultCurrency} onChange={(e) => updateSettings({ defaultCurrency: e.target.value })} className="rounded-lg px-2 py-1 text-sm" style={sel}><option value="USD">USD</option><option value="AUD">AUD</option><option value="BOTH">Both</option></select>
              </Row>
              <Row label="Compact Numbers"><Toggle checked={settings.compactNumbers} onChange={(v) => updateSettings({ compactNumbers: v })} /></Row>
              <Row label="Decimal Places">
                <select value={settings.decimalPlaces} onChange={(e) => updateSettings({ decimalPlaces: Number(e.target.value) })} className="rounded-lg px-2 py-1 text-sm" style={sel}>{[0, 1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}</select>
              </Row>
              <Row label="Change Display"><Toggle checked={settings.showChangeAsPercent} onChange={(v) => updateSettings({ showChangeAsPercent: v })} /></Row>
              <Row label="Default Chart Type">
                <select value={settings.chartType} onChange={(e) => updateSettings({ chartType: e.target.value })} className="rounded-lg px-2 py-1 text-sm" style={sel}><option value="area">Area</option><option value="line">Line</option><option value="candlestick">Candlestick</option></select>
              </Row>
              <Row label="Default Chart Period">
                <select value={settings.chartPeriodDefault} onChange={(e) => updateSettings({ chartPeriodDefault: e.target.value })} className="rounded-lg px-2 py-1 text-sm" style={sel}>{['1mo', '3mo', '6mo', '1y', '2y', '5y'].map((p) => <option key={p} value={p}>{p}</option>)}</select>
              </Row>
              <Row label="Technical Overlays"><Toggle checked={settings.showTechnicalOverlays} onChange={(v) => updateSettings({ showTechnicalOverlays: v })} /></Row>
              <Row label="Show Volume"><Toggle checked={settings.showVolume} onChange={(v) => updateSettings({ showVolume: v })} /></Row>
              <Row label="Show Beta"><Toggle checked={settings.showBeta} onChange={(v) => updateSettings({ showBeta: v })} /></Row>
              <Row label="Show Dividend Yield"><Toggle checked={settings.showDividendYield} onChange={(v) => updateSettings({ showDividendYield: v })} /></Row>
            </div>
          </Section>

          {/* DATA */}
          <Section id="data" title="Data & Refresh">
            <div className="card divide-y" style={{ borderColor: 'var(--border)' }}>
              <Row label="Auto-Refresh">
                <select value={settings.autoRefreshInterval} onChange={(e) => updateSettings({ autoRefreshInterval: Number(e.target.value) })} className="rounded-lg px-2 py-1 text-sm" style={sel}>
                  <option value={0}>Disabled</option><option value={30}>30s</option><option value={60}>1 min</option><option value={120}>2 min</option><option value={300}>5 min</option><option value={600}>10 min</option>
                </select>
              </Row>
              <Row label="News Source">
                <select value={settings.newsSource} onChange={(e) => updateSettings({ newsSource: e.target.value })} className="rounded-lg px-2 py-1 text-sm" style={sel}><option value="all">All</option><option value="fmp">FMP</option><option value="finnhub">Finnhub</option></select>
              </Row>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">More frequent refresh = more API calls.</p>
            <div className="card mt-3 text-xs text-[var(--text-secondary)]">
              <div className="font-semibold text-[var(--text-primary)] mb-1">Caching</div>
              Prices cache 60s · Financials 1h · News 10min · Macro 30min. <span className="text-[var(--accent-gold)]">Alpha Vantage free tier is limited to 25 requests/day</span> - it's used as a fallback and cached aggressively.
            </div>
          </Section>

          {/* GURU */}
          <Section id="guru" title="Guru AI">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              {[['brief', 'Brief', '200–300 words. Decisive calls.'], ['detailed', 'Detailed', '500–800 words. Full analysis.'], ['institutional', 'Institutional', '1000+ words. Memo format.']].map(([key, name, desc]) => (
                <button key={key} onClick={() => updateSettings({ guruResponseStyle: key })} className="card text-left" style={{ borderColor: settings.guruResponseStyle === key ? 'var(--accent)' : 'var(--border)' }}>
                  <div className="font-semibold text-[var(--text-primary)]">{name}</div><div className="text-xs text-[var(--text-muted)] mt-1">{desc}</div>
                </button>
              ))}
            </div>
            <div className="card divide-y" style={{ borderColor: 'var(--border)' }}>
              <Row label="Default Guru Market">
                <select value={settings.guruMarket} onChange={(e) => updateSettings({ guruMarket: e.target.value })} className="rounded-lg px-2 py-1 text-sm" style={sel}><option value="us">US</option><option value="asx">ASX</option><option value="both">Both</option></select>
              </Row>
              <Row label={`${guruHistory.length} messages in current history`}>
                <button onClick={() => { if (window.confirm('Clear Guru history?')) clearGuruHistory() }} className="text-sm px-3 py-1 rounded-lg" style={{ background: 'var(--bg-input)', color: 'var(--negative)' }}>Clear History</button>
              </Row>
            </div>
            <div className="card mt-3" style={{ background: hasKey ? 'color-mix(in srgb, var(--positive) 8%, var(--bg-card))' : 'color-mix(in srgb, var(--negative) 8%, var(--bg-card))', borderColor: hasKey ? 'var(--positive)' : 'var(--negative)' }}>
              {hasKey ? <div className="text-sm font-semibold" style={{ color: 'var(--positive)' }}>Guru is active and ready</div> : (
                <>
                  <div className="text-sm font-semibold mb-2" style={{ color: 'var(--negative)' }}>AI key not configured (Groq/Gemini free)</div>
                  <ol className="text-xs text-[var(--text-secondary)] space-y-1 list-decimal list-inside">
                    <li>Get key at <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)]">console.groq.com</a></li>
                    <li>Add to .env: <code className="font-mono">GROQ_API_KEY=...</code></li>
                    <li>Restart backend</li>
                  </ol>
                </>
              )}
            </div>
          </Section>

          {/* SECURITY */}
          <Section id="security" title="Security">
            <div className="card max-w-md">
              <div className="font-semibold text-[var(--text-primary)] mb-3">Change Passcode</div>
              {['current', 'next', 'confirm'].map((f, i) => (
                <input key={f} type="password" placeholder={['Current Passcode', 'New Passcode (4–8)', 'Confirm New Passcode'][i]}
                       value={pw[f]} onChange={(e) => setPw({ ...pw, [f]: e.target.value })}
                       className="w-full rounded-lg px-3 py-2 text-sm outline-none mb-2" style={sel} />
              ))}
              <button onClick={updatePasscode} className="w-full rounded-lg py-2 text-sm font-semibold" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>Update Passcode</button>
              {pwMsg && <div className="text-sm mt-2" style={{ color: pwMsg.ok ? 'var(--positive)' : 'var(--negative)' }}>{pwMsg.t}</div>}
            </div>
            <button onClick={logout} className="mt-3 px-4 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--negative)' }}>Log Out</button>
            <div className="card mt-3 text-xs text-[var(--text-secondary)]">FinSight runs entirely on your local machine. No personal data is stored remotely. Your passcode is stored locally and never transmitted to any third-party server.</div>
          </Section>

          {/* SERVER */}
          <Section id="server" title="Server Connection">
            <ServerSettings />
          </Section>

          {/* API STATUS */}
          <Section id="api" title="API Status">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={checkApis} disabled={apiChecking} className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>{apiChecking ? 'Checking…' : 'Check All APIs'}</button>
              {apiCheckedAt && <span className="text-xs text-[var(--text-muted)]">Last checked {apiCheckedAt.toLocaleTimeString()}</span>}
            </div>
            <div className="card">
              <div className="table-scroll">
              <table className="data-table table-tight" style={{ minWidth: 560 }}>
                <thead><tr className="text-[var(--text-muted)] text-xs">{['API', 'Description', 'Status', 'Latency', 'Tier'].map((h) => <th key={h} className="text-left font-normal py-2">{h}</th>)}</tr></thead>
                <tbody>
                  {API_ROWS.map(([name, desc, tier]) => {
                    const s = apiStatus?.[API_KEY_MAP[name]]
                    return (
                      <tr key={name} className="border-t" style={{ borderColor: 'var(--border)' }}>
                        <td className="py-2 font-medium text-[var(--text-primary)]">{name}</td>
                        <td className="py-2 text-[var(--text-secondary)]">{desc}</td>
                        <td className="py-2">{badge(s?.status)}</td>
                        <td className="py-2 font-mono text-[var(--text-secondary)]">{s?.latency_ms != null ? `${s.latency_ms}ms` : '-'}</td>
                        <td className="py-2 text-[var(--text-muted)] text-xs">{tier}</td>
                      </tr>
                    )
                  })}
                  <tr className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-2 font-medium text-[var(--text-primary)]">Anthropic</td>
                    <td className="py-2 text-[var(--text-secondary)]">Guru AI engine</td>
                    <td className="py-2">{hasKey ? badge('ok') : badge()}</td>
                    <td className="py-2 font-mono text-[var(--text-muted)]">-</td>
                    <td className="py-2 text-[var(--text-muted)] text-xs">Pay per use</td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>
          </Section>

          {/* ABOUT */}
          <Section id="about" title="About">
            <div className="card mb-3">
              <div className="text-lg font-bold text-[var(--text-primary)]">FinSight v1.0.0</div>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Institutional-grade market intelligence for ASX &amp; US markets.</p>
              <div className="text-xs text-[var(--text-muted)] mt-3"><span className="font-semibold text-[var(--text-secondary)]">Stack:</span> React · Vite · Tailwind · FastAPI · lightweight-charts · Recharts · Zustand</div>
              <div className="text-xs text-[var(--text-muted)] mt-1"><span className="font-semibold text-[var(--text-secondary)]">Data:</span> FMP · Finnhub · Alpha Vantage · FRED · ABS · yFinance · CNN · Exchange Rates · Anthropic</div>
            </div>
            <div className="card mb-3">
              <div className="font-semibold text-[var(--text-primary)] mb-2">Keyboard Shortcuts</div>
              <div className="grid grid-cols-2 gap-1 text-xs text-[var(--text-secondary)]">
                <div><kbd>/</kbd> or <kbd>Ctrl+K</kbd> - Focus search</div><div><kbd>Esc</kbd> - Close dropdowns</div>
                <div><kbd>G</kbd> Guru · <kbd>D</kbd> Dashboard</div><div><kbd>S</kbd> Screener · <kbd>W</kbd> Watchlist</div>
                <div><kbd>L</kbd> Learning · <kbd>,</kbd> Settings</div>
              </div>
            </div>
            <div className="card" style={{ borderColor: 'var(--accent-gold)' }}>
              <div className="flex items-center gap-2 text-sm font-semibold mb-1.5" style={{ color: 'var(--accent-gold)' }}><AlertTriangle size={15} /> Disclaimer</div>
              <p className="text-xs text-[var(--text-secondary)]">FinSight is for informational and educational purposes only and does not constitute financial advice. Data may be delayed or inaccurate. Always do your own due diligence and consult a licensed financial adviser before making investment decisions.</p>
            </div>
          </Section>

          {/* DANGER ZONE */}
          <Section id="danger" title="Danger Zone">
            <div className="card" style={{ borderColor: 'var(--negative)' }}>
              <DangerAction label="Clear Watchlist" onConfirm={() => { setWatchlist([]); toast.success('Watchlist cleared') }} />
              <DangerAction label="Reset Learning Progress" onConfirm={() => { resetProgress(); toast.success('Progress reset') }} />
              <DangerAction label="Clear Guru History" onConfirm={() => { clearGuruHistory(); toast.success('Guru history cleared') }} />
              <DangerAction label="Reset All Settings" onConfirm={() => { updateSettings(DEFAULT_SETTINGS); toast.success('Settings reset to defaults') }} />
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

// Which backend the app talks to. Only really matters on iPhone: the native
// build defaults to the deployed Render backend, but this can be pointed at
// the Mac's LAN IP instead for faster local testing (no cold start).
function ServerSettings() {
  const [url, setUrl] = useState(getApiBase())
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState(null)
  const native = isNative()

  const test = async (target) => {
    setTesting(true)
    setResult(null)
    const base = (target || url).trim().replace(/\/+$/, '')
    const started = performance.now()
    try {
      const res = await fetch(`${base}/health`, { signal: AbortSignal.timeout(6000) })
      const body = await res.json()
      setResult(
        res.ok && body?.status === 'healthy'
          ? { ok: true, text: `Connected · v${body.version} · ${Math.round(performance.now() - started)}ms` }
          : { ok: false, text: `Reachable but unhealthy (HTTP ${res.status})` }
      )
    } catch (err) {
      setResult({ ok: false, text: err?.name === 'TimeoutError' ? 'Timed out - is the backend running?' : String(err.message || err) })
    }
    setTesting(false)
  }

  const save = () => {
    const saved = setApiBase(url)
    setUrl(saved)
    toast.success('Server URL saved')
    test(saved)
  }

  const reset = () => {
    const saved = clearApiBase()
    setUrl(saved)
    setResult(null)
    toast.success('Reset to default')
  }

  return (
    <>
      <div className="card space-y-3">
        <Row label="Backend URL">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://192.168.0.10:8000"
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            inputMode="url"
            className="rounded-lg px-3 py-1.5 text-sm outline-none w-full sm:w-80 font-mono"
            style={sel}
          />
        </Row>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={save} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>Save</button>
          <button onClick={() => test()} disabled={testing} className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>{testing ? 'Testing…' : 'Test connection'}</button>
          <button onClick={reset} className="px-4 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>Reset to default</button>
          {result && (
            <span className="text-sm" style={{ color: result.ok ? 'var(--positive)' : 'var(--negative)' }}>{result.text}</span>
          )}
        </div>
      </div>
      <div className="card mt-3 text-xs text-[var(--text-secondary)] space-y-1">
        <div>Current: <span className="font-mono text-[var(--text-primary)]">{getApiBase()}</span> · default for this build: <span className="font-mono">{defaultApiBase()}</span></div>
        <div>
          {native
            ? 'Defaults to the deployed backend, so the app works anywhere with signal. It sleeps after 15 minutes idle and can take up to a minute to wake on the next request - that’s normal, not a fault. To skip the wake delay when you’re on the same Wi-Fi as your Mac, you can point this at the Mac’s LAN address instead (e.g. http://10.0.0.5:8000) - but the Mac must be running FinSight’s backend for that to work.'
            : 'Running in a browser on the same machine as the backend, so the default localhost address is correct. This field exists for the iPhone build.'}
        </div>
      </div>
    </>
  )
}

function DangerAction({ label, onConfirm }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  return (
    <div className="py-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        {!open && <button onClick={() => setOpen(true)} className="text-sm px-3 py-1 rounded-lg" style={{ background: 'var(--bg-input)', color: 'var(--negative)' }}>{label}</button>}
      </div>
      {open && (
        <div className="mt-2 flex items-center gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder='Type "CONFIRM"' className="flex-1 rounded-lg px-3 py-1.5 text-sm outline-none" style={sel} />
          <button disabled={text !== 'CONFIRM'} onClick={() => { onConfirm(); setOpen(false); setText('') }} className="text-sm px-3 py-1.5 rounded-lg disabled:opacity-40" style={{ background: 'var(--negative)', color: 'var(--accent-contrast)' }}>Confirm</button>
          <button onClick={() => { setOpen(false); setText('') }} className="text-sm px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>Cancel</button>
        </div>
      )}
    </div>
  )
}
