import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CreditCard, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchMySubscriptions } from '../../pricing/services/subscriptionApi';
import PricingCards from '../../pricing/components/PricingCards';

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
          subscriptions.map((sub, idx) => {
            const isPro = sub.subscriptionCode === 'PRO';
            const isFree = sub.subscriptionCode === 'FREE';
            
            return (
              <div key={idx} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-5 shadow-sm ${
                isPro ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-white' : 
                isFree ? 'border-sky-200 bg-gradient-to-r from-sky-50 via-white to-indigo-50/60' : 'border-indigo-100 bg-indigo-50/30'
              }`}>
                <div className="flex items-center gap-5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    isPro ? 'bg-emerald-100 text-emerald-600' : 
                    isFree ? 'bg-slate-100 text-slate-600 ring-1 ring-slate-200' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-lg font-bold text-slate-900">
                        {isPro ? 'Gói Pro Cao Cấp' : sub.subscriptionCode === 'PLUS' ? 'Gói Plus Phổ Biến' : `Gói ${sub.subscriptionCode}`}
                      </h2>
                      <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isPro ? 'bg-emerald-100 text-emerald-700' : 
                        isFree ? 'bg-slate-100 text-slate-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        <CheckCircle2 className="h-3 w-3" /> Đang sử dụng
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>Hạn dùng: <strong className="text-slate-700">{sub.endDate ? new Date(sub.endDate).toLocaleDateString('vi-VN') : 'Không thời hạn'}</strong></span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block h-10 w-px bg-slate-200/70" />
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Quyền lợi:</span> Tài khoản cơ bản, giới hạn tính năng.
                </div>
              </div>
            );
          })
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
        <PricingCards />
      </div>

    </div>
  );
}
