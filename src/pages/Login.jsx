import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, LineChart, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react'
import { authAPI } from '../utils/api'
import { getApiBase, isNative } from '../utils/apiBase'
import useStore from '../store/useStore'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Logo from '../components/common/Logo'

const MAX_PASSCODE = 64

const HIGHLIGHTS = [
  { icon: LineChart, title: 'Live ASX & US coverage', body: 'Quotes, fundamentals, filings and macro in one workspace.' },
  { icon: Sparkles, title: 'Guru AI analyst', body: 'Grounded answers that read live market data before replying.' },
  { icon: ShieldCheck, title: 'Private by design', body: 'Your watchlist and research stay on your own backend.' },
]

export default function Login() {
  const [passcode, setPasscode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [reveal, setReveal] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  // Surface server reachability before the passcode is even typed — on the
  // phone this is a public backend that sleeps when idle, so a slow first
  // check is expected and shouldn't read as "broken."
  const [server, setServer] = useState({ state: 'checking' })
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const setAuthenticated = useStore((s) => s.setAuthenticated)
  const native = isNative()

  useEffect(() => {
    // Autofocus only where there's a hardware keyboard. On a touch screen it
    // would pop the system keyboard before the user has seen the page.
    if (window.matchMedia?.('(pointer: fine)').matches) inputRef.current?.focus()
  }, [])

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

  const submit = useCallback(async () => {
    if (!passcode || loading) return
    setLoading(true)
    setError('')

    const res = await authAPI.verify(passcode)
    setLoading(false)

    if (res?.valid) {
      setAuthenticated(true)
      navigate('/dashboard')
    } else {
      setError(
        res?.error
          ? 'Could not reach the server. Check the connection and try again.'
          : 'That passcode is incorrect. Please try again.'
      )
      setPasscode('')
      setShake(true)
      setTimeout(() => setShake(false), 420)
      inputRef.current?.focus()
    }
  }, [passcode, loading, navigate, setAuthenticated])

  const trackCaps = (e) => {
    if (typeof e.getModifierState === 'function') setCapsLock(e.getModifierState('CapsLock'))
  }

  const statusTone = {
    online: 'var(--positive)',
    offline: 'var(--negative)',
    waking: 'var(--accent-gold)',
    checking: 'var(--text-muted)',
  }[server.state]

  const statusText = {
    checking: 'Checking connection…',
    online: `Connected · v${server.version}`,
    waking: 'Waking the server…',
    offline: 'Server unreachable',
  }[server.state]

  return (
    <div className="login-root" style={{ background: 'var(--bg)' }}>
      {/* Brand panel — desktop only. A phone gets the compact lockup above the
          form instead, so the field is never pushed below the fold. */}
      <aside className="login-brand" aria-hidden="true">
        <div className="login-brand-glow" />
        <div className="login-brand-grid" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <Logo size={34} wordmarkClass="text-lg font-semibold tracking-tight" />
          <div>
            <h2 className="login-brand-title">
              Market intelligence,
              <br />
              without the noise.
            </h2>
            <ul className="mt-10 space-y-6">
              {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="login-brand-icon">
                    <Icon size={17} />
                  </span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {title}
                    </div>
                    <div className="mt-0.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {body}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            For informational purposes only. Not financial advice.
          </p>
        </div>
      </aside>

      <main className="login-main">
        <div className="w-full" style={{ maxWidth: 380 }}>
          <div className="login-compact-brand">
            <Logo size={40} showWordmark={false} />
          </div>

          <h1 className="login-heading">Sign in to FinSight</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Enter your passcode to open your workspace.
          </p>

          <form
            className={`mt-8 ${shake ? 'login-shake' : ''}`}
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
            noValidate
          >
            {/* Password managers key on a username field; a hidden one with a
                fixed value lets them save and fill the passcode correctly. */}
            <input
              type="text"
              name="username"
              autoComplete="username"
              value="finsight"
              readOnly
              hidden
            />

            <label htmlFor="passcode" className="login-label">
              Passcode
            </label>
            <div className={`login-field-wrap${error ? ' has-error' : ''}`}>
              <Lock size={16} className="login-field-icon" aria-hidden="true" />
              <input
                id="passcode"
                ref={inputRef}
                name="password"
                type={reveal ? 'text' : 'password'}
                autoComplete="current-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
                maxLength={MAX_PASSCODE}
                aria-invalid={!!error}
                aria-describedby={error ? 'passcode-error' : undefined}
                value={passcode}
                disabled={loading}
                onChange={(e) => {
                  setError('')
                  setPasscode(e.target.value)
                }}
                onKeyDown={trackCaps}
                onKeyUp={trackCaps}
                className="login-field"
                placeholder="Enter passcode"
              />
              <button
                type="button"
                className="login-reveal"
                onClick={() => setReveal((v) => !v)}
                aria-label={reveal ? 'Hide passcode' : 'Show passcode'}
                aria-pressed={reveal}
              >
                {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="login-hint" aria-live="polite">
              {error ? (
                <span id="passcode-error" className="flex items-center gap-1.5" style={{ color: 'var(--negative)' }}>
                  <AlertCircle size={13} /> {error}
                </span>
              ) : capsLock ? (
                <span style={{ color: 'var(--accent-gold)' }}>Caps Lock is on</span>
              ) : null}
            </div>

            <button type="submit" disabled={loading || !passcode} className="login-submit">
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  Continue <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="login-status">
            <span
              className={server.state === 'online' ? 'login-dot login-dot-live' : 'login-dot'}
              style={{ background: statusTone }}
            />
            <span>{statusText}</span>
          </div>

          {server.state === 'waking' && (
            <p className="login-note">
              The server sleeps after 15 minutes idle, so the first request can take up to a
              minute. Retrying automatically.
            </p>
          )}
          {server.state === 'offline' && (
            <p className="login-note">
              No response from <span className="font-mono">{server.base}</span>.{' '}
              {native
                ? 'If you’ve set a custom address in Settings, make sure that machine is running the backend. Otherwise the deployed server may be briefly down.'
                : 'Start the backend with python3 main.py in the backend folder.'}
            </p>
          )}
        </div>
      </main>

      <style>{`
        .login-root {
          display: grid;
          min-height: 100vh;
          min-height: 100dvh;
          width: 100%;
          grid-template-columns: 1fr;
        }
        @media (min-width: 1024px) {
          .login-root { grid-template-columns: minmax(420px, 46%) 1fr; }
        }

        .login-brand {
          display: none;
          position: relative;
          overflow: hidden;
          padding: 40px 48px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border);
        }
        @media (min-width: 1024px) { .login-brand { display: block; } }
        .login-brand-glow {
          position: absolute; left: -20%; bottom: -30%;
          width: 720px; height: 720px;
          background: radial-gradient(circle, var(--accent) 0%, transparent 60%);
          opacity: 0.14; filter: blur(80px); pointer-events: none;
        }
        .login-brand-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 48px 48px;
          opacity: 0.3;
          mask-image: linear-gradient(180deg, transparent, #000 40%, transparent);
          -webkit-mask-image: linear-gradient(180deg, transparent, #000 40%, transparent);
        }
        .login-brand-title {
          font-size: 2.25rem; line-height: 1.15; font-weight: 600;
          letter-spacing: -0.03em; color: var(--text-primary);
        }
        .login-brand-icon {
          display: flex; flex-shrink: 0; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 8px;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
        }

        /* Top-aligned on a phone, so the system keyboard opening from below
           never covers the field or the Continue button. */
        .login-main {
          display: flex; justify-content: center; align-items: flex-start;
          padding: calc(env(safe-area-inset-top) + 56px) 20px calc(env(safe-area-inset-bottom) + 32px);
        }
        @media (min-width: 640px) {
          .login-main { align-items: center; padding-top: 48px; padding-bottom: 48px; }
        }
        .login-compact-brand { margin-bottom: 28px; }
        @media (min-width: 1024px) { .login-compact-brand { display: none; } }

        .login-heading {
          font-size: 1.625rem; line-height: 1.2; font-weight: 600;
          letter-spacing: -0.02em; color: var(--text-primary);
        }
        .login-label {
          display: block; margin-bottom: 8px;
          font-size: 0.8125rem; font-weight: 500; color: var(--text-secondary);
        }
        .login-field-wrap { position: relative; }
        .login-field-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: var(--text-muted); pointer-events: none;
        }
        .login-field {
          width: 100%; height: 48px;
          padding: 0 46px 0 40px;
          border-radius: 8px; outline: none;
          /* 16px keeps iOS Safari from zooming the page on focus. */
          font-size: 16px;
          background: var(--bg-input);
          border: 1px solid var(--border-light);
          color: var(--text-primary);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .login-field::placeholder { color: var(--text-muted); }
        .login-field:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--ring);
        }
        .login-field-wrap.has-error .login-field {
          border-color: var(--negative);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--negative) 22%, transparent);
        }
        .login-reveal {
          position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 6px;
          color: var(--text-muted);
          transition: color 0.15s ease, background 0.15s ease;
        }
        .login-reveal:hover { color: var(--text-primary); background: var(--bg-card-hover); }
        .login-reveal:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
        .login-reveal[aria-pressed='true'] { color: var(--accent); }

        .login-hint {
          min-height: 20px; margin-top: 8px;
          font-size: 0.8125rem;
        }
        .login-submit {
          width: 100%; height: 48px; margin-top: 12px; border-radius: 8px;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 0.9375rem; font-weight: 600;
          background: var(--accent);
          color: var(--accent-contrast);
          transition: background 0.15s ease, opacity 0.15s ease;
        }
        .login-submit:hover:not(:disabled) { background: var(--accent-hover); }
        .login-submit:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .login-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .login-status {
          display: flex; align-items: center; gap: 8px;
          margin-top: 28px; padding-top: 20px;
          border-top: 1px solid var(--border);
          font-size: 0.75rem; color: var(--text-muted);
        }
        .login-note {
          margin-top: 10px; font-size: 0.75rem; line-height: 1.5;
          color: var(--text-muted);
        }
        .login-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .login-dot-live { animation: loginPulse 1.9s ease-out infinite; }
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
