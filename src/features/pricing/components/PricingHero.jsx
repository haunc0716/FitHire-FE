import React from 'react';

const PricingHero = () => {
  return (
    <section className="mb-24">
      <div className="mb-7 flex items-center gap-4">
        <div className="h-px w-12 bg-primary" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Pricing</span>
      </div>

      <h1 className="text-h1 mb-6">
        Bảng giá <br />
        <span className="text-primary italic font-normal">minh bạch.</span>
      </h1>

      <p className="text-p max-w-2xl text-emerald-950/60">
        Chọn gói phù hợp và tối ưu hóa chi phí cho hành trình chinh phục sự nghiệp của bạn.
      </p>
    </section>
  );
};

export default PricingHero;
