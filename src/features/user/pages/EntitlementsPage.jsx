import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  BadgeCheck,
  Crown,
  Loader2,
  Check,
  ArrowRight,
  Info,
  ChevronRight,
} from 'lucide-react';
import { fetchMyEntitlements, fetchMySubscriptions } from '../services/userApi';
import { fetchPaymentHistory } from '../../pricing/services/subscriptionApi';
import { useToast } from '../../../components/ui/ToastProvider';

const SUBSCRIPTION_REFRESH_FLAG_KEY = 'fitHire_subscription_refresh_needed';

const FEATURE_MAPPING = {
  CV_SCORING: {
    name: 'CV Scoring',
    subtitle: 'Đánh giá và chấm điểm hồ sơ AI',
  },
  MOCK_INTERVIEW: {
    name: 'Mock Interview',
    subtitle: 'Phỏng vấn giả lập với chuyên gia AI',
  },
  CULTURE_FIT: {
    name: 'Mức sử dụng chung',
    subtitle: 'Tổng quan các tác vụ cơ bản',
  },
  CV_GENERATION: {
    name: 'Tạo CV',
    subtitle: 'Tạo mẫu CV chuyên nghiệp',
  },
};

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

function resolveEntitlementDetails(item) {
  const code = item?.featureCode || item?.code || item?.name || item?.feature || item?.key || '';
  const mapped = FEATURE_MAPPING[code];
  const name = mapped?.name || String(code).replace(/_/g, ' ');
  const subtitle = mapped?.subtitle || 'Tính năng hệ thống';
  const sourceSubscriptionCode = item?.sourceSubscriptionCode || item?.subscriptionCode || '';
  const sourceSubscriptionName = item?.sourceSubscriptionName || item?.subscriptionName || '';

  const value = item?.value ?? item;
  const used = Number(value?.used ?? value?.consumed ?? value?.usage ?? value?.usedCount);
  const limit = Number(value?.usageLimit ?? value?.limit ?? value?.quota ?? value?.max ?? value?.total);
  const isUnlimited = !!(value?.unlimited ?? item?.unlimited);

  return {
    name,
    subtitle,
    sourceSubscriptionCode,
    sourceSubscriptionName,
    used: Number.isFinite(used) ? used : 0,
    limit: Number.isFinite(limit) ? limit : 0,
    isUnlimited,
  };
}

function getUsagePresentation(used, limit, isUnlimited) {
  if (isUnlimited) {
    return {
      summary: 'Không giới hạn',
      detail: 'Bạn có thể sử dụng tính năng này không giới hạn trong chu kỳ hiện tại.',
      remaining: null,
      progressPercent: 100,
    };
  }

  const safeLimit = Number.isFinite(limit) ? Math.max(0, limit) : 0;
  const safeUsed = Number.isFinite(used) ? Math.max(0, used) : 0;
  const remaining = Math.max(0, safeLimit - safeUsed);

  return {
    summary: safeLimit > 0 ? `Còn ${remaining} lượt` : 'Chưa có lượt khả dụng',
    detail: safeLimit > 0 ? `Tổng ${safeLimit} lượt • Đã dùng ${safeUsed} lượt` : 'Chưa có hạn mức khả dụng',
    remaining,
    progressPercent: safeLimit > 0 ? ((safeLimit - remaining) / safeLimit) * 100 : 0,
  };
}

function getUsageBarLabel(sourceSubscriptionCode, sourceSubscriptionName, usagePresentation) {
  const sourceLabel = getEntitlementSourceLabel(sourceSubscriptionCode, sourceSubscriptionName);

  if (sourceSubscriptionCode === 'LUOT_LE' || /lượt lẻ/i.test(sourceSubscriptionName || '')) {
    return {
      sourceLabel,
      helperText: 'Lượt đã mua thêm được tính riêng, không làm reset gói miễn phí.',
    };
  }

  return {
    sourceLabel,
    helperText: usagePresentation.detail,
  };
}

function getEntitlementSourceLabel(sourceSubscriptionCode, sourceSubscriptionName) {
  const raw = sourceSubscriptionName || sourceSubscriptionCode || '';
  if (!raw) return 'Gói hiện tại';
  if (sourceSubscriptionCode === 'LUOT_LE' || /lượt lẻ/i.test(raw)) return 'Gói Lượt lẻ';
  if (sourceSubscriptionCode === 'FREE' || /miễn phí|free/i.test(raw)) return 'Gói Miễn phí';
  if (sourceSubscriptionCode === 'PLUS' || /plus/i.test(raw)) return 'Gói Plus';
  if (sourceSubscriptionCode === 'PRO' || /pro/i.test(raw)) return 'Gói Pro';
  return `Gói ${raw}`;
}

