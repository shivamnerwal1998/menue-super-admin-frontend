import { useState, useEffect } from 'react'
import { api } from '../../../utils/api'
import RestaurantCard from '../../../components/superAdmin/RestaurantCard'
import Pagination from '../../../components/shared/Pagination'
import EditRestaurantModal from '../../../components/superAdmin/EditRestaurantModal'
import StatusModal from '../../../components/shared/StatusModal'
import { superAdmin } from '../../../utils/constants'

type Restaurant = {
  id: number
  name: string
  contact: string
  email?: string
  address?: string
  logo?: string
  totalScans?: number
  menuViews?: number
  isActive: boolean
  user: {
    id: number
    name: string
    email: string
    mobile: string
  }
  createdAt?: string
}

type ApiResponse = {
  success: boolean
  data: {
    total: number
    page: number
    limit: number
    data: Restaurant[]
  }
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [editingRestaurant, setEditingRestaurant] = useState<any>(null)
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean
    type: 'success' | 'error'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  })
  const limit = 10

  useEffect(() => {
    fetchRestaurants()
  }, [currentPage])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      setError(null)

      const response: ApiResponse = await api.get(
        `${superAdmin.getRestaurants}?page=${currentPage}&limit=${limit}`,
      )

      if (response.success && response.data) {
        setRestaurants(response.data.data || [])
        setTotalRecords(response.data.total)
        setTotalPages(Math.ceil(response.data.total / response.data.limit))
      } else {
        throw new Error('Failed to fetch restaurants')
      }
    } catch (err) {
      console.error('Failed to fetch restaurants:', err)
      setError('Failed to load restaurants')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (restaurant: any) => {
    setEditingRestaurant(restaurant)
  }

  const handleToggle = async (id: number, isActive: boolean) => {
    // Optimistic update
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive } : r)),
    )

    try {
      await api.patch(`/super-admin/restaurants/${id}/status`, { isActive })

      setStatusModal({
        isOpen: true,
        type: 'success',
        title: 'Success!',
        message: `Restaurant ${isActive ? 'enabled' : 'disabled'} successfully`,
      })
    } catch (error) {
      console.error('Failed to toggle restaurant:', error)
      // Revert on error
      fetchRestaurants()

      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Toggle Failed',
        message: 'Failed to update restaurant status',
      })
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO v2: Implement server-side search
    // Will call: /super-admin/restaurants?page=1&limit=10&search=${searchQuery}
    console.log('Search functionality coming in v2:', searchQuery)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    // TODO v2: Debounced search or search on enter
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurants...</p>
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
            <h3 className="font-semibold">Error Loading Restaurants</h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchRestaurants}
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
      <EditRestaurantModal
        isOpen={!!editingRestaurant}
        onClose={() => setEditingRestaurant(null)}
        restaurant={editingRestaurant}
        onSuccess={fetchRestaurants}
      />

      {/* Status Modal */}
      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal((prev) => ({ ...prev, isOpen: false }))}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-gray-600 mt-1">
            Manage restaurant accounts and their admins
          </p>
        </div>
      </div>

      {/* Search Bar - UI Only (v2 will implement server-side search) */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex gap-3">
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
              placeholder="Search by restaurant name, admin, contact, or email... (Coming in v2)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            />
          </div>
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
          Showing {restaurants.length} of {totalRecords} restaurants
        </span>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Restaurant List */}
      <div>
        {restaurants.length === 0 ? (
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'No restaurants available on this page'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
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
