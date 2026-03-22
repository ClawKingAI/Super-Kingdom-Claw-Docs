import { AppShell } from '@/components/app-shell'
import { SummaryCard } from '@/components/summary-card'
import { ProgressBar } from '@/components/progress-bar'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/button'
import { Users, FileText, Clock, AlertTriangle, Trash2, Search } from 'lucide-react'

// Mock data for now - will be replaced with real db queries
const mockStats = {
  activeStudents: 47,
  activeEnrollments: 63,
  hoursThisWeek: 324,
  nearCompletion: 8,
  behindPace: 5,
  pendingDeletions: 3,
}

const mockHoursByCertificate = [
  { name: 'Wood Shop', hours: 456, total: 900 },
  { name: 'Truck Loading', hours: 312, total: 990 },
  { name: 'Lawn Care', hours: 198, total: 800 },
  { name: 'Automotive', hours: 145, total: 900 },
  { name: 'Facilities', hours: 173, total: 900 },
]

const mockNearCompletion = [
  { id: '1', name: 'Marcus Johnson', certificate: 'Wood Shop', percent: 92 },
  { id: '2', name: 'Sarah Williams', certificate: 'Lawn Care', percent: 88 },
  { id: '3', name: 'David Thompson', certificate: 'Automotive', percent: 85 },
  { id: '4', name: 'Rachel Garcia', certificate: 'Food Service', percent: 81 },
]

const mockRecentHours = [
  { student: 'Andrew Peterson', certificate: 'Wood Shop', date: 'Mar 19', hours: 4.5, approved: true },
  { student: 'Lisa Martinez', certificate: 'Lawn Care', date: 'Mar 19', hours: 3.0, approved: false },
  { student: 'James Cooper', certificate: 'Automotive', date: 'Mar 18', hours: 6.0, approved: true },
]

export default function DashboardPage() {
  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of vocational training activity</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search students, certificates..." 
              className="w-72 px-4 py-2 pl-10 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]/50"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <Button variant="secondary">
            <Trash2 className="w-4 h-4" />
            <span className="text-red-600">{mockStats.pendingDeletions}</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Active Students" value={mockStats.activeStudents} icon={<Users className="w-6 h-6 text-blue-600" />} trend={{ value: '+8%', positive: true }} />
        <SummaryCard title="Active Enrollments" value={mockStats.activeEnrollments} icon={<FileText className="w-6 h-6 text-emerald-600" />} />
        <SummaryCard title="Hours This Week" value={mockStats.hoursThisWeek} icon={<Clock className="w-6 h-6 text-amber-600" />} trend={{ value: '+12%', positive: true }} />
        <SummaryCard title="Near Completion" value={mockStats.nearCompletion} icon={<FileText className="w-6 h-6 text-purple-600" />} />
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-amber-800">{mockStats.behindPace} Students Behind Pace</h4>
            <p className="text-amber-600 text-sm">Logged hours significantly below expected progress</p>
          </div>
          <a href="/students?filter=behind" className="text-amber-700 text-sm font-medium hover:underline">View →</a>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-red-800">{mockStats.pendingDeletions} Pending Deletion Requests</h4>
            <p className="text-red-600 text-sm">Records awaiting admin approval</p>
          </div>
          <a href="/deletion-requests" className="text-red-700 text-sm font-medium hover:underline">Review →</a>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Hours by Certificate Program</h3>
          <div className="space-y-4">
            {mockHoursByCertificate.map((cert) => (
              <div key={cert.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{cert.name}</span>
                  <span className="font-medium">{cert.hours} / {cert.total} hrs</span>
                </div>
                <ProgressBar value={cert.hours} max={cert.total} size="md" color={cert.hours / cert.total > 0.5 ? 'bg-[#10b981]' : 'bg-amber-500'} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Near Completion</h3>
          <div className="space-y-3">
            {mockNearCompletion.map((student) => (
              <div key={student.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                <div className="w-8 h-8 bg-[#10b981]/20 rounded-full flex items-center justify-center text-[#10b981] font-medium text-sm">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.certificate} • {student.percent}%</p>
                </div>
              </div>
            ))}
          </div>
          <a href="/students?filter=near-completion" className="block text-center text-sm text-[#10b981] font-medium mt-4 hover:underline">View all →</a>
        </div>
      </div>

      {/* Recent Hours Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Recent Tracked Hours</h3>
          <a href="/time-tracking" className="text-sm text-[#10b981] font-medium hover:underline">View all →</a>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Student</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Certificate</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Date</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Hours</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {mockRecentHours.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">{row.student}</td>
                <td className="px-6 py-4 text-slate-600">{row.certificate}</td>
                <td className="px-6 py-4 text-slate-600">{row.date}</td>
                <td className="px-6 py-4 font-bold text-slate-800">{row.hours}</td>
                <td className="px-6 py-4"><StatusBadge status={row.approved ? 'approved' : 'pending'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}