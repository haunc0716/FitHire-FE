import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '../../../components/ui/ToastProvider';
import { fetchPaymentByOrderCode, fetchPaymentDetails } from '../../pricing/services/subscriptionApi';
import { getAuthSession, isSessionValid } from '../../auth/services/authSession';

const destinationByStatus = {
  PAID: '/user/payments',
  SUCCESS: '/user/payments',
  CANCELLED: '/user/pricing',
  EXPIRED: '/user/pricing',
  PENDING: '/user/payments',
  FAILED: '/user/payments',
};

const defaultMessages = {
  PAID: {
    type: 'success',
    title: 'Thanh toán thành công',
    message: 'Giao dịch của bạn đã được ghi nhận. Hệ thống sẽ đồng bộ trạng thái ngay.',
  },
  SUCCESS: {
    type: 'success',
    title: 'Thanh toán thành công',
    message: 'Giao dịch của bạn đã được ghi nhận. Hệ thống sẽ đồng bộ trạng thái ngay.',
  },
  CANCELLED: {
    type: 'info',
    title: 'Đơn đã bị hủy',
    message: 'Bạn đã hủy giao dịch hoặc giao dịch đã hết hạn. Vui lòng chọn gói khác nếu cần.',
  },
  EXPIRED: {
    type: 'info',
    title: 'Đơn đã hết hạn',
    message: 'Giao dịch đã quá thời gian thanh toán. Vui lòng tạo lại đơn nếu muốn tiếp tục.',
  },
  PENDING: {
    type: 'info',
    title: 'Đang xử lý',
    message: 'PayOS đang xác nhận giao dịch. Vui lòng chờ vài giây.',
  },
  FAILED: {
    type: 'error',
    title: 'Thanh toán thất bại',
    message: 'Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.',
  },
};

const MAX_POLL_ATTEMPTS = 12; // 12 * 2s = 24s
const POLL_INTERVAL_MS = 2000;
const HARD_REDIRECT_DELAY_MS = 15000; // fallback navigate sau 15s neu poll khong resolve
const FINAL_STATUS_REDIRECT_DELAY_MS = 150;

function hardRedirect(path) {
  if (!path) return;
  window.location.replace(path);
}

function notifySubscriptionRefresh(status) {
  if (!['SUCCESS', 'PAID'].includes(status)) return;
  try {
    sessionStorage.setItem('fitHire_subscription_refresh_needed', '1');
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new Event('fitHireSubscriptionUpdated'));
}

