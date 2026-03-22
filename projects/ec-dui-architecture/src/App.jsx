import { useState } from 'react'

// ============================================
// EC DUI SCHOOL PORTAL — ARCHITECTURE MAP
// ============================================

const phases = [
  {
    id: 'frontend',
    title: 'Frontend Layer',
    color: 'bg-brand-blue',
    borderColor: 'border-brand-blue',
    components: [
      { name: 'Admin Dashboard', desc: 'Owner view — all clients, reports, settings', icon: '📊' },
      { name: 'Client Management', desc: 'CRUD for client records, search, filters', icon: '👥' },
      { name: 'Attendance Tracker', desc: 'Session-by-session tracking, limit alerts', icon: '📅' },
      { name: 'Payment Records', desc: 'Payment history, receipts, balance due', icon: '💰' },
      { name: 'Document Center', desc: 'Form links, uploads, certificates', icon: '📄' },
      { name: 'Letter Generator', desc: 'Completion, termination, transfer letters', icon: '📝' },
      { name: 'Reports & Analytics', desc: 'Program stats, revenue, forecasting', icon: '📈' },
      { name: 'Probation Officer Portal', desc: 'Filtered view — only their cases', icon: '🔒' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Services',
    color: 'bg-brand-green',
    borderColor: 'border-brand-green',
    components: [
      { name: 'Supabase Auth', desc: 'Role-based auth (admin, probation officer)', icon: '🔑' },
      { name: 'PostgreSQL Database', desc: 'All tables, relationships, constraints', icon: '🗄️' },
      { name: 'Row-Level Security', desc: 'Probation officers see only their cases', icon: '🛡️' },
      { name: 'Storage Buckets', desc: 'Document uploads, certificates, PDFs', icon: '📦' },
      { name: 'Edge Functions', desc: 'Serverless: letter gen, notifications', icon: '⚡' },
      { name: 'Realtime Subscriptions', desc: 'Live updates for attendance/payments', icon: '🔄' },
    ],
  },
  {
    id: 'integrations',
    title: 'External Integrations',
    color: 'bg-brand-orange',
    borderColor: 'border-brand-orange',
    components: [
      { name: 'Stripe Webhooks', desc: 'Auto-record payments when received', icon: '💳' },
      { name: 'QuickBooks Sync', desc: 'Export payments for accounting', icon: '📗' },
      { name: 'HushForms Links', desc: 'Registration form URLs embedded', icon: '🔗' },
      { name: 'Email Service', desc: 'SendGrid/Resend for notifications', icon: '📧' },
      { name: 'PDF Generator', desc: 'Letter/document generation', icon: '📑' },
    ],
  },
  {
    id: 'database',
    title: 'Database Schema',
    color: 'bg-brand-yellow',
    borderColor: 'border-brand-yellow',
    components: [
      { name: 'clients', desc: 'name, phone, email, program, status, dates, referral', icon: '👤' },
      { name: 'attendance', desc: 'client_id, date, status (present/late/absent)', icon: '✅' },
      { name: 'payments', desc: 'client_id, amount, method, auth_id, date', icon: '💵' },
      { name: 'documents', desc: 'client_id, type, file_url, uploaded_by, date', icon: '📁' },
      { name: 'letters', desc: 'client_id, type, program, generated_at, pdf_url', icon: '✉️' },
      { name: 'referral_sources', desc: 'name, type, contact_email (for portal access)', icon: '🏢' },
      { name: 'programs', desc: 'name, requirements, session_count, fee', icon: '📋' },
    ],
  },
]

const userFlows = [
  {
    title: 'Admin (Business Owner)',
    steps: [
      'Login → Dashboard',
      'View all active clients',
      'Add new client → Select program → Set referral source',
      'Mark attendance per session',
      'View Stripe payment notifications auto-recorded',
      'Generate completion letter → Download PDF',
      'Run reports: revenue by program, completion rates, outstanding balances',
    ],
  },
  {
    title: 'Probation Officer',
    steps: [
      'Login → Filtered dashboard (only their referred clients)',
      'View client attendance history',
      'View payment status',
      'Download completion letters',
      'Upload case management documents',
      'Receive email notification when client completes/terminates',
    ],
  },
]

const techStack = [
  { layer: 'Frontend', tech: 'React + TailwindCSS + Vite', reason: 'Fast, modern, mobile-responsive' },
  { layer: 'Backend', tech: 'Supabase (PostgreSQL + Auth + Storage)', reason: 'All-in-one, row-level security' },
  { layer: 'Payments', tech: 'Stripe Webhooks', reason: 'Auto-record when payments hit' },
  { layer: 'Accounting', tech: 'QuickBooks Integration (via Bolt)', reason: 'Client requested' },
  { layer: 'Email', tech: 'SendGrid or Resend', reason: 'Notifications to probation officers' },
  { layer: 'PDF Generation', tech: 'jsPDF or Supabase Edge Function', reason: 'Letter/document generation' },
  { layer: 'Hosting', tech: 'Vercel or Netlify', reason: 'Free tier, auto-deploy from git' },
]

const pages = [
  { name: 'Login', desc: 'Email/password, role detection', auth: true },
  { name: 'Dashboard', desc: 'Stats overview, quick actions', auth: true },
  { name: 'Clients', desc: 'List, search, filter, add new', auth: true },
  { name: 'Client Detail', desc: 'Full profile, tabs: Info, Attendance, Payments, Documents, Letters', auth: true },
  { name: 'Attendance', desc: 'Calendar view, batch entry, alerts', auth: true },
  { name: 'Payments', desc: 'History, outstanding balances, manual entry', auth: true },
  { name: 'Documents', desc: 'Upload center, form links, certificates', auth: true },
  { name: 'Letters', desc: 'Generate completion/termination/transfer', auth: true },
  { name: 'Reports', desc: 'Program analytics, revenue, forecasting', auth: true },
  { name: 'Settings', desc: 'Program types, referral sources, users', auth: 'admin' },
  { name: 'Probation Portal', desc: 'Limited view for referral sources', auth: 'referral' },
]

const securityNotes = [
  'Row-Level Security (RLS) on all tables — probation officers query with auth.uid() filter',
  'PII excluded: DOB, address, race, gender, driver\'s license NOT stored',
  'All API routes require auth token',
  'File uploads scanned for malware',
  'Audit log for all CRUD operations',
  'GDPR-compliant data deletion on request',
]

function Section({ title, children, color = 'navy-800' }) {
  return (
    <section className={`mb-12 bg-${color} rounded-2xl p-8 border border-navy-800`}>
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      {children}
    </section>
  )
}

function PhaseCard({ phase, isExpanded, onToggle }) {
  return (
    <div className={`bg-navy-800 rounded-xl border-2 ${phase.borderColor.replace('bg-', 'border-')} overflow-hidden`}>
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-navy-700 transition"
      >
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded ${phase.color}`} />
          <span className="text-white font-semibold text-lg">{phase.title}</span>
        </div>
        <svg
          className={`w-5 h-5 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {phase.components.map((comp, i) => (
              <div key={i} className="bg-navy-900 rounded-lg p-4 border border-navy-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{comp.icon}</span>
                  <span className="text-white font-medium">{comp.name}</span>
                </div>
                <p className="text-gray-400 text-sm">{comp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [expandedPhases, setExpandedPhases] = useState(['frontend'])
  const [activeTab, setActiveTab] = useState('architecture')

  const togglePhase = (id) => {
    setExpandedPhases((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Header */}
      <header className="bg-navy-800 border-b border-navy-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">EC DUI School Portal</h1>
              <p className="text-gray-400 text-sm">Architecture & Planning Document</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-brand-blue/20 text-brand-blue rounded-full text-sm">Phase 1 MVP</span>
              <span className="px-3 py-1 bg-brand-green/20 text-brand-green rounded-full text-sm">React + Supabase</span>
            </div>
          </div>
        </div>
      </header>

      {/* Nav Tabs */}
      <nav className="bg-navy-800/50 border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {['architecture', 'pages', 'flows', 'tech', 'security'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab
                    ? 'bg-brand-blue text-white'
                    : 'text-gray-400 hover:text-white hover:bg-navy-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'architecture' && (
          <div className="space-y-4">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">System Architecture</h2>
              <p className="text-gray-400">Click each layer to expand components</p>
            </div>
            {phases.map((phase) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                isExpanded={expandedPhases.includes(phase.id)}
                onToggle={() => togglePhase(phase.id)}
              />
            ))}
          </div>
        )}

        {activeTab === 'pages' && (
          <Section title="Page Inventory">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-navy-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Page</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Description</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Auth Required</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page, i) => (
                    <tr key={i} className="border-b border-navy-700/50 hover:bg-navy-700/30">
                      <td className="py-3 px-4 text-white font-medium">{page.name}</td>
                      <td className="py-3 px-4 text-gray-300">{page.desc}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          page.auth === true ? 'bg-brand-orange/20 text-brand-orange' :
                          page.auth === 'admin' ? 'bg-brand-yellow/20 text-brand-yellow' :
                          'bg-brand-green/20 text-brand-green'
                        }`}>
                          {page.auth === true ? 'All Users' : page.auth === 'admin' ? 'Admin Only' : 'Referral Sources'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {activeTab === 'flows' && (
          <Section title="User Flows">
            <div className="grid lg:grid-cols-2 gap-8">
              {userFlows.map((flow, i) => (
                <div key={i} className="bg-navy-900 rounded-xl p-6 border border-navy-700">
                  <h3 className="text-xl font-semibold text-brand-blue mb-4">{flow.title}</h3>
                  <ol className="space-y-3">
                    {flow.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-brand-blue/20 text-brand-blue rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {j + 1}
                        </span>
                        <span className="text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </Section>
        )}

        {activeTab === 'tech' && (
          <Section title="Technology Stack">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {techStack.map((item, i) => (
                <div key={i} className="bg-navy-900 rounded-lg p-5 border border-navy-700">
                  <div className="text-brand-yellow text-sm font-medium mb-1">{item.layer}</div>
                  <div className="text-white font-semibold mb-2">{item.tech}</div>
                  <div className="text-gray-400 text-sm">{item.reason}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-navy-900 rounded-xl border border-brand-blue/30">
              <h3 className="text-brand-blue font-semibold mb-4">Data Flow Diagram</h3>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React App     │────▶│   Supabase      │────▶│   PostgreSQL    │
│   (Frontend)    │     │   (Backend)     │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Stripe Webhook  │────▶│ Edge Function   │────▶│ Payments Table  │
│ (Auto-record)   │     │ (Processing)    │     │ (Updated)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │
        ▼
┌─────────────────┐
│ QuickBooks Sync │  ◀──  Bolt integration for accounting export
└─────────────────┘
`}
              </pre>
            </div>
          </Section>
        )}

        {activeTab === 'security' && (
          <Section title="Security & Privacy">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-brand-orange font-semibold text-lg">Security Measures</h3>
                <ul className="space-y-3">
                  {securityNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-gray-300">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-navy-900 rounded-xl p-6 border border-brand-orange/30">
                <h3 className="text-brand-orange font-semibold mb-4">PII Excluded (Not Stored)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Date of Birth', 'Physical Address', 'Race', 'Gender', 'Driver\'s License #', 'SSN'].map((field, i) => (
                    <div key={i} className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <span className="text-red-300 text-sm">{field}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-navy-900 rounded-xl border border-navy-700">
              <h3 className="text-white font-semibold mb-4">Role-Based Access Control (RBAC)</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-navy-700">
                      <th className="text-left py-2 px-4 text-gray-400">Permission</th>
                      <th className="text-center py-2 px-4 text-gray-400">Admin</th>
                      <th className="text-center py-2 px-4 text-gray-400">Probation Officer</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[
                      ['View all clients', true, false],
                      ['View own referred clients', true, true],
                      ['Add/Edit clients', true, false],
                      ['Mark attendance', true, false],
                      ['Record payments', true, false],
                      ['Generate letters', true, false],
                      ['Download letters', true, true],
                      ['Upload documents', true, true],
                      ['View reports', true, false],
                      ['Manage users', true, false],
                    ].map(([perm, admin, po], i) => (
                      <tr key={i} className="border-b border-navy-700/50">
                        <td className="py-2 px-4 text-gray-300">{perm}</td>
                        <td className="py-2 px-4 text-center">
                          {admin ? <span className="text-brand-green">✓</span> : <span className="text-red-400">✗</span>}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {po ? <span className="text-brand-green">✓</span> : <span className="text-red-400">✗</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>
        )}

        {/* Summary Stats */}
        <div className="mt-12 grid sm:grid-cols-4 gap-4">
          <div className="bg-navy-800 rounded-xl p-6 text-center border border-navy-700">
            <div className="text-3xl font-bold text-brand-blue">11</div>
            <div className="text-gray-400 text-sm">Pages</div>
          </div>
          <div className="bg-navy-800 rounded-xl p-6 text-center border border-navy-700">
            <div className="text-3xl font-bold text-brand-green">7</div>
            <div className="text-gray-400 text-sm">Database Tables</div>
          </div>
          <div className="bg-navy-800 rounded-xl p-6 text-center border border-navy-700">
            <div className="text-3xl font-bold text-brand-orange">5</div>
            <div className="text-gray-400 text-sm">Integrations</div>
          </div>
          <div className="bg-navy-800 rounded-xl p-6 text-center border border-navy-700">
            <div className="text-3xl font-bold text-brand-yellow">2</div>
            <div className="text-gray-400 text-sm">User Roles</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-700 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          EC DUI School Client Support Services Portal — Architecture Planning Document
        </div>
      </footer>
    </div>
  )
}
