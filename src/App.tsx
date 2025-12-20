import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProtectedRoute from './routes/ProtectedRoutes'
import SuperAdminDashboard from './pages/SuperAdmin/dashboard/index'
import SuperAdminLayout from './layouts/SuperAdminLayout'
import RestaurantsPage from './pages/SuperAdmin/restaurants'
import UsersPage from './pages/SuperAdmin/users'
import OnboardPage from './pages/SuperAdmin/onboard'

// Admin imports
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/Admin/dashboard'
import AdminMenu from './pages/Admin/menue'

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />

      {/* Super Admin Protected */}
      <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="restaurants" element={<RestaurantsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="onboard" element={<OnboardPage />} />
        </Route>
      </Route>

      {/* Restaurant Admin Protected */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="menu" element={<AdminMenu />} />
        </Route>
      </Route>

      {/* Unauthorized */}
      <Route
        path="/unauthorized"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">403</h1>
              <p className="text-xl text-gray-600 mb-4">Unauthorized Access</p>
              <a href="/" className="text-blue-600 hover:underline">
                Go to Login
              </a>
            </div>
          </div>
        }
      />

      {/* 404 Not Found */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-4">Page Not Found</p>
              <a href="/" className="text-blue-600 hover:underline">
                Go to Login
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  )
}

export default App
