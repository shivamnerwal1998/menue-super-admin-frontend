import { useState, useEffect } from 'react'
import { api } from '../../utils/api'
import Modal from '../Modal'
import StatusModal from '../shared/StatusModal'
import { superAdmin } from '../../utils/constants'

type Restaurant = {
  id: number
  name: string
  contact: string
  email?: string
  address?: string
  latitude?: number
  longitude?: number
  gmapLink?: string
  logo?: string
  image?: string
  instagram?: string
  facebook?: string
  website?: string
}

type EditRestaurantModalProps = {
  isOpen: boolean
  onClose: () => void
  restaurant: Restaurant | null
  onSuccess: () => void
}

export default function EditRestaurantModal({
  isOpen,
  onClose,
  restaurant,
  onSuccess,
}: EditRestaurantModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    latitude: '',
    longitude: '',
    gmapLink: '',
    logo: '',
    image: '',
    instagram: '',
    facebook: '',
    website: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean
    type: 'success' | 'error'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  })

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        contact: restaurant.contact || '',
        address: restaurant.address || '',
        latitude: restaurant.latitude?.toString() || '',
        longitude: restaurant.longitude?.toString() || '',
        gmapLink: restaurant.gmapLink || '',
        logo: restaurant.logo || '',
        image: restaurant.image || '',
        instagram: restaurant.instagram || '',
        facebook: restaurant.facebook || '',
        website: restaurant.website || '',
      })
    }
  }, [restaurant])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }

    if (formData.latitude && isNaN(Number(formData.latitude))) {
      newErrors.latitude = 'Invalid latitude'
    }

    if (formData.longitude && isNaN(Number(formData.longitude))) {
      newErrors.longitude = 'Invalid longitude'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm() || !restaurant) return

    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        contact: formData.contact,
        ...(formData.address && { address: formData.address }),
        ...(formData.latitude && { latitude: Number(formData.latitude) }),
        ...(formData.longitude && { longitude: Number(formData.longitude) }),
        ...(formData.gmapLink && { gmapLink: formData.gmapLink }),
        ...(formData.logo && { logo: formData.logo }),
        ...(formData.image && { image: formData.image }),
        ...(formData.instagram && { instagram: formData.instagram }),
        ...(formData.facebook && { facebook: formData.facebook }),
        ...(formData.website && { website: formData.website }),
      }

      await api.patch(
        `${superAdmin.updateRestaurant}/${restaurant.id}`,
        payload,
      )

      setStatusModal({
        isOpen: true,
        type: 'success',
        title: 'Success!',
        message: 'Restaurant updated successfully',
      })

      setTimeout(() => {
        setStatusModal((prev) => ({ ...prev, isOpen: false }))
        onSuccess()
        onClose()
      }, 1500)
    } catch (err) {
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update restaurant',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !restaurant) return null

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Restaurant">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Contact (Disabled) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number{' '}
              <span className="text-gray-400">(Cannot edit)</span>
            </label>
            <input
              type="text"
              value={formData.contact}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
            />
          </div>

          {/* Latitude & Longitude */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="text"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
                  errors.latitude ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.latitude && (
                <p className="text-sm text-red-600 mt-1">{errors.latitude}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="text"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
                  errors.longitude ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.longitude && (
                <p className="text-sm text-red-600 mt-1">{errors.longitude}</p>
              )}
            </div>
          </div>

          {/* Google Maps Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Maps Link
            </label>
            <input
              type="url"
              value={formData.gmapLink}
              onChange={(e) =>
                setFormData({ ...formData, gmapLink: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo URL
            </label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) =>
                setFormData({ ...formData, logo: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Banner Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banner Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) =>
                setFormData({ ...formData, instagram: e.target.value })
              }
              placeholder="@username or URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <input
              type="text"
              value={formData.facebook}
              onChange={(e) =>
                setFormData({ ...formData, facebook: e.target.value })
              }
              placeholder="Page name or URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Updating...
              </>
            ) : (
              'Update Restaurant'
            )}
          </button>
        </div>
      </Modal>

      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal((prev) => ({ ...prev, isOpen: false }))}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </>
  )
}
