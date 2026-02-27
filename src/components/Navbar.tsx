import { useState } from 'react'
import {
  LuLayoutDashboard,
  LuBookOpen,
  LuArchive,
  LuChartBar,
  LuSettings,
  LuMenu,
  LuX,
  LuLogOut,
  LuZap,
} from 'react-icons/lu'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/useAuthStore'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LuLayoutDashboard },
  { to: '/questions', label: 'Questions', icon: LuBookOpen },
  { to: '/backlog', label: 'Backlog', icon: LuArchive },
  { to: '/stats', label: 'Stats', icon: LuChartBar },
  { to: '/settings', label: 'Settings', icon: LuSettings },
]

export const SIDEBAR_WIDTH = '220px'

const NavLink = ({
  to,
  label,
  icon: Icon,
  onClick,
}: {
  to: string
  label: string
  icon: React.ElementType
  onClick?: () => void
}) => {
  const { pathname } = useLocation()
  const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <Link to={to} onClick={onClick} className="w-full">
      <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
          ${isActive ? 'text-purple-600 dark:text-purple-400 bg-purple-500/10' : 'text-(--muted-foreground) hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400'}`}
      >
        <Icon size={18} />
        <span className="flex-1">{label}</span>
        {isActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
        )}
      </div>
    </Link>
  )
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!isAuthenticated) return null

  const displayName = user?.username || user?.email || ''
  const displayEmail = user?.email || ''

  const handleLogout = () => {
    setMobileOpen(false)
    logout()
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-55 bg-(--card) border-r border-(--border) z-10">
        <div className="flex items-center gap-2.5 h-16 px-5">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-500 text-white">
            <LuZap size={16} />
          </div>
          <span className="font-bold text-lg tracking-tight">PrepTracker</span>
        </div>

        <div className="flex flex-col flex-1 gap-1 px-3 pt-2">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} {...item} />
          ))}
        </div>

        <div className="border-t border-(--border) p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {getInitials(displayName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{displayName}</p>
              {displayEmail && displayEmail !== displayName && (
                <p className="text-xs text-(--muted-foreground) truncate">
                  {displayEmail}
                </p>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="flex lg:hidden fixed left-0 right-0 top-0 z-10 h-14 items-center justify-between bg-(--card) border-b border-(--border) px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-purple-500 text-white">
            <LuZap size={14} />
          </div>
          <span className="font-bold text-base">PrepTracker</span>
        </div>
        <button
          aria-label="Toggle menu"
          className="p-2 rounded-lg hover:bg-(--secondary) transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <LuX /> : <LuMenu />}
        </button>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-9 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed left-0 right-0 top-14 z-10 bg-(--card) border-b border-(--border) p-3 shadow-xl lg:hidden">
            <div className="flex flex-col gap-1 mb-3">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  {...item}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </div>

            <div className="border-t border-(--border) pt-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                  {getInitials(displayName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{displayName}</p>
                  {displayEmail && displayEmail !== displayName && (
                    <p className="text-xs text-(--muted-foreground) truncate">
                      {displayEmail}
                    </p>
                  )}
                </div>
              </div>
              <button
                className="btn-outline w-full justify-center text-red-500 border-red-500/30 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LuLogOut />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Navbar
