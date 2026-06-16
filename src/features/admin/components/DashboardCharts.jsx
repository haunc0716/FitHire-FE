import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function DashboardCharts({ revenueSeries = [], planSeries = [] }) {
  const hasRevenue = revenueSeries.length > 0;
  const hasPlans = planSeries.length > 0;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.95fr]">
      <div className="bg-white rounded-[28px] p-6 border border-stone-200 shadow-sm">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Xu hướng doanh thu</h2>
            <p className="text-sm text-stone-500 font-medium">Biến động doanh thu theo từng ngày giao dịch</p>
          </div>
        </div>

        {hasRevenue ? (
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ece7e1" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#78716c' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#78716c' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '18px', border: '1px solid #e7e5e4', boxShadow: '0 20px 50px rgba(15,23,42,0.08)', padding: '12px 16px' }}
                  formatter={(value, name) => [name === 'revenue' ? `${Number(value).toLocaleString('vi-VN')} đ` : value, name === 'revenue' ? 'Doanh thu' : name]}
                  labelFormatter={(label) => `Ngày ${label}`}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={1200} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[340px] w-full flex items-center justify-center rounded-2xl border border-dashed border-stone-200 text-sm text-stone-400">
            Chưa có dữ liệu doanh thu.
          </div>
        )}
      </div>

      <div className="bg-white rounded-[28px] p-6 border border-stone-200 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-stone-900">Tương quan trạng thái giao dịch</h2>
        <p className="mb-8 text-sm font-medium text-stone-500">So sánh giao dịch thành công, chờ xử lý và trạng thái khác</p>
        {hasPlans ? (
          <div className="h-[310px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planSeries} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ece7e1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#78716c' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#78716c' }} />
                <Tooltip cursor={{ fill: '#f5f5f4' }} contentStyle={{ borderRadius: '16px', border: '1px solid #e7e5e4', boxShadow: '0 12px 30px rgba(15,23,42,0.08)' }} />
                <Bar dataKey="count" fill="#14B8A6" radius={[10, 10, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[310px] w-full mt-4 flex items-center justify-center rounded-2xl border border-dashed border-stone-200 text-sm text-stone-400">
            Chưa có dữ liệu giao dịch.
          </div>
        )}
      </div>
    </div>
  );
}
