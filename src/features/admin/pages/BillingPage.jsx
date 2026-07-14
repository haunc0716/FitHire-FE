import React, { useEffect, useMemo, useState } from 'react';
import { CreditCard, ArrowUpRight, Loader2, MoreVertical, Check, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAdminPayments, getAdminPaymentById, markPaymentSuccess, markPaymentFailed } from '../services/paymentApi';
import { useToast } from '../../../components/ui/ToastProvider';

const PAGE_SIZE = 10;

function toPaymentItems(data) {
  return Array.isArray(data) ? data : data?.items || data?.content || [];
}

function formatMoney(value, currency = 'VND') {
  const num = Number(value);
  if (Number.isNaN(num)) return value ?? '-';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(num);
}

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function extractUserLabel(transaction) {
  const candidate =
    transaction?.user?.fullName ||
    transaction?.user?.name ||
    transaction?.user?.displayName ||
    transaction?.userName ||
    transaction?.userFullName ||
    transaction?.customerName ||
    transaction?.buyerName ||
    transaction?.accountName ||
    transaction?.email ||
    transaction?.userEmail ||
    transaction?.user?.email ||
    transaction?.metadata?.userName ||
    transaction?.metadata?.fullName;

  if (candidate) return candidate;
  if (transaction?.userId) return `Người dùng #${transaction.userId}`;
  return `Khách hàng #${transaction?.id ?? ''}`.trim();
}

function extractPlanLabel(transaction) {
  return (
    transaction?.plan?.name ||
    transaction?.planName ||
    transaction?.subscriptionName ||
    transaction?.packageName ||
    transaction?.productName ||
    transaction?.metadata?.planName ||
    transaction?.plan ||
    'N/A'
  );
}

