import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, BriefcaseBusiness, Headset, ShieldCheck, Sparkles, Quote } from 'lucide-react';

const Testimonials = () => {
  const pillars = [
    {
      icon: BadgeCheck,
      title: 'Nền tảng chỉn chu',
      text: 'Giao diện và nội dung được sắp xếp rõ ràng để người dùng dễ bắt đầu và theo dõi tiến trình.',
      tag: 'Trải nghiệm tin cậy',
    },
    {
      icon: BriefcaseBusiness,
      title: 'Định hướng thực tế',
      text: 'Các tính năng tập trung vào nhu cầu tối ưu CV, luyện phỏng vấn và chuẩn bị cho quá trình ứng tuyển.',
      tag: 'Tập trung giá trị',
    },
    {
      icon: ShieldCheck,
      title: 'Ưu tiên an toàn',
      text: 'Thông tin và hành trình sử dụng được trình bày với định hướng minh bạch, bảo mật và chuyên nghiệp.',
      tag: 'Bảo mật & minh bạch',
    },
    {
      icon: Sparkles,
      title: 'Nội dung dễ tiếp cận',
      text: 'Cách diễn đạt được tinh chỉnh để hạn chế dữ liệu phóng đại và phù hợp hơn với hình ảnh thương hiệu.',
      tag: 'Ngôn ngữ phù hợp',
    },
    {
      icon: Headset,
      title: 'Đồng hành dài hạn',
      text: 'FitHire hướng tới việc hỗ trợ người dùng trong nhiều chặng đường thay vì chỉ một điểm chạm ngắn hạn.',
      tag: 'Hỗ trợ liên tục',
    },
    {
      icon: Quote,
      title: 'Thông điệp nhất quán',
      text: 'Các section được chuyển sang nội dung giới thiệu năng lực và giá trị cốt lõi thay cho testimonial giả lập.',
      tag: 'Thương hiệu rõ ràng',
    },
  ];

  return (
    <section className="section-container">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 block mb-6"
          >
            Giá trị nổi bật
          </motion.span>
          <h2 className="text-h2">GIÁ TRỊ CỐT LÕI <br /> <span className="text-primary italic font-normal">FITHIRE.</span></h2>
        </div>
        <div className="w-24 h-[1px] bg-emerald-100 hidden md:block mb-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {pillars.map((r, i) => {
          const Icon = r.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-[28px] border border-emerald-100 p-10 group hover:-translate-y-1 hover:shadow-[0_24px_70px_-40px_rgba(16,185,129,0.35)] transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:bg-emerald-100 transition-all duration-500" />

              <div className="relative z-10 mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary transition-colors duration-300">
                <Icon className="w-7 h-7" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-600 mb-4 relative z-10">
                {r.tag}
              </p>
              <h3 className="text-2xl font-bold text-zinc-950 mb-5 relative z-10 leading-snug">
                {r.title}
              </h3>
              <p className="text-zinc-600 leading-8 relative z-10">
                {r.text}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Testimonials;
