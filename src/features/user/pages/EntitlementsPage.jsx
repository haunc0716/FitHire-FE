import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  Check,
  ArrowRight,
  Info,
} from 'lucide-react';
import { fetchMyEntitlements, fetchMySubscriptions } from '../services/userApi';
import { fetchPaymentHistory } from '../../pricing/services/subscriptionApi';
import { useToast } from '../../../components/ui/ToastProvider';

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

  const value = item?.value ?? item;
  const used = Number(value?.used ?? value?.consumed ?? value?.usage ?? value?.usedCount);
  const limit = Number(value?.usageLimit ?? value?.limit ?? value?.quota ?? value?.max ?? value?.total);
  const isUnlimited = !!(value?.unlimited ?? item?.unlimited);

  return {
    name,
    subtitle,
    used: Number.isFinite(used) ? used : 0,
    limit: Number.isFinite(limit) ? limit : 0,
    isUnlimited,
  };
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
    setIsLoading(true);
    setLoadError('');

    Promise.all([
      fetchMyEntitlements(), 
      fetchMySubscriptions(),
      fetchPaymentHistory({ page: 0, size: 5, sortBy: 'createdAt', sortDirection: 'DESC' })
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

  const planLabel = useMemo(() => activePlan?.subscriptionName || activePlan?.subscriptionCode || 'Miễn phí', [activePlan]);
  const isFree = useMemo(() => {
    const labelLower = planLabel.toLowerCase();
    return labelLower.includes('free') || labelLower === 'lượt lẻ' || labelLower.includes('miễn phí');
  }, [planLabel]);
  const planExpiry = useMemo(() => {
    if (!activePlan?.endDate) return 'Vô thời hạn';
    const date = new Date(activePlan.endDate);
    if (Number.isNaN(date.getTime())) return 'Không xác định';
    return date.toLocaleDateString('vi-VN');
  }, [activePlan]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quyền sử dụng</h1>
        <p className="text-sm text-slate-500">Chi tiết gói dịch vụ và mức độ sử dụng của bạn</p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 text-sm text-slate-500 justify-center py-20">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          Đang tải dữ liệu quyền sử dụng...
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{loadError}</div>
      ) : (
        <div className="space-y-10">
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Plan Info & Usage Stats */}
            <div className="lg:col-span-7 space-y-6">
              {/* Current Plan Card */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center justify-between">
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
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-600">
                    {planExpiry}
                  </span>
                </div>
              </div>

              {/* Usage Stats Card */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                <h3 className="text-base font-bold text-slate-950">Số liệu sử dụng</h3>
                
                {entitlements.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                    Chưa có dữ liệu hạn mức để hiển thị.
                  </div>
                ) : (
                  <div className="space-y-5">
                    {entitlements.map((item, index) => {
                      const { name, subtitle, used, limit, isUnlimited } = resolveEntitlementDetails(item);
                      const percent = isUnlimited ? 100 : limit > 0 ? (used / limit) * 100 : 0;
                      
                      return (
                        <div key={`${name}-${index}`} className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{name}</h4>
                              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                            </div>
                            <span className="text-xs font-semibold text-slate-700 mt-0.5">
                              {used} / {isUnlimited ? '∞' : limit}
                            </span>
                          </div>
                          
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${Math.min(100, percent)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Info Note Banner */}
                <div className="flex items-start gap-3 rounded-xl bg-indigo-50/50 p-4 border border-indigo-50">
                  <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed text-indigo-700/90 font-medium">
                    Mức giới hạn sử dụng sẽ được làm mới vào ngày đầu tiên của mỗi tháng. Để có thêm lượt sử dụng, vui lòng nâng cấp lên gói Pro.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: CTA Pro Upgrade & Support */}
            <div className="lg:col-span-5 space-y-6">
              {/* Pro Promotion Card */}
              <div className="rounded-2xl bg-[#0f6b3e] text-white p-6 shadow-md flex flex-col justify-between min-h-[310px] relative overflow-hidden">
                <div className="space-y-4">
                  <div>
                    <span className="inline-block bg-amber-500 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md">
                      FIT HIRE PRO
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-tight leading-snug">
                    Mở khóa sức mạnh<br />tối đa của AI
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

                <div className="pt-6 space-y-2 text-center">
                  <button 
                    onClick={() => navigate('/user/pricing')}
                    className="w-full py-3 bg-white text-[#0f6b3e] font-bold text-sm rounded-xl hover:bg-emerald-50 transition-colors shadow-sm cursor-pointer"
                  >
                    Nâng cấp ngay
                  </button>
                  <p className="text-[11px] text-emerald-100/90 font-medium">
                    Chỉ từ 199.000đ / tháng
                  </p>
                </div>
              </div>

              {/* Support Card */}
              <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="h-36 overflow-hidden">
                  <img 
                    src="/images/hero-dashboard.png" 
                    alt="Dashboard support illustration" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">Cần hỗ trợ?</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Chúng tôi luôn sẵn sàng giải đáp thắc mắc về gói dịch vụ của bạn.
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => navigate('/user/questions')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      Liên hệ tư vấn <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section: Transaction History */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Lịch sử giao dịch</h3>
            
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              {payments.length === 0 ? (
                <div className="text-center py-10 text-sm text-slate-500">
                  Chưa có lịch sử giao dịch thanh toán.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-50 bg-slate-50/50">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Ngày</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Loại dịch vụ</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Trạng thái</th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Số tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {payments.map((p) => {
                        const isSuccess = p.status === 'SUCCESS';
                        const isFreeItem = p.amount === 0;
                        
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/20 transition-colors">
                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                              {formatDate(p.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-900 font-bold">
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
                            <td className="px-6 py-4 text-right text-sm text-slate-900 font-bold">
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
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
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
