const SIZES = { sm: 16, md: 32, lg: 48 }

export default function LoadingSpinner({ size = 'md', label }) {
  const px = SIZES[size] || SIZES.md
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        style={{
          width: px,
          height: px,
          border: `${Math.max(2, px / 12)}px solid var(--border)`,
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      {label && <span className="text-sm text-[var(--text-muted)]">{label}</span>}
    </div>
  )
}

export function SkeletonBlock({ width = '100%', height = 16, radius = 6, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: radius,
      }}
    />
  )
}
