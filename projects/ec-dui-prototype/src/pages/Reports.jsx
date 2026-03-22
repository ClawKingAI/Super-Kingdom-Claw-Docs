import { mockClients, mockPayments, programs } from '../App'

export default function Reports() {
  const activeClients = mockClients.filter(c => c.status === 'active').length
  const completedClients = mockClients.filter(c => c.status === 'completed').length
  const terminatedClients = mockClients.filter(c => c.status === 'terminated').length

  const totalRevenue = mockPayments.reduce((sum, p) => sum + p.amount, 0)

  const programStats = programs.map(p => {
    const clients = mockClients.filter(c => c.program === p.name)
    const payments = mockPayments.filter(payment =>
      mockClients.find(c => c.id === payment.clientId)?.program === p.name
    )
    return {
      name: p.name,
      fullName: p.fullName,
      active: clients.filter(c => c.status === 'active').length,
      completed: clients.filter(c => c.status === 'completed').length,
      revenue: payments.reduce((s, p) => s + p.amount, 0)
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
        <p className="text-slate-500">Program statistics, revenue, and forecasting</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <p className="text-sm text-slate-500">Active Clients</p>
          <p className="text-3xl font-bold text-brand-blue">{activeClients}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="text-3xl font-bold text-brand-green">{completedClients}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <p className="text-sm text-slate-500">Terminated</p>
          <p className="text-3xl font-bold text-brand-orange">{terminatedClients}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p className="text-3xl font-bold text-brand-yellow">${totalRevenue}</p>
        </div>
      </div>

      {/* Program Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">Program Performance</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Program</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Completed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {programStats.map((stat) => (
              <tr key={stat.name} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{stat.name}</div>
                  <div className="text-sm text-slate-500">{stat.fullName}</div>
                </td>
                <td className="px-6 py-4 text-slate-800">{stat.active}</td>
                <td className="px-6 py-4 text-brand-green">{stat.completed}</td>
                <td className="px-6 py-4 text-brand-blue font-medium">${stat.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Referral Sources */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Referral Source Distribution</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {['Probation', 'State Court', 'DFACS', 'Attorney', 'Superior Court', 'Self-Referred'].map((source) => {
            const count = mockClients.filter(c => c.referralSource === source).length
            return (
              <div key={source} className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-800">{count}</p>
                <p className="text-sm text-slate-500">{source}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Reports */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Generate Reports</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Monthly Revenue', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { name: 'Completion Rates', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { name: 'Outstanding Balances', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { name: 'Attendance Compliance', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
          ].map((report) => (
            <button key={report.name} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-left">
              <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={report.icon} />
                </svg>
              </div>
              <p className="font-medium text-slate-800">{report.name}</p>
              <p className="text-xs text-slate-500">Export PDF/CSV</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
