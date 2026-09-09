import axios from 'axios'
import { getApiBase } from './apiBase'

const client = axios.create({
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Resolved per request rather than at module load, so changing the server URL
// in Settings (which the iOS build needs) takes effect without a reload.
// The API key is a no-op against a local/LAN backend (which has none set) and
// becomes required once the backend is deployed publicly — see main.py.
client.interceptors.request.use((config) => {
  config.baseURL = getApiBase()
  if (import.meta.env.VITE_API_SECRET_KEY) {
    config.headers['X-API-Key'] = import.meta.env.VITE_API_SECRET_KEY
  }
  return config
})

// Return an error object instead of throwing, so pages degrade gracefully.
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    const detail = error.response?.data?.detail || error.message
    console.error(`[API] ${error.config?.method?.toUpperCase()} ${error.config?.url} failed:`, status, detail)
    return {
      error: true,
      status: status ?? null,
      message: detail,
      data: error.response?.data ?? null,
    }
  }
)

// Helper: build query string from a params object (skips undefined/null).
const qs = (params = {}) => {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
  return entries.length ? '?' + new URLSearchParams(entries).toString() : ''
}

// ── STOCKS ─────────────────────────────────────────────────────────────────
// Backend route shape is /stocks/{action}/{symbol}.
export const stocksAPI = {
  getQuote: (symbol) => client.get(`/stocks/quote/${symbol}`),
  getProfile: (symbol) => client.get(`/stocks/profile/${symbol}`),
  getFinancials: (symbol, period = 'annual') =>
    client.get(`/stocks/financials/${symbol}${qs({ period })}`),
  getValuation: (symbol) => client.get(`/stocks/valuation/${symbol}`),
  getEPS: (symbol) => client.get(`/stocks/eps/${symbol}`),
  getTechnicals: (symbol) => client.get(`/stocks/technicals/${symbol}`),
  getHistory: (symbol, period = '1y') =>
    client.get(`/stocks/history/${symbol}${qs({ period })}`),
  getNews: (symbol) => client.get(`/stocks/news/${symbol}`),
  getPeers: (symbol) => client.get(`/stocks/peers/${symbol}`),
  getDividends: (symbol) => client.get(`/stocks/dividends/${symbol}`),
  getRecommendation: (symbol) => client.get(`/stocks/recommendation/${symbol}`),
  getEarnings: (symbol) => client.get(`/stocks/earnings/${symbol}`),
  getInstitutional: (symbol) => client.get(`/stocks/institutional/${symbol}`),
  search: (q, market = 'us') => client.get(`/stocks/search${qs({ q, market })}`),
}

// ── MARKET ─────────────────────────────────────────────────────────────────
export const marketAPI = {
  getOverview: (market) => client.get(`/market/overview/${market}`),
  getNews: (market) => client.get(`/market/news/${market}`),
  getEarningsCalendar: () => client.get('/market/earnings-calendar'),
  getIPOCalendar: () => client.get('/market/ipo-calendar'),
}

// ── MACRO ──────────────────────────────────────────────────────────────────
export const macroAPI = {
  getUS: () => client.get('/macro/us'),
  getAustralia: () => client.get('/macro/australia'),
  getYieldCurve: () => client.get('/macro/yield-curve'),
  getRates: () => client.get('/macro/rates'),
}

// ── SENTIMENT ──────────────────────────────────────────────────────────────
export const sentimentAPI = {
  getFearGreed: () => client.get('/sentiment/fear-greed'),
  getUS: () => client.get('/sentiment/us'),
  getAustralia: () => client.get('/sentiment/australia'),
  getGlobal: () => client.get('/sentiment/global'),
}

// ── SCREENER ───────────────────────────────────────────────────────────────
export const screenerAPI = {
  screen: (filters) => client.post('/screener/screen', filters),
  preset: (name, market = 'us') => client.get(`/screener/presets/${name}${qs({ market })}`),
}

