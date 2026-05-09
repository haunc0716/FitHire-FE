import React, { useEffect, useState } from 'react';
import { Users, CreditCard, Activity, TrendingUp, ArrowUpRight, ArrowDownRight, Package, Calendar, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getAdminUsers } from '../services/userApi';
import { getAdminSubscriptions } from '../services/subscriptionApi';

const chartData = [
  { name: 'Jan', users: 400, revenue: 2400 },
  { name: 'Feb', users: 300, revenue: 1398 },
  { name: 'Mar', users: 200, revenue: 9800 },
  { name: 'Apr', users: 278, revenue: 3908 },
  { name: 'May', users: 189, revenue: 4800 },
  { name: 'Jun', users: 239, revenue: 3800 },
  { name: 'Jul', users: 349, revenue: 4300 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: { value: '0', change: '0%', isPositive: true },
    activeSubs: { value: '0', change: '0%', isPositive: true },
    cvsAnalyzed: { value: '45,678', change: '+12.5%', isPositive: true },
    interviews: { value: '1,245', change: '+8.4%', isPositive: true },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [users, subs] = await Promise.all([
          getAdminUsers(),
          getAdminSubscriptions()
        ]);

        const activeSubsCount = subs.filter(s => s.status === 'ACTIVE' || s.status === 'PENDING').length;

        setStats(prev => ({
          ...prev,
          totalUsers: { value: users.length.toLocaleString(), change: '+5.2%', isPositive: true },
          activeSubs: { value: activeSubsCount.toLocaleString(), change: '+3.1%', isPositive: true },
        }));
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const kpiCards = [
    { 
      name: 'Tổng người dùng', 
      value: stats.totalUsers.value, 
      change: stats.totalUsers.change, 
      isPositive: stats.totalUsers.isPositive,
      icon: Users,
      color: 'emerald'
    },
    { 
      name: 'Gói đăng ký', 
      value: stats.activeSubs.value, 
      change: stats.activeSubs.change, 
      isPositive: stats.activeSubs.isPositive,
      icon: Package,
      color: 'blue'
    },
    { 
      name: 'CV đã phân tích', 
      value: stats.cvsAnalyzed.value, 
      change: stats.cvsAnalyzed.change, 
      isPositive: stats.cvsAnalyzed.isPositive,
      icon: Activity,
      color: 'amber'
    },
    { 
      name: 'Phỏng vấn Mock', 
      value: stats.interviews.value, 
      change: stats.interviews.change, 
      isPositive: stats.interviews.isPositive,
      icon: TrendingUp,
      color: 'rose'
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-stone-500 mt-1 font-medium italic">Chào mừng trở lại! Dưới đây là diễn biến mới nhất trên FitHire.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 text-stone-700 text-sm font-bold rounded-2xl hover:bg-stone-50 transition-all shadow-sm">
            <Calendar className="w-4 h-4 text-stone-400" />
            Lọc theo ngày
          </button>
          <button className="px-5 py-2.5 bg-[#00b14f] text-white text-sm font-bold rounded-2xl hover:bg-[#009b45] transition-all shadow-lg shadow-emerald-200">
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-3xl p-6 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-stone-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />
            
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${
                stat.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
              }`}>
                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-stone-400 text-xs font-bold uppercase tracking-widest">{stat.name}</h3>
              <p className="text-3xl font-bold text-stone-900 mt-2 tracking-tight">
                {isLoading ? <span className="inline-block w-20 h-8 bg-stone-100 animate-pulse rounded-lg" /> : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Chart */}
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
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
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

        {/* Right Panel: Recent Subscriptions or Bar Chart */}
        <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h2 className="text-xl font-bold text-stone-900 mb-8">Phân bố Gói dịch vụ</h2>
          <div className="h-[300px] w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Free', count: 120 },
                  { name: 'Pro', count: 85 },
                  { name: 'Elite', count: 45 },
                  { name: 'Beta', count: 30 }
                ]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#A3A3A3' }} />
                  <Tooltip cursor={{fill: '#F5F5F4'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)'}} />
                  <Bar dataKey="count" fill="#10B981" radius={[8, 8, 8, 8]} barSize={24} />
                </BarChart>
             </ResponsiveContainer>
          </div>
          
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
    </div>
  );
}
