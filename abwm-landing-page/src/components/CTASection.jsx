import React from 'react';

const CTASection = () => {
  return (
    <section id="apply" className="section-padding bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Begin Your Transformation
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Take the first step toward a new life. Contact us today to learn more 
          about our 18-month transformation program.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <a href="tel:+16785551234" className="btn-secondary">
            Call Now
          </a>
          <a href="mailto:info@abetterwayministries.org" className="bg-white text-primary font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition">
            Email Us
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Visit Us</h3>
            <p className="opacity-90">
              320 Dividend Dr<br />
              Peachtree City, GA 30269
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Call Us</h3>
            <p className="opacity-90">(678) 555-1234</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Email Us</h3>
            <p className="opacity-90">info@abetterwayministries.org</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
