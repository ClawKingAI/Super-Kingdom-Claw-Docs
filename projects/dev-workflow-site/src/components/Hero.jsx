export default function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 pt-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-water-500/10 border border-water-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-water-400 text-sm font-medium">From Idea to Live App</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Your Vision →{' '}
            <span className="gradient-text">Live Application</span>
            <br />
            in Days, Not Weeks
          </h1>

          <p className="text-xl text-steel-300 mb-8 max-w-2xl mx-auto">
            AI-powered development workflow transforms your ideas into production-ready web applications. Working prototypes from Day 1. Full code ownership. No vendor lock-in.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#process"
              className="bg-water-500 hover:bg-water-600 text-white text-lg font-semibold px-8 py-4 rounded-lg transition-all hover:scale-105"
            >
              See How It Works
            </a>
            <a
              href="#timeline"
              className="border-2 border-steel-500 hover:border-water-500 text-white text-lg font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              View Timeline
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-navy-700">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-water-400">2-5</div>
              <div className="text-steel-400 text-sm mt-1">Days Total</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-water-400">24h</div>
              <div className="text-steel-400 text-sm mt-1">First Prototype</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-water-400">100%</div>
              <div className="text-steel-400 text-sm mt-1">Code Ownership</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
