import React, { Suspense, useEffect, useState } from 'react';
import { Users, CreditCard, Clock3, ArrowUpRight, ArrowDownRight, Package, Calendar } from 'lucide-react';
import { getAdminUsers } from '../services/userApi';
import { getAdminSubscriptions } from '../services/subscriptionApi';
import { getAdminPayments } from '../services/paymentApi';

const DashboardCharts = React.lazy(() => import('../components/DashboardCharts'));

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: { value: '0', change: '0%', isPositive: true },
    activeSubs: { value: '0', change: '0%', isPositive: true },
    totalPayments: { value: '0', change: '0%', isPositive: true },
    pendingPayments: { value: '0', change: '0%', isPositive: true },
  });
  const [revenueSeries, setRevenueSeries] = useState([]);
  const [planSeries, setPlanSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [users, subs, payments] = await Promise.all([
          getAdminUsers(),
          getAdminSubscriptions(),
          getAdminPayments()
        ]);

        const activeSubsCount = subs.filter(s => s.status === 'ACTIVE' || s.status === 'PENDING').length;
        const paymentItems = Array.isArray(payments) ? payments : payments?.items || payments?.content || [];
        const successStatuses = new Set(['SUCCESS', 'COMPLETED', 'PAID']);
        const successPayments = paymentItems.filter((p) => successStatuses.has(String(p.status).toUpperCase()));
        const pendingPaymentsCount = paymentItems.filter((p) => String(p.status).toUpperCase() === 'PENDING').length;

        const now = new Date();
        const months = Array.from({ length: 7 }, (_, index) => {
          const date = new Date(now.getFullYear(), now.getMonth() - (6 - index), 1);
          return {
            key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
            label: `Tháng ${date.getMonth() + 1}`,
            revenue: 0,
          };
        });

        const monthMap = new Map(months.map((item) => [item.key, item]));
        const getAmount = (payment) => {
          const raw = payment?.amount ?? payment?.totalAmount ?? payment?.price ?? payment?.paidAmount ?? 0;
          const value = Number(raw);
          return Number.isFinite(value) ? value : 0;
        };

        successPayments.forEach((payment) => {
          const createdAt = payment?.createdAt || payment?.paidAt || payment?.updatedAt;
          const date = createdAt ? new Date(createdAt) : null;
          if (!date || Number.isNaN(date.getTime())) return;
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const bucket = monthMap.get(key);
          if (bucket) {
            bucket.revenue += getAmount(payment);
          }
        });

        const planCounts = new Map();
        successPayments.forEach((payment) => {
          const label = payment?.planName || payment?.subscriptionName || payment?.packageName || payment?.productName || payment?.plan?.name || 'Khác';
          planCounts.set(label, (planCounts.get(label) ?? 0) + 1);
        });
        const planSeriesData = Array.from(planCounts.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);

        setStats(prev => ({
          ...prev,
          totalUsers: { value: users.length.toLocaleString(), change: '+5.2%', isPositive: true },
          activeSubs: { value: activeSubsCount.toLocaleString(), change: '+3.1%', isPositive: true },
          totalPayments: { value: paymentItems.length.toLocaleString(), change: '+2.4%', isPositive: true },
          pendingPayments: { value: pendingPaymentsCount.toLocaleString(), change: '-1.1%', isPositive: false },
        }));
        setRevenueSeries(months);
        setPlanSeries(planSeriesData);
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
      name: 'Tổng giao dịch', 
      value: stats.totalPayments.value, 
      change: stats.totalPayments.change, 
      isPositive: stats.totalPayments.isPositive,
      icon: CreditCard,
      color: 'amber'
    },
    { 
      name: 'Giao dịch chờ', 
      value: stats.pendingPayments.value, 
      change: stats.pendingPayments.change, 
      isPositive: stats.pendingPayments.isPositive,
      icon: Clock3,
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
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                'bg-rose-50 text-rose-600'
              }`}>
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

      <Suspense
        fallback={(
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[420px] rounded-[32px] bg-stone-50 border border-stone-100 animate-pulse" />
            <div className="h-[420px] rounded-[32px] bg-stone-50 border border-stone-100 animate-pulse" />
          </div>
        )}
      >
        <DashboardCharts revenueSeries={revenueSeries} planSeries={planSeries} />
      </Suspense>
    </div>
  );
}
