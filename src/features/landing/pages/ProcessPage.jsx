import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import ProcessHero from '../components/ProcessHero';
import ProcessSteps from '../components/ProcessSteps';
import CTASection from '../components/CTASection';

const ProcessPage = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="section-container">
          <ProcessHero />
          <ProcessSteps />
        </div>
      </main>
      <CTASection />
      <Footer />
    </div>
  );
};

export default ProcessPage;
