import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Check, ChevronRight, Crown, Loader2, Sparkles, Target, Zap } from 'lucide-react';
import { getAuthSession } from '../../auth/services/authSession';
import {
  checkoutSubscription,
  fetchMySubscriptions,
  fetchPricingPlans,
  simulatePaymentFailed,
  simulatePaymentSuccess,
} from '../services/subscriptionApi';

const PLAN_THEMES = {
  FREE: {
    icon: Sparkles,
    badgeFallback: 'Miễn phí',
    cardClass: 'bg-white border-emerald-100',
    iconWrapClass: 'bg-emerald-50',
    iconClass: 'text-emerald-500',
    priceClass: 'text-emerald-600',
    modelClass: 'bg-emerald-50 text-emerald-600',
    checkWrapClass: 'bg-emerald-50',
    checkClass: 'text-emerald-500',
    ctaClass: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100',
    badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    ctaLabel: 'Bắt đầu ngay',
  },
  LUOT_LE: {
    icon: Zap,
    badgeFallback: 'Beta 29k',
    cardClass: 'bg-white border-emerald-100',
    iconWrapClass: 'bg-emerald-50',
    iconClass: 'text-emerald-600',
    priceClass: 'text-emerald-700',
    modelClass: 'bg-emerald-50 text-emerald-700',
    checkWrapClass: 'bg-emerald-50',
    checkClass: 'text-emerald-600',
    ctaClass: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    ctaLabel: 'Bắt đầu ngay',
  },
  PLUS: {
    icon: Target,
    badgeFallback: 'Phổ biến',
    cardClass: 'bg-white border-emerald-200',
    iconWrapClass: 'bg-emerald-100',
    iconClass: 'text-emerald-600',
    priceClass: 'text-emerald-600',
    modelClass: 'bg-emerald-50 text-emerald-700',
    checkWrapClass: 'bg-emerald-50',
    checkClass: 'text-emerald-600',
    ctaClass: 'bg-emerald-600 text-white border-transparent hover:bg-emerald-700',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    ctaLabel: 'Bắt đầu ngay',
  },
  PRO: {
    icon: Crown,
    badgeFallback: 'Khuyến nghị',
    cardClass: 'bg-gradient-to-b from-white to-emerald-50/50 border-emerald-500 shadow-[0_20px_60px_-30px_rgba(5,150,105,0.45)]',
    iconWrapClass: 'bg-emerald-100',
    iconClass: 'text-emerald-700',
    priceClass: 'text-emerald-700',
    modelClass: 'bg-emerald-100 text-emerald-700',
    checkWrapClass: 'bg-emerald-100',
    checkClass: 'text-emerald-600',
    ctaClass: 'bg-gradient-to-r from-emerald-600 to-emerald-400 text-white border-transparent hover:from-emerald-500 hover:to-emerald-300',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    ctaLabel: 'Chọn gói Pro',
    hot: true,
  },
};

function formatCurrency(value) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat('vi-VN').format(amount);
}

function resolvePriceUnit(plan) {
  if (plan.billingType === 'FREE') {
    return `${plan.currency} · mãi mãi`;
  }
  if (plan.billingType === 'PAY_PER_USE') {
    return `${plan.currency} / buổi`;
  }
  return `${plan.currency} / tháng`;
}

function toVietnamesePeriod(displayLimit) {
  if (!displayLimit) {
    return '';
  }
  return displayLimit
    .replace('/month', '/tháng')
    .replace('/day', '/ngày')
    .replace('/year', '/năm')
    .replace('unlimited', 'không giới hạn');
}

function buildFeatureLine(feature) {
  if (feature.unlimited) {
    return `${feature.featureName}: không giới hạn`;
  }

  const limitText = toVietnamesePeriod(feature.displayLimit);
  if (feature.featureDescription) {
    return `${feature.featureName}: ${limitText} · ${feature.featureDescription}`;
  }
  return `${feature.featureName}: ${limitText}`;
}

