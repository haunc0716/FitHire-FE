import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import FeaturesHero from '../components/FeaturesHero';
import BentoFeatures from '../components/BentoFeatures';

const FeaturesPage = () => {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased">
      <Navbar />

      <main className="pt-40 pb-24 px-6 md:px-12 max-w-[1280px] mx-auto">
        <FeaturesHero />
        <BentoFeatures />

        {/* Subtle Final CTA */}
        <section className="mt-32 mb-16 py-16 text-center border-t border-black/5">
          <h2 className="text-3xl font-bold mb-6">Bắt đầu bước tiến tiếp theo của bạn ngay hôm nay.</h2>
          <p className="text-on-surface-variant mb-10 max-w-xl mx-auto">Tham gia cùng hơn 50.000 chuyên gia đã tăng tốc con đường sự nghiệp cùng FitHire.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="bg-primary text-white px-10 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all transform active:scale-95 shadow-lg shadow-primary/20">Khám phá miễn phí</button>
            <button className="text-on-surface border border-black/10 px-10 py-4 rounded-lg font-semibold hover:bg-black/5 transition-all transform active:scale-95">Xem bản demo</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
