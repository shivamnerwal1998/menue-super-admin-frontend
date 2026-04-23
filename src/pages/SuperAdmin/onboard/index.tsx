import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../../utils/api'
import { superAdmin } from '../../../utils/constants'

type UserFormData = {
  name: string
  email: string
  mobile: string
  password: string
  dateOfBirth?: string
}
type EntityFormData = {
  name: string
  contact: string
  email: string
  address: string
  latitude: string
  longitude: string
  gmapLink: string
  logo: string
  image: string
  instagram: string
  facebook: string
  website: string
}

type FormErrors = {
  [key: string]: string
}

export default function OnboardPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Form data
  const [userData, setUserData] = useState<UserFormData>({
    name: '',
    email: '',
    mobile: '',
    password: '',
  })

  const [entityData, setEntityData] = useState<EntityFormData>({
    name: '',
    contact: '',
    email: '',
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

  const [errors, setErrors] = useState<FormErrors>({})

  const totalSteps = 4

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const validateMobile = (mobile: string): boolean => {
    const regex = /^[6-9]\d{9}$/
    return regex.test(mobile)
  }

  const validateURL = (url: string): boolean => {
    if (!url) return true // Optional fields
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Step 1 validation
  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {}

    if (!userData.name || userData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }

    if (!userData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(userData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!userData.mobile) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!validateMobile(userData.mobile)) {
      newErrors.mobile =
        'Invalid Indian mobile number (10 digits, starts with 6-9)'
    }

    if (!userData.password) {
      newErrors.password = 'Password is required'
    } else if (userData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Step 2 validation
  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {}

    if (!entityData.name || entityData.name.length < 3) {
      newErrors.entityName = 'Restaurant name must be at least 3 characters'
    }

    if (!entityData.contact) {
      newErrors.contact = 'Contact number is required'
    } else if (!validateMobile(entityData.contact)) {
      newErrors.contact =
        'Invalid Indian mobile number (10 digits, starts with 6-9)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Step 3 validation
  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {}

    if (entityData.email && !validateEmail(entityData.email)) {
      newErrors.entityEmail = 'Invalid email format'
    }

    if (entityData.address && entityData.address.length > 1000) {
      newErrors.address = 'Address must be less than 1000 characters'
    }

    if (entityData.latitude && isNaN(Number(entityData.latitude))) {
      newErrors.latitude = 'Latitude must be a number'
    }

    if (entityData.longitude && isNaN(Number(entityData.longitude))) {
      newErrors.longitude = 'Longitude must be a number'
    }

    if (entityData.gmapLink && !validateURL(entityData.gmapLink)) {
      newErrors.gmapLink = 'Invalid URL format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Step 4 validation
  const validateStep4 = (): boolean => {
    const newErrors: FormErrors = {}

    if (entityData.logo && !validateURL(entityData.logo)) {
      newErrors.logo = 'Invalid URL format'
    }

    if (entityData.image && !validateURL(entityData.image)) {
      newErrors.image = 'Invalid URL format'
    }

    if (entityData.instagram && !validateURL(entityData.instagram)) {
      newErrors.instagram = 'Invalid URL format'
    }

    if (entityData.facebook && !validateURL(entityData.facebook)) {
      newErrors.facebook = 'Invalid URL format'
    }

    if (entityData.website && !validateURL(entityData.website)) {
      newErrors.website = 'Invalid URL format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    let isValid = false

    if (currentStep === 1) isValid = validateStep1()
    if (currentStep === 2) isValid = validateStep2()
    if (currentStep === 3) isValid = validateStep3()
    if (currentStep === 4) isValid = validateStep4()

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      setErrors({})
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const handleSubmit = async () => {
    if (!validateStep4()) return

    setLoading(true)
    setSubmitError(null)

    try {
      const payload = {
        user: {
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
          password: userData.password,
          ...(userData.dateOfBirth && { dateOfBirth: userData.dateOfBirth }),
        },
        entity: {
          name: entityData.name,
          contact: entityData.contact,
          ...(entityData.email && { email: entityData.email }),
          ...(entityData.address && { address: entityData.address }),
          ...(entityData.latitude && { latitude: Number(entityData.latitude) }),
          ...(entityData.longitude && {
            longitude: Number(entityData.longitude),
          }),
          ...(entityData.gmapLink && { gmapLink: entityData.gmapLink }),
          ...(entityData.logo && { logo: entityData.logo }),
          ...(entityData.image && { image: entityData.image }),
          ...(entityData.instagram && { instagram: entityData.instagram }),
          ...(entityData.facebook && { facebook: entityData.facebook }),
          ...(entityData.website && { website: entityData.website }),
        },
      }

      const response = await api.post(
        superAdmin.onboardUserAndRestaurant,
        payload,
      )

      // Success - redirect to restaurants page
      alert(
        `Success! Restaurant and admin created.\nUser ID: ${response.userId}\nEntity ID: ${response.entityId}`,
      )
      navigate('/super-admin/restaurants')
    } catch (err) {
      console.error('Onboard error:', err)
      setSubmitError('Failed to create restaurant and admin. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/super-admin/dashboard')}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Onboard Restaurant & Admin
        </h1>
        <p className="text-gray-600 mt-1">
          Create a new restaurant account with admin access
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 sm:p-8">
          {/* Step 1: Admin User Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Admin User Details
                </h2>
                <p className="text-sm text-gray-600">
                  Create the admin account who will manage this restaurant
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) =>
                      setUserData({ ...userData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    This will be used for login
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={userData.mobile}
                    onChange={(e) =>
                      setUserData({ ...userData, mobile: e.target.value })
                    }
                    placeholder="9876543210"
                    maxLength={10}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.mobile ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.mobile && (
                    <p className="text-sm text-red-600 mt-1">{errors.mobile}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    10 digits, starts with 6-9
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={userData.password}
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                    placeholder="Minimum 6 characters"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={userData.dateOfBirth || ''}
                    onChange={(e) =>
                      setUserData({ ...userData, dateOfBirth: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Restaurant Basic Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Restaurant Basic Details
                </h2>
                <p className="text-sm text-gray-600">
                  Essential information about the restaurant
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={entityData.name}
                    onChange={(e) =>
                      setEntityData({ ...entityData, name: e.target.value })
                    }
                    placeholder="Pizza Palace"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.entityName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.entityName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.entityName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Contact Number{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={entityData.contact}
                    onChange={(e) =>
                      setEntityData({ ...entityData, contact: e.target.value })
                    }
                    placeholder="9876543210"
                    maxLength={10}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.contact ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.contact && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.contact}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Customer-facing contact number
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Restaurant Optional Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Additional Details
                </h2>
                <p className="text-sm text-gray-600">
                  Optional information (can be added later)
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant Email
                  </label>
                  <input
                    type="email"
                    value={entityData.email}
                    onChange={(e) =>
                      setEntityData({ ...entityData, email: e.target.value })
                    }
                    placeholder="contact@restaurant.com"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.entityEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.entityEmail && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.entityEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={entityData.address}
                    onChange={(e) =>
                      setEntityData({ ...entityData, address: e.target.value })
                    }
                    placeholder="123 Main Street, City, State - 123456"
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={entityData.latitude}
                      onChange={(e) =>
                        setEntityData({
                          ...entityData,
                          latitude: e.target.value,
                        })
                      }
                      placeholder="28.6139"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                        errors.latitude ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.latitude && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.latitude}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={entityData.longitude}
                      onChange={(e) =>
                        setEntityData({
                          ...entityData,
                          longitude: e.target.value,
                        })
                      }
                      placeholder="77.2090"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                        errors.longitude ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.longitude && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.longitude}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Maps Link
                  </label>
                  <input
                    type="url"
                    value={entityData.gmapLink}
                    onChange={(e) =>
                      setEntityData({ ...entityData, gmapLink: e.target.value })
                    }
                    placeholder="https://maps.google.com/?q=..."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.gmapLink ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.gmapLink && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.gmapLink}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Branding & Online Presence */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Branding & Online Presence
                </h2>
                <p className="text-sm text-gray-600">
                  Add logos, images, and social media links (all optional)
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={entityData.logo}
                    onChange={(e) =>
                      setEntityData({ ...entityData, logo: e.target.value })
                    }
                    placeholder="https://example.com/logo.png"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.logo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.logo && (
                    <p className="text-sm text-red-600 mt-1">{errors.logo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Image URL
                  </label>
                  <input
                    type="url"
                    value={entityData.image}
                    onChange={(e) =>
                      setEntityData({ ...entityData, image: e.target.value })
                    }
                    placeholder="https://example.com/banner.jpg"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.image ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.image && (
                    <p className="text-sm text-red-600 mt-1">{errors.image}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={entityData.instagram}
                    onChange={(e) =>
                      setEntityData({
                        ...entityData,
                        instagram: e.target.value,
                      })
                    }
                    placeholder="https://instagram.com/restaurant"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.instagram ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.instagram && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.instagram}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={entityData.facebook}
                    onChange={(e) =>
                      setEntityData({ ...entityData, facebook: e.target.value })
                    }
                    placeholder="https://facebook.com/restaurant"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.facebook ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.facebook && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.facebook}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={entityData.website}
                    onChange={(e) =>
                      setEntityData({ ...entityData, website: e.target.value })
                    }
                    placeholder="https://restaurant.com"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.website ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.website && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.website}
                    </p>
                  )}
                </div>
              </div>

              {/* Summary Review */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">
                  Review Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admin:</span>
                    <span className="font-medium text-gray-900">
                      {userData.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900">
                      {userData.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Restaurant:</span>
                    <span className="font-medium text-gray-900">
                      {entityData.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium text-gray-900">
                      {entityData.contact}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {submitError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-800">
                    Submission Failed
                  </h4>
                  <p className="text-sm text-red-700 mt-1">{submitError}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Back
          </button>

          <div className="flex items-center gap-3">
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
