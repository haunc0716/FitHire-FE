import React from 'react';
import { motion } from 'framer-motion';

const ProcessHero = () => {
  return (
    <section className="mb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-12 h-[1px] bg-zinc-900" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-900">
          Our Process
        </span>
      </motion.div>
      <h1 className="heading-xl mb-8">
        QUY TRÌNH <br />
        <span className="text-zinc-400">TỐI ƯU.</span>
      </h1>
      <p className="text-muted text-xl max-w-2xl leading-relaxed">
        Chúng tôi đơn giản hóa việc kết nối nhân tài thông qua một quy trình 3 bước khoa học, được hỗ trợ bởi dữ liệu và AI.
      </p>
    </section>
  );
};

export default ProcessHero;
