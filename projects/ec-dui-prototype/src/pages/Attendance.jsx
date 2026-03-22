import { useState } from 'react'
import { mockClients, mockAttendance } from '../App'

export default function Attendance({ onSelectClient }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [statusView, setStatusView] = useState('calendar')

  const getStatusForClient = (clientId) => {
    const record = mockAttendance.find(a => a.clientId === clientId && a.date === selectedDate)
    return record?.status || null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
          <p className="text-slate-500">Track client attendance and session limits</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStatusView('calendar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              statusView === 'calendar' ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setStatusView('limits')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              statusView === 'limits' ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Limit Alerts
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg"
          />
          <button className="ml-auto bg-brand-blue text-white px-4 py-2 rounded-lg text-sm">
            Batch Entry
          </button>
        </div>
      </div>

      {statusView === 'calendar' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockClients.filter(c => c.status === 'active').map((client) => {
                const status = getStatusForClient(client.id)
                return (
                  <tr key={client.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{client.name}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{client.program}</td>
                    <td className="px-6 py-4">
                      {status ? (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          status === 'present' ? 'bg-green-100 text-green-700' :
                          status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {status}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-sm">Not marked</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                          Present
                        </button>
                        <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200">
                          Late
                        </button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200">
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {statusView === 'limits' && (
        <div className="space-y-4">
          <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-xl p-4">
            <h3 className="font-medium text-brand-orange">Limit Warning</h3>
            <p className="text-sm text-slate-600 mt-1">Clients approaching or exceeding attendance limits require attention.</p>
          </div>

          <div className="grid gap-4">
            {mockClients.filter(c => c.status === 'active').map((client) => {
              const clientAttendance = mockAttendance.filter(a => a.clientId === client.id)
              const lateCount = clientAttendance.filter(a => a.status === 'late').length
              const absentCount = clientAttendance.filter(a => a.status === 'absent').length

              if (lateCount >= 2 || absentCount >= 2) {
                return (
                  <div key={client.id} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-800">{client.name}</p>
                        <p className="text-sm text-slate-500">{client.program}</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className={`text-lg font-bold ${lateCount >= 3 ? 'text-red-600' : 'text-brand-orange'}`}>
                            {lateCount}/3
                          </p>
                          <p className="text-xs text-slate-500">Lates</p>
                        </div>
                        <div className="text-center">
                          <p className={`text-lg font-bold ${absentCount >= 3 ? 'text-red-600' : 'text-brand-orange'}`}>
                            {absentCount}/3
                          </p>
                          <p className="text-xs text-slate-500">Absences</p>
                        </div>
                      </div>
                    </div>
                    {(lateCount >= 3 || absentCount >= 3) && (
                      <div className="mt-3 p-2 bg-red-50 rounded-lg text-sm text-red-700">
                        ⚠️ Client has exceeded the maximum allowed {lateCount >= 3 ? 'lates' : 'absences'}.
                      </div>
                    )}
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
      )}
    </div>
  )
}
