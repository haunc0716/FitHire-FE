import React from 'react';
import { Gauge, Users, TrendingUp, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const BentoFeatures = () => {
  const secondaryFeatures = [
    { icon: Gauge, title: 'Báo cáo siêu tốc', desc: 'Kết quả chỉ sau 60 giây' },
    { icon: Users, title: 'Mạng lưới chuyên gia', desc: 'Kết nối 10K+ cố vấn' },
    { icon: TrendingUp, title: 'Dữ liệu thực tế', desc: 'Cập nhật thị trường 24/7' },
    { icon: ShieldCheck, title: 'Bảo mật tuyệt đối', desc: 'An toàn thông tin cá nhân' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-stone-100 border border-stone-100 mt-24 rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/5">
      {/* CV Optimization — Large with interactive hover */}
      <motion.div
        whileHover={{ zIndex: 10 }}
        className="md:col-span-8 bg-white p-12 group relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row gap-12 relative z-10">
          <div className="flex-1 text-left">
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-4 block"
            >
              Phân tích hồ sơ
            </motion.span>
            <h3 className="text-3xl font-display font-bold mb-6 text-stone-900 group-hover:text-primary transition-colors">Tối ưu hóa CV chuyên sâu</h3>
            <p className="text-stone-500 mb-12 text-lg leading-relaxed">
              Sử dụng công nghệ phân tích ngữ nghĩa hiện đại giúp hồ sơ của bạn nổi bật, vượt qua các hệ thống lọc ATS khắt khe nhất.
            </p>
            <div className="flex flex-wrap gap-3">
              {['ATS Standard', 'Impact Score', 'Keywords'].map((text, i) => (
                <span key={i} className="text-xs font-semibold bg-stone-50 border border-stone-100 px-5 py-2.5 rounded-full text-stone-600 hover:border-primary hover:text-primary transition-all cursor-default">
                  {text}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1 image-reveal-container aspect-square border border-stone-50 shadow-sm relative group/img">
            <img alt="CV Analysis" className="w-full h-full object-cover" src="/images/cv-analysis.png" />
            <div className="absolute inset-0 bg-primary/0 group-hover/img:bg-primary/5 transition-colors duration-500" />
          </div>
        </div>
        {/* Background decorative number */}
        <span className="absolute -bottom-10 -right-10 text-[180px] font-display font-black text-primary opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">01</span>
      </motion.div>

      {/* Mock Interview */}
      <motion.div
        whileHover={{ zIndex: 10 }}
        className="md:col-span-4 bg-white p-12 group relative overflow-hidden"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-4 block">Giả lập phỏng vấn</span>
        <h3 className="text-3xl font-display font-bold mb-6 text-stone-900 group-hover:text-primary transition-colors">Luyện tập thông minh</h3>
        <p className="text-stone-500 mb-12 text-lg leading-relaxed">Nhận phản hồi tức thì về ngôn ngữ cơ thể và chiến thuật trả lời phỏng vấn hiệu quả.</p>
        <div className="image-reveal-container aspect-video border border-stone-50 shadow-sm relative group/img2">
          <img alt="Mock Interview" className="w-full h-full object-cover" src="/images/mock-interview.png" />
          <div className="absolute inset-0 bg-primary/0 group-hover/img2:bg-primary/5 transition-colors duration-500" />
        </div>
        <span className="absolute -bottom-10 -right-10 text-[180px] font-display font-black text-primary opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">02</span>
      </motion.div>

      {/* Grid of smaller stats/features with reveal animation */}
      {secondaryFeatures.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="md:col-span-3 bg-white p-12 hover:bg-stone-50 transition-all duration-500 group relative border-t border-stone-100 md:border-t-0"
        >
          <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-colors">
            <item.icon className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-bold text-lg text-stone-900 mb-3 group-hover:text-primary transition-colors">{item.title}</h4>
          <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
          <ArrowUpRight className="absolute top-10 right-10 w-5 h-5 text-stone-200 group-hover:text-primary transition-colors" />
        </motion.div>
      ))}
    </div>
  );
};

export default BentoFeatures;
