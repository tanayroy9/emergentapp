import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Success Stories', path: '/success' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 modern-nav-gradient backdrop-blur-md border-b border-gold/30">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="hidden md:flex items-center justify-between py-2 border-b border-gold/10">
            <div className="flex items-center gap-6 text-sm">
              <a href="tel:+27656509338" className="flex items-center gap-2 text-silver hover:text-gold transition-colors" data-testid="header-phone">
                <Phone size={16} />
                <span>+27 65 650 9338</span>
              </a>
              <a href="mailto:info@saisports.online" className="flex items-center gap-2 text-silver hover:text-gold transition-colors" data-testid="header-email">
                <Mail size={16} />
                <span>info@saisports.online</span>
              </a>
            </div>
            <div className="text-sm text-silver">
              Johannesburg, South Africa
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
              <img 
                src="https://customer-assets.emergentagent.com/job_sai-sports-mgmt/artifacts/osi8hfrr_1.png" 
                alt="SAI Sports" 
                className="h-16 md:h-20 lg:h-24 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                  className={`text-sm font-medium transition-colors relative group ${
                    isActive(item.path) ? 'text-gold' : 'text-silver hover:text-gold'
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gold transform origin-left transition-transform ${
                      isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <Link
              to="/contact"
              data-testid="header-cta-button"
              className="hidden lg:block btn-gold text-sm"
            >
              Get Started
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gold p-2"
              data-testid="mobile-menu-button"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/95 border-t border-gold/20" data-testid="mobile-menu">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  data-testid={`mobile-nav-${item.name.toLowerCase().replace(' ', '-')}`}
                  className={`text-base font-medium transition-colors ${
                    isActive(item.path) ? 'text-gold' : 'text-silver hover:text-gold'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                data-testid="mobile-cta-button"
                className="btn-gold text-center"
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-32 md:pt-36">{children}</main>

      {/* Footer */}
      <footer className="bg-black border-t border-gold/20 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <img 
                src="https://customer-assets.emergentagent.com/job_sai-sports-mgmt/artifacts/osi8hfrr_1.png" 
                alt="SAI Sports" 
                className="h-16 w-auto object-contain mb-4"
              />
              <p className="text-silver text-sm mb-4">
                Positioning Africa at the Heart of Global Sports Excellence
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-gold font-semibold mb-4">Explore</h4>
              <ul className="space-y-2">
                {navItems.slice(0, 4).map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      data-testid={`footer-${item.name.toLowerCase().replace(' ', '-')}`}
                      className="text-silver text-sm hover:text-gold transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-gold font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-silver text-sm">
                <li>Athlete Representation</li>
                <li>Talent Development</li>
                <li>Event Management</li>
                <li>Sports Marketing</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-gold font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-silver text-sm">
                <li>13 Amalinda Street</li>
                <li>Sandown-Estate, Sandton</li>
                <li>Johannesburg, South Africa</li>
                <li className="pt-2">
                  <a href="tel:+27656509338" className="hover:text-gold transition-colors" data-testid="footer-phone">
                    +27 65 650 9338
                  </a>
                </li>
                <li>
                  <a href="mailto:info@saisports.online" className="hover:text-gold transition-colors" data-testid="footer-email">
                    info@saisports.online
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gold/20 mt-8 pt-8 text-center text-silver text-sm">
            <p>© {new Date().getFullYear()} SAI Sports Consultants. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;