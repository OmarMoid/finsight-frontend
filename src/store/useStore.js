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

// Oldest chats drop off past this, keeping localStorage well under its quota.
const MAX_GURU_CHATS = 50

// A chat is named after its opening question, trimmed to fit the history list.
const chatTitle = (messages) => {
  const first = messages.find((m) => m.role === 'user')?.content?.trim() || 'New chat'
  return first.length > 60 ? `${first.slice(0, 57).trimEnd()}…` : first
}

const syncChat = (chats, id, messages) =>
  chats.map((c) => (c.id === id ? { ...c, messages, updatedAt: Date.now() } : c))

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
      // Every conversation is kept in guruChats (persisted). guruHistory is
      // the open chat's messages, mirrored into its guruChats entry on each
      // change so the history list is always current.
      guruChats: [],
      activeGuruChatId: null,
      guruHistory: [],
      addGuruMessage: (msg) =>
        set((s) => {
          const messages = [...s.guruHistory, msg]
          let id = s.activeGuruChatId
          let chats = s.guruChats
          const now = Date.now()
          if (!id || !chats.some((c) => c.id === id)) {
            id = `c${now}${Math.random().toString(36).slice(2, 6)}`
            chats = [{ id, title: chatTitle(messages), createdAt: now, updatedAt: now, messages }, ...chats].slice(0, MAX_GURU_CHATS)
          } else {
            chats = chats.map((c) => (c.id === id ? { ...c, messages, updatedAt: now } : c))
          }
          return { guruHistory: messages, guruChats: chats, activeGuruChatId: id }
        }),
      updateGuruMessage: (index, patch) =>
        set((s) => {
          const messages = s.guruHistory.map((m, i) => (i === index ? { ...m, ...patch } : m))
          return { guruHistory: messages, guruChats: syncChat(s.guruChats, s.activeGuruChatId, messages) }
        }),
      removeGuruMessage: (index) =>
        set((s) => {
          const messages = s.guruHistory.filter((_, i) => i !== index)
          return { guruHistory: messages, guruChats: syncChat(s.guruChats, s.activeGuruChatId, messages) }
        }),
      newGuruChat: () => set({ activeGuruChatId: null, guruHistory: [] }),
      openGuruChat: (id) =>
        set((s) => {
          const chat = s.guruChats.find((c) => c.id === id)
          return chat ? { activeGuruChatId: id, guruHistory: chat.messages } : {}
        }),
      renameGuruChat: (id, title) =>
        set((s) => ({ guruChats: s.guruChats.map((c) => (c.id === id ? { ...c, title } : c)) })),
      deleteGuruChat: (id) =>
        set((s) => ({
          guruChats: s.guruChats.filter((c) => c.id !== id),
          ...(s.activeGuruChatId === id ? { activeGuruChatId: null, guruHistory: [] } : {}),
        })),
      clearGuruHistory: () => set({ guruChats: [], activeGuruChatId: null, guruHistory: [] }),
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
        guruChats: state.guruChats,
        activeGuruChatId: state.activeGuruChatId,
        guruHistory: state.guruHistory,
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
