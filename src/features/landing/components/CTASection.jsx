import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-warm-bg">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-stone-200/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-[3rem] p-16 md:p-24 text-center border border-stone-100 shadow-2xl shadow-primary/5 flex flex-col items-center"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-6 block">
            Khởi đầu mới
          </span>
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-h2 text-stone-900 mb-10"
          >
            Sẵn sàng cho <span className="text-primary italic font-semibold">bước tiến tiếp theo?</span>
          </motion.h2>
          <div className="w-12 h-1 bg-primary rounded-full mb-12" />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-stone-500 mb-12 max-w-xl mx-auto text-lg leading-relaxed"
          >
            Tham gia cùng hàng nghìn sinh viên và chuyên gia đã tối ưu hóa lộ trình sự nghiệp cùng FitHire ngay hôm nay.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link to="/login" className="btn-primary flex items-center justify-center">
              Bắt đầu miễn phí
            </Link>
            <Link to="/support" className="btn-secondary flex items-center justify-center">
              Liên hệ tư vấn
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
