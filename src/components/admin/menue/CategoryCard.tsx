// src/components/admin/menue/CategoryCard.tsx
import { Edit2, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Category, Item } from '../../../types/menue'
import ItemCard from './ItemCard'
import LoadMoreButton from '../common/LoadMoreButton'
import Spinner from '../common/Spinner'
import theme, { getThemeClasses } from '../../../configs/theme.ts'

interface CategoryCardProps {
  category: Category
  items: Item[]
  onEdit: () => void
  onDelete: () => void
  onAddItem: () => void
  onAddSubcategory?: () => void
  onEditItem: (item: Item) => void
  onDeleteItem: (item: Item) => void
  onToggleItemAvailability: (item: Item) => void
  onLoadMoreItems?: () => void
  isExpanded: boolean
  onToggleExpand: () => void
  onToggleActive?: () => void
  itemsPagination?: {
    currentCount: number
    totalCount: number
    hasMore: boolean
    isLoading: boolean
  }
  level?: number
  children?: React.ReactNode
  liveChildrenCount?: number
}

export default function CategoryCard({
  category,
  items,
  onEdit,
  onDelete,
  onAddItem,
  onAddSubcategory,
  onEditItem,
  onDeleteItem,
  onToggleItemAvailability,
  onLoadMoreItems,
  isExpanded,
  onToggleExpand,
  onToggleActive,
  itemsPagination,
  level = 0,
  children,
  liveChildrenCount = 0,
}: CategoryCardProps) {
  const [showAddOptions, setShowAddOptions] = useState(false)
  const [addType, setAddType] = useState<'item' | 'subcategory'>('item')

  const vegCount = items.filter((i) => i.isVeg).length
  const nonVegCount = items.filter((i) => !i.isVeg).length

  const hasSubcategories = liveChildrenCount > 0
  const liveItemTotal = itemsPagination?.totalCount ?? items.length
  const hasItems = liveItemTotal > 0

  const addItemDisabled = hasSubcategories
  const addSubDisabled = hasItems

  const isInitialLoading = !!itemsPagination?.isLoading && items.length === 0

  const levelStyles: Record<number, string> = {
    0: theme.categoryLevel[0],
    1: theme.categoryLevel[1],
    2: theme.categoryLevel[2],
  }
  const levelClass = levelStyles[level] ?? levelStyles[0]

  const handleAdd = () => {
    if (addType === 'item' && !addItemDisabled) {
      onAddItem()
    } else if (
      addType === 'subcategory' &&
      onAddSubcategory &&
      !addSubDisabled
    ) {
      onAddSubcategory()
    }
    setShowAddOptions(false)
  }

  const handleAddButtonClick = () => {
    const canAddItem = !addItemDisabled
    const canAddSub = level < 2 && !!onAddSubcategory && !addSubDisabled

    if (canAddItem && !canAddSub) {
      onAddItem()
      return
    }
    if (!canAddItem && canAddSub) {
      onAddSubcategory!()
      return
    }
    setShowAddOptions(true)
    if (!isExpanded) onToggleExpand()
  }

  return (
    // ✅ FIX 1: overflow-hidden on root card
    <div
      className={`rounded-xl border shadow-sm overflow-hidden ${levelClass}`}
    >
      {/* Category Header */}
      {/* ✅ FIX 2: overflow-hidden on header section too */}
      <div className={`p-4 border-b overflow-hidden ${theme.secondary.border}`}>
        {/* ✅ FIX 3: w-full on the flex row */}
        <div className="flex items-start justify-between gap-3 w-full">
          {/* Left: name + meta — ✅ FIX 4: min-w-0 + overflow-hidden */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {/* ✅ FIX 5: break-words on category name */}
              <h3
                className={`text-lg font-bold ${theme.secondary.text} break-words`}
              >
                {category.name}
              </h3>
              {level > 0 && (
                <span className={getThemeClasses.badge('blue')}>
                  Level {level}
                </span>
              )}
              {!category.isActive && (
                <span className={getThemeClasses.badge('red')}>Inactive</span>
              )}
            </div>

            {category.description && (
              // ✅ FIX 6: same nuclear fix as ItemCard — inline style for overflowWrap
              <p
                className={`text-sm ${theme.secondary.textMuted} leading-relaxed mb-2`}
                style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
              >
                {category.description}
              </p>
            )}

            <div
              className={`flex items-center gap-2 mt-2 text-sm ${theme.secondary.textMuted} flex-wrap`}
            >
              <span>{liveItemTotal} items</span>
              {vegCount > 0 && (
                <>
                  <span>•</span>
                  <span>{vegCount} veg</span>
                </>
              )}
              {nonVegCount > 0 && (
                <>
                  <span>•</span>
                  <span>{nonVegCount} non-veg</span>
                </>
              )}
            </div>
          </div>

          {/* Right: action buttons — flex-shrink-0 so buttons never get squished */}
          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
            {/* Add button */}
            {!showAddOptions ? (
              <button
                onClick={handleAddButtonClick}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm ${getThemeClasses.buttonPrimary()} shadow-sm`}
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={
                    (addType === 'item' && addItemDisabled) ||
                    (addType === 'subcategory' && addSubDisabled)
                  }
                  className={`px-3 py-1.5 ${getThemeClasses.buttonPrimary()} text-sm disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  Continue
                </button>
                <button
                  onClick={() => setShowAddOptions(false)}
                  className={`px-3 py-1.5 ${theme.secondary.bgMuted} ${theme.secondary.text} rounded-lg hover:${theme.secondary.bgHover} transition text-sm font-medium`}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Toggle Active */}
            {onToggleActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleActive()
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  category.isActive
                    ? `${theme.status.success.bg} ${theme.status.success.text} hover:bg-green-200 border ${theme.status.success.borderStrong}`
                    : `${theme.secondary.bgMuted} ${theme.secondary.text} hover:${theme.secondary.bgHover} border ${theme.secondary.border}`
                }`}
                title={
                  category.isActive
                    ? 'Click to deactivate'
                    : 'Click to activate'
                }
              >
                {category.isActive ? '✓ Active' : '○ Inactive'}
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              className={`p-2 hover:${theme.secondary.bgMuted} rounded-lg transition`}
              title="Edit category"
            >
              <Edit2 className={`w-4 h-4 ${theme.secondary.textMuted}`} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-2 hover:bg-red-50 rounded-lg transition"
              title="Delete category"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>

            {/* Chevron */}
            <button
              onClick={onToggleExpand}
              className={`p-2 hover:${theme.secondary.bgMuted} rounded-lg transition`}
            >
              <ChevronDown
                className={`w-5 h-5 ${theme.secondary.textMuted} transition-transform duration-300 ease-in-out`}
                style={{
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>
          </div>
        </div>

        {/* Add Options picker */}
        {showAddOptions && (
          <div className={`mt-3 pt-3 border-t ${theme.secondary.border}`}>
            <div
              className={`${theme.secondary.bgMuted} border ${theme.secondary.border} rounded-lg p-3 space-y-2`}
            >
              {/* Add Item option */}
              <div className="relative group/item">
                <label
                  className={`flex items-center gap-2 ${
                    addItemDisabled
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer'
                  }`}
                >
                  <input
                    type="radio"
                    name={`add-type-${category.id}`}
                    checked={addType === 'item'}
                    onChange={() => !addItemDisabled && setAddType('item')}
                    disabled={addItemDisabled}
                    className={`w-4 h-4 ${theme.accent.textDark} border-gray-300 focus:ring-indigo-500 disabled:cursor-not-allowed`}
                  />
                  <span
                    className={`text-sm font-medium ${theme.secondary.text}`}
                  >
                    Add Item
                  </span>
                  {addItemDisabled && (
                    <span className={`text-xs ${theme.status.error.icon}`}>
                      (not allowed)
                    </span>
                  )}
                </label>
                {addItemDisabled && (
                  <div className="absolute left-0 -top-10 z-20 hidden group-hover/item:block bg-gray-800 text-white text-xs rounded px-2 py-1.5 whitespace-nowrap shadow-lg pointer-events-none">
                    Cannot add items — this category already has subcategories
                    <div className="absolute left-3 top-full border-4 border-transparent border-t-gray-800" />
                  </div>
                )}
              </div>

              {/* Add Subcategory option */}
              {level < 2 && onAddSubcategory && (
                <div className="relative group/sub">
                  <label
                    className={`flex items-center gap-2 ${
                      addSubDisabled
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`add-type-${category.id}`}
                      checked={addType === 'subcategory'}
                      onChange={() =>
                        !addSubDisabled && setAddType('subcategory')
                      }
                      disabled={addSubDisabled}
                      className={`w-4 h-4 ${theme.accent.textDark} border-gray-300 focus:ring-indigo-500 disabled:cursor-not-allowed`}
                    />
                    <span
                      className={`text-sm font-medium ${theme.secondary.text}`}
                    >
                      Add Subcategory
                    </span>
                    {addSubDisabled && (
                      <span className={`text-xs ${theme.status.error.icon}`}>
                        (not allowed)
                      </span>
                    )}
                  </label>
                  {addSubDisabled && (
                    <div className="absolute left-0 -top-10 z-20 hidden group-hover/sub:block bg-gray-800 text-white text-xs rounded px-2 py-1.5 whitespace-nowrap shadow-lg pointer-events-none">
                      Cannot add subcategory — this category already has items
                      <div className="absolute left-3 top-full border-4 border-transparent border-t-gray-800" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subcategories */}
      {isExpanded && children && (
        <div className={`p-4 space-y-3 ${theme.secondary.bgMuted}/50`}>
          {children}
        </div>
      )}

      {/* Items */}
      {isExpanded && (
        <div className="p-4">
          {isInitialLoading ? (
            <div className="flex justify-center py-6">
              <Spinner size="sm" />
            </div>
          ) : items.length === 0 ? (
            <div />
          ) : (
            <>
              <div className="grid gap-3">
                {items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={() => onEditItem(item)}
                    onDelete={() => onDeleteItem(item)}
                    onToggleAvailability={() => onToggleItemAvailability(item)}
                  />
                ))}
              </div>
              {itemsPagination && onLoadMoreItems && (
                <LoadMoreButton
                  onLoadMore={onLoadMoreItems}
                  hasMore={itemsPagination.hasMore}
                  isLoading={itemsPagination.isLoading}
                  currentCount={itemsPagination.currentCount}
                  totalCount={itemsPagination.totalCount}
                  itemName="items"
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
