// src/components/common/Toast.tsx
import { useEffect } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
        type === 'success'
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
      )}
      <span
        className={`text-sm font-medium ${
          type === 'success' ? 'text-green-800' : 'text-red-800'
        }`}
      >
        {message}
      </span>
      <button onClick={onClose} className="ml-2">
        <X
          className={`w-4 h-4 ${
            type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        />
      </button>
    </div>
  )
}