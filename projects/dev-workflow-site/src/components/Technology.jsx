export default function Technology() {
  const tech = [
    { label: 'Frontend', value: 'React + TailwindCSS' },
    { label: 'Build Tool', value: 'Vite' },
    { label: 'Hosting', value: 'here.now (global CDN)' },
    { label: 'Output', value: 'Production-ready code' },
  ]

  return (
    <section className="py-20 bg-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Technology Stack
          </h2>
          <p className="text-steel-300 max-w-2xl mx-auto">
            Modern, industry-standard, and portable to any hosting platform.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {tech.map((item) => (
            <div key={item.label} className="bg-navy-900 rounded-xl p-6 text-center border border-navy-700">
              <div className="text-steel-400 text-sm mb-2">{item.label}</div>
              <div className="text-white font-semibold">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-steel-400 text-sm max-w-xl mx-auto">
            All code is production-ready React with TailwindCSS styling. Deploy to here.now, Vercel, Netlify, or your own infrastructure. You own everything.
          </p>
        </div>
      </div>
    </section>
  )
}
