const services = [
  {
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Septic System Services",
    items: [
      "Septic inspections",
      "Septic repairs",
      "Drain field troubleshooting"
    ],
    color: "water"
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: "Sewer Services",
    items: [
      "Sewer line diagnostics",
      "Sewer repairs",
      "Blockage clearing"
    ],
    color: "navy"
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    title: "Water Line Services",
    items: [
      "Water line repair",
      "Leak detection",
      "Pressure issues"
    ],
    color: "steel"
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    title: "Emergency Plumbing",
    items: [
      "Urgent plumbing issues",
      "Burst pipes",
      "Drain emergencies"
    ],
    color: "red"
  }
]

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-800 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-steel-500 max-w-2xl mx-auto">
            Comprehensive plumbing, septic, sewer, and water solutions for your home or business
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="card group hover:border-water-200"
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                service.color === 'water' ? 'bg-water-600/10 text-water-600 group-hover:bg-water-600 group-hover:text-white' :
                service.color === 'navy' ? 'bg-navy-600/10 text-navy-600 group-hover:bg-navy-600 group-hover:text-white' :
                service.color === 'steel' ? 'bg-steel-500/10 text-steel-600 group-hover:bg-steel-600 group-hover:text-white' :
                'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white'
              }`}>
                {service.icon}
              </div>
              <h3 className="font-semibold text-lg text-navy-800 mb-4">
                {service.title}
              </h3>
              <ul className="space-y-2">
                {service.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-steel-600">
                    <svg className="w-4 h-4 text-water-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="tel:470-215-4009"
            className="inline-flex items-center gap-2 text-water-600 font-semibold hover:text-water-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call 470-215-4009 for a free estimate
          </a>
        </div>
      </div>
    </section>
  )
}
