export default function SpeedComparison() {
  const comparisons = [
    { traditional: '4-12 weeks', agent: '2-5 days', label: 'Total Timeline' },
    { traditional: 'Multiple meetings', agent: '1 discovery call', label: 'Initial Meetings' },
    { traditional: 'Mockups first', agent: 'Working prototype', label: 'First Deliverable' },
    { traditional: 'Days per revision', agent: 'Hours per revision', label: 'Iteration Speed' },
    { traditional: 'Vendor dependency', agent: 'You own everything', label: 'Code Ownership' },
  ]

  return (
    <section className="py-20 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Speed Comparison
          </h2>
          <p className="text-steel-300 max-w-2xl mx-auto">
            See the difference agent-powered development makes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Traditional */}
          <div className="bg-navy-800 rounded-2xl p-8 border border-navy-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Traditional Development</h3>
            </div>
            <ul className="space-y-4">
              {comparisons.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <div>
                    <span className="text-steel-300">{item.traditional}</span>
                    <span className="text-steel-500 text-sm ml-2">({item.label})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Agent-Powered */}
          <div className="bg-gradient-to-br from-water-500/10 to-water-600/5 rounded-2xl p-8 border border-water-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-water-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-water-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Agent-Powered Workflow</h3>
            </div>
            <ul className="space-y-4">
              {comparisons.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-water-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{item.agent}</span>
                    <span className="text-steel-400 text-sm ml-2">({item.label})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
