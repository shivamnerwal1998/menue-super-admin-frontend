// src/components/admin/common/LoadMoreButton.tsx
import { ChevronDown, Loader2 } from 'lucide-react'

interface LoadMoreButtonProps {
  onLoadMore: () => void
  hasMore: boolean
  isLoading?: boolean
  currentCount: number
  totalCount: number
  itemName?: string
}

export default function LoadMoreButton({
  onLoadMore,
  hasMore,
  isLoading = false,
  currentCount,
  totalCount,
  itemName = 'items',
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">
          All {totalCount} {itemName} loaded
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <p className="text-sm text-gray-600">
        Showing {currentCount} of {totalCount} {itemName}
      </p>
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed border-2 border-blue-200 hover:border-blue-300"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <ChevronDown className="w-5 h-5" />
            Load More {itemName.charAt(0).toUpperCase() + itemName.slice(1)}
          </>
        )}
      </button>
    </div>
  )
}