import React from 'react';
import { UploadCloud, Microscope, BarChart3, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ProcessSteps = () => {
  const steps = [
    {
      icon: UploadCloud,
      step: '01',
      title: 'Tải lên JD',
      desc: 'AI tự động trích xuất các kỹ năng và yêu cầu quan trọng để so khớp.',
      img: '/images/step-upload.png',
    },
    {
      icon: Microscope,
      step: '02',
      title: 'Quét CV',
      desc: 'Phân tích ứng viên bằng thuật toán khớp nối ngữ nghĩa AI chuyên sâu.',
      img: '/images/step-scan.png',
    },
    {
      icon: BarChart3,
      step: '03',
      title: 'Kết quả',
      desc: 'Nhận báo cáo Match Score chi tiết để đưa ra quyết định tuyển dụng.',
      img: '/images/step-results.png',
    },
  ];

  return (
    <section className="section-container relative">
      {/* Decorative background number for the section */}
      <div className="absolute top-0 right-10 text-[20vw] font-display font-bold text-emerald-50 pointer-events-none select-none opacity-50">
        STEPS
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 block mb-6"
          >
            How it works
          </motion.span>
          <h2 className="text-h2 uppercase text-zinc-900">QUY TRÌNH <span className="text-primary italic font-normal">TỐI ƯU.</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              {/* Image Container with Reveal Effect */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-emerald-50 mb-10 shadow-lg shadow-emerald-900/5">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  alt={s.title} 
                  className="w-full h-full object-cover transition-all duration-1000" 
                  src={s.img} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Step Indicator */}
                <div className="absolute top-6 left-6 bg-primary text-white px-4 py-1.5 rounded-full shadow-lg">
                   <span className="text-xs font-display font-bold">
                    {s.step}
                   </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="px-2">
                <div className="w-10 h-10 border border-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <s.icon className="w-5 h-5 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight uppercase mb-4 text-zinc-900 group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  {s.desc}
                </p>
                
                <motion.button 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-emerald-600 group-hover:text-primary transition-colors duration-500"
                >
                  Khám phá ngay <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Bottom Animated Line */}
              <div className="absolute -bottom-4 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-1000" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
