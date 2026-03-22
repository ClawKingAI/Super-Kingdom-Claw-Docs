import React from 'react';

const StaffSection = () => {
  const staff = [
    {
      name: "Phil Bowden",
      position: "Co-Founder & Executive Director"
    },
    {
      name: "Lisa Neville",
      position: "Ministry CFO"
    },
    {
      name: "Doug Campbell",
      position: "Program Director"
    },
    {
      name: "David Morgan",
      position: "Director of Education"
    },
    {
      name: "Corey Rogers",
      position: "Director of Operations"
    }
  ];

  return (
    <section className="section-padding bg-light">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Our Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {staff.map((member, index) => (
            <div key={index} className="card text-center">
              <div className="p-8">
                <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-secondary">{member.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffSection;