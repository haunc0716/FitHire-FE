import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { question: "Làm cách nào để xác minh hồ sơ học tập?", answer: "Tải lên thẻ sinh viên hoặc bảng điểm tại mục Xác minh. Kết quả sẽ có sau 24-48h." },
    { question: "Chi phí dành cho sinh viên là bao nhiêu?", answer: "FitHire hoàn toàn miễn phí cho các tính năng cơ bản dành cho sinh viên." },
    { question: "Dữ liệu của tôi có được bảo mật không?", answer: "Chúng tôi sử dụng chuẩn mã hóa AES-256 để bảo vệ thông tin cá nhân của bạn." },
  ];

  return (
    <section className="mb-32">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/3">
          <h2 className="text-h2 mb-8 uppercase">FAQ <span className="text-primary italic font-normal">.</span></h2>
          <p className="text-emerald-950/60">Các câu hỏi thường gặp nhất từ cộng đồng người dùng FitHire.</p>
        </div>
        <div className="lg:w-2/3 border-t border-emerald-100">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-emerald-100">
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex justify-between items-center py-8 text-left group"
              >
                <span className="font-bold text-xl text-zinc-900 group-hover:text-primary transition-colors">{faq.question}</span>
                {activeIndex === index ? <Minus className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-emerald-200 group-hover:text-primary" />}
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 text-emerald-950/60 text-lg max-w-2xl">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
