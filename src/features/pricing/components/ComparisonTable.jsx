import React from 'react';

const ComparisonTable = () => {
  const rows = [
    { name: 'Scan CV', free: '3 / tháng', luotLe: '-', plus: '15 / tháng', pro: 'Không giới hạn' },
    { name: 'Mock Interview', free: '1 / tháng', luotLe: '1 / lượt', plus: '10 / tháng', pro: 'Không giới hạn' },
    { name: 'CV Generation', free: '-', luotLe: '-', plus: '5 / tháng', pro: 'Không giới hạn' },
    { name: 'Culture Fit', free: '-', luotLe: '-', plus: '5 / tháng', pro: 'Không giới hạn' },
  ];

  return (
    <section className="mb-32">
      <div className="overflow-x-auto rounded-3xl border border-zinc-200">
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
    </section>
  );
};

export default ComparisonTable;

