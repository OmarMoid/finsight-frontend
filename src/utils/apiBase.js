// Resolves which backend the app talks to, at runtime.
//
// On the web the backend is same-machine, so a compile-time default is fine.
// The native (iOS) build defaults to the deployed Render backend, so the app
// works over cellular without the Mac running. The Mac's LAN IP is still a
// valid manual override in Settings (avoids Render's free-tier cold start
// when you're on the same network), but it's no longer the baked-in default.

const STORAGE_KEY = 'finsight.apiBase'

// True when running inside the Capacitor iOS/Android shell rather than a browser.
export function isNative() {
  if (typeof window === 'undefined') return false
  const cap = window.Capacitor
  if (cap && typeof cap.isNativePlatform === 'function') return cap.isNativePlatform()
  return /^(capacitor|ionic):$/.test(window.location?.protocol || '')
}

// Build-time defaults. VITE_CLOUD_API_URL is the deployed backend (Render).
const WEB_DEFAULT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const CLOUD_DEFAULT = import.meta.env.VITE_CLOUD_API_URL || WEB_DEFAULT

export function defaultApiBase() {
  return isNative() ? CLOUD_DEFAULT : WEB_DEFAULT
}

// Strip a trailing slash so `${base}${path}` never doubles up.
function normalise(url) {
  return typeof url === 'string' ? url.trim().replace(/\/+$/, '') : ''
}

export function getApiBase() {
  try {
    const saved = normalise(window.localStorage.getItem(STORAGE_KEY))
    if (saved) return saved
  } catch {
    /* private mode / storage disabled — fall through to the default */
  }
  return normalise(defaultApiBase())
}

export function setApiBase(url) {
  const clean = normalise(url)
  try {
    if (clean) window.localStorage.setItem(STORAGE_KEY, clean)
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore — the in-memory default still applies for this session */
  }
  return clean || normalise(defaultApiBase())
}

export function clearApiBase() {
  return setApiBase('')
}

// Resolve a possibly-relative URL the backend handed us (e.g. a download link).
export function resolveUrl(pathOrUrl) {
  if (!pathOrUrl) return null
  if (/^[a-z][a-z0-9+.-]*:/i.test(pathOrUrl)) return pathOrUrl
  return `${getApiBase()}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}
