import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Loader2, Sparkles, Smile, Timer, Rocket, Gem } from 'lucide-react';
import { getAuthSession } from '../../auth/services/authSession';
import { useToast } from '../../../components/ui/ToastProvider';
import {
  checkoutSubscription,
  fetchMySubscriptions,
  fetchPricingPlans,
} from '../services/subscriptionApi';

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

const DEFAULT_THEME = {
  icon: Sparkles,
  badgeFallback: 'Mới',
  cardBg: 'bg-white',
  cardBorder: 'border-stone-200/60',
  cardHover: 'hover:border-slate-300 hover:shadow-lg',
  iconBg: 'bg-slate-100',
  iconColor: 'text-slate-600',
  priceBg: '',
  priceColor: 'text-slate-900',
  badgeBg: 'bg-slate-100 text-slate-700',
  checkBg: 'bg-sky-50',
  checkColor: 'text-sky-600',
  featureColor: 'text-stone-700',
  descColor: 'text-stone-500',
  unitColor: 'text-stone-400',
  dividerColor: 'border-stone-100',
  ctaClass: 'bg-slate-900 text-white hover:bg-slate-800',
  ctaLabel: 'Chọn gói',
};

const TIER_FALLBACK = {
  FREE: 0,
  PLUS: 1,
  PRO: 2,
};

function resolveTierLevelByCode(code) {
  if (!code) return null;
  return Object.prototype.hasOwnProperty.call(TIER_FALLBACK, code) ? TIER_FALLBACK[code] : null;
}

