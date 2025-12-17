import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProtectedRoute from './routes/ProtectedRoutes'
import SuperAdminDashboard from './pages/SuperAdmin/dashboard/index'
import SuperAdminLayout from './layouts/SuperAdminLayout'
import RestaurantsPage from './pages/SuperAdmin/restaurants'
import UsersPage from './pages/SuperAdmin/users'
import OnboardPage from './pages/SuperAdmin/onboard'

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />

      {/* Super Admin Protected */}
      <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          {/* Redirect /super-admin → /super-admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="restaurants" element={<RestaurantsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="onboard" element={<OnboardPage />} />
        </Route>
      </Route>

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<div>Unauthorized</div>} />
    </Routes>
  )
}

export default App
