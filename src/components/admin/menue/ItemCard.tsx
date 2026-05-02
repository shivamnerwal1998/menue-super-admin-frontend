import { Edit2, Trash2 } from 'lucide-react'
import { Item } from '../../../types/menue'
import theme from '../../../configs/theme.ts'

interface ItemCardProps {
  item: Item
  onEdit: () => void
  onDelete: () => void
  onToggleAvailability: () => void
}

const formatPrice = (paise: number) => `₹${paise}`
const isSampleItem = (name: string) => name.startsWith('Sample ')

export default function ItemCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}: ItemCardProps) {
  const isSample = isSampleItem(item.name)

  return (
    <div
      className={`border-2 rounded-lg p-4 transition overflow-hidden ${
        isSample
          ? `border-l-4 border-l-orange-500 ${theme.status.warning.bgLight}`
          : `${theme.secondary.bg} ${theme.secondary.border} hover:shadow-md`
      }`}
    >
      {isSample && (
        <div className="mb-2">
          <span
            className={`inline-block px-2 py-1 ${theme.status.warning.badge} ${theme.primary.text} text-xs rounded font-medium`}
          >
            ⚠️ SAMPLE
          </span>
        </div>
      )}

      {/* ✅ FIX 2: w-full on the flex row so it never exceeds card width */}
      <div className="flex items-start justify-between gap-3 w-full">
        {/* ✅ FIX 3: min-w-0 + overflow-hidden on the text column */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* ✅ FIX 4: truncate long item names gracefully */}
          <h4
            className={`font-semibold ${theme.secondary.text} mb-1 break-words`}
          >
            {item.name}
          </h4>

          <div className="flex flex-wrap items-center gap-2 mb-2 text-sm">
            <span
              className={`flex items-center gap-1 ${
                item.isVeg ? 'text-green-600' : 'text-red-600'
              } font-medium`}
            >
              {item.isVeg ? '🟢' : '🔴'} {item.isVeg ? 'Veg' : 'Non-Veg'}
            </span>
            <span className={theme.secondary.textSubtle}>•</span>
            <span className={`font-semibold ${theme.accent.text}`}>
              {formatPrice(item.price)}
            </span>
          </div>

          {item.description && (
            // ✅ FIX 5: break-all handles strings with zero spaces (like your test case)
            // overflow-wrap: anywhere as inline style is the nuclear option fallback
            <p
              className={`text-sm ${theme.secondary.textMuted} leading-relaxed mb-2`}
              style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
            >
              {item.description}
            </p>
          )}

          <button
            onClick={onToggleAvailability}
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
              item.isAvailable
                ? `${theme.status.success.bg} ${theme.status.success.textDark}`
                : `${theme.status.error.bg} ${theme.status.error.textDark}`
            }`}
          >
            {item.isAvailable ? '✅ Available' : '❌ Out of Stock'}
          </button>
        </div>
      </div>

      <div
        className={`flex gap-2 mt-3 pt-3 border-t ${theme.secondary.border}`}
      >
        <button
          onClick={onEdit}
          className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm ${theme.accent.bgLight} hover:${theme.accent.bgLightHover} ${theme.accent.textDark} rounded-lg transition font-medium`}
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm ${theme.status.error.bgLight} hover:${theme.status.error.bg} ${theme.status.error.icon} rounded-lg transition font-medium`}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  )
}
