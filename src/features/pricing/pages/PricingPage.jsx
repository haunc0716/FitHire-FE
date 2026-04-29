import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import PricingHero from '../components/PricingHero';
import PricingCards from '../components/PricingCards';
import ComparisonTable from '../components/ComparisonTable';
import CTASection from '../../landing/components/CTASection';

const PricingPage = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="section-container">
          <PricingHero />
          <PricingCards />
          <ComparisonTable />
        </div>
      </main>
      <CTASection />
      <Footer />
    </div>
  );
};

export default PricingPage;
