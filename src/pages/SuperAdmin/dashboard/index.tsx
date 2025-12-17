import { useState } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../../../components/superAdmin/StatCard'

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your restaurant network</p>
      </div>

      {/* Single Stats Section - Just Restaurants */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Restaurants
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Total Restaurants"
            value={stats.total}
            color="blue"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            }
          />
          <StatCard
            label="Active"
            value={stats.active}
            color="green"
            icon={
              <svg
                className="w-6 h-6"
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
            }
          />
          <StatCard
            label="Inactive"
            value={stats.inactive}
            color="red"
            icon={
              <svg
                className="w-6 h-6"
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
            }
          />
        </div>
      </div>

      {/* Single Action Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-green-50 rounded-lg">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Onboard New Account
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Add a new restaurant with admin credentials in one flow
        </p>
        <Link
          to="/super-admin/onboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition"
        >
          Start Onboarding
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}
