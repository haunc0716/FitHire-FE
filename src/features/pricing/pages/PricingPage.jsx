import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import PricingHero from '../components/PricingHero';
import PricingCards from '../components/PricingCards';
import ComparisonTable from '../components/ComparisonTable';

const PricingPage = () => {
  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-violet-100 selection:text-violet-900">
      <Navbar />

      <main className="pt-40 pb-24">
        <PricingHero />
        <PricingCards />
        <ComparisonTable />

        {/* Final CTA Section */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="bg-white border border-slate-100 p-12 md:p-16 rounded-2xl premium-shadow flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-100/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex-1 relative z-10 text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Được thiết kế cho lộ trình sự nghiệp Gen-Z.</h3>
              <p className="text-slate-500 text-lg mb-8 max-w-xl">Hơn 15,000 sinh viên tốt nghiệp đã sử dụng FitHire để chinh phục những vị trí mơ ước.</p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <button className="primary-gradient text-white font-bold px-8 py-4 rounded-lg shadow-xl shadow-violet-200 hover:scale-105 active:scale-95 transition-all">Sẵn sàng để bắt đầu?</button>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    <img alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARJ4nyK_HmLQfq5B7suD3YHXnzQoOMyUnQkDpG1fNxvsOyx5PY39qTI1zcfT2oGYuhRtzOjvXgK4tvXyChiMec9huYIIPEFx2qD8_bl59Eu3_Fw0hYodGY4Uf39jaiQXnRb5ugrSi4uNTBjxh2aamtKw63wETUJ9C4Xhj2Aag0AqIqRZDDllny7k56j3wEppdFu2PEnw4BBMamKueNLvel4hItIXIKveWOzTo8f97ZTkB5X0qHjRlHUijjIjIEBlMk2H71Za3bJr0" />
                    <img alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2_skIAfU1BsIWuXFWYYN2zHpboKxjG4vo7I8YLYCV1e_WJf2knStnUpovMJ4a-mLlObuQammTHKsW1o4dfiMzf6BOhGL0aOGWj1AS_iw3bsN1rpsqwrwNitqWSdwdQ1ndK--KQr0axlyEzOLtoblrOjG8sXS-iJ3zyvIOyhkkYVaPMIW9YICiXMFQ8aviHN2tFn5AXlZYWQ2xONv3MzXcawdM_-qiNF1XL773LwYoIF74MOvzELdQSVv_KdBcBFGay9XfSGhh0ak" />
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-[10px] font-bold border-2 border-white">+12k</div>
                  </div>
                  <span className="text-sm font-medium text-slate-400">Đã tham gia</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-[350px] relative z-10">
              <img alt="Modern workspace" className="rounded-xl shadow-2xl w-full object-cover aspect-square" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0EN29TQwktHagD9w6Tc-wHalUfNc57FNQbVX7hdD0TUE7d_EAPCl_XpaLYCeZmeWEI02S8nvsaLnmhXSonstAwrad7hV-sCCACTs-Kk2lIM3ZXV4Fr2bmECF4yYs2EWdXBGe7fXRTLi4HTut4176JCCub0nLuv93yASl0zcQZgYgtybTxaTw8koe1kdpp0luYLTkvqEX_6FdbcF2O_AjjsdBABrZHmUiEf5RYw_66Rnc5ANyRGXmSAWUbQ0rSLS0OQhUUQAtAwcY" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
