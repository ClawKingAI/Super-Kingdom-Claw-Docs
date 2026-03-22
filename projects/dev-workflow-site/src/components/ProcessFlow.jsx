export default function ProcessFlow() {
  const steps = [
    { num: '1', title: 'Client Intake', time: '1-4 hrs', desc: 'Discovery conversation, understand your vision and goals' },
    { num: '2', title: 'Requirements', time: '1-4 hrs', desc: 'Structured spec doc, user flows, technical needs' },
    { num: '3', title: 'Prompt Engineering', time: '30 min', desc: 'Optimized design prompts, 2-3 creative variants' },
    { num: '4', title: 'Agent Generation', time: '5-15 min', desc: 'Working prototype with live URL' },
    { num: '5', title: 'Review & Iterate', time: '1-5 days', desc: 'Refine on live site until perfect' },
    { num: '6', title: 'Deployment', time: '15 min', desc: 'Instant live URL on global CDN' },
    { num: '7', title: 'Handoff', time: '1 hr', desc: 'Full code ownership, docs, credentials' },
  ]

  return (
    <section id="process" className="py-20 bg-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            The 7-Stage Process
          </h2>
          <p className="text-steel-300 max-w-2xl mx-auto">
            A streamlined workflow designed for speed, quality, and your full control at every stage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {steps.slice(0, 4).map((step) => (
            <div key={step.num} className="bg-navy-900 rounded-xl p-6 border border-navy-700 hover:border-water-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-water-500/20 rounded-lg flex items-center justify-center text-water-400 font-bold">
                  {step.num}
                </div>
                <div className="text-steel-400 text-sm">{step.time}</div>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-steel-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.slice(4).map((step) => (
            <div key={step.num} className="bg-navy-900 rounded-xl p-6 border border-navy-700 hover:border-water-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-water-500/20 rounded-lg flex items-center justify-center text-water-400 font-bold">
                  {step.num}
                </div>
                <div className="text-steel-400 text-sm">{step.time}</div>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-steel-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
