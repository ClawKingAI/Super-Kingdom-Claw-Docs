import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/button'
import { StatusBadge } from '@/components/status-badge'
import { ProgressBar } from '@/components/progress-bar'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'

// Mock data - will be replaced with real db queries
const mockStudents = [
  { id: 'STU-2024-001', name: 'Marcus Johnson', status: 'active', certificate: 'Wood Shop', completed: 828, required: 900, percent: 92 },
  { id: 'STU-2024-002', name: 'Sarah Williams', status: 'active', certificate: 'Lawn Care', completed: 704, required: 800, percent: 88 },
  { id: 'STU-2024-003', name: 'David Thompson', status: 'active', certificate: 'Automotive', completed: 765, required: 900, percent: 85 },
  { id: 'STU-2024-004', name: 'Rachel Garcia', status: 'active', certificate: 'Food Service', completed: 567, required: 700, percent: 81 },
  { id: 'STU-2024-005', name: 'Andrew Peterson', status: 'active', certificate: 'Wood Shop', completed: 315, required: 900, percent: 35 },
  { id: 'STU-2024-006', name: 'Lisa Martinez', status: 'active', certificate: 'Lawn Care', completed: 536, required: 800, percent: 67 },
  { id: 'STU-2023-015', name: 'James Wilson', status: 'completed', certificate: 'Wood Shop', completed: 900, required: 900, percent: 100 },
  { id: 'STU-2023-018', name: 'Emily Brown', status: 'completed', certificate: 'Food Service', completed: 700, required: 700, percent: 100 },
]

export default function StudentsPage() {
  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Students</h1>
          <p className="text-slate-500 text-sm mt-1">Manage student records and enrollments</p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Search by name, email, or student ID..." 
              className="w-full px-4 py-2 pl-10 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]/50"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Intake</option>
            <option>Completed</option>
            <option>Transferred</option>
            <option>Terminated</option>
            <option>Hold</option>
          </select>
          <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
            <option>All Certificates</option>
            <option>Wood Shop</option>
            <option>Lawn Care</option>
            <option>Automotive</option>
            <option>Food Service</option>
          </select>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <button className="px-4 py-2 bg-[#1e3a5f] text-white text-sm rounded-lg font-medium">All (47)</button>
          <button className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg font-medium hover:bg-slate-200 transition">Active (38)</button>
          <button className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg font-medium hover:bg-slate-200 transition">Intake (3)</button>
          <button className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg font-medium hover:bg-slate-200 transition">Completed (4)</button>
          <button className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg font-medium hover:bg-slate-200 transition">Transferred (1)</button>
          <button className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg font-medium hover:bg-slate-200 transition">Hold (1)</button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Student ID</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Name</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Certificate</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Progress</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Hours</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {mockStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 cursor-pointer">
                <td className="px-6 py-4 text-slate-600 font-mono text-sm">{student.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#10b981]/20 rounded-full flex items-center justify-center text-[#10b981] font-medium text-sm">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-slate-800">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4"><StatusBadge status={student.status} /></td>
                <td className="px-6 py-4 text-slate-600">{student.certificate}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={student.completed} max={student.required} size="sm" className="w-24" color={student.percent >= 80 ? 'bg-[#10b981]' : student.percent >= 50 ? 'bg-amber-500' : 'bg-red-400'} />
                    <span className="text-sm font-medium text-slate-700">{student.percent}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{student.completed} / {student.required}</td>
                <td className="px-6 py-4">
                  <Link href={`/students/${student.id}`} className="text-[#10b981] text-sm font-medium hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing 1-8 of 47 students</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 bg-[#1e3a5f] text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">3</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}