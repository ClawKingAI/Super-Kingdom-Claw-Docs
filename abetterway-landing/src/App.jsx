import React from 'react'
import { useState, useEffect } from 'react'
import { 
  Menu, X, Phone, Mail, MapPin, ChevronRight, 
  Quote, Heart, Briefcase, Users, ArrowRight,
  Youtube, Facebook, Instagram, Check, Clock,
  Award, Target, Lightbulb
} from 'lucide-react'

// Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Program', href: '#program' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Staff', href: '#staff' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="#" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-forest-green-600 to-forest-green-700 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">ABW</span>
            </div>
            <div className={`hidden sm:block transition-colors ${scrolled ? 'text-warm-brown-800' : 'text-warm-brown-800'}`}>
              <span className="font-serif font-bold text-xl">A Better Way</span>
              <span className="block text-xs text-warm-brown-600 -mt-1">Ministries</span>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-medium transition-colors hover:text-forest-green-600 ${
                  scrolled ? 'text-warm-brown-700' : 'text-warm-brown-700'
                }`}
              >
                {link.name}
              </a>
            ))}
            <a href="#apply" className="btn-primary text-sm px-6 py-3">
              Apply Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6 text-warm-brown-800" /> : <Menu className="w-6 h-6 text-warm-brown-800" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-xl mt-2 p-4 absolute w-[calc(100%-2rem)] left-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-3 px-4 text-warm-brown-700 hover:bg-warm-brown-50 rounded-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a href="#apply" className="btn-primary w-full text-center mt-4">
              Apply Now
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-forest-green-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-golden-100 rounded-full opacity-20 blur-3xl"></div>
      </div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23428a42' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-forest-green-50 border border-forest-green-200 rounded-full mb-6">
              <Heart className="w-4 h-4 text-forest-green-600 mr-2" />
              <span className="text-sm font-medium text-forest-green-700">Faith-Based Recovery & Discipleship</span>
            </div>
            
            <h1 className="heading-primary mb-6">
              Restoring Lives Through
              <span className="block text-forest-green-600 mt-2">Faith, Purpose & Work</span>
            </h1>
            
            <p className="text-body mb-8 max-w-xl mx-auto lg:mx-0">
              An 18-month residential transformation program for men seeking freedom from life-controlling issues. 
              Experience spiritual renewal alongside practical skill development for lasting change.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#apply" className="btn-primary group">
                Begin Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#about" className="btn-secondary">
                Learn More
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 text-warm-brown-500">
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-golden-500" />
                <span className="text-sm font-medium">GNPEC Recognized</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2 text-forest-green-500" />
                <span className="text-sm font-medium">20+ Years Serving</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Main Image Container */}
              <div className="bg-gradient-to-br from-forest-green-600 to-forest-green-700 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/20 rounded-xl p-6 text-center">
                      <Users className="w-10 h-10 text-white mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white">3,500+</div>
                      <div className="text-white/80 text-sm">Lives Transformed</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-6 text-center">
                      <Clock className="w-10 h-10 text-white mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white">18</div>
                      <div className="text-white/80 text-sm">Months Program</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-6 text-center">
                      <Award className="w-10 h-10 text-white mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white">13</div>
                      <div className="text-white/80 text-sm">Certificate Programs</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-6 text-center">
                      <Heart className="w-10 h-10 text-white mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white">20+</div>
                      <div className="text-white/80 text-sm">Years of Ministry</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-golden-400 rounded-2xl opacity-20 rotate-12"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-forest-green-300 rounded-2xl opacity-20 -rotate-12"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-warm-brown-300 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-warm-brown-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

// Stats Bar
const StatsBar = () => {
  const stats = [
    { number: '20+', label: 'Years of Ministry', icon: Clock },
    { number: '3,500+', label: 'Lives Transformed', icon: Heart },
    { number: '13', label: 'Vocational Programs', icon: Briefcase },
    { number: '100%', label: 'Faith-Centered', icon: Target },
  ]

  return (
    <section className="bg-forest-green-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-forest-green-800 to-forest-green-600"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-8 h-8 text-golden-400 mx-auto mb-3" />
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-forest-green-200 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// About Section
const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-golden-100 text-golden-700 rounded-full text-sm font-medium mb-4">
            Our Mission
          </span>
          <h2 className="heading-secondary mb-6">
            Faith-Based Recovery & Discipleship
          </h2>
          <p className="text-body max-w-3xl mx-auto">
            At A Better Way Ministries, we believe lasting transformation comes through the powerful 
            combination of spiritual renewal and practical skill development.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group bg-gradient-to-br from-warm-brown-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-warm-brown-100">
            <div className="w-16 h-16 bg-forest-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-8 h-8 text-forest-green-600" />
            </div>
            <h3 className="text-xl font-bold text-warm-brown-800 mb-4">Spiritual Formation</h3>
            <p className="text-warm-brown-600 leading-relaxed">
              Deep discipleship and biblical teaching that addresses the root causes of life-controlling 
              issues, bringing healing through faith in Christ.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-gradient-to-br from-warm-brown-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-warm-brown-100">
            <div className="w-16 h-16 bg-golden-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8 text-golden-600" />
            </div>
            <h3 className="text-xl font-bold text-warm-brown-800 mb-4">Vocational Training</h3>
            <p className="text-warm-brown-600 leading-relaxed">
              Practical job skills and industry-recognized certifications that prepare men for 
              successful careers and financial independence.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-gradient-to-br from-warm-brown-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-warm-brown-100">
            <div className="w-16 h-16 bg-forest-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-forest-green-600" />
            </div>
            <h3 className="text-xl font-bold text-warm-brown-800 mb-4">Character Development</h3>
            <p className="text-warm-brown-600 leading-relaxed">
              Building integrity, responsibility, and work ethic through hands-on experience and 
              meaningful community contribution.
            </p>
          </div>
        </div>

        {/* Quote */}
        <div className="mt-16 bg-gradient-to-r from-forest-green-50 to-golden-50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <Quote className="absolute top-8 left-8 w-16 h-16 text-forest-green-200 opacity-50" />
          <blockquote className="relative z-10 text-center">
            <p className="text-2xl md:text-3xl font-serif text-warm-brown-800 italic mb-6">
              "True transformation happens when the heart is renewed and the hands are equipped."
            </p>
            <cite className="text-warm-brown-600 font-medium">— A Better Way Philosophy</cite>
          </blockquote>
        </div>
      </div>
    </section>
  )
}

// Program Section
const ProgramSection = () => {
  const phases = [
    {
      number: '01',
      title: 'Induction & Foundation',
      duration: 'Months 1-6',
      description: 'Build a solid spiritual foundation through intensive discipleship, Bible study, and personal development. Residents begin their journey of healing and discover their identity in Christ.',
      features: ['Daily chapel services', 'Personal counseling', 'Biblical foundations', 'Life skills classes'],
      color: 'forest-green',
    },
    {
      number: '02',
      title: 'Workforce Training',
      duration: 'Months 7-14',
      description: 'Develop practical skills through hands-on vocational training in one of 13 certificate programs. Build work ethic, leadership abilities, and professional confidence.',
      features: ['Choose your trade', 'Hands-on learning', 'Industry certifications', 'Leadership development'],
      color: 'golden',
    },
    {
      number: '03',
      title: 'Transition',
      duration: 'Months 15-18',
      description: 'Prepare for independent living through job placement assistance, financial planning, and continued spiritual support. Graduate ready for a new life.',
      features: ['Job placement support', 'Financial literacy', 'Housing assistance', 'Alumni network'],
      color: 'warm-brown',
    },
  ]

  return (
    <section id="program" className="section-padding bg-gradient-warm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-forest-green-100 text-forest-green-700 rounded-full text-sm font-medium mb-4">
            The Journey
          </span>
          <h2 className="heading-secondary mb-6">
            18 Months of Transformation
          </h2>
          <p className="text-body max-w-3xl mx-auto">
            Our comprehensive program is designed to address every aspect of a man's life—spiritual, 
            professional, and personal—through three distinct phases.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {phases.map((phase, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < phases.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-warm-brown-300 to-transparent z-0" style={{ width: 'calc(100% - 2rem)', left: '50%', transform: 'translateX(0)' }}></div>
              )}
              
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                <div className={`bg-${phase.color === 'forest-green' ? 'forest-green-600' : phase.color === 'golden' ? 'golden-500' : 'warm-brown-600'} p-6`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-${phase.color === 'forest-green' ? 'forest-green' : phase.color === 'golden' ? 'golden' : 'warm-brown'}-200 text-sm font-medium`}>{phase.duration}</span>
                    <span className="text-5xl font-bold text-white/20">{phase.number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-2">{phase.title}</h3>
                </div>
                
                <div className="p-6">
                  <p className="text-warm-brown-600 mb-6">{phase.description}</p>
                  
                  <ul className="space-y-3">
                    {phase.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-warm-brown-700">
                        <Check className="w-5 h-5 text-forest-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Certificates Section
const CertificatesSection = () => {
  const certificates = [
    {
      name: 'Wood Shop & Commercial Table Production',
      hours: 900,
      icon: '🪵',
      description: 'Master woodworking skills from basic carpentry to commercial furniture production.',
    },
    {
      name: 'Automotive Technician',
      hours: 900,
      icon: '🔧',
      description: 'Learn automotive maintenance, diagnostics, and repair in a fully equipped shop.',
    },
    {
      name: 'Lawn Care & Landscape Operations',
      hours: 800,
      icon: '🌿',
      description: 'Develop expertise in landscape design, installation, and maintenance.',
    },
    {
      name: 'Food Service & Kitchen Operations',
      hours: 700,
      icon: '👨‍🍳',
      description: 'Train in professional food preparation, kitchen management, and culinary arts.',
    },
    {
      name: 'Media Production & Digital Content',
      hours: 800,
      icon: '📹',
      description: 'Create compelling digital content including video production and graphic design.',
    },
    {
      name: 'Facilities Maintenance',
      hours: 900,
      icon: '🏢',
      description: 'Comprehensive training in building systems, repair, and maintenance operations.',
    },
  ]

  return (
    <section id="certificates" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-golden-100 text-golden-700 rounded-full text-sm font-medium mb-4">
            Career Paths
          </span>
          <h2 className="heading-secondary mb-6">
            Vocational Certificate Programs
          </h2>
          <p className="text-body max-w-3xl mx-auto">
            Choose from 13 industry-recognized certificate programs, each designed to provide 
            hands-on training and real-world experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <div key={index} className="group bg-gradient-to-br from-warm-brown-50 to-white rounded-xl p-6 border border-warm-brown-100 hover:border-forest-green-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{cert.icon}</span>
                <span className="text-sm font-medium text-forest-green-600 bg-forest-green-50 px-3 py-1 rounded-full">
                  {cert.hours} hrs
                </span>
              </div>
              <h3 className="text-lg font-bold text-warm-brown-800 mb-2 group-hover:text-forest-green-700 transition-colors">
                {cert.name}
              </h3>
              <p className="text-warm-brown-600 text-sm">{cert.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-warm-brown-600 mb-4">
            Plus 7 additional certificate programs including HVAC, Welding, and more.
          </p>
          <a href="#contact" className="inline-flex items-center text-forest-green-600 font-semibold hover:text-forest-green-700 transition-colors">
            View All Programs <ChevronRight className="w-5 h-5 ml-1" />
          </a>
        </div>
      </div>
    </section>
  )
}

// Staff Section
const StaffSection = () => {
  const staff = [
    {
      name: 'Phil Bowden',
      role: 'Co-Founder & Executive Director',
      bio: 'Leading with vision and compassion since the ministry\'s founding.',
    },
    {
      name: 'Lisa Neville',
      role: 'Ministry CFO',
      bio: 'Ensuring financial stewardship and organizational excellence.',
    },
    {
      name: 'Doug Campbell',
      role: 'Program Director',
      bio: 'Guiding men through their transformation journey with wisdom.',
    },
    {
      name: 'David Morgan',
      role: 'Director of Education',
      bio: 'Developing curriculum that transforms minds and hearts.',
    },
    {
      name: 'Corey Rogers',
      role: 'Director of Operations',
      bio: 'Managing facilities and vocational programs with excellence.',
    },
  ]

  return (
    <section id="staff" className="section-padding bg-gradient-to-br from-forest-green-50 to-warm-brown-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-forest-green-100 text-forest-green-700 rounded-full text-sm font-medium mb-4">
            Our Team
          </span>
          <h2 className="heading-secondary mb-6">
            Dedicated Leadership
          </h2>
          <p className="text-body max-w-3xl mx-auto">
            Meet the team that has dedicated their lives to helping men find hope, healing, and purpose.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {staff.map((member, index) => (
            <div key={index} className="group text-center">
              <div className="relative mb-4 mx-auto w-32 h-32">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-forest-green-100 to-golden-100 flex items-center justify-center overflow-hidden">
                  <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <span className="text-3xl font-serif font-bold text-forest-green-700">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-golden-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h3 className="font-bold text-warm-brown-800 mb-1">{member.name}</h3>
              <p className="text-forest-green-600 text-sm font-medium mb-2">{member.role}</p>
              <p className="text-warm-brown-500 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "I came here broken, addicted, and hopeless. Through this program, I found not just sobriety—I found my purpose. The combination of spiritual growth and job training gave me a new life.",
      name: "Program Graduate",
      year: "Class of 2023",
    },
    {
      quote: "The vocational training changed everything for me. I left with certifications, work experience, and most importantly, a relationship with Christ that sustains me every day.",
      name: "Program Graduate",
      year: "Class of 2022",
    },
    {
      quote: "From brokenness to purpose—that's what A Better Way gave me. The staff poured into me, and now I'm able to give back to my community and family.",
      name: "Program Graduate",
      year: "Class of 2021",
    },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-golden-100 text-golden-700 rounded-full text-sm font-medium mb-4">
            Stories of Hope
          </span>
          <h2 className="heading-secondary mb-6">
            From Brokenness to Purpose
          </h2>
          <p className="text-body max-w-3xl mx-auto">
            Real stories from men whose lives have been transformed through faith, purpose, and work.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-forest-green-50 to-white rounded-2xl p-8 shadow-lg border border-forest-green-100">
              <Quote className="w-10 h-10 text-forest-green-200 mb-4" />
              <p className="text-warm-brown-700 italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-forest-green-100 flex items-center justify-center mr-4">
                  <span className="text-forest-green-600 font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-warm-brown-800">{testimonial.name}</p>
                  <p className="text-sm text-warm-brown-500">{testimonial.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
const CTASection = () => {
  return (
    <section id="apply" className="py-24 bg-gradient-to-br from-forest-green-700 via-forest-green-800 to-forest-green-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-golden-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-golden-400 rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
          Begin Your Transformation
        </h2>
        <p className="text-xl text-forest-green-200 max-w-3xl mx-auto mb-12">
          Take the first step toward a new life. Our admissions team is ready to answer your 
          questions and guide you through the application process.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a href="tel:+16785551234" className="btn-primary bg-white text-forest-green-700 hover:bg-gray-100">
            <Phone className="w-5 h-5 mr-2" />
            Call Now
          </a>
          <a href="mailto:info@abetterwayministries.org" className="btn-secondary border-white text-white hover:bg-white hover:text-forest-green-700">
            <Mail className="w-5 h-5 mr-2" />
            Email Us
          </a>
        </div>

        {/* Contact Info */}
        <div id="contact" className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-golden-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Visit Us</h3>
            <p className="text-forest-green-200 text-sm">
              320 Dividend Dr<br />
              Peachtree City, GA 30269
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-7 h-7 text-golden-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Call Us</h3>
            <p className="text-forest-green-200 text-sm">
              (678) 555-1234
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-golden-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Email Us</h3>
            <p className="text-forest-green-200 text-sm">
              info@abetterwayministries.org
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 flex justify-center gap-4">
          <a href="#" className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <Youtube className="w-6 h-6 text-white" />
          </a>
          <a href="#" className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <Facebook className="w-6 h-6 text-white" />
          </a>
          <a href="#" className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <Instagram className="w-6 h-6 text-white" />
          </a>
        </div>
      </div>
    </section>
  )
}

// Footer
const Footer = () => {
  return (
    <footer className="bg-warm-brown-900 text-warm-brown-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-forest-green-600 to-forest-green-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">ABW</span>
              </div>
              <div>
                <span className="font-serif font-bold text-xl text-white">A Better Way</span>
                <span className="block text-xs text-warm-brown-400 -mt-1">Ministries</span>
              </div>
            </div>
            <p className="text-warm-brown-400 mb-4 max-w-md">
              A faith-based 18-month residential recovery and vocational training program 
              transforming lives through faith, purpose, and work.
            </p>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-golden-500" />
              <span className="text-sm text-warm-brown-400">GNPEC Recognized Institution</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-forest-green-400 transition-colors">About Us</a></li>
              <li><a href="#program" className="hover:text-forest-green-400 transition-colors">Our Program</a></li>
              <li><a href="#certificates" className="hover:text-forest-green-400 transition-colors">Certificates</a></li>
              <li><a href="#staff" className="hover:text-forest-green-400 transition-colors">Our Team</a></li>
              <li><a href="#apply" className="hover:text-forest-green-400 transition-colors">Apply Now</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1 text-forest-green-500" />
                <span>320 Dividend Dr<br />Peachtree City, GA 30269</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-forest-green-500" />
                <span>(678) 555-1234</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-forest-green-500" />
                <span>info@abetterwayministries.org</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-warm-brown-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-warm-brown-500">
            © {new Date().getFullYear()} A Better Way Ministries. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="w-10 h-10 bg-warm-brown-800 hover:bg-forest-green-600 rounded-full flex items-center justify-center transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-warm-brown-800 hover:bg-forest-green-600 rounded-full flex items-center justify-center transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-warm-brown-800 hover:bg-forest-green-600 rounded-full flex items-center justify-center transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <StatsBar />
      <AboutSection />
      <ProgramSection />
      <CertificatesSection />
      <StaffSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default App
