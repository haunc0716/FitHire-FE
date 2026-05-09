import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useToast } from '../../../components/ui/ToastProvider';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col md:flex-row overflow-hidden font-body text-stone-900">
      {/* Left side: Hero Section */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex md:w-1/2 bg-pale p-12 lg:p-16 flex-col relative overflow-hidden items-center justify-center border-r border-stone-200/50"
      >
        {/* Floating Bubble Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[15%] w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ 
              y: [0, 40, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[15%] right-[10%] w-[300px] h-[300px] bg-primary-light/10 rounded-full blur-[80px]" 
          />
        </div>

        <Link
          to="/login"
          className="absolute top-12 left-12 text-stone-900 font-display text-2xl font-bold tracking-tighter z-20 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5 text-stone-400 hover:text-stone-900 transition-colors" />
          FITHIRE
        </Link>

        <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative mb-12 w-full max-w-[340px] aspect-square"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse" />
            <img
              src="/images/forgot-password-hero.png"
              alt="Khôi phục mật khẩu"
              className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(21,128,61,0.15)]"
            />
          </motion.div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-primary/30 rounded-full"></div>
            <span className="text-primary font-bold tracking-widest text-[10px] uppercase">
              Bảo mật tài khoản
            </span>
            <div className="w-10 h-[2px] bg-primary/30 rounded-full"></div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-display font-bold text-stone-900 leading-tight mb-6">
            KHÔI PHỤC <br />
            <span className="text-primary italic">QUYỀN TRUY CẬP.</span>
          </h2>
          <p className="text-stone-500 text-base leading-relaxed max-w-sm mx-auto">
            Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại mật khẩu chỉ trong vài bước đơn giản để tiếp tục hành trình sự nghiệp.
          </p>
        </div>
      </motion.div>

      {/* Right side: Recovery Form */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 px-6 py-10 md:px-20 md:py-16 lg:px-24 flex flex-col justify-center bg-white"
      >
        <div className="max-w-md w-full mx-auto">
          <motion.div variants={itemVariants} className="mb-10 text-center md:text-left">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-8 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </Link>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="title-request"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-stone-900 mb-4 uppercase tracking-tight">Quên mật khẩu?</h1>
                  <p className="text-stone-500 text-base leading-relaxed">
                    Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="title-reset"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-stone-900 mb-4 uppercase tracking-tight">Đặt mật khẩu mới</h1>
                  <p className="text-stone-500 text-base leading-relaxed">
                    Vui lòng tạo một mật khẩu mạnh để bảo vệ tài khoản của bạn.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form-request"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20 }}
              >
                <form 
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} 
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Địa chỉ Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="ten-cua-ban@gmail.com"
                      className="w-full px-4 py-4 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-900 placeholder:text-stone-400 text-sm"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 mt-2"
                  >
                    Gửi yêu cầu khôi phục
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="form-reset"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: 20 }}
              >
                <form 
                  onSubmit={(e) => { 
                    e.preventDefault(); 
                    showToast({
                      type: 'success',
                      title: 'Cập nhật thành công',
                      message: 'Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.'
                    });
                    navigate("/login"); 
                  }} 
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Mật khẩu mới</label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-4 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-900 placeholder:text-stone-400 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Xác nhận mật khẩu</label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-4 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-900 placeholder:text-stone-400 text-sm"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 mt-2"
                  >
                    Cập nhật mật khẩu
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-stone-100 text-center">
            <p className="text-sm text-stone-500 leading-relaxed max-w-sm mx-auto">
              Nếu bạn không nhận được email, vui lòng kiểm tra hộp thư rác hoặc{' '}
              <button className="text-primary font-bold hover:underline uppercase tracking-wider text-xs ml-1">
                Gửi lại yêu cầu
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
