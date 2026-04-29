import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ProcessCTA = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-[1200px] mx-auto mt-8 py-20 border-t border-zinc-200 text-center"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 mb-6 tracking-tight">
          Bắt đầu nâng tầm đội ngũ của bạn ngay hôm nay
        </h2>
        <p className="text-zinc-500 mb-10 text-lg leading-relaxed">
          Hơn 500 doanh nghiệp đang sử dụng FitHire để xây dựng đội ngũ chuyên gia xuất sắc thế hệ mới.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group bg-zinc-900 text-white font-semibold px-10 py-4 rounded-full hover:bg-zinc-800 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Trải nghiệm miễn phí
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="border-2 border-zinc-200 text-zinc-700 font-semibold px-10 py-4 rounded-full hover:border-zinc-900 hover:text-zinc-900 transition-all"
          >
            Đặt lịch tư vấn
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default ProcessCTA;
