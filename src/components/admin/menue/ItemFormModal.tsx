import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { Item, Category, ValidationError } from '../../../types/menue'

interface ItemFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Item>) => Promise<void>
  item?: Item
  categoryId: number
  categories: Category[]
  isLoading?: boolean
  validationErrors?: ValidationError[]
}

export default function ItemFormModal({
  isOpen,
  onClose,
  onSave,
  item,
  categoryId,
  categories,
  isLoading = false,
  validationErrors = [],
}: ItemFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: categoryId,
    isVeg: true,
    isAvailable: true,
    imageUrl: '',
    sortOrder: 0,
  })

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || '',
        price: (item.price / 100).toString(), // Convert from paise to rupees
        categoryId: item.categoryId,
        isVeg: item.isVeg,
        isAvailable: item.isAvailable,
        imageUrl: item.imageUrl || '',
        sortOrder: item.sortOrder || 0,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: categoryId,
        isVeg: true,
        isAvailable: true,
        imageUrl: '',
        sortOrder: 0,
      })
    }
  }, [item, categoryId, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.price) return

    // Convert rupees to paise for backend
    const dataToSend = {
      ...formData,
      price: Math.round(parseFloat(formData.price) * 100),
      imageUrl: formData.imageUrl || null,
    }

    await onSave(dataToSend)
  }

  const getFieldError = (fieldName: string): string | undefined => {
    const error = validationErrors.find((err) => err.field === fieldName)
    return error?.message
  }

  const isSample = formData.name.startsWith('Sample ')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Item' : 'Add Item'}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Sample warning */}
          {isSample && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-orange-700">
                This is a sample item. Remove the "Sample " prefix to make it
                your own.
              </span>
            </div>
          )}

          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name *
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
              placeholder="e.g., Paneer Tikka"
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
              placeholder="Brief description of the dish"
              rows={3}
              maxLength={1000}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                {formData.description.length}/1000 characters
              </p>
              {getFieldError('description') && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {getFieldError('description')}
                </p>
              )}
            </div>
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none ${
                  getFieldError('price') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="180"
                min="0"
                step="1"
                disabled={isLoading}
              />
              {getFieldError('price') && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {getFieldError('price')}
                </p>
              )}
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
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none ${
                  getFieldError('categoryId')
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {getFieldError('categoryId') && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {getFieldError('categoryId')}
                </p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div className='hidden'>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL (Optional)
            </label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none ${
                getFieldError('imageUrl')
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
            />
            {getFieldError('imageUrl') ? (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {getFieldError('imageUrl')}
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Paste an image URL from the web
              </p>
            )}
          </div>

          {/* Food Type */}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                <span className="flex items-center gap-1 text-sm text-gray-700">
                  <span className="text-red-600 text-lg">🔴</span>
                  Non-Vegetarian
                </span>
              </label>
            </div>
          </div>

          {/* Sort Order */}
          <div>
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
              min="0"
              disabled={isLoading}
            />
          </div>

          {/* Is Available */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) =>
                setFormData({ ...formData, isAvailable: e.target.checked })
              }
              className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-200"
              disabled={isLoading}
            />
            <label
              htmlFor="isAvailable"
              className="text-sm font-medium text-gray-700"
            >
              Available now
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
              disabled={isLoading || !formData.name.trim() || !formData.price}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : item ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}