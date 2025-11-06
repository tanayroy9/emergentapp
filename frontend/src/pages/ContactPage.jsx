import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: [
        { label: 'Youshen Naidoo', value: '+27 82 741 4722' },
        { label: 'Tichaona Mawoni', value: '+27 65 650 9338' },
      ],
    },
    {
      icon: Mail,
      title: 'Email',
      details: [
        { label: 'Youshen', value: 'yn@saisports.co.za' },
        { label: 'Tichaona', value: 'tm@saisports.co.za' },
        { label: 'General', value: 'info@saisports.online' },
      ],
    },
    {
      icon: MapPin,
      title: 'Office',
      details: [
        { label: '', value: '13 Amalinda Street' },
        { label: '', value: 'Sandown-Estate, Sandton' },
        { label: '', value: 'Johannesburg, South Africa' },
      ],
    },
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section
        className="relative py-32 overflow-hidden"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1761039808597-5639866bab8a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        data-testid="contact-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get In <span className="text-gold">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-silver">
              Let's discuss how SAI Sports can help transform your sporting journey
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 animated-bg" data-testid="contact-info">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="glass-card text-center" data-testid={`contact-info-${index}`}>
                  <Icon className="w-12 h-12 mx-auto mb-4 text-gold" />
                  <h3 className="text-2xl font-bold text-gold mb-4">{info.title}</h3>
                  <div className="space-y-2">
                    {info.details.map((detail, idx) => (
                      <div key={idx} className="text-silver">
                        {detail.label && <span className="text-sm text-gold">{detail.label}: </span>}
                        <span className="text-sm">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto">
            <div className="glass-card">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
                Send Us a <span className="text-gold">Message</span>
              </h2>
              <form onSubmit={handleSubmit} data-testid="contact-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-silver mb-2 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      data-testid="contact-name-input"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-silver mb-2 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      data-testid="contact-email-input"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-silver mb-2 font-medium">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    data-testid="contact-phone-input"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-silver mb-2 font-medium">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    data-testid="contact-message-input"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 bg-black/50 border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your needs..."
                  />
                </div>
                <button
                  type="submit"
                  data-testid="contact-submit-button"
                  disabled={isSubmitting}
                  className="w-full btn-gold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map/Additional Info */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900" data-testid="additional-info">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Visit Our <span className="text-gold">Office</span>
              </h2>
              <p className="text-xl text-silver mb-4">
                Located in the heart of Sandton, Johannesburg, we welcome visitors by appointment.
                Contact us to schedule a meeting.
              </p>
            </div>
            <div className="glass-card">
              {/* Google Maps Embed */}
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  title="SAI Sports Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3583.0234671234567!2d28.0547!3d-26.1076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA2JzI3LjQiUyAyOMKwMDMnMTYuOSJF!5e0!3m2!1sen!2sza!4v1234567890!5m2!1sen!2sza&q=13+Amalinda+Street,+Sandown+Estate,+Sandton,+Johannesburg,+South+Africa"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  data-testid="google-maps-iframe"
                />
              </div>
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-gold mb-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">Our Address</span>
                </div>
                <p className="text-silver">
                  13 Amalinda Street, Sandown-Estate
                  <br />
                  Sandton, Johannesburg
                  <br />
                  South Africa
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;