// src/components/admin/menu/CategoryFormModal.tsx
import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import { Category } from '../../../types/menue'

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Category>) => void
  category?: Category
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  category,
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        isActive: category.isActive,
      })
    } else {
      setFormData({ name: '', description: '', isActive: true })
    }
  }, [category, isOpen])

  const handleSubmit = () => {
    if (!formData.name.trim()) return
    onSave(formData)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add Category'}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
            placeholder="e.g., Starters"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
            placeholder="Brief description of this category"
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/500 characters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-200"
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium text-gray-700"
          >
            Active (visible on menu)
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            {category ? 'Update' : 'Create'} Category
          </button>
        </div>
      </div>
    </Modal>
  )
}
