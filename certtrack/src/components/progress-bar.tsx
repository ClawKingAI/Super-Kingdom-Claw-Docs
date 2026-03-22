'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

export function ProgressBar({ 
  value, 
  max = 100, 
  size = 'md',
  color = 'bg-[#10b981]',
  className 
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3' }

  return (
    <div className={className}>
      <div className={cn('bg-slate-100 rounded-full overflow-hidden', heights[size])}>
        <div 
          className={cn('h-full rounded-full transition-all duration-300', color)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}