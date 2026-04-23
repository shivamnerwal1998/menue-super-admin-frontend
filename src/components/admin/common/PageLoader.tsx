// src/components/admin/common/PageLoader.tsx
// Full-page loading overlay used on initial Dashboard load
// Shows a "server waking up" message after a delay if APIs are slow

import { useEffect, useState } from 'react'

interface PageLoaderProps {
  /** How many ms before showing the "server waking up" message (default 3000) */
  wakeUpDelay?: number
}

export default function PageLoader({ wakeUpDelay = 3000 }: PageLoaderProps) {
  const [showWakeUp, setShowWakeUp] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowWakeUp(true), wakeUpDelay)
    return () => clearTimeout(timer)
  }, [wakeUpDelay])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 py-20">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        {/* Outer slow ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-400 animate-spin"
          style={{ animationDuration: '1.2s' }}
        />
        {/* Inner fast ring */}
        <div
          className="absolute inset-2 rounded-full border-4 border-purple-100 border-b-purple-500 animate-spin"
          style={{ animationDuration: '0.7s', animationDirection: 'reverse' }}
        />
      </div>

      {/* Text */}
      <div className="text-center max-w-xs">
        {!showWakeUp ? (
          <>
            <p className="text-base font-semibold text-slate-700">
              Loading your dashboard
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Fetching the latest data…
            </p>
          </>
        ) : (
          <>
            <p className="text-base font-semibold text-slate-700">
              Waking up the server…
            </p>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              The server was sleeping due to inactivity.
              <br />
              This usually takes 20–30 seconds. Hang tight! ☕
            </p>
            {/* Subtle pulsing dots to show activity */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
