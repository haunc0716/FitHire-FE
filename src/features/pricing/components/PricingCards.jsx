import React from 'react';
import { Check } from 'lucide-react';

const PricingCards = () => {
  const plans = [
    {
      name: 'Miễn phí',
      price: '0',
      period: 'Forever',
      features: ['3 lượt quét CV', '1 buổi phỏng vấn (Văn bản)', 'Cộng đồng hỗ trợ'],
      cta: 'Bắt đầu',
      dark: false,
    },
    {
      name: 'Plus',
      price: '129',
      period: 'Tháng',
      features: ['15 lượt quét CV', '5 buổi phỏng vấn AI', 'Biểu đồ kỹ năng Radar', 'Ưu tiên hỗ trợ'],
      cta: 'Đăng ký ngay',
      dark: true,
    },
    {
      name: 'Pro',
      price: '349',
      period: 'Tháng',
      features: ['Quét CV không giới hạn', 'Phỏng vấn AI không giới hạn', 'Phân tích hiệu suất chuyên sâu', 'Hỗ trợ 24/7'],
      cta: 'Dùng thử miễn phí',
      dark: false,
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 mb-32">
      {plans.map((plan, i) => (
        <div key={i} className={`p-12 transition-colors ${plan.dark ? 'bg-zinc-950 text-white' : 'bg-white hover:bg-zinc-50'}`}>
          <h3 className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-12 ${plan.dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {plan.name}
          </h3>
          
          <div className="mb-12">
            <span className="text-6xl font-display font-bold">{plan.price}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ml-4 ${plan.dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              K / {plan.period}
            </span>
          </div>

          <ul className="space-y-6 mb-16">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-4 text-sm">
                <Check className={`w-4 h-4 ${plan.dark ? 'text-zinc-500' : 'text-zinc-300'}`} />
                <span className={plan.dark ? 'text-zinc-400' : 'text-zinc-600'}>{f}</span>
              </li>
            ))}
          </ul>

          <button className={plan.dark ? 'btn-base w-full bg-white text-zinc-950 hover:bg-zinc-200' : 'btn-black w-full'}>
            {plan.cta}
          </button>
        </div>
      ))}
    </section>
  );
};

export default PricingCards;
