export default function Timeline() {
  const projects = [
    { type: 'Landing Page', intake: '1 hr', requirements: '1 hr', generation: '30 min', review: '1 day', deploy: '15 min', total: '1-2 days' },
    { type: 'Marketing Site', intake: '2 hrs', requirements: '2 hrs', generation: '1 hr', review: '2 days', deploy: '15 min', total: '2-3 days' },
    { type: 'Web Application', intake: '4 hrs', requirements: '4 hrs', generation: '2 hrs', review: '3 days', deploy: '30 min', total: '4-5 days' },
    { type: 'Complex Platform', intake: '1 day', requirements: '1 day', generation: '1 day', review: '5 days', deploy: '1 hr', total: '1-2 weeks' },
  ]

  return (
    <section id="timeline" className="py-20 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Project Timelines
          </h2>
          <p className="text-steel-300 max-w-2xl mx-auto">
            Estimated timelines by project type. Most projects complete in under a week.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-navy-700">
                <th className="text-left py-4 px-4 text-steel-400 font-medium">Project Type</th>
                <th className="text-center py-4 px-3 text-steel-400 font-medium">Intake</th>
                <th className="text-center py-4 px-3 text-steel-400 font-medium">Requirements</th>
                <th className="text-center py-4 px-3 text-steel-400 font-medium">Generation</th>
                <th className="text-center py-4 px-3 text-steel-400 font-medium">Review</th>
                <th className="text-center py-4 px-3 text-steel-400 font-medium">Deploy</th>
                <th className="text-center py-4 px-4 text-water-400 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.type} className="border-b border-navy-800 hover:bg-navy-800/50 transition-colors">
                  <td className="py-4 px-4 text-white font-medium">{project.type}</td>
                  <td className="py-4 px-3 text-steel-300 text-center">{project.intake}</td>
                  <td className="py-4 px-3 text-steel-300 text-center">{project.requirements}</td>
                  <td className="py-4 px-3 text-steel-300 text-center">{project.generation}</td>
                  <td className="py-4 px-3 text-steel-300 text-center">{project.review}</td>
                  <td className="py-4 px-3 text-steel-300 text-center">{project.deploy}</td>
                  <td className="py-4 px-4 text-water-400 font-semibold text-center">{project.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <p className="text-steel-400 text-sm">
            Timelines are estimates based on typical projects. Complex integrations or custom features may extend timelines.
          </p>
        </div>
      </div>
    </section>
  )
}
