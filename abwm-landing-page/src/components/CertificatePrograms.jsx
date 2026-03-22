import React from 'react';

const CertificatePrograms = () => {
  const programs = [
    {
      title: "Wood Shop & Commercial Table Production",
      hours: "900 hrs"
    },
    {
      title: "Automotive Technician",
      hours: "900 hrs"
    },
    {
      title: "Lawn Care & Landscape Operations",
      hours: "800 hrs"
    },
    {
      title: "Food Service & Kitchen Operations",
      hours: "700 hrs"
    },
    {
      title: "Media Production & Digital Content",
      hours: "800 hrs"
    },
    {
      title: "Facilities Maintenance",
      hours: "900 hrs"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Vocational Training Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {programs.map((program, index) => (
            <div key={index} className="card">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-primary">{program.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-secondary font-semibold">{program.hours}</span>
                  <span className="bg-accent text-dark px-3 py-1 rounded-full text-sm font-medium">Certification</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificatePrograms;