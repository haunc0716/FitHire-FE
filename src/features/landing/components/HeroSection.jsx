import React from 'react';

const HeroSection = () => {
  return (
    <main className="relative pt-40 pb-24 overflow-hidden hero-gradient">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Hero Content */}
        <div className="lg:col-span-6 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white shadow-sm border border-slate-100 text-slate-600 rounded-full text-[13px] font-semibold mb-8">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            NỀN TẢNG TUYỂN DỤNG THẾ HỆ MỚI
          </div>
          <h1 className="font-h1 text-5xl md:text-6xl text-slate-900 mb-8 leading-[1.1] tracking-tight">
            Nâng tầm hồ sơ – <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Tự tin gõ cửa thành công</span>
          </h1>
          <p className="font-body-lg text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
            Ứng dụng AI tiên tiến nhất để tối ưu hóa CV, rèn luyện kỹ năng phỏng vấn và khám phá môi trường làm việc lý tưởng dành riêng cho bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <button className="px-8 py-4 bg-primary text-white rounded font-button text-lg hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/30 transition-all">
              Dùng thử miễn phí
            </button>
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded font-button text-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined text-primary">play_circle</span>
              Xem Demo
            </button>
          </div>
        </div>
        {/* Hero Illustration */}
        <div className="lg:col-span-6 relative">
          <div className="relative w-full aspect-[4/5] max-w-lg mx-auto">
            {/* Abstract Elements */}
            <div className="absolute -top-16 -right-16 w-80 h-80 bg-primary/5 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]"></div>
            {/* Main Image */}
            <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white">
              <img alt="Professional working" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIbuITMYt-Igm5DIFKAM1IKKknIThZnoEwafiBDsLVaI2udRk-RHjR4hfiwl2s64aVXwdaoU6HMI4sNMXARqvp8NT6rw3zRAsIMO5r-72LG10DMK9cpVubDaLfVu3f5Os92z4duiOPusWPPt0jzrrmaHyvlovRdEQQKoPS76CEr1mrFIMytspXvO7cZXCGC9hh_bVbzL131Y24CEaM2GNFu4hY2uPd2ZRKAI2x_bb3uyjkDHNJyNIVnNGwaYcHXcLh9du_woTINtI" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
