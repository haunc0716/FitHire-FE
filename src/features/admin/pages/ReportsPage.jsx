import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, CreditCard, Users, Package, Loader2 } from 'lucide-react';
import { getAdminUsers } from '../services/userApi';
import { getAdminSubscriptions } from '../services/subscriptionApi';
import { getAdminPayments } from '../services/paymentApi';

function formatMoney(value, currency = 'VND') {
  const num = Number(value);
  if (!Number.isFinite(num)) return value ?? '-';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(num);
}

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('vi-VN');
}

function extractPlanLabel(payment) {
  return (
    payment?.plan?.name ||
    payment?.planName ||
    payment?.subscriptionName ||
    payment?.packageName ||
    payment?.productName ||
    payment?.plan ||
    'N/A'
  );
}

export default function ReportsPage() {
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    Promise.all([getAdminUsers(), getAdminSubscriptions(), getAdminPayments()])
      .then(([usersData, subsData, paymentsData]) => {
        if (!isMounted) return;
        setUsers(Array.isArray(usersData) ? usersData : usersData?.items || usersData?.content || []);
        setSubscriptions(Array.isArray(subsData) ? subsData : subsData?.items || subsData?.content || []);
        setPayments(Array.isArray(paymentsData) ? paymentsData : paymentsData?.items || paymentsData?.content || []);
      })
      .catch((error) => {
        console.error('Failed to load reports data:', error);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const activeSubs = subscriptions.filter((s) => s.status === 'ACTIVE' || s.status === 'PENDING').length;
    const successPayments = payments.filter((p) => ['SUCCESS', 'COMPLETED'].includes(String(p.status).toUpperCase()));
    const totalRevenue = successPayments.reduce((sum, p) => {
      const value = Number(p.amount ?? p.totalAmount ?? p.price ?? p.paidAmount ?? 0);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

    return {
      totalUsers: users.length,
      activeSubs,
      totalPayments: payments.length,
      totalRevenue,
    };
  }, [users, subscriptions, payments]);

  const latestPayments = useMemo(() => (
    [...payments]
      .sort((a, b) => new Date(b.createdAt || b.paidAt || 0).getTime() - new Date(a.createdAt || a.paidAt || 0).getTime())
      .slice(0, 6)
  ), [payments]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Báo cáo & phân tích</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng quan dữ liệu hệ thống và giao dịch gần đây.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang tải dữ liệu báo cáo...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Người dùng</span>
                <Users className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gói hoạt động</span>
                <Package className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.activeSubs}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tổng giao dịch</span>
                <BarChart3 className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalPayments}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Doanh thu</span>
                <CreditCard className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatMoney(stats.totalRevenue)}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Giao dịch gần đây</h2>
            </div>
            {latestPayments.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">Chưa có giao dịch nào.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 font-bold">Mã</th>
                      <th className="px-6 py-3 font-bold">Gói</th>
                      <th className="px-6 py-3 font-bold">Số tiền</th>
                      <th className="px-6 py-3 font-bold">Trạng thái</th>
                      <th className="px-6 py-3 font-bold">Ngày</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {latestPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900">{payment.id}</td>
                        <td className="px-6 py-4 text-gray-600">{extractPlanLabel(payment)}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{formatMoney(payment.amount ?? payment.totalAmount ?? payment.price)}</td>
                        <td className="px-6 py-4 text-gray-600">{payment.status || 'UNKNOWN'}</td>
                        <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(payment.createdAt || payment.paidAt || payment.updatedAt)}</td>
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
