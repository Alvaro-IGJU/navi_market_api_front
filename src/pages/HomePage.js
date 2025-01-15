import React from 'react';
import AuroraBackground from './AuroraBackground';
import HeroSection from './HeroSection';
import FeatureSection from './FeaturesSection';
import ContactForm from './ContactForm';
import Footer from './Footer';
import LogoSlider from './LogoSlider';

const HomePage = () => {
  return (
    <div className="relative min-h-screen font-sans text-[#FBFDF0]">
      {/* Fondo animado */}
      <AuroraBackground />

      {/* Sección Hero */}
      <HeroSection />

      {/* Sección de Características */}
      <FeatureSection />

      {/* Slider de Logos */}
      <LogoSlider />
      
      {/* Formulario de Contacto */}
      <ContactForm />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
