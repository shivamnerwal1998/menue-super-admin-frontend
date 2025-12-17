import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

type Role = 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER' | null

type User = {
  id?: number
  name?: string
  email?: string
  role: Role
  entityId?: number
}

type AuthContextType = {
  token: string | null
  user: User | null
  login: (token: string, role: Role, userData?: Partial<User>) => void
  logout: () => void
  isAuthenticated: boolean
  isSuperAdmin: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load from localStorage on mount
    const storedToken = localStorage.getItem('token')
    const storedRole = localStorage.getItem('role') as Role
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedRole) {
      setToken(storedToken)
      setUser(storedUser ? JSON.parse(storedUser) : { role: storedRole })
    }

    setIsLoading(false)
  }, [])

  const login = (newToken: string, newRole: Role, userData?: Partial<User>) => {
    const userObj: User = {
      role: newRole,
      ...userData,
    }

    localStorage.setItem('token', newToken)
    localStorage.setItem('role', newRole ?? '')
    localStorage.setItem('user', JSON.stringify(userObj))

    setToken(newToken)
    setUser(userObj)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user')

    setToken(null)
    setUser(null)

    window.location.href = '/'
  }

  // Don't render children until we've checked localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
        isSuperAdmin: user?.role === 'SUPER_ADMIN',
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
