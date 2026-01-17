// src/components/admin/menue/CategoryCard.tsx
import { Edit2, Trash2, ChevronDown, ChevronUp, Plus } from 'lucide-react'
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
  itemsPagination?: {
    currentCount: number
    totalCount: number
    hasMore: boolean
    isLoading: boolean
  }
  level?: number
  children?: React.ReactNode
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
  itemsPagination,
  level = 0,
  children,
}: CategoryCardProps) {
  const [showAddOptions, setShowAddOptions] = useState(false)
  const [addType, setAddType] = useState<'item' | 'subcategory'>('item')

  const vegCount = items.filter((i) => i.isVeg).length
  const nonVegCount = items.filter((i) => !i.isVeg).length

  const levelStyles = {
    0: 'bg-white border-gray-200',
    1: 'bg-gray-50 border-l-4 border-l-blue-400 ml-4',
    2: 'bg-blue-50 border-l-4 border-l-blue-600 ml-8',
  }

  const levelClass =
    levelStyles[level as keyof typeof levelStyles] || levelStyles[0]

  const handleAdd = () => {
    if (addType === 'item') {
      onAddItem()
    } else if (onAddSubcategory) {
      onAddSubcategory()
    }
    setShowAddOptions(false)
  }

  return (
    <div className={`rounded-xl border shadow-sm ${levelClass}`}>
      {/* Category Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900">
                {category.name}
              </h3>
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
              <p className="text-sm text-gray-600 mb-2">
                {category.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 flex-wrap">
              <span>{items.length} items</span>
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

          <div className="flex items-center gap-2 flex-wrap">
            {/* Add Button - Shown when expanded */}
            {isExpanded && (
              <>
                {!showAddOptions ? (
                  <button
                    onClick={() => setShowAddOptions(true)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleAdd}
                      className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
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
              </>
            )}

            <button
              onClick={onEdit}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Edit category"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-50 rounded-lg transition"
              title="Delete category"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
            <button
              onClick={onToggleExpand}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Add Options Radio Buttons - Show below header when expanded */}
        {isExpanded && showAddOptions && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`add-type-${category.id}`}
                    checked={addType === 'item'}
                    onChange={() => setAddType('item')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Add Item
                  </span>
                </label>
                {level < 2 && onAddSubcategory && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`add-type-${category.id}`}
                      checked={addType === 'subcategory'}
                      onChange={() => setAddType('subcategory')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Add Subcategory
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subcategories (Children) */}
      {isExpanded && children && (
        <div className="p-4 space-y-3 bg-gray-50/50">{children}</div>
      )}

      {/* Items List */}
      {isExpanded && (
        <div className="p-4">
          {items.length === 0 ? (
            <div>
              {/* <p className="text-gray-500 mb-3">No items in this category yet</p>
              <button
                onClick={onAddItem}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
              >
                <Plus className="w-4 h-4" />
                Add First Item
              </button> */}
            </div>
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
