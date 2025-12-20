// src/components/admin/menu/SampleBanner.tsx
import { AlertCircle, X } from 'lucide-react'

interface SampleBannerProps {
  onStartEditing: () => void
  onClearAll: () => void
  onDismiss: () => void
}

export default function SampleBanner({
  onStartEditing,
  onClearAll,
  onDismiss,
}: SampleBannerProps) {
  return (
    <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <h3 className="font-bold text-orange-900">SAMPLE MENU LOADED</h3>
          </div>
          <p className="text-sm text-orange-800 mb-4">
            This is demo data to help you get started quickly. Click any item to
            customize with your real menu items.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onStartEditing}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition font-medium"
            >
              Start Editing
            </button>
            <button
              onClick={onClearAll}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-orange-700 border border-orange-300 text-sm rounded-lg transition font-medium"
            >
              Clear All Sample Data
            </button>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 text-orange-600 hover:text-orange-800 flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}