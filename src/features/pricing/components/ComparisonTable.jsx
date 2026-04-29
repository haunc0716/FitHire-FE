import React from 'react';

const ComparisonTable = () => {
  const rows = [
    { name: 'Phân tích CV AI', free: '3 / tháng', plus: '15 / tháng', pro: 'Vô hạn' },
    { name: 'Phỏng vấn giả lập', free: '1 (Văn bản)', plus: '5 (Giọng nói)', pro: 'Vô hạn' },
    { name: 'Hỗ trợ khách hàng', free: 'Cộng đồng', plus: 'Ưu tiên', pro: '24/7' },
    { name: 'Báo cáo hiệu suất', free: 'Cơ bản', plus: 'Chi tiết', pro: 'Chuyên sâu' },
  ];

  return (
    <section className="mb-32">
      <div className="border border-zinc-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="p-8 text-[10px] font-bold uppercase tracking-widest text-zinc-900">Tính năng</th>
              <th className="p-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center">Free</th>
              <th className="p-8 text-[10px] font-bold uppercase tracking-widest text-zinc-900 text-center bg-zinc-100">Plus</th>
              <th className="p-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center">Pro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-zinc-50 transition-colors">
                <td className="p-8 font-bold text-sm text-zinc-900">{row.name}</td>
                <td className="p-8 text-sm text-zinc-500 text-center">{row.free}</td>
                <td className="p-8 text-sm font-bold text-zinc-900 text-center bg-zinc-50/50">{row.plus}</td>
                <td className="p-8 text-sm text-zinc-500 text-center">{row.pro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ComparisonTable;
