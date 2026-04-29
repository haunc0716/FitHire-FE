import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import HeroSection from '../components/HeroSection';
import FeaturesGrid from '../components/FeaturesGrid';
import ProcessSteps from '../components/ProcessSteps';
import TrustSection from '../components/TrustSection';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';

const HomePage = () => {
  return (
    <div className="bg-white text-zinc-900 font-body antialiased">
      <Navbar />
      <HeroSection />
      <TrustSection />
      <FeaturesGrid />
      <ProcessSteps />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
