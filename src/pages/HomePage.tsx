// src/pages/HomePage.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { api } from '../utils/api'
import Modal from '../components/Modal'

type RoleType = 'admin' | 'super'

type RoleConfig = {
  color: 'blue' | 'green'
  title: string
  description: string
}

export default function HomePage() {
  const { login, isAuthenticated, isSuperAdmin, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedRole, setSelectedRole] = useState<RoleType>('admin')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!isAuthenticated) return
    if (isSuperAdmin) {
      navigate('/super-admin/dashboard', { replace: true })
    } else if (isAdmin) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [isAuthenticated, isSuperAdmin, isAdmin, navigate])

  const handleOpenModal = (role: RoleType) => {
    setSelectedRole(role)
    setIsModalOpen(true)
    setError('')
    setEmail('')
    setPassword('')
    setShowPassword(false)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setError('')
    setEmail('')
    setPassword('')
    setShowPassword(false)
  }

  const handleSubmit = async (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email')
      setLoading(false)
      return
    }

    try {
      if (selectedRole === 'super') {
        const response = await api.post('/super-admin/login', { email, password }, true)
        if (response.success && response.data?.token) {
          login(response.data.token, 'SUPER_ADMIN')
        } else {
          throw new Error('Super Admin Login Failed')
        }
      } else {
        const response = await api.post('/admin/login', { email, password }, true)
        if (response.success && response.data?.token) {
          login(response.data.token, 'ADMIN', response?.data?.user)
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user))
          }
        } else {
          throw new Error('Admin Login Failed')
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const roleConfig: Record<RoleType, RoleConfig> = {
    admin: {
      color: 'blue',
      title: 'Restaurant Admin Login',
      description: 'Manage your restaurant menu',
    },
    super: {
      color: 'green',
      title: 'Super Admin Login',
      description: 'Manage restaurants and admins',
    },
  }

  const config = roleConfig[selectedRole]

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 relative overflow-hidden">

      {/* ── Subtle menu-themed dot/grid texture overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #a5b4fc 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Soft ambient glows — indigo + purple matching hero gradient ── */}
      <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] rounded-full bg-indigo-600 opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full bg-purple-600 opacity-10 blur-3xl pointer-events-none" />

      {/* ════════════════ HEADER ════════════════ */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-700/60 bg-slate-800/70 backdrop-blur-sm">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight">Qritzo</p>
            {/* <p className="text-slate-400 text-xs leading-tight">Restaurant Platform</p> */}
          </div>
        </div>

        {/* Right badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/60 rounded-full border border-slate-600/50">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-slate-300 text-xs font-medium">System Online</span>
        </div>
      </header>

      {/* ════════════════ MAIN CONTENT ════════════════ */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">

        {/* Brand hero area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl mb-5">
            <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Qritzo</h1>
          <p className="text-slate-400 text-base">Select your role to access the dashboard</p>
        </div>

        {/* Role Selection Cards */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">

          {/* Restaurant Admin */}
          <button
            onClick={() => handleOpenModal('admin')}
            className="group relative px-8 py-5 bg-slate-800 border border-slate-700 rounded-xl hover:border-indigo-500 hover:bg-slate-750 transition-all duration-300 shadow-md hover:shadow-indigo-500/10 hover:shadow-xl"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-all duration-300">
                <svg className="w-7 h-7 text-indigo-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-base font-semibold text-white">Restaurant Admin</h3>
                <p className="text-sm text-slate-400 mt-0.5">Manage your menu</p>
              </div>
            </div>
          </button>

          {/* Super Admin */}
          <button
            onClick={() => handleOpenModal('super')}
            className="group relative px-8 py-5 bg-slate-800 border border-slate-700 rounded-xl hover:border-green-500 hover:bg-slate-750 transition-all duration-300 shadow-md hover:shadow-green-500/10 hover:shadow-xl"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500 group-hover:border-green-500 transition-all duration-300">
                <svg className="w-7 h-7 text-green-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-base font-semibold text-white">Super Admin</h3>
                <p className="text-sm text-slate-400 mt-0.5">Full system access</p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer note */}
        <p className="text-slate-600 text-xs">Authorized access only</p>
      </main>

      {/* ════════════════ LOGIN MODAL ════════════════ */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={config.title}>
        <p className="text-sm text-gray-600 mb-6">{config.description}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none transition ${
                  config.color === 'blue'
                    ? 'focus:ring-blue-200 focus:border-blue-500'
                    : 'focus:ring-green-200 focus:border-green-500'
                }`}
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:outline-none transition ${
                    config.color === 'blue'
                      ? 'focus:ring-blue-200 focus:border-blue-500'
                      : 'focus:ring-green-200 focus:border-green-500'
                  }`}
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="mr-2 rounded" disabled={loading} />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); alert('Password reset functionality coming soon!') }}
                className={`${
                  config.color === 'blue' ? 'text-blue-600 hover:text-blue-800' : 'text-green-600 hover:text-green-800'
                } font-medium transition`}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-2.5 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                config.color === 'blue'
                  ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  {/* Spinner — matches indigo/green role color */}
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t text-center text-sm text-gray-500">
          {selectedRole === 'admin' ? (
            <p>Need access? Contact your super admin</p>
          ) : (
            <p>Super admin access only • Authorized personnel</p>
          )}
        </div>
      </Modal>
    </div>
  )
}