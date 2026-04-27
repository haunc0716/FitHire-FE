import React from 'react';
import { PlayCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <main className="relative pt-40 pb-32 overflow-hidden hero-gradient">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative">
        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:col-span-6 z-10"
        >
          <h1 className="font-h1 text-5xl md:text-7xl text-slate-900 mb-8 leading-[1.05] tracking-tight">
            Nâng tầm hồ sơ <br />
            <motion.span 
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="text-gradient"
            >
              Tự tin vươn xa
            </motion.span>
          </h1>

          <p className="font-body-lg text-xl text-slate-600 mb-12 max-w-xl leading-relaxed">
            Sử dụng trí tuệ nhân tạo thế hệ mới để kiến tạo hành trình sự nghiệp cá nhân hóa, giúp bạn vượt qua mọi giới hạn tuyển dụng.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 primary-gradient text-white rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all"
            >
              Bắt đầu hành trình
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,1)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-900 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all"
            >
              <PlayCircle className="text-primary w-6 h-6" />
              Xem Demo
            </motion.button>
          </div>
        </motion.div>

        {/* Hero Illustration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="lg:col-span-6 relative"
        >
          <div className="relative w-full aspect-[4/5] max-w-lg mx-auto">
            {/* Animated Ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 border-2 border-dashed border-primary/20 rounded-full"
            />
            
            {/* Main Image Container */}
            <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden shadow-[0_40px_80px_-15px_rgba(139,92,246,0.2)] border-4 border-white/50 backdrop-blur-sm">
              <img alt="Professional working" className="w-full h-full object-cover animate-float" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIbuITMYt-Igm5DIFKAM1IKKknIThZnoEwafiBDsLVaI2udRk-RHjR4hfiwl2s64aVXwdaoU6HMI4sNMXARqvp8NT6rw3zRAsIMO5r-72LG10DMK9cpVubDaLfVu3f5Os92z4duiOPusWPPt0jzrrmaHyvlovRdEQQKoPS76CEr1mrFIMytspXvO7cZXCGC9hh_bVbzL131Y24CEaM2GNFu4hY2uPd2ZRKAI2x_bb3uyjkDHNJyNIVnNGwaYcHXcLh9du_woTINtI" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
            </div>

            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-10 -right-10 glass-card p-6 rounded-2xl z-20 shadow-xl border-white/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI Score</div>
                  <div className="text-xl font-extrabold text-slate-900">98% Fit</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default HeroSection;
