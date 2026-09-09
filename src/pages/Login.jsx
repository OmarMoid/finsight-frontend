import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Delete, ArrowRight, Eye, EyeOff, Check } from 'lucide-react'
import { authAPI } from '../utils/api'
import { getApiBase, isNative } from '../utils/apiBase'
import useStore from '../store/useStore'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Logo from '../components/common/Logo'

const MAX_PASSCODE = 12
const KEYPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

// The rules the backend actually enforces (see Settings → Security, which
// caps a new passcode at 4–8 characters). Showing invented "must contain a
// symbol" rules against a numeric passcode would be theatre — these are the
// real ones, checked live as you type.
const RULES = [
  { id: 'len', label: 'At least 4 characters', test: (v) => v.length >= 4 },
  { id: 'max', label: 'No more than 8', test: (v) => v.length > 0 && v.length <= 8 },
]

export default function Login() {
  const [passcode, setPasscode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [reveal, setReveal] = useState(false)
  // Surface server reachability before the passcode is even typed — on the
  // phone this is a public backend that sleeps when idle, so a slow first
  // check is expected and shouldn't read as "broken."
  const [server, setServer] = useState({ state: 'checking' })
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const setAuthenticated = useStore((s) => s.setAuthenticated)
  const native = isNative()

  useEffect(() => {
    // The on-screen keypad below is the input method on touch devices, so the
    // hidden field is only focused where there's a hardware keyboard. This is
    // also why the iOS keyboard no longer covers the Unlock button.
    if (!native) inputRef.current?.focus()
  }, [native])

  useEffect(() => {
    let cancelled = false
    let consecutiveFailures = 0
    const check = async () => {
      const base = getApiBase()
      try {
        const res = await fetch(`${base}/health`, { signal: AbortSignal.timeout(8000) })
        const body = await res.json()
        consecutiveFailures = 0
        if (!cancelled) {
          setServer(
            body?.status === 'healthy'
              ? { state: 'online', base, version: body.version }
              : { state: 'offline', base }
          )
        }
      } catch {
        consecutiveFailures += 1
        // The deployed backend's free tier sleeps after 15 min idle and can
        // take ~50s+ to wake — the first couple of misses are more likely a
        // cold start than a real outage, so say so rather than alarm.
        if (!cancelled) {
          setServer({ state: consecutiveFailures <= 3 ? 'waking' : 'offline', base })
        }
      }
    }
    check()
    const id = setInterval(check, 10000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  const submit = useCallback(
    async (code) => {
      const value = code ?? passcode
      if (!value || loading) return
      setLoading(true)
      setError('')

      const res = await authAPI.verify(value)
      setLoading(false)

      if (res?.valid) {
        setAuthenticated(true)
        navigate('/dashboard')
      } else {
        setError(
          res?.error
            ? 'Could not reach the server. Check the connection and try again.'
            : 'Incorrect passcode.'
        )
        setPasscode('')
        setShake(true)
        setTimeout(() => setShake(false), 420)
        if (!native) inputRef.current?.focus()
      }
    },
    [passcode, loading, native, navigate, setAuthenticated]
  )

  const press = (key) => {
    if (loading) return
    setError('')
    if (key === 'del') {
      setPasscode((p) => p.slice(0, -1))
      return
    }
    setPasscode((p) => (p.length >= MAX_PASSCODE ? p : p + key))
  }

  const statusTone = {
    online: 'var(--positive)',
    offline: 'var(--negative)',
    waking: 'var(--accent-gold)',
    checking: 'var(--text-muted)',
  }[server.state]

  const statusText = {
    checking: 'Contacting server…',
    online: `Connected · v${server.version}`,
    waking: 'Waking the server…',
    offline: 'Server unreachable',
  }[server.state]

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      <div className="login-grid" aria-hidden="true" />
      <div className="login-aurora" aria-hidden="true" />

      <div className="relative z-10 w-full px-5 py-8" style={{ maxWidth: 400 }}>
        {/* Brand lockup */}
        <div className="flex flex-col items-center">
          <div className="login-mark">
            <Logo size={56} showWordmark={false} />
          </div>
          <h1
            className="mt-4 text-3xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
          >
            FinSight
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Institutional-grade market intelligence
          </p>

          {/* One status pill instead of the old two rows — the live-data claim
              and the server check were saying the same thing twice. */}
          <div
            className="mt-4 flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <span
              className={server.state === 'online' ? 'login-dot login-dot-live' : 'login-dot'}
              style={{ background: statusTone }}
            />
            <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
              {statusText}
            </span>
          </div>
        </div>

        {/* Passcode card */}
        <div
          className={`login-card mt-7 ${shake ? 'login-shake' : ''}`}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <form
            className={native ? 'is-touch' : undefined}
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <div
              className="text-center text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: 'var(--text-muted)' }}
            >
              Enter passcode
            </div>

            {/* Filled dots read the length back without exposing the digits.
                Touch-only: with a hardware keyboard the field below is the
                clearer affordance and showing both is just noise. */}
            <div className="login-pips" aria-hidden="true">
              {Array.from({ length: Math.max(4, passcode.length || 4) }).map((_, i) => (
                <span
                  key={i}
                  className="login-pip"
                  style={{
                    background: i < passcode.length ? 'var(--accent)' : 'transparent',
                    borderColor: i < passcode.length ? 'var(--accent)' : 'var(--border-light)',
                  }}
                />
              ))}
            </div>

            {/* The real field. Visually hidden on touch (the keypad drives it)
                but always present so password managers and hardware keyboards
                work exactly as before. */}
            <div className={native ? undefined : 'login-field-wrap'}>
              <input
                ref={inputRef}
                type={reveal ? 'text' : 'password'}
                inputMode="numeric"
                autoComplete="current-password"
                aria-label="Passcode"
                value={passcode}
                onChange={(e) => {
                  setError('')
                  setPasscode(e.target.value.slice(0, MAX_PASSCODE))
                }}
                className={native ? 'login-hidden-input' : 'login-field'}
                placeholder="••••"
              />
              {/* Reveal sits inside the field's right edge. Type-toggling
                  rather than a second element keeps the value in one input, so
                  autofill and the form submit see exactly one field. */}
              {!native && (
                <button
                  type="button"
                  className="login-reveal"
                  onClick={() => setReveal((v) => !v)}
                  aria-label={reveal ? 'Hide passcode' : 'Show passcode'}
                  aria-pressed={reveal}
                  tabIndex={-1}
                >
                  {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
            </div>

            {/* Live rule check. Fades in only once there is something to
                check — an empty field greeted by two grey warnings reads as an
                error state before you have done anything. */}
            <div className={`login-rules${passcode ? ' is-visible' : ''}`} aria-live="polite">
              {RULES.map((rule) => {
                const met = rule.test(passcode)
                return (
                  <span key={rule.id} className={`login-rule${met ? ' is-met' : ''}`}>
                    <Check size={11} strokeWidth={3} />
                    {rule.label}
                  </span>
                )
              })}
            </div>

            <div style={{ minHeight: 22 }}>
              {error && (
                <p className="mt-3 text-center text-sm" style={{ color: 'var(--negative)' }}>
                  {error}
                </p>
              )}
            </div>

            {/* Keypad — the primary input on a phone, where a system keyboard
                used to cover the Unlock button entirely. */}
            <div className="login-keypad">
              {KEYPAD.map((k, i) =>
                k === '' ? (
                  <span key={i} />
                ) : (
                  <button
                    key={i}
                    type="button"
                    onClick={() => press(k)}
                    className="login-key"
                    aria-label={k === 'del' ? 'Delete' : k}
                  >
                    {k === 'del' ? <Delete size={20} /> : k}
                  </button>
                )
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !passcode}
              className="login-submit mt-4"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  Sign in <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        </div>

        {server.state === 'waking' && (
          <p className="mt-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            The server sleeps after 15 minutes idle - the first request back can take up to a
            minute. Retrying automatically.
          </p>
        )}
        {server.state === 'offline' && (
          <p className="mt-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            Tried <span className="font-mono">{server.base}</span> without a response.{' '}
            {native
              ? 'If you’ve pointed this at a custom address, make sure that machine is running the backend and reachable. Otherwise the deployed server may be briefly down - try again shortly.'
              : 'Start the backend with python3 main.py in the backend folder.'}
          </p>
        )}

        <p className="mt-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          FinSight v1.0 - for informational purposes only
        </p>
      </div>

      <style>{`
        .login-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 44px 44px;
          opacity: 0.35;
          mask-image: radial-gradient(ellipse 90% 70% at 50% 40%, #000 20%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse 90% 70% at 50% 40%, #000 20%, transparent 75%);
        }
        .login-aurora {
          position: absolute; top: -10%; left: 50%;
          width: 780px; height: 780px; transform: translateX(-50%);
          background: radial-gradient(circle at 50% 50%, var(--accent) 0%, transparent 62%);
          opacity: 0.16; filter: blur(70px); pointer-events: none;
        }
        .login-mark {
          border-radius: 16px;
          box-shadow: 0 0 0 1px var(--accent-border), 0 12px 40px -12px var(--accent);
        }
        .login-card {
          border-radius: 12px;
          padding: 22px 20px 20px;
        }
        /* Which input surface shows is a breakpoint decision, and it lives
           here rather than as Tailwind lg: utilities - this <style> block is
           injected after Tailwind's sheet, so .login-keypad's own display rule
           would win over .lg\\:hidden and both would render at once. */
        .login-pips {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-top: 20px;
        }
        .login-pip {
          width: 11px; height: 11px; border-radius: 50%;
          border: 1.5px solid var(--border-light);
          transition: background 0.14s ease, border-color 0.14s ease, transform 0.14s ease;
        }
        .login-field-wrap {
          display: none;
          position: relative;
          margin-top: 20px;
        }
        .login-field {
          display: none;
          width: 100%; text-align: center;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 1.15rem; letter-spacing: 0.35em; text-indent: 0.35em;
          /* Right padding clears the reveal button so a long passcode never
             runs underneath it. */
          padding: 12px 44px 12px 14px; border-radius: 6px; outline: none;
          background: var(--bg-input);
          border: 1px solid var(--border);
          color: var(--text-primary);
          transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        /* A 1px accent border plus a soft outer bloom, over 150ms - enough to
           be unmistakable about which field has the keyboard without the
           heavy browser focus rectangle. */
        .login-field:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--ring), 0 0 18px -4px var(--accent);
          background: var(--bg-card);
        }
        .login-reveal {
          position: absolute; right: 6px; top: 50%;
          transform: translateY(-50%);
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 6px;
          border: 0; background: transparent;
          color: var(--text-muted);
          transition: color 0.15s ease, background 0.15s ease;
        }
        .login-reveal:hover { color: var(--text-primary); background: var(--bg-card-hover); }
        .login-reveal[aria-pressed='true'] { color: var(--accent); }

        /* Requirement capsule. Grey until met, accent-green once satisfied;
           the whole strip fades in rather than appearing hard, so it reads as
           guidance rather than as an error that just fired. */
        .login-rules {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 6px;
          margin-top: 10px;
          opacity: 0;
          transform: translateY(-3px);
          transition: opacity 0.22s ease, transform 0.22s ease;
          pointer-events: none;
        }
        .login-rules.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .login-rule {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 9px; border-radius: 999px;
          font-size: 0.6875rem; font-weight: 500; line-height: 1.2;
          background: var(--bg-input);
          border: 1px solid var(--border);
          color: var(--text-muted);
          transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }
        .login-rule > svg { opacity: 0.35; transition: opacity 0.18s ease; }
        .login-rule.is-met {
          color: var(--positive);
          border-color: color-mix(in srgb, var(--positive) 42%, transparent);
          background: color-mix(in srgb, var(--positive) 11%, var(--bg-input));
        }
        .login-rule.is-met > svg { opacity: 1; }
        .login-hidden-input {
          position: absolute; width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0 0 0 0); white-space: nowrap; border: 0;
        }
        .login-keypad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 8px;
        }
        /* At the app's 1024px shell breakpoint there is a real keyboard: show
           the field, drop the keypad and the dots. */
        @media (min-width: 1024px) {
          .login-keypad, .login-pips { display: none; }
          .login-field { display: block; }
          .login-field-wrap { display: block; }
          /* …except in the native shell, where an iPad is over 1024px wide and
             has no hardware keyboard. There the keypad IS the only input. */
          .is-touch .login-keypad { display: grid; }
          .is-touch .login-pips { display: flex; }
        }
        .login-key {
          height: 56px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 1.35rem; font-weight: 500;
          color: var(--text-primary);
          background: var(--bg-input);
          border: 1px solid var(--border);
          -webkit-tap-highlight-color: transparent;
          transition: background 0.12s ease, transform 0.08s ease, border-color 0.12s ease;
        }
        .login-key:active {
          background: var(--accent-soft);
          border-color: var(--accent-border);
          transform: scale(0.96);
        }
        /* Solid fill, not the gradient: a single flat accent block reads as a
           control you press, where a gradient reads as decoration. */
        .login-submit {
          width: 100%; height: 48px; border-radius: 6px;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 0.9375rem; font-weight: 600; letter-spacing: 0.01em;
          background: var(--accent);
          color: var(--accent-contrast);
          border: 1px solid var(--accent);
          box-shadow: 0 6px 20px -12px var(--accent);
          transition: opacity 0.15s ease, transform 0.1s ease, background 0.15s ease;
        }
        .login-submit:hover:not(:disabled) {
          background: var(--accent-hover);
          border-color: var(--accent-hover);
          transform: translateY(-1px);
        }
        .login-submit:active:not(:disabled) { transform: scale(0.985) translateY(0); }
        .login-submit:disabled { opacity: 0.45; box-shadow: none; }
        .login-dot {
          width: 7px; height: 7px; border-radius: 50%;
        }
        .login-dot-live {
          animation: loginPulse 1.9s ease-out infinite;
        }
        @keyframes loginPulse {
          0%   { box-shadow: 0 0 0 0 color-mix(in srgb, var(--positive) 60%, transparent); }
          70%  { box-shadow: 0 0 0 7px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
        .login-shake { animation: loginShake 0.4s ease; }
        @keyframes loginShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-7px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(3px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .login-dot-live, .login-shake { animation: none; }
        }
      `}</style>
    </div>
  )
}
