import React from 'react';
import { motion } from 'framer-motion';

const FeaturesHero = () => {
  return (
    <section className="mb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-12 h-[1px] bg-primary" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          Features
        </span>
      </motion.div>
      <h1 className="text-h1 mb-8">
        CÔNG CỤ <br />
        <span className="text-primary italic font-normal">THÔNG MINH.</span>
      </h1>
      <p className="text-p text-emerald-950/60 max-w-2xl leading-relaxed">
        Hệ sinh thái AI toàn diện hỗ trợ bạn từ khâu chuẩn bị hồ sơ đến khi chinh phục buổi phỏng vấn cuối cùng.
      </p>
    </section>
  );
};

export default FeaturesHero;
