import React from 'react';
import { UploadCloud, Microscope, BarChart3, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ProcessSteps = () => {
  const steps = [
    {
      icon: UploadCloud,
      step: '01',
      title: 'Tải lên hồ sơ',
      desc: 'Hệ thống tự động phân tích và trích xuất thông tin quan trọng từ hồ sơ của bạn.',
      img: '/images/step-upload.png',
    },
    {
      icon: Microscope,
      step: '02',
      title: 'Phân tích & So khớp',
      desc: 'Thuật toán thông minh thực hiện so sánh kỹ năng của bạn với yêu cầu thực tế.',
      img: '/images/step-scan.png',
    },
    {
      icon: BarChart3,
      step: '03',
      title: 'Nhận báo cáo',
      desc: 'Nhận đánh giá chi tiết và gợi ý lộ trình cải thiện kỹ năng chuyên biệt.',
      img: '/images/step-results.png',
    },
  ];

  return (
    <section className="section-container relative bg-white rounded-[4rem] my-20">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-24 flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4 block"
          >
            Quy trình đồng hành
          </motion.span>
          <h2 className="text-h2 text-stone-900 mb-8">3 Bước để kiến tạo <span className="text-primary italic font-semibold">thành công.</span></h2>
          <div className="w-12 h-1 bg-primary rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="group relative"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-stone-100 mb-10 shadow-2xl shadow-stone-200/50">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1 }}
                  alt={s.title}
                  className="w-full h-full object-cover"
                  src={s.img}
                />

                {/* Step Indicator */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-stone-900 px-5 py-2 rounded-2xl shadow-sm border border-white/50">
                  <span className="text-sm font-display font-black">
                    {s.step}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="px-4">
                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <s.icon className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 text-stone-900 group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-stone-500 text-base leading-relaxed mb-8">
                  {s.desc}
                </p>

                <button className="flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-4 transition-all">
                  Tìm hiểu chi tiết <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
