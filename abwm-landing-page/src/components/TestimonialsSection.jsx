import React from 'react';

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Stories of Transformation</h2>
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 text-center">
            <div className="text-5xl text-accent mb-6">"</div>
            <p className="text-xl italic mb-8">
              From brokenness to purpose - A Better Way Ministries gave me the tools, 
              training, and spiritual foundation I needed to rebuild my life. Today I'm 
              employed in my field, married, and mentoring other men in the program.
            </p>
            <div className="border-t border-gray-200 pt-6">
              <p className="font-bold text-lg">- Graduate Testimonial</p>
              <p className="text-secondary">Class of 2025</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600">
              Join over 3,500 men who have found hope and purpose through our program
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;