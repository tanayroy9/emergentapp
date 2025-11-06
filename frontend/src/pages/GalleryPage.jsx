import React, { useState } from 'react';
import { X } from 'lucide-react';

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
      alt: 'African football action',
      category: 'Matches',
    },
    {
      src: 'https://images.unsplash.com/photo-1610441572339-bdf395d1c410?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
      alt: 'Youth football training',
      category: 'Youth Programs',
    },
    {
      src: 'https://images.unsplash.com/photo-1610441553250-2c124a2de988?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
      alt: 'Team celebration',
      category: 'Events',
    },
    {
      src: 'https://images.unsplash.com/photo-1751394211293-66bebbbd7149?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
      alt: 'Athletes in action',
      category: 'Matches',
    },
    {
      src: 'https://images.unsplash.com/photo-1761039808597-5639866bab8a?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
      alt: 'Sports training',
      category: 'Training',
    },
    {
      src: 'https://images.unsplash.com/photo-1761039808115-77b271985e47?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
      alt: 'Community sports',
      category: 'Youth Programs',
    },
    {
      src: 'https://images.unsplash.com/photo-1706736828642-17dec58ed7e7?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
      alt: 'Athletic training',
      category: 'Training',
    },
    {
      src: 'https://images.pexels.com/photos/12742524/pexels-photo-12742524.jpeg?w=800',
      alt: 'Team huddle',
      category: 'Events',
    },
    {
      src: 'https://images.pexels.com/photos/34515976/pexels-photo-34515976.jpeg?w=800',
      alt: 'Sports celebration',
      category: 'Events',
    },
  ];

  const categories = ['All', 'Matches', 'Events', 'Youth Programs', 'Training'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredImages =
    activeCategory === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <div className="gallery-page">
      {/* Hero Section */}
      <section
        className="relative py-32 overflow-hidden"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1610441572339-bdf395d1c410?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        data-testid="gallery-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-gold">Gallery</span>
            </h1>
            <p className="text-xl md:text-2xl text-silver">
              Capturing moments of excellence from across Africa's sporting landscape
            </p>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 bg-black border-b border-gold/20" data-testid="gallery-filters">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                data-testid={`filter-${category.toLowerCase().replace(' ', '-')}`}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-gold text-black'
                    : 'bg-transparent border border-gold/40 text-gold hover:bg-gold/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 animated-bg" data-testid="gallery-grid">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => setSelectedImage(image)}
                data-testid={`gallery-image-${index}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <p className="text-white font-semibold">{image.alt}</p>
                    <p className="text-gold text-sm">{image.category}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-gold text-black px-3 py-1 rounded-full text-xs font-bold">
                  {image.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Gallery Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900" data-testid="video-gallery">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Video <span className="text-gold">Highlights</span>
            </h2>
            <p className="text-xl text-silver">Watch our most memorable moments</p>
          </div>
          <div className="max-w-4xl mx-auto glass-card text-center">
            <p className="text-silver">
              Our video gallery showcases the most exciting moments from SAI Sports events, including
              legendary matches, youth training programs, and behind-the-scenes content. Check back soon
              for video highlights.
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          data-testid="lightbox-modal"
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gold transition-colors"
            onClick={() => setSelectedImage(null)}
            data-testid="lightbox-close"
          >
            <X size={32} />
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto rounded-lg"
              data-testid="lightbox-image"
            />
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.alt}</h3>
              <p className="text-gold">{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;