export default function BillingPage() {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminPayments();
      setTransactions(toPaymentItems(data));
    } catch (err) {
      showToast({ type: 'error', title: 'Không thể tải lịch sử thanh toán', message: err?.message || 'Vui lòng thử lại sau.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);
  useEffect(() => { setCurrentPage(1); }, [transactions.length]);

  const stats = useMemo(() => {
    const total = transactions.length;
    const completed = transactions.filter((t) => ['COMPLETED', 'SUCCESS'].includes(String(t.status).toUpperCase())).length;
    const pending = transactions.filter((t) => String(t.status).toUpperCase() === 'PENDING').length;
    return { total, completed, pending };
  }, [transactions]);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return transactions.slice(start, start + PAGE_SIZE);
  }, [transactions, currentPage]);

  const handleUpdateStatus = async (paymentId, success) => {
    setUpdatingId(paymentId);
    try {
      if (success) {
        await markPaymentSuccess(paymentId);
        setTransactions(prev => prev.map(t => (t.id === paymentId ? { ...t, status: 'COMPLETED' } : t)));
        showToast({ type: 'success', title: 'Thanh toán thành công', message: `Đã xác nhận thanh toán ${paymentId}.` });
      } else {
        await markPaymentFailed(paymentId);
        setTransactions(prev => prev.map(t => (t.id === paymentId ? { ...t, status: 'FAILED' } : t)));
        showToast({ type: 'error', title: 'Thanh toán thất bại', message: `Đã đánh dấu thanh toán ${paymentId} thất bại.` });
      }
    } catch (err) {
      showToast({ type: 'error', title: 'Thao tác thất bại', message: err?.message || 'Vui lòng thử lại sau.' });
    } finally {
      setUpdatingId(null);
    }
  };

  const openTransactionDetail = async (transaction) => {
    setSelectedTransaction(transaction);
    setDetailLoading(true);
    try {
      const detail = await getAdminPaymentById(transaction.id);
      setSelectedTransaction((prev) => ({ ...prev, ...(detail || {}) }));
    } catch (err) {
      showToast({ type: 'error', title: 'Không thể tải chi tiết giao dịch', message: err?.message || 'Vui lòng thử lại sau.' });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Gói dịch vụ & thanh toán</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi doanh thu, gói dịch vụ đang hoạt động và lịch sử thanh toán.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-600 text-sm">Tổng giao dịch</h3>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <span className="text-3xl font-bold text-stone-900">{stats.total}</span>
            <span className="flex items-center text-xs font-bold text-emerald-600 mb-1 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> Trực tiếp
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-600 text-sm">Hoàn tất</h3>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <span className="text-3xl font-bold text-stone-900">{stats.completed}</span>
            <span className="text-xs font-medium text-stone-400 mb-1">giao dịch</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-600 text-sm">Đang chờ</h3>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <span className="text-3xl font-bold text-stone-900">{stats.pending}</span>
            <span className="text-xs font-medium text-stone-400 mb-1">chờ xử lý</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-5 border-b border-stone-100 bg-stone-50/30 flex items-center justify-between gap-4">
          <h2 className="text-base font-bold text-stone-900">Giao dịch gần đây</h2>
          <button onClick={fetchTransactions} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-stone-700 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
            <Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-stone-500 gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
              <span className="text-sm font-medium">Đang tải lịch sử thanh toán...</span>
            </div>
          ) : (
            <>
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-stone-500 uppercase bg-stone-50/50 border-b border-stone-100">
                  <tr>
                    <th className="px-6 py-4 font-bold">Mã giao dịch</th>
                    <th className="px-6 py-4 font-bold">Người dùng</th>
                    <th className="px-6 py-4 font-bold">Gói</th>
                    <th className="px-6 py-4 font-bold">Số tiền</th>
                    <th className="px-6 py-4 font-bold">Ngày</th>
                    <th className="px-6 py-4 font-bold">Trạng thái</th>
                    <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {paginatedTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-stone-900">{trx.id}</td>
                      <td className="px-6 py-4 text-stone-600 font-medium">{extractUserLabel(trx)}</td>
                      <td className="px-6 py-4 text-stone-500">{extractPlanLabel(trx)}</td>
                      <td className="px-6 py-4 font-bold text-stone-900">{formatMoney(trx.amount ?? trx.totalAmount ?? trx.price, trx.currency)}</td>
                      <td className="px-6 py-4 text-stone-400 text-xs">{formatDate(trx.createdAt || trx.paidAt || trx.updatedAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider ${
                          ['COMPLETED', 'SUCCESS'].includes(String(trx.status).toUpperCase())
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : String(trx.status).toUpperCase() === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          {trx.status || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openTransactionDetail(trx)} className="p-1.5 text-stone-600 hover:bg-stone-50 rounded-lg transition-colors border border-stone-100" title="Xem chi tiết">
                            <Eye className="h-4 w-4" />
                          </button>
                          {String(trx.status).toUpperCase() === 'PENDING' ? (
                            <>
                              <button onClick={() => handleUpdateStatus(trx.id, true)} disabled={updatingId === trx.id} title="Duyệt" className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100">
                                {updatingId === trx.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                              </button>
                              <button onClick={() => handleUpdateStatus(trx.id, false)} disabled={updatingId === trx.id} title="Từ chối" className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100">
                                {updatingId === trx.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                              </button>
                            </>
                          ) : (
                            <button className="text-stone-300 hover:text-stone-600 transition-colors">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between gap-4 border-t border-stone-100 px-6 py-4">
                <p className="text-xs font-medium text-stone-500">
                  Trang {currentPage}/{totalPages} · Hiển thị {paginatedTransactions.length} / {transactions.length} giao dịch
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded-xl border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded-xl border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-stone-900/60" onClick={() => setSelectedTransaction(null)} />
          <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-stone-900">Chi tiết giao dịch</h3>
                <p className="text-sm text-stone-500">Xem thông tin giao dịch và trạng thái hiện tại.</p>
              </div>
              <button onClick={() => setSelectedTransaction(null)} className="text-stone-400 hover:text-stone-900">&times;</button>
            </div>

            <div className="mt-6 space-y-4">
              {detailLoading ? (
                <div className="flex items-center gap-2 text-stone-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải chi tiết...
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl bg-stone-50 p-4">
                    <div className="text-stone-400">Mã thanh toán</div>
                    <div className="font-semibold text-stone-900">{selectedTransaction.id}</div>
                  </div>
                  <div className="rounded-2xl bg-stone-50 p-4">
                    <div className="text-stone-400">Trạng thái</div>
                    <div className="font-semibold text-stone-900">{selectedTransaction.status || 'N/A'}</div>
                  </div>
                  <div className="rounded-2xl bg-stone-50 p-4">
                    <div className="text-stone-400">Số tiền</div>
                    <div className="font-semibold text-stone-900">{formatMoney(selectedTransaction.amount ?? selectedTransaction.totalAmount ?? selectedTransaction.price, selectedTransaction.currency)}</div>
                  </div>
                  <div className="rounded-2xl bg-stone-50 p-4">
                    <div className="text-stone-400">Thời gian tạo</div>
                    <div className="font-semibold text-stone-900">{formatDate(selectedTransaction.createdAt)}</div>
                  </div>
                  <div className="rounded-2xl bg-stone-50 p-4 col-span-2">
                    <div className="text-stone-400">Người dùng</div>
                    <div className="font-semibold text-stone-900">{extractUserLabel(selectedTransaction)}</div>
                  </div>
                  <div className="rounded-2xl bg-stone-50 p-4 col-span-2">
                    <div className="text-stone-400">Gói</div>
                    <div className="font-semibold text-stone-900">{extractPlanLabel(selectedTransaction)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
