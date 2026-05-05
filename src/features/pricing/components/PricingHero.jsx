import React from 'react';

const PricingHero = () => {
  return (
    <section className="mb-20">
      <div className="mb-7 flex items-center gap-4">
        <div className="h-px w-12 bg-zinc-900" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-900">Pricing</span>
      </div>

      <h1 className="text-h1 mb-6">
        Bảng giá <br />
        <span className="text-zinc-400">minh bạch.</span>
      </h1>

      <p className="text-p max-w-2xl">
        Chọn gói phù hợp và test trực tiếp flow subscription trên web: checkout, thanh toán mô phỏng, active gói.
      </p>
    </section>
  );
};

export default PricingHero;
