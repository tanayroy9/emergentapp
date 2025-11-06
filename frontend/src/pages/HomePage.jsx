import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Trophy, Users, Globe, TrendingUp } from 'lucide-react';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      title: 'Positioning Africa at the Heart of Global Sports Excellence',
      subtitle: 'Transforming Talent into Legacy',
      image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920',
      cta: 'Discover More',
      link: '/about',
    },
    {
      title: 'Building Champions On and Off the Field',
      subtitle: '16+ Years of Excellence in Sports Management',
      image: 'https://images.unsplash.com/photo-1610441572339-bdf395d1c410?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920',
      cta: 'Our Services',
      link: '/services',
    },
    {
      title: 'Empowering African Athletes',
      subtitle: 'Connecting Talent with World-Class Opportunities',
      image: 'https://images.unsplash.com/photo-1610441553250-2c124a2de988?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920',
      cta: 'Success Stories',
      link: '/success',
    },
    {
      title: 'Global Networks, Local Impact',
      subtitle: 'Partnered with FC Barcelona, CAF & Leading Clubs',
      image: 'https://images.unsplash.com/photo-1751394211293-66bebbbd7149?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920',
      cta: 'View Gallery',
      link: '/gallery',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const stats = [
    { icon: Trophy, value: '434+', label: 'Finished Projects' },
    { icon: TrendingUp, value: '16+', label: 'Years in Business' },
    { icon: Users, value: '178+', label: 'Staff & Freelancers' },
    { icon: Globe, value: '257+', label: 'Happy Clients' },
  ];

  const services = [
    {
      title: 'Athlete Representation',
      description: 'Comprehensive 360° suite of sports management services',
      icon: '🏆',
    },
    {
      title: 'Talent Development',
      description: 'Identifying and nurturing emerging athletes with professional training',
      icon: '⚽',
    },
    {
      title: 'Event Management',
      description: 'Planning and executing world-class sporting events',
      icon: '🎯',
    },
    {
      title: 'Branding & Sponsorship',
      description: 'Building powerful athlete and club brands',
      icon: '💼',
    },
    {
      title: 'International Networking',
      description: 'Connecting with global partners and creating pathways',
      icon: '🌍',
    },
    {
      title: 'Sports Marketing',
      description: 'Enhancing reputation and commercial value',
      icon: '📈',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Banner Carousel */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden" data-testid="hero-banner">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            data-testid={`banner-slide-${index}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
            </div>
            <div className="relative h-full container mx-auto px-4 flex items-center">
              <div className="max-w-2xl animated-bg">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                  {banner.title}
                </h1>
                <p className="text-xl md:text-2xl text-silver mb-8">{banner.subtitle}</p>
                <Link to={banner.link} data-testid={`banner-cta-${index}`} className="btn-gold inline-block">
                  {banner.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          data-testid="banner-prev-button"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold text-white p-3 rounded-full transition-all z-10"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          data-testid="banner-next-button"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold text-white p-3 rounded-full transition-all z-10"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              data-testid={`banner-dot-${index}`}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-gold w-8' : 'bg-silver/50 hover:bg-silver'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black border-y border-gold/20" data-testid="stats-section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center" data-testid={`stat-${index}`}>
                  <Icon className="w-12 h-12 mx-auto mb-4 text-gold" />
                  <div className="text-4xl md:text-5xl font-bold text-gold mb-2">{stat.value}</div>
                  <div className="text-silver">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 animated-bg" data-testid="welcome-section">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to <span className="text-gold">SAI Sports</span>
            </h2>
            <p className="text-xl text-silver mb-8">
              We are an ecosystem that harnesses the power of sport to inspire positive social change.
              With over 16 years of proven expertise, we transform African sporting potential into
              global excellence.
            </p>
            <Link to="/about" data-testid="welcome-cta" className="btn-gold inline-block">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900" data-testid="services-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-gold">Services</span>
            </h2>
            <p className="text-xl text-silver">Comprehensive sports management solutions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="glass-card" data-testid={`service-card-${index}`}>
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gold mb-3">{service.title}</h3>
                <p className="text-silver">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/services" data-testid="services-cta" className="btn-outline-gold inline-block">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 animated-bg relative overflow-hidden" data-testid="cta-section">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1761039808597-5639866bab8a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center glass-card">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Take Your Sports Career to the Next Level?
            </h2>
            <p className="text-xl text-silver mb-8">
              Let's connect and discuss how SAI Sports can help you achieve your goals
            </p>
            <Link to="/contact" data-testid="cta-button" className="btn-gold inline-block">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;