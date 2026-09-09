import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, TrendingUp, BarChart3 } from 'lucide-react'
import useStore from '../store/useStore'

// ── Symbol → TradingView format ──────────────────────────────────────────────
// FinSight uses Yahoo-style symbols (AAPL, BHP.AX). TradingView wants an
// exchange-qualified symbol for ASX listings; bare US tickers resolve fine.
function tvSymbol(sym) {
  if (!sym) return 'NASDAQ:AAPL'
  const s = sym.trim().toUpperCase()
  if (s.endsWith('.AX')) return `ASX:${s.slice(0, -3)}`
  return s
}

// ── Viewport helper ──────────────────────────────────────────────────────────
// TradingView's advanced chart is unusable on a phone with the drawing toolbar
// and details pane switched on, so the config is narrowed below this width.
function useIsNarrow(breakpoint = 900) {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const on = (e) => setNarrow(e.matches)
    setNarrow(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [breakpoint])
  return narrow
}

// ── Generic TradingView embed ────────────────────────────────────────────────
// Each TradingView widget is loaded by injecting its embed <script> (with a
// JSON config as its body) into a container. We rebuild it whenever the symbol
// or theme changes so the widget stays in sync with the rest of the app.
//
// Two things about the markup are load-bearing:
//
//  * The height lives on an outer wrapper, never on `.tradingview-widget-container`
//    itself. The embed script rewrites that element's inline height (to `100%`
//    when the config uses `autosize`), so a height set there is thrown away —
//    which is what collapsed the advanced chart to a ~150px sliver of toolbar
//    with no plot area. Against a sized wrapper, `100%` resolves correctly.
//  * The inner widget div is `calc(100% - 32px)`: TradingView appends its own
//    copyright link as a sibling, and at height:100% that link pushed the
//    iframe down so the bottom of the chart was clipped out of the card.
//
// `height` may be omitted for widgets that size themselves (e.g. symbol-info).
// A hidden, always-attached home for embed scripts that are still in flight
// when their widget unmounts — see the cleanup below. Capped so that pogoing
// between pages cannot grow it without bound; anything evicted has long since
// either run or failed.
function scriptGraveyard() {
  let el = document.getElementById('tv-script-graveyard')
  if (!el) {
    el = document.createElement('div')
    el.id = 'tv-script-graveyard'
    el.style.display = 'none'
    document.body.appendChild(el)
  }
  while (el.childElementCount > 8) el.removeChild(el.firstElementChild)
  return el
}

function TVWidget({ scriptSrc, config, height }) {
  const ref = useRef(null)
  const cfg = JSON.stringify(config)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    // Injection is deferred a tick on purpose. The embed script resolves its
    // own container by walking up from the <script> node when it executes, so
    // under StrictMode's mount → unmount → mount the first copy would load
    // after its parent had already been torn down. Deferring lets the
    // throwaway mount cancel before anything is added to the DOM at all.
    let script = null
    const id = window.setTimeout(() => {
      container.innerHTML =
        '<div class="tradingview-widget-container__widget" style="height:calc(100% - 32px);width:100%"></div>'
      script = document.createElement('script')
      script.src = scriptSrc
      script.type = 'text/javascript'
      script.async = true
      script.innerHTML = cfg
      container.appendChild(script)
    }, 0)

    return () => {
      window.clearTimeout(id)
      // Navigating away mid-load used to throw "Cannot read properties of null
      // (reading 'querySelector')" four times over: wiping the container
      // orphaned a script that had not run yet, and it then dereferenced its
      // own (now null) parentNode. Re-homing it in a hidden node keeps that
      // lookup valid, so it no-ops instead of throwing.
      if (script && script.parentNode === container) scriptGraveyard().appendChild(script)
      container.innerHTML = ''
    }
  }, [scriptSrc, cfg])

  return (
    <div style={{ height: height ?? 'auto', width: '100%' }}>
      <div
        ref={ref}
        className="tradingview-widget-container"
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  )
}

// A TradingView widget wrapped in the app's own card + section header, so the
// embeds read as part of the page rather than three unrelated boxes.
//
// Everything inside the widget is a cross-origin iframe, so its typography is
// TradingView's and cannot be restyled from here — the only lever is
// `colorTheme`. What this card does control is the frame around it: the header
// uses the app's own `card-title`, and the surface underneath is the themed
// card background, so a widget that is still loading matches the page instead
// of flashing a white rectangle.
function TVCard({ title, children }) {
  return (
    <div className="card tv-card" style={{ padding: 0, overflow: 'hidden' }}>
      {title && (
        <div className="card-title" style={{ padding: '12px 14px 8px' }}>{title}</div>
      )}
      {children}
    </div>
  )
}

