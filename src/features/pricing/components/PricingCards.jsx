import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Crown, Loader2, Sparkles, Target, Zap, Smile, Timer, Rocket, Gem } from 'lucide-react';
import { getAuthSession } from '../../auth/services/authSession';
import { useToast } from '../../../components/ui/ToastProvider';
import {
  checkoutSubscription,
  fetchMySubscriptions,
  fetchPricingPlans,
  simulatePaymentFailed,
  simulatePaymentSuccess,
} from '../services/subscriptionApi';

/* ──────────────────────────────────────────────────────────
   Vietnamese feature fallback data (in case API returns
   empty or missing diacritics)
   ────────────────────────────────────────────────────────── */


/* ──────────────────────────────────────────────────────────
   Theme config per plan – unified vibrant palette
   ────────────────────────────────────────────────────────── */
const PLAN_THEMES = {
  FREE: {
    icon: Smile,
    badgeFallback: 'Miễn phí',
    cardBg: 'bg-white',
    cardBorder: 'border-stone-200/60',
    cardHover: 'hover:border-stone-300 hover:shadow-lg',
    iconBg: 'bg-stone-100',
    iconColor: 'text-stone-500',
    priceBg: '',
    priceColor: 'text-stone-900',
    badgeBg: 'bg-stone-100 text-stone-600',
    checkBg: 'bg-emerald-50',
    checkColor: 'text-emerald-600',
    featureColor: 'text-stone-600',
    descColor: 'text-stone-500',
    unitColor: 'text-stone-400',
    dividerColor: 'border-stone-100',
    ctaClass: 'bg-stone-100 text-stone-700 hover:bg-stone-200',
    ctaLabel: 'Khám phá',
  },
  LUOT_LE: {
    icon: Timer,
    badgeFallback: 'Beta 29k',
    cardBg: 'bg-white',
    cardBorder: 'border-stone-200/60',
    cardHover: 'hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    priceBg: '',
    priceColor: 'text-stone-900',
    badgeBg: 'bg-amber-50 text-amber-700',
    checkBg: 'bg-emerald-50',
    checkColor: 'text-emerald-600',
    featureColor: 'text-stone-600',
    descColor: 'text-stone-500',
    unitColor: 'text-stone-400',
    dividerColor: 'border-stone-100',
    ctaClass: 'bg-white text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400',
    ctaLabel: 'Mua lượt dùng',
  },
  PLUS: {
    icon: Rocket,
    badgeFallback: 'Phổ biến',
    cardBg: 'bg-gradient-to-b from-emerald-50/80 to-white',
    cardBorder: 'border-emerald-200',
    cardHover: 'hover:shadow-xl hover:shadow-emerald-100/50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    priceBg: '',
    priceColor: 'text-emerald-800',
    badgeBg: 'bg-emerald-600 text-white',
    checkBg: 'bg-emerald-100',
    checkColor: 'text-emerald-700',
    featureColor: 'text-stone-700',
    descColor: 'text-stone-500',
    unitColor: 'text-stone-500',
    dividerColor: 'border-emerald-100',
    ctaClass: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200',
    ctaLabel: 'Nâng cấp ngay',
    highlighted: true,
  },
  PRO: {
    icon: Gem,
    badgeFallback: 'Khuyến nghị',
    cardBg: 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800',
    cardBorder: 'border-emerald-500/30',
    cardHover: 'hover:shadow-2xl hover:shadow-emerald-900/30',
    iconBg: 'bg-white/15',
    iconColor: 'text-emerald-200',
    priceBg: '',
    priceColor: 'text-white',
    badgeBg: 'bg-emerald-400/20 text-emerald-200 backdrop-blur-sm',
    checkBg: 'bg-white/15',
    checkColor: 'text-emerald-300',
    featureColor: 'text-emerald-100',
    descColor: 'text-emerald-200/80',
    unitColor: 'text-emerald-300/70',
    dividerColor: 'border-emerald-500/30',
    ctaClass: 'bg-white text-emerald-800 hover:bg-emerald-50 shadow-lg font-bold',
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
  const { showToast } = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyPlanCode, setBusyPlanCode] = useState('');
  const [paymentActionLoading, setPaymentActionLoading] = useState(false);
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
    try {
      const data = await fetchPricingPlans();
      setPlans(Array.isArray(data) ? data : []);
      await refreshMySnapshot();
    } catch (apiError) {
      showToast({
        type: 'error',
        title: 'Không thể tải bảng giá',
        message: apiError?.message || 'Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  }, [refreshMySnapshot, showToast]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const enrichedPlans = useMemo(
    () =>
      plans.map((plan) => {
        const theme = PLAN_THEMES[plan.code] ?? PLAN_THEMES.FREE;
        const featureLines = (plan.features ?? []).map(buildFeatureLine);
        const description = plan.description || '';

        return {
          ...plan,
          theme,
          formattedPrice: formatCurrency(plan.price),
          priceUnit: resolvePriceUnit(plan),
          badgeLabel: plan.badgeLabel || theme.badgeFallback,
          featureLines,
          description,
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
      

      try {
        const checkout = await checkoutSubscription(plan.code, plan.billingType === 'RECURRING');
        const payment = checkout?.payment;

        if (payment?.status === 'PENDING') {
          setPendingPayment({
            id: payment.id,
            planCode: plan.code,
            planName: plan.name,
          });
          navigate('/payments/qr', {
            state: {
              payment: {
                id: payment.id,
                orderCode: payment.orderCode,
                amount: payment.amount ?? plan.price,
                bankName: payment.bankName,
                accountName: payment.accountName,
                accountNumber: payment.accountNumber,
                transferContent: payment.transferContent ?? `FITHIRE-${plan.code}-${payment.id ?? ''}`,
                qrUrl: payment.qrUrl,
                status: payment.status,
                planCode: plan.code,
                planName: plan.name,
                createdAt: payment.createdAt,
              }
            }
          });
          return;
        }

        setPendingPayment(null);
        showToast({
          type: 'success',
          title: 'Kích hoạt thành công',
          message: `Gói ${plan.name} đã được kích hoạt.`
        });

        await refreshMySnapshot();
      } catch (apiError) {
        showToast({
          type: 'error',
          title: 'Không thể tạo checkout',
          message: apiError?.message || 'Vui lòng thử lại sau.'
        });
      } finally {
        setBusyPlanCode('');
      }
    },
    [navigate, refreshMySnapshot, showToast]
  );

  const handlePaymentSimulation = useCallback(async (result) => {
    if (!pendingPayment?.id) {
      return;
    }

    setPaymentActionLoading(true);

    try {
      if (result === 'SUCCESS') {
        await simulatePaymentSuccess(pendingPayment.id);
        showToast({
          type: 'success',
          title: 'Thanh toán thành công',
          message: `Gói ${pendingPayment.planName} đã ACTIVE.`
        });
      } else {
        await simulatePaymentFailed(pendingPayment.id);
        showToast({
          type: 'error',
          title: 'Thanh toán thất bại',
          message: `Bạn có thể checkout lại gói ${pendingPayment.planName}.`
        });
      }
      setPendingPayment(null);
      await refreshMySnapshot();
    } catch (apiError) {
      showToast({
        type: 'error',
        title: 'Không thể cập nhật thanh toán',
        message: apiError?.message || 'Vui lòng thử lại sau.'
      });
    } finally {
      setPaymentActionLoading(false);
    }
  }, [pendingPayment, refreshMySnapshot, showToast]);

  /* ── Loading skeleton ─────────────────────────────────── */
  if (loading) {
    return (
      <section className="mb-20">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`pricing-skeleton-${index}`}
              className="h-[420px] rounded-2xl border border-stone-100 bg-stone-50 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-20">
      {/* Pending payment simulation */}
      {pendingPayment ? (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="mb-2 text-sm font-semibold text-amber-800">
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

      {/* ══════════════════════════════════════════════════
          PRICING CARDS GRID
         ══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch">
        {enrichedPlans.map((plan) => {
          const Icon = plan.theme.icon;
          const isBusy = busyPlanCode === plan.code;
          const isCurrentPlan = activePlanCodes.includes(plan.code);
          const isDisabled = isBusy || paymentActionLoading || isCurrentPlan;
          const isPro = plan.code === 'PRO';
          const isPlus = plan.code === 'PLUS';

          return (
            <article
              key={plan.code}
              className={`
                relative flex flex-col h-full rounded-[2rem] border p-8
                transition-all duration-500 hover:-translate-y-2
                ${plan.theme.cardBg}
                ${plan.theme.cardBorder}
                ${plan.theme.cardHover}
              `}
            >

              {/* ── Header: icon + badge ── */}
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${plan.theme.iconBg}`}>
                  <Icon className={`h-5 w-5 ${plan.theme.iconColor}`} strokeWidth={1.8} />
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold leading-none ${plan.theme.badgeBg}`}>
                  {plan.badgeLabel}
                </span>
              </div>

              {/* ── Plan name ── */}
              <h3 className={`text-2xl font-display font-black mb-2 ${isPro ? 'text-white' : 'text-stone-900'}`}>
                {plan.name}
              </h3>

              {/* ── Description ── */}
              <p className={`text-[13px] leading-relaxed mb-4 ${plan.theme.descColor}`}>
                {plan.description}
              </p>

              {/* ── Price block ── */}
              <div className="mb-1 flex items-baseline gap-1">
                <span className={`text-4xl font-display font-black leading-none tracking-tight ${plan.theme.priceColor}`}>
                  {plan.formattedPrice}
                </span>
                {Number(plan.price) > 0 && (
                  <span className={`text-xl font-bold ${plan.theme.priceColor}`}>đ</span>
                )}
              </div>
              <p className={`text-xs font-medium mb-5 ${plan.theme.unitColor}`}>
                {plan.priceUnit}
              </p>

              {/* ── Divider ── */}
              <div className={`border-t mb-5 ${plan.theme.dividerColor}`} />

              {/* ── Features ── */}
              <ul className="space-y-3 flex-grow mb-6">
                {plan.featureLines.map((line, idx) => {
                  // Split "Feature Name: detail" for bold name styling
                  const colonIdx = line.indexOf(':');
                  const featureName = colonIdx > -1 ? line.slice(0, colonIdx) : line;
                  const featureDetail = colonIdx > -1 ? line.slice(colonIdx + 1).trim() : '';

                  return (
                    <li
                      key={`${plan.code}-feat-${idx}`}
                      className={`flex items-start gap-2.5 text-[13px] leading-snug ${plan.theme.featureColor}`}
                    >
                      <span className={`mt-0.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${plan.theme.checkBg}`}>
                        <Check className={`h-3 w-3 ${plan.theme.checkColor}`} strokeWidth={3} />
                      </span>
                      <span>
                        <strong className="font-semibold">{featureName}</strong>
                        {featureDetail && (
                          <span className="font-normal">: {featureDetail}</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* ── CTA button ── */}
              <button
                type="button"
                onClick={() => handleCheckout(plan)}
                disabled={isDisabled}
                className={`
                  w-full inline-flex items-center justify-center gap-2
                  px-5 py-3 rounded-xl text-sm font-bold
                  transition-all duration-300 disabled:opacity-50
                  cursor-pointer
                  ${plan.theme.ctaClass}
                `}
              >
                {isBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isPro ? (
                  <Sparkles className="h-4 w-4" />
                ) : null}
                <span>{isBusy ? 'Đang xử lý...' : isCurrentPlan ? 'Gói hiện tại' : plan.ctaLabel}</span>
                {!isBusy && !isCurrentPlan && <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default PricingCards;
