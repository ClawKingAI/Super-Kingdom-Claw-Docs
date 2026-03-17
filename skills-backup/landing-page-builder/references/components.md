# Component Templates

Copy-paste React components for landing pages.

## Header

```jsx
import { FiPhone } from 'react-icons/fi';

export default function Header({ businessName, phone }) {
  return (
    <header className="fixed top-0 w-full bg-navy-900/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-white">{businessName}</div>
        <a href={`tel:${phone}`} className="flex items-center gap-2 bg-water-500 hover:bg-water-600 text-white px-4 py-2 rounded-lg transition">
          <FiPhone />
          <span className="font-semibold">{phone}</span>
        </a>
      </div>
    </header>
  );
}
```

## Hero

```jsx
export default function Hero({ headline, subheadline, phone }) {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
          {headline}
        </h1>
        <p className="text-xl text-steel-300 mb-8 max-w-2xl">
          {subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href={`tel:${phone}`} className="bg-water-500 hover:bg-water-600 text-white text-lg font-semibold px-8 py-4 rounded-lg transition text-center">
            Call Now
          </a>
          <a href="#contact" className="border-2 border-white/30 hover:border-white text-white text-lg font-semibold px-8 py-4 rounded-lg transition text-center">
            Request Service
          </a>
        </div>
      </div>
    </section>
  );
}
```

## Trust Indicators

```jsx
import { FiCheck, FiClock, FiTool, FiHome } from 'react-icons/fi';

const indicators = [
  { icon: FiHome, text: 'Local Family-Owned Business' },
  { icon: FiClock, text: 'Fast Response Times' },
  { icon: FiTool, text: 'Professional Equipment' },
  { icon: FiCheck, text: 'Residential & Commercial' },
];

export default function TrustIndicators() {
  return (
    <section className="bg-navy-800 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {indicators.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4">
              <item.icon className="text-water-400 text-3xl mb-3" />
              <span className="text-white font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Service Cards

```jsx
import { FiTool, FiDroplet, FiZap, FiAlertTriangle } from 'react-icons/fi';

const services = [
  {
    icon: FiTool,
    title: 'Septic System Services',
    items: ['Septic inspections', 'Septic repairs', 'Drain field troubleshooting'],
  },
  {
    icon: FiDroplet,
    title: 'Sewer Services',
    items: ['Sewer line diagnostics', 'Sewer repairs', 'Blockage clearing'],
  },
  {
    icon: FiZap,
    title: 'Water Line Services',
    items: ['Water line repair', 'Leak detection', 'Pressure issues'],
  },
  {
    icon: FiAlertTriangle,
    title: 'Emergency Plumbing',
    items: ['Urgent plumbing issues', 'Burst pipes', 'Drain emergencies'],
  },
];

export default function Services() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-navy-900 text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <div key={i} className="bg-navy-50 rounded-xl p-6 hover:shadow-lg transition">
              <service.icon className="text-water-500 text-4xl mb-4" />
              <h3 className="text-xl font-bold text-navy-900 mb-3">{service.title}</h3>
              <ul className="space-y-2">
                {service.items.map((item, j) => (
                  <li key={j} className="text-steel-600">• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Contact Form

```jsx
import { useState } from 'react';

export default function ContactForm({ onSubmit }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' });
  
  const services = ['Septic Services', 'Sewer Services', 'Water Line', 'Emergency Plumbing', 'Other'];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <section id="contact" className="py-20 bg-navy-800">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Request Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            required
            className="w-full px-4 py-3 rounded-lg bg-navy-700 text-white placeholder-steel-400 border border-navy-600 focus:border-water-500 focus:outline-none"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            required
            className="w-full px-4 py-3 rounded-lg bg-navy-700 text-white placeholder-steel-400 border border-navy-600 focus:border-water-500 focus:outline-none"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 rounded-lg bg-navy-700 text-white placeholder-steel-400 border border-navy-600 focus:border-water-500 focus:outline-none"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
          <select
            required
            className="w-full px-4 py-3 rounded-lg bg-navy-700 text-white border border-navy-600 focus:border-water-500 focus:outline-none"
            value={form.service}
            onChange={(e) => setForm({...form, service: e.target.value})}
          >
            <option value="">Select Service Needed</option>
            {services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <textarea
            placeholder="Describe your issue..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-navy-700 text-white placeholder-steel-400 border border-navy-600 focus:border-water-500 focus:outline-none"
            value={form.message}
            onChange={(e) => setForm({...form, message: e.target.value})}
          />
          <button
            type="submit"
            className="w-full bg-water-500 hover:bg-water-600 text-white font-semibold py-4 rounded-lg transition"
          >
            Request Service
          </button>
        </form>
      </div>
    </section>
  );
}
```

## Floating Mobile Call Button

```jsx
export default function FloatingCallButton({ phone }) {
  return (
    <a
      href={`tel:${phone}`}
      className="fixed bottom-6 right-6 bg-water-500 hover:bg-water-600 text-white p-4 rounded-full shadow-lg md:hidden z-50"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    </a>
  );
}
```

## Google Maps Embed

```jsx
export default function Map({ address }) {
  const encoded = encodeURIComponent(address);
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-navy-900 text-center mb-8">Find Us</h2>
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encoded}`}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className="rounded-xl"
        />
      </div>
    </section>
  );
}
```