export default function PayOSReturnPage() {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const statusParam = (searchParams.get('status') || searchParams.get('code') || '').toUpperCase();
  const orderCode = searchParams.get('orderCode') || searchParams.get('order_code');
  const paymentId = searchParams.get('paymentId') || searchParams.get('id');
  const numericOrderCode = orderCode && !Number.isNaN(Number(orderCode)) ? Number(orderCode) : null;

  const [resolvedStatus, setResolvedStatus] = useState(statusParam);
  const hasNavigatedRef = useRef(false);
  const hasShownToastRef = useRef(false);
  const pollAttemptRef = useRef(0);

  // 1) Neu user chua dang nhap -> chuyen ve /login (giu lai return path)
  useEffect(() => {
    const session = getAuthSession();
    if (!isSessionValid(session)) {
      const returnUrl = `${window.location.pathname}${window.location.search}`;
      hardRedirect(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, []);

  // 2) Show toast mot lan khi vao trang
  useEffect(() => {
    if (hasShownToastRef.current) return;
    hasShownToastRef.current = true;
    const message = defaultMessages[statusParam] ?? {
      type: 'info',
      title: 'Đang xử lý',
      message: 'Giao dịch đang được xử lý. Vui lòng kiểm tra lại lịch sử thanh toán sau ít phút.',
    };
    showToast(message);
  }, [statusParam, showToast]);

  // 3) Poll BE theo orderCode hoac paymentId de dong bo trang thai thuc te (xu ly race voi webhook).
  //    URL PayOS tra ve KHONG co paymentId noi bo, chi co orderCode. Vay nen uu tien poll theo orderCode.
  useEffect(() => {
    const hasIdentifier = paymentId || numericOrderCode;
    if (!hasIdentifier) return undefined;
    if (resolvedStatus === 'SUCCESS' || resolvedStatus === 'PAID'
        || resolvedStatus === 'CANCELLED' || resolvedStatus === 'EXPIRED'
        || resolvedStatus === 'FAILED') {
      return undefined;
    }

    let cancelled = false;
    let timer = null;
    const poll = async () => {
      if (cancelled) return;
      try {
        let data = null;
        if (numericOrderCode) {
          data = await fetchPaymentByOrderCode(numericOrderCode);
        } else if (paymentId) {
          data = await fetchPaymentDetails(paymentId);
        }
        if (cancelled || !data) return;
        const backendStatus = String(data && data.status || '').toUpperCase();
        if (backendStatus && backendStatus !== resolvedStatus) {
          setResolvedStatus(backendStatus);
        }
        if (['SUCCESS', 'PAID', 'CANCELLED', 'EXPIRED', 'FAILED'].includes(backendStatus)) {
          return;
        }
      } catch (err) {
        // im lang de khong spam toast; payload se tu BE dong bo qua scheduled job
        console.warn('PayOSReturnPage poll error:', err && err.message);
      }
      pollAttemptRef.current += 1;
      if (!cancelled && pollAttemptRef.current < MAX_POLL_ATTEMPTS) {
        timer = window.setTimeout(poll, POLL_INTERVAL_MS);
      }
    };

    timer = window.setTimeout(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [paymentId, numericOrderCode, resolvedStatus]);

  // 4) Khi da co trang thai cuoi cung -> navigate mot lan
  useEffect(() => {
    if (hasNavigatedRef.current) return;
    if (!['SUCCESS', 'PAID', 'CANCELLED', 'EXPIRED', 'FAILED'].includes(resolvedStatus)) return;

    const destination = destinationByStatus[resolvedStatus] ?? '/user/payments';
    const delay = resolvedStatus === statusParam ? FINAL_STATUS_REDIRECT_DELAY_MS : 0;
    const timer = window.setTimeout(() => {
      hasNavigatedRef.current = true;
      notifySubscriptionRefresh(resolvedStatus);
      hardRedirect(destination);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [resolvedStatus, statusParam]);

  // 5) Fallback: neu qua lau ma van pending (BE cham / webhook khong den / user F5)
  //    thi van redirect de tranh user bi "kep" o trang nay.
  useEffect(() => {
    const fallback = window.setTimeout(() => {
      if (!hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        const destination = destinationByStatus[resolvedStatus] ?? '/user/payments';
        notifySubscriptionRefresh(resolvedStatus);
        hardRedirect(destination);
      }
    }, HARD_REDIRECT_DELAY_MS);
    return () => window.clearTimeout(fallback);
  }, [resolvedStatus]);

  const isSuccess = resolvedStatus === 'PAID' || resolvedStatus === 'SUCCESS';
  const isCancelled = resolvedStatus === 'CANCELLED' || resolvedStatus === 'EXPIRED';
  const isFailed = resolvedStatus === 'FAILED';
  const showSpinner = !isSuccess && !isCancelled && !isFailed;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-6">
      <div className="w-full max-w-md rounded-[2rem] border border-stone-100 bg-white p-8 text-center shadow-sm">
        <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${isSuccess ? 'bg-emerald-50 text-emerald-600' : isCancelled ? 'bg-red-50 text-red-500' : isFailed ? 'bg-rose-50 text-rose-500' : 'bg-stone-50 text-stone-400'}`}>
          {isSuccess ? <CheckCircle2 className="h-8 w-8" /> : isCancelled ? <XCircle className="h-8 w-8" /> : <Loader2 className="h-8 w-8 animate-spin" />}
        </div>
        <h1 className="text-2xl font-bold text-stone-900">
          {isSuccess ? 'Thanh toán thành công' : isCancelled ? 'Giao dịch đã hủy' : isFailed ? 'Thanh toán thất bại' : 'Đang xử lý giao dịch'}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-500">
          {isSuccess
            ? 'Hệ thống đang cập nhật trạng thái đơn hàng. Bạn sẽ được chuyển về lịch sử thanh toán.'
            : isCancelled
              ? 'Đơn hàng của bạn đã được hủy hoặc hết hạn. Bạn sẽ được chuyển về bảng giá.'
              : isFailed
                ? 'Giao dịch không thành công. Bạn sẽ được chuyển về lịch sử thanh toán.'
                : 'Vui lòng đợi trong giây lát trong khi hệ thống xác nhận trạng thái từ PayOS.'}
        </p>
        {orderCode && (
          <p className="mt-4 text-xs font-mono text-stone-400">Mã đơn: {orderCode}</p>
        )}
      </div>
    </div>
  );
}
