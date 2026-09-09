// Structured loading placeholders.
//
// The rule these follow: a skeleton must have the same geometry as the thing
// it stands in for. A card's worth of data arriving should not move anything
// on the page — no reflow, no scroll jump, no spinner-then-snap. That means
// skeletons are shaped per component, not one generic grey box reused
// everywhere.

export function Line({ w = '100%', h = 12, r = 4, className = '', style }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: typeof w === 'number' ? `${w}px` : w,
        height: typeof h === 'number' ? `${h}px` : h,
        borderRadius: r,
        ...style,
      }}
    />
  )
}

/** Label-over-value, matching .stat / MetricCard. */
export function SkeletonStat() {
  return (
    <div className="card">
      <Line w="52%" h={9} />
      <div style={{ height: 9 }} />
      <Line w="74%" h={20} r={5} />
    </div>
  )
}

export function SkeletonStatGrid({ count = 4, className = 'grid grid-cols-2 lg:grid-cols-4 gap-3' }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => <SkeletonStat key={i} />)}
    </div>
  )
}

/** Label-and-figure pairs for the inside of a card that is already drawn —
 *  the row shape used by Top Gainers, Global Markets and similar lists. */
export function SkeletonLines({ rows = 4 }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-3"
          style={{ paddingBlock: 9, borderTop: i ? '1px solid var(--border)' : undefined }}
        >
          <Line w={`${52 - i * 4}%`} h={11} />
          <Line w={54} h={11} />
        </div>
      ))}
    </div>
  )
}

/** A card with a heading rule and a few body lines. */
export function SkeletonCard({ lines = 3, title = true, height }) {
  return (
    <div className="card" style={height ? { height } : undefined}>
      {title && (
        <>
          <Line w={140} h={12} />
          <div style={{ height: 14 }} />
        </>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ marginTop: i ? 10 : 0 }}>
          <Line w={i === lines - 1 ? '62%' : '100%'} h={11} />
        </div>
      ))}
    </div>
  )
}

/** Header rule plus evenly spaced rows — the shape of a screener result set.
 *  Row height follows the live density setting so the switch doesn't make the
 *  placeholder disagree with the table that replaces it. */
export function SkeletonTable({ rows = 8, cols = 6 }) {
  return (
    <div className="card card-table" aria-hidden="true">
      <div
        className="flex items-center gap-4"
        style={{ padding: '11px var(--row-pad-x)', borderBottom: '1px solid var(--border)' }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Line key={i} w={i === 1 ? '26%' : '11%'} h={8} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex items-center gap-4"
          style={{
            padding: 'var(--row-pad-y) var(--row-pad-x)',
            background: r % 2 ? 'color-mix(in srgb, var(--text-primary) 3.5%, transparent)' : 'transparent',
          }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Line key={c} w={c === 1 ? '26%' : '11%'} h={11} style={{ opacity: 1 - r * 0.07 }} />
          ))}
        </div>
      ))}
    </div>
  )
}

/** A chart-shaped block: axis strip on the left, plot area filling the rest. */
export function SkeletonChart({ height = 300 }) {
  return (
    <div className="flex gap-3" style={{ height }} aria-hidden="true">
      <div className="flex flex-1 flex-col justify-between">
        <Line w="100%" h="72%" r={8} />
        <Line w="100%" h={9} />
      </div>
      <div className="flex flex-col justify-between" style={{ width: 40, paddingBottom: 18 }}>
        {Array.from({ length: 5 }).map((_, i) => <Line key={i} w="100%" h={8} />)}
      </div>
    </div>
  )
}

/** Stacked rows for the phone card-list variants of the wide tables. */
export function SkeletonRows({ rows = 6 }) {
  return (
    <div className="card card-table" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3"
          style={{
            padding: '12px 14px',
            borderTop: i ? '1px solid var(--border)' : undefined,
          }}
        >
          <div className="min-w-0 flex-1">
            <Line w={64} h={12} />
            <div style={{ height: 7 }} />
            <Line w="70%" h={9} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Line w={56} h={12} />
            <Line w={40} h={9} />
          </div>
        </div>
      ))}
    </div>
  )
}
