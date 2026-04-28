// src/pages/Admin/dashboard/index.tsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  itemService,
  StatsData,
  RestaurantData,
} from '../../../utils/menuService'
import { ToastType } from '../../../types/menue'
import Toast from '../../../components/admin/common/Toast'
import PageLoader from '../../../components/admin/common/PageLoader'
import Spinner from '../../../components/admin/common/Spinner'
import QRCode from 'qrcode'
import theme, { getThemeClasses } from '../../../configs/theme.ts'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)

  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  const [toast, setToast] = useState<ToastType | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)

  // null = not yet loaded (no pre-filled values shown)
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null)
  const [statsData, setStatsData] = useState<StatsData | null>(null)

  // Separate loading flags
  const [restaurantLoading, setRestaurantLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  // True only on the very first load (both APIs pending)
  const isInitialLoading = restaurantLoading && statsLoading

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }

  const loadStats = async () => {
    setStatsLoading(true)
    try {
      const data: StatsData = await itemService.getStats()
      setStatsData(data)
    } catch {
      showToast('Error fetching stats', 'error')
    } finally {
      setStatsLoading(false)
    }
  }

  const loadRestaurant = async () => {
    setRestaurantLoading(true)
    try {
      const data = await itemService.getEntity()
      setRestaurant(data)
    } catch {
      showToast('Error fetching restaurant details', 'error')
    } finally {
      setRestaurantLoading(false)
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

  useEffect(() => {
    if (showQRModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
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

  // ── If BOTH APIs are still loading → show full-page loader with wake-up msg
  if (isInitialLoading) {
    return (
      <>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <PageLoader wakeUpDelay={3000} />
      </>
    )
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

      {/* ── Welcome Banner ── */}
      <div className={getThemeClasses.heroBanner()}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {restaurantLoading ? (
              // Banner skeleton while restaurant loads
              <div className="space-y-2">
                <div className="h-7 w-48 bg-white/20 rounded-lg animate-pulse" />
                <div className="h-4 w-64 bg-white/15 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-1">
                  {restaurant ? restaurant.name : user?.name || 'Admin'} 👋
                </h1>
                {restaurant ? (
                  <div
                    className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 ${theme.hero.textMuted} text-sm`}
                  >
                    {restaurant.contact && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {restaurant.contact}
                      </span>
                    )}
                    {restaurant.email && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {restaurant.email}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className={`${theme.hero.textMuted} text-sm`}>
                    Manage your restaurant menu and keep it up to date
                  </p>
                )}
              </>
            )}
          </div>

          {/* QR Button */}
          <button
            onClick={() => setShowQRModal(true)}
            disabled={restaurantLoading || !restaurant}
            title="View QR Code"
            className={`flex-shrink-0 flex flex-col items-center gap-1 ${theme.hero.buttonBg} ${theme.hero.buttonBgHover} ${theme.hero.text} rounded-xl px-4 py-3 transition border ${theme.hero.buttonBorder} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={2} />
              <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={2} />
              <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={2} />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 14h2m4 0v2m0 4h-4m-2 0v-4"
              />
            </svg>
            <span className="text-xs font-medium whitespace-nowrap">
              See QR
            </span>
          </button>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Categories */}
        <div className={getThemeClasses.statCard()}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 ${theme.iconBg.purple} rounded-lg`}>
              <svg
                className={`w-6 h-6 ${theme.iconBg.purpleText}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
          </div>
          <p className={`text-sm ${theme.secondary.textMuted} font-medium`}>
            Categories
          </p>
          {statsLoading ? (
            <div className="mt-2">
              <Spinner size="sm" />
            </div>
          ) : (
            <p className={`text-3xl font-bold ${theme.secondary.text} mt-1`}>
              {statsData?.categories.total ?? '—'}
            </p>
          )}
        </div>

        {/* Total Items */}
        <div className={getThemeClasses.statCard()}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 ${theme.iconBg.blue} rounded-lg`}>
              <svg
                className={`w-6 h-6 ${theme.iconBg.blueText}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
          <p className={`text-sm ${theme.secondary.textMuted} font-medium`}>
            Total Items
          </p>
          {statsLoading ? (
            <div className="mt-2">
              <Spinner size="sm" />
            </div>
          ) : (
            <p className={`text-3xl font-bold ${theme.secondary.text} mt-1`}>
              {statsData?.items.total ?? '—'}
            </p>
          )}
        </div>
      </div>

      {/* ── Menu Management CTA ── */}
      <div
        className={`${theme.status.success.bgLight} border ${theme.status.success.border} rounded-xl p-6`}
      >
        <div className="flex items-start gap-3">
          <svg
            className={`w-6 h-6 ${theme.status.success.icon} flex-shrink-0 mt-0.5`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3
              className={`font-semibold ${theme.status.success.textHeading} mb-1`}
            >
              Menu Management is Ready! 🎉
            </h3>
            <p className={`text-sm ${theme.status.success.textDark} mb-3`}>
              Your menu management system is fully set up. Click below to start
              customizing your restaurant's menu.
            </p>
            <button
              onClick={() => navigate('/admin/menu')}
              className={`px-4 py-2 ${theme.status.success.button} ${theme.status.success.buttonHover} text-white text-sm rounded-lg transition font-medium`}
            >
              Go to Menu Management
            </button>
          </div>
        </div>
      </div>

      {/* ── QR Modal ── */}
      {showQRModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowQRModal(false)
          }}
        >
          <div
            className={`${theme.secondary.bg} rounded-2xl ${theme.shadow['2xl']} w-full max-w-sm p-8 flex flex-col items-center gap-6 relative`}
          >
            <button
              onClick={() => setShowQRModal(false)}
              className={`absolute top-4 right-4 ${theme.secondary.textSubtle} hover:${theme.secondary.textMuted} transition`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center">
              <h2 className={`text-xl font-bold ${theme.secondary.text}`}>
                {restaurant?.name}
              </h2>
              <p className={`text-sm ${theme.secondary.textMuted} mt-1`}>
                Scan to view menu
              </p>
            </div>

            <div
              className={`rounded-xl overflow-hidden border-4 ${theme.secondary.bgMuted} shadow-inner`}
            >
              <canvas ref={qrCanvasRef} />
            </div>

            {/* {restaurant?.qrAddress && (
              <p className={`text-xs ${theme.accent.text} break-all text-center max-w-[240px]`}>
                {restaurant.qrAddress}
              </p>
            )} */}

            <button
              onClick={handleDownloadPDF}
              className={`flex items-center gap-2 px-5 py-2.5 ${theme.accent.bg} hover:${theme.accent.bgHover} text-white text-sm font-medium rounded-lg transition w-full justify-center`}
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
