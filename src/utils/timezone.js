/**
 * App-wide display timezone.
 *
 * Every clock in FinSight — market open/closed, "how long ago" on a headline,
 * an earnings date, the time a quote was captured — used to render in whatever
 * zone the device happened to be in. That is wrong for this app specifically:
 * the interesting question is almost never "what time is it here?" but "is New
 * York open?" or "when did that print land in Sydney?". Travelling, or holding
 * ASX names from the US, made the whole app quietly misleading.
 *
 * So a single preference (`settings.timezone`) drives every formatted time.
 * `'auto'` means the device zone, which stays the sensible default.
 *
 * Everything here is built on `Intl`, which ships in every browser and in
 * WKWebView, so no timezone database is bundled and DST is handled by the
 * platform rather than by us.
 */

/** The device's own IANA zone, e.g. "Australia/Sydney". */
export function deviceTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

/** Resolve a stored preference (which may be 'auto') to a real IANA zone. */
export function resolveTimeZone(preference) {
  if (!preference || preference === 'auto') return deviceTimeZone()
  // A zone that the platform rejects (a stale preference, a typo) must not
  // take the whole page down — every Intl call below would throw a RangeError.
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: preference })
    return preference
  } catch {
    return deviceTimeZone()
  }
}

/**
 * The zones worth offering. Deliberately a short, curated list of market
 * centres plus UTC rather than the ~400 IANA zones: this is a "which market's
 * clock am I on?" control, not a system settings panel.
 */
export const TIME_ZONES = [
  { value: 'auto', label: 'Device timezone', group: 'Default' },
  { value: 'Australia/Sydney', label: 'Sydney (ASX)', group: 'Asia-Pacific' },
  { value: 'Australia/Perth', label: 'Perth', group: 'Asia-Pacific' },
  { value: 'Asia/Tokyo', label: 'Tokyo (TSE)', group: 'Asia-Pacific' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKEX)', group: 'Asia-Pacific' },
  { value: 'Asia/Singapore', label: 'Singapore (SGX)', group: 'Asia-Pacific' },
  { value: 'Asia/Shanghai', label: 'Shanghai (SSE)', group: 'Asia-Pacific' },
  { value: 'Europe/London', label: 'London (LSE)', group: 'Europe' },
  { value: 'Europe/Frankfurt', label: 'Frankfurt (XETRA)', group: 'Europe' },
  { value: 'Europe/Zurich', label: 'Zurich (SIX)', group: 'Europe' },
  { value: 'America/New_York', label: 'New York (NYSE / NASDAQ)', group: 'Americas' },
  { value: 'America/Chicago', label: 'Chicago (CME)', group: 'Americas' },
  { value: 'America/Los_Angeles', label: 'Los Angeles', group: 'Americas' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (B3)', group: 'Americas' },
  { value: 'UTC', label: 'UTC', group: 'Other' },
]

export const TIME_ZONE_GROUPS = ['Default', 'Asia-Pacific', 'Europe', 'Americas', 'Other']

/** Short offset label for a zone right now, e.g. "GMT+10". */
export function zoneOffsetLabel(timeZone) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: resolveTimeZone(timeZone),
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date())
    return parts.find((p) => p.type === 'timeZoneName')?.value || ''
  } catch {
    return ''
  }
}

// Which locale yields a real abbreviation depends on the zone: en-US knows
// "EDT" and "PST" but renders Sydney as "GMT+10", while en-AU knows "AEST" and
// en-GB knows "BST". So a few locales are tried and the first genuine
// abbreviation wins, with the numeric offset as the honest fallback.
const _ABBREV_LOCALES = ['en-AU', 'en-GB', 'en-US']

/** Short zone abbreviation, e.g. "AEST". Falls back to the numeric offset. */
export function zoneAbbreviation(timeZone) {
  const zone = resolveTimeZone(timeZone)
  for (const locale of _ABBREV_LOCALES) {
    try {
      const parts = new Intl.DateTimeFormat(locale, {
        timeZone: zone,
        timeZoneName: 'short',
      }).formatToParts(new Date())
      const value = parts.find((p) => p.type === 'timeZoneName')?.value
      // "GMT+10" / "UTC+5:30" are offsets wearing an abbreviation's slot.
      if (value && !/^(GMT|UTC)/i.test(value)) return value
    } catch {
      // Try the next locale rather than giving up on the whole label.
    }
  }
  return zoneOffsetLabel(timeZone) || ''
}