const formatAmount = (amount) => {
  if (amount === 0) return '0đ';
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '---';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function EntitlementsPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [entitlements, setEntitlements] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;
    let timer = null;
    let attempts = 0;

    const hasRefreshFlag = () => {
      try {
        return sessionStorage.getItem(SUBSCRIPTION_REFRESH_FLAG_KEY) === '1';
      } catch {
        return false;
      }
    };

    const clearRefreshFlag = () => {
      try {
        sessionStorage.removeItem(SUBSCRIPTION_REFRESH_FLAG_KEY);
      } catch {
        // ignore storage errors
      }
    };

    const refreshSubscriptionState = async () => {
      if (!isMounted) return;
      try {
        const [entitlementsPayload, subscriptionPayload] = await Promise.all([
          fetchMyEntitlements(),
          fetchMySubscriptions(),
        ]);
        if (!isMounted) return;

        setEntitlements(normalizeEntitlements(entitlementsPayload));
        const activeSubscription = resolveActiveSubscription(subscriptionPayload);
        setActivePlan(activeSubscription);

        if (activeSubscription) {
          clearRefreshFlag();
          return;
        }
      } catch {
        // ignore and retry shortly
      }

      attempts += 1;
      if (isMounted && attempts < 5 && hasRefreshFlag()) {
        timer = window.setTimeout(refreshSubscriptionState, 1500);
      } else {
        clearRefreshFlag();
      }
    };

    const handleSubscriptionUpdated = () => {
      if (timer) window.clearTimeout(timer);
      attempts = 0;
      timer = window.setTimeout(refreshSubscriptionState, 500);
    };

    window.addEventListener('fitHireSubscriptionUpdated', handleSubscriptionUpdated);

    if (hasRefreshFlag()) {
      timer = window.setTimeout(refreshSubscriptionState, 500);
    }

    return () => {
      isMounted = false;
      if (timer) window.clearTimeout(timer);
      window.removeEventListener('fitHireSubscriptionUpdated', handleSubscriptionUpdated);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError('');

    Promise.all([
      fetchMyEntitlements(),
      fetchMySubscriptions(),
      fetchPaymentHistory({ page: 0, size: 5, sortBy: 'createdAt', sortDirection: 'DESC' }),
    ])
      .then(([entitlementsPayload, subscriptionPayload, paymentHistoryPayload]) => {
        if (!isMounted) return;
        setEntitlements(normalizeEntitlements(entitlementsPayload));
        setActivePlan(resolveActiveSubscription(subscriptionPayload));
        setPayments(paymentHistoryPayload?.content || []);
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

  const planLabel = useMemo(() => {
    const code = activePlan?.subscriptionCode || '';
    const name = activePlan?.subscriptionName || '';
    const rawLabel = name || code || 'Lượt lẻ';

    if (rawLabel === 'Lượt lẻ' || code === 'LUOT_LE') {
      if (entitlements.length > 0) {
        const allExhausted = entitlements.every((item) => {
          const { used, limit, isUnlimited } = resolveEntitlementDetails(item);
          if (isUnlimited) return false;
          return used >= limit;
        });
        if (allExhausted) {
          return 'Miễn phí';
        }
      }
    }

    return rawLabel;
  }, [activePlan, entitlements]);

  const isFree = useMemo(() => {
    const labelLower = planLabel.toLowerCase();
    return labelLower.includes('free') || planLabel === 'Lượt lẻ' || planLabel === 'Miễn phí';
  }, [planLabel]);

  const planExpiry = useMemo(() => {
    if (!activePlan?.endDate) return 'Vô thời hạn';
    const date = new Date(activePlan.endDate);
    if (Number.isNaN(date.getTime())) return 'Không xác định';
    return date.toLocaleDateString('vi-VN');
  }, [activePlan]);

  const recentPayments = useMemo(() => {
    return [...payments]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [payments]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 font-sans lg:p-8">
      <div className="flex flex-col gap-1 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quyền sử dụng</h1>
        <p className="text-sm text-slate-500">Chi tiết gói dịch vụ và mức độ sử dụng của bạn</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-3 py-20 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          Đang tải dữ liệu quyền sử dụng...
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{loadError}</div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gói hiện tại</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-950">{planLabel}</span>
                    {isFree && (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                        FREE
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-600">
                    {planExpiry}
                  </span>
                </div>
              </div>

              <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-950">Số liệu sử dụng</h3>

                {entitlements.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                    Chưa có dữ liệu hạn mức để hiển thị.
                  </div>
                ) : (
                  <div className="space-y-5">
                    {entitlements.map((item, index) => {
                      const { name, subtitle, sourceSubscriptionCode, sourceSubscriptionName, used, limit, isUnlimited } = resolveEntitlementDetails(item);
                      const usagePresentation = getUsagePresentation(used, limit, isUnlimited);
                      const { sourceLabel, helperText } = getUsageBarLabel(
                        sourceSubscriptionCode,
                        sourceSubscriptionName,
                        usagePresentation,
                      );

                      return (
                        <div key={`${name}-${sourceSubscriptionCode || index}-${index}`} className="space-y-2 rounded-xl border border-slate-100 p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{name}</h4>
                              <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
                              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{sourceLabel}</p>
                              <p className="mt-1 text-xs font-medium text-emerald-700">{helperText}</p>
                            </div>
                            <span className="mt-0.5 text-right text-xs font-semibold text-slate-700">
                              {usagePresentation.summary}
                            </span>
                          </div>

                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                              style={{ width: `${Math.min(100, usagePresentation.progressPercent)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-start gap-3 rounded-xl border border-indigo-50 bg-indigo-50/50 p-4">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500" />
                  <p className="text-xs font-medium leading-relaxed text-indigo-700/90">
                    Mức giới hạn sử dụng sẽ được làm mới vào ngày đầu tiên của mỗi tháng. Để có thêm lượt sử dụng, vui lòng nâng cấp lên gói Pro.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-5">
              <div className="relative flex min-h-[310px] flex-col justify-between overflow-hidden rounded-2xl bg-[#0f6b3e] p-6 text-white shadow-md">
                <div className="space-y-4">
                  <div>
                    <span className="inline-block rounded-md bg-amber-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                      FIT HIRE PRO
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold leading-snug tracking-tight">
                    Mở khóa sức mạnh
                    <br />
                    tối đa của AI
                  </h3>

                  <ul className="space-y-2.5 pt-2">
                    <li className="flex items-center gap-2.5 text-sm font-medium">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700/80 text-white">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                      Không giới hạn CV Scoring
                    </li>
                    <li className="flex items-center gap-2.5 text-sm font-medium">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700/80 text-white">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                      Phỏng vấn giả lập nâng cao
                    </li>
                    <li className="flex items-center gap-2.5 text-sm font-medium">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700/80 text-white">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                      Phân tích thị trường việc làm
                    </li>
                  </ul>
                </div>

                <div className="space-y-2 pt-6 text-center">
                  <button
                    onClick={() => navigate('/user/pricing')}
                    className="w-full cursor-pointer rounded-xl bg-white py-3 text-sm font-bold text-[#0f6b3e] shadow-sm transition-colors hover:bg-emerald-50"
                  >
                    Nâng cấp ngay
                  </button>
                  <p className="text-[11px] font-medium text-emerald-100/90">Chỉ từ 199.000đ / tháng</p>
                </div>
              </div>

              <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="h-36 overflow-hidden">
                  <img
                    src="/images/hero-dashboard.png"
                    alt="Dashboard support illustration"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-3 p-5">
                  <h4 className="text-sm font-bold text-slate-900">Cần hỗ trợ?</h4>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Chúng tôi luôn sẵn sàng giải đáp thắc mắc về gói dịch vụ của bạn.
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => navigate('/user/questions')}
                      className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-emerald-600 transition-colors hover:text-emerald-700"
                    >
                      Liên hệ tư vấn <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Lịch sử giao dịch</h3>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              {recentPayments.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">Chưa có lịch sử giao dịch thanh toán.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-50 bg-slate-50/50">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Ngày</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Loại dịch vụ</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Trạng thái</th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Số tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {recentPayments.map((p) => {
                        const isSuccess = p.status === 'SUCCESS';
                        const isFreeItem = p.amount === 0;

                        return (
                          <tr key={p.id} className="transition-colors hover:bg-slate-50/20">
                            <td className="px-6 py-4 text-sm font-medium text-slate-600">{formatDate(p.createdAt)}</td>
                            <td className="px-6 py-4 text-sm font-bold text-slate-900">
                              {p.planName || p.subscriptionCode || 'Nâng cấp Premium'}
                            </td>
                            <td className="px-6 py-4">
                              {isFreeItem ? (
                                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                                  MIỄN PHÍ
                                </span>
                              ) : isSuccess ? (
                                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                                  THÀNH CÔNG
                                </span>
                              ) : p.status === 'PENDING' ? (
                                <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                                  CHỜ XỬ LÝ
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700">
                                  THẤT BẠI
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                              {formatAmount(p.amount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="border-t border-slate-50 p-4 text-center">
                <button
                  onClick={() => navigate('/user/payments')}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-500 transition-colors hover:text-slate-900"
                >
                  Xem toàn bộ lịch sử
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
