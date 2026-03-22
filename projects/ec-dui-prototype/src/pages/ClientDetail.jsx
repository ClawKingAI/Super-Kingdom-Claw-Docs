import { useState } from 'react'
import { mockAttendance, mockPayments, programs } from '../App'

export default function ClientDetail({ client, onBack }) {
  const [activeTab, setActiveTab] = useState('info')

  const clientAttendance = mockAttendance.filter(a => a.clientId === client.id)
  const clientPayments = mockPayments.filter(p => p.clientId === client.id)

  const presentCount = clientAttendance.filter(a => a.status === 'present').length
  const lateCount = clientAttendance.filter(a => a.status === 'late').length
  const absentCount = clientAttendance.filter(a => a.status === 'absent').length

  const program = programs.find(p => p.name === client.program)

  const tabs = [
    { id: 'info', label: 'Info' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'payments', label: 'Payments' },
    { id: 'documents', label: 'Documents' },
    { id: 'letters', label: 'Letters' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">{client.name}</h1>
          <p className="text-slate-500">{client.program} • {client.referralSource}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
          client.status === 'active' ? 'bg-green-100 text-green-700' :
          client.status === 'completed' ? 'bg-blue-100 text-blue-700' :
          'bg-red-100 text-red-700'
        }`}>
          {client.status}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Present</p>
          <p className="text-2xl font-bold text-brand-green">{presentCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Late</p>
          <p className={`text-2xl font-bold ${lateCount >= 3 ? 'text-brand-orange' : 'text-brand-yellow'}`}>{lateCount}/3</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Absent</p>
          <p className={`text-2xl font-bold ${absentCount >= 3 ? 'text-red-600' : 'text-brand-orange'}`}>{absentCount}/3</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Balance</p>
          <p className={`text-2xl font-bold ${client.balance > 0 ? 'text-brand-orange' : 'text-brand-green'}`}>${client.balance}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <p><span className="text-slate-500">Phone:</span> <span className="text-slate-800">{client.phone}</span></p>
                  <p><span className="text-slate-500">Email:</span> <span className="text-slate-800">{client.email}</span></p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-3">Program Details</h3>
                <div className="space-y-2">
                  <p><span className="text-slate-500">Program:</span> <span className="text-slate-800">{program?.fullName || client.program}</span></p>
                  <p><span className="text-slate-500">Start Date:</span> <span className="text-slate-800">{client.startDate}</span></p>
                  {client.endDate && <p><span className="text-slate-500">End Date:</span> <span className="text-slate-800">{client.endDate}</span></p>}
                  <p><span className="text-slate-500">Sessions:</span> <span className="text-slate-800">{program?.sessions || 'N/A'}</span></p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-3">Referral Information</h3>
                <div className="space-y-2">
                  <p><span className="text-slate-500">Source:</span> <span className="text-slate-800">{client.referralSource}</span></p>
                  <p><span className="text-slate-500">County:</span> <span className="text-slate-800">{client.county}</span></p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-3">Financial Summary</h3>
                <div className="space-y-2">
                  <p><span className="text-slate-500">Program Fee:</span> <span className="text-slate-800">${program?.fee || 'N/A'}</span></p>
                  <p><span className="text-slate-500">Total Paid:</span> <span className="text-slate-800">${clientPayments.reduce((s, p) => s + p.amount, 0)}</span></p>
                  <p><span className="text-slate-500">Balance Due:</span> <span className={`font-medium ${client.balance > 0 ? 'text-brand-orange' : 'text-brand-green'}`}>${client.balance}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-slate-800">Attendance History</h3>
              <button className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm">
                + Mark Attendance
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {clientAttendance.map((a, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-slate-800">{a.date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        a.status === 'present' ? 'bg-green-100 text-green-700' :
                        a.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{a.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-slate-800">Payment History</h3>
              <button className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm">
                + Record Payment
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Method</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Auth ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {clientPayments.map((p, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-slate-800">{p.date}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">${p.amount}</td>
                    <td className="px-4 py-3 text-slate-600">{p.method}</td>
                    <td className="px-4 py-3 text-slate-500">{p.authId || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <h3 className="font-medium text-slate-800 mb-4">Documents & Forms</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">FVIP Registration Form</span>
                <a href="https://hushforms.com/ecdui-9082" target="_blank" rel="noopener" className="text-brand-blue hover:underline text-sm">Open Form →</a>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">FVIP Contract</span>
                <a href="https://hushforms.com/ecdui-6331" target="_blank" rel="noopener" className="text-brand-blue hover:underline text-sm">Open Form →</a>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">FVIP Principles of Practice</span>
                <a href="https://hushforms.com/ecdui-8550" target="_blank" rel="noopener" className="text-brand-blue hover:underline text-sm">Open Form →</a>
              </div>
            </div>
            <button className="mt-4 border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-50">
              + Upload Document
            </button>
          </div>
        )}

        {activeTab === 'letters' && (
          <div>
            <h3 className="font-medium text-slate-800 mb-4">Generate Letters</h3>
            <div className="grid grid-cols-3 gap-4">
              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-left">
                <div className="font-medium text-slate-800">Completion Letter</div>
                <div className="text-sm text-slate-500">Generate completion certificate</div>
              </button>
              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-left">
                <div className="font-medium text-slate-800">Termination Letter</div>
                <div className="text-sm text-slate-500">Document program termination</div>
              </button>
              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-left">
                <div className="font-medium text-slate-800">Transfer Letter</div>
                <div className="text-sm text-slate-500">Transfer to another program</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
