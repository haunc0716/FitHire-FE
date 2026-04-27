import React from 'react';
import { ArrowRight, ScanText, Mic2, BrainCircuit, Check, MoveRight } from 'lucide-react';

const FeaturesGrid = () => {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="font-h2 text-4xl text-slate-900 mb-6 tracking-tight">Hệ sinh thái hỗ trợ toàn diện</h2>
            <p className="text-slate-500 text-lg leading-relaxed">Chúng tôi mang đến bộ giải pháp AI chuyên sâu giúp bạn tỏa sáng trong mắt các nhà tuyển dụng hàng đầu.</p>
          </div>
          <a className="inline-flex items-center gap-2 text-primary font-bold group" href="#">
            Xem tất cả tính năng
            <MoveRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* CV Scan */}
          <div className="group p-10 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(139,92,246,0.06)] transition-all duration-500">
            <div className="w-16 h-16 bg-white shadow-sm rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <ScanText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-h3 text-2xl text-slate-900 mb-4">Phân tích CV AI</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">Tối ưu hóa hồ sơ theo chuẩn ATS quốc tế, gợi ý từ khóa then chốt cho từng vị trí cụ thể.</p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-[15px] font-medium text-slate-700">
                <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary stroke-[3px]" />
                </span>
                Gợi ý từ khóa thông minh
              </li>
              <li className="flex items-center gap-3 text-[15px] font-medium text-slate-700">
                <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary stroke-[3px]" />
                </span>
                Sửa lỗi định dạng tự động
              </li>
            </ul>
            <a className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all" href="#">
              Thử ngay <ArrowRight className="w-5 h-5" />
            </a>
          </div>
          {/* Mock Interview */}
          <div className="group p-10 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-secondary/20 hover:shadow-[0_20px_50px_rgba(0,88,190,0.06)] transition-all duration-500">
            <div className="w-16 h-16 bg-white shadow-sm rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Mic2 className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="font-h3 text-2xl text-slate-900 mb-4">Phỏng vấn giả lập</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">Luyện tập trực tiếp với AI trong các tình huống thực tế, nhận phản hồi tức thì về ngôn ngữ cơ thể.</p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-[15px] font-medium text-slate-700">
                <span className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-secondary stroke-[3px]" />
                </span>
                Đánh giá giọng nói & thái độ
              </li>
              <li className="flex items-center gap-3 text-[15px] font-medium text-slate-700">
                <span className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-secondary stroke-[3px]" />
                </span>
                Hơn 2,000 câu hỏi chuyên sâu
              </li>
            </ul>
            <a className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all" href="#">
              Luyện tập <ArrowRight className="w-5 h-5" />
            </a>
          </div>
          {/* Cultural Fit */}
          <div className="group p-10 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-tertiary/20 hover:shadow-[0_20px_50px_rgba(91,91,101,0.06)] transition-all duration-500">
            <div className="w-16 h-16 bg-white shadow-sm rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <BrainCircuit className="w-8 h-8 text-slate-700" />
            </div>
            <h3 className="font-h3 text-2xl text-slate-900 mb-4">Đánh giá độ phù hợp</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">Bài trắc nghiệm phong cách làm việc giúp bạn tìm thấy doanh nghiệp có cùng hệ giá trị văn hóa.</p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-[15px] font-medium text-slate-700">
                <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                  <Check className="w-3 h-3 text-slate-600 stroke-[3px]" />
                </span>
                Phân tích EQ & Soft Skills
              </li>
              <li className="flex items-center gap-3 text-[15px] font-medium text-slate-700">
                <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                  <Check className="w-3 h-3 text-slate-600 stroke-[3px]" />
                </span>
                Khớp nối văn hóa công ty
              </li>
            </ul>
            <a className="inline-flex items-center gap-2 text-slate-700 font-bold hover:gap-3 transition-all" href="#">
              Tìm hiểu thêm <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
