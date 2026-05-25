import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function DashboardCharts({ revenueSeries = [], planSeries = [] }) {
  const hasRevenue = revenueSeries.length > 0;
  const hasPlans = planSeries.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Tăng trưởng & Doanh thu</h2>
            <p className="text-sm text-stone-400 font-medium">Thống kê 7 tháng gần nhất</p>
          </div>
        </div>

        {hasRevenue ? (
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#A3A3A3' }} dy={15} label={{ value: 'Tháng', position: 'insideBottomRight', offset: -5, fill: '#a3a3a3', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#A3A3A3' }} label={{ value: 'Doanh thu (VND)', angle: -90, position: 'insideLeft', fill: '#a3a3a3', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[340px] w-full flex items-center justify-center text-sm text-stone-400">
            Chưa có dữ liệu doanh thu.
          </div>
        )}
      </div>

      <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-stone-900 mb-8">Phân bố Gói dịch vụ</h2>
        {hasPlans ? (
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planSeries} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#A3A3A3' }} label={{ value: 'Gói dịch vụ', position: 'insideBottom', offset: -5, fill: '#a3a3a3', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#A3A3A3' }} label={{ value: 'Số giao dịch', angle: -90, position: 'insideLeft', fill: '#a3a3a3', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#F5F5F4' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="count" fill="#10B981" radius={[8, 8, 8, 8]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] w-full mt-4 flex items-center justify-center text-sm text-stone-400">
            Chưa có dữ liệu phân bố gói.
          </div>
        )}
      </div>
    </div>
  );
}
