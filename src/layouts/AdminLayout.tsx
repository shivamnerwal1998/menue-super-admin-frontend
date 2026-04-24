import { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useAuth } from '../state/AuthContext'
import { SearchProvider, SearchType, useSearch } from '../state/SearchContext'
import theme, { getThemeClasses } from '../configs/theme.ts'

type NavItem = {
  name: string
  path: string
  icon: React.ReactNode
}

// ─── Inner layout — consumes SearchContext ───────────────────────────────────
function AdminLayoutContent() {
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const {
    searchQuery,
    setSearchQuery,
    searchType,
    setSearchType,
    isSearchMode,
    executeSearch,
    clearSearch,
  } = useSearch()

  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: 'Menu',
      path: '/admin/menu',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
  ]

  const isActive = (path: string) => location.pathname === path

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    await executeSearch(searchQuery, searchType, 1)
    // Navigate to menu page so results are visible
    if (location.pathname !== '/admin/menu') {
      navigate('/admin/menu')
    }
    setMobileSearchOpen(false)
  }

  const handleClear = () => {
    clearSearch()
    setMobileSearchOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 h-16 z-30 ${getThemeClasses.header()}`}
      >
        <div className="h-full px-4 flex items-center gap-3">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`md:hidden p-2 ${theme.rounded.md} hover:${theme.primary.bgLight} ${theme.transition.base}`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isSidebarOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 ${theme.accent.bg} ${theme.rounded.lg} flex items-center justify-center ${theme.shadow.md}`}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-lg font-bold ${theme.primary.text}`}>
                  Qritzo
                </h1>
                <p className={`text-xs ${theme.primary.textMuted} -mt-0.5`}>
                  Restaurant Admin
                </p>
              </div>
            </div>
          </div>

          {/* Center: Search Bar — desktop only */}
          <div className="hidden md:flex flex-1 items-center gap-2 max-w-lg mx-auto">
            {/* Search type toggle */}
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as SearchType)}
              className="hidden flex-shrink-0 bg-slate-700 text-white text-sm rounded-lg border border-slate-600 px-2 py-1.5 focus:outline-none focus:border-indigo-400 cursor-pointer"
            >
              <option value="items">Items</option>
              {/* <option value="categories">Categories</option> */}
            </select>

            {/* Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder={`Search ${searchType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-700 text-white placeholder-slate-400 rounded-lg border border-slate-600 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition"
              />
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className="flex-shrink-0 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Search
            </button>

            {/* Clear button — only when results are active */}
            {isSearchMode && (
              <button
                onClick={handleClear}
                title="Clear search"
                className="flex-shrink-0 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right: Mobile search toggle + User info + Logout */}
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            {/* Mobile search icon */}
            <button
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              title="Search"
              className={`md:hidden relative p-2 rounded-lg transition ${
                isSearchMode || mobileSearchOpen
                  ? 'bg-indigo-500 text-white'
                  : `${theme.primary.textMuted} hover:bg-slate-700`
              }`}
            >
              <Search className="w-5 h-5" />
              {/* Green dot indicator when results exist */}
              {isSearchMode && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full border border-slate-800" />
              )}
            </button>

            {/* User info */}
            {user && (
              <div className="hidden sm:block text-right">
                <p className={`text-sm font-medium ${theme.primary.text}`}>
                  {user.name}
                </p>
                <p className={`text-xs ${theme.primary.textMuted}`}>
                  {user.email}
                </p>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={logout}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${theme.primary.bgLight} ${theme.primary.text} ${theme.rounded.md} hover:${theme.primary.bg} ${theme.transition.base}`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Search Panel — slides down below header ───────────────────── */}
      <div
        className={`fixed top-16 left-0 right-0 z-[29] bg-slate-800 border-b border-slate-700 md:hidden overflow-hidden transition-all duration-200 ${
          mobileSearchOpen ? 'max-h-20 py-3 px-4' : 'max-h-0'
        }`}
      >
        <div className="flex gap-2">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as SearchType)}
            className="flex-shrink-0 bg-slate-700 text-white text-sm rounded-lg border border-slate-600 px-2 py-2 focus:outline-none"
          >
            <option value="items">Items</option>
            <option value="categories">Categories</option>
          </select>

          <input
            type="text"
            placeholder={`Search ${searchType}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-3 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg border border-slate-600 text-sm focus:outline-none focus:border-indigo-400"
          />

          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            className="flex-shrink-0 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg transition disabled:opacity-50 font-medium"
          >
            Go
          </button>

          <button
            onClick={handleClear}
            className="flex-shrink-0 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Sidebar ───────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 z-20 transform ${
          theme.transition.slow
        } ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 ${getThemeClasses.sidebar()}`}
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 ${
                theme.rounded.lg
              } font-medium ${
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

        <div
          className={`absolute bottom-0 left-0 right-0 p-4 ${theme.primary.border} border-t ${theme.primary.bg}`}
        >
          <div className={`text-xs ${theme.primary.textMuted} text-center`}>
            <p className="font-medium">QR Menu Platform</p>
            <p className="mt-1 opacity-75">Restaurant Admin Portal</p>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <main className="pt-16 md:pl-64 min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

// ─── Default export wraps itself with SearchProvider ─────────────────────────
export default function AdminLayout() {
  return (
    <SearchProvider>
      <AdminLayoutContent />
    </SearchProvider>
  )
}
