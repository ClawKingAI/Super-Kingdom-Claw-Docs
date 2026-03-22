import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/button'
import { StatusBadge } from '@/components/status-badge'

// Mock data
const mockRequests = [
  { id: 'DEL-001', type: 'tracked_hour', recordId: 'Hour #1234', reason: 'Entered for wrong student', status: 'pending', requestedBy: 'Sarah Adams', requestedAt: 'Mar 18, 2026' },
  { id: 'DEL-002', type: 'tracked_hour', recordId: 'Hour #1198', reason: 'Duplicate entry', status: 'pending', requestedBy: 'John Miller', requestedAt: 'Mar 17, 2026' },
  { id: 'DEL-003', type: 'student', recordId: 'STU-2023-089', reason: 'Student transferred out of program', status: 'pending', requestedBy: 'Michael White', requestedAt: 'Mar 15, 2026' },
  { id: 'DEL-004', type: 'tracked_hour', recordId: 'Hour #1156', reason: 'Hours entered incorrectly', status: 'approved', requestedBy: 'Sarah Adams', requestedAt: 'Mar 10, 2026', reviewedBy: 'David Morgan', reviewedAt: 'Mar 12, 2026' },
  { id: 'DEL-005', type: 'tracked_hour', recordId: 'Hour #1102', reason: 'Wrong date entered', status: 'rejected', requestedBy: 'John Miller', requestedAt: 'Mar 8, 2026', reviewedBy: 'David Morgan', reviewedAt: 'Mar 9, 2026', adminNotes: 'Should edit instead of delete' },
]

export default function DeletionRequestsPage() {
  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Deletion Requests</h1>
          <p className="text-slate-500 text-sm mt-1">Review and manage delete requests</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-sm font-medium">Pending</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">3</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-800 text-sm font-medium">Approved</p>
          <p className="text-3xl font-bold text-green-600 mt-1">1</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 text-sm font-medium">Rejected</p>
          <p className="text-3xl font-bold text-red-600 mt-1">1</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button className="px-4 py-2 bg-[#1e3a5f] text-white text-sm rounded-lg font-medium">All (5)</button>
        <button className="px-4 py-2 bg-amber-100 text-amber-700 text-sm rounded-lg font-medium">Pending (3)</button>
        <button className="px-4 py-2 bg-green-100 text-green-700 text-sm rounded-lg font-medium">Approved (1)</button>
        <button className="px-4 py-2 bg-red-100 text-red-700 text-sm rounded-lg font-medium">Rejected (1)</button>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Request ID</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Record Type</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Reason</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Requested By</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Date</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {mockRequests.map((req) => (
              <tr key={req.id} className={`hover:bg-slate-50 ${req.status === 'pending' ? 'bg-amber-50/30' : ''}`}>
                <td className="px-6 py-4 text-slate-600 font-mono text-sm">{req.id}</td>
                <td className="px-6 py-4">
                  <span className="capitalize text-slate-800">{req.type.replace('_', ' ')}</span>
                  <span className="text-slate-500 text-sm ml-2">({req.recordId})</span>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate">{req.reason}</td>
                <td className="px-6 py-4 text-slate-600">{req.requestedBy}</td>
                <td className="px-6 py-4 text-slate-600">{req.requestedAt}</td>
                <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                <td className="px-6 py-4">
                  {req.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="primary">Approve</Button>
                      <Button size="sm" variant="danger">Reject</Button>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm">
                      {req.reviewedBy} • {req.reviewedAt}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}