import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

const SuccessPage = () => {
  const events = [
    {
      year: '2024',
      title: 'F.C Barcelona Legends vs Ghana Legends',
      location: 'Ghana',
    },
    {
      year: '2023',
      title: 'F.C Barcelona Legends vs DRC Legends',
      location: 'Democratic Republic of Congo',
    },
    {
      year: '2023',
      title: 'Africa Legends vs Zambia Legends',
      location: 'Zambia',
    },
    {
      year: '2023',
      title: 'F.C Barcelona Legends vs Zambia Legends',
      location: 'Zambia',
    },
    {
      year: '2019',
      title: 'Sevilla F.C vs Simba F.C',
      location: 'Tanzania',
    },
    {
      year: '2018',
      title: 'Nelson Mandela Centenary - F.C Barcelona vs Mamelodi Sundowns',
      location: 'South Africa',
    },
    {
      year: '2018',
      title: 'F.C Barcelona Legends Botswana State House Visit & Youth Program',
      location: 'Botswana',
    },
    {
      year: '2017',
      title: 'F.C Barcelona Legends vs Mozambique Mambas',
      location: 'Mozambique',
    },
    {
      year: '2017',
      title: 'F.C Barcelona Legends vs Zimbabwe',
      location: 'Zimbabwe',
    },
    {
      year: '2017',
      title: 'Neymar Jr Livingstone Visit',
      location: 'Zambia',
    },
    {
      year: '2015',
      title: 'F.C Barcelona Legends vs Tanzania Legends',
      location: 'Tanzania',
    },
    {
      year: '2015',
      title: 'Real Madrid Legends vs Tanzania Legends',
      location: 'Tanzania',
    },
  ];

  const achievements = [
    { label: 'Major Events', value: '20+', icon: Calendar },
    { label: 'Countries Reached', value: '15+', icon: MapPin },
    { label: 'Athletes Represented', value: '100+', icon: Users },
  ];

  return (
    <div className="success-page">
      {/* Hero Section */}
      <section
        className="relative py-32 overflow-hidden"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1751394211293-66bebbbd7149?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        data-testid="success-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-gold">Success Stories</span>
            </h1>
            <p className="text-xl md:text-2xl text-silver">
              16+ years of delivering world-class sporting events across Africa
            </p>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-black border-y border-gold/20" data-testid="achievements-section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="text-center" data-testid={`achievement-${index}`}>
                  <Icon className="w-12 h-12 mx-auto mb-4 text-gold" />
                  <div className="text-5xl font-bold text-gold mb-2">{achievement.value}</div>
                  <div className="text-silver">{achievement.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 animated-bg" data-testid="success-intro">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              A Legacy of <span className="text-gold">Excellence</span>
            </h2>
            <p className="text-lg text-silver">
              SAI Sports has successfully delivered over 20 major football and sporting events across
              Africa and beyond. Our partnerships with legendary clubs like FC Barcelona, Real Madrid,
              Sevilla, and collaborations with national teams have brought world-class football to
              African audiences while empowering local talent.
            </p>
          </div>
        </div>
      </section>

      {/* Events Timeline */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900" data-testid="events-timeline">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Milestone <span className="text-gold">Events</span>
            </h2>
            <p className="text-xl text-silver">Bringing global football excellence to Africa</p>
          </div>
          
          {/* Timeline Container */}
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-gold via-gold/50 to-gold" />
              
              {/* Timeline Events */}
              <div className="space-y-12">
                {events.map((event, index) => (
                  <div key={index} className="relative" data-testid={`event-timeline-${index}`}>
                    {/* Year Badge on Timeline */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-6">
                      <div className="bg-gold text-black font-bold text-xl px-6 py-3 rounded-full shadow-lg border-4 border-black z-10">
                        {event.year}
                      </div>
                    </div>
                    
                    {/* Event Details - Alternating Left/Right */}
                    <div className={`flex items-start ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12 text-right' : 'md:pl-12 text-left'}`}>
                        <div className="glass-card mt-12">
                          <h3 className="text-lg md:text-xl font-bold text-gold mb-2">{event.title}</h3>
                          <div className={`flex items-center gap-2 text-silver text-sm ${
                            index % 2 === 0 ? 'justify-end' : 'justify-start'
                          }`}>
                            <MapPin size={16} />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 animated-bg" data-testid="impact-section">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Our <span className="text-gold">Impact</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card">
                <h3 className="text-2xl font-bold text-gold mb-4">Youth Empowerment</h3>
                <p className="text-silver">
                  Through our events and programs, we've provided opportunities for thousands of young
                  African athletes to interact with football legends, access professional training, and
                  gain exposure to international standards of excellence.
                </p>
              </div>
              <div className="glass-card">
                <h3 className="text-2xl font-bold text-gold mb-4">Cultural Exchange</h3>
                <p className="text-silver">
                  Our partnerships have facilitated meaningful cultural exchanges between African and
                  international football communities, strengthening ties and creating pathways for talent
                  development.
                </p>
              </div>
              <div className="glass-card">
                <h3 className="text-2xl font-bold text-gold mb-4">Economic Growth</h3>
                <p className="text-silver">
                  Major sporting events organized by SAI Sports have generated significant economic
                  activity in host cities, supporting local businesses and creating employment
                  opportunities.
                </p>
              </div>
              <div className="glass-card">
                <h3 className="text-2xl font-bold text-gold mb-4">Global Recognition</h3>
                <p className="text-silver">
                  Our successful delivery of high-profile events has positioned African nations as capable
                  hosts for international sporting occasions, enhancing the continent's reputation in the
                  global sports industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black" data-testid="testimonials-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Our <span className="text-gold">Partners</span> Say
            </h2>
          </div>
          <div className="max-w-4xl mx-auto glass-card text-center">
            <p className="text-xl text-silver italic mb-6">
              "SAI Sports has been instrumental in bringing world-class football experiences to Africa.
              Their professionalism, dedication, and deep understanding of both international and local
              markets make them an invaluable partner."
            </p>
            <p className="text-gold font-semibold">- Partner Testimonial</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SuccessPage;