import React from 'react';

const CTASection = () => {
  return (
    <section className="bg-zinc-950 py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-h2 text-white mb-8">SẴN SÀNG CHO BƯỚC TIẾP THEO?</h2>
        <p className="text-zinc-500 mb-12 max-w-xl mx-auto">
          Tham gia cùng hàng nghìn sinh viên và chuyên gia đã tối ưu hóa sự nghiệp cùng FitHire.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="bg-white text-zinc-950 px-10 py-4 font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors">
            Đăng ký miễn phí
          </button>
          <button className="border border-zinc-700 text-white px-10 py-4 font-bold uppercase tracking-widest hover:border-white transition-colors">
            Liên hệ ngay
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
