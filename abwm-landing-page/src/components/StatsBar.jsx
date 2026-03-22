import React from 'react';

const StatsBar = () => {
  const stats = [
    { value: "20+", label: "Years of Ministry" },
    { value: "3,500+", label: "Lives Transformed" },
    { value: "13", label: "Vocational Certificate Programs" }
  ];

  return (
    <section className="bg-accent py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-dark">{stat.value}</div>
              <div className="text-lg md:text-xl text-dark mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;