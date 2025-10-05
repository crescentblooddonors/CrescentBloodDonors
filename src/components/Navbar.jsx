import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#about', text: 'ABOUT US' },
    { href: '#members', text: 'MEMBERS' },
    { href: '#achievements', text: 'ACHIEVEMENTS' },
    { href: '#testimonials', text: 'TESTIMONIALS' },
  ];

  return (
    <nav className="relative z-20 bg-white font-poppins">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <img className="h-16 w-auto" src="/assets/cbd-logo.png" alt="Crescent Blood Donors Logo" />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.text}
                href={link.href}
                className="text-gray-700 hover:text-primary-red font-bold text-sm tracking-wide transition-colors duration-300"
              >
                {link.text}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-dark-blue hover:text-primary-red focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
            {navLinks.map((link) => (
              <a
                key={link.text}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 hover:text-primary-red hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
