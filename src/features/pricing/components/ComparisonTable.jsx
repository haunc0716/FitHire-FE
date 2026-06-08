import React from 'react';

const ComparisonTable = () => {
  const rows = [
    { name: 'Quét CV', free: '3 / tháng', luotLe: '-', plus: '15 / tháng', pro: 'Không giới hạn' },
    { name: 'Phỏng vấn mô phỏng', free: '1 / tháng', luotLe: '1 / lượt', plus: '10 / tháng', pro: 'Không giới hạn' },
    { name: 'Độ phù hợp văn hóa', free: '-', luotLe: '-', plus: '5 / tháng', pro: 'Không giới hạn' },
  ];

  const highlights = ['Chi phí hợp lý', 'Linh hoạt theo nhu cầu', 'Tối ưu cho người mới bắt đầu', 'Nâng cấp dễ dàng'];
  const benefitCards = [
    {
      title: 'Dễ bắt đầu',
      description: 'Gói Free phù hợp để trải nghiệm nhanh các tính năng cốt lõi trước khi nâng cấp.',
      className: 'border-emerald-100 bg-emerald-50/70 text-emerald-700',
    },
    {
      title: 'Linh hoạt chi phí',
      description: 'Mua lượt lẻ khi cần sử dụng ngay, không phải trả phí dài hạn nếu nhu cầu chưa nhiều.',
      className: 'border-cyan-100 bg-cyan-50/70 text-cyan-700',
    },
    {
      title: 'Tối ưu nâng cấp',
      description: 'Plus và Pro dành cho người dùng muốn sử dụng thường xuyên với chi phí tối ưu hơn theo tháng.',
      className: 'border-teal-100 bg-teal-50/70 text-teal-700',
    },
  ];

  return (
    <section className="mt-14 mb-10 pb-10 lg:mt-20 lg:pb-14">
      <style>{`
        @keyframes pricing-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <div className="mx-auto mb-8 max-w-6xl overflow-hidden rounded-full border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 py-3">
        <div
          className="flex w-max items-center"
          style={{ animation: 'pricing-marquee 18s linear infinite' }}
        >
          {[...highlights, ...highlights].map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex shrink-0 items-center gap-6 px-6 text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-600 sm:text-xs"
            >
              <span>{item}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl overflow-x-auto rounded-3xl border border-zinc-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="p-6 text-xs font-bold uppercase tracking-widest text-zinc-900">Tính năng</th>
              <th className="p-6 text-center text-xs font-bold uppercase tracking-widest text-zinc-500">Free</th>
              <th className="p-6 text-center text-xs font-bold uppercase tracking-widest text-cyan-700">Lượt lẻ</th>
              <th className="p-6 text-center text-xs font-bold uppercase tracking-widest text-emerald-700">Plus</th>
              <th className="p-6 text-center text-xs font-bold uppercase tracking-widest text-teal-700">Pro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((row) => (
              <tr key={row.name} className="hover:bg-zinc-50/80 transition-colors">
                <td className="p-6 font-semibold text-zinc-900">{row.name}</td>
                <td className="p-6 text-center text-zinc-500">{row.free}</td>
                <td className="p-6 text-center text-cyan-700">{row.luotLe}</td>
                <td className="p-6 text-center text-emerald-700">{row.plus}</td>
                <td className="p-6 text-center text-teal-700">{row.pro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mx-auto mt-8 max-w-6xl overflow-hidden lg:mt-10">
        <div
          className="flex w-max items-stretch gap-4"
          style={{ animation: 'pricing-marquee 22s linear infinite' }}
        >
          {[...benefitCards, ...benefitCards].map((card, index) => (
            <div
              key={`${card.title}-${index}`}
              className={`w-[320px] shrink-0 rounded-2xl border px-5 py-4 ${card.className}`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em]">{card.title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
