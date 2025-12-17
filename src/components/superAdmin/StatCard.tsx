import React from 'react'

type StatCardProps = {
  label: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'red' | 'purple'
}

export default function StatCard({ label, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  )
}
