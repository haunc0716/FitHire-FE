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
        <div className="w-12 h-[1px] bg-zinc-900" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-900">
          Features
        </span>
      </motion.div>
      <h1 className="heading-xl mb-8">
        CÔNG CỤ <br />
        <span className="text-zinc-400">THÔNG MINH.</span>
      </h1>
      <p className="text-muted text-xl max-w-2xl leading-relaxed">
        Hệ sinh thái AI toàn diện hỗ trợ bạn từ khâu chuẩn bị hồ sơ đến khi chinh phục buổi phỏng vấn cuối cùng.
      </p>
    </section>
  );
};

export default FeaturesHero;
