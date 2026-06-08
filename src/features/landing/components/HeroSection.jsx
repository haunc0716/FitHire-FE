import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const heroMarqueeItems = [
  'Uy tín',
  'Chất lượng',
  'Đồng hành',
  'Định hướng nghề nghiệp',
];

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
              <Link to="/login" className="btn-primary flex items-center justify-center">
                Bắt đầu ngay
              </Link>
              <Link to="/features" className="btn-secondary flex items-center justify-center">
                Tìm hiểu thêm
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-16 pt-10 border-t border-stone-200">
              <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
                <motion.div
                  className="flex w-max items-center gap-3"
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                >
                  {[...heroMarqueeItems, ...heroMarqueeItems].map((item, index) => (
                    <React.Fragment key={`${item}-${index}`}>
                      <span className={`rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] ${index % heroMarqueeItems.length === 0 ? 'border border-emerald-100 bg-emerald-50 text-primary' : 'border border-stone-200 bg-white text-stone-500'}`}>
                        {item}
                      </span>
                      <span className="text-emerald-300">•</span>
                    </React.Fragment>
                  ))}
                </motion.div>
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
