// FinSight themes.
//
// Cut from ten to five. Ten meant most of them were near-duplicates that never
// got tuned properly — three barely-different dark blues, and a couple whose
// text/background pairs failed contrast outright. Each of the five below is a
// distinct, deliberate choice, and each defines the *full* variable set so no
// theme silently inherits another's shadows or accent tints.
//
// Every foreground/background pair here targets at least WCAG AA (4.5:1) for
// body text and 3:1 for large text and UI borders.

// Shared semantic scaffolding so a theme only overrides what genuinely differs.
const shadow = (a, b) => ({
  shadowSm: `0 1px 2px rgba(0,0,0,${a})`,
  shadowCard: `0 1px 2px rgba(0,0,0,${a}), 0 8px 24px -8px rgba(0,0,0,${b})`,
  shadowLg: `0 8px 32px -8px rgba(0,0,0,${b}), 0 24px 64px -24px rgba(0,0,0,${b})`,
})

export const THEMES = {
  // ── 0. Bloomberg Dark — the desk default ────────────────────────────────
  // The four anchor values (#090D16 / #121824 / #F8FAFC / #94A3B8) and the
  // bullish/bearish pair (#10B981 / #EF4444) are fixed by the design spec;
  // everything else is derived from them so the surfaces step evenly rather
  // than being eyeballed. Amber carries the accent because green and red are
  // spoken for — on a financial screen those two colours must only ever mean
  // "up" and "down", never "this is a link".
  bloomberg_dark: {
    bg: '#090D16',
    bgSecondary: '#0d121e',
    bgCard: '#121824',
    bgCardHover: '#182031',
    bgElevated: '#1c2536',
    bgInput: '#0c1220',
    border: '#1f2839',
    borderLight: '#2d395a',
    accent: '#f59e0b',
    accentHover: '#d98806',
    accentContrast: '#160d00',
    accentSoft: 'rgba(245,158,11,0.13)',
    accentBorder: 'rgba(245,158,11,0.42)',
    accentGreen: '#10B981',
    accentRed: '#EF4444',
    accentGold: '#fbbf24',
    accentPurple: '#a78bfa',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748b',
    navBg: 'rgba(9,13,22,0.86)',
    chartGrid: '#1b2334',
    chartLine: '#f59e0b',
    positive: '#10B981',
    negative: '#EF4444',
    ring: 'rgba(245,158,11,0.4)',
    overlay: 'rgba(4,6,11,0.76)',
    gradientAccent: 'linear-gradient(135deg,#fbbf24 0%,#e08c05 100%)',
    ...shadow(0.45, 0.65),
    isDark: true,
  },

  // ── 0b. Executive Light — pure white, corporate blue ────────────────────
  // Distinct from Daylight below: that one is a soft grey-blue page, this one
  // is genuinely white with #F8FAFC cards, per spec. The green/red pair is
  // *not* the dark theme's — #10B981 on white is 2.5:1 and fails badly as text,
  // so the semantics are preserved with darker, AA-passing equivalents.
  executive_light: {
    bg: '#FFFFFF',
    bgSecondary: '#F1F5F9',
    bgCard: '#F8FAFC',
    bgCardHover: '#eef2f7',
    bgElevated: '#FFFFFF',
    bgInput: '#FFFFFF',
    border: '#E2E8F0',
    borderLight: '#CBD5E1',
    accent: '#1E40AF',
    accentHover: '#1e3a8a',
    accentContrast: '#FFFFFF',
    accentSoft: 'rgba(30,64,175,0.08)',
    accentBorder: 'rgba(30,64,175,0.34)',
    accentGreen: '#047857',
    accentRed: '#be123c',
    accentGold: '#a16207',
    accentPurple: '#5b21b6',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    navBg: 'rgba(255,255,255,0.88)',
    chartGrid: '#eef2f7',
    chartLine: '#1E40AF',
    positive: '#047857',
    negative: '#be123c',
    ring: 'rgba(30,64,175,0.3)',
    overlay: 'rgba(15,23,42,0.44)',
    gradientAccent: 'linear-gradient(135deg,#2b52c8 0%,#1E40AF 100%)',
    shadowSm: '0 1px 2px rgba(15,23,42,0.05)',
    shadowCard: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -14px rgba(15,23,42,0.16)',
    shadowLg: '0 12px 32px -14px rgba(15,23,42,0.18), 0 32px 64px -32px rgba(15,23,42,0.2)',
    isDark: false,
  },

  // ── 1. Midnight Blue — the original FinSight look ───────────────────────
  dark_navy: {
    bg: '#080c17',
    bgSecondary: '#0d1424',
    bgCard: '#111a2e',
    bgCardHover: '#17233d',
    bgElevated: '#1b2842',
    bgInput: '#0a1120',
    border: '#1f2f4d',
    borderLight: '#2a3d61',
    accent: '#4d8dff',
    accentHover: '#2f74f0',
    accentContrast: '#04101f',
    accentSoft: 'rgba(77,141,255,0.14)',
    accentBorder: 'rgba(77,141,255,0.42)',
    accentGreen: '#2ee08a',
    accentRed: '#ff5f6d',
    accentGold: '#f5b53d',
    accentPurple: '#9b7bff',
    textPrimary: '#e8eefb',
    textSecondary: '#9dabc7',
    textMuted: '#6a7a99',
    navBg: 'rgba(8,12,23,0.82)',
    chartGrid: '#1f2f4d',
    chartLine: '#4d8dff',
    positive: '#2ee08a',
    negative: '#ff5f6d',
    ring: 'rgba(77,141,255,0.45)',
    overlay: 'rgba(4,8,16,0.72)',
    gradientAccent: 'linear-gradient(135deg,#5b9bff 0%,#2f6fe0 100%)',
    ...shadow(0.35, 0.55),
    isDark: true,
  },

  // ── 2. Obsidian — true black, for OLED phones ──────────────────────────
  dark_midnight: {
    bg: '#000000',
    bgSecondary: '#070708',
    bgCard: '#0e0e11',
    bgCardHover: '#16161a',
    bgElevated: '#1c1c21',
    bgInput: '#08080a',
    border: '#26262c',
    borderLight: '#35353d',
    accent: '#8b7dff',
    accentHover: '#7566f5',
    accentContrast: '#0a0812',
    accentSoft: 'rgba(139,125,255,0.15)',
    accentBorder: 'rgba(139,125,255,0.45)',
    accentGreen: '#3ddc84',
    accentRed: '#ff6b7d',
    accentGold: '#ffc94d',
    accentPurple: '#b794ff',
    textPrimary: '#f4f4f6',
    textSecondary: '#a5a5b0',
    textMuted: '#71717d',
    navBg: 'rgba(0,0,0,0.86)',
    chartGrid: '#1e1e23',
    chartLine: '#8b7dff',
    positive: '#3ddc84',
    negative: '#ff6b7d',
    ring: 'rgba(139,125,255,0.5)',
    overlay: 'rgba(0,0,0,0.8)',
    gradientAccent: 'linear-gradient(135deg,#9b8dff 0%,#6a5af0 100%)',
    ...shadow(0.6, 0.85),
    isDark: true,
  },

  // ── 3. Graphite — neutral slate, no colour cast ────────────────────────
  dark_slate: {
    bg: '#101216',
    bgSecondary: '#16191f',
    bgCard: '#1b1f26',
    bgCardHover: '#232832',
    bgElevated: '#2a303b',
    bgInput: '#13161b',
    border: '#2b313b',
    borderLight: '#3a414e',
    accent: '#31c9e8',
    accentHover: '#17aecd',
    accentContrast: '#04161c',
    accentSoft: 'rgba(49,201,232,0.14)',
    accentBorder: 'rgba(49,201,232,0.42)',
    accentGreen: '#34d399',
    accentRed: '#f8717f',
    accentGold: '#fbbf24',
    accentPurple: '#a78bfa',
    textPrimary: '#e9ecf1',
    textSecondary: '#a3abb8',
    textMuted: '#727a88',
    navBg: 'rgba(16,18,22,0.85)',
    chartGrid: '#2b313b',
    chartLine: '#31c9e8',
    positive: '#34d399',
    negative: '#f8717f',
    ring: 'rgba(49,201,232,0.45)',
    overlay: 'rgba(8,10,13,0.75)',
    gradientAccent: 'linear-gradient(135deg,#43d6f2 0%,#0e93b3 100%)',
    ...shadow(0.4, 0.6),
    isDark: true,
  },

  // ── 4. Terminal — the trading-desk classic ─────────────────────────────
  // The old version rendered *every* string in phosphor green, which looked
  // the part for about ten seconds and was unreadable after that. Amber and
  // green are kept for data and accents; body copy is a warm off-white.
  bloomberg_green: {
    bg: '#07090a',
    bgSecondary: '#0b0f10',
    bgCard: '#0f1416',
    bgCardHover: '#151d1f',
    bgElevated: '#1a2426',
    bgInput: '#090d0e',
    border: '#1d2a2b',
    borderLight: '#2a3b3c',
    accent: '#28e07a',
    accentHover: '#16c464',
    accentContrast: '#03120a',
    accentSoft: 'rgba(40,224,122,0.14)',
    accentBorder: 'rgba(40,224,122,0.45)',
    accentGreen: '#28e07a',
    accentRed: '#ff5a52',
    accentGold: '#ffb02e',
    accentPurple: '#c77dff',
    textPrimary: '#e6efe9',
    textSecondary: '#8fb0a1',
    textMuted: '#5f7a6d',
    navBg: 'rgba(7,9,10,0.88)',
    chartGrid: '#1d2a2b',
    chartLine: '#28e07a',
    positive: '#28e07a',
    negative: '#ff5a52',
    ring: 'rgba(40,224,122,0.45)',
    overlay: 'rgba(3,5,6,0.8)',
    gradientAccent: 'linear-gradient(135deg,#3bec8b 0%,#0fa758 100%)',
    ...shadow(0.5, 0.7),
    isDark: true,
  },

  // ── 5. Daylight — clean light mode ─────────────────────────────────────
  light_professional: {
    bg: '#f6f8fb',
    bgSecondary: '#eef2f7',
    bgCard: '#ffffff',
    bgCardHover: '#f6f8fb',
    bgElevated: '#ffffff',
    bgInput: '#ffffff',
    border: '#dfe5ee',
    borderLight: '#c6d0de',
    accent: '#1f66e0',
    accentHover: '#1550bd',
    accentContrast: '#ffffff',
    accentSoft: 'rgba(31,102,224,0.09)',
    accentBorder: 'rgba(31,102,224,0.35)',
    accentGreen: '#0f8a52',
    accentRed: '#cc2b3d',
    accentGold: '#b0730b',
    accentPurple: '#6d3fd6',
    textPrimary: '#0e1726',
    textSecondary: '#4a5769',
    textMuted: '#76839a',
    navBg: 'rgba(246,248,251,0.85)',
    chartGrid: '#e3e9f1',
    chartLine: '#1f66e0',
    positive: '#0f8a52',
    negative: '#cc2b3d',
    ring: 'rgba(31,102,224,0.35)',
    overlay: 'rgba(14,23,38,0.42)',
    gradientAccent: 'linear-gradient(135deg,#3b7ef0 0%,#1550bd 100%)',
    shadowSm: '0 1px 2px rgba(16,32,64,0.06)',
    shadowCard: '0 1px 2px rgba(16,32,64,0.05), 0 8px 24px -12px rgba(16,32,64,0.14)',
    shadowLg: '0 12px 32px -12px rgba(16,32,64,0.18), 0 32px 64px -32px rgba(16,32,64,0.22)',
    isDark: false,
  },
}

