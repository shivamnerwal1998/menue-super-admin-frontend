// src/pages/Admin/dashboard/index.tsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { itemService, StatsData, RestaurantData } from '../../../utils/menuService'
import { ToastType } from '../../../types/menue'
import Toast from '../../../components/admin/common/Toast'
import QRCode from 'qrcode'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)

  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  const [toast, setToast] = useState<ToastType | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null)
  const [statsData, setStatsData] = useState<StatsData>({
    categories: { total: 0, active: 0, inactive: 0 },
    items: { total: 0, available: 0, unavailable: 0, veg: 0, nonVeg: 0 },
  })

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }

  const loadStats = async () => {
    try {
      const data: StatsData = await itemService.getStats()
      setStatsData(data)
    } catch {
      showToast('Error fetching stats', 'error')
    }
  }

  const loadRestaurant = async () => {
    try {
      const data = await itemService.getEntity()
      setRestaurant(data)
    } catch {
      showToast('Error fetching restaurant details', 'error')
    }
  }

  useEffect(() => {
    loadStats()
    loadRestaurant()
  }, [])

  useEffect(() => {
    if (showQRModal && restaurant?.qrAddress && qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, restaurant.qrAddress, {
        width: 240,
        margin: 2,
        color: { dark: '#111827', light: '#ffffff' },
      })
    }
  }, [showQRModal, restaurant])

  // Lock body scroll when modal open so overlay truly covers everything
  useEffect(() => {
    if (showQRModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showQRModal])

  const handleDownloadPDF = async () => {
    if (!restaurant?.qrAddress) return

    const dataUrl = await QRCode.toDataURL(restaurant.qrAddress, {
      width: 600,
      margin: 2,
      color: { dark: '#111827', light: '#ffffff' },
    })

    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const qrSize = 80

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(17, 24, 39)
    doc.text(restaurant.name, pageW / 2, 30, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(107, 114, 128)
    doc.text('Scan to view our menu', pageW / 2, 40, { align: 'center' })

    const x = (pageW - qrSize) / 2
    doc.addImage(dataUrl, 'PNG', x, 50, qrSize, qrSize)

    doc.setFontSize(9)
    doc.setTextColor(59, 130, 246)
    doc.text(restaurant.qrAddress, pageW / 2, 140, { align: 'center' })

    doc.save(`${restaurant.name.replace(/\s+/g, '_')}_QR.pdf`)
  }

  const stats = {
    totalCategories: statsData.categories.total,
    totalItems: statsData?.items?.total,
  }

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── Welcome Header — softened gradient ── */}
      <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold mb-1">
              {restaurant ? restaurant.name : (user?.name || 'Admin')} 👋
            </h1>
            {restaurant ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-blue-50 text-sm">
                {restaurant.contact && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {restaurant.contact}
                  </span>
                )}
                {restaurant.email && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {restaurant.email}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-blue-50 text-sm">Manage your restaurant menu and keep it up to date</p>
            )}
          </div>

          {/* QR Code Button */}
          <button
            onClick={() => setShowQRModal(true)}
            title="View QR Code"
            className="flex-shrink-0 flex flex-col items-center gap-1 bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-3 transition border border-white/25"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={2} />
              <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={2} />
              <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={2} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 14h2m4 0v2m0 4h-4m-2 0v-4" />
            </svg>
            <span className="text-xs font-medium whitespace-nowrap">See QR</span>
          </button>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Categories</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCategories}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Total Items</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalItems}</p>
        </div>
      </div>

      {/* ── Menu Management CTA ── */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-green-900 mb-1">Menu Management is Ready! 🎉</h3>
            <p className="text-sm text-green-800 mb-3">
              Your menu management system is fully set up. Click below to start customizing your restaurant's menu.
            </p>
            <button
              onClick={() => navigate('/admin/menu')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition font-medium"
            >
              Go to Menu Management
            </button>
          </div>
        </div>
      </div>

      {/* ── QR Modal ── */}
      {showQRModal && (
        <div
          // Use fixed + inset-0 ensures it covers the full viewport including any sticky headers/sidebars
          // z-[9999] beats any sidebar or topbar z-index
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowQRModal(false) }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-6 relative">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">{restaurant?.name}</h2>
              <p className="text-sm text-gray-500 mt-1">Scan to view menu</p>
            </div>

            <div className="rounded-xl overflow-hidden border-4 border-gray-100 shadow-inner">
              <canvas ref={qrCanvasRef} />
            </div>

            {restaurant?.qrAddress && (
              <p className="text-xs text-blue-500 break-all text-center max-w-[240px]">
                {restaurant.qrAddress}
              </p>
            )}

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition w-full justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}