import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -60]);
  const y2 = useTransform(scrollY, [0, 500], [0, 60]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className="bg-white pt-24 pb-28 border-b border-emerald-50 relative overflow-hidden">
      {/* Parallax background elements */}
      <motion.div style={{ y: y1 }} className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-[120px] opacity-60" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Column: Bold Content */}
          <div className="text-left">
            <motion.h1 variants={itemVariants} className="text-h1 mb-8 text-zinc-950">
              KIẾN TẠO <br />
              <span className="text-primary font-normal italic">SỰ NGHIỆP</span> <br />
              ĐỘT PHÁ.
            </motion.h1>

            <motion.p variants={itemVariants} className="text-p max-w-lg mb-12 text-zinc-500">
              Nền tảng AI chuyên sâu giúp bạn tối ưu hồ sơ và rèn luyện kỹ năng phỏng vấn theo lộ trình cá nhân hóa chuyên nghiệp.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary !px-12"
              >
                Bắt đầu ngay
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary !px-12"
              >
                Xem Demo
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-16 pt-16 border-t border-zinc-100 flex gap-12">
              <div>
                <p className="text-2xl font-bold text-zinc-950">15k+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Success Stories</p>
              </div>
              <div className="w-px h-10 bg-zinc-100" />
              <div>
                <p className="text-2xl font-bold text-zinc-950">98%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Match Rate</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Parallax Image Reveal */}
          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="relative group cursor-pointer"
          >
            <div className="relative z-10 border border-emerald-100 shadow-2xl bg-white rounded-xl overflow-hidden">
              <img 
                alt="FitHire Refined Interface" 
                className="w-full h-auto transition-all duration-1000 ease-out group-hover:scale-[1.02]" 
                src="/images/hero-human.png" 
              />
              <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/[0.05] transition-colors duration-700 pointer-events-none" />
            </div>

            {/* Detail badge */}
            <motion.div
              style={{ y: y1 }}
              className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-lg shadow-2xl hidden xl:block border border-emerald-400/20 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Active Intelligence</span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
