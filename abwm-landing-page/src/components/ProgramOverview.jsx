import React from 'react';

const ProgramOverview = () => {
  const phases = [
    {
      title: "Phase 1: Induction & Foundational Discipleship",
      description: "New residents begin with intensive discipleship, establishing spiritual foundation, community integration, and personal accountability structures. This phase focuses on breaking old patterns and embracing biblical principles for life transformation."
    },
    {
      title: "Phase 2: Workforce Training & Leadership Development",
      description: "Residents advance to hands-on vocational training while developing leadership skills and character. They gain real-world experience in their chosen field while mentoring newer residents, building confidence and competence for post-program success."
    },
    {
      title: "Phase 3: Transition",
      description: "Preparation for independent living with continued spiritual support, job placement assistance, and ongoing mentorship. Graduates enter society with marketable skills, a strong spiritual foundation, and a supportive community connection."
    }
  ];

  return (
    <section className="section-padding bg-light">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Our 18-Month Transformation Program</h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {phases.map((phase, index) => (
              <div key={index} className="card">
                <div className="p-6 md:p-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl mr-6">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-primary">{phase.title}</h3>
                      <p className="text-lg">{phase.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramOverview;