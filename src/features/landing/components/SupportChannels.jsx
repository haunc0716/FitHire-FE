import React from 'react';
import { Users, Globe, BookOpen, ArrowUpRight } from 'lucide-react';

const SupportChannels = () => {
  const channels = [
    { icon: Users, title: 'Cộng đồng Zalo', desc: 'Kết nối trực tiếp với 5,000+ chuyên gia.' },
    { icon: Globe, title: 'Nhóm Facebook', desc: 'Chia sẻ kinh nghiệm thực tế hàng ngày.' },
    { icon: BookOpen, title: 'Hướng dẫn sử dụng', desc: 'Tài liệu chi tiết cho mọi tính năng.' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 mb-32">
      {channels.map((ch, i) => (
        <a key={i} href="#" className="bg-white p-12 group hover:bg-zinc-50 transition-colors">
          <div className="flex justify-between items-start mb-12">
            <ch.icon className="w-8 h-8 text-zinc-900" />
            <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-950 transition-colors" />
          </div>
          <h3 className="heading-md mb-4">{ch.title}</h3>
          <p className="text-muted text-sm">{ch.desc}</p>
        </a>
      ))}
    </div>
  );
};

export default SupportChannels;
