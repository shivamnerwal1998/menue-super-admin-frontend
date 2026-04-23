// src/components/admin/menu/ItemCard.tsx
import { Edit2, Trash2 } from 'lucide-react'
import { Item } from '../../../types/menue'

interface ItemCardProps {
  item: Item
  onEdit: () => void
  onDelete: () => void
  onToggleAvailability: () => void
}

const formatPrice = (paise: number) => {
  return `₹${paise}`
}

const isSampleItem = (name: string) => {
  return name.startsWith('Sample ')
}

export default function ItemCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}: ItemCardProps) {
  const isSample = isSampleItem(item.name)

  return (
    <div
      className={`bg-white border-2 rounded-lg p-4 transition ${
        isSample
          ? 'border-l-4 border-l-orange-500 bg-orange-50'
          : 'border-gray-200 hover:shadow-md'
      }`}
    >
      {isSample && (
        <div className="mb-2">
          <span className="inline-block px-2 py-1 bg-orange-500 text-white text-xs rounded font-medium">
            ⚠️ SAMPLE
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>

          <div className="flex flex-wrap items-center gap-2 mb-2 text-sm">
            <span
              className={`flex items-center gap-1 ${
                item.isVeg ? 'text-green-600' : 'text-red-600'
              } font-medium`}
            >
              {item.isVeg ? '🟢' : '🔴'} {item.isVeg ? 'Veg' : 'Non-Veg'}
            </span>
            <span className="text-gray-400">•</span>
            <span className="font-semibold text-blue-500">
              {formatPrice(item.price)}
            </span>
          </div>

          {item.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {item.description}
            </p>
          )}

          <button
            onClick={onToggleAvailability}
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
              item.isAvailable
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {item.isAvailable ? '✅ Available' : '❌ Out of Stock'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition font-medium"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  )
}
