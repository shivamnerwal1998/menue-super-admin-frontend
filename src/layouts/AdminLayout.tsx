import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import theme, { getThemeClasses } from '../configs/theme.js'

type NavItem = {
  name: string
  path: string
  icon: React.ReactNode
}

export default function AdminLayout() {
  const { logout } = useAuth()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Menu',
      path: '/admin/menu',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Dark Mode Premium */}
      <header className={`fixed top-0 left-0 right-0 h-16 z-30 ${getThemeClasses.header()}`}>
        <div className="h-full px-4 flex items-center justify-between">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`md:hidden p-2 ${theme.rounded.md} hover:${theme.primary.bgLight} ${theme.transition.base}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${theme.accent.bg} ${theme.rounded.lg} flex items-center justify-center ${theme.shadow.md}`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-lg font-bold ${theme.primary.text}`}>QR Menu</h1>
                <p className={`text-xs ${theme.primary.textMuted} -mt-0.5`}>Restaurant Admin</p>
              </div>
            </div>
          </div>

          {/* Right: User Info + Logout */}
          <div className="flex items-center gap-3">
            {/* User Info */}
            {user && (
              <div className="hidden sm:block text-right">
                <p className={`text-sm font-medium ${theme.primary.text}`}>{user.name}</p>
                <p className={`text-xs ${theme.primary.textMuted}`}>{user.email}</p>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${theme.primary.bgLight} ${theme.primary.text} ${theme.rounded.md} hover:${theme.primary.bg} ${theme.transition.base}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar - Dark Mode Premium */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 z-20 transform ${theme.transition.slow} ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 ${getThemeClasses.sidebar()}`}
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 ${theme.rounded.lg} font-medium ${
                isActive(item.path)
                  ? getThemeClasses.sidebarItemActive()
                  : getThemeClasses.sidebarItem()
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 ${theme.primary.border} border-t ${theme.primary.bg}`}>
          <div className={`text-xs ${theme.primary.textMuted} text-center`}>
            <p className="font-medium">QR Menu Platform</p>
            <p className="mt-1 opacity-75">Restaurant Admin Portal</p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="pt-16 md:pl-64 min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}