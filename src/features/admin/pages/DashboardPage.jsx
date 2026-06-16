import React, { Suspense, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  CreditCard,
  Download,
  FileBarChart2,
  Hourglass,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import { getAdminStatistics } from '../services/adminStatisticsApi';

const DashboardCharts = React.lazy(() => import('../components/DashboardCharts'));

function formatNumber(value) {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num.toLocaleString('vi-VN') : '0';
}

function formatCurrency(value, currency = 'VND') {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return '0 đ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(num);
}

function getPercent(part, total) {
  const safePart = Number(part ?? 0);
  const safeTotal = Number(total ?? 0);
  if (!safeTotal) return 0;
  return (safePart / safeTotal) * 100;
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalPayments: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    totalAiTokens: 0,
    totalAiCostUsd: '0',
    dailyUserStats: [],
    dailyPaymentStats: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getAdminStatistics();
        setDashboard({
          totalUsers: response?.totalUsers ?? 0,
          totalPayments: response?.totalPayments ?? 0,
          successfulPayments: response?.successfulPayments ?? 0,
          pendingPayments: response?.pendingPayments ?? 0,
          totalRevenue: response?.totalRevenue ?? 0,
          totalAiTokens: response?.totalAiTokens ?? 0,
          totalAiCostUsd: response?.totalAiCostUsd ?? '0',
          dailyUserStats: response?.dailyUserStats ?? [],
          dailyPaymentStats: response?.dailyPaymentStats ?? [],
        });
      } catch (error) {
        console.error('Failed to load admin dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const revenueSeries = useMemo(() => (
    (dashboard.dailyPaymentStats ?? []).map((item) => ({
      label: item?.date ?? '-',
      revenue: Number(item?.revenue ?? 0),
      payments: Number(item?.count ?? 0),
    }))
  ), [dashboard.dailyPaymentStats]);

  const planSeries = useMemo(() => {
    const success = Number(dashboard.successfulPayments ?? 0);
    const pending = Number(dashboard.pendingPayments ?? 0);
    const failed = Math.max(Number(dashboard.totalPayments ?? 0) - success - pending, 0);

    return [
      { name: 'Thành công', count: success },
      { name: 'Chờ xử lý', count: pending },
      { name: 'Khác', count: failed },
    ].filter((item) => item.count > 0);
  }, [dashboard]);

  const conversionRate = getPercent(dashboard.successfulPayments, dashboard.totalPayments);
  const pendingRate = getPercent(dashboard.pendingPayments, dashboard.totalPayments);
  const avgRevenuePerPayment = dashboard.successfulPayments
    ? Number(dashboard.totalRevenue ?? 0) / Number(dashboard.successfulPayments ?? 1)
    : 0;

  const kpiCards = [
    {
      title: 'Doanh thu',
      value: formatCurrency(dashboard.totalRevenue),
      subtext: `${formatNumber(dashboard.successfulPayments)} giao dịch thành công`,
      icon: Wallet,
      tone: 'emerald',
      change: `${conversionRate.toFixed(1)}%`,
      positive: true,
    },
    {
      title: 'Người dùng',
      value: formatNumber(dashboard.totalUsers),
      subtext: 'Tổng tài khoản đã đăng ký',
      icon: Users,
      tone: 'blue',
      change: `${formatNumber(dashboard.dailyUserStats?.length ?? 0)} ngày có dữ liệu`,
      positive: true,
    },
    {
      title: 'Token AI đã dùng',
      value: formatNumber(dashboard.totalAiTokens),
      subtext: 'Theo dõi tổng token AI user đã sử dụng',
      icon: Bot,
      tone: 'violet',
      change: 'Theo dõi toàn hệ thống',
      positive: true,
    },
    {
      title: 'Giao dịch chờ',
      value: formatNumber(dashboard.pendingPayments),
      subtext: `${pendingRate.toFixed(1)}% trên tổng giao dịch`,
      icon: Hourglass,
      tone: 'amber',
      change: pendingRate > 20 ? 'Cần theo dõi' : 'Ổn định',
      positive: pendingRate <= 20,
    },
  ];

  const operationalCards = [
    {
      title: 'Hiệu suất thanh toán',
      icon: CreditCard,
      items: [
        { label: 'Tổng giao dịch', value: formatNumber(dashboard.totalPayments) },
        { label: 'Thành công', value: formatNumber(dashboard.successfulPayments) },
        { label: 'Chờ xử lý', value: formatNumber(dashboard.pendingPayments) },
        { label: 'Tỷ lệ thành công', value: `${conversionRate.toFixed(2)}%`, highlight: true },
      ],
    },
    {
      title: 'Token AI sử dụng',
      icon: Sparkles,
      items: [
        { label: 'Số token đã dùng', value: formatNumber(dashboard.totalAiTokens) },
        { label: 'Token / giao dịch thành công', value: dashboard.successfulPayments ? formatNumber(Math.round(Number(dashboard.totalAiTokens) / Number(dashboard.successfulPayments))) : '0', highlight: true },
        { label: 'Token / người dùng', value: dashboard.totalUsers ? formatNumber(Math.round(Number(dashboard.totalAiTokens) / Number(dashboard.totalUsers))) : '0' },
        { label: 'Trạng thái theo dõi', value: Number(dashboard.totalAiTokens) > 0 ? 'Đang ghi nhận token' : 'Chưa phát sinh token' },
      ],
    },
    {
      title: 'Tổng quan vận hành',
      icon: Activity,
      items: [
        { label: 'Ngày có doanh thu', value: formatNumber(dashboard.dailyPaymentStats?.length ?? 0) },
        { label: 'Ngày có user mới', value: formatNumber(dashboard.dailyUserStats?.length ?? 0) },
        { label: 'Số ngày có dữ liệu', value: formatNumber((dashboard.dailyPaymentStats?.length ?? 0) + (dashboard.dailyUserStats?.length ?? 0)) },
        { label: 'Trạng thái', value: dashboard.pendingPayments > 0 ? 'Đang theo dõi' : 'Ổn định', highlight: true },
      ],
    },
  ];

  const alerts = [];
  if (pendingRate > 20) {
    alerts.push({
      tone: 'amber',
      title: 'Cảnh báo tỷ lệ giao dịch chờ cao',
      description: `Hiện có ${formatNumber(dashboard.pendingPayments)} giao dịch chờ, chiếm ${pendingRate.toFixed(1)}% tổng giao dịch.`,
    });
  }
  if (Number(dashboard.totalAiTokens) > 0) {
    alerts.push({
      tone: 'violet',
      title: 'Theo dõi token AI',
      description: `Người dùng đã sử dụng ${formatNumber(dashboard.totalAiTokens)} token AI trên toàn hệ thống.`,
    });
  }
  if (alerts.length === 0) {
    alerts.push({
      tone: 'emerald',
      title: 'Hệ thống đang ổn định',
      description: 'Chưa phát hiện cảnh báo quan trọng trong thời gian hiện tại.',
    });
  }

  return (
    <div className="space-y-6 pb-10">
      <section className="rounded-[28px] border border-stone-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-semibold text-stone-500">Quản trị hệ thống</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-950">Dashboard quản trị</h1>
            <p className="mt-2 max-w-3xl text-sm text-stone-500">
              Theo dõi hiệu suất kinh doanh, vận hành thanh toán và mức sử dụng token AI của người dùng trên một màn hình tổng hợp.
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center justify-start gap-3 xl:w-auto xl:justify-end">
            <div className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
              Dữ liệu tổng quan hệ thống
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              <Download className="h-4 w-4" />
              Xuất báo cáo
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const toneClass =
            card.tone === 'emerald'
              ? 'bg-emerald-50 text-emerald-600'
              : card.tone === 'blue'
                ? 'bg-blue-50 text-blue-600'
                : card.tone === 'violet'
                  ? 'bg-violet-50 text-violet-600'
                  : 'bg-amber-50 text-amber-600';

          return (
            <div key={card.title} className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${card.positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {card.positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {card.change}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <p className="text-sm font-medium text-stone-500">{card.title}</p>
                <div className="text-3xl font-bold tracking-tight text-stone-950">
                  {isLoading ? <div className="h-9 w-32 animate-pulse rounded-xl bg-stone-100" /> : card.value}
                </div>
                <p className="text-sm text-stone-400">{card.subtext}</p>
              </div>
            </div>
          );
        })}
      </section>

      <Suspense
        fallback={(
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <div className="h-[420px] animate-pulse rounded-[28px] border border-stone-200 bg-stone-100" />
            <div className="h-[420px] animate-pulse rounded-[28px] border border-stone-200 bg-stone-100" />
          </div>
        )}
      >
        <DashboardCharts revenueSeries={revenueSeries} planSeries={planSeries} />
      </Suspense>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {operationalCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100 text-stone-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-900">{card.title}</h2>
                </div>
              </div>

              <div className="space-y-3">
                {card.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-stone-100 px-4 py-3">
                    <span className="text-sm text-stone-500">{item.label}</span>
                    <span className={`text-sm font-semibold ${item.highlight ? 'text-stone-950' : 'text-stone-700'}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FileBarChart2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Người dùng mới theo ngày</h2>
              <p className="text-sm text-stone-500">Giúp admin theo dõi thời điểm user đăng ký.</p>
            </div>
          </div>

          {(dashboard.dailyUserStats ?? []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-200 px-4 py-10 text-center text-sm text-stone-400">
              Chưa có dữ liệu người dùng mới.
            </div>
          ) : (
            <div className="space-y-3">
              {dashboard.dailyUserStats.slice(-6).reverse().map((item) => {
                const maxCount = Math.max(...dashboard.dailyUserStats.map((entry) => Number(entry?.count ?? 0)), 1);
                const width = `${Math.max(8, (Number(item?.count ?? 0) / maxCount) * 100)}%`;
                return (
                  <div key={`${item.date}-${item.count}`}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-stone-600">{item.date}</span>
                      <span className="font-semibold text-stone-900">{formatNumber(item.count)} user</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-stone-100">
                      <div className="h-2.5 rounded-full bg-blue-500" style={{ width }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Đề xuất & Cảnh báo</h2>
              <p className="text-sm text-stone-500">Tổng hợp tín hiệu quan trọng cho admin.</p>
            </div>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.title}
                className={`rounded-2xl border px-4 py-4 ${
                  alert.tone === 'amber'
                    ? 'border-amber-200 bg-amber-50 text-amber-900'
                    : alert.tone === 'violet'
                      ? 'border-violet-200 bg-violet-50 text-violet-900'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-900'
                }`}
              >
                <p className="text-sm font-bold uppercase tracking-wide">{alert.title}</p>
                <p className="mt-2 text-sm leading-6 opacity-90">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
