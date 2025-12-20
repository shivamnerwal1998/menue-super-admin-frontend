// src/components/admin/menu/ItemFormModal.tsx
import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { Item, Category } from '../../../types/menue'

interface ItemFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Item>) => void
  item?: Item
  categoryId: number
  categories: Category[]
}

export default function ItemFormModal({
  isOpen,
  onClose,
  onSave,
  item,
  categoryId,
  categories,
}: ItemFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: categoryId,
    isVeg: true,
    isAvailable: true,
    imageUrl: '',
  })

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price / 100, // Convert from paise to rupees
        categoryId: item.categoryId,
        isVeg: item.isVeg,
        isAvailable: item.isAvailable,
        imageUrl: item.imageUrl || '',
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        categoryId: categoryId,
        isVeg: true,
        isAvailable: true,
        imageUrl: '',
      })
    }
  }, [item, categoryId, isOpen])

  const handleSubmit = () => {
    if (!formData.name.trim() || formData.price <= 0) return

    onSave({
      ...formData,
      price: Math.round(formData.price * 100), // Convert to paise
    })
    onClose()
  }

  const isSample = formData.name.startsWith('Sample ')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Item' : 'Add Item'}
    >
      <div className="space-y-4">
        {isSample && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-orange-700">
              This is a sample item. Remove the "Sample " prefix to make it your
              own.
            </span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
            placeholder="e.g., Paneer Tikka"
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
            placeholder="Brief description of the dish"
            rows={3}
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/1000 characters
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
              placeholder="180"
              min="0"
              step="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categoryId: parseInt(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL (Optional)
          </label>
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Paste an image URL from the web
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food Type *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="isVeg"
                checked={formData.isVeg}
                onChange={() => setFormData({ ...formData, isVeg: true })}
                className="w-4 h-4 text-green-600"
              />
              <span className="flex items-center gap-1 text-sm text-gray-700">
                <span className="text-green-600 text-lg">🟢</span>
                Vegetarian
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="isVeg"
                checked={!formData.isVeg}
                onChange={() => setFormData({ ...formData, isVeg: false })}
                className="w-4 h-4 text-red-600"
              />
              <span className="flex items-center gap-1 text-sm text-gray-700">
                <span className="text-red-600 text-lg">🔴</span>
                Non-Vegetarian
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isAvailable"
            checked={formData.isAvailable}
            onChange={(e) =>
              setFormData({ ...formData, isAvailable: e.target.checked })
            }
            className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-200"
          />
          <label
            htmlFor="isAvailable"
            className="text-sm font-medium text-gray-700"
          >
            Available now
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
            {item ? 'Update' : 'Add'} Item
          </button>
        </div>
      </div>
    </Modal>
  )
}
