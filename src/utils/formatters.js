// ── Numeric formatting ───────────────────────────────────────────────────

export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) return '-'
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function compactValue(num) {
  const abs = Math.abs(num)
  if (abs >= 1e12) return { value: num / 1e12, suffix: 'T' }
  if (abs >= 1e9) return { value: num / 1e9, suffix: 'B' }
  if (abs >= 1e6) return { value: num / 1e6, suffix: 'M' }
  if (abs >= 1e3) return { value: num / 1e3, suffix: 'K' }
  return { value: num, suffix: '' }
}

export function formatCurrency(num, currency = 'USD', compact = false) {
  if (num === null || num === undefined || isNaN(num)) return '-'
  const symbol = currency === 'AUD' ? 'A$' : '$'
  const sign = num < 0 ? '-' : ''

  if (compact) {
    const { value, suffix } = compactValue(Math.abs(num))
    return `${sign}${symbol}${formatNumber(value, 1)}${suffix}`
  }
  return `${sign}${symbol}${formatNumber(Math.abs(num), 2)}`
}

export function formatPercent(num, decimals = 2, showSign = true) {
  if (num === null || num === undefined || isNaN(num)) return '-'
  const sign = showSign && num > 0 ? '+' : ''
  return `${sign}${formatNumber(num, decimals)}%`
}

export function formatMarketCap(num) {
  return formatCurrency(num, 'USD', true)
}

export function formatVolume(num) {
  if (num === null || num === undefined || isNaN(num)) return '-'
  const { value, suffix } = compactValue(num)
  return `${formatNumber(value, suffix ? 1 : 0)}${suffix}`
}

// ── Date formatting ──────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function toDate(str) {
  if (!str) return null
  if (str instanceof Date) return isNaN(str.getTime()) ? null : str
  // Date-only strings ("YYYY-MM-DD", e.g. earnings dates) are calendar dates,
  // not instants. `new Date(str)` parses them as UTC midnight, so reading
  // them back with local getters (getDate/getMonth/getFullYear below) rolls
  // the date back a day in any timezone behind UTC. Parse the components
  // directly as local time instead.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str)
  const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(str)
  return isNaN(d.getTime()) ? null : d
}

export function formatDate(str) {
  const d = toDate(str)
  if (!d) return '-'
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function formatDateShort(str) {
  const d = toDate(str)
  if (!d) return '-'
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export function formatDateISO(str) {
  const d = toDate(str)
  if (!d) return '-'
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

// ── Colour helpers ───────────────────────────────────────────────────────

export function getChangeColor(change) {
  if (change > 0) return 'text-[var(--positive)]'
  if (change < 0) return 'text-[var(--negative)]'
  return 'text-[var(--text-secondary)]'
}

export function getChangeCSSVar(change) {
  if (change > 0) return 'var(--positive)'
  if (change < 0) return 'var(--negative)'
  return 'var(--text-secondary)'
}

export function getSignalColor(signal) {
  const s = String(signal || '').toLowerCase()
  if (['buy', 'strong buy', 'bullish', 'overweight'].includes(s)) return 'text-[var(--positive)]'
  if (['sell', 'strong sell', 'bearish', 'underweight'].includes(s)) return 'text-[var(--negative)]'
  return 'text-[var(--text-secondary)]'
}

// ── Indicator context ──────────────────────────────────────────────────────

export function getRSISignal(rsi) {
  if (rsi === null || rsi === undefined || isNaN(rsi)) {
    return { label: 'N/A', color: 'text-[var(--text-secondary)]', description: 'No data' }
  }
  if (rsi >= 70) {
    return { label: 'Overbought', color: 'text-[var(--negative)]', description: 'RSI ≥ 70 - potentially overextended, due for a pullback' }
  }
  if (rsi <= 30) {
    return { label: 'Oversold', color: 'text-[var(--positive)]', description: 'RSI ≤ 30 - potentially oversold, due for a bounce' }
  }
  return { label: 'Neutral', color: 'text-[var(--text-secondary)]', description: 'RSI between 30 and 70 - no extreme momentum' }
}

export function getPEContext(pe, sector) {
  if (pe === null || pe === undefined || isNaN(pe) || pe < 0) {
    return { label: 'N/A', color: 'text-[var(--text-secondary)]' }
  }
  if (pe < 10) return { label: 'Very Cheap', color: 'text-[var(--positive)]' }
  if (pe < 15) return { label: 'Cheap', color: 'text-[var(--positive)]' }
  if (pe < 20) return { label: 'Fair', color: 'text-[var(--text-secondary)]' }
  if (pe < 30) return { label: 'Elevated', color: 'text-[var(--accent-gold)]' }
  return { label: 'Expensive', color: 'text-[var(--negative)]' }
}

export function getAltmanZContext(z) {
  if (z === null || z === undefined || isNaN(z)) {
    return { label: 'N/A', color: 'text-[var(--text-secondary)]', description: 'No data' }
  }
  if (z >= 3) {
    return { label: 'Safe', color: 'text-[var(--positive)]', description: 'Z ≥ 3.0 - low bankruptcy risk' }
  }
  if (z >= 1.8) {
    return { label: 'Grey Zone', color: 'text-[var(--accent-gold)]', description: 'Z between 1.8 and 3.0 - moderate risk, monitor closely' }
  }
  return { label: 'Distress', color: 'text-[var(--negative)]', description: 'Z < 1.8 - elevated bankruptcy risk' }
}

export function getPiotroskiContext(f) {
  if (f === null || f === undefined || isNaN(f)) {
    return { label: 'N/A', color: 'text-[var(--text-secondary)]' }
  }
  if (f >= 7) return { label: 'Strong', color: 'text-[var(--positive)]' }
  if (f >= 4) return { label: 'Average', color: 'text-[var(--accent-gold)]' }
  return { label: 'Weak', color: 'text-[var(--negative)]' }
}

// ── Symbol / currency helpers ──────────────────────────────────────────────

export function symbolIsASX(symbol) {
  return typeof symbol === 'string' && symbol.toUpperCase().endsWith('.AX')
}

export function getCurrencySymbol(symbol) {
  return symbolIsASX(symbol) ? 'A$' : '$'
}

// ── Text helpers ───────────────────────────────────────────────────────────

export function truncate(text, maxLen) {
  if (!text) return ''
  if (text.length <= maxLen) return text
  return text.slice(0, Math.max(0, maxLen - 1)).trimEnd() + '…'
}

export function timeAgo(dateStr) {
  const d = toDate(dateStr)
  if (!d) return '-'
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 0) return 'just now'

  const units = [
    { label: 'year', secs: 31536000 },
    { label: 'month', secs: 2592000 },
    { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },
    { label: 'minute', secs: 60 },
  ]
  for (const { label, secs } of units) {
    const count = Math.floor(seconds / secs)
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`
  }
  return 'just now'
}
