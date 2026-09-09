import { useState, useEffect, useRef } from 'react'
import { Send, Copy, Save, ThumbsUp, ThumbsDown, Trash2, X, Bookmark, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { guruAPI, healthAPI, settingsAPI } from '../utils/api'
import useStore from '../store/useStore'

const SUGGESTED = [
  'Give me 2 tech stock picks with full fundamental and technical analysis',
  'What is the current US market sentiment and which sectors should I be positioning in right now?',
  'Analyse AAPL - complete fundamental, valuation and technical breakdown, give me a buy/sell/hold',
  'Give me 2 high-yield ASX dividend picks with franking credits context and sustainability analysis',
  'What are the key macro risks for Australian equities right now and how should I position?',
  'Compare NVDA vs AMD - full analysis, which is the better buy today and why?',
]

const STYLES = ['Brief', 'Detailed', 'Institutional']

// ── lightweight markdown renderer ───────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return null
  const lines = text.split('\n')
  const out = []
  let list = []
  const flush = (key) => {
    if (list.length) { out.push(<ul key={`ul${key}`} className="my-2 space-y-1">{list}</ul>); list = [] }
  }
  const inline = (s) => {
    const parts = s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    return parts.map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} className="font-semibold text-[var(--text-primary)]">{p.slice(2, -2)}</strong>
      if (p.startsWith('`') && p.endsWith('`')) return <code key={i} className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-input)' }}>{p.slice(1, -1)}</code>
      return <span key={i}>{p}</span>
    })
  }
  lines.forEach((line, i) => {
    const t = line.trim()
    if (t === '---') { flush(i); out.push(<hr key={i} className="my-3" style={{ borderColor: 'var(--border)' }} />) }
    else if (t.startsWith('## ')) { flush(i); out.push(<h3 key={i} className="text-base font-bold mt-4 mb-2 pb-1 text-[var(--text-primary)]" style={{ borderBottom: '1px solid var(--border)' }}>{inline(t.slice(3))}</h3>) }
    else if (/^\d+\.\s/.test(t)) { list.push(<li key={i} className="flex gap-2"><span className="font-mono font-semibold" style={{ color: 'var(--accent)' }}>{t.match(/^(\d+)\./)[1]}.</span><span className="text-[var(--text-secondary)]">{inline(t.replace(/^\d+\.\s/, ''))}</span></li>) }
    else if (t.startsWith('- ') || t.startsWith('* ')) { list.push(<li key={i} className="flex gap-2"><span style={{ color: 'var(--accent)' }}>•</span><span className="text-[var(--text-secondary)]">{inline(t.slice(2))}</span></li>) }
    else if (t === '') { flush(i) }
    else { flush(i); out.push(<p key={i} className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">{inline(t)}</p>) }
  })
  flush('end')
  return out
}

const OFFLINE_TEXT = `Guru requires an Anthropic API key to activate.

To enable Guru:
1. Get your API key at console.anthropic.com
2. Open the .env file in your project root
3. Set ANTHROPIC_API_KEY=your-actual-key
4. Restart the backend: python main.py

Once configured, Guru will have access to live market data from 8 integrated APIs and deliver institutional-grade analysis for ASX and US markets.

All other FinSight features (data, screener, watchlist, valuation lab, learning) work fully without the Guru key.`

export default function Guru() {
  const activeMarket = useStore((s) => s.activeMarket)
  const setActiveMarket = useStore((s) => s.setActiveMarket)
  const guruHistory = useStore((s) => s.guruHistory)
  const addGuruMessage = useStore((s) => s.addGuruMessage)
  const clearGuruHistory = useStore((s) => s.clearGuruHistory)
  const guruIsTyping = useStore((s) => s.guruIsTyping)
  const setGuruTyping = useStore((s) => s.setGuruTyping)
  const savedAnalyses = useStore((s) => s.savedAnalyses)
  const saveAnalysis = useStore((s) => s.saveAnalysis)
  const deleteAnalysis = useStore((s) => s.deleteAnalysis)
  const settings = useStore((s) => s.settings)

  const [hasKey, setHasKey] = useState(null)
  const [input, setInput] = useState('')
  const [style, setStyle] = useState(settings.guruResponseStyle ? settings.guruResponseStyle[0].toUpperCase() + settings.guruResponseStyle.slice(1) : 'Detailed')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const endRef = useRef(null)
  const taRef = useRef(null)

  useEffect(() => { healthAPI.get().then((r) => setHasKey(!!r?.has_anthropic_key)) }, [])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [guruHistory, guruIsTyping])

  const online = hasKey === true

  const send = async (text) => {
    const msg = (text ?? input).trim()
    if (!msg || guruIsTyping) return
    setInput('')
    if (taRef.current) taRef.current.style.height = 'auto'
    addGuruMessage({ role: 'user', content: msg, timestamp: Date.now() })

    if (!online) {
      addGuruMessage({ role: 'guru', offline: true, content: OFFLINE_TEXT, timestamp: Date.now() })
      return
    }

    setGuruTyping(true)
    const history = guruHistory.map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
    const res = await guruAPI.chat(msg, history, activeMarket, null, style.toLowerCase())
    setGuruTyping(false)
    if (res?.offline) {
      addGuruMessage({ role: 'guru', offline: true, content: OFFLINE_TEXT, timestamp: Date.now() })
    } else if (res?.error || res?.response == null) {
      addGuruMessage({ role: 'guru', content: 'Guru hit an error reaching the analysis engine. Please try again.', timestamp: Date.now() })
    } else {
      addGuruMessage({ role: 'guru', content: res.response, usage: res.usage, symbols: res.symbols_detected, timestamp: Date.now() })
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }
  const autoGrow = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 112) + 'px'
  }

  const clearHistory = () => { if (window.confirm('Clear all Guru conversation history?')) clearGuruHistory() }
  const copy = (t) => { navigator.clipboard.writeText(t); toast.success('Copied') }
  const save = (t) => { saveAnalysis(t); toast.success('Saved to your analyses') }

  return (
    <div className="page page-narrow flex flex-col" style={{ minHeight: 'calc(100vh - var(--navbar-height) - var(--tabbar-height))' }}>
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h1 className="page-title">Guru</h1>
          <p className="page-sub">AI financial analyst, running on live market data</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: online ? 'var(--positive)' : 'var(--accent-gold)', animation: 'dotPulse 1.8s infinite' }} />
              <span style={{ color: online ? 'var(--positive)' : 'var(--accent-gold)' }}>{hasKey === null ? 'Connecting…' : online ? 'Online' : 'Offline - API key required'}</span>
            </span>
            <span className="badge" style={{ color: 'var(--accent)' }}>
              {activeMarket === 'asx' ? 'ASX' : 'US'} markets
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setDrawerOpen(true)} className="btn">
            <Bookmark size={14} /> <span className="hidden sm:inline">Saved</span> ({savedAnalyses.length})
          </button>
          {guruHistory.length > 0 && (
            <button onClick={clearHistory} className="btn hidden sm:inline-flex" style={{ color: 'var(--text-muted)' }}>Clear</button>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {guruHistory.length === 0 ? (
          <div className="py-8">
            <p className="text-center text-[var(--text-secondary)] mb-4">What would you like to analyse?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SUGGESTED.map((s, i) => (
                <button key={i} onClick={() => setInput(s)} className="text-left text-sm p-3 rounded-lg transition-colors"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : guruHistory.map((m, i) => (
          m.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%]">
                <div className="rounded-2xl rounded-br-sm px-4 py-2 text-sm" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>{m.content}</div>
                <div className="text-[10px] text-[var(--text-muted)] text-right mt-1">{new Date(m.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          ) : (
            <div key={i} className="flex gap-2 group">
              <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>G</div>
              <div className="flex-1 min-w-0">
                <div className="card" style={{ borderLeft: '2px solid var(--accent)' }}>
                  {m.offline ? (
                    <>
                      <div className="flex items-center gap-2 font-semibold mb-2" style={{ color: 'var(--accent-gold)' }}>
                        <AlertTriangle size={15} /> Guru is offline
                      </div>
                      {renderMarkdown(m.content)}
                      <button onClick={async () => { const r = await settingsAPI.checkAPIStatus(); const ok = r?.Anthropic?.status === 'ok'; (ok ? toast.success : toast.error)(ok ? 'Anthropic key detected - restart not needed' : 'Key still not detected') }}
                              className="btn mt-3" style={{ color: 'var(--accent)' }}>Check API status</button>
                    </>
                  ) : renderMarkdown(m.content)}
                  {m.usage && <div className="text-[10px] text-[var(--text-muted)] mt-2">↑ {m.usage.in} input · ↓ {m.usage.out} output tokens</div>}
                </div>
                {!m.offline && (
                  /* hover-action reveals on hover, but stays visible on touch -
                     there is no hover state to discover it with on a phone. */
                  <div className="hover-action flex items-center gap-3 mt-1.5">
                    <button onClick={() => copy(m.content)} title="Copy" className="text-[var(--text-muted)] hover:text-[var(--accent)]"><Copy size={14} /></button>
                    <button onClick={() => save(m.content)} title="Save" className="text-[var(--text-muted)] hover:text-[var(--accent)]"><Save size={14} /></button>
                    <button title="Helpful" className="text-[var(--text-muted)] hover:text-[var(--positive)]"><ThumbsUp size={14} /></button>
                    <button title="Not helpful" className="text-[var(--text-muted)] hover:text-[var(--negative)]"><ThumbsDown size={14} /></button>
                  </div>
                )}
              </div>
            </div>
          )
        ))}
        {guruIsTyping && (
          <div className="flex gap-2">
            <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>G</div>
            <div className="card flex items-center gap-1" style={{ borderLeft: '2px solid var(--accent)' }}>
              {[0, 1, 2].map((d) => <span key={d} className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)', animation: `dotPulse 1.2s ${d * 0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* INPUT - sticks above the phone tab bar rather than underneath it. */}
      <div className="sticky pb-2" style={{ bottom: 'var(--tabbar-height)', background: 'var(--bg)' }}>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="segmented">
            {['us', 'asx'].map((m) => (
              <button key={m} onClick={() => setActiveMarket(m)} aria-pressed={activeMarket === m}>{m.toUpperCase()}</button>
            ))}
          </div>
          <div className="segmented" style={{ opacity: online ? 1 : 0.5 }} title={online ? '' : 'Available when Guru is online'}>
            {STYLES.map((s) => (
              <button key={s} disabled={!online} onClick={() => setStyle(s)} aria-pressed={style === s}>{s}</button>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-2">
          <textarea ref={taRef} rows={1} value={input} onChange={autoGrow} onKeyDown={onKeyDown}
                    placeholder="Ask about markets, stocks, sectors, or strategy…"
                    className="input flex-1 resize-none"
                    style={{ maxHeight: 112 }} />
          <button onClick={() => send()} disabled={guruIsTyping || !input.trim()}
                  className="shrink-0 w-10 h-10 rounded-control flex items-center justify-center disabled:opacity-40"
                  style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }} aria-label="Send">
            <Send size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 mt-1.5">
          <span className="text-2xs text-[var(--text-muted)]">Live market data · Not financial advice</span>
          {input.length > 200 && <span className="text-2xs text-[var(--text-muted)]">{input.length} chars</span>}
        </div>
      </div>

      {/* SAVED DRAWER - full-width sheet on a phone, side panel on desktop. */}
      {drawerOpen && (
        <>
          <div className="sheet-backdrop" onClick={() => setDrawerOpen(false)} />
          <div
            className="fixed top-0 right-0 h-full z-[61] w-full sm:w-80 overflow-y-auto"
            style={{
              background: 'var(--bg-card)',
              borderLeft: '1px solid var(--border)',
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            role="dialog"
            aria-label="Saved analyses"
          >
            <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="font-semibold text-[var(--text-primary)]">Saved Analyses</span>
              <button onClick={() => setDrawerOpen(false)} className="p-1 -mr-1 text-[var(--text-muted)]" aria-label="Close"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              {savedAnalyses.length === 0 ? <p className="text-sm text-[var(--text-muted)]">No saved analyses yet</p> :
                savedAnalyses.map((a) => (
                  <div key={a.id} className="rounded-control p-3" style={{ background: 'var(--bg-input)' }}>
                    <div className="text-2xs text-[var(--text-muted)] mb-1">{new Date(a.createdAt).toLocaleString()}</div>
                    <div className="text-sm text-[var(--text-secondary)]">{a.text.slice(0, 80)}…</div>
                    <div className="flex gap-3 mt-2">
                      <button onClick={() => copy(a.text)} className="text-[var(--text-muted)] hover:text-[var(--accent)]" aria-label="Copy"><Copy size={14} /></button>
                      <button onClick={() => deleteAnalysis(a.id)} className="text-[var(--text-muted)] hover:text-[var(--negative)]" aria-label="Delete"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
