import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType } from 'lightweight-charts'
import useStore from '../../store/useStore'
import { getThemeValue } from '../../themes'

// Convert a hex CSS-var colour into an rgba() string with the given alpha.
function hexToRgba(hex, alpha) {
  const h = (hex || '').trim().replace('#', '')
  if (h.length !== 6) return `rgba(59,130,246,${alpha})`
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function readColors() {
  return {
    line: getThemeValue('--chart-line') || '#3b82f6',
    text: getThemeValue('--text-muted') || '#94a3b8',
    border: getThemeValue('--border') || '#1e2d4a',
    positive: getThemeValue('--positive') || '#10b981',
    negative: getThemeValue('--negative') || '#ef4444',
  }
}

const fmtPrice = (v) =>
  v == null ? '' : v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const fmtDate = (time) => {
  // lightweight-charts hands back one of three shapes depending on how the
  // series was fed: a UTC timestamp (intraday bars), a 'YYYY-MM-DD' string, or
  // a {year,month,day} business-day object.
  if (typeof time === 'number') {
    const d = new Date(time * 1000)
    return d.toLocaleString(undefined, {
      day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
    })
  }
  const iso = typeof time === 'string'
    ? time
    : time && time.year
      ? `${time.year}-${String(time.month).padStart(2, '0')}-${String(time.day).padStart(2, '0')}`
      : null
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Minimal price chart.
 *
 * Deliberately stripped: no grid, no axis rules. On a price
 * series the grid carries almost no information — the price scale on the right
 * already gives you the levels — and removing it is what makes the trend line
 * itself the loudest thing in the card. What replaces it is a tooltip that
 * tracks the cursor exactly, which is how you actually read a value off a
 * chart.
 */
export default function PriceChart({ data = [], height = 300, showVolume = false }) {
  const containerRef = useRef(null)
  const wrapRef = useRef(null)
  const chartRef = useRef(null)
  const areaRef = useRef(null)
  const volumeRef = useRef(null)
  const activeTheme = useStore((s) => s.activeTheme)
  const [tip, setTip] = useState(null)

  // Intraday series (the 1D / 1W timeframes) arrive with a `time` epoch on each
  // bar; daily+ series only carry a YYYY-MM-DD `date`. The two need different
  // axis formatting, so detect it from the payload rather than passing a flag.
  const intraday = Array.isArray(data) && data.length > 0 && data[0].time != null

  // Create chart once.
  useEffect(() => {
    if (!containerRef.current) return
    const c = readColors()

    const chart = createChart(containerRef.current, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: c.text,
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 10,
      },
      // The whole point of the redesign: nothing behind the line.
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.12, bottom: showVolume ? 0.26 : 0.06 },
      },
      timeScale: {
        borderVisible: false,
        // Intraday timeframes need hh:mm on the axis, not just the date, or
        // every bar in a session collapses onto one indistinguishable label.
        timeVisible: intraday,
        secondsVisible: false,
        ticksVisible: true,
        // Rigid bounds: the chart cannot be scrolled or zoomed past the actual
        // data on either side, so there is no infinite empty whitespace — but
        // within the loaded range it pans and zooms freely.
        fixLeftEdge: true,
        fixRightEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightOffset: 0,
        minBarSpacing: 0.5,
      },
      crosshair: {
        mode: 0,
        vertLine: { color: c.border, width: 1, style: 3, labelVisible: false },
        horzLine: { color: c.border, width: 1, style: 3, labelVisible: true },
      },
      // Allow zooming in and panning within the data, but disable the
      // axis-drag stretch that lets you zoom out indefinitely. The period
      // buttons (1mo…5y) remain the way to change the visible timeframe.
      handleScale: {
        axisPressedMouseMove: { time: false, price: false },
        axisDoubleClickReset: true,
        mouseWheel: true,
        pinch: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
    })

    const area = chart.addAreaSeries({
      lineColor: c.line,
      // Alpha fade anchored to the bottom of the plot: it gives the line a
      // body without drawing a second shape that competes with it.
      topColor: hexToRgba(c.line, 0.22),
      bottomColor: hexToRgba(c.line, 0),
      lineWidth: 1.5,
      priceLineVisible: false,
      lastValueVisible: true,
      crosshairMarkerRadius: 3,
      crosshairMarkerBorderWidth: 2,
    })

    chartRef.current = chart
    areaRef.current = area

    if (showVolume) {
      const volume = chart.addHistogramSeries({
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      })
      chart.priceScale('volume').applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } })
      volumeRef.current = volume
    }

    // Tooltip: positioned from the crosshair's own coordinates, so it sits on
    // the cursor with no easing — a tooltip that animates into place reads as
    // lag when you are sweeping across a year of prices.
    const onMove = (param) => {
      if (!param.point || !param.time || !wrapRef.current) {
        setTip(null)
        return
      }
      const value = param.seriesData?.get(area)
      const price = value?.value ?? value?.close
      if (price == null) {
        setTip(null)
        return
      }
      const box = wrapRef.current.getBoundingClientRect()
      const TIP_W = 132
      // Flip to the left of the cursor near the right edge rather than letting
      // the card hang off the card it lives in.
      const left = param.point.x + TIP_W + 18 > box.width
        ? param.point.x - TIP_W - 12
        : param.point.x + 12
      setTip({
        left: Math.max(0, left),
        top: Math.max(0, Math.min(param.point.y - 34, height - 56)),
        price,
        date: fmtDate(param.time),
      })
    }
    chart.subscribeCrosshairMove(onMove)

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chart.applyOptions({ width: entry.contentRect.width })
      }
    })
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      chart.unsubscribeCrosshairMove(onMove)
      chart.remove()
      chartRef.current = null
      areaRef.current = null
      volumeRef.current = null
    }
    // `intraday` is a dependency on purpose. Feeding a live series UTC
    // timestamps after it has been holding business-day values (or the
    // reverse) is not something lightweight-charts supports cleanly, so
    // crossing between 1D/1W and the daily timeframes rebuilds the chart
    // rather than mutating one in place.
  }, [height, showVolume, intraday])

  // Push data whenever it changes.
  useEffect(() => {
    if (!areaRef.current || !Array.isArray(data) || data.length === 0) return
    const c = readColors()

    // Intraday bars key off their epoch; daily bars off the date string.
    const at = (d) => (d.time != null ? d.time : d.date)

    areaRef.current.setData(
      data
        .filter((d) => at(d) != null && d.close != null)
        .map((d) => ({ time: at(d), value: d.close }))
    )

    if (showVolume && volumeRef.current) {
      volumeRef.current.setData(
        data
          .filter((d) => at(d) != null && d.volume != null)
          .map((d) => ({
            time: at(d),
            value: d.volume,
            color: (d.close ?? 0) >= (d.open ?? d.close ?? 0)
              ? hexToRgba(c.positive, 0.32)
              : hexToRgba(c.negative, 0.32),
          }))
      )
    }

    chartRef.current?.timeScale().fitContent()
    // `intraday` is listed so this re-runs after the effect above has rebuilt
    // the chart, rather than relying on the two happening to fire in order.
  }, [data, showVolume, intraday])

  // Re-read CSS vars and re-style on theme change.
  useEffect(() => {
    if (!chartRef.current) return
    const c = readColors()
    chartRef.current.applyOptions({
      layout: { textColor: c.text },
      crosshair: {
        vertLine: { color: c.border },
        horzLine: { color: c.border },
      },
    })
    areaRef.current?.applyOptions({
      lineColor: c.line,
      topColor: hexToRgba(c.line, 0.22),
      bottomColor: hexToRgba(c.line, 0),
    })
  }, [activeTheme])

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', height }}>
      <div ref={containerRef} style={{ width: '100%', height }} />
      {tip && (
        <div className="chart-tip" style={{ left: tip.left, top: tip.top, width: 132 }}>
          <div className="chart-tip-label">{tip.date}</div>
          <div className="chart-tip-value">{fmtPrice(tip.price)}</div>
        </div>
      )}
    </div>
  )
}
