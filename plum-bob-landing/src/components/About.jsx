export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-water-600/10 text-water-600 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              About Us
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-800 mb-6">
              Locally Owned & Operated
            </h2>
            
            <div className="prose prose-lg text-steel-600 mb-6">
              <p>
                Plum Bob – Septic, Sewer and Water Services LLC is locally owned and operated by Bobby Bertholf. 
                Our mission is simple: provide honest, dependable plumbing and septic services with the 
                professionalism homeowners deserve.
              </p>
              <p>
                Whether you need sewer repair, septic work, or water line troubleshooting, we approach 
                every job with integrity and precision. We treat your home like it's our own.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-water-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-navy-800">Licensed & Insured</div>
                  <div className="text-sm text-steel-500">Full coverage for your peace of mind</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-water-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-navy-800">Years of Experience</div>
                  <div className="text-sm text-steel-500">Trusted by local homeowners</div>
                </div>
              </div>
            </div>
            
            <a 
              href="tel:470-215-4009"
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Bobby: 470-215-4009
            </a>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-navy-800 to-navy-600 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                  BB
                </div>
                <div>
                  <h3 className="text-xl font-bold">Bobby Bertholf</h3>
                  <p className="text-water-300">Founder & CEO</p>
                </div>
              </div>
              
              <blockquote className="text-lg italic text-white/90 mb-6">
                "We believe in treating every customer like family. That means showing up on time, 
                being honest about what needs to be done, and doing quality work at a fair price."
              </blockquote>
              
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Senoia, GA
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  bbertholf12@icloud.com
                </span>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-water-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-water-600/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
