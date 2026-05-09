import React, { useEffect, useState } from 'react';
import { fetchPricingPlans } from '../../pricing/services/subscriptionApi';

export default function UserPricingPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    fetchPricingPlans()
      .then((data) => {
        if (mounted) setPlans(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (mounted) setError(err?.message || 'Không tải được bảng giá.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-emerald-100 bg-white/80 p-6">
        <h1 className="font-display text-3xl font-bold text-emerald-950">Bảng giá gói dịch vụ</h1>
        <p className="mt-2 text-sm text-emerald-900/70">Chọn gói phù hợp để tăng lượt phân tích CV, mock interview và coaching.</p>
      </section>

      {loading && <p className="text-sm text-emerald-800">Đang tải bảng giá...</p>}
      {error && <p className="text-sm text-rose-600">{error}</p>}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.code} className="rounded-3xl border border-emerald-100 bg-white/85 p-5 shadow-[0_10px_30px_rgba(16,185,129,0.1)]">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-700/70">{plan.billingType || 'PLAN'}</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-emerald-950">{plan.name}</h2>
            <p className="mt-2 text-sm text-emerald-900/70">{plan.description || 'Gói tối ưu cho nhu cầu nâng cấp hồ sơ chuyên nghiệp.'}</p>
            <p className="mt-5 text-3xl font-bold text-emerald-800">{Number(plan.price).toLocaleString('vi-VN')}đ</p>
            <button className="mt-5 w-full rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
              Mua gói này
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
