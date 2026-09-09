/** @type {import('tailwindcss').Config} */

// Fluid type scale. Every size interpolates between a phone value (at 375px
// viewport) and a desktop value (at 1280px), so the whole app gets a genuinely
// smaller, denser type scale on a phone without a single per-page media query —
// `text-2xl` is 21px on an iPhone and 24px on a Mac.
//
// Large sizes also get progressively tighter line-height and negative tracking,
// which is what stops big headline numbers reading as "web page" rather than
// "financial terminal".
const fluid = (minPx, maxPx, lineHeight, letterSpacing) => {
  const slope = ((maxPx - minPx) / (1280 - 375)) * 100 // vw
  const intercept = minPx - (slope / 100) * 375
  const rem = (px) => `${(px / 16).toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}rem`
  return [
    `clamp(${rem(minPx)}, ${rem(intercept)} + ${slope.toFixed(3)}vw, ${rem(maxPx)})`,
    { lineHeight, ...(letterSpacing ? { letterSpacing } : {}) },
  ]
}

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // phone → desktop
        '2xs': fluid(10, 11, '1.4'),
        xs: fluid(11, 12, '1.45'),
        sm: fluid(13, 14, '1.5'),
        base: fluid(15, 16, '1.55'),
        lg: fluid(16, 18, '1.45', '-0.005em'),
        xl: fluid(18, 20, '1.35', '-0.01em'),
        '2xl': fluid(21, 24, '1.25', '-0.014em'),
        '3xl': fluid(24, 30, '1.18', '-0.018em'),
        '4xl': fluid(28, 36, '1.12', '-0.022em'),
        '5xl': fluid(34, 48, '1.05', '-0.028em'),
      },
      colors: {
        // Mapped to the CSS variables defined in index.css / themes.js.
        bg: 'var(--bg)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-card': 'var(--bg-card)',
        'bg-card-hover': 'var(--bg-card-hover)',
        'bg-input': 'var(--bg-input)',
        border: 'var(--border)',
        'border-light': 'var(--border-light)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-green': 'var(--accent-green)',
        'accent-red': 'var(--accent-red)',
        'accent-gold': 'var(--accent-gold)',
        'accent-purple': 'var(--accent-purple)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        positive: 'var(--positive)',
        negative: 'var(--negative)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        control: 'var(--radius-control)',
      },
      screens: {
        // Explicit phone-only breakpoint for the handful of places that need to
        // target the compact layout rather than opt out of the wide one.
        phone: { max: '767px' },
      },
    },
  },
  plugins: [],
}
