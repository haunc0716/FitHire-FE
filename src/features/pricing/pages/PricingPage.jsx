import React, { Suspense } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import PricingHero from '../components/PricingHero';
import ComparisonTable from '../components/ComparisonTable';
import CTASection from '../../landing/components/CTASection';

const PricingCards = React.lazy(() => import('../components/PricingCards'));

const PricingPage = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="section-container">
          <PricingHero />
          <Suspense fallback={<div className="h-[420px] rounded-2xl border border-stone-100 bg-stone-50 animate-pulse" />}>
            <PricingCards />
          </Suspense>
          <ComparisonTable />
        </div>
      </main>
      <CTASection />
      <Footer />
    </div>
  );
};

export default PricingPage;
