'use client'

import { cn } from '@/lib/utils'

interface SummaryCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: string; positive?: boolean }
  className?: string
}

export function SummaryCard({ title, value, subtitle, icon, trend, className }: SummaryCardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        {trend && (
          <span className={cn(
            'text-xs px-2 py-1 rounded-full',
            trend.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          )}>
            {trend.value}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className="text-slate-500 text-sm mt-1">{title}</p>
      {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
    </div>
  )
}