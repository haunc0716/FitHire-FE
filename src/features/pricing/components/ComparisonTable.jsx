import React from 'react';

const ComparisonTable = () => {
  return (
    <section className="max-w-5xl mx-auto px-6 mb-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">So sánh chi tiết tính năng</h2>
        <div className="w-12 h-1 bg-violet-500 mx-auto rounded-full"></div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white premium-shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="p-6 font-semibold text-slate-800 w-1/3">Tính năng</th>
              <th className="p-6 text-xs uppercase tracking-widest text-slate-400 text-center font-bold">Free</th>
              <th className="p-6 text-xs uppercase tracking-widest text-slate-400 text-center font-bold">Beta</th>
              <th className="p-6 text-xs uppercase tracking-widest text-violet-600 text-center font-bold">Plus</th>
              <th className="p-6 text-xs uppercase tracking-widest text-slate-400 text-center font-bold">Pro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-6">
                <p className="font-semibold text-slate-800">Phân tích CV bằng AI</p>
                <p className="text-xs text-slate-500">Số lượt quét mỗi tháng</p>
              </td>
              <td className="p-6 text-center text-sm text-slate-600">3 lượt</td>
              <td className="p-6 text-center text-sm text-slate-400">—</td>
              <td className="p-6 text-center text-sm font-bold text-violet-600">15 lượt</td>
              <td className="p-6 text-center text-sm font-bold text-slate-900">Vô hạn</td>
            </tr>
            <tr>
              <td className="p-6">
                <p className="font-semibold text-slate-800">Phỏng vấn giả định AI</p>
                <p className="text-xs text-slate-500">Mô phỏng thời gian thực</p>
              </td>
              <td className="p-6 text-center text-sm text-slate-600">1 (Text)</td>
              <td className="p-6 text-center text-sm text-slate-600">1 (Voice)</td>
              <td className="p-6 text-center text-sm font-bold text-violet-600">5 (Voice)</td>
              <td className="p-6 text-center text-sm font-bold text-slate-900">Vô hạn</td>
            </tr>
            <tr>
              <td className="p-6">
                <p className="font-semibold text-slate-800">Hỗ trợ khách hàng</p>
                <p className="text-xs text-slate-500">Phản hồi nhanh chóng</p>
              </td>
              <td className="p-6 text-center text-sm text-slate-500">Cộng đồng</td>
              <td className="p-6 text-center text-sm text-slate-500">Email</td>
              <td className="p-6 text-center text-sm font-bold text-violet-600">Ưu tiên</td>
              <td className="p-6 text-center text-sm font-bold text-slate-900">24/7</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ComparisonTable;
