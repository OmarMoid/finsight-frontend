import { useEffect, useLayoutEffect } from 'react'
import {
  applyTheme, DEFAULT_THEME, DEFAULT_LIGHT_THEME, resolveThemeKey,
} from '../../themes'
import useStore, { applyDensity } from '../../store/useStore'

export default function ThemeProvider({ children }) {
  const activeTheme = useStore((s) => s.activeTheme)
  const setActiveTheme = useStore((s) => s.setActiveTheme)
  const density = useStore((s) => s.density)

  // On first ever load (no persisted store): detect OS preference.
  useEffect(() => {
    const persisted = localStorage.getItem('finsight-store')
    if (!persisted) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setActiveTheme(prefersDark ? DEFAULT_THEME : DEFAULT_LIGHT_THEME)
    } else {
      // Re-apply the rehydrated theme so CSS vars match the store on load.
      // Going through setActiveTheme (rather than applyTheme alone) migrates a
      // persisted preference for a retired theme instead of leaving the store
      // holding a key that no longer exists.
      const resolved = resolveThemeKey(activeTheme || DEFAULT_THEME)
      if (resolved !== activeTheme) setActiveTheme(resolved)
      else applyTheme(resolved)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep CSS variables in sync on every theme change. useLayoutEffect ensures
  // the CSS vars are applied before any child passive effect (e.g. PriceChart's
  // imperative re-style) reads them, so charts pick up the new theme colours.
  useLayoutEffect(() => {
    applyTheme(activeTheme || DEFAULT_THEME)
  }, [activeTheme])

  // Same contract for row density: the store holds it, the <html> attribute
  // carries it, and CSS does the rest. Rehydration writes the store without
  // calling setDensity, so the attribute has to be re-asserted here.
  useLayoutEffect(() => {
    applyDensity(density)
  }, [density])

  return children
}
