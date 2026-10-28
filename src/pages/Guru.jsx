import { useState, useEffect, useRef } from 'react'
import {
  ArrowUp, Copy, Check, Bookmark, BookmarkPlus, ThumbsUp, ThumbsDown, Trash2, X, History, SquarePen,
  AlertTriangle, RotateCcw, Sparkles, TrendingUp, Globe2, Scale, Coins, ShieldAlert, BarChart3,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { guruAPI, healthAPI } from '../utils/api'
import useStore from '../store/useStore'
import Markdown from '../components/common/Markdown'
import ChatHistory from '../components/guru/ChatHistory'

const SUGGESTED = [
  { icon: BarChart3, label: 'Single stock', prompt: 'Analyse AAPL - complete fundamental, valuation and technical breakdown, give me a buy/sell/hold' },
  { icon: Scale, label: 'Head to head', prompt: 'Compare NVDA vs AMD - full analysis, which is the better buy today and why?' },
  { icon: TrendingUp, label: 'Stock ideas', prompt: 'Give me 2 tech stock picks with full fundamental and technical analysis' },
  { icon: Globe2, label: 'Market view', prompt: 'What is the current US market sentiment and which sectors should I be positioning in right now?' },
  { icon: Coins, label: 'Income', prompt: 'Give me 2 high-yield ASX dividend picks with franking credits context and sustainability analysis' },
  { icon: ShieldAlert, label: 'Risk', prompt: 'What are the key macro risks for Australian equities right now and how should I position?' },
]

const STYLES = ['Brief', 'Detailed', 'Institutional']
const PROVIDER_LABELS = { groq: 'Groq', gemini: 'Gemini', anthropic: 'Anthropic' }

const ANSWER_SECTIONS = { RECOMMENDATION: 'guru-rec', DISCLAIMER: 'guru-disclaimer' }

// ── page ────────────────────────────────────────────────────────────────────

export default function Guru() {
  const activeMarket = useStore((s) => s.activeMarket)
  const setActiveMarket = useStore((s) => s.setActiveMarket)
  const guruHistory = useStore((s) => s.guruHistory)
  const addGuruMessage = useStore((s) => s.addGuruMessage)
  const updateGuruMessage = useStore((s) => s.updateGuruMessage)
  const removeGuruMessage = useStore((s) => s.removeGuruMessage)
  const newGuruChat = useStore((s) => s.newGuruChat)
  const guruChatCount = useStore((s) => s.guruChats.length)
  const guruIsTyping = useStore((s) => s.guruIsTyping)
  const setGuruTyping = useStore((s) => s.setGuruTyping)
  const savedAnalyses = useStore((s) => s.savedAnalyses)
  const saveAnalysis = useStore((s) => s.saveAnalysis)
  const deleteAnalysis = useStore((s) => s.deleteAnalysis)
  const settings = useStore((s) => s.settings)

  // { state: 'checking' | 'online' | 'nokey' | 'unreachable', provider }
  const [status, setStatus] = useState({ state: 'checking' })
  const [input, setInput] = useState('')
  const [style, setStyle] = useState(settings.guruResponseStyle ? settings.guruResponseStyle[0].toUpperCase() + settings.guruResponseStyle.slice(1) : 'Detailed')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [copied, setCopied] = useState(null)
  const endRef = useRef(null)
  const taRef = useRef(null)

  const checkStatus = async () => {
    setStatus({ state: 'checking' })
    const r = await healthAPI.get()
    const next = r?.error
      ? { state: 'unreachable' }
      : (r?.has_ai_key ?? r?.has_anthropic_key)
        ? { state: 'online', provider: r.ai_provider }
        : { state: 'nokey' }
    setStatus(next)
    return next
  }

  useEffect(() => { checkStatus() }, [])
  // A stale "typing" flag persisted from an interrupted request would lock the
  // composer forever — no request can be in flight on a fresh mount.
  useEffect(() => { setGuruTyping(false) }, [setGuruTyping])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [guruHistory.length, guruIsTyping])

  const online = status.state === 'online'

  const ask = async (msg, priorHistory) => {
    if (status.state === 'nokey') {
      addGuruMessage({ role: 'guru', offline: true, timestamp: Date.now() })
      return
    }
    setGuruTyping(true)
    const history = priorHistory
      .filter((m) => !m.offline && !m.error && m.content)
      .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
    const res = await guruAPI.chat(msg, history, activeMarket, null, style.toLowerCase())
    setGuruTyping(false)
    if (res?.offline) {
      setStatus({ state: 'nokey' })
      addGuruMessage({ role: 'guru', offline: true, timestamp: Date.now() })
    } else if (res?.error || !res?.response) {
      const unreachable = res?.error === true && res?.status == null
      addGuruMessage({
        role: 'guru',
        error: true,
        content: '',
        detail: unreachable
          ? 'Could not reach the FinSight server. Check that the backend is running.'
          : typeof res?.error === 'string' && /429|rate/i.test(res.error)
            ? 'The AI provider is rate-limiting requests. Wait a moment and retry.'
            : 'The AI provider returned an error. Retry, or try a shorter response style.',
        timestamp: Date.now(),
      })
    } else {
      addGuruMessage({ role: 'guru', content: res.response, usage: res.usage, provider: res.provider, symbols: res.symbols_detected, timestamp: Date.now() })
    }
  }

  const send = async (text) => {
    const msg = (text ?? input).trim()
    if (!msg || guruIsTyping) return
    setInput('')
    if (taRef.current) taRef.current.style.height = 'auto'
    const prior = useStore.getState().guruHistory
    addGuruMessage({ role: 'user', content: msg, timestamp: Date.now() })
    await ask(msg, prior)
  }

  // Retry drops the failed reply and re-asks the question that produced it.
  const retry = async (index) => {
    if (guruIsTyping) return
    if (status.state !== 'online') {
      const s = await checkStatus()
      if (s.state === 'nokey') return
    }
    const hist = useStore.getState().guruHistory
    const question = hist[index - 1]
    if (!question || question.role !== 'user') return
    removeGuruMessage(index)
    await ask(question.content, hist.slice(0, index - 1))
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send() }
  }
  const autoGrow = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
    e.target.style.overflowY = e.target.scrollHeight > 160 ? 'auto' : 'hidden'
  }

  const copy = async (t, key) => {
    try {
      await navigator.clipboard.writeText(t)
      setCopied(key)
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500)
    } catch {
      toast.error('Copy is not available here')
    }
  }
  const save = (t) => { saveAnalysis(t); toast.success('Saved to your analyses') }
  const rate = (i, value) => {
    const next = guruHistory[i]?.feedback === value ? null : value
    updateGuruMessage(i, { feedback: next })
    if (next) toast.success('Thanks for the feedback')
  }

  const statusChip = {
    checking: { tone: 'var(--text-muted)', text: 'Connecting…' },
    online: { tone: 'var(--positive)', text: status.provider ? `Online · ${PROVIDER_LABELS[status.provider] || status.provider}` : 'Online' },
    nokey: { tone: 'var(--accent-gold)', text: 'AI key required' },
    unreachable: { tone: 'var(--negative)', text: 'Server unreachable' },
  }[status.state]

  return (
    <div className="page page-narrow flex flex-col" style={{ minHeight: 'calc(100vh - var(--navbar-height) - var(--tabbar-height))' }}>
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h1 className="page-title">Guru</h1>
          <p className="page-sub">AI equity analyst, grounded in live market data</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="guru-status" title={status.state === 'online' ? 'AI provider connected' : undefined}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusChip.tone }} />
            {statusChip.text}
          </span>
          <button onClick={() => setDrawerOpen(true)} className="btn" aria-label={`Saved analyses (${savedAnalyses.length})`}>
            <Bookmark size={14} /> <span className="hidden sm:inline">Saved</span>
            {savedAnalyses.length > 0 && <span className="guru-count">{savedAnalyses.length}</span>}
          </button>
          <button onClick={() => setHistoryOpen(true)} className="btn" aria-label={`Chat history (${guruChatCount})`} title="Chat history">
            <History size={14} /> <span className="hidden sm:inline">History</span>
          </button>
          {guruHistory.length > 0 && (
            <button onClick={() => { newGuruChat(); setInput(''); taRef.current?.focus() }} disabled={guruIsTyping}
                    className="btn" aria-label="New chat" title="New chat">
              <SquarePen size={14} /> <span className="hidden sm:inline">New</span>
            </button>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 space-y-6 mb-4">
        {guruHistory.length === 0 ? (
          <div className="pt-6 pb-4">
            <div className="flex flex-col items-center text-center mb-6">
              <span className="guru-avatar guru-avatar-lg"><Sparkles size={20} /></span>
              <h2 className="mt-3 text-lg font-semibold text-[var(--text-primary)]">What would you like to analyse?</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)] max-w-md">
                Mention a ticker and Guru pulls its live quote, metrics and analyst ratings before answering.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SUGGESTED.map(({ icon: Icon, label, prompt }) => (
                <button key={label} onClick={() => send(prompt)} className="guru-suggestion" disabled={guruIsTyping}>
                  <span className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    <Icon size={12} style={{ color: 'var(--accent)' }} /> {label}
                  </span>
                  <span className="mt-1.5 block text-sm text-[var(--text-secondary)] leading-snug">{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        ) : guruHistory.map((m, i) => (
          m.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <div className="guru-user">{m.content}</div>
            </div>
          ) : (
            <div key={i} className="flex gap-3">
              <span className="guru-avatar"><Sparkles size={14} /></span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 text-xs">
                  <span className="font-semibold text-[var(--text-primary)]">Guru</span>
                  <span className="text-[var(--text-muted)]">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {m.symbols?.length > 0 && m.symbols.map((s) => <span key={s} className="guru-ticker">{s}</span>)}
                </div>

                {m.offline ? (
                  <div className="guru-notice" style={{ borderColor: 'color-mix(in srgb, var(--accent-gold) 40%, transparent)' }}>
                    <div className="flex items-center gap-2 font-semibold text-sm mb-2" style={{ color: 'var(--accent-gold)' }}>
                      <AlertTriangle size={15} /> Guru needs an AI key
                    </div>
                    <ol className="text-sm text-[var(--text-secondary)] space-y-1 list-decimal pl-5">
                      <li>Get a free key at <span className="font-mono">console.groq.com</span> (or <span className="font-mono">aistudio.google.com</span> for Gemini).</li>
                      <li>Add <code className="md-code">GROQ_API_KEY=…</code> (or <code className="md-code">GEMINI_API_KEY=…</code>) to the project's <span className="font-mono">.env</span>.</li>
                      <li>Restart the backend with <code className="md-code">python3 main.py</code>.</li>
                    </ol>
                    <button onClick={async () => { const s = await checkStatus(); (s.state === 'online' ? toast.success : toast.error)(s.state === 'online' ? 'AI key detected - Guru is online' : 'Still no AI key detected') }}
                            className="btn mt-3">Check again</button>
                  </div>
                ) : m.error ? (
                  <div className="guru-notice" style={{ borderColor: 'color-mix(in srgb, var(--negative) 40%, transparent)' }}>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--negative)' }}>
                      <AlertTriangle size={15} /> {m.detail || 'Something went wrong.'}
                    </div>
                    {i === guruHistory.length - 1 && (
                      <button onClick={() => retry(i)} className="btn mt-3" disabled={guruIsTyping}>
                        <RotateCcw size={13} /> Retry
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <Markdown text={m.content} sections={ANSWER_SECTIONS} />
                    <div className="flex items-center gap-1 mt-2">
                      <button onClick={() => copy(m.content, i)} className="guru-action" aria-label="Copy" title="Copy">
                        {copied === i ? <Check size={14} style={{ color: 'var(--positive)' }} /> : <Copy size={14} />}
                      </button>
                      <button onClick={() => save(m.content)} className="guru-action" aria-label="Save" title="Save analysis"><BookmarkPlus size={14} /></button>
                      <button onClick={() => rate(i, 'up')} className="guru-action" aria-label="Helpful" aria-pressed={m.feedback === 'up'} title="Helpful"
                              style={m.feedback === 'up' ? { color: 'var(--positive)' } : undefined}><ThumbsUp size={14} /></button>
                      <button onClick={() => rate(i, 'down')} className="guru-action" aria-label="Not helpful" aria-pressed={m.feedback === 'down'} title="Not helpful"
                              style={m.feedback === 'down' ? { color: 'var(--negative)' } : undefined}><ThumbsDown size={14} /></button>
                      {m.usage?.out != null && (
                        <span className="ml-auto text-2xs text-[var(--text-muted)] tabular">
                          {PROVIDER_LABELS[m.provider] ? `${PROVIDER_LABELS[m.provider]} · ` : ''}{m.usage.out.toLocaleString()} tokens
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        ))}
        {guruIsTyping && (
          <div className="flex gap-3">
            <span className="guru-avatar"><Sparkles size={14} /></span>
            <div className="flex items-center gap-2 h-8 text-sm text-[var(--text-muted)]">
              <span className="flex gap-1">
                {[0, 1, 2].map((d) => <span key={d} className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)', animation: `dotPulse 1.2s ${d * 0.2}s infinite` }} />)}
              </span>
              Analysing live data…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* COMPOSER - sticks above the phone tab bar rather than underneath it. */}
      <div className="sticky pt-2 pb-3" style={{ bottom: 'var(--tabbar-height)', background: 'var(--bg)' }}>
        <div className="guru-composer">
          <div className="flex items-end gap-2 pr-2 pb-2">
            <textarea ref={taRef} rows={1} value={input} onChange={autoGrow} onKeyDown={onKeyDown}
                      placeholder="Ask about a stock, sector or strategy…"
                      aria-label="Message Guru"
                      className="guru-input" />
            <button onClick={() => send()} disabled={guruIsTyping || !input.trim()}
                    className="guru-send" aria-label="Send">
              <ArrowUp size={16} strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex items-center gap-2 px-2 pb-2 overflow-x-auto hide-scrollbar">
            <div className="segmented shrink-0">
              {['us', 'asx'].map((m) => (
                <button key={m} onClick={() => setActiveMarket(m)} aria-pressed={activeMarket === m}>{m.toUpperCase()}</button>
              ))}
            </div>
            <div className="segmented shrink-0">
              {STYLES.map((s) => (
                <button key={s} onClick={() => setStyle(s)} aria-pressed={style === s}>{s}</button>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-1.5 text-center text-2xs text-[var(--text-muted)]">
          Guru can make mistakes. General information only, not financial advice.
        </p>
      </div>

      <ChatHistory open={historyOpen} onClose={() => setHistoryOpen(false)} disabled={guruIsTyping} />

      {/* SAVED DRAWER - full-width sheet on a phone, side panel on desktop. */}
      {drawerOpen && (
        <>
          <div className="sheet-backdrop" onClick={() => setDrawerOpen(false)} />
          <div
            className="fixed top-0 right-0 h-full z-[61] w-full sm:w-96 overflow-y-auto"
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
              <span className="font-semibold text-[var(--text-primary)]">Saved analyses</span>
              <button onClick={() => setDrawerOpen(false)} className="p-1 -mr-1 text-[var(--text-muted)]" aria-label="Close"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              {savedAnalyses.length === 0 ? <p className="text-sm text-[var(--text-muted)]">Nothing saved yet. Use the bookmark under any answer to keep it here.</p> :
                savedAnalyses.map((a) => (
                  <div key={a.id} className="rounded-control p-3" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
                    <div className="text-2xs text-[var(--text-muted)] mb-1">{new Date(a.createdAt).toLocaleString()}</div>
                    <div className="text-sm text-[var(--text-secondary)] line-clamp-3">{a.text.replace(/[#*`|]/g, '').slice(0, 220)}</div>
                    <div className="flex gap-1 mt-2 -ml-1.5">
                      <button onClick={() => copy(a.text, `s${a.id}`)} className="guru-action" aria-label="Copy">
                        {copied === `s${a.id}` ? <Check size={14} style={{ color: 'var(--positive)' }} /> : <Copy size={14} />}
                      </button>
                      <button onClick={() => deleteAnalysis(a.id)} className="guru-action" aria-label="Delete"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      <style>{`
        .guru-status {
          display: inline-flex; align-items: center; gap: 6px;
          height: 30px; padding: 0 10px; border-radius: 999px;
          font-size: 0.75rem; color: var(--text-secondary);
          background: var(--bg-card); border: 1px solid var(--border);
          white-space: nowrap;
        }
        @media (max-width: 480px) { .guru-status { display: none; } }
        .guru-count {
          min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px;
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 0.6875rem; font-weight: 600;
          background: var(--accent); color: var(--accent-contrast);
        }
        .guru-avatar {
          flex-shrink: 0; width: 28px; height: 28px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 14%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
        }
        .guru-avatar-lg { width: 44px; height: 44px; border-radius: 12px; }
        .guru-suggestion {
          text-align: left; padding: 12px 14px; border-radius: var(--radius-card);
          background: var(--bg-card); border: 1px solid var(--border);
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .guru-suggestion:hover:not(:disabled) { border-color: var(--accent); background: var(--bg-card-hover); }
        .guru-user {
          max-width: min(80%, 560px);
          padding: 10px 14px; border-radius: 14px 14px 4px 14px;
          font-size: 0.875rem; line-height: 1.5; white-space: pre-wrap; overflow-wrap: anywhere;
          background: var(--bg-card); border: 1px solid var(--border-light);
          color: var(--text-primary);
        }
        .guru-rec {
          margin: 18px 0 8px; padding: 14px 16px; border-radius: var(--radius-card);
          background: color-mix(in srgb, var(--accent) 7%, var(--bg-card));
          border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
        }
        .guru-rec .md-h2 { color: var(--accent); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; }
        .guru-rec .md-p:last-child { margin-bottom: 0; }
        .guru-disclaimer { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border); }
        .guru-disclaimer .md-h2 { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-top: 0; }
        .guru-disclaimer .md-text { font-size: 0.75rem; color: var(--text-muted); }
        .guru-ticker {
          font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 0.6875rem; font-weight: 600;
          padding: 1px 6px; border-radius: 4px;
          color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, transparent);
        }
        .guru-notice {
          padding: 14px 16px; border-radius: var(--radius-card);
          background: var(--bg-card); border: 1px solid var(--border);
        }
        .guru-action {
          width: 28px; height: 28px; border-radius: 6px;
          display: inline-flex; align-items: center; justify-content: center;
          color: var(--text-muted); transition: color 0.15s ease, background 0.15s ease;
        }
        .guru-action:hover { color: var(--text-primary); background: var(--bg-card-hover); }
        .guru-composer {
          border-radius: 12px; background: var(--bg-card);
          border: 1px solid var(--border-light);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .guru-composer:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--ring); }
        .guru-input {
          display: block; flex: 1; min-width: 0; resize: none; max-height: 160px; overflow-y: hidden;
          padding: 12px 14px 6px; background: transparent; outline: none; border: 0;
          font-size: 16px; line-height: 1.5; color: var(--text-primary);
        }
        @media (min-width: 640px) { .guru-input { font-size: 0.9375rem; } }
        .guru-input::placeholder { color: var(--text-muted); }
        .guru-send {
          width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: var(--accent); color: var(--accent-contrast);
          transition: background 0.15s ease, opacity 0.15s ease;
        }
        .guru-send:hover:not(:disabled) { background: var(--accent-hover); }
        .guru-send:disabled { opacity: 0.35; cursor: not-allowed; }
      `}</style>
    </div>
  )
}
