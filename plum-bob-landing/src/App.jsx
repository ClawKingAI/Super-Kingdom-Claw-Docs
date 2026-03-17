import Header from './components/Header'
import Hero from './components/Hero'
import TrustIndicators from './components/TrustIndicators'
import Services from './components/Services'
import About from './components/About'
import CallToAction from './components/CallToAction'
import ContactForm from './components/ContactForm'
import MapSection from './components/MapSection'
import Footer from './components/Footer'
import FloatingCallButton from './components/FloatingCallButton'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <TrustIndicators />
        <Services />
        <About />
        <CallToAction />
        <ContactForm />
        <MapSection />
      </main>
      <Footer />
      <FloatingCallButton />
    </div>
  )
}

export default App
