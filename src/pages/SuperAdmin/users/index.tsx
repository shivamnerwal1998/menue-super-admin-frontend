import { useState, useEffect } from 'react'
import { api } from '../../../utils/api'
import UserCard from '../../../components/superAdmin/UserCard'
import Pagination from '../../../components/shared/Pagination'

type User = {
  id: number
  name: string
  email: string
  mobile: string
  dateOfBirth?: string
  role: string
  isActive: boolean
  entity?: {
    id: number
    name: string
  }
  createdAt?: string
  updatedAt?: string
  lastLogin?: string
}

// ✅ API response structure (flat, not nested like restaurants)
type ApiResponse = {
  success: boolean
  total: number
  page: number
  limit: number
  data: User[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'inactive'
  >('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const limit = 10

  useEffect(() => {
    fetchUsers()
  }, [currentPage])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      // ✅ Real API call with pagination
      const response: ApiResponse = await api.get(
        `/super-admin/users?page=${currentPage}&limit=${limit}`,
      )

      if (response.success) {
        setUsers(response.data || [])
        setTotalRecords(response.total)
        setTotalPages(Math.ceil(response.total / response.limit))
      } else {
        throw new Error('Failed to fetch users')
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    alert(`Edit: ${user.name}`)
    // TODO: Open edit modal with user data
  }

  const handleToggle = async (id: number, isActive: boolean) => {
    // Optimistic update
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive } : u)))

    try {
      // ✅ Real API call for toggle
      await api.patch(`/super-admin/users/${id}/toggle`, { isActive })
    } catch (error) {
      console.error('Failed to toggle user:', error)
      // Revert on error
      fetchUsers()
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO v2: Server-side search coming soon
    alert(
      '🚀 Search functionality coming in v2!\n\nThis will search across:\n• User names\n• Email addresses\n• Mobile numbers\n• Restaurant names',
    )
  }

  const handleFilterChange = (status: 'all' | 'active' | 'inactive') => {
    setFilterStatus(status)
    // TODO v2: Server-side filtering coming soon
    alert(
      '🚀 Filter functionality coming in v2!\n\nThis will filter users by active/inactive status.',
    )
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    // TODO v2: Will implement debounced search
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-white rounded-lg border border-red-200 p-6 max-w-md">
          <div className="flex items-center gap-3 text-red-600 mb-2">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-semibold">Error Loading Users</h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-gray-600 mt-1">Manage restaurant admin accounts</p>
        </div>
      </div>

      {/* Search & Filter Bar - UI Only (v2 will implement) */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name, email, mobile, or restaurant... (Coming in v2)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          <button
            type="submit"
            className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-600 bg-white rounded-lg border border-gray-200 px-4 py-3">
        <span>
          Showing {users.length} of {totalRecords} users
        </span>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* User List */}
      <div>
        {users.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600 mb-4">
              No users available on this page
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEdit}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
