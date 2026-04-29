import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden font-body">
      {/* Left side: Content/Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex md:w-1/2 bg-zinc-950 p-20 flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>

        <Link to="/" className="text-white font-display text-2xl font-bold tracking-tighter relative z-10 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> FITHIRE
        </Link>

        <div className="relative z-10">
          <h2 className="text-5xl font-display font-bold text-white leading-tight mb-8">
            CHÀO MỪNG BẠN <br /> QUAY TRỞ LẠI.
          </h2>
          <p className="text-zinc-400 max-w-sm text-lg leading-relaxed">
            Tiếp tục hành trình chinh phục sự nghiệp cùng sự hỗ trợ của AI hàng đầu.
          </p>
        </div>

        <div className="relative z-10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          © 2024 FITHIRE — AI DRIVEN CAREERS.
        </div>
      </motion.div>

      {/* Right side: Login Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 p-8 md:p-24 flex flex-col justify-center"
      >
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl font-display font-bold text-zinc-950 mb-4">ĐĂNG NHẬP</h1>
            <p className="text-zinc-500 text-sm">Nhập thông tin để tiếp tục trải nghiệm FitHire.</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com"
                className="w-full px-4 py-4 border border-zinc-100 bg-zinc-50 focus:bg-white focus:border-zinc-950 outline-none transition-all text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Password</label>
                <Link to="/forgot-password" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-4 border border-zinc-100 bg-zinc-50 focus:bg-white focus:border-zinc-950 outline-none transition-all text-sm"
              />
            </div>

            <button className="w-full bg-zinc-950 text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10">
              Đăng nhập ngay
            </button>
          </form>

          <div className="my-10 flex items-center gap-4">
            <div className="flex-1 h-px bg-zinc-100" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Hoặc tiếp tục với</span>
            <div className="flex-1 h-px bg-zinc-100" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 border border-zinc-100 hover:border-zinc-950 transition-all text-xs font-bold uppercase tracking-widest">
              <User className="w-4 h-4" /> Github
            </button>
            <button className="flex items-center justify-center gap-3 py-3 border border-zinc-100 hover:border-zinc-950 transition-all text-xs font-bold uppercase tracking-widest">
              <Mail className="w-4 h-4" /> Google
            </button>
          </div>

          <p className="mt-12 text-center text-sm text-zinc-500">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-zinc-950 font-bold hover:underline">Đăng ký miễn phí</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
