import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  Bot,
  CalendarDays,
  CreditCard,
  FileText,
  Loader2,
  MessagesSquare,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  getAdminStatistics,
  getAiFeatureDailyUsageStats,
  getAiFeatureUsageStats,
  getUserAiUsageSummaries,
} from '../services/adminStatisticsApi';

function formatMoney(value, currency = 'VND') {
  const num = Number(value);
  if (!Number.isFinite(num)) return value ?? '-';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(num);
}

function formatNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0';
  return new Intl.NumberFormat('vi-VN').format(num);
}

function sumBy(items, field) {
  return items.reduce((sum, item) => sum + Number(item?.[field] ?? 0), 0);
}

function maxBy(items, field) {
  return Math.max(1, ...items.map((item) => Number(item?.[field] ?? 0)));
}

const PIE_COLORS = ['#10b981', '#3b82f6'];

export default function StatisticsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPayments: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    totalAiTokens: 0,
    todayAiTokens: 0,
  });
  const [dailyUserStats, setDailyUserStats] = useState([]);
  const [dailyPaymentStats, setDailyPaymentStats] = useState([]);
  const [userAiUsageSummaries, setUserAiUsageSummaries] = useState([]);
  const [featureUsageStats, setFeatureUsageStats] = useState([]);
  const [featureDailyUsageStats, setFeatureDailyUsageStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [dashboardStats, userSummaries, featureStats, featureDailyStats] = await Promise.all([
          getAdminStatistics(),
          getUserAiUsageSummaries(),
          getAiFeatureUsageStats(),
          getAiFeatureDailyUsageStats(30),
        ]);

        setStats({
          totalUsers: dashboardStats.totalUsers ?? 0,
          totalPayments: dashboardStats.totalPayments ?? 0,
          successfulPayments: dashboardStats.successfulPayments ?? 0,
          pendingPayments: dashboardStats.pendingPayments ?? 0,
          totalRevenue: dashboardStats.totalRevenue ?? 0,
          totalAiTokens: dashboardStats.totalAiTokens ?? 0,
          todayAiTokens: dashboardStats.todayAiTokens ?? 0,
        });
        setDailyUserStats(dashboardStats.dailyUserStats ?? []);
        setDailyPaymentStats(dashboardStats.dailyPaymentStats ?? []);
        setUserAiUsageSummaries(userSummaries ?? []);
        setFeatureUsageStats(featureStats ?? []);
        setFeatureDailyUsageStats(featureDailyStats ?? []);
      } catch (error) {
        console.error('Failed to load statistics:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Thống kê hệ thống</h1>
        <p className="text-sm text-gray-500 mt-1">Số liệu thống kê chi tiết về người dùng, giao dịch và token AI.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang tải dữ liệu thống kê...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Người dùng" value={formatNumber(stats.totalUsers)} icon={Users} iconClass="text-emerald-500" />
            <MetricCard label="Tổng giao dịch" value={formatNumber(stats.totalPayments)} icon={CreditCard} iconClass="text-amber-500" />
            <MetricCard label="Giao dịch thành công" value={formatNumber(stats.successfulPayments)} icon={TrendingUp} iconClass="text-blue-500" />
            <MetricCard label="Doanh thu" value={formatMoney(stats.totalRevenue)} icon={CalendarDays} iconClass="text-rose-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Token hôm nay" value={formatNumber(stats.todayAiTokens)} icon={Bot} iconClass="text-emerald-500" />
            <MetricCard label="Tổng token AI" value={formatNumber(stats.totalAiTokens)} icon={Activity} iconClass="text-cyan-500" />
            <MetricCard label="Lượt sử dụng AI" value={formatNumber(sumBy(userAiUsageSummaries, 'requestCount'))} icon={FileText} iconClass="text-violet-500" />
            <MetricCard label="Mock Interview" value={formatNumber(sumBy(userAiUsageSummaries, 'mockInterviewRequestCount'))} icon={MessagesSquare} iconClass="text-rose-500" />
          </div>

          <DataSection title="Token AI theo người dùng" empty={userAiUsageSummaries.length === 0}>
            <table className="w-full min-w-[980px] text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tổng lượt sử dụng</TableHead>
                  <TableHead>CV scoring</TableHead>
                  <TableHead>Mock Interview</TableHead>
                  <TableHead>Token tổng</TableHead>
                  <TableHead>Token hôm nay</TableHead>
                  <TableHead>Lượt hôm nay</TableHead>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {userAiUsageSummaries.map((item) => (
                  <tr key={item.userId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.fullName || `User #${item.userId}`}</td>
                    <td className="px-4 py-3 text-gray-600">{item.email || '-'}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatNumber(item.requestCount)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatNumber(item.cvScoringRequestCount)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatNumber(item.mockInterviewRequestCount)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatNumber(item.totalTokens)}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">{formatNumber(item.todayTokens)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatNumber(item.todayRequestCount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataSection>

          <DataSection title="Số lượng sử dụng các chức năng AI" empty={featureUsageStats.length === 0}>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <TableHead>Chức năng</TableHead>
                  <TableHead>Tổng lượt sử dụng</TableHead>
                  <TableHead>Lượt hôm nay</TableHead>
                  <TableHead>Token tổng</TableHead>
                  <TableHead>Token hôm nay</TableHead>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {featureUsageStats.map((item) => (
                  <tr key={item.useCase} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{item.featureName || item.useCase}</div>
                      <div className="text-xs text-gray-400">{item.useCase}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatNumber(item.requestCount)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatNumber(item.todayRequestCount)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatNumber(item.totalTokens)}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">{formatNumber(item.todayTokens)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataSection>

          <DataSection title="Mức độ phát triển sử dụng AI theo ngày" empty={featureDailyUsageStats.length === 0}>
            <DailyFeatureGrowthDashboard items={featureDailyUsageStats} />
          </DataSection>

          <DataSection title="Người dùng đăng ký theo ngày" empty={dailyUserStats.length === 0}>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Số lượng</TableHead>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dailyUserStats.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{item.date}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatNumber(item.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataSection>

          <DataSection title="Giao dịch theo ngày" empty={dailyPaymentStats.length === 0}>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Số giao dịch</TableHead>
                  <TableHead>Doanh thu</TableHead>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dailyPaymentStats.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{item.date}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatNumber(item.count)}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">{formatMoney(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataSection>
        </>
      )}
    </div>
  );
}

function DailyFeatureGrowthDashboard({ items }) {
  const maxTotalUsage = maxBy(items, 'totalUsageCount');
  const totalCvScoring = sumBy(items, 'cvScoringUsageCount');
  const totalMockInterview = sumBy(items, 'mockInterviewUsageCount');
  const latestDay = items[items.length - 1];
  const tableItems = items.slice(-10).reverse();
  const chartData = items.map((item) => ({
    date: item.date,
    cvScoring: Number(item.cvScoringUsageCount ?? 0),
    mockInterview: Number(item.mockInterviewUsageCount ?? 0),
    totalUsage: Number(item.totalUsageCount ?? 0),
    totalTokens: Number(item.totalTokens ?? 0),
  }));
  const pieData = [
    { name: 'CV scoring', value: totalCvScoring },
    { name: 'Mock Interview', value: totalMockInterview },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400">CV scoring</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{formatNumber(totalCvScoring)}</div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Mock Interview</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{formatNumber(totalMockInterview)}</div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Ngày mới nhất</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{latestDay?.date ?? '-'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartPanel title="Tổng lượt AI theo ngày">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickMargin={8} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} width={34} />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Line type="monotone" dataKey="totalUsage" name="Tổng lượt" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="CV scoring và Mock Interview theo ngày">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickMargin={8} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} width={34} />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Legend />
              <Bar dataKey="cvScoring" name="CV scoring" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="mockInterview" name="Mock Interview" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      <ChartPanel title="Tỷ lệ sử dụng từng chức năng">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,360px)_1fr] gap-4 items-center">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {pieData.map((item, index) => {
              const total = totalCvScoring + totalMockInterview;
              const percent = total === 0 ? 0 : (Number(item.value) / total) * 100;
              return (
                <div key={item.name} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                      <span className="font-semibold text-gray-900">{item.name}</span>
                    </div>
                    <span className="font-bold text-gray-900">{percent.toFixed(1)}%</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">{formatNumber(item.value)} lượt sử dụng</div>
                </div>
              );
            })}
          </div>
        </div>
      </ChartPanel>

      <table className="w-full min-w-[860px] text-sm text-left">
        <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
          <tr>
            <TableHead>Ngày</TableHead>
            <TableHead>CV scoring</TableHead>
            <TableHead>Mock Interview</TableHead>
            <TableHead>Tổng lượt</TableHead>
            <TableHead>Token</TableHead>
            <TableHead>Tăng trưởng</TableHead>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tableItems.map((item) => {
            const width = `${Math.max(6, (Number(item.totalUsageCount ?? 0) / maxTotalUsage) * 100)}%`;
            return (
              <tr key={item.date} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{item.date}</td>
                <td className="px-4 py-3 text-gray-700">{formatNumber(item.cvScoringUsageCount)}</td>
                <td className="px-4 py-3 text-gray-700">{formatNumber(item.mockInterviewUsageCount)}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">{formatNumber(item.totalUsageCount)}</td>
                <td className="px-4 py-3 font-semibold text-emerald-600">{formatNumber(item.totalTokens)}</td>
                <td className="px-4 py-3">
                  <div className="h-2.5 w-full rounded-full bg-gray-100">
                    <div className="h-2.5 rounded-full bg-emerald-500" style={{ width }} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ChartPanel({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <h3 className="mb-3 text-sm font-bold text-gray-900">{title}</h3>
      {children}
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, iconClass }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        <Icon className={`w-4 h-4 ${iconClass}`} />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function DataSection({ title, empty, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      {empty ? (
        <div className="text-center text-sm text-gray-500 py-8">Chưa có dữ liệu.</div>
      ) : (
        <div className="overflow-x-auto">{children}</div>
      )}
    </div>
  );
}

function TableHead({ children }) {
  return <th className="px-4 py-3 font-bold">{children}</th>;
}
