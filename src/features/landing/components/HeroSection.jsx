import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="bg-white pt-40 pb-32 border-b border-zinc-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Column: Content */}
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 border border-zinc-950 bg-white rounded-md mb-8"
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-950">AI Hiring Engine v2.0</span>
            </motion.div>

            <h1 className="text-h1 mb-8 !leading-[1.1] tracking-tight text-zinc-950">
              KIẾN TẠO <br />
              <span className="text-zinc-400 font-normal italic">SỰ NGHIỆP</span> <br />
              ĐỘT PHÁ.
            </h1>

            <p className="text-p max-w-lg mb-12 text-zinc-500">
              Nền tảng AI chuyên sâu giúp bạn tối ưu hồ sơ và rèn luyện kỹ năng phỏng vấn theo lộ trình cá nhân hóa. 
              Dựa trên dữ liệu thực tế và phân tích hành vi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary !bg-zinc-950 hover:!bg-zinc-800 !px-10">
                Bắt đầu ngay
              </button>
              <button className="btn-secondary !border-zinc-200">
                Xem Demo
              </button>
            </div>

            {/* Subtle stats row */}
            <div className="mt-16 pt-16 border-t border-zinc-100 flex gap-12">
              <div>
                <p className="text-2xl font-bold text-zinc-950">10k+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-950">98%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Success</p>
              </div>
            </div>
          </div>

          {/* Right Column: Monochrome Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            <div className="relative z-10 border border-zinc-100 shadow-2xl bg-white rounded-xl overflow-hidden group">
              <img 
                alt="FitHire Monochrome Interface" 
                className="w-full h-auto transition-transform duration-1000 group-hover:scale-[1.02]" 
                src="/images/hero-monochrome.png" 
              />
              {/* Subtle overlay for contrast */}
              <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />
            </div>

            {/* Small floating detail card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 bg-zinc-950 text-white p-6 rounded-lg shadow-2xl hidden xl:block border border-zinc-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Monochrome Engine</span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
