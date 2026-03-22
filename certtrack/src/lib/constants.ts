export const CERTIFICATES = [
  { id: 1, name: 'Wood Shop & Commercial Table Production', requiredHours: 900, color: 'amber' },
  { id: 2, name: 'Van/Truck Loading & Logistics Operations', requiredHours: 400, color: 'blue' },
  { id: 3, name: 'Truck Loading & Commercial Transportation Operations', requiredHours: 990, color: 'indigo' },
  { id: 4, name: 'Lawn Care & Landscape Operations', requiredHours: 800, color: 'green' },
  { id: 5, name: 'Automotive Technician', requiredHours: 900, color: 'slate' },
  { id: 6, name: 'Small Engine Repair & Maintenance', requiredHours: 400, color: 'red' },
  { id: 7, name: 'Retail Operations & Inventory Systems', requiredHours: 500, color: 'pink' },
  { id: 8, name: 'Cashiering & Point-of-Sale Operations', requiredHours: 500, color: 'violet' },
  { id: 9, name: 'Facilities Maintenance & Property Services', requiredHours: 900, color: 'orange' },
  { id: 10, name: 'Food Service & Kitchen Operations', requiredHours: 700, color: 'yellow' },
  { id: 11, name: 'Moving Operations Dispatch & Customer Service', requiredHours: 800, color: 'cyan' },
  { id: 12, name: 'Donation Pickup Scheduling & Logistics Coordination', requiredHours: 700, color: 'teal' },
  { id: 13, name: 'Media Production & Digital Content Operations', requiredHours: 800, color: 'rose' },
  { id: 14, name: 'Christmas Tree & Seasonal Retail Operations', requiredHours: 350, color: 'emerald' },
] as const

export type Certificate = typeof CERTIFICATES[number]

export const STUDENT_STATUSES = ['active', 'intake', 'completed', 'transferred', 'terminated', 'hold'] as const
export const ENROLLMENT_STATUSES = ['active', 'completed', 'paused', 'dropped', 'transferred'] as const
export const ENTRY_TYPES = ['regular', 'makeup'] as const
export const DELETION_STATUSES = ['pending', 'approved', 'rejected'] as const
export const USER_ROLES = ['admin', 'staff'] as const