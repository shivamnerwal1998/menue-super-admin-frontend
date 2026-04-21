// src/components/admin/menue/CategoryFormModal.tsx
import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { Category, ValidationError } from '../../../types/menue'

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Category>) => Promise<void>
  category?: Category
  isLoading?: boolean
  validationErrors?: ValidationError[]
  categories?: Category[] // ✅ NEW: For parent selector
  parentId?: number | null // ✅ NEW: Pre-selected parent
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  category,
  isLoading = false,
  validationErrors = [],
  categories = [],
  parentId = null,
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    sortOrder: 0,
    parentId: parentId,
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        isActive: category.isActive,
        sortOrder: category.sortOrder || 0,
        parentId: category.parentId || null,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        isActive: true,
        sortOrder: 0,
        parentId: parentId,
      })
    }
  }, [category, parentId, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    await onSave(formData)
  }

  const getFieldError = (fieldName: string): string | undefined => {
    const error = validationErrors.find((err) => err.field === fieldName)
    return error?.message
  }

  // ✅ Filter categories for parent selector (only level 0 and 1 can be parents)
  const availableParents = categories.filter((cat) => {
    const catLevel = cat.level || 0
    // Can't select self as parent
    if (category && cat.id === category.id) return false
    // Only level 0 and 1 can be parents (max depth is 2)
    return catLevel < 2
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        category
          ? 'Edit Category'
          : parentId
          ? 'Add Subcategory'
          : 'Add Category'
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Parent Category Info */}
          {parentId && !category && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Creating subcategory under:{' '}
                <strong>
                  {categories.find((c) => c.id === parentId)?.name}
                </strong>
              </p>
            </div>
          )}

          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none ${
                getFieldError('name') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Starters"
              maxLength={200}
              disabled={isLoading}
            />
            {getFieldError('name') && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {getFieldError('name')}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none ${
                getFieldError('description')
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Brief description of this category"
              rows={3}
              maxLength={500}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                {formData.description.length}/500 characters
              </p>
              {getFieldError('description') && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {getFieldError('description')}
                </p>
              )}
            </div>
          </div>

          {/* Parent Category Selector (Only if not pre-selected) */}
          {!parentId && (
            <div className='hidden'>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category (Optional)
              </label>
              <select
                value={formData.parentId || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parentId: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none ${
                  getFieldError('parentId')
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                <option value="">None (Root Category)</option>
                {availableParents.map((cat) => {
                  const catLevel = cat.level || 0
                  const indent = '  '.repeat(catLevel)
                  const disabled = catLevel >= 2

                  return (
                    <option key={cat.id} value={cat.id} disabled={disabled}>
                      {indent}
                      {cat.name}
                      {catLevel === 1 && ' (Child)'}
                      {disabled && ' (Max depth)'}
                    </option>
                  )
                })}
              </select>
              {getFieldError('parentId') && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {getFieldError('parentId')}
                </p>
              )}
            </div>
          )}

          {/* Sort Order */}
          <div className='hidden'>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order
            </label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sortOrder: parseInt(e.target.value) || 0,
                })
              }
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none ${
                getFieldError('sortOrder')
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              min="0"
              disabled={isLoading}
            />
            {getFieldError('sortOrder') && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {getFieldError('sortOrder')}
              </p>
            )}
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-200"
              disabled={isLoading}
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Active (visible on menu)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? 'Saving...'
                : category
                ? 'Update Category'
                : 'Create Category'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
