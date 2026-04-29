import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import FeaturesHero from '../components/FeaturesHero';
import BentoFeatures from '../components/BentoFeatures';
import CTASection from '../components/CTASection';

const FeaturesPage = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="section-container">
          <FeaturesHero />
          <BentoFeatures />
        </div>
      </main>
      <CTASection />
      <Footer />
    </div>
  );
};

export default FeaturesPage;
