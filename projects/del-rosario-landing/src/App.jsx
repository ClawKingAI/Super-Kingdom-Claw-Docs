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
      q: "What is pastoral counseling?",
      a: "Pastoral counseling combines professional counseling techniques with spiritual guidance. It's faith-based support that addresses emotional, mental, and spiritual needs together."
    },
    {
      q: "Do I need to be religious to benefit?",
      a: "No. While pastoral counseling is grounded in faith, it helps anyone seeking guidance, healing, or support—regardless of their spiritual background."
    },
    {
      q: "What issues can pastoral counseling help with?",
      a: "Marriage and family challenges, grief and loss, anxiety and depression, spiritual struggles, life transitions, and personal growth."
    },
    {
      q: "Is counseling confidential?",
      a: "Yes. All counseling sessions are confidential within the bounds of professional ethics and legal requirements."
    }
  ]

  return (
    <div className="min-h-screen bg-navy-900 text-white font-sans">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-navy-800/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                <span className="text-navy-900 font-serif font-bold text-lg">D</span>
              </div>
              <span className="font-serif text-xl font-semibold hidden sm:block">Dr. Del Rosario</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">About</a>
              <a href="#services" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Services</a>
              <a href="#approach" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">Approach</a>
              <a href="#faq" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">FAQ</a>
            </nav>
            <a
              href="#contact"
              className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Book a Session
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-gold-400 text-sm font-medium">Pastoral Counseling & Spiritual Guidance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              Faith-Based Healing{' '}
              <span className="text-gold-400">
                for Life's Challenges
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Professional pastoral counseling that integrates spiritual wisdom with compassionate care. 
              Find peace, clarity, and healing through faith-centered guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="bg-gold-500 hover:bg-gold-600 text-navy-900 text-lg font-semibold px-8 py-4 rounded-lg transition-all text-center"
              >
                Schedule a Consultation
              </a>
              <a
                href="#services"
                className="border-2 border-gray-600 hover:border-gold-400 text-white text-lg font-semibold px-8 py-4 rounded-lg transition-colors text-center"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-navy-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
                About Dr. Del Rosario
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                With years of experience in pastoral ministry and counseling, Dr. Del Rosario provides 
                compassionate, faith-based support for individuals, couples, and families navigating 
                life's most challenging moments.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Combining professional counseling techniques with deep spiritual insight, 
                the approach honors both faith and emotional wellbeing—helping you find 
                healing that addresses the whole person.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-navy-700 text-gold-400 px-4 py-2 rounded-full text-sm">Pastoral Counseling</span>
                <span className="bg-navy-700 text-gold-400 px-4 py-2 rounded-full text-sm">Spiritual Direction</span>
                <span className="bg-navy-700 text-gold-400 px-4 py-2 rounded-full text-sm">Faith-Based Support</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gold-400/10 to-gold-600/5 rounded-2xl p-8 border border-gold-400/20">
              <blockquote className="text-xl font-serif text-gray-200 italic mb-4">
                "Faith is not the absence of struggle—it's the presence of trust in the midst of it."
              </blockquote>
              <p className="text-gold-400 text-sm font-medium">— Dr. Del Rosario</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-navy-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Counseling Services
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive pastoral counseling services tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Marriage & Family",
                desc: "Couples counseling, family conflict resolution, and relationship restoration through faith-based principles."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                ),
                title: "Grief & Loss",
                desc: "Compassionate support through the grieving process with spiritual comfort and practical guidance."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Spiritual Guidance",
                desc: "Direction for spiritual growth, faith struggles, and deepening your relationship with God."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Anxiety & Depression",
                desc: "Faith-integrated support for mental health challenges, combining counseling with spiritual practices."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                title: "Life Transitions",
                desc: "Guidance through major life changes—career shifts, retirement, relocation, and new chapters."
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: "Personal Growth",
                desc: "Self-discovery, purpose clarification, and becoming the person you were created to be."
              }
            ].map((service, i) => (
              <div key={i} className="bg-navy-800 rounded-xl p-6 border border-navy-700 hover:border-gold-400/30 transition-colors">
                <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center text-gold-400 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section id="approach" className="py-24 bg-navy-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              The Approach
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Integrating professional counseling with timeless spiritual wisdom
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Listen Deeply",
                desc: "Every session begins with understanding your story, struggles, and hopes—without judgment."
              },
              {
                num: "02",
                title: "Counsel Wisely",
                desc: "Drawing from professional techniques and spiritual wisdom to address root causes, not just symptoms."
              },
              {
                num: "03",
                title: "Guide Gently",
                desc: "Supporting your journey toward healing and growth at your pace, honoring your faith and values."
              }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-navy-900 font-bold text-xl mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-navy-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-navy-700/50 transition-colors"
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

      {/* Contact */}
      <section id="contact" className="py-24 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-gold-400/10 to-gold-600/5 rounded-2xl p-12 border border-gold-400/20">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Ready to Begin?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Take the first step toward healing and growth. Schedule a confidential consultation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="https://www.facebook.com/share/1Q7FDd6SxK/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold-500 hover:bg-gold-600 text-navy-900 text-lg font-semibold px-8 py-4 rounded-lg transition-all inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Connect on Facebook
              </a>
            </div>

            <p className="text-gray-400 text-sm">
              All inquiries are confidential. Your journey to healing starts here.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 border-t border-navy-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                <span className="text-navy-900 font-serif font-bold text-sm">D</span>
              </div>
              <span className="font-serif">Dr. Del Rosario</span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2026 Dr. Del Rosario. Pastoral Counseling & Spiritual Guidance.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
