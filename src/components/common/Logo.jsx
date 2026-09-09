// The FinSight mark.
//
// Replaces the plain "F" tile: a proper F on the left (stem, top arm, shorter
// mid arm) paired with three ascending bars and a trend line on the right —
// "Fin" and "Sight" in one glyph. The two halves are kept clearly separated;
// an earlier draft ran the trend line across the F and the whole thing read as
// an H. Drawn as inline SVG rather than a raster asset so it stays crisp at
// every size, follows the active theme's accent, and costs no extra request.

import { useId } from 'react'

export function LogoMark({ size = 32, rounded = true, className = '', title = 'FinSight' }) {
  const r = rounded ? 7 : 0
  // The navbar renders two marks (phone and desktop shells) and one of them is
  // always display:none. With a hard-coded gradient id, every `url(#…)` in the
  // document resolved to whichever definition came first — sometimes the one
  // inside the hidden subtree — and the visible mark painted as nothing.
  const gradientId = `fs-logo-${useId().replace(/:/g, '')}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-hover)" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="32" height="32" rx={r} fill={`url(#${gradientId})`} />

      {/* The F: stem, full top arm, shorter mid arm. */}
      <g fill="var(--accent-contrast)">
        <rect x="6" y="6" width="2.4" height="20" rx="1.2" />
        <rect x="6" y="6" width="7.6" height="2.4" rx="1.2" />
        <rect x="6" y="14.8" width="5.8" height="2.4" rx="1.2" opacity="0.75" />
      </g>

      {/* Ascending bars — the "Sight" half: data read at a glance. */}
      <g fill="var(--accent-contrast)">
        <rect x="16" y="19" width="2.6" height="7" rx="1.3" opacity="0.5" />
        <rect x="20.2" y="15.5" width="2.6" height="10.5" rx="1.3" opacity="0.72" />
        <rect x="24.4" y="11" width="2.6" height="15" rx="1.3" opacity="0.95" />
      </g>

      {/* Trend line, sitting clear above the bar tops. */}
      <path
        d="M16.8 16.6 L21.4 12.9 L25.6 8.5"
        stroke="var(--accent-contrast)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <circle cx="25.6" cy="8.5" r="1.9" fill="var(--accent-contrast)" />
    </svg>
  )
}

/** Mark plus wordmark, for the login screen and the desktop navbar. */
export default function Logo({ size = 32, showWordmark = true, wordmarkClass = '', gap = 10 }) {
  return (
    <span className="inline-flex items-center" style={{ gap }}>
      <LogoMark size={size} />
      {showWordmark && (
        <span
          className={wordmarkClass || 'text-base font-bold tracking-tight'}
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
        >
          FinSight
        </span>
      )}
    </span>
  )
}
