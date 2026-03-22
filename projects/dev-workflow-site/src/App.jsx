import Header from './components/Header'
import Hero from './components/Hero'
import ProcessFlow from './components/ProcessFlow'
import SpeedComparison from './components/SpeedComparison'
import WhatYouGet from './components/WhatYouGet'
import Stages from './components/Stages'
import Technology from './components/Technology'
import Timeline from './components/Timeline'
import FAQ from './components/FAQ'
import CTA from './components/CTA'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-navy-900">
      <Header />
      <main>
        <Hero />
        <ProcessFlow />
        <SpeedComparison />
        <WhatYouGet />
        <Stages />
        <Technology />
        <Timeline />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default App
