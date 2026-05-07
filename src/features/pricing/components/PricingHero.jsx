import React from 'react';

const PricingHero = () => {
  return (
    <section className="mb-24 flex flex-col items-start">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-6 block">
        Bảng giá
      </span>

      <h1 className="text-h1 mb-8">
        Lựa chọn gói <br />
        <span className="text-primary italic font-semibold">minh bạch.</span>
      </h1>
      
      <div className="w-12 h-1 bg-primary rounded-full mb-10" />

      <p className="text-p max-w-2xl text-stone-500">
        Chọn lộ trình phù hợp và tối ưu hóa chi phí cho hành trình chinh phục sự nghiệp đỉnh cao của bạn.
      </p>
    </section>
  );
};

export default PricingHero;
