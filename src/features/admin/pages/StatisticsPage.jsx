import React, { useEffect, useState } from 'react';
import { Users, CreditCard, CalendarDays, TrendingUp, Loader2 } from 'lucide-react';
import { getAdminStatistics } from '../services/adminStatisticsApi';

function formatMoney(value, currency = 'VND') {
  const num = Number(value);
  if (!Number.isFinite(num)) return value ?? '-';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(num);
}

export default function StatisticsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPayments: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
  });
  const [dailyUserStats, setDailyUserStats] = useState([]);
  const [dailyPaymentStats, setDailyPaymentStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await getAdminStatistics();
        setStats({
          totalUsers: response.totalUsers ?? 0,
          totalPayments: response.totalPayments ?? 0,
          successfulPayments: response.successfulPayments ?? 0,
          pendingPayments: response.pendingPayments ?? 0,
          totalRevenue: response.totalRevenue ?? 0,
        });
        setDailyUserStats(response.dailyUserStats ?? []);
        setDailyPaymentStats(response.dailyPaymentStats ?? []);
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
        <p className="text-sm text-gray-500 mt-1">Số liệu thống kê chi tiết về người dùng và giao dịch.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang tải dữ liệu thống kê...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Người dùng</span>
                <Users className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tổng giao dịch</span>
                <CreditCard className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalPayments.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Giao dịch thành công</span>
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.successfulPayments.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Doanh thu</span>
                <CalendarDays className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatMoney(stats.totalRevenue)}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Người dùng đăng ký theo ngày</h2>
            {dailyUserStats.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-8">Chưa có dữ liệu.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 font-bold">Ngày</th>
                      <th className="px-4 py-3 font-bold">Số lượng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dailyUserStats.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600">{item.date}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{item.count.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Giao dịch theo ngày</h2>
            {dailyPaymentStats.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-8">Chưa có dữ liệu.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 font-bold">Ngày</th>
                      <th className="px-4 py-3 font-bold">Số giao dịch</th>
                      <th className="px-4 py-3 font-bold">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dailyPaymentStats.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600">{item.date}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{item.count.toLocaleString()}</td>
                        <td className="px-4 py-3 font-semibold text-emerald-600">{formatMoney(item.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}