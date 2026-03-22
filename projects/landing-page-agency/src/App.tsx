import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Star,
  Play,
  Menu,
  X,
  Rocket,
  Palette,
  Code,
  Globe,
  MessageSquare,
  Award,
  Heart,
  ChevronUp,
  ExternalLink,
  Mail,
} from 'lucide-react';

// Animated particle background
const ParticleBackground = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    delay: Math.random() * 20,
    duration: 20 + Math.random() * 10,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-primary/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent-secondary/10 via-transparent to-transparent" />
      
      {/* Geometric grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-accent-primary/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            animation: `particle ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      
      {/* Gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-primary/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-secondary/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 12, repeat: Infinity, delay: 4 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-tertiary/20 rounded-full blur-3xl"
      />
    </div>
  );
};

// Navigation
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-dark-950/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.a
            href="#"
            className="flex items-center gap-2 text-2xl font-bold"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-tertiary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text">LaunchPad</span>
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="text-dark-300 hover:text-white transition-colors relative group"
                whileHover={{ y: -2 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-primary to-accent-tertiary transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <motion.a
              href="#contact"
              className="btn-primary text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </motion.a>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ height: isMobileMenuOpen ? 'auto' : 0 }}
        className="md:hidden overflow-hidden bg-dark-900/95 backdrop-blur-xl"
      >
        <div className="px-6 py-4 space-y-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block text-dark-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a href="#contact" className="btn-primary inline-flex text-sm" onClick={() => setIsMobileMenuOpen(false)}>
            Get Started
          </a>
        </div>
      </motion.div>
    </motion.nav>
  );
};

// Hero Section
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent-primary" />
            <span className="text-sm font-medium text-dark-300">AI-Powered Design</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent-primary/20 text-accent-primary">New</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">Landing Pages</span>
            <br />
            <span className="gradient-text text-glow">Built to Convert</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-dark-400 max-w-3xl mx-auto mb-12"
          >
            We combine AI-powered design with human expertise to create stunning,
            high-converting landing pages in days, not weeks.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.a
              href="#contact"
              className="btn-primary text-lg px-10 py-5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Project
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
            <motion.a
              href="#portfolio"
              className="btn-secondary text-lg px-10 py-5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="mr-2 w-5 h-5" />
              View Our Work
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: '500+', label: 'Projects Delivered' },
              { value: '98%', label: 'Client Satisfaction' },
              { value: '48h', label: 'Fastest Delivery' },
              { value: '5x', label: 'Avg. Conversion Lift' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-dark-400"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Social Proof Section
const SocialProofSection = () => {
  const logos = [
    'Stripe', 'Notion', 'Linear', 'Vercel', 'Figma', 'Discord', 'Slack', 'Framer'
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-dark-500 text-sm uppercase tracking-widest mb-8"
        >
          Trusted by innovative teams
        </motion.p>
        
        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex gap-12 items-center"
          >
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="flex-shrink-0 px-8 py-4 rounded-lg glass text-xl font-semibold text-dark-400 hover:text-white transition-colors"
              >
                {logo}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Pricing Tier Data
const pricingTiers = [
  {
    name: 'Quick Launch',
    price: '$500',
    description: 'Perfect for testing new ideas and MVPs',
    features: [
      'Single-page landing page',
      'Mobile responsive design',
      'Contact form integration',
      'Deployed to here.now (free hosting)',
      '48-hour delivery',
      '1 revision round',
    ],
    popular: false,
    icon: Rocket,
  },
  {
    name: 'Business Presence',
    price: '$1,500',
    description: 'Ideal for established businesses',
    features: [
      'Multi-section landing page',
      'Hero, services, about, testimonials, contact',
      'Mobile responsive design',
      'Contact form + social links',
      'SEO meta tags optimization',
      'Deployed + hosting included',
      '72-hour delivery',
      '2 revision rounds',
    ],
    popular: true,
    icon: Palette,
  },
  {
    name: 'Professional',
    price: '$3,000',
    description: 'For maximum impact and conversions',
    features: [
      'Full landing page with animations',
      'Custom design consultation',
      'Lead capture forms',
      'Analytics integration',
      'Hosting + domain setup',
      '1-week delivery',
      '3 revision rounds',
      '30-day support included',
    ],
    popular: false,
    icon: Award,
  },
];

// Pricing Section
const PricingSection = () => {
  return (
    <section id="services" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            <span className="gradient-text">Pricing</span> Plans
          </h2>
          <p className="section-subtitle">
            Choose the perfect package for your needs. All plans include our AI-powered design process.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl overflow-hidden ${
                tier.popular
                  ? 'bg-gradient-to-b from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/50'
                  : 'card-glass'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-xs font-semibold text-center py-1">
                  MOST POPULAR
                </div>
              )}
              
              <div className={`p-8 ${tier.popular ? 'pt-10' : ''}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    tier.popular ? 'bg-accent-primary' : 'bg-white/10'
                  }`}>
                    <tier.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                    <p className="text-sm text-dark-400">{tier.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold gradient-text">{tier.price}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-dark-300">
                      <CheckCircle2 className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.a
                  href="#contact"
                  className={`w-full block text-center py-4 rounded-xl font-semibold transition-all ${
                    tier.popular
                      ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white'
                      : 'glass hover:bg-white/10 text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Process Section
const processSteps = [
  { icon: MessageSquare, title: 'Discovery', description: 'Share your vision and goals through our consultation form' },
  { icon: Palette, title: 'Design', description: 'AI generates initial designs, refined by human experts' },
  { icon: Code, title: 'Develop', description: 'Clean, performant code built with modern technologies' },
  { icon: Rocket, title: 'Launch', description: 'Deployed and optimized for maximum conversions' },
];

const ProcessSection = () => {
  return (
    <section id="process" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="section-subtitle">
            From concept to launch in four simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {i < processSteps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-accent-primary/50 to-transparent" />
              )}
              
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative inline-flex mb-6"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-glow-md">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-dark-900 border-2 border-accent-primary flex items-center justify-center text-sm font-bold text-white">
                    {i + 1}
                  </div>
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-dark-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Portfolio Section
const portfolioItems = [
  { category: 'SaaS', title: 'Analytics Dashboard', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop' },
  { category: 'Fintech', title: 'Payment Platform', image: 'https://images.unsplash.com/photo-1563986768609-322da97c5731?w=800&h=600&fit=crop' },
  { category: 'E-commerce', title: 'Luxury Brand', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop' },
  { category: 'Healthcare', title: 'Telehealth Platform', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop' },
  { category: 'AI Startup', title: 'AI Writing Tool', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop' },
  { category: 'Crypto', title: 'DeFi Platform', image: 'https://images.unsplash.com/photo-1639769084548-5f7894cfc6e4?w=800&h=600&fit=crop' },
];

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            Our <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="section-subtitle">
            A glimpse of the stunning landing pages we've crafted
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative rounded-2xl overflow-hidden card-glass"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-xs font-semibold text-accent-primary uppercase tracking-wider">{item.category}</span>
                <h3 className="text-xl font-bold text-white mt-1">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const testimonials = [
  {
    quote: "LaunchPad delivered our landing page in just 3 days, and it converted 4x better than our previous page. Absolutely incredible work!",
    author: "Sarah Chen",
    role: "Founder, TechFlow",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
  },
  {
    quote: "The AI-powered design process gave us options we never would have thought of. The team was responsive and delivered beyond expectations.",
    author: "Marcus Johnson",
    role: "CEO, DataSync",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
  },
  {
    quote: "From discovery to launch, everything was seamless. Our conversion rate jumped 127% in the first month. Worth every penny.",
    author: "Emily Rodriguez",
    role: "Marketing Director, CloudScale",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            Client <span className="gradient-text">Love</span>
          </h2>
          <p className="section-subtitle">
            Don't just take our word for it
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-glass p-8 rounded-2xl"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-dark-200 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-sm text-dark-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const faqs = [
  {
    question: 'How does the AI-powered design process work?',
    answer: 'Our AI analyzes your requirements and generates initial design concepts based on best practices and conversion optimization data. Human designers then refine and perfect these concepts to ensure uniqueness and brand alignment.',
  },
  {
    question: 'What technologies do you use?',
    answer: 'We build with React, Next.js, and TailwindCSS for modern, performant sites. We also offer static HTML exports for maximum compatibility and fast loading times.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Depending on your tier, delivery ranges from 48 hours (Quick Launch) to 1 week (Professional). Rush delivery is available for an additional fee.',
  },
  {
    question: 'Do you offer hosting?',
    answer: 'Yes! All plans include deployment. Quick Launch uses our free here.now hosting, while higher tiers include premium hosting with custom domain setup.',
  },
  {
    question: 'What if I need revisions?',
    answer: 'Each tier includes revision rounds (1-3 depending on plan). Additional revisions can be purchased. We work closely with you to get it right.',
  },
  {
    question: 'Can I see examples of your work?',
    answer: 'Absolutely! Check out our portfolio section above, or contact us for case studies specific to your industry.',
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-32">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            <span className="gradient-text">FAQs</span>
          </h2>
          <p className="section-subtitle">
            Got questions? We've got answers.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-glass rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-white">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-dark-400" />
                </motion.div>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === i ? 'auto' : 0,
                  opacity: openIndex === i ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 text-dark-300">{faq.answer}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact/Booking Section
const ContactSection = () => {
  return (
    <section id="contact" className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-4">
            Book Your <span className="gradient-text">Consultation</span>
          </h2>
          <p className="section-subtitle">
            Schedule a free consultation to discuss your project
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-glass rounded-2xl p-4 md:p-8"
        >
          <iframe
            src="https://api.tkcmarketing.com/widget/booking/U608IPv4hEBuFd42Urbk"
            style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight: '600px' }}
            scrolling="no"
            id="U608IPv4hEBuFd42Urbk_1773801093116"
            title="Book a Consultation"
          />
          <script src="https://api.tkcmarketing.com/js/form_embed.js" type="text/javascript" />
        </motion.div>

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="card-glass rounded-xl p-6 text-center">
            <Mail className="w-8 h-8 text-accent-primary mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-1">Email Us</h3>
            <p className="text-dark-400">hello@launchpad.ai</p>
          </div>
          <div className="card-glass rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 text-accent-primary mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-1">Response Time</h3>
            <p className="text-dark-400">Within 24 hours</p>
          </div>
          <div className="card-glass rounded-xl p-6 text-center">
            <Globe className="w-8 h-8 text-accent-primary mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-1">Global Service</h3>
            <p className="text-dark-400">Remote worldwide</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  const footerLinks = {
    Services: ['Landing Pages', 'Web Design', 'Development', 'Hosting'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Legal: ['Privacy', 'Terms', 'Cookies', 'Licenses'],
    Social: ['Twitter', 'LinkedIn', 'GitHub', 'Discord'],
  };

  return (
    <footer className="relative py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-2xl font-bold mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-tertiary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="gradient-text">LaunchPad</span>
            </div>
            <p className="text-dark-400 mb-6 max-w-sm">
              AI-powered landing pages built to convert. Fast delivery, stunning design, measurable results.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-dark-400 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-dark-500 text-sm">
            © 2024 LaunchPad. All rights reserved.
          </p>
          <p className="text-dark-500 text-sm">
            Made with <Heart className="inline w-4 h-4 text-red-500" /> and AI
          </p>
        </div>
      </div>
    </footer>
  );
};

// Scroll to top button
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary flex items-center justify-center shadow-glow-lg z-50"
    >
      <ChevronUp className="w-6 h-6 text-white" />
    </motion.button>
  );
};

// Main App
function App() {
  return (
    <div className="relative">
      <ParticleBackground />
      <Navigation />
      <main className="relative z-10">
        <HeroSection />
        <SocialProofSection />
        <PricingSection />
        <ProcessSection />
        <PortfolioSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
