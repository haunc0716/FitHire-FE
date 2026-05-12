import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  XCircle,
  CheckCircle2,
  Copy,
  TimerReset,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useToast } from '../../../components/ui/ToastProvider';
import { fetchPaymentDetails, cancelPayment } from '../../pricing/services/subscriptionApi';

const DEFAULT_BANK = {
  bankName: 'MB Bank',
  accountName: 'FIT HIRE JSC',
  accountNumber: '0123456789',
  transferContent: 'FITHIRE-USER-0001',
  amount: '199000',
};

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0));

const PaymentQrPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { showToast } = useToast();

  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Initial payment data from navigation state
  const initialPayment = useMemo(() => {
    const statePayment = state?.payment ?? {};
    return {
      id: statePayment.id || null,
      orderCode: statePayment.orderCode || 'FITHIRE-QR-0001',
      amount: statePayment.amount || DEFAULT_BANK.amount,
      bankName: statePayment.bankName || DEFAULT_BANK.bankName,
      accountName: statePayment.accountName || DEFAULT_BANK.accountName,
      accountNumber: statePayment.accountNumber || DEFAULT_BANK.accountNumber,
      transferContent: statePayment.transferContent || DEFAULT_BANK.transferContent,
      qrUrl: statePayment.qrUrl || '',
      status: statePayment.status || 'PENDING',
      planName: statePayment.planName || '',
      createdAt: statePayment.createdAt || null,
    };
  }, [state]);

  const [payment, setPayment] = useState(initialPayment);
  const [isPolling, setIsPolling] = useState(true);

  // Calculate remaining time based on creation date
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!payment.createdAt) return 300;
    const createdAt = new Date(payment.createdAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - createdAt) / 1000);
    return Math.max(0, 300 - elapsed);
  });

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || payment.status === 'SUCCESS') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, payment.status]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Manual check function
  const checkStatus = async () => {
    if (!payment.id || isChecking) return;
    try {
      setIsChecking(true);
      const updatedPayment = await fetchPaymentDetails(payment.id);
      if (updatedPayment.status !== payment.status) {
        setPayment(prev => ({ ...prev, ...updatedPayment }));
        
        if (updatedPayment.status === 'SUCCESS') {
          setIsPolling(false);
          showToast({
            type: 'success',
            title: 'Thanh toán thành công',
            message: 'Gói dịch vụ của bạn đã được kích hoạt.'
          });
          setTimeout(() => navigate('/payments/history'), 2000);
        }
      } else if (updatedPayment.status === 'PENDING') {
        showToast({
          type: 'info',
          title: 'Đang xử lý',
          message: 'Hệ thống chưa nhận được thanh toán. Vui lòng đợi trong giây lát hoặc thử lại sau.'
        });
      }
    } catch (error) {
      console.error('Manual check error:', error);
    } finally {
      setIsChecking(false);
    }
  };

  // Polling for status update
  useEffect(() => {
    if (!payment.id || !isPolling || payment.status === 'SUCCESS' || payment.status === 'CANCELLED') return;

    const pollInterval = setInterval(async () => {
      try {
        const updatedPayment = await fetchPaymentDetails(payment.id);
        if (updatedPayment.status !== payment.status) {
          setPayment(prev => ({ ...prev, ...updatedPayment }));
          
          if (updatedPayment.status === 'SUCCESS') {
            setIsPolling(false);
            showToast({
              type: 'success',
              title: 'Thanh toán thành công',
              message: 'Gói dịch vụ của bạn đã được kích hoạt.'
            });
            setTimeout(() => navigate('/payments/history'), 2000);
          } else if (updatedPayment.status === 'CANCELLED' || updatedPayment.status === 'FAILED') {
            setIsPolling(false);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [payment.id, payment.status, isPolling, navigate, showToast]);

  const handleCancelOrder = async () => {
    if (!payment.id || isCancelling) return;
    
    setIsCancelling(true);
    try {
      await cancelPayment(payment.id);
      showToast({
        type: 'success',
        title: 'Đã hủy',
        message: 'Đơn hàng đã được hủy.'
      });
      navigate('/user/pricing');
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể hủy đơn hàng.'
      });
      setShowCancelModal(false);
    } finally {
      setIsCancelling(false);
    }
  };

  const copyText = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast({ type: 'success', title: 'Đã sao chép', message: `${label} đã được sao chép.` });
    } catch {
      showToast({ type: 'error', title: 'Không thể sao chép', message: 'Vui lòng thử lại.' });
    }
  };

  const qrSource = useMemo(() => {
    if (payment.qrUrl && payment.qrUrl.startsWith('http')) {
      return payment.qrUrl;
    }
    // Generate VietQR URL using real payment data
    return `https://img.vietqr.io/image/MB-${payment.accountNumber}-print.png?amount=${payment.amount}&addInfo=${encodeURIComponent(payment.transferContent)}&accountName=${encodeURIComponent(payment.accountName)}`;
  }, [payment]);

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" /> Quay lại
          </button>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-stone-50 text-stone-500'}`}>
              <Clock className="h-3.5 w-3.5" />
              Hiệu lực: {formatTime(timeLeft)}
            </div>
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={payment.status === 'SUCCESS'}
              className="text-xs font-bold text-red-500 hover:bg-red-50 px-4 py-1.5 rounded-full transition-colors disabled:hidden"
            >
              Hủy đơn
            </button>
          </div>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1fr_450px]">
          {/* Left: QR Section (No border/card) */}
          <div className="flex flex-col items-center">
            <div className="mb-10 text-center">
              <h1 className="text-2xl font-bold">Quét mã để thanh toán</h1>
              <p className="text-sm text-stone-500 mt-2">Mở ứng dụng ngân hàng và thực hiện quét mã QR</p>
            </div>

            <div className="relative p-6 bg-white border border-stone-100 rounded-[2.5rem] shadow-2xl shadow-stone-100/50">
              <img
                src={qrSource}
                alt="QR Code"
                className={`h-80 w-80 sm:h-[400px] sm:w-[400px] object-contain transition-all duration-500 ${payment.status === 'SUCCESS' ? 'opacity-20 blur-sm scale-95' : 'opacity-100 scale-100'}`}
              />
              {payment.status === 'SUCCESS' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-in zoom-in-50 duration-300">
                  <div className="rounded-full bg-emerald-500 p-4 text-white shadow-lg">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <p className="mt-4 text-xl font-bold text-emerald-600">Thành công!</p>
                </div>
              )}
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div className="flex items-center gap-2 text-stone-400">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Bảo mật tuyệt đối</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <TimerReset className={`h-4 w-4 ${isPolling ? 'animate-spin-slow text-emerald-500' : ''}`} />
                <span className="text-[11px] font-bold uppercase tracking-wider">{isPolling ? 'Đang chờ...' : 'Đã dừng'}</span>
              </div>
            </div>
          </div>

          {/* Right: Details Section (No border/card) */}
          <div className="flex flex-col">
            <h2 className="text-lg font-bold mb-8">Chi tiết giao dịch</h2>
            
            <div className="space-y-1">
              <SimpleRow label="Gói dịch vụ" value={payment.planName || 'N/A'} />
              <SimpleRow label="Số tiền" value={formatCurrency(payment.amount)} isBold isEmerald />
              <SimpleRow label="Ngân hàng" value={payment.bankName} />
              <SimpleRow 
                label="Số tài khoản" 
                value={payment.accountNumber} 
                canCopy 
                onCopy={() => copyText(payment.accountNumber, 'STK')} 
              />
              <SimpleRow 
                label="Nội dung chuyển khoản" 
                value={payment.transferContent} 
                isBold 
                isEmerald 
                canCopy 
                onCopy={() => copyText(payment.transferContent, 'Nội dung')} 
              />
            </div>

            <div className="mt-10 p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
              <h3 className="text-xs font-bold text-emerald-900 mb-2">Lưu ý:</h3>
              <p className="text-[11px] leading-relaxed text-emerald-700">
                Giao dịch sẽ được hệ thống xử lý hoàn toàn tự động. Vui lòng không thay đổi nội dung chuyển khoản để được kích hoạt ngay lập tức.
              </p>
            </div>

            <div className="mt-12 pt-12 border-t border-stone-100">
              <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-bold">
                FitHire Payment Service
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-stone-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Hủy đơn hàng?</h3>
              <p className="text-stone-500 text-sm mb-8 leading-relaxed">
                Bạn có chắc chắn muốn hủy đơn hàng này không?
              </p>
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="py-3.5 px-4 rounded-2xl bg-stone-100 text-stone-900 font-bold text-sm hover:bg-stone-200 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="py-3.5 px-4 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {isCancelling ? '...' : 'Xác nhận'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function SimpleRow({ label, value, isBold = false, isEmerald = false, canCopy = false, onCopy }) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-stone-50 last:border-0">
      <span className="text-sm text-stone-400 font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <span className={`text-sm ${isBold ? 'font-bold' : 'font-medium'} ${isEmerald ? 'text-emerald-600' : 'text-stone-900'}`}>
          {value}
        </span>
        {canCopy && (
          <button 
            onClick={onCopy}
            className="p-1.5 rounded-xl bg-stone-50 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default PaymentQrPage;
