import { programs } from '../App'

const registrationForms = [
  { name: 'FVIP Registration Form', url: 'https://hushforms.com/ecdui-9082', program: 'FVIP' },
  { name: 'FVIP Contract', url: 'https://hushforms.com/ecdui-6331', program: 'FVIP' },
  { name: 'FVIP Principles of Practice', url: 'https://hushforms.com/ecdui-8550', program: 'FVIP' },
  { name: 'Anger Management Registration', url: 'https://hushforms.com/ecdui-883', program: 'Anger Management' },
  { name: 'Risk Reduction Registration', url: 'https://hushforms.com/ecdui', program: 'Risk Reduction' },
  { name: 'Driver Improvement Registration', url: 'https://hushforms.com/ecdui', program: 'Driver Improvement' },
  { name: 'Victim Impact Panel Registration', url: 'https://hushforms.com/ecdui', program: 'Victim Impact Panel' },
  { name: 'Parenting Class Registration', url: 'https://hushforms.com/ecdui', program: 'Parenting Class' },
  { name: 'Shoplifting Class Registration', url: 'https://hushforms.com/ecdui', program: 'Shoplifting Class' },
  { name: '420-Marijuana Risk Reduction', url: 'https://hushforms.com/ecdui', program: '420-Marijuana' },
]

export default function Documents() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Documents</h1>
          <p className="text-slate-500">Registration forms, certificates, and uploads</p>
        </div>
        <button className="bg-brand-blue text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload Document
        </button>
      </div>

      {/* Registration Forms */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">Registration Forms (HushForms)</h2>
          <p className="text-sm text-slate-500">Click to open registration forms for each program</p>
        </div>
        <div className="divide-y divide-slate-200">
          {registrationForms.map((form, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
              <div>
                <p className="font-medium text-slate-800">{form.name}</p>
                <p className="text-sm text-slate-500">{form.program}</p>
              </div>
              <a
                href={form.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Open Form →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Tutorial Videos */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Tutorial Videos (FVIP)</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-medium text-slate-800">FVIP Contract Overview</p>
            <p className="text-sm text-slate-500">Required viewing before signing</p>
          </div>
          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-medium text-slate-800">Principles of Practice</p>
            <p className="text-sm text-slate-500">Program expectations and guidelines</p>
          </div>
        </div>
      </div>

      {/* Certificate Templates */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Certificate Templates</h2>
        <div className="grid grid-cols-3 gap-4">
          {['Risk Reduction', 'Driver Improvement', '420-Marijuana'].map((cert) => (
            <div key={cert} className="p-4 border border-slate-200 rounded-lg text-center">
              <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-medium text-slate-800">{cert}</p>
              <p className="text-sm text-slate-500">Certificate of Completion</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