export const THEME_NAMES = {
  bloomberg_dark: {
    label: 'Bloomberg Dark',
    description: 'Near-black desk terminal with amber accents - the default',
  },
  executive_light: {
    label: 'Executive Light',
    description: 'Pure white with corporate blue - for boardrooms and printing',
  },
  dark_navy: {
    label: 'Midnight Blue',
    description: 'Deep navy with a bright blue accent - the FinSight default',
  },
  dark_midnight: {
    label: 'Obsidian',
    description: 'True black with violet accents - best on an OLED phone',
  },
  dark_slate: {
    label: 'Graphite',
    description: 'Neutral slate greys with a cyan accent - no colour cast',
  },
  bloomberg_green: {
    label: 'Terminal',
    description: 'Trading-desk green on near-black, with readable body text',
  },
  light_professional: {
    label: 'Daylight',
    description: 'Clean white - for bright rooms and printing',
  },
}

export const DEFAULT_THEME = 'bloomberg_dark'

/** The light counterpart, for first-load OS-preference detection and for the
 *  header's one-tap light/dark flip. */
export const DEFAULT_LIGHT_THEME = 'executive_light'

/** Display order for every theme picker in the app — the two spec'd themes
 *  lead, the five older ones follow. Deriving pickers from this (rather than
 *  from Object.keys) keeps Settings and the header menu from drifting apart. */
