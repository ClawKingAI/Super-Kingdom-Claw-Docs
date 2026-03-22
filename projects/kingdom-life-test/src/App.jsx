import { useState, useEffect } from 'react'

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const faqs = [
    {
      q: "Is this for everyone?",
      a: "This is for believers who know there's more. If you've felt stuck in religious routine, hungry for real power, or wondering why the church you see doesn't match what you read in Scripture—this is for you."
    },
    {
      q: "Do I need to leave my church?",
      a: "No. This isn't about leaving—it's about becoming. Whether you stay, go, or gather differently, the goal is walking in your true calling, not burning bridges."
    },
    {
      q: "What if I'm just starting my faith journey?",
      a: "Perfect. You're not unlearning decades of tradition. You'll get the real thing from day one—the Kingdom as Jesus intended, not the version institutions built."
    },
    {
      q: "What happens after I join?",
      a: "You'll get immediate access to our community, live teachings, and resources that meet you where you are. No gatekeeping. No bait-and-switch. Just truth."
    }
  ]

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-dark-800/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center font-serif font-bold text-dark-900">
                K
              </div>
              <span className="font-semibold text-lg hidden sm:block">Kingdom Life</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#difference" className="text-gray-400 hover:text-white transition-colors text-sm">The Difference</a>
              <a href="#journey" className="text-gray-400 hover:text-white transition-colors text-sm">Your Journey</a>
              <a href="#faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</a>
            </nav>
            <a
              href="#cta"
              className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-dark-900 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              Start Your Journey
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-crimson-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-gold-400 text-sm font-medium">The Church Is Being Restored</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              You Were Made for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                More Than This
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Something's missing. You feel it in your spirit—the gap between what you read in Scripture and what you see in church. The power. The authority. The real Kingdom Jesus promised.
            </p>

            <p className="text-lg text-gray-300 mb-8">
              That's not a coincidence. And you're not alone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#cta"
                className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-dark-900 text-lg font-semibold px-8 py-4 rounded-lg transition-all text-center"
              >
                Discover Your Calling
              </a>
              <a
                href="#difference"
                className="border-2 border-gray-600 hover:border-gold-400 text-white text-lg font-semibold px-8 py-4 rounded-lg transition-colors text-center"
              >
                See What's Different
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Happened to the Power?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              For centuries, the church drifted. Programs replaced presence. Buildings replaced bodies. Tradition replaced transformation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "The Power Was Lost",
                desc: "Healings, deliverance, prophecy—these weren't stories. They were normal. Then they became dangerous. Then they disappeared."
              },
              {
                title: "The Authority Was Stripped",
                desc: "You were designed to walk as a son or daughter, not sit as a spectator. The priesthood of all believers became a nice idea, not a lived reality."
              },
              {
                title: "The Kingdom Became a Building",
                desc: "Jesus built people. Man built institutions. The ekklesia—a governing body of believers—became a weekly event."
              }
            ].map((item, i) => (
              <div key={i} className="bg-dark-900 rounded-2xl p-8 border border-dark-700">
                <div className="w-12 h-12 bg-crimson-500/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-crimson-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Difference */}
      <section id="difference" className="py-24 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-gold-400 text-sm font-medium">God Is Moving Now</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              The Restoration Has Already Begun
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              What was stripped is being restored. What was lost is being found. The real Church—built on apostles, prophets, evangelists, pastors, and teachers—is rising.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div className="space-y-6">
              {[
                "Step into the baptism of the Holy Spirit—not as theory, but as reality",
                "Discover your spiritual gifts and learn to use them with confidence",
                "Understand your true identity as a Kingdom citizen, not just a church member",
                "Connect with others who are walking this path—because you weren't meant to do this alone"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gold-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-300">{item}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-gold-400/10 to-gold-600/5 rounded-2xl p-8 border border-gold-400/20">
              <h3 className="text-2xl font-bold mb-4">This Isn't New Teaching</h3>
              <p className="text-gray-300 mb-4">
                This is what the early church had. What Jesus commissioned. What Scripture promises.
              </p>
              <p className="text-gray-400 text-sm">
                We're not inventing—we're remembering. Not adding—we're returning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section id="journey" className="py-24 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Your Path Forward
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              This isn't a program you complete. It's a life you step into.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "1",
                title: "Awaken",
                desc: "See what was lost. Understand what God is restoring. Get the full picture of what the Kingdom is supposed to look like.",
                cta: "Free Training"
              },
              {
                num: "2",
                title: "Activate",
                desc: "Discover your gifts. Step into the baptism of the Holy Spirit. Learn to hear God's voice and move in His authority.",
                cta: "1-on-1 Coaching"
              },
              {
                num: "3",
                title: "Advance",
                desc: "Walk in daily Kingdom power. Lead others into freedom. Build the real Church in your sphere of influence.",
                cta: "Community Access"
              }
            ].map((step, i) => (
              <div key={i} className="bg-dark-900 rounded-2xl p-8 border border-dark-700 hover:border-gold-400/30 transition-colors relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center text-dark-900 font-bold text-xl">
                  {step.num}
                </div>
                <div className="pt-4">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400 mb-4">{step.desc}</p>
                  <span className="text-gold-400 text-sm font-medium">{step.cta} →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-dark-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Questions You Might Have
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-dark-700/50 transition-colors"
                >
                  <span className="font-medium">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-gold-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-400">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-24 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-gold-400/10 to-gold-600/5 rounded-2xl p-12 border border-gold-400/20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              You're Not Here by Accident
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The hunger you feel? That's not you being difficult. That's the Spirit calling you deeper. The question isn't whether you're ready—it's whether you'll answer.
            </p>

            <a
              href="https://kingdomlife.site/five_fold"
              className="inline-block bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-dark-900 text-lg font-semibold px-8 py-4 rounded-lg transition-all"
            >
              Start with the Free Training
            </a>

            <p className="mt-6 text-gray-500 text-sm">
              No credit card. No catch. Just truth.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 border-t border-dark-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center font-serif font-bold text-dark-900">
                K
              </div>
              <span className="font-semibold">Kingdom Life Ascension</span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2026 Kingdom Life. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
