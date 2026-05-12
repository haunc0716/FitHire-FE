import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Home, History, ShieldCheck, Sparkles, CreditCard, BadgeCheck, ArrowRight } from 'lucide-react';
import { useToast } from '../../../components/ui/ToastProvider';
import { cancelPendingPayment, cancelPendingPaymentByOrderCode } from '../../pricing/services/subscriptionApi';

const highlights = [
  { icon: ShieldCheck, title: 'Thanh toán an toàn', description: 'Bảo mật giao dịch theo tiêu chuẩn mới nhất.' },
  { icon: Sparkles, title: 'Kích hoạt nhanh', description: 'Quyền lợi gói dịch vụ được mở ngay sau khi xác nhận.' },
  { icon: CreditCard, title: 'Quản lý rõ ràng', description: 'Theo dõi toàn bộ lịch sử và trạng thái giao dịch.' },
];

const PaymentStatusPage = ({ type }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isSuccess = type === 'success';
  const hasSyncedCancelRef = useRef(false);

  useEffect(() => {
    if (type !== 'cancel' || hasSyncedCancelRef.current) {
      return;
    }

    const syncCancelStatus = async () => {
      const paymentIdParam = searchParams.get('paymentId');
      const orderCodeParam = searchParams.get('orderCode');

      try {
        if (paymentIdParam) {
          await cancelPendingPayment(Number(paymentIdParam));
          return;
        }
        if (orderCodeParam) {
          await cancelPendingPaymentByOrderCode(orderCodeParam);
        }
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Không thể đồng bộ trạng thái hủy',
          message: error?.message || 'Vui lòng kiểm tra lại trong lịch sử thanh toán.'
        });
      }
    };

    hasSyncedCancelRef.current = true;
    syncCancelStatus();
  }, [searchParams, showToast, type]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-stone-50 p-6">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center py-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_rgba(16,185,129,0.12)] backdrop-blur">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(120,113,108,0.08),transparent_25%)]" />
            <div className="relative">
              <div className={`mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl ${isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {isSuccess ? <CheckCircle2 className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
              </div>

              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${isSuccess ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                <BadgeCheck className="h-4 w-4" />
                {isSuccess ? 'Giao dịch đã hoàn tất' : 'Giao dịch chưa hoàn tất'}
              </span>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
                {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán đã bị hủy'}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
                {isSuccess
                  ? 'Cảm ơn bạn đã tin dùng FitHire. Gói dịch vụ của bạn đang được kích hoạt và bạn có thể bắt đầu sử dụng ngay lập tức.'
                  : 'Giao dịch của bạn đã bị hủy hoặc gặp lỗi. Bạn sẽ không bị trừ tiền và có thể thực hiện lại bất cứ lúc nào.'}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => navigate('/user')}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                >
                  <Home className="h-5 w-5" />
                  Về Dashboard
                </button>

                <button
                  onClick={() => navigate('/user/payments')}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-stone-200 bg-white px-6 py-4 font-bold text-stone-700 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <History className="h-5 w-5" />
                  Xem lịch sử giao dịch
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-3xl border border-stone-100 bg-stone-50/80 p-5">
                      <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-stone-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-stone-500">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-[2.5rem] border border-emerald-100 bg-emerald-950 p-8 text-white shadow-[0_24px_80px_rgba(4,120,87,0.22)]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">FitHire Payment</p>
              <h2 className="mt-3 text-3xl font-black">Trải nghiệm thanh toán chuyên nghiệp</h2>
              <p className="mt-4 text-sm leading-7 text-emerald-100/90">
                Trang này được thiết kế để người dùng dễ hiểu trạng thái giao dịch, dễ thao tác tiếp theo và tạo cảm giác tin cậy cho thương hiệu FitHire.
              </p>
            </div>

            <div className="rounded-[2rem] bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur">
              <p className="text-sm font-semibold text-emerald-100">Điểm nhấn giao diện</p>
              <ul className="mt-4 space-y-3 text-sm text-emerald-50/90">
                <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />Màu sắc đồng bộ với thương hiệu FitHire.</li>
                <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />Bố cục hai cột giúp nhấn mạnh trạng thái và hành động.</li>
                <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />Nút CTA rõ ràng, dễ quay về dashboard hoặc lịch sử giao dịch.</li>
              </ul>
            </div>

            <div className="rounded-[2rem] bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-sm font-semibold text-emerald-100">Gợi ý sau thanh toán</p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200">1</div>
                  <div>
                    <p className="font-semibold">Kiểm tra quyền lợi gói</p>
                    <p className="text-sm text-emerald-100/80">Xác nhận gói dịch vụ đã được mở đầy đủ.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200">2</div>
                  <div>
                    <p className="font-semibold">Theo dõi lịch sử giao dịch</p>
                    <p className="text-sm text-emerald-100/80">Xem trạng thái, mã giao dịch và thời gian tạo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPage;
