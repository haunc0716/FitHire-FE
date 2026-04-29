import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: 'Nguyễn Minh Anh',
      role: 'Software Engineer @ VNG',
      text: 'FitHire giúp tôi nhận ra những thiếu sót trong CV mà trước đây tôi chưa từng chú ý tới. Hệ thống phỏng vấn giả lập thực sự rất giống thực tế.',
    },
    {
      name: 'Trần Hoàng Nam',
      role: 'Fresh Graduate',
      text: 'Một công cụ tuyệt vời cho sinh viên mới ra trường. Giao diện trực quan và các gợi ý từ AI rất sát với yêu cầu của nhà tuyển dụng.',
    },
    {
      name: 'Lê Thu Trang',
      role: 'HR Manager',
      text: 'Dưới góc độ tuyển dụng, tôi đánh giá cao cách FitHire chuẩn bị cho ứng viên. Những hồ sơ từ người dùng FitHire thường có độ hoàn thiện rất cao.',
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
          <h2 className="text-h2">CHIA SẺ TỪ <br /> NGƯỜI DÙNG.</h2>
        </div>
        <div className="w-24 h-[1px] bg-zinc-200 hidden md:block mb-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-12 group hover:bg-zinc-950 transition-all duration-700"
          >
            <Quote className="w-8 h-8 text-zinc-100 mb-8 group-hover:text-zinc-800 transition-colors" />
            <p className="text-zinc-600 group-hover:text-zinc-300 leading-relaxed mb-12 italic">
              "{r.text}"
            </p>
            <div>
              <p className="font-bold text-zinc-950 group-hover:text-white transition-colors">{r.name}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">{r.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