// ── WATCHLIST ──────────────────────────────────────────────────────────────
export const watchlistAPI = {
  get: () => client.get('/watchlist/'),
  add: (item) => client.post('/watchlist/add', item),
  remove: (symbol) => client.delete(`/watchlist/remove/${symbol}`),
  getPrices: () => client.get('/watchlist/prices'),
  // Bulk import. Preview validates every candidate against live data before
  // anything is written, so a typo in a pasted list is caught on screen
  // rather than becoming a permanent dead row.
  previewImport: (body) => client.post('/watchlist/import/preview', body, { timeout: 120000 }),
  commitImport: (body) => client.post('/watchlist/import', body, { timeout: 120000 }),
}

// ── FILINGS ────────────────────────────────────────────────────────────────
// SEC EDGAR. A first fetch of a large 10-K downloads and parses several
// megabytes server-side, so the document call gets its own generous timeout;
// once cached to disk it comes back in well under a second.
export const filingsAPI = {
  getForms: () => client.get('/filings/forms'),
  getIndex: (symbol) => client.get(`/filings/${symbol}`),
  getDocument: (symbol, { accession, document, form }) =>
    client.get(
      `/filings/${symbol}/document${qs({ accession, document, form })}`,
      { timeout: 180000 }
    ),
  refresh: (symbols) => client.post(`/filings/refresh${qs({ symbols })}`),
}

// ── NEWS ───────────────────────────────────────────────────────────────────
export const newsAPI = {
  getLatest: (market) => client.get(`/news/latest${qs({ market })}`),
  getByCategory: (category) => client.get(`/news/market/${category}`),
}

// ── GURU ───────────────────────────────────────────────────────────────────
export const guruAPI = {
  chat: (message, history = [], market = 'both', sector = null, responseStyle = 'detailed') =>
    client.post('/guru/chat', {
      message,
      conversation_history: history,
      market,
      sector,
      response_style: responseStyle,
    }),
}

// ── LEARNING ───────────────────────────────────────────────────────────────
// Lesson + quiz are POST (they may trigger AI generation server-side).
export const learningAPI = {
  getModules: () => client.get('/learning/modules'),
  getModule: (category) => client.get(`/learning/module/${category}`),
  getLesson: (topicId, symbol) =>
    client.post(`/learning/lesson/${topicId}${qs({ symbol })}`),
  getQuiz: (topicId) => client.post(`/learning/quiz/${topicId}`),
}

// ── AUTH ───────────────────────────────────────────────────────────────────
export const authAPI = {
  // Longer timeout than the shared default: on the native build this can hit
  // the backend mid cold-start (deployed free tier sleeps when idle, ~50s to
  // wake), and a legitimate login attempt shouldn't fail just from bad timing.
  verify: (passcode) => client.post('/auth/verify', { passcode }, { timeout: 60000 }),
}

// ── SETTINGS ───────────────────────────────────────────────────────────────
export const settingsAPI = {
  checkAPIStatus: () => client.get('/settings/api-status'),
  updatePasscode: (currentPasscode, newPasscode) =>
    client.post('/settings/update-passcode', {
      current_passcode: currentPasscode,
      new_passcode: newPasscode,
    }),
}

// ── RESEARCH ───────────────────────────────────────────────────────────────
// Jimmy's Research engine: a full sourced workup plus an Excel workbook.
// The analysis fans out to yfinance, FMP, SEC EDGAR and runs 7 valuation
// models, so it takes ~10s — well past the shared 30s ceiling's comfort zone.
export const researchAPI = {
  analyze: (ticker, opts = {}) =>
    client.post(
      '/research/analyze',
      {
        ticker,
        export_spreadsheet: opts.exportSpreadsheet !== false,
        include_qualitative: opts.includeQualitative !== false,
        include_finsight_context: opts.includeFinsightContext !== false,
      },
      { timeout: 120000 }
    ),
  // A plain <a href> to a protected route skips the X-API-Key header this
  // client attaches, so downloads must go through here as a blob instead.
  downloadSpreadsheet: (path) => client.get(path, { responseType: 'blob' }),
}

// ── HEALTH ─────────────────────────────────────────────────────────────────
export const healthAPI = {
  get: () => client.get('/health'),
}

export default client
