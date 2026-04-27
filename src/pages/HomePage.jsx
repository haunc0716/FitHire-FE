import React from 'react';

const HomePage = () => {
  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 border-b border-violet-100/50 bg-white/70 backdrop-blur-xl shadow-[0_4px_20px_rgba(139,92,246,0.08)]">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto font-['Plus_Jakarta_Sans'] text-sm font-medium">
          <a href="/" className="flex items-center">
            <img src="/logo.png" alt="FitHire Logo" className="h-10 w-auto object-contain mix-blend-multiply" />
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-violet-600 font-bold relative after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-violet-600 after:rounded-full transition-all duration-300" href="#">Tính năng</a>
            <a className="text-slate-600 hover:text-violet-500 transition-all duration-300" href="#">Bảng giá</a>
            <a className="text-slate-600 hover:text-violet-500 transition-all duration-300" href="#">Giải pháp</a>
            <a className="text-slate-600 hover:text-violet-500 transition-all duration-300" href="#">Quy trình</a>
            <a className="text-slate-600 hover:text-violet-500 transition-all duration-300" href="#">Hỗ trợ</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-600 hover:text-violet-500 transition-all duration-300 active:scale-95 transform">Đăng nhập</button>
            <button className="px-5 py-2 bg-[#8B5CF6] text-white rounded font-button text-sm hover:bg-violet-700 transition-all active:scale-95 transform">Bắt đầu ngay</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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

      {/* Quick Intro Blocks Section */}
      <section className="py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="font-h2 text-4xl text-slate-900 mb-6 tracking-tight">Hệ sinh thái hỗ trợ toàn diện</h2>
              <p className="text-slate-500 text-lg leading-relaxed">Chúng tôi mang đến bộ giải pháp AI chuyên sâu giúp bạn tỏa sáng trong mắt các nhà tuyển dụng hàng đầu.</p>
            </div>
            <a className="inline-flex items-center gap-2 text-primary font-bold group" href="#">
              Xem tất cả tính năng
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">east</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* CV Scan */}
            <div className="group p-10 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(139,92,246,0.06)] transition-all duration-500">
              <div className="w-16 h-16 bg-white shadow-sm rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-3xl text-primary">document_scanner</span>
              </div>
              <h3 className="font-h3 text-2xl text-slate-900 mb-4">Phân tích CV AI</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">Tối ưu hóa hồ sơ theo chuẩn ATS quốc tế, gợi ý từ khóa then chốt cho từng vị trí cụ thể.</p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-[15px] font-medium text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-primary font-bold">check</span>
                  </span>
                  Gợi ý từ khóa thông minh
                </li>
                <li className="flex items-center gap-3 text-[15px] font-medium text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-primary font-bold">check</span>
                  </span>
                  Sửa lỗi định dạng tự động
                </li>
              </ul>
              <a className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all" href="#">
                Thử ngay <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </a>
            </div>
            {/* Mock Interview */}
            <div className="group p-10 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-secondary/20 hover:shadow-[0_20px_50px_rgba(0,88,190,0.06)] transition-all duration-500">
              <div className="w-16 h-16 bg-white shadow-sm rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-3xl text-secondary">mic_external_on</span>
              </div>
              <h3 className="font-h3 text-2xl text-slate-900 mb-4">Phỏng vấn giả lập</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">Luyện tập trực tiếp với AI trong các tình huống thực tế, nhận phản hồi tức thì về ngôn ngữ cơ thể.</p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-[15px] font-medium text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-secondary font-bold">check</span>
                  </span>
                  Đánh giá giọng nói &amp; thái độ
                </li>
                <li className="flex items-center gap-3 text-[15px] font-medium text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-secondary font-bold">check</span>
                  </span>
                  Hơn 2,000 câu hỏi chuyên sâu
                </li>
              </ul>
              <a className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all" href="#">
                Luyện tập <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </a>
            </div>
            {/* Cultural Fit */}
            <div className="group p-10 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-tertiary/20 hover:shadow-[0_20px_50px_rgba(91,91,101,0.06)] transition-all duration-500">
              <div className="w-16 h-16 bg-white shadow-sm rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-3xl text-slate-700">psychology_alt</span>
              </div>
              <h3 className="font-h3 text-2xl text-slate-900 mb-4">Đánh giá độ phù hợp</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">Bài trắc nghiệm phong cách làm việc giúp bạn tìm thấy doanh nghiệp có cùng hệ giá trị văn hóa.</p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-[15px] font-medium text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-slate-600 font-bold">check</span>
                  </span>
                  Phân tích EQ &amp; Soft Skills
                </li>
                <li className="flex items-center gap-3 text-[15px] font-medium text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-slate-600 font-bold">check</span>
                  </span>
                  Khớp nối văn hóa công ty
                </li>
              </ul>
              <a className="inline-flex items-center gap-2 text-slate-700 font-bold hover:gap-3 transition-all" href="#">
                Tìm hiểu thêm <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
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

      {/* Footer */}
      <footer className="w-full bg-slate-50 border-t border-slate-200 rounded-none font-['Plus_Jakarta_Sans'] text-sm leading-relaxed">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto px-8 py-16">
          <div className="col-span-1">
            <a href="/" className="flex items-center mb-6">
              <img src="/logo.png" alt="FitHire Logo" className="h-8 w-auto object-contain mix-blend-multiply" />
            </a>
            <p className="text-slate-500 mb-8">Nền tảng hỗ trợ tuyển dụng thông minh hàng đầu, giúp kết nối nhân tài và doanh nghiệp một cách tối ưu nhất.</p>
            <div className="flex gap-4">
              <a className="w-9 h-9 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-all opacity-100 hover:opacity-80" href="#">
                <span className="material-symbols-outlined text-lg">language</span>
              </a>
              <a className="w-9 h-9 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-all opacity-100 hover:opacity-80" href="#">
                <span className="material-symbols-outlined text-lg">share</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-[12px] tracking-widest">Sản phẩm</h4>
            <ul className="space-y-4 text-slate-500">
              <li><a className="hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all" href="#">Tính năng AI</a></li>
              <li><a className="hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all" href="#">CV Builder</a></li>
              <li><a className="hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all" href="#">Luyện phỏng vấn</a></li>
              <li><a className="hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all" href="#">Hướng dẫn sự nghiệp</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-[12px] tracking-widest">Công ty</h4>
            <ul className="space-y-4 text-slate-500">
              <li><a className="hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all" href="#">Về chúng tôi</a></li>
              <li><a className="hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all" href="#">Blog chia sẻ</a></li>
              <li><a className="hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all" href="#">Cơ hội việc làm</a></li>
              <li><a className="hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all" href="#">Liên hệ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-[12px] tracking-widest">Hỗ trợ</h4>
            <ul className="space-y-4 text-slate-500">
              <li><a className="hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all" href="#">Trung tâm hỗ trợ</a></li>
              <li><a className="hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all" href="#">Điều khoản dịch vụ</a></li>
              <li><a className="hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all" href="#">Chính sách bảo mật</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 py-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500">© 2024 FitHire. All rights reserved. Built for the next generation of talent.</p>
          <div className="flex gap-8 text-slate-400 font-medium">
            <a className="hover:text-violet-600 transition-colors" href="#">Facebook</a>
            <a className="hover:text-violet-600 transition-colors" href="#">LinkedIn</a>
            <a className="hover:text-violet-600 transition-colors" href="#">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
