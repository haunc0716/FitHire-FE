import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  History,
  Wallet,
  ReceiptText
} from 'lucide-react';
import { fetchPaymentHistory, reportPayment } from '../../pricing/services/subscriptionApi';
import { useToast } from '../../../components/ui/ToastProvider';

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'SUCCESS':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
          <CheckCircle2 className="h-3 w-3" /> Thành công
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
          <XCircle className="h-3 w-3" /> Thất bại
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-bold text-stone-600">
          <XCircle className="h-3 w-3" /> Đã hủy
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
          <Clock className="h-3 w-3" /> Chờ xử lý
        </span>
      );
  }
};

const PaymentHistoryPage = () => {
  const PAYMENT_TIMEOUT_SECONDS = 5 * 60;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportingId, setReportingId] = useState(null);
  const [now, setNow] = useState(Date.now());
  const autoRefreshLockRef = useRef(false);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchPaymentHistory();
      setPayments(data?.content || []);
    } catch (error) {
      showToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải lịch sử thanh toán.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (loading || payments.length === 0 || autoRefreshLockRef.current) return;

    const hasExpiredPending = payments.some((payment) => {
      if (payment.status !== 'PENDING' || !payment.createdAt) return false;
      const elapsedSeconds = Math.floor((now - new Date(payment.createdAt).getTime()) / 1000);
      return elapsedSeconds >= PAYMENT_TIMEOUT_SECONDS;
    });

    if (!hasExpiredPending) return;

    autoRefreshLockRef.current = true;
    loadHistory().finally(() => {
      window.setTimeout(() => {
        autoRefreshLockRef.current = false;
      }, 8000);
    });
  }, [loading, now, payments]);

  const handleReport = async (paymentId) => {
    try {
      setReportingId(paymentId);
      await reportPayment(paymentId);
      showToast({
        type: 'success',
        title: 'Đã gửi báo cáo',
        message: 'Yêu cầu của bạn đã được gửi tới Admin để xác nhận.'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Lỗi',
        message: error.message || 'Không thể gửi báo cáo.'
      });
    } finally {
      setReportingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '---';
    return new Date(dateStr).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const getRemainingSeconds = (createdAt) => {
    if (!createdAt) return 0;
    const elapsedSeconds = Math.floor((now - new Date(createdAt).getTime()) / 1000);
    return Math.max(0, PAYMENT_TIMEOUT_SECONDS - elapsedSeconds);
  };

  const formatRemainingTime = (remainingSeconds) => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const stats = [
    { label: 'Tổng giao dịch', value: payments.length, icon: ReceiptText },
    { label: 'Thành công', value: payments.filter((payment) => payment.status === 'SUCCESS').length, icon: BadgeCheck },
    { label: 'Chờ xử lý', value: payments.filter((payment) => payment.status === 'PENDING').length, icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-stone-50 pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/user/profile')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại hồ sơ
        </button>

        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(16,185,129,0.12)] backdrop-blur">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(120,113,108,0.08),transparent_25%)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                <Sparkles className="h-4 w-4" /> FitHire Payments
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
                Quản lý thanh toán trong một không gian đẹp và rõ ràng
              </h1>
              <p className="mt-4 text-base leading-8 text-stone-600 sm:text-lg">
                Theo dõi trạng thái giao dịch, xử lý thanh toán lại khi cần và gửi báo cáo nhanh chóng nếu có vấn đề.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-3xl border border-stone-100 bg-white p-4 shadow-sm">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-stone-500">{item.label}</p>
                    <p className="mt-1 text-2xl font-black text-stone-900">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-[2rem] border border-stone-200 bg-white py-20 shadow-sm">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-600" />
            <p className="font-medium text-stone-500">Đang tải lịch sử...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-stone-50">
              <CreditCard className="h-10 w-10 text-stone-300" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Chưa có giao dịch nào</h3>
            <p className="mx-auto mt-3 max-w-sm text-stone-500">
              Bạn chưa thực hiện bất kỳ giao dịch nâng cấp nào trên FitHire.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-8 py-4 font-bold text-white transition hover:bg-emerald-700"
            >
              Xem bảng giá
            </button>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/70">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-400">Mã giao dịch</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-400">Gói dịch vụ</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-400">Số tiền</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-400">Trạng thái</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-400">Ngày tạo</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-stone-400">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {payments.map((payment) => {
                    const remainingSeconds = payment.status === 'PENDING' ? getRemainingSeconds(payment.createdAt) : 0;
                    const isPendingExpired = payment.status === 'PENDING' && remainingSeconds === 0;

                    return (
                      <tr key={payment.id} className="group transition-colors hover:bg-stone-50/40">
                        <td className="px-6 py-5">
                          <span className="text-sm font-bold text-stone-900">#{payment.id}</span>
                          {payment.orderCode && <p className="mt-0.5 text-[10px] text-stone-400">PayOS: {payment.orderCode}</p>}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-stone-700">FitHire Pro</span>
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700">PLUS</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-black text-stone-900">{formatAmount(payment.amount)}</span>
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge status={payment.status} />
                          {payment.status === 'PENDING' && (
                            <p className={`mt-1 text-[11px] font-semibold ${isPendingExpired ? 'text-rose-600' : 'text-amber-700'}`}>
                              {isPendingExpired ? 'Đang chờ hệ thống hủy...' : `Còn lại: ${formatRemainingTime(remainingSeconds)}`}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-stone-500">{formatDate(payment.createdAt)}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          {payment.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-2">
                              {payment.checkoutUrl && !isPendingExpired && (
                                <a
                                  href={payment.checkoutUrl}
                                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                                >
                                  Thanh toán lại
                                </a>
                              )}
                              <button
                                disabled={reportingId === payment.id}
                                onClick={() => handleReport(payment.id)}
                                className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
                              >
                                {reportingId === payment.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <AlertCircle className="h-3 w-3" />}
                                Báo lỗi
                              </button>
                            </div>
                          ) : (
                            <button className="text-stone-400 transition-colors group-hover:text-emerald-600">
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <AlertCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-900">Cần hỗ trợ?</h4>
              <p className="mt-1 text-sm text-emerald-700">
                Giao dịch ở trạng thái <strong>"Chờ xử lý"</strong> sẽ tự động hủy sau 5 phút. Nếu bạn đã thanh toán thành công nhưng trạng thái chưa cập nhật, hãy nhấn <strong>"Báo lỗi"</strong> để Admin hỗ trợ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
