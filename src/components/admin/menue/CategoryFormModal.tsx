// src/components/admin/menue/CategoryFormModal.tsx
import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { Category, ValidationError } from '../../../types/menue'
import theme, { getThemeClasses } from '../../../configs/theme.ts'

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Category>) => Promise<void>
  category?: Category
  isLoading?: boolean
  validationErrors?: ValidationError[]
  categories?: Category[]
  parentId?: number | null
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

  const availableParents = categories.filter((cat) => {
    const catLevel = cat.level || 0
    if (category && cat.id === category.id) return false
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
            <div
              className={`p-3 ${theme.status.info.bgLight} border ${theme.status.info.border} rounded-lg`}
            >
              <p className={`text-sm ${theme.status.info.textDark}`}>
                Creating subcategory under:{' '}
                <strong>
                  {categories.find((c) => c.id === parentId)?.name}
                </strong>
              </p>
            </div>
          )}

          {/* Category Name */}
          <div>
            <label
              className={`block text-sm font-medium ${theme.secondary.text} mb-1`}
            >
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full px-3 py-2 ${
                getFieldError('name')
                  ? getThemeClasses.inputError()
                  : getThemeClasses.input()
              }`}
              placeholder="e.g., Starters"
              maxLength={200}
              disabled={isLoading}
            />
            {getFieldError('name') && (
              <p
                className={`text-xs ${theme.status.error.icon} mt-1 flex items-center gap-1`}
              >
                <AlertCircle className="w-3 h-3" />
                {getFieldError('name')}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              className={`block text-sm font-medium ${theme.secondary.text} mb-1`}
            >
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`w-full px-3 py-2 ${
                getFieldError('description')
                  ? getThemeClasses.inputError()
                  : getThemeClasses.input()
              }`}
              placeholder="Brief description of this category"
              rows={3}
              maxLength={500}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-1">
              <p className={`text-xs ${theme.secondary.textMuted}`}>
                {formData.description.length}/500 characters
              </p>
              {getFieldError('description') && (
                <p
                  className={`text-xs ${theme.status.error.icon} flex items-center gap-1`}
                >
                  <AlertCircle className="w-3 h-3" />
                  {getFieldError('description')}
                </p>
              )}
            </div>
          </div>

          {/* Parent Category Selector (hidden unless needed) */}
          {!parentId && (
            <div className="hidden">
              <label
                className={`block text-sm font-medium ${theme.secondary.text} mb-1`}
              >
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
                className={`w-full px-3 py-2 ${
                  getFieldError('parentId')
                    ? getThemeClasses.inputError()
                    : getThemeClasses.input()
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
                <p
                  className={`text-xs ${theme.status.error.icon} mt-1 flex items-center gap-1`}
                >
                  <AlertCircle className="w-3 h-3" />
                  {getFieldError('parentId')}
                </p>
              )}
            </div>
          )}

          {/* Sort Order (hidden) */}
          <div className="hidden">
            <label
              className={`block text-sm font-medium ${theme.secondary.text} mb-1`}
            >
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
              className={`w-full px-3 py-2 ${
                getFieldError('sortOrder')
                  ? getThemeClasses.inputError()
                  : getThemeClasses.input()
              }`}
              min="0"
              disabled={isLoading}
            />
            {getFieldError('sortOrder') && (
              <p
                className={`text-xs ${theme.status.error.icon} mt-1 flex items-center gap-1`}
              >
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
              className={`w-4 h-4 ${theme.accent.textDark} rounded focus:ring-2 focus:ring-indigo-200`}
              disabled={isLoading}
            />
            <label
              htmlFor="isActive"
              className={`text-sm font-medium ${theme.secondary.text}`}
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
              className={`flex-1 px-4 py-2 ${getThemeClasses.buttonSecondary()} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className={`flex-1 px-4 py-2 ${getThemeClasses.buttonPrimary()} disabled:opacity-50 disabled:cursor-not-allowed`}
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
