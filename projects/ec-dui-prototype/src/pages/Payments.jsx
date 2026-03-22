import { mockPayments, mockClients } from '../App'

export default function Payments() {
  const getClientName = (clientId) => {
    const client = mockClients.find(c => c.id === clientId)
    return client?.name || 'Unknown'
  }

  const totalRevenue = mockPayments.reduce((sum, p) => sum + p.amount, 0)
  const thisMonth = mockPayments.filter(p => p.date.startsWith('2026-03')).reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payments</h1>
          <p className="text-slate-500">Track payments and outstanding balances</p>
        </div>
        <button className="bg-brand-green text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Record Payment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p className="text-3xl font-bold text-brand-green">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <p className="text-sm text-slate-500">This Month</p>
          <p className="text-3xl font-bold text-brand-blue">${thisMonth.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <p className="text-sm text-slate-500">Outstanding</p>
          <p className="text-3xl font-bold text-brand-orange">$425</p>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">Recent Payments</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Auth ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {mockPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-800">{payment.date}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{getClientName(payment.clientId)}</td>
                <td className="px-6 py-4 text-brand-green font-medium">${payment.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    payment.method === 'Card' ? 'bg-blue-100 text-blue-700' :
                    payment.method === 'Cash' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {payment.method}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{payment.authId || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Outstanding Balances */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">Outstanding Balances</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Program</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {mockClients.filter(c => c.balance > 0).map((client) => (
              <tr key={client.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">{client.name}</td>
                <td className="px-6 py-4 text-slate-600">{client.program}</td>
                <td className="px-6 py-4 text-brand-orange font-medium">${client.balance}</td>
                <td className="px-6 py-4">
                  <button className="text-brand-blue hover:underline text-sm">Record Payment</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
