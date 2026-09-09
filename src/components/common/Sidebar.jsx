// Desktop navigation rail (≥1024px). Hidden by CSS below that width, where the
// bottom tab bar owns navigation instead — the two are never both on screen.
//
// The collapse state is written to a data attribute on <html> rather than
// passed down as a prop, because the top bar and the page body both have to
// shift by the same amount and neither is a child of this component.
import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, Lock } from 'lucide-react'
import useStore from '../../store/useStore'
import { NAV_LINKS, NAV_GROUPS } from './navLinks'
import { LogoMark } from './Logo'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const collapsed = useStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useStore((s) => s.toggleSidebar)
  const setAuthenticated = useStore((s) => s.setAuthenticated)

  useEffect(() => {
    const root = document.documentElement
    if (collapsed) root.dataset.sidebar = 'collapsed'
    else delete root.dataset.sidebar
    return () => { delete root.dataset.sidebar }
  }, [collapsed])

  const isActive = (to) =>
    location.pathname === to ||
    // A stock page is reached from the dashboard and belongs to it; leaving
    // every item unlit there made the rail look broken.
    (to === '/dashboard' && location.pathname.startsWith('/stock/'))

  return (
    <aside className="app-sidebar" aria-label="Main navigation">
      <Link to="/dashboard" className="sidebar-brand">
        <LogoMark size={26} />
        {!collapsed && (
          <span
            className="text-base font-bold tracking-tight sidebar-label"
            style={{ color: 'var(--text-primary)' }}
          >
            FinSight
          </span>
        )}
      </Link>

      <nav className="sidebar-nav">
        {NAV_GROUPS.map((group) => (
          <div key={group} className="contents">
            {!collapsed && (
              <div className="section-label" style={{ padding: '10px 11px 2px', marginBottom: 0 }}>
                {group}
              </div>
            )}
            {NAV_LINKS.filter((l) => l.group === group).map(({ to, label, icon: Icon }) => {
              const active = isActive(to)
              return (
                <Link
                  key={to}
                  to={to}
                  className={`sidebar-link${active ? ' is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                  title={collapsed ? label : undefined}
                >
                  <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
                  <span className="sidebar-label">{label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        <button
          onClick={() => { setAuthenticated(false); navigate('/') }}
          title="Lock & log out"
        >
          <Lock size={15} />
          <span className="sidebar-foot-label">Lock</span>
        </button>
        <button
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
          <span className="sidebar-foot-label">Collapse</span>
        </button>
      </div>
    </aside>
  )
}
