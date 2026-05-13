import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  ReceiptText,
  BadgeCheck,
  ChevronLeft,
  Wallet
} from 'lucide-react';
import { fetchPaymentHistory, reportPayment, fetchPaymentSummary } from '../../pricing/services/subscriptionApi';
import { useToast } from '../../../components/ui/ToastProvider';

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'SUCCESS':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" /> Thành công
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500">
          <XCircle className="h-3.5 w-3.5" /> Thất bại
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-400">
          <XCircle className="h-3.5 w-3.5" /> Đã hủy
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500">
          <Clock className="h-3.5 w-3.5" /> Chờ xử lý
        </span>
      );
  }
};

const PaymentHistoryPage = () => {
  const PAGE_SIZE = 5;
  
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    successCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [reportingId, setReportingId] = useState(null);
  const [reportedIds, setReportedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadData = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      const [historyData, summaryData] = await Promise.all([
        fetchPaymentHistory({ page, size: PAGE_SIZE, sortBy: 'createdAt', sortDirection: 'DESC' }),
        fetchPaymentSummary()
      ]);
      
      setPayments(historyData?.content || []);
      setTotalPages(historyData?.totalPages || 0);
      setCurrentPage(historyData?.page || 0);
      
      if (summaryData) {
        setSummary(summaryData);
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải dữ liệu.' });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData(currentPage);
  }, [loadData, currentPage]);

  useEffect(() => {
    loadData(currentPage);
  }, [loadData, currentPage]);

  const handleReport = async (paymentId) => {
    if (reportedIds.has(paymentId)) return;
    
    try {
      setReportingId(paymentId);
      await reportPayment(paymentId);
      setReportedIds(prev => new Set(prev).add(paymentId));
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
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-stone-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Lịch sử thanh toán</h1>
          <p className="text-stone-500 text-sm">Theo dõi và quản lý các giao dịch nâng cấp tài khoản của bạn.</p>
        </div>

        {/* Stats - 4 equal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <SimpleStat label="Tổng đơn" value={summary.totalTransactions} icon={ReceiptText} />
          <SimpleStat label="Thành công" value={summary.successCount} icon={BadgeCheck} isEmerald />
          <SimpleStat label="Đã hủy" value={summary.cancelledCount} icon={XCircle} isRed />
          <SimpleStat label="Tổng chi tiêu" value={formatAmount(summary.totalAmount)} icon={Wallet} isBlue />
        </div>

        {loading && payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-stone-100 rounded-3xl bg-white shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-stone-200" />
            <p className="mt-4 text-xs font-bold text-stone-400 uppercase tracking-widest">Đang tải...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-stone-200 rounded-3xl bg-white shadow-sm">
            <div className="mx-auto w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-stone-300" />
            </div>
            <h3 className="text-lg font-bold">Chưa có giao dịch</h3>
            <p className="text-stone-400 text-sm mt-1">Bạn chưa thực hiện thanh toán nào trên hệ thống.</p>
            <button
              onClick={() => navigate('/user/pricing')}
              className="mt-8 px-6 py-2.5 bg-stone-900 text-white text-sm font-bold rounded-xl hover:bg-stone-800 transition-colors"
            >
              Xem bảng giá
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="overflow-x-auto bg-white rounded-3xl border border-stone-100 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-50">
                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-stone-400">ID</th>
                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-stone-400">Gói dịch vụ</th>
                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-stone-400">Số tiền</th>
                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-stone-400">Trạng thái</th>
                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-stone-400">Thời gian</th>
                    <th className="px-6 py-5 text-right text-[11px] font-black uppercase tracking-[0.1em] text-stone-400">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {payments.map((payment) => {
                    const isReporting = reportingId === payment.id;
                    const isReported = reportedIds.has(payment.id);
                    const isPending = payment.status === 'PENDING';
                    const canReport = isPending;

                    return (
                      <tr key={payment.id} className="group hover:bg-stone-50/30 transition-colors">
                        <td className="px-6 py-6">
                          <span className="text-sm font-bold text-stone-900 leading-tight">{payment.id}</span>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-sm font-bold text-stone-700">{payment.planName || 'Gói Premium'}</span>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-sm font-bold text-stone-900">{formatAmount(payment.amount)}</span>
                        </td>
                        <td className="px-6 py-6">
                          <StatusBadge status={payment.status} />
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-sm text-stone-500">{formatDate(payment.createdAt)}</span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="flex items-center justify-end gap-4">
                            {canReport && (
                              <button
                                disabled={isReporting || isReported}
                                onClick={() => handleReport(payment.id)}
                                className={`text-xs font-bold transition-all ${
                                  isReported 
                                    ? 'text-stone-400 cursor-not-allowed' 
                                    : isReporting 
                                      ? 'text-amber-500' 
                                      : 'text-red-500 hover:underline'
                                }`}
                              >
                                {isReporting ? 'Đang gửi...' : isReported ? 'Đã báo cáo' : 'Báo lỗi'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2">
                <p className="text-xs text-stone-400 font-medium">
                  Trang <span className="text-stone-900 font-bold">{currentPage + 1}</span> trên <span className="text-stone-900 font-bold">{totalPages}</span>
                </p>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 0 || loading}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 rounded-xl border border-stone-100 bg-white hover:bg-stone-50 disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    if (idx === 0 || idx === totalPages - 1 || (idx >= currentPage - 1 && idx <= currentPage + 1)) {
                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentPage(idx)}
                          disabled={loading}
                          className={`min-w-[40px] h-10 rounded-xl text-xs font-bold transition-all ${
                            currentPage === idx 
                              ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/10' 
                              : 'bg-white border border-stone-100 text-stone-500 hover:bg-stone-50'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    }
                    if (idx === 1 || idx === totalPages - 2) {
                      return <span key={idx} className="px-1 text-stone-300">...</span>;
                    }
                    return null;
                  })}

                  <button
                    disabled={currentPage >= totalPages - 1 || loading}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 rounded-xl border border-stone-100 bg-white hover:bg-stone-50 disabled:opacity-30 transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help section */}
        <div className="mt-20 pt-12 border-t border-stone-100">
          <div className="flex gap-4 items-start">
            <div className="mt-1">
              <AlertCircle className="h-4 w-4 text-stone-300" />
            </div>
            <p className="text-[11px] leading-relaxed text-stone-400 font-medium max-w-2xl">
              Nếu giao dịch chưa phản ánh ngay sau khi thanh toán, hệ thống sẽ tự đồng bộ trạng thái từ PayOS. Bạn cũng có thể bấm <strong>Báo lỗi</strong> để gửi yêu cầu kiểm tra thủ công.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function SimpleStat({ label, value, icon: Icon, isEmerald, isAmber, isRed, isBlue }) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-black uppercase tracking-wider text-stone-400">{label}</span>
        <div className={`p-2 rounded-xl ${
          isEmerald ? 'bg-emerald-50 text-emerald-500' : 
          isAmber ? 'bg-amber-50 text-amber-500' : 
          isRed ? 'bg-red-50 text-red-500' :
          isBlue ? 'bg-blue-50 text-blue-500' :
          'bg-stone-50 text-stone-400'
        }`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <span className="text-2xl font-bold tracking-tight text-stone-900 truncate block">{value}</span>
    </div>
  );
}

export default PaymentHistoryPage;
