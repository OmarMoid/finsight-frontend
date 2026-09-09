import { getChangeCSSVar } from '../../utils/formatters'

export default function MetricCard({ label, value, sub, change, color, onClick, tooltip }) {
  const changeColor = change !== undefined && change !== null ? getChangeCSSVar(change) : null

  return (
    <div
      onClick={onClick}
      title={tooltip || undefined}
      className="card"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-label">{label}</div>
      <div
        className="mt-1 text-xl font-semibold font-mono"
        style={{ color: color || 'var(--text-primary)' }}
      >
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-[var(--text-secondary)]">{sub}</div>}
      {change !== undefined && change !== null && (
        <div className="mt-1 text-sm font-semibold font-mono" style={{ color: changeColor }}>
          {change > 0 ? '▲' : change < 0 ? '▼' : '-'} {typeof change === 'number' ? Math.abs(change).toFixed(2) : change}
          {typeof change === 'number' ? '%' : ''}
        </div>
      )}
    </div>
  )
}