export const THEME_ORDER = [
  'bloomberg_dark',
  'executive_light',
  'dark_navy',
  'dark_midnight',
  'dark_slate',
  'bloomberg_green',
  'light_professional',
]

// Themes that used to exist, mapped to their closest surviving relative so a
// saved preference upgrades to something intentional rather than silently
// snapping back to the default.
const RETIRED_THEMES = {
  dark_emerald: 'dark_slate',
  nebula: 'dark_midnight',
  ocean: 'dark_slate',
  crimson: 'dark_midnight',
  light_warm: 'light_professional',
}

/** Resolve any stored theme key (including retired ones) to a live theme key. */
export function resolveThemeKey(key) {
  if (THEMES[key]) return key
  return RETIRED_THEMES[key] || DEFAULT_THEME
}

// Maps camelCase theme keys to CSS variable names
const CSS_VAR_MAP = {
  bg: '--bg',
  bgSecondary: '--bg-secondary',
  bgCard: '--bg-card',
  bgCardHover: '--bg-card-hover',
  bgElevated: '--bg-elevated',
  bgInput: '--bg-input',
  border: '--border',
  borderLight: '--border-light',
  accent: '--accent',
  accentHover: '--accent-hover',
  accentContrast: '--accent-contrast',
  accentSoft: '--accent-soft',
  accentBorder: '--accent-border',
  accentGreen: '--accent-green',
  accentRed: '--accent-red',
  accentGold: '--accent-gold',
  accentPurple: '--accent-purple',
  textPrimary: '--text-primary',
  textSecondary: '--text-secondary',
  textMuted: '--text-muted',
  navBg: '--nav-bg',
  chartGrid: '--chart-grid',
  chartLine: '--chart-line',
  positive: '--positive',
  negative: '--negative',
  ring: '--ring',
  overlay: '--overlay',
  shadowSm: '--shadow-sm',
  shadowCard: '--shadow-card',
  shadowLg: '--shadow-lg',
  gradientAccent: '--gradient-accent',
}

export function applyTheme(themeKey) {
  const key = resolveThemeKey(themeKey)
  const theme = THEMES[key]
  const root = document.documentElement

  Object.entries(CSS_VAR_MAP).forEach(([prop, cssVar]) => {
    if (theme[prop] !== undefined) {
      root.style.setProperty(cssVar, theme[prop])
    }
  })

  // Toggle dark/light class for Tailwind darkMode: 'class'
  root.classList.toggle('dark', !!theme.isDark)
  // Native form controls (date pickers, scrollbars, autofill) follow this.
  root.style.colorScheme = theme.isDark ? 'dark' : 'light'
}

export function getThemeValue(varName) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim()
}
