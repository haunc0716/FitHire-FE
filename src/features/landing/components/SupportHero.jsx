import React from 'react';
import { Search } from 'lucide-react';

const SupportHero = () => {
  return (
    <section className="text-center mb-24">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full font-label-caps text-[10px] mb-6 uppercase tracking-widest">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        Chúng tôi có thể giúp gì cho bạn?
      </div>
      <h1 className="font-h1 text-h1 text-on-background mb-6 max-w-3xl mx-auto leading-[1.1]">Trung tâm Hỗ trợ FitHire</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto opacity-80">
        Tìm câu trả lời cho các câu hỏi thường gặp, tham gia cộng đồng chuyên gia của chúng tôi hoặc trò chuyện với đội ngũ hỗ trợ.
      </p>
      <div className="mt-12 max-w-2xl mx-auto relative group">
        <input className="w-full bg-white border-slate-200 rounded-2xl px-7 py-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-xl shadow-slate-200/40 text-lg placeholder:text-slate-400" placeholder="Tìm kiếm bài viết, hướng dẫn..." type="text" />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-primary/20">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default SupportHero;
