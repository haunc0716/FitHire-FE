import React, { useEffect, useMemo, useState } from 'react';
import { Crown, ShieldCheck, AlertTriangle, Loader2, BadgeCheck } from 'lucide-react';
import { fetchMyEntitlements, fetchMySubscriptions } from '../services/userApi';
import { useToast } from '../../../components/ui/ToastProvider';

function resolveActiveSubscription(snapshot) {
  const now = Date.now();
  const subscriptions = snapshot?.userSubscriptions ?? snapshot?.items ?? [];
  return (subscriptions || [])
    .filter((item) => item?.status === 'ACTIVE')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .find((item) => {
      if (!item?.endDate) return true;
      return new Date(item.endDate).getTime() > now;
    });
}

function normalizeEntitlements(payload) {
  if (Array.isArray(payload)) return payload;
  const list = payload?.items || payload?.entitlements || payload?.content;
  if (Array.isArray(list)) return list;

  if (payload && typeof payload === 'object') {
    return Object.entries(payload)
      .filter(([key]) => !['status', 'message', 'timestamp'].includes(key))
      .map(([key, value]) => ({ key, value }));
  }

  return [];
}

function resolveEntitlementLabel(item) {
  const raw = item?.featureCode || item?.code || item?.name || item?.feature || item?.key;
  if (!raw) return 'Quyền sử dụng';
  return String(raw).replace(/_/g, ' ');
}

function resolveEntitlementNumbers(item) {
  const value = item?.value ?? item;
  const used = Number(value?.used ?? value?.consumed ?? value?.usage ?? value?.usedCount);
  const limit = Number(value?.limit ?? value?.quota ?? value?.max ?? value?.total);
  const remaining = Number(value?.remaining ?? (Number.isFinite(limit) && Number.isFinite(used) ? limit - used : NaN));

  return {
    used: Number.isFinite(used) ? used : null,
    limit: Number.isFinite(limit) ? limit : null,
    remaining: Number.isFinite(remaining) ? remaining : null,
  };
}

export default function CulturalFitPage() {
  const { showToast } = useToast();
  const [entitlements, setEntitlements] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError('');

    Promise.all([fetchMyEntitlements(), fetchMySubscriptions()])
      .then(([entitlementsPayload, subscriptionPayload]) => {
        if (!isMounted) return;
        setEntitlements(normalizeEntitlements(entitlementsPayload));
        setActivePlan(resolveActiveSubscription(subscriptionPayload));
      })
      .catch((error) => {
        if (!isMounted) return;
        const message = error?.message || 'Không thể tải dữ liệu quyền sử dụng.';
        setLoadError(message);
        showToast({ type: 'error', title: 'Tải dữ liệu thất bại', message });
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const planLabel = useMemo(() => (
    activePlan?.subscriptionName || activePlan?.subscriptionCode || 'FREE'
  ), [activePlan]);

  const planExpiry = useMemo(() => {
    if (!activePlan?.endDate) return 'Không giới hạn';
    const date = new Date(activePlan.endDate);
    if (Number.isNaN(date.getTime())) return 'Không xác định';
    return date.toLocaleDateString('vi-VN');
  }, [activePlan]);

  return (
    <div className="relative mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
      <div className="absolute top-0 left-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-emerald-200/40 blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-40 right-0 h-[300px] w-[300px] translate-x-1/3 rounded-full bg-amber-200/40 blur-[80px] -z-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-3 pb-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Quyền sử dụng của bạn
        </h1>
        <p className="text-base text-slate-500 max-w-2xl leading-relaxed">
          Theo dõi gói dịch vụ đang hoạt động và hạn mức các tính năng trên FitHire.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang tải dữ liệu quyền sử dụng...
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {loadError}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">Gói hiện tại</p>
                  <h2 className="text-lg font-bold text-slate-900">{planLabel}</h2>
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Trạng thái</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" /> Hoạt động
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Hết hạn</span>
                  <span className="font-semibold text-slate-700">{planExpiry}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tự gia hạn</span>
                  <span className="font-semibold text-slate-700">{activePlan?.autoRenew ? 'Bật' : 'Tắt'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Hạn mức tính năng</h2>
                  <p className="text-sm text-slate-500">Theo dõi mức sử dụng từng tính năng.</p>
                </div>
              </div>

              {entitlements.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  Chưa có dữ liệu hạn mức để hiển thị.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {entitlements.map((item, index) => {
                    const { used, limit, remaining } = resolveEntitlementNumbers(item);
                    return (
                      <div key={`${resolveEntitlementLabel(item)}-${index}`} className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          {resolveEntitlementLabel(item)}
                        </p>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>Đã dùng</span>
                          <span className="font-semibold text-slate-900">{used ?? '--'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>Tổng hạn mức</span>
                          <span className="font-semibold text-slate-900">{limit ?? '--'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>Còn lại</span>
                          <span className="font-semibold text-slate-900">{remaining ?? '--'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/40 px-4 py-3 text-xs text-amber-700">
              <AlertTriangle className="h-4 w-4 mt-0.5" />
              Hạn mức sẽ được reset theo chu kỳ gói dịch vụ. Nếu thấy dữ liệu chưa cập nhật, vui lòng chờ hệ thống đồng bộ.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
