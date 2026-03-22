'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Clock,
  BarChart3,
  Trash2,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Certificates', href: '/certificates', icon: FileText },
  { name: 'Time Tracking', href: '/time-tracking', icon: Clock },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Deletion Requests', href: '/deletion-requests', icon: Trash2 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1e3a5f] text-white flex flex-col z-50">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#10b981] rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg">CertTrack</h1>
            <p className="text-xs text-white/60">A Better Way Ministries</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive 
                  ? 'bg-white/15 border-l-[3px] border-[#10b981]' 
                  : 'hover:bg-white/10'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-9 h-9 bg-[#10b981]/20 rounded-full flex items-center justify-center">
            <span className="text-[#10b981] font-medium text-sm">DM</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">David Morgan</p>
            <p className="text-xs text-white/60">Director of Education</p>
          </div>
        </div>
      </div>
    </aside>
  )
}