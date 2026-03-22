import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">A Better Way Ministries</h3>
            <p className="opacity-80">
              A faith-based 18-month residential recovery and vocational training 
              program transforming lives through faith, purpose, and work.
            </p>
            <div className="mt-4 flex items-center">
              <span className="bg-accent text-dark px-3 py-1 rounded-full text-sm font-medium">
                GNPEC Recognized
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 opacity-80">
              <li><a href="#about" className="hover:text-accent transition">About Us</a></li>
              <li><a href="#program" className="hover:text-accent transition">Our Program</a></li>
              <li><a href="#certificates" className="hover:text-accent transition">Certificates</a></li>
              <li><a href="#staff" className="hover:text-accent transition">Our Team</a></li>
              <li><a href="#apply" className="hover:text-accent transition">Apply Now</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 opacity-80">
              <li>320 Dividend Dr</li>
              <li>Peachtree City, GA 30269</li>
              <li>(678) 555-1234</li>
              <li>info@abetterwayministries.org</li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="hover:text-accent transition">YouTube</a>
              <a href="#" className="hover:text-accent transition">Facebook</a>
              <a href="#" className="hover:text-accent transition">Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center opacity-80">
          <p>© {new Date().getFullYear()} A Better Way Ministries. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
