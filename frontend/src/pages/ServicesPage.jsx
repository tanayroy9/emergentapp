import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  Calendar,
  Award,
  Globe,
  BarChart3,
  Building,
  Target,
} from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      icon: Users,
      title: 'Athlete Representation',
      description:
        'Comprehensive 360° suite of sports management and consultancy services. We represent athletes with integrity, ensuring their interests are protected while maximizing opportunities for career growth and success.',
      features: [
        'Contract negotiations',
        'Career planning',
        'Legal support',
        'Financial advisory',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Talent Development',
      description:
        'Identifying, nurturing, and guiding emerging athletes with professional training, mentorship, and global exposure opportunities. We invest in the future of African sports talent.',
      features: [
        'Youth scouting programs',
        'Professional training',
        'Mentorship programs',
        'International exposure',
      ],
    },
    {
      icon: Calendar,
      title: 'Event Management',
      description:
        'Planning, organizing, and executing world-class sporting events from local tournaments to international showcases. With over 434 events delivered, we bring excellence to every project.',
      features: [
        'Tournament organization',
        'Logistics coordination',
        'Venue management',
        'Media coverage',
      ],
    },
    {
      icon: Award,
      title: 'Branding & Sponsorship',
      description:
        'Building powerful athlete and club brands through tailored marketing strategies, sponsorship activations, and media visibility. We transform talent into marketable brands.',
      features: [
        'Brand strategy',
        'Sponsorship deals',
        'Marketing campaigns',
        'Social media management',
      ],
    },
    {
      icon: Globe,
      title: 'International Networking',
      description:
        'Connecting with global partners and creating pathways for African talent. Our networks span Europe, South America, and Asia, opening doors to international opportunities.',
      features: [
        'Club partnerships',
        'Scout connections',
        'Transfer facilitation',
        'Global exposure',
      ],
    },
    {
      icon: BarChart3,
      title: 'Sports Marketing',
      description:
        'Enhancing reputation and commercial value for athletes and clubs through strategic marketing initiatives. We position our clients at the forefront of the sports industry.',
      features: [
        'Market analysis',
        'Digital marketing',
        'PR campaigns',
        'Brand partnerships',
      ],
    },
    {
      icon: Building,
      title: 'Sports Infrastructure Development',
      description:
        'Advising and supporting the design, planning, and development of modern sports facilities, academies, and community hubs that serve as foundations for sporting excellence.',
      features: [
        'Facility planning',
        'Academy development',
        'Infrastructure consulting',
        'Community programs',
      ],
    },
    {
      icon: Target,
      title: 'Host City Consulting',
      description:
        'Expert guidance for cities and regions looking to host major sporting events. We provide comprehensive consulting services to ensure successful event delivery.',
      features: [
        'Bid preparation',
        'Venue assessment',
        'Operational planning',
        'Legacy planning',
      ],
    },
  ];

  const expertise = [
    'Football (Soccer)',
    'Basketball',
    'Athletics',
    'Rugby',
    'Cricket',
    'Multi-sport Events',
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section
        className="relative py-32 overflow-hidden"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1706736828642-17dec58ed7e7?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        data-testid="services-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-gold">Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-silver">
              Comprehensive sports management solutions tailored for African excellence
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 animated-bg" data-testid="services-intro">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              360° <span className="text-gold">Sports Management</span> Solutions
            </h2>
            <p className="text-lg text-silver">
              At SAI Sports, we provide a complete ecosystem of services designed to support athletes,
              clubs, and organizations throughout their journey. With over 16 years of expertise and 434+
              successful projects, we deliver excellence in every engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900" data-testid="services-grid">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="glass-card" data-testid={`service-detail-${index}`}>
                  <Icon className="w-12 h-12 text-gold mb-4" />
                  <h3 className="text-2xl font-bold text-gold mb-3">{service.title}</h3>
                  <p className="text-silver mb-4">{service.description}</p>
                  <div className="border-t border-gold/20 pt-4">
                    <h4 className="text-sm font-semibold text-gold mb-2">Key Features:</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-silver flex items-start">
                          <span className="text-gold mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20 animated-bg" data-testid="expertise-section">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Our <span className="text-gold">Expertise</span>
              </h2>
              <p className="text-xl text-silver">
                Specialized knowledge across multiple sports disciplines
              </p>
            </div>
            <div className="glass-card">
              <p className="text-lg text-silver mb-6">
                While primarily focused on football, SAI Sports has extensive networks and partnerships
                with clubs, federations, agencies, and players across Europe's top leagues, South
                America's football academies, and Africa's emerging football markets.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {expertise.map((sport, index) => (
                  <div
                    key={index}
                    className="bg-black/30 border border-gold/20 rounded-lg p-4 text-center hover:border-gold/40 transition-colors"
                    data-testid={`expertise-${index}`}
                  >
                    <span className="text-gold font-semibold">{sport}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black" data-testid="process-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-gold">Process</span>
            </h2>
            <p className="text-xl text-silver">How we deliver excellence for our clients</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Consultation', desc: 'Understanding your needs and goals' },
                { step: '02', title: 'Strategy', desc: 'Developing tailored solutions' },
                { step: '03', title: 'Execution', desc: 'Implementing with excellence' },
                { step: '04', title: 'Growth', desc: 'Continuous support and optimization' },
              ].map((item, index) => (
                <div key={index} className="text-center" data-testid={`process-step-${index}`}>
                  <div className="text-5xl font-bold text-gold mb-3">{item.step}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-silver text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 animated-bg" data-testid="services-cta">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center glass-card">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to <span className="text-gold">Transform</span> Your Sports Career?
            </h2>
            <p className="text-xl text-silver mb-8">
              Let's discuss how our services can help you achieve your goals
            </p>
            <Link to="/contact" data-testid="services-cta-button" className="btn-gold inline-block">
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;