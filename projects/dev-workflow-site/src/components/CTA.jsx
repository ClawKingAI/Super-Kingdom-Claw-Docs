export default function CTA() {
  return (
    <section id="cta" className="py-20 bg-gradient-to-br from-navy-800 to-navy-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-water-500/10 to-water-600/5 rounded-2xl p-12 border border-water-500/30">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Start Your Project
          </h2>
          <p className="text-xl text-steel-300 mb-8 max-w-2xl mx-auto">
            One discovery call → Live prototype within 24 hours.
            <br />
            <span className="text-water-400">No commitment required.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="mailto:hello@example.com"
              className="bg-water-500 hover:bg-water-600 text-white text-lg font-semibold px-8 py-4 rounded-lg transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get in Touch
            </a>
          </div>

          <p className="text-steel-400 text-sm">
            See your idea working before deciding to proceed.
            <br />
            No technical jargon. No sales pressure.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-12 h-12 bg-navy-700 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-water-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-white font-semibold">30-Min Call</div>
            <div className="text-steel-400 text-sm">Discovery conversation</div>
          </div>
          <div>
            <div className="w-12 h-12 bg-navy-700 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-water-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-white font-semibold">Brief in 24h</div>
            <div className="text-steel-400 text-sm">Project brief delivered</div>
          </div>
          <div>
            <div className="w-12 h-12 bg-navy-700 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-water-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-white font-semibold">Fast Build</div>
            <div className="text-steel-400 text-sm">Working prototype fast</div>
          </div>
        </div>
      </div>
    </section>
  )
}
