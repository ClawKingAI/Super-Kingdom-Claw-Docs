import { useState } from 'react'

export default function Stages() {
  const [activeStage, setActiveStage] = useState(0)

  const stages = [
    {
      title: 'Client Intake',
      duration: '1-4 hours',
      whatHappens: 'Discovery conversation to understand your business, target audience, and project goals. We identify must-have features vs. nice-to-haves and clarify technical constraints.',
      youProvide: 'Business context, target audience, core features, brand assets (if any), reference sites, timeline/budget considerations.',
      deliverable: 'Project Brief — A structured document capturing scope, goals, constraints, and success metrics.',
    },
    {
      title: 'Requirements Gathering',
      duration: '1-4 hours',
      whatHappens: 'Agent analyzes your brief, identifies gaps, asks structured clarification questions in a single batch. User journeys mapped for critical flows.',
      youProvide: 'Answers to clarification questions about user goals, CTAs, integrations, device support, success metrics.',
      deliverable: 'Requirements Specification — Detailed feature list, user flows, and technical requirements.',
    },
    {
      title: 'Prompt Engineering',
      duration: '30 min',
      whatHappens: 'We craft optimized prompts that describe purpose and feel, not pixel-level implementation. This allows AI design intelligence to shine.',
      youProvide: 'Review and approve design prompts.',
      deliverable: 'Design Prompts — Optimized descriptions ready for AI generation, often with 2-3 creative variants.',
    },
    {
      title: 'Agent Generation',
      duration: '5-15 min',
      whatHappens: 'AI generates functional application code from design prompts. Built-in database, user authentication, editable code you own, live preview URL.',
      youProvide: 'Wait (or watch progress).',
      deliverable: 'Working Prototype — Functional application running in an editable playground environment.',
    },
    {
      title: 'Review Iterations',
      duration: '1-5 days',
      whatHappens: 'You interact with the working prototype at a live URL. Document changes, fixes, enhancements. Agent implements adjustments. Repeat until satisfied.',
      youProvide: 'Feedback on visuals, content, layout, functionality, mobile responsiveness.',
      deliverable: 'Refined Application — Polished, approved version ready for deployment.',
    },
    {
      title: 'Deployment',
      duration: '15-30 min',
      whatHappens: 'Application compiled and optimized. Files transferred to global CDN. Site activated and URL generated. Immediately accessible worldwide.',
      youProvide: 'Receive live URL.',
      deliverable: 'Live Application — Production URL shareable with stakeholders.',
    },
    {
      title: 'Handoff',
      duration: '1 hour',
      whatHappens: 'Transfer complete source code, all assets, configuration files, build scripts. Documentation and access credentials provided.',
      youProvide: 'Receive materials.',
      deliverable: 'Complete Project Package — Code, documentation, and credentials for independent ownership.',
    },
  ]

  return (
    <section id="stages" className="py-20 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Stage Details
          </h2>
          <p className="text-steel-300 max-w-2xl mx-auto">
            Deep dive into what happens at each stage of the workflow.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {stages.map((stage, i) => (
            <button
              key={i}
              onClick={() => setActiveStage(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeStage === i
                  ? 'bg-water-500 text-white'
                  : 'bg-navy-800 text-steel-300 hover:bg-navy-700'
              }`}
            >
              {i + 1}. {stage.title}
            </button>
          ))}
        </div>

        <div className="bg-navy-800 rounded-2xl p-8 border border-navy-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-water-500/20 rounded-xl flex items-center justify-center text-water-400 font-bold text-xl">
              {activeStage + 1}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{stages[activeStage].title}</h3>
              <p className="text-steel-400 text-sm">{stages[activeStage].duration}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-water-400 font-medium mb-2">What Happens</h4>
              <p className="text-steel-300 mb-4">{stages[activeStage].whatHappens}</p>

              <h4 className="text-water-400 font-medium mb-2">What You Provide</h4>
              <p className="text-steel-300">{stages[activeStage].youProvide}</p>
            </div>

            <div className="bg-navy-900 rounded-xl p-6 border border-water-500/20">
              <h4 className="text-water-400 font-medium mb-2">Deliverable</h4>
              <p className="text-white">{stages[activeStage].deliverable}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
