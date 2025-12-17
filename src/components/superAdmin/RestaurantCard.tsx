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

type RestaurantCardProps = {
  restaurant: Restaurant
  onEdit: (restaurant: Restaurant) => void
  onToggle: (id: number, isActive: boolean) => void
}

export default function RestaurantCard({
  restaurant,
  onEdit,
  onToggle,
}: RestaurantCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Logo */}
          {restaurant.logo && (
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-gray-200"
            />
          )}

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">
                {restaurant.name}
              </h3>

              {/* Status Badge */}
              <span
                className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                  restaurant.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {restaurant.isActive ? '🟢 Active' : '⚪ Inactive'}
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-1.5 text-sm mb-3">
              <div className="flex items-center gap-2 text-gray-700">
                <svg
                  className="w-4 h-4 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>{restaurant.contact}</span>
              </div>

              {restaurant.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="truncate">{restaurant.email}</span>
                </div>
              )}

              {restaurant.address && (
                <div className="flex items-start gap-2 text-gray-600">
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-700">{restaurant.address}</span>
                </div>
              )}
            </div>

            {/* Admin Info */}
            <div className="pt-3 border-t space-y-1.5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Admin
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">{restaurant.user.name}</span>
              </div>
              <div className="text-xs text-gray-500">
                {restaurant.user.email} • {restaurant.user.mobile}
              </div>
            </div>

            {/* Analytics */}
            {(restaurant.totalScans !== undefined ||
              restaurant.menuViews !== undefined) && (
              <div className="flex gap-4 text-xs text-gray-500 mt-3 pt-3 border-t">
                {restaurant.totalScans !== undefined && (
                  <div className="flex items-center gap-1">
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
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    <span>{restaurant.totalScans.toLocaleString()} scans</span>
                  </div>
                )}
                {restaurant.menuViews !== undefined && (
                  <div className="flex items-center gap-1">
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>{restaurant.menuViews.toLocaleString()} views</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 p-4 bg-gray-50 border-t">
        <button
          onClick={() => onEdit(restaurant)}
          className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
        >
          Edit
        </button>

        <button
          onClick={() => onToggle(restaurant.id, !restaurant.isActive)}
          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          {restaurant.isActive ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  )
}
