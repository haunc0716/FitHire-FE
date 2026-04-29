import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const ProcessFeatures = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-[1200px] mx-auto mb-32"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feature Card */}
        <div className="lg:col-span-8 card-clean rounded-3xl p-10 md:p-12 flex flex-col md:flex-row gap-12 items-center group">
          <div className="flex-1">
            <span className="label-tag block mb-4">Công nghệ cốt lõi</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 mb-6 tracking-tight">
              Công cụ Khớp nối Chính xác
            </h2>
            <p className="text-zinc-500 mb-8 text-lg leading-relaxed">
              Thuật toán độc quyền không chỉ tìm từ khóa; nó thấu hiểu bối cảnh ngữ nghĩa trong hành trình sự nghiệp của ứng viên.
            </p>
            <div className="space-y-4">
              {['98% Chính xác trong nhận diện kỹ năng', 'Khung đánh giá không định kiến'].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
                  </div>
                  <span className="text-zinc-800 font-semibold text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden h-72 border border-zinc-200 bg-zinc-50">
            <img
              alt="Logic AI"
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
              src="/images/ai-matching.png"
            />
          </div>
        </div>

        {/* Side Cards */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-zinc-900 p-10 rounded-3xl text-white flex-1 flex flex-col justify-center">
            <p className="text-5xl font-bold font-display mb-3 tracking-tight">85%</p>
            <p className="text-sm text-zinc-400 font-medium">Nhanh hơn trong sàng lọc ban đầu cho đội ngũ nhân sự.</p>
          </div>
          <div className="card-clean p-10 rounded-3xl flex-1 flex flex-col justify-center">
            <h3 className="font-display text-2xl font-bold text-zinc-900 mb-2">Cloud-Native</h3>
            <p className="text-zinc-500">Bảo mật, linh hoạt và sẵn sàng cho nhu cầu tuyển dụng toàn cầu.</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ProcessFeatures;
