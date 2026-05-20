import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const chartData = [
  { name: 'Jan', users: 400, revenue: 2400 },
  { name: 'Feb', users: 300, revenue: 1398 },
  { name: 'Mar', users: 200, revenue: 9800 },
  { name: 'Apr', users: 278, revenue: 3908 },
  { name: 'May', users: 189, revenue: 4800 },
  { name: 'Jun', users: 239, revenue: 3800 },
  { name: 'Jul', users: 349, revenue: 4300 },
];

const packageData = [
  { name: 'Free', count: 120 },
  { name: 'Pro', count: 85 },
  { name: 'Elite', count: 45 },
  { name: 'Beta', count: 30 },
];

const monthLabels = {
  Jan: 'Tháng 1',
  Feb: 'Tháng 2',
  Mar: 'Tháng 3',
  Apr: 'Tháng 4',
  May: 'Tháng 5',
  Jun: 'Tháng 6',
  Jul: 'Tháng 7',
};

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Tăng trưởng & Doanh thu</h2>
            <p className="text-sm text-stone-400 font-medium">Thống kê hoạt động 7 tháng gần nhất</p>
          </div>
          <div className="flex items-center bg-stone-50 p-1 rounded-xl">
            <button className="px-3 py-1.5 text-xs font-bold text-stone-600 bg-white shadow-sm rounded-lg">Tháng</button>
            <button className="px-3 py-1.5 text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors">Năm</button>
          </div>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#A3A3A3' }} dy={15} label={{ value: 'Tháng', position: 'insideBottomRight', offset: -5, fill: '#a3a3a3', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#A3A3A3' }} label={{ value: 'Doanh thu (VND)', angle: -90, position: 'insideLeft', fill: '#a3a3a3', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                itemStyle={{ fontWeight: 'bold' }}
                labelFormatter={(label) => monthLabels[label] || label}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={2000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-xs text-stone-400">Nguồn: dữ liệu mô phỏng · 7 tháng gần nhất</p>
      </div>

      <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-stone-900 mb-8">Phân bố Gói dịch vụ</h2>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={packageData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#A3A3A3' }} label={{ value: 'Gói dịch vụ', position: 'insideBottom', offset: -5, fill: '#a3a3a3', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#A3A3A3' }} label={{ value: 'Số người dùng', angle: -90, position: 'insideLeft', fill: '#a3a3a3', fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#F5F5F4' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
              <Bar dataKey="count" fill="#10B981" radius={[8, 8, 8, 8]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-xs text-stone-400">Nguồn: dữ liệu mô phỏng · phân bố gói đang hoạt động</p>

        <div className="mt-8 space-y-4">
          <div className="p-4 bg-stone-50 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 bg-emerald-500 rounded-full" />
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase">Gói Elite mới</p>
                <p className="text-sm font-bold text-stone-800 mt-0.5">Vừa đăng ký: Sarah J.</p>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 bg-blue-500 rounded-full" />
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase">Báo cáo tuần</p>
                <p className="text-sm font-bold text-stone-800 mt-0.5">Sẵn sàng để xuất dữ liệu</p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
