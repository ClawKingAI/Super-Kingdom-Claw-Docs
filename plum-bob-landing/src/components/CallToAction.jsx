export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="1" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-red-500 text-white rounded-full px-4 py-2 text-sm font-semibold mb-8">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          24/7 Emergency Service Available
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Need Plumbing or Septic Help Today?
        </h2>
        
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Don't wait — small problems become big ones fast. Call now for fast, reliable service.
        </p>
        
        <a 
          href="tel:470-215-4009"
          className="inline-flex items-center gap-3 bg-water-600 hover:bg-water-700 text-white font-bold text-xl py-5 px-10 rounded-xl transition-all shadow-2xl hover:shadow-water-600/30 transform hover:-translate-y-1"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call 470-215-4009
        </a>
        
        <p className="mt-6 text-gray-400 text-sm">
          Free estimates • No obligation • We answer the phone
        </p>
      </div>
    </section>
  )
}
