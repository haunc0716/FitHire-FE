import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const SupportHero = () => {
  return (
    <section className="mb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-12 h-[1px] bg-primary" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          Support Center
        </span>
      </motion.div>
      
      <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
        <div className="max-w-3xl">
          <h1 className="text-h1 mb-8">TRUNG TÂM <br /><span className="text-primary italic font-normal">HỖ TRỢ.</span></h1>
          <p className="text-p text-emerald-950/60 max-w-xl leading-relaxed">
            Chúng tôi luôn ở đây để giúp bạn tối ưu hóa hành trình sự nghiệp của mình. Tìm kiếm giải pháp hoặc kết nối với đội ngũ chuyên gia.
          </p>
        </div>

        <div className="w-full lg:w-96 relative group">
          <input
            className="w-full bg-white border-b-2 border-emerald-100 px-0 py-4 focus:outline-none focus:border-primary transition-colors placeholder:text-emerald-100 font-display text-2xl font-bold"
            placeholder="Tìm kiếm bài viết..."
            type="text"
          />
          <button className="absolute right-0 top-1/2 -translate-y-1/2 text-primary">
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SupportHero;
