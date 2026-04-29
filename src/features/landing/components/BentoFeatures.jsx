import React from 'react';
import { FileText, CheckCircle2, Video, GitBranch, Gauge, Users, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const BentoFeatures = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-12 gap-8"
    >
      {/* CV Optimization */}
      <motion.div variants={item} className="md:col-span-8 premium-card rounded-[2rem] p-12 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
        <div className="flex flex-col md:flex-row gap-12 h-full">
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-16 h-16 bg-white shadow-xl shadow-primary/10 rounded-2xl flex items-center justify-center text-primary mb-10 group-hover:scale-110 transition-transform duration-500">
              <FileText className="w-8 h-8" />
            </div>
            <h2 className="font-h2 text-4xl mb-6 tracking-tight">Tối ưu hóa CV Đẳng cấp</h2>
            <p className="font-body-md text-slate-500 text-lg mb-8 leading-relaxed">Thuật toán phân tích ngữ nghĩa vượt trội giúp hồ sơ của bạn không chỉ vượt qua ATS mà còn chinh phục ánh nhìn của các nhà tuyển dụng khó tính nhất.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 font-semibold text-slate-700 bg-white/50 p-3 rounded-xl border border-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Chuẩn ATS Quốc tế
              </div>
              <div className="flex items-center gap-3 font-semibold text-slate-700 bg-white/50 p-3 rounded-xl border border-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Impact Score AI
              </div>
            </div>
          </div>
          <div className="flex-1 relative min-h-[300px]">
            <div className="absolute inset-0 bg-slate-100/50 rounded-3xl p-6 group-hover:bg-primary/5 transition-colors duration-500">
              <img alt="Phân tích CV" className="w-full h-full object-cover rounded-2xl shadow-2xl group-hover:rotate-1 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwPJgGJks3daojhu40cxH6B3-VpQBEzPozON-0bDjE3HnoIVZeMtaEQlty0bx6jH94vwFZSYTmgLZnw-4KrAJzNxSQFzFJUu67xrxVVPj-iBX0GIK4ILZKwnm9hdL4ehmuYprPOf6xG7kTb5uiKgZpnkKZuiX0nDucVc7RJ-NQzhlHcxZY3rIbtSCvYJ_UTlvhXM-fuMUK1V2Op8-75cc6x8E_cb6S2X9JP6DaHX_zkSYlHLcwZ-0Pkkty6JSFurPp26GBqx06ULU" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mock Interview */}
      <motion.div variants={item} className="md:col-span-4 premium-card rounded-[2rem] p-12 group">
        <div className="w-16 h-16 bg-white shadow-xl shadow-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-10 group-hover:scale-110 transition-transform duration-500">
          <Video className="w-8 h-8" />
        </div>
        <h3 className="font-h3 text-3xl mb-6">Phỏng vấn giả lập</h3>
        <p className="font-body-md text-slate-500 text-lg mb-10 leading-relaxed">Luyện tập trong không gian ảo với AI. Nhận phân tích ngôn ngữ cơ thể và tư vấn chiến thuật trả lời thông minh.</p>
        <div className="aspect-[4/3] bg-slate-100/50 rounded-3xl overflow-hidden relative border border-white shadow-inner group-hover:bg-secondary/5 transition-colors">
          <img alt="Mock Interview" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9OLFvw7lGdpnbQ3q0-jSZ8jXfGMyT4Q_lXZ3N-pzg_Jzsz1_TQqkm2HWtS0uIByUdwmLWlnJ8iE_ws_T3SdIJltAgfwd-Ls3l7Q13ydTL5EneTSJnP4-FXKvf1cwAG_hiv8NlAD0rVMU8WpXC8EAFkGS02JWgHhBCvpD6AbpGEsN9xSYUPkgwTCzSrWka7Ea1sCXW8uAIJbuXKE1UA9bD1Y90PKTgJWcQDUdX5cl9QnAimM2ereSBvUIkF04__3f34gsNmaJkMYo" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.div>

      {/* Cultural Fit */}
      <motion.div variants={item} className="md:col-span-5 premium-card rounded-[2rem] p-12 group">
        <div className="w-16 h-16 bg-white shadow-xl shadow-slate-100 rounded-2xl flex items-center justify-center text-slate-700 mb-10 group-hover:scale-110 transition-transform duration-500">
          <GitBranch className="w-8 h-8" />
        </div>
        <h3 className="font-h3 text-3xl mb-6">Bản đồ Văn hóa</h3>
        <p className="font-body-md text-slate-500 text-lg mb-10 leading-relaxed">Tìm thấy nơi thuộc về bạn. Hệ thống đánh giá Cultural Fit giúp kết nối bạn với những công ty có cùng lý tưởng sống.</p>
        <div className="flex items-center justify-center py-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="relative w-48 h-48 border border-slate-100 rounded-full flex items-center justify-center"
          >
            <div className="absolute inset-4 border border-primary/10 rounded-full" />
            <div className="w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <GitBranch className="w-10 h-10 text-primary relative z-10" />
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div variants={item} className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {[
          { icon: Gauge, color: "text-primary", title: "Phản hồi Siêu tốc", desc: "Nhận báo cáo phân tích sâu chỉ trong 60 giây." },
          { icon: Users, color: "text-secondary", title: "Cộng đồng Tinh hoa", desc: "Kết nối với mạng lưới chuyên gia toàn cầu." },
          { icon: TrendingUp, color: "text-emerald-500", title: "Dữ liệu Thị trường", desc: "Cập nhật xu hướng tuyển dụng thời gian thực." },
          { icon: ShieldCheck, color: "text-slate-900", title: "Bảo mật Tuyệt đối", desc: "Dữ liệu của bạn được bảo vệ bởi chuẩn mã hóa cao nhất." }
        ].map((stat, i) => (
          <div key={i} className="premium-card rounded-3xl p-8 group cursor-default">
            <stat.icon className={`${stat.color} w-10 h-10 mb-6 group-hover:scale-110 transition-transform`} />
            <h4 className="font-bold text-xl mb-3">{stat.title}</h4>
            <p className="text-slate-500 leading-relaxed">{stat.desc}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default BentoFeatures;
