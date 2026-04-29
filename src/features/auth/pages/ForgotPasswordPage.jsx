import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 font-body">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zinc-200 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-zinc-100 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full bg-white border border-zinc-100 p-12 shadow-2xl shadow-zinc-900/5 relative z-10"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="mb-10">
                <div className="w-12 h-12 bg-zinc-950 text-white flex items-center justify-center mb-6">
                  <Mail className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-display font-bold text-zinc-950 mb-4">QUÊN MẬT KHẨU?</h1>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn để bạn đặt lại mật khẩu.
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-8">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@company.com"
                    className="w-full px-4 py-4 border border-zinc-100 bg-zinc-50 focus:bg-white focus:border-zinc-950 outline-none transition-all text-sm"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-zinc-950 text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10"
                >
                  Gửi yêu cầu khôi phục
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4">KIỂM TRA EMAIL</h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-10">
                Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến (và cả thư rác).
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-zinc-950 font-bold text-sm hover:underline"
              >
                Không nhận được email? Thử lại
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
