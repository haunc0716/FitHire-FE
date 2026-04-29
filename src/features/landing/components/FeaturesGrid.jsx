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

  return (
    <section className="section-container relative">
      {/* Decorative vertical line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-zinc-900 to-transparent opacity-10" />

      <div className="text-center mb-24">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 block mb-6"
        >
          Our Capabilities
        </motion.span>
        <h2 className="text-h2 mb-8">TÍNH NĂNG CHÍNH.</h2>
        <div className="w-12 h-[2px] bg-zinc-900 mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 shadow-2xl shadow-zinc-900/5">
        {features.map((feat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-12 hover:bg-zinc-950 hover:text-white transition-all duration-700 group cursor-default"
          >
            <div className="w-16 h-16 border border-zinc-900 flex items-center justify-center mb-10 group-hover:bg-white group-hover:text-zinc-950 transition-all duration-500">
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
      </div>
    </section>
  );
};

export default FeaturesGrid;
