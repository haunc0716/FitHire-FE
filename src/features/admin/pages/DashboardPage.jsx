import React from 'react';
import { Users, CreditCard, Activity, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', users: 400, revenue: 2400 },
  { name: 'Feb', users: 300, revenue: 1398 },
  { name: 'Mar', users: 200, revenue: 9800 },
  { name: 'Apr', users: 278, revenue: 3908 },
  { name: 'May', users: 189, revenue: 4800 },
  { name: 'Jun', users: 239, revenue: 3800 },
  { name: 'Jul', users: 349, revenue: 4300 },
];

const stats = [
  { 
    name: 'Total Users', 
    value: '12,345', 
    change: '+12.5%', 
    isPositive: true,
    icon: Users,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  { 
    name: 'Active Subscriptions', 
    value: '8,234', 
    change: '+5.2%', 
    isPositive: true,
    icon: CreditCard,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600'
  },
  { 
    name: 'CVs Analyzed', 
    value: '45,678', 
    change: '+18.1%', 
    isPositive: true,
    icon: Activity,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600'
  },
  { 
    name: 'Interview Sessions', 
    value: '1,245', 
    change: '+8.4%', 
    isPositive: true, 
    icon: TrendingUp,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600'
  },
];

const activities = [
  { id: 1, title: 'New premium subscription', desc: 'Sarah Jenkins upgraded to Pro plan.', time: '2 hours ago', color: 'bg-violet-500' },
  { id: 2, title: 'New user registered', desc: 'Michael Chen created an account.', time: '4 hours ago', color: 'bg-blue-500' },
  { id: 3, title: 'CV Analysis completed', desc: 'System processed 150 CVs for UI/UX role.', time: '6 hours ago', color: 'bg-amber-500' },
  { id: 4, title: 'Interview scheduled', desc: 'Mock interview for Frontend Developer.', time: '8 hours ago', color: 'bg-rose-500' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, here's what's happening with FitHire today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
            Export Report
          </button>
          <button className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-xl hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200">
            View Analytics
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center ${stat.iconColor}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                stat.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
              }`}>
                {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue & User Growth</h2>
            <select className="text-sm bg-gray-50 border-none rounded-lg text-gray-600 focus:ring-0 py-1.5 px-3">
              <option>Last 7 months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                <div className={`w-2 h-2 mt-2 rounded-full ${activity.color} shrink-0 relative`}>
                  {index !== activities.length - 1 && <div className="absolute top-4 left-1/2 -ml-px w-px h-10 bg-gray-100" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.desc}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
