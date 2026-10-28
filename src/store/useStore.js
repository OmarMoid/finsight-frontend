import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { applyTheme, DEFAULT_THEME, THEMES, resolveThemeKey } from '../themes'

/** Row padding is a document-level concern (tables live on eight pages), so it
 *  rides on a data attribute and is read by CSS rather than threaded through
 *  props. Called from the store so the DOM matches the persisted value even
 *  before React mounts anything. */
export function applyDensity(density) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.density = density === 'compact' ? 'compact' : 'comfortable'
}

const DEFAULT_SETTINGS = {
  defaultMarket: 'us',
  defaultCurrency: 'USD',
  passcode: '2024',
  showChangeAsPercent: true,
  compactNumbers: true,
  autoRefreshInterval: 60,
  decimalPlaces: 2,
  showVolume: true,
  showBeta: true,
  showDividendYield: true,
  newsSource: 'all',
  chartType: 'area',
  chartPeriodDefault: '1y',
  showTechnicalOverlays: true,
  guruResponseStyle: 'detailed',
  guruMarket: 'both',
  followSystemTheme: false,
  // Display timezone for every clock in the app. 'auto' = the device's zone.
  // See utils/timezone.js for why this is an app-level preference rather than
  // whatever the device happens to be set to.
  timezone: 'auto',
}

const useStore = create(
  persist(
    (set, get) => ({
      // ── AUTH ───────────────────────────────────────────────────────────
      isAuthenticated: false,
      setAuthenticated: (val) => set({ isAuthenticated: val }),

      // ── MARKET ─────────────────────────────────────────────────────────
      activeMarket: 'us',
      setActiveMarket: (market) => set({ activeMarket: market }),

      // ── THEME ──────────────────────────────────────────────────────────
      activeTheme: DEFAULT_THEME,
      isDarkMode: true,
      setActiveTheme: (key) => {
        // Resolve first so a persisted preference for a retired theme is
        // rewritten to its surviving equivalent instead of being stored dead.
        const resolved = resolveThemeKey(key)
        applyTheme(resolved)
        set({
          activeTheme: resolved,
          isDarkMode: THEMES[resolved]?.isDark ?? true,
        })
      },

      // ── LAYOUT ─────────────────────────────────────────────────────────
      // 'comfortable' reads well for browsing; 'compact' fits roughly twice
      // the rows on screen for a screening session. Global, not per-table —
      // switching it per page would be a setting nobody finds.
      density: 'comfortable',
      setDensity: (density) => {
        applyDensity(density)
        set({ density })
      },
      // Desktop sidebar; persisted because it is a workspace preference, not
      // transient UI state.
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // ── SETTINGS ───────────────────────────────────────────────────────
      settings: { ...DEFAULT_SETTINGS },
      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),

      // ── WATCHLIST ──────────────────────────────────────────────────────
      watchlist: [],
      setWatchlist: (items) => set({ watchlist: items }),
      addToWatchlist: (item) =>
        set((s) => {
          const symbol = typeof item === 'string' ? item : item.symbol
          if (s.watchlist.some((w) => (typeof w === 'string' ? w : w.symbol) === symbol)) {
            return s
          }
          return { watchlist: [...s.watchlist, item] }
        }),
      removeFromWatchlist: (symbol) =>
        set((s) => ({
          watchlist: s.watchlist.filter(
            (w) => (typeof w === 'string' ? w : w.symbol) !== symbol
          ),
        })),
      isInWatchlist: (symbol) =>
        get().watchlist.some(
          (w) => (typeof w === 'string' ? w : w.symbol) === symbol
        ),

      // ── LEARNING ───────────────────────────────────────────────────────
      learningProgress: {},
      markTopicComplete: (topicId) =>
        set((s) => ({
          learningProgress: { ...s.learningProgress, [topicId]: true },
        })),
      resetProgress: () => set({ learningProgress: {} }),
      getProgressPercent: () => {
        const total = 47 // total hardcoded learning topics
        const done = Object.values(get().learningProgress).filter(Boolean).length
        return total === 0 ? 0 : Math.round((done / total) * 100)
      },

      savedScenarios: [],
      saveScenario: (scenario) =>
        set((s) => ({
          savedScenarios: [
            ...s.savedScenarios,
            { id: Date.now(), createdAt: new Date().toISOString(), ...scenario },
          ],
        })),
      deleteScenario: (id) =>
        set((s) => ({
          savedScenarios: s.savedScenarios.filter((sc) => sc.id !== id),
        })),

      // ── GURU ───────────────────────────────────────────────────────────
      guruHistory: [],
      addGuruMessage: (msg) =>
        set((s) => ({ guruHistory: [...s.guruHistory, msg] })),
      updateGuruMessage: (index, patch) =>
        set((s) => ({
          guruHistory: s.guruHistory.map((m, i) => (i === index ? { ...m, ...patch } : m)),
        })),
      removeGuruMessage: (index) =>
        set((s) => ({ guruHistory: s.guruHistory.filter((_, i) => i !== index) })),
      clearGuruHistory: () => set({ guruHistory: [] }),
      guruIsTyping: false,
      setGuruTyping: (val) => set({ guruIsTyping: val }),

      savedAnalyses: [],
      saveAnalysis: (text) =>
        set((s) => ({
          savedAnalyses: [
            ...s.savedAnalyses,
            { id: Date.now(), createdAt: new Date().toISOString(), text },
          ],
        })),
      deleteAnalysis: (id) =>
        set((s) => ({
          savedAnalyses: s.savedAnalyses.filter((a) => a.id !== id),
        })),

      // ── NAVIGATION ─────────────────────────────────────────────────────
      recentlyViewed: [],
      addRecentlyViewed: (symbol) =>
        set((s) => ({
          recentlyViewed: [
            symbol,
            ...s.recentlyViewed.filter((x) => x !== symbol),
          ].slice(0, 10),
        })),
      lastVisitedPage: '/',
      setLastVisitedPage: (path) => set({ lastVisitedPage: path }),
    }),
    {
      name: 'finsight-store',
      // Persist user data + preferences; auth is intentionally NOT persisted
      // so the passcode is required each session.
      partialize: (state) => ({
        activeMarket: state.activeMarket,
        activeTheme: state.activeTheme,
        isDarkMode: state.isDarkMode,
        density: state.density,
        sidebarCollapsed: state.sidebarCollapsed,
        settings: state.settings,
        watchlist: state.watchlist,
        learningProgress: state.learningProgress,
        savedScenarios: state.savedScenarios,
        savedAnalyses: state.savedAnalyses,
        recentlyViewed: state.recentlyViewed,
        lastVisitedPage: state.lastVisitedPage,
      }),
    }
  )
)

// Dev-only console handle, so the store can be inspected/driven from devtools
// while working on a page. Stripped from production builds.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.__finsightStore = useStore
}

export default useStore
