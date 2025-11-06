import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/App.css';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import SuccessPage from '@/pages/SuccessPage';
import GalleryPage from '@/pages/GalleryPage';
import ContactPage from '@/pages/ContactPage';
import Layout from '@/components/Layout';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;