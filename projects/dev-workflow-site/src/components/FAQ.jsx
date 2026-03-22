import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      q: 'Do I need technical knowledge?',
      a: 'No. We handle all technical aspects. You provide business context and feedback. The agent translates your requirements into working code.',
    },
    {
      q: 'What if I don\'t like the initial designs?',
      a: 'We generate multiple variants and iterate until you\'re satisfied. No surprises — you see exactly what you\'re getting before finalizing.',
    },
    {
      q: 'Can I make changes after deployment?',
      a: 'Yes. You own the code and can modify it yourself, or engage us for additional development cycles.',
    },
    {
      q: 'What technologies do you use?',
      a: 'Modern, industry-standard stack: React, TailwindCSS, Vite. Compatible with any hosting platform.',
    },
    {
      q: 'Is my data secure?',
      a: 'All deployments use HTTPS globally. For sensitive applications, we can deploy to your preferred secure infrastructure.',
    },
    {
      q: 'What if I need custom features?',
      a: 'The workflow adapts to your needs. Complex integrations, custom backends, and specialized features are handled case-by-case.',
    },
    {
      q: 'How does payment work?',
      a: 'Contact us for project-based pricing. Discovery call and initial prototype review are commitment-free.',
    },
  ]

  return (
    <section id="faq" className="py-20 bg-navy-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-navy-900 rounded-xl border border-navy-700 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-navy-800/50 transition-colors"
              >
                <span className="text-white font-medium">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-steel-400 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4">
                  <p className="text-steel-300">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
