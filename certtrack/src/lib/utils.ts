import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatHours(hours: number | string | null | undefined): string {
  if (hours === null || hours === undefined) return '0'
  const num = typeof hours === 'string' ? parseFloat(hours) : hours
  if (isNaN(num)) return '0'
  return num % 1 === 0 ? num.toString() : num.toFixed(1)
}

export function formatPercent(percent: number | string | null | undefined): string {
  if (percent === null || percent === undefined) return '0%'
  const num = typeof percent === 'string' ? parseFloat(percent) : percent
  if (isNaN(num)) return '0%'
  return `${Math.round(num)}%`
}

export function generateStudentId(count: number): string {
  const year = new Date().getFullYear()
  return `STU-${year}-${String(count).padStart(3, '0')}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}