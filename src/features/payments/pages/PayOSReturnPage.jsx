import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '../../../components/ui/ToastProvider';

const destinationByStatus = {
  PAID: '/user/payments',
  SUCCESS: '/user/payments',
  CANCELLED: '/user/pricing',
  EXPIRED: '/user/pricing',
  PENDING: '/user/payments',
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
};

export default function PayOSReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const status = (searchParams.get('status') || searchParams.get('code') || '').toUpperCase();
    const message = defaultMessages[status] ?? {
      type: 'info',
      title: 'Đang xử lý',
      message: 'Giao dịch đang được xử lý. Vui lòng kiểm tra lại lịch sử thanh toán sau ít phút.',
    };

    showToast(message);

    const destination = destinationByStatus[status] ?? '/user/payments';
    const timer = window.setTimeout(() => {
      navigate(destination, { replace: true });
    }, 800);

    return () => window.clearTimeout(timer);
  }, [navigate, searchParams, showToast]);

  const status = (searchParams.get('status') || searchParams.get('code') || '').toUpperCase();
  const isSuccess = status === 'PAID' || status === 'SUCCESS';
  const isCancelled = status === 'CANCELLED' || status === 'EXPIRED';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-6">
      <div className="w-full max-w-md rounded-[2rem] border border-stone-100 bg-white p-8 text-center shadow-sm">
        <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${isSuccess ? 'bg-emerald-50 text-emerald-600' : isCancelled ? 'bg-red-50 text-red-500' : 'bg-stone-50 text-stone-400'}`}>
          {isSuccess ? <CheckCircle2 className="h-8 w-8" /> : isCancelled ? <XCircle className="h-8 w-8" /> : <Loader2 className="h-8 w-8 animate-spin" />}
        </div>
        <h1 className="text-2xl font-bold text-stone-900">
          {isSuccess ? 'Thanh toán thành công' : isCancelled ? 'Giao dịch đã hủy' : 'Đang xử lý giao dịch'}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-500">
          {isSuccess
            ? 'Hệ thống đang cập nhật trạng thái đơn hàng. Bạn sẽ được chuyển về lịch sử thanh toán.'
            : isCancelled
              ? 'Đơn hàng của bạn đã được hủy hoặc hết hạn. Bạn sẽ được chuyển về bảng giá.'
              : 'Vui lòng đợi trong giây lát trong khi hệ thống xác nhận trạng thái từ PayOS.'}
        </p>
      </div>
    </div>
  );
}
