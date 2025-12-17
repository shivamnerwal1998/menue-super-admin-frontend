import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

type Props = {
  allowedRoles: ('SUPER_ADMIN' | 'ADMIN' | 'VIEWER')[]
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (!user || !allowedRoles.includes(user.role!)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
