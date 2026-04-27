import React from 'react';

const ProcessCTA = () => {
  return (
    <section className="max-w-[1200px] mx-auto mt-32 py-20 border-t border-slate-100 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Bắt đầu nâng tầm đội ngũ của bạn ngay hôm nay</h2>
        <p className="text-slate-500 mb-10 text-lg">Hơn 500 doanh nghiệp đang sử dụng FitHire để xây dựng đội ngũ chuyên gia xuất sắc thế hệ mới.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="bg-slate-900 text-white font-bold px-10 py-4 rounded-lg hover:bg-slate-800 transition-all active:scale-95 shadow-lg">Trải nghiệm miễn phí</button>
          <button className="bg-white border border-slate-200 text-slate-900 font-bold px-10 py-4 rounded-lg hover:bg-slate-50 transition-all">Đặt lịch tư vấn</button>
        </div>
      </div>
    </section>
  );
};

export default ProcessCTA;
