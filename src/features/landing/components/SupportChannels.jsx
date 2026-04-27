import React from 'react';
import { Users, Globe, BookOpen, ArrowRight } from 'lucide-react';

const SupportChannels = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
      {/* Zalo Community */}
      <div className="glass-card p-8 rounded-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="w-14 h-14 bg-secondary-container/30 text-secondary rounded-2xl flex items-center justify-center mb-6">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="font-h3 text-h3 mb-3">Cộng đồng Zalo</h3>
        <p className="text-on-surface-variant mb-8 leading-relaxed">Tham gia nhóm chuyên gia năng động để nhận lời khuyên nghề nghiệp và kết nối thời gian thực.</p>
        <a className="text-primary font-semibold flex items-center gap-2 group" href="#">
          Tham gia ngay <ArrowRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
        </a>
      </div>
      {/* Facebook Community */}
      <div className="glass-card p-8 rounded-2xl hover:-translate-y-1 transition-all duration-300 border-primary/10">
        <div className="w-14 h-14 bg-primary-container text-primary rounded-2xl flex items-center justify-center mb-6">
          <Globe className="w-8 h-8" />
        </div>
        <h3 className="font-h3 text-h3 mb-3">Nhóm Facebook</h3>
        <p className="text-on-surface-variant mb-8 leading-relaxed">Kết nối với hàng ngàn đồng nghiệp và chia sẻ kinh nghiệm thực tập của bạn.</p>
        <a className="text-primary font-semibold flex items-center gap-2 group" href="#">
          Theo dõi chúng tôi <ArrowRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
        </a>
      </div>
      {/* Documentation */}
      <div className="glass-card p-8 rounded-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="w-14 h-14 bg-tertiary-container/50 text-tertiary rounded-2xl flex items-center justify-center mb-6">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="font-h3 text-h3 mb-3">Hướng dẫn sử dụng</h3>
        <p className="text-on-surface-variant mb-8 leading-relaxed">Tài liệu chi tiết từng bước về cách tối ưu hóa hồ sơ FitHire của bạn để thu hút nhà tuyển dụng.</p>
        <a className="text-primary font-semibold flex items-center gap-2 group" href="#">
          Đọc thêm <ArrowRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default SupportChannels;
