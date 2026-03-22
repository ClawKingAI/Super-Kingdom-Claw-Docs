export default function Header({ onToggleSidebar, sidebarOpen }) {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 sticky top-0 z-30">
      <button
        onClick={onToggleSidebar}
        className="p-2 hover:bg-slate-100 rounded-lg mr-4"
      >
        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M4 6h16M4 12h16M4 18h16'} />
        </svg>
      </button>

      <div className="flex-1">
        <h1 className="text-lg font-semibold text-slate-800">
          EC DUI School Client Support Services Portal
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-100 rounded-lg relative">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-orange rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
            A
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-slate-700">Admin</div>
            <div className="text-xs text-slate-500">admin@ecdui.com</div>
          </div>
        </div>
      </div>
    </header>
  )
}
