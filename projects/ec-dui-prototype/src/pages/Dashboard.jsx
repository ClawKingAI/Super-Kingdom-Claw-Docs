import { mockClients, mockPayments, programs } from '../App'

export default function Dashboard({ onNavigate, onSelectClient }) {
  const activeClients = mockClients.filter(c => c.status === 'active').length
  const completedThisMonth = mockClients.filter(c => c.status === 'completed').length
  const totalRevenue = mockPayments.reduce((sum, p) => sum + p.amount, 0)
  const outstandingBalance = mockClients.reduce((sum, c) => sum + (c.balance || 0), 0)

  const recentClients = mockClients.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Mission Statement */}
      <div className="bg-gradient-to-r from-brand-blue to-blue-700 rounded-xl p-6 text-white">
        <p className="text-lg font-medium">"Improving Quality of Life for Individuals & Families"</p>
        <p className="text-sm opacity-80 mt-1">East Coweta DUI School & Risk Reduction Center, LLC</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{activeClients}</p>
              <p className="text-sm text-slate-500">Active Clients</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{completedThisMonth}</p>
              <p className="text-sm text-slate-500">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-yellow/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">${outstandingBalance.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Outstanding</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Add Client', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', page: 'clients' },
            { label: 'Mark Attendance', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', page: 'attendance' },
            { label: 'Record Payment', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', page: 'payments' },
            { label: 'Generate Letter', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', page: 'letters' },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.page)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              </div>
              <span className="text-sm text-slate-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Clients */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Recent Clients</h2>
          <button
            onClick={() => onNavigate('clients')}
            className="text-sm text-brand-blue hover:underline"
          >
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentClients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => onSelectClient(client)}
                  className="hover:bg-slate-50 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{client.name}</div>
                    <div className="text-sm text-slate-500">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{client.program}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      client.status === 'active' ? 'bg-green-100 text-green-700' :
                      client.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">${client.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Programs Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Programs Offered</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {programs.map((program) => (
            <div key={program.id} className="p-4 bg-slate-50 rounded-lg">
              <p className="font-medium text-slate-800">{program.name}</p>
              <p className="text-sm text-slate-500">{program.sessions} sessions</p>
              <p className="text-sm text-brand-blue font-medium">${program.fee}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
