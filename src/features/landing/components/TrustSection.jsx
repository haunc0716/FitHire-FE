import React from 'react';
import { motion } from 'framer-motion';

const TrustSection = () => {
  const trustBands = [
    { title: 'Uy tín đồng hành', desc: 'Tập trung xây dựng trải nghiệm chuyên nghiệp và nhất quán.' },
    { title: 'Chất lượng nội dung', desc: 'Mọi công cụ được thiết kế để hỗ trợ ứng tuyển thực tế hơn.' },
    { title: 'Hỗ trợ liên tục', desc: 'Các tính năng luôn sẵn sàng phục vụ khi người dùng cần.' },
    { title: 'Bảo mật thông tin', desc: 'Ưu tiên an toàn dữ liệu và quyền riêng tư của người dùng.' },
  ];

  const marqueeItems = [...trustBands, ...trustBands];

  return (
    <section className="py-20 border-b border-emerald-50 bg-white relative overflow-hidden">
      {/* Dynamic background detail */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-100 to-transparent" />

      <div className="max-w-7xl mx-auto px-0 sm:px-6 relative z-10">
        <div className="mb-8 px-6 sm:px-0 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-emerald-600/70">Giá trị nổi bật</p>
          <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-stone-900">Băng thông điệp thương hiệu</h3>
          <p className="mt-3 text-sm sm:text-base text-stone-500 max-w-2xl mx-auto">Thiết kế lại theo dạng dải nội dung chạy ngang để phần giới thiệu gọn mắt, hiện đại và tập trung vào thông điệp cốt lõi.</p>
        </div>

        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            className="flex w-max gap-5 px-6 sm:px-0"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          >
            {marqueeItems.map((s, i) => (
              <div
                key={`${s.title}-${i}`}
                className="w-[290px] sm:w-[340px] shrink-0 rounded-[28px] border border-emerald-100/80 bg-gradient-to-br from-white via-emerald-50/40 to-white px-6 py-6 shadow-[0_20px_60px_-35px_rgba(16,185,129,0.35)]"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500/80">FitHire Value</p>
                <h4 className="mt-4 text-xl font-bold text-primary leading-snug">{s.title}</h4>
                <p className="mt-3 text-sm leading-7 text-stone-600">{s.desc}</p>
                <div className="mt-5 h-px w-16 bg-gradient-to-r from-emerald-400 to-transparent" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
