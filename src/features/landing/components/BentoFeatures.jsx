import React from 'react';
import { FileText, Video, GitBranch, Gauge, Users, TrendingUp, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const BentoFeatures = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-zinc-200 border border-zinc-200 mt-24">
      {/* CV Optimization — Large */}
      <div className="md:col-span-8 bg-white p-12 group">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-8 block">Analytics</span>
            <h3 className="heading-md mb-6">Tối ưu hóa CV Đẳng cấp</h3>
            <p className="text-muted mb-12">
              Thuật toán phân tích ngữ nghĩa vượt trội giúp hồ sơ vượt qua ATS và chinh phục nhà tuyển dụng ngay cái nhìn đầu tiên.
            </p>
            <div className="flex flex-wrap gap-3">
              {['ATS Standard', 'Impact Score', 'Keyword Optimization'].map((text, i) => (
                <span key={i} className="text-[10px] font-bold uppercase tracking-widest border border-zinc-200 px-4 py-2 rounded-full">
                  {text}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1 aspect-square bg-zinc-50 border border-zinc-100 overflow-hidden">
            <img alt="CV Analysis" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" src="/images/cv-analysis.png" />
          </div>
        </div>
      </div>

      {/* Mock Interview */}
      <div className="md:col-span-4 bg-white p-12 group">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-8 block">Simulation</span>
        <h3 className="heading-md mb-6">Phỏng vấn giả lập</h3>
        <p className="text-muted mb-12">Luyện tập với AI. Nhận phân tích ngôn ngữ cơ thể và tư vấn chiến thuật trả lời.</p>
        <div className="aspect-video bg-zinc-50 border border-zinc-100 overflow-hidden">
          <img alt="Mock Interview" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" src="/images/mock-interview.png" />
        </div>
      </div>

      {/* Grid of smaller stats/features */}
      {[
        { icon: Gauge, title: 'Siêu tốc', desc: 'Báo cáo 60s' },
        { icon: Users, title: 'Cộng đồng', desc: '10K+ Chuyên gia' },
        { icon: TrendingUp, title: 'Thị trường', desc: 'Real-time data' },
        { icon: ShieldCheck, title: 'Bảo mật', desc: 'Chuẩn mã hóa' }
      ].map((item, i) => (
        <div key={i} className="md:col-span-3 bg-white p-12 hover:bg-zinc-50 transition-colors">
          <item.icon className="w-6 h-6 text-zinc-900 mb-6" />
          <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-900 mb-2">{item.title}</h4>
          <p className="text-muted text-sm">{item.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default BentoFeatures;
