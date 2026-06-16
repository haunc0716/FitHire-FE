import React, { Suspense, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { fetchMySubscriptions } from '../../pricing/services/subscriptionApi';

const PricingCards = React.lazy(() => import('../../pricing/components/PricingCards'));

const TIER_FALLBACK = { FREE: 0, PLUS: 1, PRO: 2 };

function resolveTierLevel(sub) {
  if (sub?.tierLevel !== null && sub?.tierLevel !== undefined && !Number.isNaN(Number(sub.tierLevel))) {
    return Number(sub.tierLevel);
  }
  const code = sub?.subscriptionCode;
  if (!code) return null;
  return Object.prototype.hasOwnProperty.call(TIER_FALLBACK, code) ? TIER_FALLBACK[code] : null;
}

export default function UserPricingPage() {
  const [, setSubscriptions] = useState([]);
  const [, setCurrentSubscription] = useState(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchMySubscriptions()
      .then((data) => {
        if (mounted && data?.userSubscriptions) {
          const now = Date.now();
          const activeSubs = data.userSubscriptions.filter((item) => {
            if (item?.status !== 'ACTIVE') return false;
            if (!item?.endDate) return true;
            return new Date(item.endDate).getTime() > now;
          });

          setSubscriptions(activeSubs);

          const fallbackCurrent = [...activeSubs]
            .filter((item) => resolveTierLevel(item) !== null)
            .sort((a, b) => (resolveTierLevel(b) ?? -1) - (resolveTierLevel(a) ?? -1))[0] ?? null;

          setCurrentSubscription(data?.currentSubscription ?? fallbackCurrent);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-x-clip overflow-y-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="pointer-events-none absolute top-0 left-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-emerald-200/40 blur-[110px]" />
      <div className="pointer-events-none absolute top-40 right-0 h-[340px] w-[340px] translate-x-1/3 rounded-full bg-sky-200/40 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[260px] w-[260px] translate-y-1/3 rounded-full bg-rose-200/30 blur-[90px]" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-8 px-6 py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-3 pb-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Gói Dịch vụ & Thanh toán
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-500">
            Nâng cấp tài khoản để mở khóa giới hạn phân tích CV, mock interview và các tính năng AI chuyên sâu.
          </p>
        </div>

        <div className="pt-4">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Bảng giá
          </h2>

          <Suspense fallback={<div className="h-[420px] rounded-2xl border border-stone-100 bg-stone-50 animate-pulse" />}>
            <PricingCards />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
