import React from 'react';
import { ArrowRight, ScanText, Mic2, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesGrid = () => {
  const features = [
    {
      icon: ScanText,
      title: 'Phân tích CV AI',
      desc: 'Tối ưu hóa hồ sơ theo chuẩn quốc tế. Hệ thống tự động nhận diện và gợi ý các từ khóa then chốt.',
    },
    {
      icon: Mic2,
      title: 'Phỏng vấn giả lập',
      desc: 'Rèn luyện phản xạ phỏng vấn với AI. Nhận báo cáo chi tiết về tông giọng và mức độ thuyết phục.',
    },
    {
      icon: BrainCircuit,
      title: 'Đánh giá độ phù hợp',
      desc: 'Xác định môi trường làm việc lý tưởng dựa trên các bài test tâm lý học tổ chức.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className="section-container relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-zinc-900 to-transparent opacity-5" />

      <div className="text-center mb-24">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 block mb-6"
        >
          Our Capabilities
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-h2 mb-8 uppercase"
        >
          TÍNH NĂNG <span className="text-primary italic font-normal">CHÍNH.</span>
        </motion.h2>
        <div className="w-12 h-[2px] bg-primary mx-auto" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-px bg-emerald-100 border border-emerald-100 shadow-2xl shadow-emerald-900/5"
      >
        {features.map((feat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ backgroundColor: "var(--color-primary)", color: "#ffffff" }}
            className="bg-white p-12 transition-colors duration-700 group cursor-default"
          >
            <div className="w-16 h-16 border border-primary flex items-center justify-center mb-10 group-hover:bg-white group-hover:text-primary transition-all duration-500">
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-6 uppercase tracking-wider">{feat.title}</h3>
            <p className="text-zinc-500 group-hover:text-zinc-400 leading-relaxed text-sm mb-12 transition-colors">
              {feat.desc}
            </p>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              Tìm hiểu thêm <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesGrid;
