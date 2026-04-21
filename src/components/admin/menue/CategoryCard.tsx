// src/components/admin/menue/CategoryCard.tsx
import { Edit2, Trash2, ChevronDown, Plus } from 'lucide-react'
import { useState } from 'react'
import { Category, Item } from '../../../types/menue'
import ItemCard from './ItemCard'
import LoadMoreButton from '../common/LoadMoreButton'

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
  // Live subcategory count computed in MenuManagement from the categories array
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

  // ── Mutual exclusion using LIVE state ──────────────────────────────────
  // liveChildrenCount: count of categories[] entries with parentId === category.id
  // liveItemTotal: totalCount from pagination (real server total) or items.length
  const hasSubcategories = liveChildrenCount > 0
  const liveItemTotal = itemsPagination?.totalCount ?? items.length
  const hasItems = liveItemTotal > 0

  const addItemDisabled = hasSubcategories
  const addSubDisabled = hasItems
  // ────────────────────────────────────────────────────────────────────────

  const levelStyles: Record<number, string> = {
    0: 'bg-white border-gray-200',
    1: 'bg-gray-50 border-l-4 border-l-blue-400 ml-4',
    2: 'bg-blue-50 border-l-4 border-l-blue-600 ml-8',
  }
  const levelClass = levelStyles[level] ?? levelStyles[0]

  const handleAdd = () => {
    if (addType === 'item' && !addItemDisabled) {
      onAddItem()
    } else if (addType === 'subcategory' && onAddSubcategory && !addSubDisabled) {
      onAddSubcategory()
    }
    setShowAddOptions(false)
  }

  const handleAddButtonClick = () => {
    const canAddItem = !addItemDisabled
    const canAddSub = level < 2 && !!onAddSubcategory && !addSubDisabled

    if (canAddItem && !canAddSub) {
      // Only items possible — fire directly, no picker needed
      onAddItem()
      return
    }
    if (!canAddItem && canAddSub) {
      // Only subcategory possible — fire directly
      onAddSubcategory!()
      return
    }
    // Both available or both disabled — show picker
    setShowAddOptions(true)
    if (!isExpanded) onToggleExpand()
  }

  return (
    <div className={`rounded-xl border shadow-sm ${levelClass}`}>
      {/* Category Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between gap-3">

          {/* Left: name + meta */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
              {level > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  Level {level}
                </span>
              )}
              {!category.isActive && (
                <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                  Inactive
                </span>
              )}
            </div>
            {category.description && (
              <p className="text-sm text-gray-600 mb-2">{category.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 flex-wrap">
              <span>{liveItemTotal} items</span>
              {vegCount > 0 && <><span>•</span><span>{vegCount} veg</span></>}
              {nonVegCount > 0 && <><span>•</span><span>{nonVegCount} non-veg</span></>}
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-2 flex-wrap">

            {/* Add button — always visible */}
            {!showAddOptions ? (
              <button
                onClick={handleAddButtonClick}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium shadow-sm"
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
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
                <button
                  onClick={() => setShowAddOptions(false)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Toggle Active */}
            {onToggleActive && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleActive() }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  category.isActive
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
                title={category.isActive ? 'Click to deactivate' : 'Click to activate'}
              >
                {category.isActive ? '✓ Active' : '○ Inactive'}
              </button>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); onEdit() }}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Edit category"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="p-2 hover:bg-red-50 rounded-lg transition"
              title="Delete category"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>

            {/* Chevron with smooth CSS rotation */}
            <button onClick={onToggleExpand} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ChevronDown
                className="w-5 h-5 text-gray-600 transition-transform duration-300 ease-in-out"
                style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
          </div>
        </div>

        {/* Add Options picker */}
        {showAddOptions && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">

              {/* Add Item option */}
              <div className="relative group/item">
                <label className={`flex items-center gap-2 ${addItemDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                  <input
                    type="radio"
                    name={`add-type-${category.id}`}
                    checked={addType === 'item'}
                    onChange={() => !addItemDisabled && setAddType('item')}
                    disabled={addItemDisabled}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                  <span className="text-sm font-medium text-gray-700">Add Item</span>
                  {addItemDisabled && (
                    <span className="text-xs text-red-500">(not allowed)</span>
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
                  <label className={`flex items-center gap-2 ${addSubDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                    <input
                      type="radio"
                      name={`add-type-${category.id}`}
                      checked={addType === 'subcategory'}
                      onChange={() => !addSubDisabled && setAddType('subcategory')}
                      disabled={addSubDisabled}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:cursor-not-allowed"
                    >
                    </input>
                    <span className="text-sm font-medium text-gray-700">Add Subcategory</span>
                    {addSubDisabled && (
                      <span className="text-xs text-red-500">(not allowed)</span>
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
        <div className="p-4 space-y-3 bg-gray-50/50">{children}</div>
      )}

      {/* Items */}
      {isExpanded && (
        <div className="p-4">
          {items.length === 0 ? <div /> : (
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