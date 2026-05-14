import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CreditCard, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchMySubscriptions } from '../../pricing/services/subscriptionApi';

const PricingCards = React.lazy(() => import('../../pricing/components/PricingCards'));

export default function UserPricingPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchMySubscriptions()
      .then((data) => {
        if (mounted && data?.userSubscriptions) {
          // Lọc ra những gói đang ACTIVE và chưa hết hạn
          const now = Date.now();
          const activeSubs = data.userSubscriptions.filter((item) => {
            if (item?.status !== 'ACTIVE') return false;
            if (!item?.endDate) return true;
            return new Date(item.endDate).getTime() > now;
          });
          setSubscriptions(activeSubs);
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
    <div className="relative mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
      
      {/* Background Bubbles */}
      <div className="absolute top-0 left-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-emerald-200/40 blur-[110px] -z-10 pointer-events-none" />
      <div className="absolute top-40 right-0 h-[340px] w-[340px] translate-x-1/3 rounded-full bg-sky-200/40 blur-[90px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 h-[260px] w-[260px] translate-y-1/3 rounded-full bg-rose-200/30 blur-[90px] -z-10 pointer-events-none" />

      {/* 1. Header */}
      <div className="relative z-10 flex flex-col gap-3 pb-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Gói Dịch vụ & Thanh toán
        </h1>
        <p className="text-base text-slate-500 max-w-2xl leading-relaxed">
          Nâng cấp tài khoản để mở khóa giới hạn phân tích CV, mock interview và các tính năng AI chuyên sâu.
        </p>
      </div>

      {/* 2. Current Plan Banner */}
      <div className="relative z-10 flex flex-col gap-4">
        {!loading && subscriptions.length > 0 ? (
          (() => {
            const priority = { LUOT_LE: 4, PRO: 3, PLUS: 2, FREE: 1 };
            const sortedSubscriptions = [...subscriptions].sort((a, b) => {
              const aScore = priority[a?.subscriptionCode] ?? 0;
              const bScore = priority[b?.subscriptionCode] ?? 0;
              return bScore - aScore;
            });

            const formatPlanName = (code) => {
              if (code === 'LUOT_LE') return 'Gói Lượt Lẻ';
              if (code === 'PRO') return 'Gói Pro Cao Cấp';
              if (code === 'PLUS') return 'Gói Plus Phổ Biến';
              if (code === 'FREE') return 'Gói Free';
              return `Gói ${code}`;
            };

            const formatPlanNote = (code) => {
              if (code === 'LUOT_LE') return 'Dùng theo lượt, linh hoạt và không cần duy trì gói tháng.';
              if (code === 'PRO') return 'Tối ưu cho người dùng cần AI mạnh hơn và nhiều lượt phân tích.';
              if (code === 'PLUS') return 'Cân bằng giữa chi phí và số lượng tính năng.';
              if (code === 'FREE') return 'Phù hợp để trải nghiệm các tính năng cơ bản.';
              return 'Gói đang sử dụng của bạn.';
            };

            const getToneClass = (code) => {
              if (code === 'LUOT_LE') return 'border-amber-200/70 ring-amber-100 bg-amber-50/50 text-amber-700';
              if (code === 'PRO') return 'border-emerald-200/70 ring-emerald-100 bg-emerald-50/50 text-emerald-700';
              if (code === 'PLUS') return 'border-indigo-200/70 ring-indigo-100 bg-indigo-50/50 text-indigo-700';
              return 'border-slate-200/70 ring-slate-100 bg-slate-50/80 text-slate-700';
            };

            return (
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-slate-900">Gói đang dùng</h2>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                    {sortedSubscriptions.length} gói
                  </span>
                </div>

                <div className="space-y-2">
                  {sortedSubscriptions.map((sub) => {
                    const code = sub?.subscriptionCode;

                    return (
                      <div key={`${code}-${sub?.endDate ?? 'no-end'}`} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-medium text-slate-900">{formatPlanName(code)}</h3>
                            <span className="text-[10px] uppercase tracking-wide text-slate-400">đang dùng</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Hạn dùng: {sub?.endDate ? new Date(sub.endDate).toLocaleDateString('vi-VN') : 'Không thời hạn'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()
        ) : !loading && subscriptions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Bạn đang dùng gói Free</h2>
              <p className="text-sm text-slate-500 mt-1">Bạn có thể nâng cấp lên các gói trả phí bên dưới để trải nghiệm đầy đủ tính năng.</p>
            </div>
          </div>
        ) : (
          <div className="h-24 rounded-2xl border border-slate-100 bg-slate-50 animate-pulse" />
        )}
      </div>

      {/* 3. Pricing Cards from Landing */}
      <div className="relative z-10 pt-4">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Bảng giá
        </h2>
        {/* Reusing the beautiful component from the landing page */}
        <Suspense fallback={<div className="h-[420px] rounded-2xl border border-stone-100 bg-stone-50 animate-pulse" />}>
          <PricingCards />
        </Suspense>
      </div>

    </div>
  );
}
