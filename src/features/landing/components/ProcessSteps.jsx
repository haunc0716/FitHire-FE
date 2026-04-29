import React from 'react';
import { UploadCloud, Microscope, BarChart3, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ProcessSteps = () => {
  const steps = [
    {
      icon: UploadCloud,
      step: '01',
      title: 'Tải lên JD',
      desc: 'Tải lên mô tả công việc. AI tự động trích xuất các kỹ năng và yêu cầu quan trọng nhất.',
      img: '/images/step-upload.png',
    },
    {
      icon: Microscope,
      step: '02',
      title: 'Quét CV',
      desc: 'Phân tích hàng loạt hồ sơ ứng viên bằng thuật toán khớp nối ngữ nghĩa chuyên sâu.',
      img: '/images/step-scan.png',
    },
    {
      icon: BarChart3,
      step: '03',
      title: 'Kết quả',
      desc: 'Nhận báo cáo Match Score chi tiết để đưa ra quyết định tuyển dụng chính xác.',
      img: '/images/step-results.png',
    },
  ];

  return (
    <section className="mt-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200">
        {steps.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="bg-white group relative overflow-hidden"
          >
            {/* Image with zoom and mask */}
            <div className="aspect-[4/3] overflow-hidden border-b border-zinc-100 relative">
              <img 
                alt={s.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                src={s.img} 
              />
              <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/5 transition-colors" />
            </div>

            <div className="p-12 relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 border border-zinc-900 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500">
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="text-5xl font-display font-bold text-zinc-50 group-hover:text-zinc-100 transition-colors">{s.step}</span>
              </div>
              <h3 className="heading-md mb-4 group-hover:translate-x-2 transition-transform duration-500">{s.title}</h3>
              <p className="text-muted text-base mb-8">{s.desc}</p>
              
              <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-950 transition-colors">
                Khám phá <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Hover bar at bottom */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-zinc-900 group-hover:w-full transition-all duration-700" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProcessSteps;
