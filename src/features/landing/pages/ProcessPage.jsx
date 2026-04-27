import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import ProcessHero from '../components/ProcessHero';
import ProcessSteps from '../components/ProcessSteps';
import ProcessFeatures from '../components/ProcessFeatures';
import ProcessCTA from '../components/ProcessCTA';

const ProcessPage = () => {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased">
      <Navbar />
      <main className="pt-40 pb-xl px-6">
        <ProcessHero />
        <ProcessSteps />
        <ProcessFeatures />
        <ProcessCTA />
      </main>
      <Footer />
    </div>
  );
};

export default ProcessPage;
