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
  lastLogin?: string
}

type UserCardProps = {
  user: User
  onEdit: (user: User) => void
  onToggle: (id: number, isActive: boolean) => void
}

export default function UserCard({ user, onEdit, onToggle }: UserCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(dateString)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
              user.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {user.isActive ? '🟢 Active' : '⚪ Inactive'}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5 text-sm mb-3">
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
            <span className="truncate">{user.email}</span>
          </div>

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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{user.mobile}</span>
          </div>
        </div>

        {/* Restaurant Assignment */}
        <div className="pt-3 border-t">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Restaurant
          </p>
          {user.entity ? (
            <div className="flex items-center gap-2 text-sm">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                {user.entity.name}
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-400 italic">Not assigned</span>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Last login: {getTimeAgo(user.lastLogin)}</span>
          </div>
          <span>Joined {formatDate(user.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 p-4 bg-gray-50 border-t">
        <button
          onClick={() => onEdit(user)}
          className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
        >
          Edit
        </button>

        <button
          onClick={() => onToggle(user.id, !user.isActive)}
          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          {user.isActive ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  )
}
