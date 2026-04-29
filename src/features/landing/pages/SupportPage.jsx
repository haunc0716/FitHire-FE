import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import SupportHero from '../components/SupportHero';
import SupportChannels from '../components/SupportChannels';
import FAQSection from '../components/FAQSection';
import SupportContact from '../components/SupportContact';

const SupportPage = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="section-container">
          <SupportHero />
          <SupportChannels />
          <FAQSection />
        </div>
      </main>
      <SupportContact />
      <Footer />
    </div>
  );
};

export default SupportPage;
