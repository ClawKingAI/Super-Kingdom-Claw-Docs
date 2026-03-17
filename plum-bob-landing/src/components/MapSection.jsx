export default function MapSection() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <h2 className="text-2xl font-bold text-navy-800 mb-4">Service Area</h2>
          <p className="text-steel-600 mb-8">
            Proudly serving Senoia, Georgia and surrounding areas including Peachtree City, 
            Newnan, Fayetteville, and more.
          </p>
        </div>
      </div>
      
      <div className="w-full h-96 bg-gray-200 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.5!2d-84.5618!3d33.3082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s210+Wagon+Wheels+Trail%2C+Senoia%2C+GA+30276!5e0!3m2!1sen!2sus!4v1!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Plum Bob Location - 210 Wagon Wheels Trail, Senoia, GA 30276"
          className="absolute inset-0"
        />
      </div>
    </section>
  )
}
