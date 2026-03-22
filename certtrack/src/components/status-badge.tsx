'use client'

import { cn } from '@/lib/utils'

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  paused: 'bg-amber-100 text-amber-700',
  terminated: 'bg-red-100 text-red-700',
  transferred: 'bg-purple-100 text-purple-700',
  dropped: 'bg-slate-100 text-slate-600',
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  intake: 'bg-cyan-100 text-cyan-700',
  hold: 'bg-slate-100 text-slate-500',
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
      statusStyles[status] || 'bg-slate-100 text-slate-600',
      className
    )}>
      {status}
    </span>
  )
}