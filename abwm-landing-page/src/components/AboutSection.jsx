import React from 'react';

const AboutSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">About Our Ministry</h2>
        <div className="max-w-4xl mx-auto">
          <div className="card p-8">
            <p className="text-lg mb-6">
              A Better Way Ministries is a faith-based 18-month residential recovery, discipleship, 
              and vocational training program specifically designed for men struggling with 
              life-controlling issues.
            </p>
            <p className="text-lg mb-6">
              Our unique approach combines spiritual formation with practical skill development, 
              recognizing that true transformation occurs when we address both the heart and hands. 
              We believe that meaningful work is a vital part of healing and restoration.
            </p>
            <p className="text-lg">
              Located in Peachtree City, Georgia, our ministry has been transforming lives for 
              over 20 years, with more than 3,500 men finding hope, purpose, and a new direction 
              through our comprehensive program.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;