function asDate(value) {
  if (value == null) return null
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value
  if (typeof value === 'number') {
    // Unix seconds vs milliseconds: anything under ~1e12 is seconds, which
    // covers every timestamp from 1970 until the year 33658.
    const d = new Date(value < 1e12 ? value * 1000 : value)
    return isNaN(d.getTime()) ? null : d
  }
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

/** "14:32" in the chosen zone. */
export function formatTimeIn(value, timeZone, { seconds = false } = {}) {
  const d = asDate(value)
  if (!d) return '-'
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: resolveTimeZone(timeZone),
      hour: '2-digit',
      minute: '2-digit',
      ...(seconds ? { second: '2-digit' } : {}),
      hour12: false,
    }).format(d)
  } catch {
    return '-'
  }
}

/** "28 Aug 2026, 14:32" in the chosen zone. */
export function formatDateTimeIn(value, timeZone, { withZone = false } = {}) {
  const d = asDate(value)
  if (!d) return '-'
  try {
    const text = new Intl.DateTimeFormat('en-GB', {
      timeZone: resolveTimeZone(timeZone),
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d)
    return withZone ? `${text} ${zoneAbbreviation(timeZone)}` : text
  } catch {
    return '-'
  }
}

/** "Friday 28 August 2026" in the chosen zone — the dashboard's date line. */
export function formatLongDateIn(value, timeZone) {
  const d = asDate(value) || new Date()
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: resolveTimeZone(timeZone),
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch {
    return '-'
  }
}

/**
 * Wall-clock parts for an instant in a given zone. The building block for
 * every market-hours calculation: comparing "now" against a market's opening
 * bell only works in that market's own local time.
 */
export function zonedParts(date, timeZone) {
  const d = asDate(date) || new Date()
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: resolveTimeZone(timeZone),
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d)
  const get = (type) => parts.find((p) => p.type === type)?.value
  // `hour12: false` yields "24" for midnight in some engines rather than "00".
  let hour = parseInt(get('hour'), 10)
  if (hour === 24) hour = 0
  return {
    weekday: get('weekday'),
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour,
    minute: Number(get('minute')),
    minutesSinceMidnight: hour * 60 + Number(get('minute')),
  }
}

/**
 * Whether a market is open, plus the time on both the market's own clock and
 * the user's chosen display clock.
 *
 * `openMin`/`closeMin` are minutes since midnight *in the market's* zone —
 * that never changes with the user's preference, which is the whole point:
 * the NYSE bell is 09:30 in New York whether you are reading from Sydney or
 * from Zurich. Public holidays are not modelled.
 */
export function marketStatus(marketZone, openMin, closeMin, displayZone) {
  const now = new Date()
  const local = zonedParts(now, marketZone)
  const isWeekday = !['Sat', 'Sun'].includes(local.weekday)
  const open = isWeekday && local.minutesSinceMidnight >= openMin && local.minutesSinceMidnight < closeMin

  let untilLabel = null
  if (isWeekday) {
    const delta = open ? closeMin - local.minutesSinceMidnight : openMin - local.minutesSinceMidnight
    if (delta > 0) {
      const hours = Math.floor(delta / 60)
      const mins = delta % 60
      untilLabel = `${open ? 'closes' : 'opens'} in ${hours ? `${hours}h ` : ''}${mins}m`
    }
  }

  return {
    open,
    marketTime: formatTimeIn(now, marketZone),
    marketZoneLabel: zoneAbbreviation(marketZone),
    displayTime: formatTimeIn(now, displayZone),
    displayZoneLabel: zoneAbbreviation(displayZone),
    untilLabel,
  }
}

/**
 * "3 hours ago". Elapsed time is zone-independent — an instant is an instant —
 * so this takes no zone; it exists here so callers have one import for time.
 */
export function timeAgoFrom(value) {
  const d = asDate(value)
  if (!d) return '-'
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 45) return 'just now'
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [label, secs] of units) {
    const count = Math.floor(seconds / secs)
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`
  }
  return 'just now'
}
