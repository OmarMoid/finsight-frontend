// Uniform inline status banner.
//
// Toasts are right for something that just happened ("Added AAPL"); they are
// wrong for a panel that has no data because the API call failed, since the
// toast is gone three seconds later and the card is still empty. This is the
// in-place version: it says what failed, and offers the retry.
import { AlertTriangle, Info, RefreshCw, XCircle } from 'lucide-react'

const ICONS = {
  error: XCircle,
  warn: AlertTriangle,
  info: Info,
}

export default function Alert({ tone = 'error', title, children, onRetry, retryLabel = 'Retry' }) {
  const Icon = ICONS[tone] || Info

  return (
    <div className={`alert alert-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon size={16} />
      <div className="min-w-0 flex-1">
        {title && <div className="font-semibold">{title}</div>}
        {children && (
          <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: title ? 2 : 0 }}>
            {children}
          </div>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn"
          style={{ minHeight: 30, padding: '5px 10px', fontSize: 'inherit' }}
        >
          <RefreshCw size={13} />
          {retryLabel}
        </button>
      )}
    </div>
  )
}
