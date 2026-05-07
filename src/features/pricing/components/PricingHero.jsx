import React from 'react';

const PricingHero = () => {
  return (
    <section className="mb-24 flex flex-col items-start">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px w-10 bg-emerald-600/40"></div>
        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-emerald-800">
          Upgrade Your Career
        </span>
        <div className="h-px w-10 bg-emerald-600/40"></div>
      </div>

      <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tight leading-[1.1]">
        Lựa chọn gói <br />
        <span className="text-emerald-600 italic">minh bạch.</span>
      </h1>

      <p className="text-p max-w-2xl text-stone-500">
        Chọn lộ trình phù hợp và tối ưu hóa chi phí cho hành trình chinh phục sự nghiệp đỉnh cao của bạn.
      </p>
    </section>
  );
};

export default PricingHero;
