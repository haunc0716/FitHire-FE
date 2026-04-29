import React from 'react';
import { ScanText, Mic2, BrainCircuit } from 'lucide-react';

const FeaturesGrid = () => {
  const features = [
    {
      icon: ScanText,
      title: 'Phân tích CV AI',
      desc: 'Tối ưu hóa hồ sơ theo chuẩn quốc tế. Hệ thống tự động nhận diện và gợi ý các từ khóa then chốt.',
    },
    {
      icon: Mic2,
      title: 'Phỏng vấn giả lập',
      desc: 'Rèn luyện phản xạ phỏng vấn với AI. Nhận báo cáo chi tiết về tông giọng và mức độ thuyết phục.',
    },
    {
      icon: BrainCircuit,
      title: 'Đánh giá độ phù hợp',
      desc: 'Xác định môi trường làm việc lý tưởng dựa trên các bài test tâm lý học tổ chức.',
    },
  ];

  return (
    <section className="section-container">
      <div className="text-center mb-20">
        <h2 className="text-h2 mb-6">TÍNH NĂNG CHÍNH.</h2>
        <div className="w-20 h-1 bg-zinc-900 mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((feat, i) => (
          <div key={i} className="clean-border text-center flex flex-col items-center">
            <div className="w-16 h-16 border border-zinc-900 flex items-center justify-center mb-8">
              <feat.icon className="w-6 h-6 text-zinc-900" />
            </div>
            <h3 className="font-display text-xl font-bold mb-4 uppercase tracking-wider">{feat.title}</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesGrid;
