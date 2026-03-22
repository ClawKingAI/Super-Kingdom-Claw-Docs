import { AppShell } from '@/components/app-shell'
import { StatusBadge } from '@/components/status-badge'
import { CERTIFICATES } from '@/lib/constants'

const certificateDescriptions: Record<number, string> = {
  1: 'Fabrication from material preparation through finishing and crating',
  2: 'Packing methods, load planning, inventory documentation',
  3: 'Advanced load planning, cargo securement, vehicle inspection',
  4: 'Mowing, trimming, seasonal maintenance, irrigation basics',
  5: 'Preventive maintenance, brake inspection, diagnostics fundamentals',
  6: 'Diagnosis, repair, maintenance of lawn and landscape equipment',
  7: 'Donation intake, sorting, pricing, merchandising, inventory control',
  8: 'POS systems, cash handling, transaction processing, reconciliation',
  9: 'Plumbing, HVAC awareness, drywall, painting, tile work, remodeling',
  10: 'Food safety, preparation workflow, sanitation, equipment use',
  11: 'Inbound inquiries, scheduling, dispatch coordination',
  12: 'Donation intake, eligibility assessment, routing coordination',
  13: 'Video production, editing, YouTube, Meta, Pando distribution',
  14: 'Tree lot setup, customer service, baling equipment operation',
}

// Mock student counts per certificate
const mockCounts: Record<number, { students: number; hours: number }> = {
  1: { students: 8, hours: 1247 },
  2: { students: 3, hours: 412 },
  3: { students: 2, hours: 289 },
  4: { students: 6, hours: 1432 },
  5: { students: 4, hours: 892 },
  6: { students: 2, hours: 156 },
  7: { students: 5, hours: 623 },
  8: { students: 3, hours: 478 },
  9: { students: 4, hours: 1012 },
  10: { students: 5, hours: 856 },
  11: { students: 2, hours: 234 },
  12: { students: 2, hours: 189 },
  13: { students: 2, hours: 267 },
  14: { students: 6, hours: 1123 },
}

const colorClasses: Record<string, string> = {
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  green: 'bg-green-500',
  slate: 'bg-slate-500',
  red: 'bg-red-500',
  pink: 'bg-pink-500',
  violet: 'bg-violet-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
  cyan: 'bg-cyan-500',
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  emerald: 'bg-emerald-500',
}

export default function CertificatesPage() {
  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Certificate Programs</h1>
          <p className="text-slate-500 text-sm mt-1">14 vocational training programs</p>
        </div>
      </div>

      {/* Certificate Cards Grid */}
      <div className="grid grid-cols-3 gap-5">
        {CERTIFICATES.map((cert) => {
          const counts = mockCounts[cert.id] || { students: 0, hours: 0 }
          const percentComplete = Math.round((counts.hours / cert.requiredHours) * 100)
          
          return (
            <div 
              key={cert.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition cursor-pointer"
            >
              <div className={`h-1.5 ${colorClasses[cert.color]}`}></div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 bg-${cert.color}-100 rounded-lg flex items-center justify-center`}>
                    <svg className={`w-5 h-5 text-${cert.color}-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <StatusBadge status="active" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{cert.name}</h3>
                <p className="text-sm text-slate-500 mb-3">{certificateDescriptions[cert.id]}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600"><strong className="text-slate-800">{cert.requiredHours}</strong> hrs</span>
                  <span className="text-slate-600"><strong className="text-slate-800">{counts.students}</strong> students</span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Hours Logged</span>
                    <span className="font-medium text-slate-700">{percentComplete}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${colorClasses[cert.color]}`}
                      style={{ width: `${Math.min(100, percentComplete)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}