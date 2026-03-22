import React from 'react';
import HeroSection from './components/HeroSection';
import StatsBar from './components/StatsBar';
import AboutSection from './components/AboutSection';
import ProgramOverview from './components/ProgramOverview';
import CertificatePrograms from './components/CertificatePrograms';
import StaffSection from './components/StaffSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsBar />
      <AboutSection />
      <ProgramOverview />
      <CertificatePrograms />
      <StaffSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default App;