export default function Charts() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const activeMarket = useStore((s) => s.activeMarket)
  const isDarkMode = useStore((s) => s.isDarkMode)
  const recentlyViewed = useStore((s) => s.recentlyViewed)

  const initial = params.get('symbol') || recentlyViewed?.[0] || (activeMarket === 'asx' ? 'BHP.AX' : 'AAPL')
  const [symbol, setSymbol] = useState(initial)
  const [input, setInput] = useState(initial)

  const theme = isDarkMode ? 'dark' : 'light'
  const tvSym = tvSymbol(symbol)
  const isNarrow = useIsNarrow()

  const submit = useCallback((e) => {
    e?.preventDefault?.()
    const v = input.trim().toUpperCase()
    if (!v) return
    setSymbol(v)
    setParams({ symbol: v })
  }, [input, setParams])

  // Keep the input box in sync if the URL symbol changes externally.
  useEffect(() => {
    const q = params.get('symbol')
    if (q && q.toUpperCase() !== symbol) {
      setSymbol(q.toUpperCase())
      setInput(q.toUpperCase())
    }
  }, [params]) // eslint-disable-line

  return (
    <div className="page">
      <div className="flex items-center gap-2">
        <TrendingUp size={18} className="text-[var(--accent)]" />
        <h1 className="page-title">Technical Analysis</h1>
      </div>
      <p className="page-sub mb-4">
        Full TradingView charting - drawing tools, indicators, chart patterns and a
        live technical-rating summary. Use the period and interval controls inside
        the chart to view different timeframes.
      </p>

      {/* Symbol selector */}
      <form onSubmit={submit} className="flex items-center gap-2 mb-4">
        <div className="relative flex-1" style={{ maxWidth: 360 }}>
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Symbol (e.g. AAPL, MSFT, BHP.AX)"
            className="input" style={{ paddingLeft: 34 }}
            autoCapitalize="characters" autoCorrect="off" spellCheck={false}
          />
        </div>
        <button type="submit" className="btn btn-primary">Load</button>
        <span className="text-xs font-mono text-[var(--text-muted)] hidden sm:block">{tvSym}</span>
      </form>

      {/* Snapshot — the quote header strip, above the chart it describes */}
      <TVCard>
        <TVWidget
          key={`info-${tvSym}-${theme}`}
          scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
          config={{
            symbol: tvSym,
            width: '100%',
            locale: 'en',
            colorTheme: theme,
            isTransparent: false,
          }}
        />
      </TVCard>

      {/* Advanced interactive chart. Tall enough to actually trade off — a
          fixed 560px left it a letterbox on a phone — and the drawing toolbar
          and details pane are dropped on narrow screens where they would eat
          most of the plot area. */}
      <div className="card tv-card mt-4 mb-4" style={{ padding: 0, overflow: 'hidden' }}>
        <TVWidget
          key={`chart-${tvSym}-${theme}-${isNarrow}`}
          scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
          height={isNarrow ? '78vh' : 640}
          config={{
            autosize: true,
            symbol: tvSym,
            interval: 'D',
            timezone: 'Etc/UTC',
            theme,
            style: '1',
            locale: 'en',
            withdateranges: true,
            allow_symbol_change: true,
            calendar: false,
            hide_top_toolbar: false,
            hide_side_toolbar: isNarrow,
            hide_legend: false,
            details: !isNarrow,
            studies: isNarrow ? ['STD;RSI'] : ['STD;RSI', 'STD;MACD', 'STD;Bollinger_Bands'],
            support_host: 'https://www.tradingview.com',
          }}
        />
      </div>

      <div>
        {/* Technical rating gauge + oscillators/MA metrics.
            The Fundamentals embed used to sit beside this in a two-column
            grid. It has moved to its own page: as a cross-origin iframe in a
            460px half-column it truncated nearly every label to an ellipsis
            and ran its numbers off its own edge, and nothing about that could
            be styled from here. /fundamentals renders the same data from the
            backend, so it wraps and sizes properly. */}
        <TVCard title="Technical Rating">
          <TVWidget
            key={`ta-${tvSym}-${theme}`}
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
            height={460}
            config={{
              interval: '1D',
              width: '100%',
              height: '100%',
              isTransparent: false,
              symbol: tvSym,
              showIntervalTabs: true,
              displayMode: 'single',
              locale: 'en',
              colorTheme: theme,
            }}
          />
        </TVCard>
      </div>

      <button
        onClick={() => navigate(`/fundamentals?symbol=${encodeURIComponent(symbol)}`)}
        className="btn mt-4"
      >
        <BarChart3 size={14} />
        Fundamentals for {symbol}
      </button>

      <p className="text-xs text-[var(--text-muted)] mt-4">
        Charts and ratings are provided by TradingView. Data may differ slightly from
        FinSight's other pages, which use FMP / yfinance.
      </p>
    </div>
  )
}
