import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import HeroSection from '../components/HeroSection';
import FeaturesGrid from '../components/FeaturesGrid';
import CTASection from '../components/CTASection';

const HomePage = () => {
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
