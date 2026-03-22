import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/button'
import { StatusBadge } from '@/components/status-badge'
import { Plus, Search } from 'lucide-react'

// Mock data
const mockRecentHours = [
  { id: 1, date: 'Mar 19, 2026', student: 'Marcus Johnson', certificate: 'Wood Shop', hours: 4.5, type: 'regular', notes: 'Tabletop construction', approved: true, enteredBy: 'Sarah Adams' },
  { id: 2, date: 'Mar 19, 2026', student: 'Lisa Martinez', certificate: 'Lawn Care', hours: 3.0, type: 'regular', notes: 'Mowing practice', approved: false, enteredBy: 'Sarah Adams' },
  { id: 3, date: 'Mar 18, 2026', student: 'James Cooper', certificate: 'Automotive', hours: 6.0, type: 'regular', notes: 'Brake inspection', approved: true, enteredBy: 'John Miller' },
  { id: 4, date: 'Mar 18, 2026', student: 'David Thompson', certificate: 'Automotive', hours: 2.5, type: 'makeup', notes: 'Diagnostic practice', approved: true, enteredBy: 'John Miller' },
  { id: 5, date: 'Mar 17, 2026', student: 'Rachel Garcia', certificate: 'Food Service', hours: 4.0, type: 'regular', notes: 'Kitchen prep', approved: true, enteredBy: 'Sarah Adams' },
  { id: 6, date: 'Mar 17, 2026', student: 'Andrew Peterson', certificate: 'Wood Shop', hours: 3.5, type: 'regular', notes: 'Sanding and finishing', approved: false, enteredBy: 'Michael White' },
]

export default function TimeTrackingPage() {
  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Time Tracking</h1>
          <p className="text-slate-500 text-sm mt-1">Log and manage student hours</p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Log Hours
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500 mb-1">This Week</p>
          <h3 className="text-3xl font-bold text-slate-800">324</h3>
          <p className="text-xs text-green-600 mt-1">+18% from last week</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500 mb-1">This Month</p>
          <h3 className="text-3xl font-bold text-slate-800">1,284</h3>
          <p className="text-xs text-slate-400 mt-1">hours logged</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500 mb-1">Pending Approval</p>
          <h3 className="text-3xl font-bold text-amber-600">12</h3>
          <p className="text-xs text-slate-400 mt-1">entries</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500 mb-1">Avg per Student</p>
          <h3 className="text-3xl font-bold text-slate-800">27.3</h3>
          <p className="text-xs text-slate-400 mt-1">hours/week</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Date Range:</label>
            <input type="date" defaultValue="2026-03-01" className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm" />
            <span className="text-slate-400">to</span>
            <input type="date" defaultValue="2026-03-20" className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm" />
          </div>
          <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
            <option>All Students</option>
            <option>Marcus Johnson</option>
            <option>Sarah Williams</option>
            <option>David Thompson</option>
          </select>
          <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
            <option>All Certificates</option>
            <option>Wood Shop</option>
            <option>Lawn Care</option>
            <option>Automotive</option>
          </select>
          <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
            <option>All Types</option>
            <option>Regular</option>
            <option>Makeup</option>
          </select>
          <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
            <option>All Statuses</option>
            <option>Approved</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      {/* Time Entries Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Date</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Student</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Certificate</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Hours</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Type</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Notes</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Entered By</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {mockRecentHours.map((entry) => (
              <tr key={entry.id} className={`hover:bg-slate-50 ${!entry.approved ? 'bg-amber-50/30' : ''}`}>
                <td className="px-6 py-4 text-slate-600">{entry.date}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{entry.student}</td>
                <td className="px-6 py-4 text-slate-600">{entry.certificate}</td>
                <td className="px-6 py-4 font-bold text-slate-800">{entry.hours}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${entry.type === 'makeup' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                    {entry.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate">{entry.notes}</td>
                <td className="px-6 py-4 text-slate-600 text-sm">{entry.enteredBy}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={entry.approved ? 'approved' : 'pending'} />
                </td>
                <td className="px-6 py-4">
                  {!entry.approved && (
                    <div className="flex items-center gap-2">
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">Approve</button>
                      <span className="text-slate-300">|</span>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing 1-6 of 128 entries</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 bg-[#1e3a5f] text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">3</button>
            <span className="text-slate-400">...</span>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">22</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}