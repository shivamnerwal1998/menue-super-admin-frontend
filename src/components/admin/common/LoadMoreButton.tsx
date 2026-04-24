import { ChevronDown, Loader2 } from 'lucide-react'
import theme, { getThemeClasses } from '../../../configs/theme.ts'

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
        <p className={`text-sm ${theme.secondary.textMuted}`}>
          All {totalCount} {itemName} loaded
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <p className={`text-sm ${theme.secondary.textMuted}`}>
        Showing {currentCount} of {totalCount} {itemName}
      </p>
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className={getThemeClasses.loadMoreButton()}
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
