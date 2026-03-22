import { useState } from 'react'
import { programs, referralSources } from '../App'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('programs')

  const tabs = [
    { id: 'programs', label: 'Programs' },
    { id: 'referral', label: 'Referral Sources' },
    { id: 'users', label: 'Users' },
    { id: 'branding', label: 'Branding' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500">Configure programs, users, and system settings</p>
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

      {/* Programs Tab */}
      {activeTab === 'programs' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">Program Types</h2>
            <button className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm">+ Add Program</button>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sessions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Letter Required</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {programs.map((program) => (
                <tr key={program.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{program.name}</div>
                    <div className="text-sm text-slate-500">{program.fullName}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{program.sessions}</td>
                  <td className="px-6 py-4 text-slate-800">${program.fee}</td>
                  <td className="px-6 py-4">
                    {['FVIP', 'Anger Management', 'Victim Impact Panel', 'Parenting Class', 'Shoplifting Class'].includes(program.name) ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Yes</span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">Certificate</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-brand-blue hover:underline text-sm">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Referral Sources Tab */}
      {activeTab === 'referral' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-slate-800">Referral Sources</h2>
            <button className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm">+ Add Source</button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {referralSources.map((source) => (
              <div key={source} className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                <span className="text-slate-800">{source}</span>
                <button className="text-slate-400 hover:text-slate-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.768 3.768m-2.13-2.13l-5.601 5.601a2 2 0 01-1.11.612l-2.9.725a1 1 0 01-1.22-1.22l.725-2.9a2 2 0 01.612-1.11l5.601-5.601a2 2 0 012.828 0z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">User Management</h2>
            <button className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm">+ Add User</button>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Access</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">Admin User</div>
                  <div className="text-sm text-slate-500">admin@ecdui.com</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-xs">Admin</span>
                </td>
                <td className="px-6 py-4 text-slate-600">Full Access</td>
                <td className="px-6 py-4">
                  <button className="text-brand-blue hover:underline text-sm">Edit</button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">Probation Officer</div>
                  <div className="text-sm text-slate-500">probation@coweta.gov</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-brand-orange/10 text-brand-orange rounded-full text-xs">Referral</span>
                </td>
                <td className="px-6 py-4 text-slate-600">Own Referrals Only</td>
                <td className="px-6 py-4">
                  <button className="text-brand-blue hover:underline text-sm">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div>
            <h2 className="font-semibold text-slate-800 mb-4">Brand Colors</h2>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className="w-full h-20 bg-brand-blue rounded-lg mb-2"></div>
                <p className="text-sm text-slate-700">Blue</p>
                <p className="text-xs text-slate-500">#1e88e5</p>
              </div>
              <div>
                <div className="w-full h-20 bg-brand-yellow rounded-lg mb-2"></div>
                <p className="text-sm text-slate-700">Yellow</p>
                <p className="text-xs text-slate-500">#fbc02d</p>
              </div>
              <div>
                <div className="w-full h-20 bg-brand-green rounded-lg mb-2"></div>
                <p className="text-sm text-slate-700">Green</p>
                <p className="text-xs text-slate-500">#43a047</p>
              </div>
              <div>
                <div className="w-full h-20 bg-brand-orange rounded-lg mb-2"></div>
                <p className="text-sm text-slate-700">Orange</p>
                <p className="text-xs text-slate-500">#ef6c00</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800 mb-4">Logo</h2>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-brand-blue rounded-xl flex items-center justify-center text-white text-3xl font-bold">
                EC
              </div>
              <div>
                <p className="text-sm text-slate-700">Current Logo</p>
                <button className="text-brand-blue hover:underline text-sm">Upload New Logo</button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800 mb-4">Letter Template</h2>
            <p className="text-sm text-slate-600 mb-4">Upload letterhead template for generated letters.</p>
            <button className="border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-50">
              Upload Letterhead
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
