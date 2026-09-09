import { useState, useRef } from 'react'
import { Upload, X, Check, AlertTriangle, FileUp, ClipboardPaste } from 'lucide-react'
import toast from 'react-hot-toast'
import { watchlistAPI } from '../../utils/api'
import LoadingSpinner from '../common/LoadingSpinner'
import { formatNumber } from '../../utils/formatters'

/**
 * Bulk watchlist import.
 *
 * Neither Yahoo Finance nor Webull has a public watchlist API, so there is no
 * "connect your account" path to build — that is a limitation of theirs, not a
 * shortcut taken here. What both *can* do is produce a list of tickers: Yahoo
 * exports a portfolio to CSV from its web UI, and Webull's watchlist can be
 * selected and copied. Both land in the same place, so this panel takes either
 * a pasted list or a CSV file and treats them identically.
 *
 * The flow is preview-then-commit on purpose. A naive importer writes whatever
 * it parsed, and the failure mode is a watchlist quietly full of rows that
 * resolve to nothing — a header cell read as a ticker, a column of quantities,
 * an ASX symbol missing its `.AX`. Every candidate is checked against live
 * data first and shown with its real name and price, so what gets written is
 * what was actually confirmed on screen.
 */
export default function ImportPanel({ onClose, onImported }) {
  const [text, setText] = useState('')
  const [suffix, setSuffix] = useState('')
  const [preview, setPreview] = useState(null)
  const [selected, setSelected] = useState({})
  const [busy, setBusy] = useState(false)
  const [fileName, setFileName] = useState(null)
  const fileRef = useRef(null)

  const readFile = async (file) => {
    if (!file) return
    // Read locally and drop the contents into the same textarea the paste
    // path uses: one code path to the server, and the user can see and edit
    // exactly what is about to be parsed.
    try {
      const contents = await file.text()
      setText(contents)
      setFileName(file.name)
      setPreview(null)
    } catch {
      toast.error("Couldn't read that file")
    }
  }

  const runPreview = async () => {
    if (!text.trim()) {
      toast.error('Paste some tickers or choose a CSV first')
      return
    }
    setBusy(true)
    const result = await watchlistAPI.previewImport({ text, suffix })
    setBusy(false)
    if (result?.error) {
      toast.error('Import check failed - is the backend reachable?')
      return
    }
    setPreview(result)
    // Everything valid starts selected; deselecting is the rarer action.
    setSelected(Object.fromEntries((result.valid || []).map((v) => [v.symbol, true])))
  }

  const commit = async () => {
    const symbols = (preview?.valid || []).filter((v) => selected[v.symbol]).map((v) => v.symbol)
    if (!symbols.length) {
      toast.error('Nothing selected to import')
      return
    }
    setBusy(true)
    const result = await watchlistAPI.commitImport({ symbols })
    setBusy(false)
    if (result?.error) {
      toast.error('Import failed')
      return
    }
    toast.success(
      `Added ${result.added.length} symbol${result.added.length === 1 ? '' : 's'}` +
      (result.skipped.length ? ` · ${result.skipped.length} already tracked` : '')
    )
    onImported?.()
    onClose?.()
  }

  const selectedCount = Object.values(selected).filter(Boolean).length

  return (
    <section className="card">
      <div className="card-head">
        <div className="min-w-0">
          <h2 className="card-title">Import a watchlist</h2>
          <p className="text-2xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
            From a Yahoo Finance CSV export, any CSV with a symbol column, or a list you paste.
          </p>
        </div>
        <button className="btn shrink-0" onClick={onClose} aria-label="Close import panel">
          <X size={14} />
        </button>
      </div>

      {/* How to get the list out of each app. Written out because "import your
          watchlist" is only useful if you know where the export button is —
          and in Webull's case, that there isn't one. */}
      <details className="mt-2">
        <summary className="text-sm text-[var(--accent)] cursor-pointer">
          Where do I get the list from?
        </summary>
        <div className="mt-2 space-y-2.5 text-sm text-[var(--text-secondary)] leading-relaxed">
          <p>
            <span className="font-semibold text-[var(--text-primary)]">Yahoo Finance:</span>{' '}
            open your portfolio on the web, then the three-dot menu → Export. That downloads a
            CSV - choose it below.
          </p>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">Webull:</span>{' '}
            Webull has no export and no public API, so there is nothing to connect to. Select
            the tickers in your watchlist and copy them, then paste below - one per line or
            separated by commas both work.
          </p>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">Anything else:</span>{' '}
            any CSV with a column headed Symbol, Ticker or Code, or just a plain list of tickers.
          </p>
          <p className="text-[var(--text-muted)]">
            ASX tickers need the <span className="font-mono">.AX</span> suffix (BHP.AX). If your
            export has bare codes, set the suffix below and it will be added to any symbol that
            doesn&rsquo;t already have one.
          </p>
        </div>
      </details>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt,text/csv,text/plain"
          className="hidden"
          onChange={(e) => readFile(e.target.files?.[0])}
        />
        <button className="btn" onClick={() => fileRef.current?.click()}>
          <FileUp size={14} /> Choose CSV
        </button>
        {fileName && <span className="text-2xs text-[var(--text-muted)] font-mono">{fileName}</span>}
        <label className="flex items-center gap-1.5 text-2xs text-[var(--text-muted)] ml-auto">
          Add suffix
          <select
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            className="rounded px-1.5 py-1 text-2xs"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <option value="">None</option>
            <option value=".AX">.AX (ASX)</option>
            <option value=".L">.L (London)</option>
            <option value=".TO">.TO (Toronto)</option>
          </select>
        </label>
      </div>

      <div className="mt-3">
        <label className="section-label flex items-center gap-1.5 mb-1.5">
          <ClipboardPaste size={12} /> Tickers or CSV content
        </label>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setPreview(null) }}
          rows={6}
          spellCheck={false}
          placeholder={'AAPL\nMSFT\nBHP.AX\n\n…or paste a whole CSV here.'}
          className="input font-mono"
          style={{ minHeight: 120, resize: 'vertical', lineHeight: 1.6 }}
        />
      </div>

      <div className="flex items-center gap-2 mt-3">
        <button className="btn btn-primary" onClick={runPreview} disabled={busy || !text.trim()}>
          {busy && !preview ? <LoadingSpinner size="sm" /> : <Upload size={14} />}
          Check tickers
        </button>
        {preview && (
          <button className="btn" onClick={commit} disabled={busy || !selectedCount}>
            <Check size={14} /> Import {selectedCount || ''}
          </button>
        )}
      </div>

      {preview && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          {preview.reason && (
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{preview.reason}</p>
          )}

          {preview.valid?.length > 0 && (
            <>
              <div className="section-label mb-1.5">
                {preview.valid.length} found and confirmed against live data
              </div>
              <div>
                {preview.valid.map((row) => (
                  <label
                    key={row.symbol}
                    className="flex items-center gap-3 py-2 border-b last:border-0 cursor-pointer"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <input
                      type="checkbox"
                      checked={!!selected[row.symbol]}
                      onChange={(e) => setSelected((s) => ({ ...s, [row.symbol]: e.target.checked }))}
                      className="shrink-0"
                    />
                    <span className="font-mono font-semibold text-[var(--accent)] shrink-0" style={{ minWidth: 76 }}>
                      {row.symbol}
                    </span>
                    <span className="flex-1 min-w-0 text-sm text-[var(--text-secondary)] truncate">
                      {row.name}
                    </span>
                    <span className="text-sm font-mono text-[var(--text-primary)] shrink-0 whitespace-nowrap">
                      {formatNumber(row.price, 2)}
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}

          {preview.duplicates?.length > 0 && (
            <p className="text-sm text-[var(--text-muted)] mt-3 leading-relaxed">
              Already on your watchlist, so skipped:{' '}
              <span className="font-mono">{preview.duplicates.join(', ')}</span>
            </p>
          )}

          {preview.invalid?.length > 0 && (
            <div className="mt-3 flex items-start gap-2">
              <AlertTriangle size={14} className="text-[var(--accent-gold)] mt-0.5 shrink-0" />
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Couldn&rsquo;t resolve to a live instrument, so left out:{' '}
                <span className="font-mono">{preview.invalid.join(', ')}</span>.
                {' '}An ASX code may just need the <span className="font-mono">.AX</span> suffix above.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
