// src/components/admin/common/Spinner.tsx

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'

interface SpinnerProps {
  size?: SpinnerSize
  message?: string
  submessage?: string
}

const sizeMap: Record<SpinnerSize, string> = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}

export default function Spinner({ size = 'md', message, submessage }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinner ring — indigo accent matches theme */}
      <div className={`${sizeMap[size]} relative`}>
        <div
          className={`${sizeMap[size]} rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin`}
        />
      </div>

      {message && (
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">{message}</p>
          {submessage && (
            <p className="text-xs text-slate-400 mt-1">{submessage}</p>
          )}
        </div>
      )}
    </div>
  )
}