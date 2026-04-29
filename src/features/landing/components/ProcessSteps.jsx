import React from 'react';
import { UploadCloud, Microscope, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProcessSteps = () => {
  const steps = [
    {
      icon: UploadCloud,
      step: '01',
      title: 'Tải lên JD',
      desc: 'Tải lên mô tả công việc. AI tự động trích xuất các kỹ năng và yêu cầu quan trọng nhất.',
      img: '/images/step-upload.png',
    },
    {
      icon: Microscope,
      step: '02',
      title: 'Quét CV',
      desc: 'Phân tích hàng loạt hồ sơ ứng viên bằng thuật toán khớp nối ngữ nghĩa chuyên sâu.',
      img: '/images/step-scan.png',
    },
    {
      icon: BarChart3,
      step: '03',
      title: 'Kết quả',
      desc: 'Nhận báo cáo Match Score chi tiết để đưa ra quyết định tuyển dụng chính xác.',
      img: '/images/step-results.png',
    },
  ];

  return (
    <section className="mt-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200">
        {steps.map((s, i) => (
          <div key={i} className="bg-white group">
            <div className="aspect-[4/3] overflow-hidden border-b border-zinc-100 grayscale group-hover:grayscale-0 transition-all duration-1000">
              <img alt={s.title} className="w-full h-full object-cover" src={s.img} />
            </div>
            <div className="p-12">
              <div className="flex items-center justify-between mb-8">
                <s.icon className="w-6 h-6 text-zinc-900" />
                <span className="text-4xl font-display font-bold text-zinc-100 group-hover:text-zinc-200 transition-colors">{s.step}</span>
              </div>
              <h3 className="heading-md mb-4">{s.title}</h3>
              <p className="text-muted text-base">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProcessSteps;
