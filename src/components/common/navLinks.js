import {
  LayoutDashboard, CandlestickChart, FlaskConical, Star, Filter, Activity,
  GraduationCap, Sparkles, Settings as SettingsIcon, Building2, FileText, Compass,
} from 'lucide-react'

// The single list of destinations. The desktop sidebar, the phone tab bar and
// the phone "More" sheet all read from this, so a new page appears in all
// three at once rather than in whichever one got remembered.
//
// `group` drives the sidebar's section breaks: markets first (what you look
// at), analysis second (what you do with it), then the rest.
export const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Markets' },
  { to: '/charts', label: 'Charts', icon: CandlestickChart, group: 'Markets' },
  { to: '/watchlist', label: 'Watchlist', icon: Star, group: 'Markets' },
  { to: '/fundamentals', label: 'Fundamentals', icon: Building2, group: 'Analysis' },
  { to: '/screener', label: 'Screener', icon: Filter, group: 'Analysis' },
  { to: '/filings', label: 'Filings', icon: FileText, group: 'Analysis' },
  { to: '/research', label: 'Research', icon: FlaskConical, group: 'Analysis' },
  { to: '/sentiment', label: 'Sentiment', icon: Activity, group: 'Analysis' },
  { to: '/coach', label: 'Analyst Coach', icon: Compass, group: 'Learn' },
  { to: '/learning', label: 'Learning', icon: GraduationCap, group: 'Learn' },
  { to: '/guru', label: 'Guru', icon: Sparkles, group: 'Learn' },
  { to: '/settings', label: 'Settings', icon: SettingsIcon, group: 'Learn' },
]

// The four destinations that earn a permanent slot on a phone; the rest live
// behind "More".
export const PRIMARY_TABS = ['/dashboard', '/charts', '/research', '/watchlist']

export const NAV_GROUPS = ['Markets', 'Analysis', 'Learn']
