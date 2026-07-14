import React, { Suspense, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  CreditCard,
  FileBarChart2,
  Hourglass,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getAdminStatistics, getUserAiUsageSummaries } from '../services/adminStatisticsApi';

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

function getAiUsageCount(item) {
  return Number(item?.cvScoringRequestCount ?? 0) + Number(item?.mockInterviewRequestCount ?? 0);
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
  const [userAiUsageSummaries, setUserAiUsageSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [response, userSummaries] = await Promise.all([
          getAdminStatistics(),
          getUserAiUsageSummaries(),
        ]);
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
        setUserAiUsageSummaries(userSummaries ?? []);
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
  const userAiSegmentation = useMemo(() => {
    const threshold = 5;
    const users = (userAiUsageSummaries ?? [])
      .map((item) => {
        const aiUsageCount = getAiUsageCount(item);
        return {
          ...item,
          aiUsageCount,
          group: aiUsageCount >= threshold ? 'Thường Xuyên' : 'Thỉnh thoảng',
        };
      })
      .filter((item) => item.aiUsageCount > 0)
      .sort((a, b) => b.aiUsageCount - a.aiUsageCount);

    const frequentUsers = users.filter((item) => item.group === 'Thường Xuyên');
    const occasionalUsers = users.filter((item) => item.group === 'Thỉnh thoảng');

    return {
      threshold,
      users,
      frequentUsers,
      occasionalUsers,
      totalCvScoring: users.reduce((sum, item) => sum + Number(item.cvScoringRequestCount ?? 0), 0),
      totalMockInterview: users.reduce((sum, item) => sum + Number(item.mockInterviewRequestCount ?? 0), 0),
    };
  }, [userAiUsageSummaries]);

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

      <UserAiUsageDashboard data={userAiSegmentation} isLoading={isLoading} />

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

function UserAiUsageDashboard({ data, isLoading }) {
  const totalUsers = data.users.length;
  const frequentPercent = getPercent(data.frequentUsers.length, totalUsers);
  const maxUsage = Math.max(...data.users.map((item) => item.aiUsageCount), 1);
  const topUsers = data.users.slice(0, 6);
  const stackedChartData = topUsers.map((item) => ({
    name: item.fullName || `User #${item.userId}`,
    cvScoring: Number(item.cvScoringRequestCount ?? 0),
    mockInterview: Number(item.mockInterviewRequestCount ?? 0),
  }));

  return (
    <section className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">Phân nhóm User sử dụng AI</h2>
            <p className="text-sm text-stone-500">
              Thống kê lượt dùng CV Scoring và Mock Interview để phân loại mức độ sử dụng.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-stone-100 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-500">
          Thường Xuyên: từ {formatNumber(data.threshold)} lượt trở lên
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-2xl bg-stone-100" />
          ))}
        </div>
      ) : totalUsers === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 px-4 py-10 text-center text-sm text-stone-400">
          Chưa có dữ liệu sử dụng CV Scoring hoặc Mock Interview.
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AiUsageSummaryCard label="User có sử dụng AI" value={totalUsers} tone="stone" />
            <AiUsageSummaryCard label="Thường Xuyên" value={data.frequentUsers.length} tone="emerald" subtext={`${frequentPercent.toFixed(1)}% user có sử dụng`} />
            <AiUsageSummaryCard label="Thỉnh thoảng" value={data.occasionalUsers.length} tone="amber" />
            <AiUsageSummaryCard label="Tổng lượt AI chính" value={data.totalCvScoring + data.totalMockInterview} tone="blue" subtext={`CV ${formatNumber(data.totalCvScoring)} · Mock ${formatNumber(data.totalMockInterview)}`} />
          </div>

          <div className="rounded-2xl border border-stone-100 bg-white p-4">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Stacked Bar Chart theo User</h3>
                <p className="text-xs text-stone-400">So sánh CV Scoring và Mock Interview trên từng user.</p>
              </div>
              <div className="text-xs font-semibold text-stone-400">Top {formatNumber(topUsers.length)} user theo tổng lượt</div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stackedChartData}
                  layout="vertical"
                  margin={{ top: 8, right: 18, left: 18, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e7e5e4" />
                  <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#78716c', fontWeight: 600 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={150}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#57534e', fontWeight: 700 }}
                    tickFormatter={(value) => String(value).length > 18 ? `${String(value).slice(0, 18)}...` : value}
                  />
                  <Tooltip
                    cursor={{ fill: '#f5f5f4' }}
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e7e5e4', boxShadow: '0 12px 30px rgba(15,23,42,0.08)' }}
                    formatter={(value, name) => [formatNumber(value), name === 'cvScoring' ? 'CV Scoring' : 'Mock Interview']}
                  />
                  <Legend formatter={(value) => value === 'cvScoring' ? 'CV Scoring' : 'Mock Interview'} />
                  <Bar dataKey="cvScoring" stackId="usage" fill="#10b981" radius={[8, 0, 0, 8]} barSize={24} />
                  <Bar dataKey="mockInterview" stackId="usage" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-stone-100 bg-stone-50/60 p-4">
              <h3 className="text-sm font-bold text-stone-900">Tỷ lệ nhóm User</h3>
              <div className="mt-4 space-y-4">
                <GroupProgress
                  label="Thường Xuyên"
                  value={data.frequentUsers.length}
                  total={totalUsers}
                  barClass="bg-emerald-500"
                />
                <GroupProgress
                  label="Thỉnh thoảng"
                  value={data.occasionalUsers.length}
                  total={totalUsers}
                  barClass="bg-amber-500"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white">
              <div className="grid grid-cols-[1.45fr_0.7fr_0.7fr_0.8fr_0.85fr] gap-3 border-b border-stone-100 bg-stone-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-stone-400">
                <div>User</div>
                <div>CV</div>
                <div>Mock</div>
                <div>Tổng</div>
                <div>Nhóm</div>
              </div>
              <div className="divide-y divide-stone-100">
                {topUsers.map((item) => {
                  const width = `${Math.max(8, (item.aiUsageCount / maxUsage) * 100)}%`;
                  const isFrequent = item.group === 'Thường Xuyên';

                  return (
                    <div key={item.userId} className="grid grid-cols-[1.45fr_0.7fr_0.7fr_0.8fr_0.85fr] gap-3 px-4 py-3 text-sm">
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-stone-900">{item.fullName || `User #${item.userId}`}</div>
                        <div className="mt-1 truncate text-xs text-stone-400">{item.email || '-'}</div>
                      </div>
                      <div className="font-semibold text-stone-700">{formatNumber(item.cvScoringRequestCount)}</div>
                      <div className="font-semibold text-stone-700">{formatNumber(item.mockInterviewRequestCount)}</div>
                      <div>
                        <div className="font-bold text-stone-900">{formatNumber(item.aiUsageCount)}</div>
                        <div className="mt-1 h-1.5 rounded-full bg-stone-100">
                          <div className="h-1.5 rounded-full bg-emerald-500" style={{ width }} />
                        </div>
                      </div>
                      <div>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                          isFrequent ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}
                        >
                          {item.group}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function AiUsageSummaryCard({ label, value, tone, subtext }) {
  const toneClass = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    stone: 'bg-stone-50 text-stone-700 border-stone-100',
  }[tone] ?? 'bg-stone-50 text-stone-700 border-stone-100';

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <div className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</div>
      <div className="mt-2 text-2xl font-bold">{formatNumber(value)}</div>
      {subtext ? <div className="mt-1 text-xs font-semibold opacity-80">{subtext}</div> : null}
    </div>
  );
}

function GroupProgress({ label, value, total, barClass }) {
  const percent = getPercent(value, total);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-stone-700">{label}</span>
        <span className="font-bold text-stone-900">{formatNumber(value)} user</span>
      </div>
      <div className="h-2.5 rounded-full bg-stone-100">
        <div className={`h-2.5 rounded-full ${barClass}`} style={{ width: `${Math.max(4, percent)}%` }} />
      </div>
      <div className="mt-1 text-xs text-stone-400">{percent.toFixed(1)}%</div>
    </div>
  );
}
