import React from 'react';
import { motion } from 'framer-motion';

const TrustSection = () => {
  const stats = [
    { label: 'Sinh viên tin dùng', value: '15,000+' },
    { label: 'Tỷ lệ trúng tuyển', value: '94%' },
    { label: 'Đối tác chiến lược', value: '120+' },
    { label: 'AI Processing', value: '24/7' },
  ];

  return (
    <section className="py-20 border-b border-emerald-50 bg-white relative overflow-hidden">
      {/* Dynamic background detail */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-100 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <h3 className="text-3xl font-display font-bold text-primary mb-1 group-hover:scale-110 transition-transform duration-500">{s.value}</h3>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-800/50 group-hover:text-primary transition-colors">{s.label}</p>

              {/* Subtle underline hover */}
              <div className="w-4 h-px bg-emerald-100 mx-auto mt-4 group-hover:w-8 group-hover:bg-primary transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
