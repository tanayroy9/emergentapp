import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

const SuccessPage = () => {
  const events = [
    {
      year: '2024',
      title: 'F.C Barcelona Legends vs Ghana Legends',
      location: 'Ghana',
      image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    },
    {
      year: '2023',
      title: 'F.C Barcelona Legends vs DRC Legends',
      location: 'Democratic Republic of Congo',
      image: 'https://images.unsplash.com/photo-1610441572339-bdf395d1c410?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    },
    {
      year: '2023',
      title: 'Africa Legends vs Zambia Legends',
      location: 'Zambia',
      image: 'https://images.unsplash.com/photo-1610441553250-2c124a2de988?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    },
    {
      year: '2023',
      title: 'F.C Barcelona Legends vs Zambia Legends',
      location: 'Zambia',
      image: 'https://images.unsplash.com/photo-1751394211293-66bebbbd7149?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    },
    {
      year: '2019',
      title: 'Sevilla F.C vs Simba F.C',
      location: 'Tanzania',
      image: 'https://images.unsplash.com/photo-1761039808597-5639866bab8a?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    },
    {
      year: '2018',
      title: 'Nelson Mandela Centenary - F.C Barcelona vs Mamelodi Sundowns',
      location: 'South Africa',
      image: 'https://images.unsplash.com/photo-1761039808115-77b271985e47?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    },
    {
      year: '2018',
      title: 'F.C Barcelona Legends Botswana State House Visit & Youth Program',
      location: 'Botswana',
      image: 'https://images.unsplash.com/photo-1706736828642-17dec58ed7e7?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    },
    {
      year: '2017',
      title: 'F.C Barcelona Legends vs Mozambique Mambas',
      location: 'Mozambique',
      image: 'https://images.pexels.com/photos/12742524/pexels-photo-12742524.jpeg?w=800',
    },
    {
      year: '2017',
      title: 'F.C Barcelona Legends vs Zimbabwe',
      location: 'Zimbabwe',
      image: 'https://images.pexels.com/photos/34515976/pexels-photo-34515976.jpeg?w=800',
    },
    {
      year: '2017',
      title: 'Neymar Jr Livingstone Visit',
      location: 'Zambia',
      image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    },
    {
      year: '2015',
      title: 'F.C Barcelona Legends vs Tanzania Legends',
      location: 'Tanzania',
      image: 'https://images.unsplash.com/photo-1610441572339-bdf395d1c410?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
    },
    {
      year: '2015',
      title: 'Real Madrid Legends vs Tanzania Legends',
      location: 'Tanzania',
      image: 'https://images.unsplash.com/photo-1610441553250-2c124a2de988?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div key={index} className="glass-card group" data-testid={`event-card-${index}`}>
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-gold text-black px-3 py-1 rounded-full font-bold text-sm">
                    {event.year}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gold mb-2">{event.title}</h3>
                <div className="flex items-center text-silver text-sm">
                  <MapPin size={16} className="mr-2" />
                  {event.location}
                </div>
              </div>
            ))}
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

      {/* Testimonials (Placeholder) */}
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