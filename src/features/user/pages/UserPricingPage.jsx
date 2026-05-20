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
            const toneMap = {
              LUOT_LE: {
                ring: 'from-amber-300/40 via-orange-200/20 to-transparent',
                bg: 'bg-gradient-to-br from-amber-50/90 via-white to-white',
                accent: 'bg-amber-500',
                text: 'text-amber-700',
                badge: 'bg-amber-100 text-amber-700',
              },
              PRO: {
                ring: 'from-emerald-300/40 via-teal-200/20 to-transparent',
                bg: 'bg-gradient-to-br from-emerald-50/90 via-white to-white',
                accent: 'bg-emerald-500',
                text: 'text-emerald-700',
                badge: 'bg-emerald-100 text-emerald-700',
              },
              PLUS: {
                ring: 'from-indigo-300/35 via-sky-200/20 to-transparent',
                bg: 'bg-gradient-to-br from-indigo-50/90 via-white to-white',
                accent: 'bg-indigo-500',
                text: 'text-indigo-700',
                badge: 'bg-indigo-100 text-indigo-700',
              },
              FREE: {
                ring: 'from-slate-300/35 via-slate-200/20 to-transparent',
                bg: 'bg-gradient-to-br from-slate-50/90 via-white to-white',
                accent: 'bg-slate-500',
                text: 'text-slate-700',
                badge: 'bg-slate-100 text-slate-700',
              },
            };

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

            const sortedSubscriptions = [...subscriptions].sort((a, b) => {
              const aScore = priority[a?.subscriptionCode] ?? 0;
              const bScore = priority[b?.subscriptionCode] ?? 0;
              return bScore - aScore;
            });
            const primary = sortedSubscriptions[0];
            const primaryTone = toneMap[primary?.subscriptionCode] ?? toneMap.FREE;

            return (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6`}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${primaryTone.ring} opacity-80`} />
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/80 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-200/20 blur-3xl" />

                <div className="relative flex flex-col gap-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 shadow-sm">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        Gói đang dùng
                      </div>
                      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                        Tài khoản hiện tại của bạn
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">
                        {primary ? formatPlanNote(primary.subscriptionCode) : 'Thông tin gói đăng ký hiện tại.'}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                      <span className={`h-2.5 w-2.5 rounded-full ${primaryTone.accent}`} />
                      {sortedSubscriptions.length} gói đang hoạt động
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {sortedSubscriptions.map((sub) => {
                      const code = sub?.subscriptionCode;
                      const tone = toneMap[code] ?? toneMap.FREE;

                      return (
                        <motion.div
                          key={`${code}-${sub?.endDate ?? 'no-end'}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                          className={`relative overflow-hidden rounded-2xl border border-white/70 ${tone.bg} px-4 py-4 shadow-sm`}
                        >
                          <div className={`absolute left-0 top-0 h-full w-1.5 ${tone.accent}`} />
                          <div className="flex items-start gap-4 pl-2">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-slate-500 shadow-sm ring-1 ring-slate-100">
                              <CreditCard className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-bold text-slate-900">{formatPlanName(code)}</h3>
                                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${tone.badge}`}>
                                  đang dùng
                                </span>
                              </div>
                              <p className={`mt-1 text-sm font-medium ${tone.text}`}>{formatPlanNote(code)}</p>
                              <p className="mt-1 text-xs text-slate-500">
                                Hạn dùng: {sub?.endDate ? new Date(sub.endDate).toLocaleDateString('vi-VN') : 'Không thời hạn'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })()
        ) : !loading && subscriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-sky-50 opacity-90" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 shadow-sm ring-1 ring-white/80">
                <AlertCircle className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Bạn đang dùng gói Free</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  Bạn có thể nâng cấp lên các gói trả phí bên dưới để trải nghiệm đầy đủ tính năng.
                </p>
              </div>
            </div>
          </motion.div>
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
