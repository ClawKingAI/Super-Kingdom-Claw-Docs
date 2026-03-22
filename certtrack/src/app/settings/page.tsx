import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/button'

export default function SettingsPage() {
  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage system configuration and preferences</p>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <div className="flex border-b border-slate-200">
          <button className="px-6 py-4 text-sm font-medium text-[#1e3a5f] border-b-2 border-[#1e3a5f] bg-[#1e3a5f]/5">General</button>
          <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50">Users & Roles</button>
          <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50">Audit Log</button>
        </div>

        {/* General Settings */}
        <div className="p-6">
          <div className="space-y-8">
            {/* Organization Info */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Organization Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Organization Name</label>
                  <input 
                    type="text" 
                    defaultValue="A Better Way Ministries" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                  <input 
                    type="email" 
                    defaultValue="admin@abetterway.org" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]/50"
                  />
                </div>
              </div>
            </div>

            {/* Default Settings */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Default Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">Require approval for time entries</p>
                    <p className="text-sm text-slate-500">Staff must approve logged hours before they count toward completion</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#10b981]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">Send email notifications for deletions</p>
                    <p className="text-sm text-slate-500">Administrators receive email when deletion requests are submitted</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#10b981]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">Show pace warnings on dashboard</p>
                    <p className="text-sm text-slate-500">Highlight students who are behind expected progress pace</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#10b981]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Status Options */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Student Status Options</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">Active</span>
                <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">Intake</span>
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Completed</span>
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Transferred</span>
                <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">Terminated</span>
                <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">Hold</span>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-slate-200">
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">System Users</h3>
            <p className="text-sm text-slate-500 mt-1">Manage staff accounts and permissions</p>
          </div>
          <Button variant="secondary">+ Add User</Button>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">User</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Email</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Role</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Last Active</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#10b981]/20 rounded-full flex items-center justify-center text-[#10b981] font-medium text-sm">DM</div>
                  <span className="font-medium text-slate-800">David Morgan</span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-600">david.m@abetterway.org</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">Admin</span></td>
              <td className="px-6 py-4 text-slate-600">Just now</td>
              <td className="px-6 py-4">
                <button className="text-slate-400 hover:text-slate-600">Edit</button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium text-sm">JM</div>
                  <span className="font-medium text-slate-800">John Miller</span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-600">john.m@abetterway.org</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">Admin</span></td>
              <td className="px-6 py-4 text-slate-600">2 hours ago</td>
              <td className="px-6 py-4">
                <button className="text-slate-400 hover:text-slate-600">Edit</button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-medium text-sm">SA</div>
                  <span className="font-medium text-slate-800">Sarah Adams</span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-600">sarah.a@abetterway.org</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Staff</span></td>
              <td className="px-6 py-4 text-slate-600">Yesterday</td>
              <td className="px-6 py-4">
                <button className="text-slate-400 hover:text-slate-600">Edit</button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-medium text-sm">MW</div>
                  <span className="font-medium text-slate-800">Michael White</span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-600">michael.w@abetterway.org</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Staff</span></td>
              <td className="px-6 py-4 text-slate-600">2 days ago</td>
              <td className="px-6 py-4">
                <button className="text-slate-400 hover:text-slate-600">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}