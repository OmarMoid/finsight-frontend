import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import ThemeProvider from './components/common/ThemeProvider'
import Navbar from './components/common/Navbar'
import Sidebar from './components/common/Sidebar'
import useStore from './store/useStore'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StockDetail from './pages/StockDetail'
import Charts from './pages/Charts'
import Fundamentals from './pages/Fundamentals'
import Filings from './pages/Filings'
import Coach from './pages/Coach'
import Research from './pages/Research'
import Screener from './pages/Screener'
import Watchlist from './pages/Watchlist'
import Sentiment from './pages/Sentiment'
import Learning from './pages/Learning'
import Guru from './pages/Guru'
import Settings from './pages/Settings'

function ProtectedRoute({ children }) {
  const isAuthenticated = useStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/" replace />
  return children
}

function AppLayout({ children }) {
  return (
    <>
      {/* Sidebar and tab bar are mutually exclusive by CSS at 1024px — both
          are always mounted so neither remounts on a window resize. */}
      <Sidebar />
      <Navbar />
      <main className="app-main min-h-screen">{children}</main>
    </>
  )
}

function GlobalShortcuts() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useStore((s) => s.isAuthenticated)

  useEffect(() => {
    const handler = (e) => {
      const el = document.activeElement
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)

      // Search focus works anywhere; Escape blurs.
      if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault()
        document.getElementById('navbar-search')?.focus()
        return
      }
      if (e.key === 'Escape') {
        if (el && typeof el.blur === 'function') el.blur()
        return
      }

      // Navigation shortcuts only when authenticated and not typing.
      if (typing || !isAuthenticated) return
      if (e.ctrlKey || e.metaKey || e.altKey) return

      switch (e.key.toLowerCase()) {
        case 'g': navigate('/guru'); break
        case 'c': navigate('/charts'); break
        case 'f': navigate('/fundamentals'); break
        case 'e': navigate('/filings'); break
        case 'a': navigate('/coach'); break
        case 'r': navigate('/research'); break
        case 'd': navigate('/dashboard'); break
        case 's': navigate('/screener'); break
        case 'w': navigate('/watchlist'); break
        case 'l': navigate('/learning'); break
        case ',': navigate('/settings'); break
        default: break
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [navigate, location, isAuthenticated])

  return null
}

export default function App() {
  const isAuthenticated = useStore((s) => s.isAuthenticated)

  const protect = (el) => (
    <ProtectedRoute>
      <AppLayout>{el}</AppLayout>
    </ProtectedRoute>
  )

  return (
    <ThemeProvider>
      <GlobalShortcuts />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/dashboard" element={protect(<Dashboard />)} />
        <Route path="/stock/:symbol" element={protect(<StockDetail />)} />
        <Route path="/charts" element={protect(<Charts />)} />
        <Route path="/fundamentals" element={protect(<Fundamentals />)} />
        <Route path="/filings" element={protect(<Filings />)} />
        <Route path="/coach" element={protect(<Coach />)} />
        <Route path="/research" element={protect(<Research />)} />
        <Route path="/screener" element={protect(<Screener />)} />
        <Route path="/watchlist" element={protect(<Watchlist />)} />
        <Route path="/sentiment" element={protect(<Sentiment />)} />
        <Route path="/learning" element={protect(<Learning />)} />
        <Route path="/guru" element={protect(<Guru />)} />
        <Route path="/settings" element={protect(<Settings />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  )
}
