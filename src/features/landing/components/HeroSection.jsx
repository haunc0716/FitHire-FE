import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -40]);
  const y2 = useTransform(scrollY, [0, 500], [0, 40]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <section className="bg-warm-bg pt-20 pb-32 relative overflow-hidden">
      {/* Soft warm background glow */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -mr-40 -mt-40"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column: Bold Content */}
          <div className="text-left">


            <motion.h1 variants={itemVariants} className="text-h1 mb-8">
              Kiến tạo sự nghiệp <br />
              <span className="text-primary italic font-semibold">đột phá</span> của bạn.
            </motion.h1>

            <motion.p variants={itemVariants} className="text-p max-w-lg mb-12 text-stone-500">
              Nền tảng đồng hành giúp bạn tối ưu hồ sơ và rèn luyện kỹ năng phỏng vấn theo lộ trình cá nhân hóa, giúp bạn tự tin chinh phục mọi thử thách.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5">
              <button className="btn-primary">
                Bắt đầu ngay
              </button>
              <button className="btn-secondary">
                Tìm hiểu thêm
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-16 pt-12 border-t border-stone-200 flex gap-12">
              <div>
                <p className="text-3xl font-bold text-stone-900">15,000+</p>
                <p className="text-sm font-medium text-stone-400">Ứng viên thành công</p>
              </div>
              <div className="w-px h-12 bg-stone-200" />
              <div>
                <p className="text-3xl font-bold text-stone-900">98%</p>
                <p className="text-sm font-medium text-stone-400">Tỷ lệ hài lòng</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Element */}
          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="relative"
          >
            <div className="relative z-10 shadow-2xl rounded-3xl overflow-hidden border-8 border-white bg-white">
              <img
                alt="FitHire Platform Preview"
                className="w-full h-auto"
                src="/images/hero-human.png"
              />
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10" />
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
