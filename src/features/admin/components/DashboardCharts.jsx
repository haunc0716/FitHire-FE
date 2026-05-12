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

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900">T\u0103ng tr\u01b0\u1edfng & Doanh thu</h2>
            <p className="text-sm text-stone-400 font-medium">Th\u1ed1ng k\u00ea ho\u1ea1t \u0111\u1ed9ng 7 th\u00e1ng g\u1ea7n nh\u1ea5t</p>
          </div>
          <div className="flex items-center bg-stone-50 p-1 rounded-xl">
            <button className="px-3 py-1.5 text-xs font-bold text-stone-600 bg-white shadow-sm rounded-lg">Th\u00e1ng</button>
            <button className="px-3 py-1.5 text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors">N\u0103m</button>
          </div>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#A3A3A3' }} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#A3A3A3' }} />
              <Tooltip
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={2000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-stone-900 mb-8">Ph\u00e2n b\u1ed1 G\u00f3i d\u1ecbch v\u1ee5</h2>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Free', count: 120 },
                { name: 'Pro', count: 85 },
                { name: 'Elite', count: 45 },
                { name: 'Beta', count: 30 },
              ]}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#A3A3A3' }} />
              <Tooltip cursor={{ fill: '#F5F5F4' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
              <Bar dataKey="count" fill="#10B981" radius={[8, 8, 8, 8]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 space-y-4">
          <div className="p-4 bg-stone-50 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 bg-emerald-500 rounded-full" />
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase">G\u00f3i Elite m\u1edbi</p>
                <p className="text-sm font-bold text-stone-800 mt-0.5">V\u1eeba \u0111\u0103ng k\u00fd: Sarah J.</p>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 bg-blue-500 rounded-full" />
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase">B\u00e1o c\u00e1o tu\u1ea7n</p>
                <p className="text-sm font-bold text-stone-800 mt-0.5">S\u1eb5n s\u00e0ng \u0111\u1ec3 xu\u1ea5t d\u1eef li\u1ec7u</p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
