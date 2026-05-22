import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: 'Nguyễn Minh Anh',
      role: 'Kỹ sư phần mềm @ VNG',
      text: 'FitHire giúp tôi nhận ra những thiếu sót trong CV mà trước đây tôi chưa từng chú ý tới. Hệ thống phỏng vấn giả lập thực sự rất giống thực tế.',
      avatar: 'https://i.pravatar.cc/150?u=anh',
    },
    {
      name: 'Trần Hoàng Nam',
      role: 'Sinh viên mới tốt nghiệp',
      text: 'Một công cụ tuyệt vời cho sinh viên mới ra trường. Giao diện trực quan và các gợi ý từ AI rất sát với yêu cầu của nhà tuyển dụng.',
      avatar: 'https://i.pravatar.cc/150?u=nam',
    },
    {
      name: 'Lê Thu Trang',
      role: 'Quản lý nhân sự',
      text: 'Dưới góc độ tuyển dụng, tôi đánh giá cao cách FitHire chuẩn bị cho ứng viên. Những hồ sơ từ người dùng FitHire thường có độ hoàn thiện rất cao.',
      avatar: 'https://i.pravatar.cc/150?u=trang',
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
            Success Stories
          </motion.span>
          <h2 className="text-h2">CHIA SẺ TỪ <br /> <span className="text-primary italic font-normal">NGƯỜI DÙNG.</span></h2>
        </div>
        <div className="w-24 h-[1px] bg-emerald-100 hidden md:block mb-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-emerald-50 border border-emerald-50">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-12 group hover:bg-primary transition-all duration-700 relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:bg-emerald-400/20 transition-all duration-700" />

            <Quote className="w-8 h-8 text-emerald-100 mb-8 group-hover:text-emerald-300 transition-colors relative z-10" />
            <p className="text-zinc-600 group-hover:text-white leading-relaxed mb-12 italic relative z-10">
              "{r.text}"
            </p>
            <div className="flex items-center gap-4 relative z-10">
              <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-full border-2 border-emerald-50 group-hover:border-emerald-300 transition-colors" />
              <div>
                <p className="font-bold text-zinc-950 group-hover:text-white transition-colors">{r.name}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 group-hover:text-emerald-100 mt-1">{r.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
