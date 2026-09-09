// Theme picker for the global header.
//
// This replaces a button that cycled blindly through seven themes — with more
// than about three, cycling stops being a shortcut and becomes a guessing
// game. The menu shows every theme by name with a three-swatch preview
// (surface / accent / positive) taken from the theme definition itself, so a
// theme can never be listed with the wrong colours.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Palette } from 'lucide-react'
import useStore from '../../store/useStore'
import { THEMES, THEME_NAMES, THEME_ORDER } from '../../themes'

const MENU_WIDTH = 268
const MENU_MAX_HEIGHT = 420

function Swatch({ theme }) {
  return (
    <span
      className="flex shrink-0 items-center overflow-hidden"
      style={{
        width: 34,
        height: 20,
        borderRadius: 5,
        border: '1px solid var(--border-light)',
        background: theme.bg,
      }}
      aria-hidden="true"
    >
      <span style={{ width: 12, height: '100%', background: theme.bgCard }} />
      <span style={{ width: 7, height: '100%', background: theme.accent }} />
      <span style={{ width: 7, height: '100%', background: theme.positive }} />
    </span>
  )
}

export default function ThemeMenu({ align = 'right' }) {
  const activeTheme = useStore((s) => s.activeTheme)
  const setActiveTheme = useStore((s) => s.setActiveTheme)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (menuRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return
      setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // The menu renders in a portal because the header is a backdrop-filtered
  // fixed bar: a child of it inherits the blur and gets clipped by the bar's
  // own height, which is what made the first version look like a smear.
  //
  // Being in a portal means placement is ours to get right. It opens below the
  // button on the desktop bar, but flips above when there isn't room — in the
  // phone "More" sheet the button sits near the bottom of the screen, and a
  // downward menu showed exactly one of the seven themes.
  const toggle = () => {
    const r = btnRef.current?.getBoundingClientRect()
    if (r) {
      const width = Math.min(MENU_WIDTH, window.innerWidth - 16)
      const height = Math.min(MENU_MAX_HEIGHT, window.innerHeight - 24)
      const openUp = r.bottom + height + 12 > window.innerHeight && r.top > height / 2
      // Right-align to the button, then pull back inside the viewport.
      const right = Math.max(8, Math.min(window.innerWidth - r.right, window.innerWidth - width - 8))
      const left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8))
      setPos({
        width,
        maxHeight: height,
        top: openUp ? undefined : r.bottom + 8,
        bottom: openUp ? window.innerHeight - r.top + 8 : undefined,
        left: align === 'left' ? left : undefined,
        right: align === 'right' ? right : undefined,
      })
    }
    setOpen((v) => !v)
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        title="Change theme"
        className="flex items-center justify-center rounded-control"
        style={{
          width: 32,
          height: 32,
          background: open ? 'var(--accent-soft)' : 'var(--bg-card)',
          border: `1px solid ${open ? 'var(--accent-border)' : 'var(--border)'}`,
          color: open ? 'var(--accent)' : 'var(--text-secondary)',
        }}
      >
        <Palette size={15} />
      </button>

      {open && pos && createPortal(
        <div
          ref={menuRef}
          role="menu"
          className="fade-in"
          style={{
            position: 'fixed',
            top: pos.top,
            bottom: pos.bottom,
            left: pos.left,
            right: pos.right,
            zIndex: 80,
            width: pos.width,
            maxHeight: pos.maxHeight,
            overflowY: 'auto',
            padding: 6,
            borderRadius: 'var(--radius-card)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div className="section-label" style={{ padding: '6px 8px 2px', marginBottom: 0 }}>
            Theme
          </div>
          {THEME_ORDER.map((key) => {
            const theme = THEMES[key]
            if (!theme) return null
            const active = key === activeTheme
            return (
              <button
                key={key}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setActiveTheme(key)
                  setOpen(false)
                }}
                className="flex w-full items-center gap-2.5 rounded-control px-2 py-2 text-left"
                style={{
                  background: active ? 'var(--accent-soft)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                <Swatch theme={theme} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {THEME_NAMES[key]?.label || key}
                  </span>
                  <span className="block truncate text-2xs" style={{ color: 'var(--text-muted)' }}>
                    {THEME_NAMES[key]?.description}
                  </span>
                </span>
                {active && <Check size={15} className="shrink-0" />}
              </button>
            )
          })}
        </div>,
        document.body
      )}
    </>
  )
}
