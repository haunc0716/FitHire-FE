import React from 'react';
import { Bot } from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import SupportHero from '../components/SupportHero';
import SupportChannels from '../components/SupportChannels';
import FAQSection from '../components/FAQSection';
import SupportContact from '../components/SupportContact';

const SupportPage = () => {
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased">
      <Navbar />
      <main className="pt-32 pb-xl px-6">
        <div className="max-w-[1280px] mx-auto">
          <SupportHero />
          <SupportChannels />
          <FAQSection />
          <SupportContact />
        </div>
      </main>

      {/* Floating Chatbot Icon */}
      <div className="fixed bottom-8 right-8 z-[100] group">
        <div className="absolute -top-12 right-0 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
          Trò chuyện với FitBot
        </div>
        <button className="bg-primary text-white w-16 h-16 rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300">
          <Bot className="w-8 h-8" />
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default SupportPage;
