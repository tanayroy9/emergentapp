import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, Award, Globe } from 'lucide-react';

const AboutPage = () => {
  const missions = [
    {
      title: 'Empowering African Athletes',
      description:
        'To nurture, manage, and connect African sports talent with world-class opportunities through integrity, innovation, and expertise.',
    },
    {
      title: 'Building Champions On and Off the Field',
      description:
        'To guide every athlete\'s journey from grassroots discovery to international success through holistic sports management solutions.',
    },
    {
      title: 'Transforming Talent into Legacy',
      description:
        'To develop future legends by providing full-circle support, education, and exposure that ensure long-term career and personal growth.',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Integrity',
      description: 'Operating with transparency and ethical standards in all partnerships',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Delivering world-class services and results for our clients',
    },
    {
      icon: Globe,
      title: 'Innovation',
      description: 'Embracing new strategies and technologies in sports management',
    },
  ];

  const networks = [
    {
      region: 'Africa',
      partners: ['Confederation of African Football (CAF)', 'National Federations', 'Top African Clubs'],
    },
    {
      region: 'Europe',
      partners: ['FC Barcelona', 'Leading European Clubs', 'International Scouts Network'],
    },
    {
      region: 'South America',
      partners: ['Brazilian National Team', 'Affiliated Academies', 'Technical Excellence Programs'],
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section
        className="relative py-32 overflow-hidden"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1761039808115-77b271985e47?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        data-testid="about-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="text-gold">SAI Sports</span>
            </h1>
            <p className="text-xl md:text-2xl text-silver">
              Africa's leading sports consultancy transforming the continent's sporting potential into
              global excellence
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 animated-bg" data-testid="vision-mission-section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Vision */}
            <div className="glass-card" data-testid="vision-card">
              <Eye className="w-12 h-12 text-gold mb-4" />
              <h2 className="text-3xl font-bold mb-4">
                Our <span className="text-gold">Vision</span>
              </h2>
              <p className="text-lg text-silver">
                To be Africa's leading sports consultancy and management company that transforms the
                continent's sporting potential into global excellence through innovation, professionalism,
                and sustainable partnerships.
              </p>
            </div>

            {/* Mission */}
            <div className="glass-card" data-testid="mission-card">
              <Target className="w-12 h-12 text-gold mb-4" />
              <h2 className="text-3xl font-bold mb-4">
                Our <span className="text-gold">Mission</span>
              </h2>
              <div className="space-y-4">
                {missions.map((mission, index) => (
                  <div key={index}>
                    <h3 className="text-gold font-semibold mb-2">{mission.title}</h3>
                    <p className="text-silver">{mission.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-gold">Values</span>
            </h2>
            <p className="text-xl text-silver">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="glass-card text-center" data-testid={`value-card-${index}`}>
                  <Icon className="w-16 h-16 mx-auto mb-4 text-gold" />
                  <h3 className="text-2xl font-bold text-gold mb-3">{value.title}</h3>
                  <p className="text-silver">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900" data-testid="experience-section">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
              <span className="text-gold">16+ Years</span> of Excellence
            </h2>
            <div className="glass-card mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold mb-2">134+</div>
                  <div className="text-silver">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold mb-2">16+</div>
                  <div className="text-silver">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold mb-2">178+</div>
                  <div className="text-silver">Team Members</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold mb-2">257+</div>
                  <div className="text-silver">Happy Clients</div>
                </div>
              </div>
              <p className="text-lg text-silver text-center">
                With a proven track record spanning over 16 years, SAI Sports has successfully delivered
                more than 20 major football and sporting events across Africa and beyond, partnering with
                global clubs and federations to establish a trusted legacy of excellence.
              </p>
            </div>

            {/* Directors Section */}
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Our <span className="text-gold">Leadership</span>
              </h3>
              <p className="text-xl text-silver">Meet the directors driving SAI Sports forward</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Director 1 */}
              <div className="glass-card text-center flex flex-col items-center" data-testid="director-1">
                <div className="mb-6 flex items-center justify-center">
                  <img
                    src="https://customer-assets.emergentagent.com/job_sai-sports-mgmt/artifacts/44dhtktz_4.png"
                    alt="Youshen Naidoo"
                    className="w-48 h-48 object-cover rounded-full border-4 border-gold/30"
                  />
                </div>
                <h4 className="text-2xl font-bold text-gold mb-2">Youshen Naidoo</h4>
                <p className="text-lg text-silver mb-4">Director: Finance and Operations</p>
                <div className="text-sm text-silver space-y-1">
                  <p>
                    <a href="mailto:yn@saisports.co.za" className="hover:text-gold transition-colors">
                      yn@saisports.co.za
                    </a>
                  </p>
                  <p>
                    <a href="tel:+27827414722" className="hover:text-gold transition-colors">
                      +27 82 741 4722
                    </a>
                  </p>
                </div>
              </div>

              {/* Director 2 */}
              <div className="glass-card text-center flex flex-col items-center" data-testid="director-2">
                <div className="mb-6 flex items-center justify-center">
                  <img
                    src="https://customer-assets.emergentagent.com/job_sai-sports-mgmt/artifacts/foq0nybo_5.png"
                    alt="Tichaona Mawoni"
                    className="w-48 h-48 object-cover rounded-full border-4 border-gold/30"
                  />
                </div>
                <h4 className="text-2xl font-bold text-gold mb-2">Tichaona Mawoni</h4>
                <p className="text-lg text-silver mb-4">Director: Sales and Marketing</p>
                <div className="text-sm text-silver space-y-1">
                  <p>
                    <a href="mailto:tm@saisports.co.za" className="hover:text-gold transition-colors">
                      tm@saisports.co.za
                    </a>
                  </p>
                  <p>
                    <a href="tel:+27656509338" className="hover:text-gold transition-colors">
                      +27 65 650 9338
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Networks & Partnerships */}
      <section className="py-20 animated-bg" data-testid="networks-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Global <span className="text-gold">Networks</span>
            </h2>
            <p className="text-xl text-silver">
              Partnerships spanning Africa, Europe, South America, and Asia
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {networks.map((network, index) => (
              <div key={index} className="glass-card" data-testid={`network-card-${index}`}>
                <h3 className="text-2xl font-bold text-gold mb-4">{network.region}</h3>
                <ul className="space-y-2">
                  {network.partners.map((partner, idx) => (
                    <li key={idx} className="text-silver flex items-start">
                      <span className="text-gold mr-2">•</span>
                      {partner}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black" data-testid="about-cta">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center glass-card">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Partner with <span className="text-gold">Africa's Leading</span> Sports Consultancy?
            </h2>
            <p className="text-xl text-silver mb-8">
              Join our network of successful athletes, clubs, and organizations
            </p>
            <Link to="/contact" data-testid="about-cta-button" className="btn-gold inline-block">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;