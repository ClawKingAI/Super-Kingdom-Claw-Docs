import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import ClientDetail from './pages/ClientDetail'
import Attendance from './pages/Attendance'
import Payments from './pages/Payments'
import Documents from './pages/Documents'
import Letters from './pages/Letters'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Login from './pages/Login'

// Mock data for prototype
export const mockClients = [
  { id: '1', name: 'John Smith', phone: '(770) 555-0101', email: 'john.smith@email.com', program: 'FVIP', status: 'active', startDate: '2026-02-15', referralSource: 'Probation', county: 'Coweta', balance: 150 },
  { id: '2', name: 'Sarah Johnson', phone: '(770) 555-0102', email: 'sarah.j@email.com', program: 'Risk Reduction', status: 'active', startDate: '2026-03-01', referralSource: 'State Court', county: 'Fayette', balance: 0 },
  { id: '3', name: 'Michael Davis', phone: '(770) 555-0103', email: 'mdavis@email.com', program: 'Anger Management', status: 'active', startDate: '2026-02-20', referralSource: 'DFACS', county: 'Coweta', balance: 75 },
  { id: '4', name: 'Emily Brown', phone: '(770) 555-0104', email: 'ebrown@email.com', program: 'Parenting Class', status: 'completed', startDate: '2025-12-01', endDate: '2026-02-15', referralSource: 'Attorney', county: 'Meriwether', balance: 0 },
  { id: '5', name: 'Robert Wilson', phone: '(770) 555-0105', email: 'rwilson@email.com', program: 'FVIP', status: 'terminated', startDate: '2026-01-10', endDate: '2026-02-28', referralSource: 'Probation', county: 'Coweta', balance: 200 },
]

export const mockAttendance = [
  { clientId: '1', date: '2026-03-18', status: 'present' },
  { clientId: '1', date: '2026-03-17', status: 'present' },
  { clientId: '1', date: '2026-03-16', status: 'late' },
  { clientId: '1', date: '2026-03-15', status: 'present' },
  { clientId: '1', date: '2026-03-14', status: 'absent' },
  { clientId: '2', date: '2026-03-18', status: 'present' },
  { clientId: '2', date: '2026-03-17', status: 'present' },
]

export const mockPayments = [
  { id: '1', clientId: '1', amount: 100, date: '2026-03-15', method: 'Card', authId: '12A008GUFH1K' },
  { id: '2', clientId: '1', amount: 50, date: '2026-03-01', method: 'Cash', authId: null },
  { id: '3', clientId: '2', amount: 295, date: '2026-03-01', method: 'Card', authId: '12B009HVFI2L' },
  { id: '4', clientId: '3', amount: 75, date: '2026-03-10', method: 'Money Order', authId: null },
]

export const programs = [
  { id: '1', name: 'FVIP', fullName: 'Family Violence Intervention Program', fee: 295, sessions: 24 },
  { id: '2', name: 'Anger Management', fullName: 'Anger Management Program', fee: 150, sessions: 12 },
  { id: '3', name: 'Risk Reduction', fullName: 'DUI Risk Reduction Program', fee: 295, sessions: 20 },
  { id: '4', name: 'Driver Improvement', fullName: 'Driver Improvement Course', fee: 95, sessions: 6 },
  { id: '5', name: 'Victim Impact Panel', fullName: 'Victim Impact Panel', fee: 50, sessions: 1 },
  { id: '6', name: 'Parenting Class', fullName: 'Parenting Class', fee: 125, sessions: 8 },
  { id: '7', name: 'Shoplifting Class', fullName: 'Shoplifting Prevention Class', fee: 75, sessions: 4 },
  { id: '8', name: '420-Marijuana', fullName: '420-Marijuana Risk Reduction', fee: 150, sessions: 8 },
]

export const referralSources = [
  'Probation', 'Parole', 'Pretrial Diversion', 'Pretrial Intervention',
  'State Court', 'Superior Court', 'Accountability Court', 'DFACS',
  'Attorney', 'Self-Referred', 'Other Referral Source', 'Out-of-State'
]

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedClient, setSelectedClient] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />
  }

  const renderPage = () => {
    if (selectedClient) {
      return <ClientDetail client={selectedClient} onBack={() => setSelectedClient(null)} />
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} onSelectClient={setSelectedClient} />
      case 'clients':
        return <Clients onSelectClient={setSelectedClient} />
      case 'attendance':
        return <Attendance onSelectClient={setSelectedClient} />
      case 'payments':
        return <Payments />
      case 'documents':
        return <Documents />
      case 'letters':
        return <Letters />
      case 'reports':
        return <Reports />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard onNavigate={setCurrentPage} onSelectClient={setSelectedClient} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={() => setIsLoggedIn(false)}
      />
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
