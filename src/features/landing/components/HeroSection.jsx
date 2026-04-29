import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-white py-32 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-h1 mb-8">
          NÂNG TẦM <br />
          SỰ NGHIỆP CỦA BẠN.
        </h1>
        <p className="text-p max-w-2xl mx-auto mb-12">
          Nền tảng AI chuyên sâu giúp bạn tối ưu hồ sơ, rèn luyện kỹ năng phỏng vấn và kết nối với những cơ hội hàng đầu. 
          Không rườm rà, tập trung vào kết quả.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="btn-primary">Bắt đầu ngay</button>
          <button className="btn-secondary">Tìm hiểu thêm</button>
        </div>
        
        {/* Simple Large Image - No floating elements */}
        <div className="mt-20 border border-zinc-100 bg-zinc-50 overflow-hidden rounded-lg">
          <img 
            alt="FitHire Dashboard" 
            className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000" 
            src="/images/hero-dashboard.png" 
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
