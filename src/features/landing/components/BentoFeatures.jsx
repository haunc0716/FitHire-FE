import React from 'react';
import { Gauge, Users, TrendingUp, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const BentoFeatures = () => {
  const secondaryFeatures = [
    { icon: Gauge, title: 'Siêu tốc', desc: 'Báo cáo 60s' },
    { icon: Users, title: 'Cộng đồng', desc: '10K+ Chuyên gia' },
    { icon: TrendingUp, title: 'Thị trường', desc: 'Real-time data' },
    { icon: ShieldCheck, title: 'Bảo mật', desc: 'Chuẩn mã hóa' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-zinc-200 border border-zinc-200 mt-24">
      {/* CV Optimization — Large with interactive hover */}
      <motion.div 
        whileHover={{ zIndex: 10 }}
        className="md:col-span-8 bg-white p-12 group relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row gap-12 relative z-10">
          <div className="flex-1">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-8 block"
            >
              Analytics
            </motion.span>
            <h3 className="heading-md mb-6 group-hover:text-zinc-500 transition-colors">Tối ưu hóa CV Đẳng cấp</h3>
            <p className="text-muted mb-12">
              Thuật toán phân tích ngữ nghĩa vượt trội giúp hồ sơ vượt qua ATS và chinh phục nhà tuyển dụng ngay cái nhìn đầu tiên.
            </p>
            <div className="flex flex-wrap gap-3">
              {['ATS Standard', 'Impact Score', 'Keyword Optimization'].map((text, i) => (
                <span key={i} className="text-[10px] font-bold uppercase tracking-widest border border-zinc-200 px-4 py-2 hover:bg-zinc-900 hover:text-white transition-all cursor-default">
                  {text}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1 image-reveal-container aspect-square border border-zinc-100 shadow-sm">
            <img alt="CV Analysis" className="w-full h-full object-cover grayscale group-hover:grayscale-0" src="/images/cv-analysis.png" />
          </div>
        </div>
        {/* Background decorative number */}
        <span className="absolute -bottom-10 -right-10 text-[200px] font-display font-bold text-zinc-50 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">01</span>
      </motion.div>

      {/* Mock Interview */}
      <motion.div 
        whileHover={{ zIndex: 10 }}
        className="md:col-span-4 bg-white p-12 group relative overflow-hidden"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-8 block">Simulation</span>
        <h3 className="heading-md mb-6 group-hover:text-zinc-500 transition-colors">Phỏng vấn giả lập</h3>
        <p className="text-muted mb-12">Luyện tập với AI. Nhận phân tích ngôn ngữ cơ thể và tư vấn chiến thuật trả lời.</p>
        <div className="image-reveal-container aspect-video border border-zinc-100 shadow-sm">
          <img alt="Mock Interview" className="w-full h-full object-cover grayscale group-hover:grayscale-0" src="/images/mock-interview.png" />
        </div>
        <span className="absolute -bottom-10 -right-10 text-[200px] font-display font-bold text-zinc-50 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">02</span>
      </motion.div>

      {/* Grid of smaller stats/features with reveal animation */}
      {secondaryFeatures.map((item, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="md:col-span-3 bg-white p-12 hover:bg-zinc-50 transition-all duration-500 group relative"
        >
          <div className="w-12 h-12 border border-zinc-100 flex items-center justify-center mb-6 group-hover:border-zinc-900 transition-colors">
            <item.icon className="w-5 h-5 text-zinc-900" />
          </div>
          <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-900 mb-2">{item.title}</h4>
          <p className="text-muted text-sm">{item.desc}</p>
          <ArrowUpRight className="absolute top-8 right-8 w-4 h-4 text-zinc-100 group-hover:text-zinc-900 transition-colors" />
        </motion.div>
      ))}
    </div>
  );
};

export default BentoFeatures;
