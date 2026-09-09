// Global row-density switch. Sits in the header rather than on the Screener
// because it changes every table in the app at once, and because the moment
// you want it is mid-scan, not in Settings.
import { Rows2, Rows4 } from 'lucide-react'
import useStore from '../../store/useStore'

const MODES = [
  { key: 'comfortable', icon: Rows2, label: 'Comfortable', hint: 'Roomy rows for reading' },
  { key: 'compact', icon: Rows4, label: 'Compact', hint: 'Dense rows for screening' },
]

export default function DensityToggle({ showLabels = false }) {
  const density = useStore((s) => s.density)
  const setDensity = useStore((s) => s.setDensity)

  return (
    <div className="segmented" role="group" aria-label="Table row density">
      {MODES.map(({ key, icon: Icon, label, hint }) => (
        <button
          key={key}
          onClick={() => setDensity(key)}
          aria-pressed={density === key}
          title={`${label} - ${hint}`}
          style={{ padding: showLabels ? undefined : '7px 9px' }}
        >
          <span className="flex items-center gap-1.5">
            <Icon size={14} />
            {showLabels && label}
          </span>
        </button>
      ))}
    </div>
  )
}
