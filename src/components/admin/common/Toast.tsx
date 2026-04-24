import { useEffect } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'
import theme, { getThemeClasses } from '../../../configs/theme.ts'

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

  const isSuccess = type === 'success'

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
        isSuccess
          ? getThemeClasses.toastSuccess()
          : getThemeClasses.toastError()
      }`}
    >
      {isSuccess ? (
        <CheckCircle
          className={`w-5 h-5 ${theme.status.success.icon} flex-shrink-0`}
        />
      ) : (
        <AlertCircle
          className={`w-5 h-5 ${theme.status.error.icon} flex-shrink-0`}
        />
      )}
      <span
        className={`text-sm font-medium ${
          isSuccess
            ? theme.status.success.textDark
            : theme.status.error.textDark
        }`}
      >
        {message}
      </span>
      <button onClick={onClose} className="ml-2">
        <X
          className={`w-4 h-4 ${
            isSuccess ? theme.status.success.icon : theme.status.error.icon
          }`}
        />
      </button>
    </div>
  )
}
