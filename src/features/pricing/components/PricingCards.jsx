import React from 'react';

const PricingCards = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
      {/* Plan: Free */}
      <div className="bg-white border border-slate-100 p-8 rounded-xl premium-shadow card-hover transition-all duration-500 flex flex-col">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-1">Miễn phí</h3>
          <p className="text-slate-500 text-sm">Khởi đầu với các công cụ cơ bản</p>
        </div>
        <div className="mb-8">
          <span className="text-4xl font-extrabold tracking-tight">0 VND</span>
          <span className="text-slate-400 text-sm block">Vĩnh viễn</span>
        </div>
        <ul className="space-y-4 mb-10 flex-grow">
          <li className="flex items-center gap-3 text-sm text-slate-600">
            <span className="material-symbols-outlined text-violet-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            3 lượt quét CV
          </li>
          <li className="flex items-center gap-3 text-sm text-slate-600">
            <span className="material-symbols-outlined text-violet-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            1 buổi phỏng vấn (Văn bản)
          </li>
          <li className="flex items-center gap-3 text-sm text-slate-300">
            <span className="material-symbols-outlined text-xl">cancel</span>
            Mô phỏng giọng nói
          </li>
        </ul>
        <button className="w-full py-3.5 border-2 border-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all">Đăng ký ngay</button>
      </div>

      {/* Plan: Beta */}
      <div className="bg-white border border-slate-100 p-8 rounded-xl premium-shadow card-hover transition-all duration-500 flex flex-col relative overflow-hidden">
        <div className="absolute top-3 right-[-35px] rotate-45 bg-amber-400 text-amber-950 px-10 py-1 text-[10px] font-bold uppercase tracking-widest">Dùng bao nhiêu trả bấy nhiêu</div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-1">Beta</h3>
          <p className="text-slate-500 text-sm">Linh hoạt theo từng phiên</p>
        </div>
        <div className="mb-8">
          <span className="text-4xl font-extrabold tracking-tight">29,000</span>
          <span className="text-slate-400 text-sm block">VND / lượt</span>
        </div>
        <ul className="space-y-4 mb-10 flex-grow">
          <li className="flex items-center gap-3 text-sm text-slate-600">
            <span className="material-symbols-outlined text-violet-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Phỏng vấn giọng nói đầy đủ
          </li>
          <li className="flex items-center gap-3 text-sm text-slate-600">
            <span className="material-symbols-outlined text-violet-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Phân tích hiệu suất chi tiết
          </li>
          <li className="flex items-center gap-3 text-sm text-slate-600">
            <span className="material-symbols-outlined text-violet-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Báo cáo phản hồi từ AI
          </li>
        </ul>
        <button className="w-full py-3.5 border-2 border-violet-100 text-violet-600 font-semibold rounded-lg hover:bg-violet-50 transition-all">Đăng ký ngay</button>
      </div>

      {/* Plan: Plus */}
      <div className="bg-white border-2 border-violet-500 p-8 rounded-xl shadow-2xl shadow-violet-200 lg:scale-105 z-10 card-hover transition-all duration-500 flex flex-col relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 primary-gradient text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Phổ biến nhất</div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-violet-600 mb-1">Plus</h3>
          <p className="text-slate-500 text-sm">Hoàn hảo cho người tìm việc tích cực</p>
        </div>
        <div className="mb-8">
          <span className="text-4xl font-extrabold tracking-tight">129,000</span>
          <span className="text-slate-400 text-sm block">VND / tháng</span>
        </div>
        <ul className="space-y-4 mb-10 flex-grow">
          <li className="flex items-center gap-3 text-sm text-slate-600">
            <span className="material-symbols-outlined text-violet-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            15 lượt quét CV
          </li>
          <li className="flex items-center gap-3 text-sm text-slate-600">
            <span className="material-symbols-outlined text-violet-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            5 buổi phỏng vấn giọng nói
          </li>
          <li className="flex items-center gap-3 text-sm font-bold text-violet-600">
            <span className="material-symbols-outlined text-xl">monitoring</span>
            Biểu đồ kỹ năng Radar cá nhân
          </li>
        </ul>
        <button className="w-full py-4 primary-gradient text-white font-semibold rounded-lg shadow-lg shadow-violet-500/30 transition-all">Đăng ký ngay</button>
      </div>

      {/* Plan: Pro */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-2xl card-hover transition-all duration-500 flex flex-col text-white">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-violet-400 mb-1">Pro</h3>
          <p className="text-slate-400 text-sm">Đẩy nhanh lộ trình thăng tiến</p>
        </div>
        <div className="mb-8">
          <span className="text-4xl font-extrabold tracking-tight">349,000</span>
          <span className="text-slate-500 text-sm block">VND / tháng</span>
        </div>
        <ul className="space-y-4 mb-10 flex-grow">
          <li className="flex items-center gap-3 text-sm text-slate-300">
            <span className="material-symbols-outlined text-violet-400 text-xl">verified</span>
            Quét CV không giới hạn
          </li>
          <li className="flex items-center gap-3 text-sm text-slate-300">
            <span className="material-symbols-outlined text-violet-400 text-xl">verified</span>
            Phỏng vấn AI không giới hạn
          </li>
          <li className="flex items-center gap-3 text-sm text-slate-300">
            <span className="material-symbols-outlined text-violet-400 text-xl">verified</span>
            Ưu tiên phản hồi từ AI
          </li>
        </ul>
        <button className="w-full py-3.5 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all">Đăng ký ngay</button>
      </div>
    </section>
  );
};

export default PricingCards;
