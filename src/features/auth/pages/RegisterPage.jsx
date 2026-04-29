import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const RegisterPage = () => {
  const benefits = [
    'Tối ưu CV chuẩn quốc tế miễn phí',
    'Rèn luyện phỏng vấn với AI 24/7',
    'Gợi ý việc làm phù hợp với năng lực',
    'Nhận báo cáo phân tích sự nghiệp chuyên sâu'
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden font-body">
      {/* Left side: Why Join? */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex md:w-1/2 bg-zinc-950 p-20 flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <Link to="/" className="text-white font-display text-2xl font-bold tracking-tighter relative z-10 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> FITHIRE
        </Link>

        <div className="relative z-10">
          <h2 className="text-5xl font-display font-bold text-white leading-tight mb-12">
            BẮT ĐẦU <br /> HÀNH TRÌNH MỚI.
          </h2>
          
          <div className="space-y-6">
            {benefits.map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-4 text-zinc-300"
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="text-sm tracking-wide">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          JOIN 15,000+ USERS TRANSFORMING THEIR CAREERS.
        </div>
      </motion.div>

      {/* Right side: Register Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 p-8 md:px-24 py-16 flex flex-col justify-center overflow-y-auto"
      >
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl font-display font-bold text-zinc-950 mb-4">TẠO TÀI KHOẢN</h1>
            <p className="text-zinc-500 text-sm">Chỉ mất 1 phút để mở ra cánh cửa sự nghiệp mới.</p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">First Name</label>
                <input 
                  type="text" 
                  placeholder="John"
                  className="w-full px-4 py-4 border border-zinc-100 bg-zinc-50 focus:bg-white focus:border-zinc-950 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Doe"
                  className="w-full px-4 py-4 border border-zinc-100 bg-zinc-50 focus:bg-white focus:border-zinc-950 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com"
                className="w-full px-4 py-4 border border-zinc-100 bg-zinc-50 focus:bg-white focus:border-zinc-950 outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-4 border border-zinc-100 bg-zinc-50 focus:bg-white focus:border-zinc-950 outline-none transition-all text-sm"
              />
            </div>

            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" className="mt-1 w-4 h-4 accent-zinc-950" id="terms" />
              <label htmlFor="terms" className="text-xs text-zinc-500 leading-relaxed">
                Tôi đồng ý với các <Link to="/terms" className="text-zinc-950 font-bold hover:underline">Điều khoản dịch vụ</Link> và <Link to="/privacy" className="text-zinc-950 font-bold hover:underline">Chính sách bảo mật</Link> của FitHire.
              </label>
            </div>

            <button className="w-full bg-zinc-950 text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10">
              Đăng ký tài khoản
            </button>
          </form>

          <p className="mt-12 text-center text-sm text-zinc-500">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-zinc-950 font-bold hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
