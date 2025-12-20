// src/components/admin/menu/CategoryCard.tsx
import { useState } from 'react'
import { Edit2, Trash2, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { Category, Item } from '../../../types/menue'
import ItemCard from './ItemCard'

interface CategoryCardProps {
  category: Category
  items: Item[]
  onEdit: () => void
  onDelete: () => void
  onAddItem: () => void
  onEditItem: (item: Item) => void
  onDeleteItem: (item: Item) => void
  onToggleItemAvailability: (item: Item) => void
}

export default function CategoryCard({
  category,
  items,
  onEdit,
  onDelete,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleItemAvailability,
}: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const vegCount = items.filter((i) => i.isVeg).length
  const nonVegCount = items.filter((i) => !i.isVeg).length

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Category Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900">
                {category.name}
              </h3>
              {!category.isActive && (
                <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                  Inactive
                </span>
              )}
            </div>
            {category.description && (
              <p className="text-sm text-gray-600">{category.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
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

          <div className="flex items-center gap-2">
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
              onClick={() => setIsExpanded(!isExpanded)}
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
      </div>

      {/* Items List */}
      {isExpanded && (
        <div className="p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-3">
                No items in this category yet
              </p>
              <button
                onClick={onAddItem}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
              >
                <Plus className="w-4 h-4" />
                Add First Item
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-3 mb-3">
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
              <button
                onClick={onAddItem}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
