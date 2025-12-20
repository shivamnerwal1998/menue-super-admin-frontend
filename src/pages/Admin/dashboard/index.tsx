// src/pages/Admin/dashboard/index.tsx
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()

  // Get user info from localStorage
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  // Mock stats - will be replaced with real API data
  const stats = {
    totalCategories: 5,
    totalItems: 22,
    activeItems: 22,
    inactiveItems: 0,
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name || 'Admin'}! 👋
        </h1>
        <p className="text-blue-100">
          Manage your restaurant menu and keep it up to date
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Categories */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Categories</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {stats.totalCategories}
          </p>
        </div>

        {/* Total Items */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
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
          </div>
          <p className="text-sm text-gray-600 font-medium">Total Items</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {stats.totalItems}
          </p>
        </div>

        {/* Active Items */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Active Items</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {stats.activeItems}
          </p>
        </div>

        {/* Inactive Items */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Inactive Items</p>
          <p className="text-3xl font-bold text-red-600 mt-1">
            {stats.inactiveItems}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/admin/menu')}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
          >
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-500 transition">
              <svg
                className="w-5 h-5 text-blue-600 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Add Menu Item</p>
              <p className="text-xs text-gray-500">Create new dish</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/menu')}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group"
          >
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-500 transition">
              <svg
                className="w-5 h-5 text-purple-600 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Add Category</p>
              <p className="text-xs text-gray-500">Organize your menu</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/settings')}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition group"
          >
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-500 transition">
              <svg
                className="w-5 h-5 text-green-600 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Restaurant Settings</p>
              <p className="text-xs text-gray-500">Update your info</p>
            </div>
          </button>
        </div>
      </div>

      {/* Success Notice - Menu is Ready! */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-green-900 mb-1">
              Menu Management is Ready! 🎉
            </h3>
            <p className="text-sm text-green-800 mb-3">
              Your menu management system is fully set up with sample data.
              Click "Menu" in the sidebar to start customizing your restaurant's
              menu.
            </p>
            <button
              onClick={() => navigate('/admin/menu')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition font-medium"
            >
              Go to Menu Management
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
