import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-primary to-dark text-white">
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            A Better Way Ministries
          </h1>
          <p className="text-xl md:text-2xl mb-2">
            Restoring Lives Through Faith, Purpose, and Work
          </p>
          <p className="text-lg md:text-xl mb-10 text-light opacity-90">
            An 18-Month Transformation Journey
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#apply" className="btn-primary inline-block">
              Apply Now
            </a>
            <a href="#donate" className="btn-secondary inline-block">
              Donate
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;