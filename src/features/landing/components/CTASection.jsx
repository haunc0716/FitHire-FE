import React from 'react';

const CTASection = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-h2 text-3xl text-slate-900 mb-4 tracking-tight">Sẵn sàng để bước tiếp trong sự nghiệp?</h2>
          <p className="text-slate-500 text-lg mb-10">Gia nhập cộng đồng 10,000+ chuyên gia đang sử dụng FitHire để tối ưu hóa lộ trình thăng tiến của mình.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-10 py-4 bg-primary text-white rounded font-button text-base hover:shadow-xl hover:shadow-primary/20 transition-all">Bắt đầu miễn phí ngay</button>
            <button className="px-10 py-4 bg-transparent text-slate-600 font-button text-base hover:text-primary transition-all">Liên hệ tư vấn doanh nghiệp</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