function resolveTierLevel(item) {
  if (item?.tierLevel !== null && item?.tierLevel !== undefined && !Number.isNaN(Number(item.tierLevel))) {
    return Number(item.tierLevel);
  }
  return resolveTierLevelByCode(item?.code || item?.subscriptionCode);
}

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
  const [activePlanCodes, setActivePlanCodes] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  const refreshMySnapshot = useCallback(async () => {
    const session = getAuthSession();
    if (!session?.accessToken || Number(session.expiresAt) <= Date.now()) {
      setActivePlanCodes([]);
      setCurrentSubscription(null);
      return null;
    }

    const snapshot = await fetchMySubscriptions();
    const now = Date.now();
    const activeSubscriptions = (snapshot?.userSubscriptions ?? [])
      .filter((item) => {
        if (item?.status !== 'ACTIVE') {
          return false;
        }
        if (!item?.endDate) {
          return true;
        }
        return new Date(item.endDate).getTime() > now;
      });

    const activeCodes = activeSubscriptions.map((item) => item.subscriptionCode);
    setActivePlanCodes([...new Set(activeCodes)]);

    const fallbackCurrent = [...activeSubscriptions]
      .filter((item) => resolveTierLevel(item) !== null)
      .sort((a, b) => {
        const levelA = resolveTierLevel(a) ?? -1;
        const levelB = resolveTierLevel(b) ?? -1;
        return levelB - levelA;
      })[0] ?? null;

    setCurrentSubscription(snapshot?.currentSubscription ?? fallbackCurrent);
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
        const theme = PLAN_THEMES[plan.code] ?? DEFAULT_THEME;
        const featureLines = (plan.features ?? []).map(buildFeatureLine);
        const description = plan.description || '';

        return {
          ...plan,
          theme,
          formattedPrice: formatCurrency(plan.price),
          priceUnit: resolvePriceUnit(plan),
          badgeLabel: plan.badgeLabel || theme.badgeFallback || plan.code,
          featureLines,
          description,
          ctaLabel: theme.ctaLabel || 'Chọn gói',
        };
      }),
    [plans]
  );

  const currentTierLevel = useMemo(() => resolveTierLevel(currentSubscription), [currentSubscription]);

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

        if (checkout?.checkoutUrl) {
          window.location.href = checkout.checkoutUrl;
          return;
        }

        if (checkout?.status === 'SUCCESS') {
          showToast({
            type: 'success',
            title: 'Kích hoạt thành công',
            message: `Gói ${plan.name} đã được kích hoạt.`
          });
          await refreshMySnapshot();
          return;
        }

        showToast({
          type: 'error',
          title: 'Không thể tạo checkout',
          message: 'Hệ thống chưa nhận được liên kết thanh toán PayOS. Vui lòng thử lại.'
        });
      } catch (apiError) {
        const errorMessage = apiError?.message || 'Vui lòng thử lại sau.';
        const isPendingConflict =
          apiError?.status === 409 ||
          /đơn thanh toán chờ xử lý|pending/i.test(errorMessage);

        showToast({
          type: isPendingConflict ? 'info' : 'error',
          title: isPendingConflict ? 'Bạn đang có đơn chờ thanh toán' : 'Không thể tạo checkout',
          message: isPendingConflict
            ? 'Hệ thống đã giữ lại đơn thanh toán cũ. Bạn sẽ được chuyển sang lịch sử thanh toán để tiếp tục xử lý.'
            : errorMessage
        });

        if (isPendingConflict) {
          navigate('/user/payments');
        }
      } finally {
        setBusyPlanCode('');
      }
    },
    [navigate, refreshMySnapshot, showToast]
  );

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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch">
        {enrichedPlans.map((plan) => {
          const Icon = plan.theme.icon;
          const isBusy = busyPlanCode === plan.code;
          const planTierLevel = resolveTierLevel(plan);
          const isTierManagedPlan = planTierLevel !== null;
          const isCurrentPlan = isTierManagedPlan
            ? currentTierLevel !== null && planTierLevel === currentTierLevel
            : plan.code !== 'LUOT_LE' && activePlanCodes.includes(plan.code);

          let ctaText = plan.ctaLabel;
          let isPlanUnavailable = isCurrentPlan;
          if (isTierManagedPlan && currentTierLevel !== null) {
            if (planTierLevel === currentTierLevel) {
              ctaText = 'Gói hiện tại';
              isPlanUnavailable = true;
            } else if (planTierLevel < currentTierLevel) {
              ctaText = 'Đã bao gồm';
              isPlanUnavailable = true;
            } else {
              ctaText = `Nâng cấp lên ${plan.name}`;
              isPlanUnavailable = false;
            }
          } else if (isCurrentPlan) {
            ctaText = 'Gói hiện tại';
            isPlanUnavailable = true;
          }

          const isDisabled = isBusy || isPlanUnavailable;
          const isPro = plan.code === 'PRO';
          const isDefaultPlan = !PLAN_THEMES[plan.code];

          return (
            <article
              key={plan.code}
              className={`
                relative flex flex-col h-full rounded-[2rem] border p-8
                transition-all duration-500 hover:-translate-y-2
                ${plan.theme.cardBg}
                ${plan.theme.cardBorder}
                ${plan.theme.cardHover}
                ${isDefaultPlan ? 'shadow-sm' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${plan.theme.iconBg}`}>
                  <Icon className={`h-5 w-5 ${plan.theme.iconColor}`} strokeWidth={1.8} />
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold leading-none ${plan.theme.badgeBg}`}>
                  {plan.badgeLabel}
                </span>
              </div>

              <h3 className={`text-2xl font-display font-black mb-2 ${isPro ? 'text-white' : 'text-stone-900'}`}>
                {plan.name}
                {isDefaultPlan && <span className="ml-2 text-xs font-semibold text-stone-400">• Gói mới</span>}
              </h3>

              <p className={`text-[13px] leading-relaxed mb-4 ${plan.theme.descColor}`}>
                {plan.description}
              </p>

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

              <div className={`border-t mb-5 ${plan.theme.dividerColor}`} />

              <ul className="space-y-3 flex-grow mb-6">
                {plan.featureLines.map((line, idx) => {
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
                <span>{isBusy ? 'Đang xử lý...' : ctaText}</span>
                {!isBusy && !isPlanUnavailable && <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default PricingCards;
