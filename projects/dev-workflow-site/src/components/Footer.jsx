export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-navy-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-water-400 to-water-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-bold">Agent-Powered Development</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#process" className="text-steel-400 hover:text-white transition-colors">Process</a>
            <a href="#stages" className="text-steel-400 hover:text-white transition-colors">Stages</a>
            <a href="#timeline" className="text-steel-400 hover:text-white transition-colors">Timeline</a>
            <a href="#faq" className="text-steel-400 hover:text-white transition-colors">FAQ</a>
            <a href="#cta" className="text-steel-400 hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="text-steel-500 text-sm">
            © 2026 Agent Dev Workflow
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-navy-800 text-center">
          <p className="text-steel-500 text-sm">
            Professional web applications at AI speed, with human oversight at every stage.
          </p>
        </div>
      </div>
    </footer>
  )
}
