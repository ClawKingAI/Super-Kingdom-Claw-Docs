import { useState } from 'react'
import { mockClients, programs } from '../App'

export default function Letters() {
  const [showGenerator, setShowGenerator] = useState(false)
  const [selectedType, setSelectedType] = useState('completion')

  const letterTypes = [
    {
      id: 'completion',
      name: 'Completion Letter',
      description: 'Generate certificate of completion for clients who have successfully finished their program.',
      programs: ['FVIP', 'Anger Management', 'Victim Impact Panel', 'Parenting Class', 'Shoplifting Class'],
      fields: ['Start Date', 'End Date', 'Total Days Attended', 'Total Absences', 'Money Paid', 'Balance']
    },
    {
      id: 'termination',
      name: 'Termination Letter',
      description: 'Document when a client has been terminated from the program.',
      programs: ['All Programs'],
      fields: ['Reason', 'Last Attendance Date', 'Total Sessions Completed']
    },
    {
      id: 'transfer',
      name: 'Transfer Letter',
      description: 'Transfer a client to another program or location.',
      programs: ['All Programs'],
      fields: ['New Program', 'New Location', 'Transfer Date', 'Reason']
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Letters</h1>
          <p className="text-slate-500">Generate completion, termination, and transfer letters</p>
        </div>
      </div>

      {/* Letter Types */}
      <div className="grid grid-cols-3 gap-6">
        {letterTypes.map((type) => (
          <div key={type.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">{type.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{type.description}</p>
            <button
              onClick={() => { setSelectedType(type.id); setShowGenerator(true) }}
              className="w-full bg-brand-blue text-white py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              Generate →
            </button>
          </div>
        ))}
      </div>

      {/* Recent Letters */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">Recently Generated</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Program</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4 text-slate-800">2026-03-15</td>
              <td className="px-6 py-4 font-medium text-slate-800">Emily Brown</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Completion</span>
              </td>
              <td className="px-6 py-4 text-slate-600">Parenting Class</td>
              <td className="px-6 py-4">
                <button className="text-brand-blue hover:underline text-sm mr-3">Download PDF</button>
                <button className="text-brand-blue hover:underline text-sm">Email</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Letter Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {letterTypes.find(t => t.id === selectedType)?.name}
              </h2>
              <button onClick={() => setShowGenerator(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Client</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                  <option value="">Choose a client...</option>
                  {mockClients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.program}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Program</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName}</option>
                  ))}
                </select>
              </div>

              {selectedType === 'completion' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                      <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                      <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Total Days Attended</label>
                      <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Total Absences</label>
                      <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Money Paid ($)</label>
                      <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Balance ($)</label>
                      <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowGenerator(false)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Generate PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
