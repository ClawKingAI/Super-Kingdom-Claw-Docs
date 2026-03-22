import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/button'

const reports = [
  { name: 'Student Progress Report', description: 'Individual student progress with detailed hour breakdowns', icon: '📊' },
  { name: 'Certificate Roster', description: 'All students enrolled in a specific certificate program', icon: '👥' },
  { name: 'Students Near Completion', description: 'Students within configurable threshold of finishing', icon: '✅' },
  { name: 'Students Behind Pace', description: 'Students whose hours are below expected progress', icon: '⚠️' },
  { name: 'Hours Summary', description: 'Aggregate hours by period, student, or certificate', icon: '🕐' },
  { name: 'Audit Log', description: 'Complete system change history', icon: '📋' },
  { name: 'Deletion Request Log', description: 'Record of all deletion requests and actions', icon: '🗑️' },
]

export default function ReportsPage() {
  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <p className="text-slate-500 text-sm mt-1">Generate reports and transcripts</p>
      </div>

      {/* Transcript Generator */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <h2 className="font-semibold text-lg text-slate-800 mb-4">Generate Official Transcript</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Student</label>
            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
              <option>Choose a student...</option>
              <option>Marcus Johnson (STU-2024-001)</option>
              <option>Sarah Williams (STU-2024-002)</option>
              <option>David Thompson (STU-2024-003)</option>
              <option>Rachel Garcia (STU-2024-004)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
              <option>PDF (Print)</option>
              <option>HTML (Web)</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button className="w-full">Generate Transcript</Button>
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {reports.map((report) => (
          <div key={report.name} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="text-3xl">{report.icon}</div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">{report.name}</h3>
                <p className="text-sm text-slate-500">{report.description}</p>
                <button className="text-[#10b981] text-sm font-medium mt-3 hover:underline">Run Report →</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transcript Preview */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Transcript Preview</h3>
        </div>
        <div className="p-8 bg-white" style={{ fontFamily: "'Times New Roman', serif" }}>
          <div className="text-center mb-8 border-b-2 border-slate-300 pb-6">
            <h2 className="text-xl font-bold text-slate-800">A Better Way Ministries</h2>
            <h3 className="text-lg text-slate-600 mt-1">Official Certificate Transcript</h3>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-sm text-slate-500 uppercase tracking-wider">Student Name</p>
              <p className="text-slate-800 font-medium">Marcus Johnson</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase tracking-wider">Student ID</p>
              <p className="text-slate-800 font-medium">STU-2024-001</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase tracking-wider">Email</p>
              <p className="text-slate-800 font-medium">marcus.j@email.com</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase tracking-wider">Enrollment Date</p>
              <p className="text-slate-800 font-medium">January 15, 2024</p>
            </div>
          </div>

          <table className="w-full mb-6">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="text-left py-2 text-sm font-semibold text-slate-700">Certificate Program</th>
                <th className="text-center py-2 text-sm font-semibold text-slate-700">Required Hours</th>
                <th className="text-center py-2 text-sm font-semibold text-slate-700">Completed Hours</th>
                <th className="text-center py-2 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-center py-2 text-sm font-semibold text-slate-700">Completion Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-3 text-slate-800">Wood Shop & Commercial Table Production</td>
                <td className="py-3 text-center text-slate-600">900</td>
                <td className="py-3 text-center text-slate-800 font-medium">828</td>
                <td className="py-3 text-center"><span className="text-blue-600 font-medium">In Progress</span></td>
                <td className="py-3 text-center text-slate-400">—</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300">
                <td className="py-3 font-semibold text-slate-800">Total Cumulative Hours</td>
                <td></td>
                <td className="py-3 text-center font-bold text-slate-800">828</td>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          <div className="text-center text-sm text-slate-500 mt-8 pt-6 border-t border-slate-200">
            <p>Generated: March 20, 2026</p>
            <p className="mt-1">This is a demo transcript. Not an official document.</p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}