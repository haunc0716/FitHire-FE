import React from 'react';
import { motion } from 'framer-motion';

const PricingHero = () => {
  return (
    <section className="mb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-12 h-[1px] bg-zinc-900" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-900">
          Investment
        </span>
      </motion.div>
      <h1 className="heading-xl mb-8">
        BẢNG GIÁ <br />
        <span className="text-zinc-400">MINH BẠCH.</span>
      </h1>
      <p className="text-muted text-xl max-w-2xl leading-relaxed">
        Chúng tôi cung cấp các gói dịch vụ linh hoạt phù hợp với nhu cầu của sinh viên và các doanh nghiệp khởi nghiệp.
      </p>
    </section>
  );
};

export default PricingHero;