const PricingCards = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyPlanCode, setBusyPlanCode] = useState('');
  const [paymentActionLoading, setPaymentActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [pendingPayment, setPendingPayment] = useState(null);
  const [activePlanCodes, setActivePlanCodes] = useState([]);

  const refreshMySnapshot = useCallback(async () => {
    const session = getAuthSession();
    if (!session?.accessToken || Number(session.expiresAt) <= Date.now()) {
      setActivePlanCodes([]);
      return null;
    }

    const snapshot = await fetchMySubscriptions();
    const now = Date.now();
    const activeCodes = (snapshot?.userSubscriptions ?? [])
      .filter((item) => {
        if (item?.status !== 'ACTIVE') {
          return false;
        }
        if (!item?.endDate) {
          return true;
        }
        return new Date(item.endDate).getTime() > now;
      })
      .map((item) => item.subscriptionCode);
    setActivePlanCodes([...new Set(activeCodes)]);
    return snapshot;
  }, []);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchPricingPlans();
      setPlans(Array.isArray(data) ? data : []);
      await refreshMySnapshot();
    } catch (apiError) {
      setError(apiError?.message || 'Không thể tải bảng giá.');
    } finally {
      setLoading(false);
    }
  }, [refreshMySnapshot]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const enrichedPlans = useMemo(
    () =>
      plans.map((plan) => {
        const theme = PLAN_THEMES[plan.code] ?? PLAN_THEMES.FREE;
        return {
          ...plan,
          theme,
          formattedPrice: formatCurrency(plan.price),
          priceUnit: resolvePriceUnit(plan),
          badgeLabel: plan.badgeLabel || theme.badgeFallback,
          featureLines: (plan.features ?? []).map(buildFeatureLine),
          ctaLabel: theme.ctaLabel,
        };
      }),
    [plans]
  );

  const handleCheckout = useCallback(
    async (plan) => {
      const session = getAuthSession();
      if (!session?.accessToken || Number(session.expiresAt) <= Date.now()) {
        navigate('/login');
        return;
      }

      setBusyPlanCode(plan.code);
      setStatusMessage('');
      setError('');

      try {
        const checkout = await checkoutSubscription(plan.code, plan.billingType === 'RECURRING');
        const payment = checkout?.payment;

        if (payment?.status === 'PENDING') {
          setPendingPayment({
            id: payment.id,
            planCode: plan.code,
            planName: plan.name,
          });
          setStatusMessage(`Đã tạo thanh toán #${payment.id} cho gói ${plan.name}. Chọn kết quả mô phỏng bên dưới.`);
        } else {
          setPendingPayment(null);
          setStatusMessage(`Đã kích hoạt gói ${plan.name} thành công.`);
        }

        await refreshMySnapshot();
      } catch (apiError) {
        setError(apiError?.message || 'Không thể tạo checkout.');
      } finally {
        setBusyPlanCode('');
      }
    },
    [navigate, refreshMySnapshot]
  );

  const handlePaymentSimulation = useCallback(async (result) => {
    if (!pendingPayment?.id) {
      return;
    }

    setPaymentActionLoading(true);
    setError('');

    try {
      if (result === 'SUCCESS') {
        await simulatePaymentSuccess(pendingPayment.id);
        setStatusMessage(`Thanh toán #${pendingPayment.id} thành công. Gói ${pendingPayment.planName} đã ACTIVE.`);
      } else {
        await simulatePaymentFailed(pendingPayment.id);
        setStatusMessage(`Thanh toán #${pendingPayment.id} thất bại. Bạn có thể checkout lại.`);
      }
      setPendingPayment(null);
      await refreshMySnapshot();
    } catch (apiError) {
      setError(apiError?.message || 'Không thể cập nhật trạng thái thanh toán.');
    } finally {
      setPaymentActionLoading(false);
    }
  }, [pendingPayment, refreshMySnapshot]);

  if (loading) {
    return (
      <section className="mb-28">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`pricing-skeleton-${index}`}
              className="h-[620px] rounded-[28px] border border-zinc-200 bg-zinc-50 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-28">
      {error ? (
        <div className="mb-6 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span>{error}</span>
            <button
              type="button"
              onClick={loadPlans}
              className="rounded-full border border-rose-300 px-3 py-1 text-xs font-semibold hover:bg-rose-100"
            >
              Tải lại
            </button>
          </div>
        </div>
      ) : null}

      {statusMessage ? (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {statusMessage}
        </div>
      ) : null}

      {pendingPayment ? (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
          <p className="mb-3 text-sm font-semibold text-amber-800">
            Payment #{pendingPayment.id} đang PENDING cho gói {pendingPayment.planName}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={paymentActionLoading}
              onClick={() => handlePaymentSimulation('SUCCESS')}
              className="rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
            >
              {paymentActionLoading ? 'Đang xử lý...' : 'Mô phỏng SUCCESS'}
            </button>
            <button
              type="button"
              disabled={paymentActionLoading}
              onClick={() => handlePaymentSimulation('FAILED')}
              className="rounded-full border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
            >
              {paymentActionLoading ? 'Đang xử lý...' : 'Mô phỏng FAILED'}
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {enrichedPlans.map((plan) => {
          const Icon = plan.theme.icon;
          const showHotRibbon = Boolean(plan.highlighted || plan.theme.hot);
          const isBusy = busyPlanCode === plan.code;
          const isCurrentPlan = activePlanCodes.includes(plan.code);
          const isDisabled = isBusy || paymentActionLoading || isCurrentPlan;

          return (
            <article
              key={plan.code}
              className={`relative flex h-full flex-col rounded-[28px] border p-7 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.45)] transition-transform duration-300 hover:-translate-y-1 ${plan.theme.cardClass}`}
            >
              {showHotRibbon ? (
                <>
                  <div className="absolute top-0 right-0 h-0 w-0 border-t-[70px] border-l-[70px] border-t-amber-500 border-l-transparent" />
                  <span className="absolute top-[10px] right-[8px] rotate-45 text-[11px] font-bold tracking-wide text-white">
                    HOT
                  </span>
                </>
              ) : null}

              <div className="mb-6 flex items-start justify-between gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${plan.theme.iconWrapClass}`}>
                  <Icon className={`h-6 w-6 ${plan.theme.iconClass}`} strokeWidth={2.2} />
                </div>
                <span className={`rounded-full border px-4 py-1 text-sm font-semibold leading-none ${plan.theme.badgeClass}`}>
                  {plan.badgeLabel}
                </span>
              </div>

              <h3 className="mb-2 text-[2rem] font-display font-bold text-zinc-900">{plan.name}</h3>
              <p className="mb-8 min-h-20 text-[1.1rem] leading-relaxed text-slate-600">{plan.description}</p>

              <div className="mb-4 flex items-end gap-2">
                <span className={`text-[3.5rem] font-display font-bold leading-none ${plan.theme.priceClass}`}>
                  {plan.formattedPrice}
                </span>
                {Number(plan.price) > 0 ? <span className={`pb-1 text-3xl font-bold ${plan.theme.priceClass}`}>đ</span> : null}
              </div>
              <p className="mb-4 text-base font-semibold text-slate-400">{plan.priceUnit}</p>
              <div className={`mb-7 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${plan.theme.modelClass}`}>
                <Sparkles className="h-4 w-4" />
                <span>{plan.code}</span>
              </div>

              <div className="mb-6 border-t border-zinc-200" />

              <ul className="mb-10 space-y-3">
                {plan.featureLines.map((line) => (
                  <li key={`${plan.code}-${line}`} className="flex items-start gap-3 text-[1.05rem] leading-snug text-slate-700">
                    <span className={`mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${plan.theme.checkWrapClass}`}>
                      <Check className={`h-4 w-4 ${plan.theme.checkClass}`} strokeWidth={3} />
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleCheckout(plan)}
                disabled={isDisabled}
                className={`mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full border px-6 py-4 text-xl font-bold transition-all duration-300 disabled:opacity-60 ${plan.theme.ctaClass}`}
              >
                {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : plan.code === 'PRO' ? <Sparkles className="h-4 w-4" /> : null}
                <span>{isBusy ? 'Đang xử lý...' : isCurrentPlan ? 'Đang sử dụng' : plan.ctaLabel}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default PricingCards;
