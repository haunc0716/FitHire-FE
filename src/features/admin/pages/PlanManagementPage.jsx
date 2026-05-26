import React, { useEffect, useMemo, useState } from 'react';
import { Package, Plus, Check, Edit2, Trash2, X, CreditCard, Layout, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createAdminSubscription,
  deleteAdminSubscription,
  getAdminSubscriptions,
  updateAdminSubscription,
  getAdminFeatureOptions,
} from '../services/subscriptionApi';
import { useToast } from '../../../components/ui/ToastProvider';

const emptyFormState = {
  code: '',
  name: '',
  description: '',
  price: 0,
  introPrice: '',
  introDurationMonths: '',
  currency: 'VND',
  billingType: 'RECURRING',
  durationDays: 30,
  status: 'ACTIVE',
  displayOrder: 0,
  badgeLabel: '',
  highlighted: false,
  features: [],
};

const createEmptyFeature = () => ({
  featureCode: '',
  featureName: '',
  displayLimit: '',
  featureDescription: '',
  unlimited: false,
});

function normalizeFeature(feature) {
  if (!feature) return createEmptyFeature();
  return {
    featureCode: feature.featureCode ?? feature.featureKey ?? '',
    featureName: feature.featureName ?? '',
    displayLimit: feature.displayLimit ?? '',
    featureDescription: feature.featureDescription ?? '',
    unlimited: Boolean(feature.unlimited),
  };
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

function buildFeatureParts(feature) {
  if (!feature?.featureName) return null;

  if (feature.unlimited) {
    return {
      featureName: feature.featureName,
      featureDetail: 'không giới hạn',
    };
  }

  const limitText = toVietnamesePeriod(feature.displayLimit);
  const featureDetail = feature.featureDescription
    ? `${limitText} · ${feature.featureDescription}`
    : limitText;

  return {
    featureName: feature.featureName,
    featureDetail,
  };
}

function formatPrice(value, currency) {
  if (value === null || value === undefined) return '-';
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return String(value);
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency || 'VND',
    maximumFractionDigits: 0,
  }).format(numericValue);
}

function resolveIntervalLabel({ billingType, durationDays }) {
  if (billingType === 'FREE') return 'vĩnh viễn';
  if (billingType === 'PAY_PER_USE') return 'mỗi lượt';
  if (durationDays) return `${durationDays} ngày`;
  return 'định kỳ';
}

function normalizeSubscription(subscription) {
  return {
    id: subscription.id,
    name: subscription.name,
    price: formatPrice(subscription.price, subscription.currency),
    interval: resolveIntervalLabel(subscription),
    status: subscription.status ?? 'UNKNOWN',
    description: subscription.description ?? '',
    badgeLabel: subscription.badgeLabel ?? '',
    highlighted: Boolean(subscription.highlighted),
    features: Array.isArray(subscription.features) ? subscription.features.map(normalizeFeature) : [],
    raw: subscription,
  };
}

export default function PlanManagementPage() {
  const { showToast } = useToast();
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formState, setFormState] = useState(emptyFormState);
  const [featureOptions, setFeatureOptions] = useState([]);

  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => {
      const orderA = a.raw?.displayOrder ?? 0;
      const orderB = b.raw?.displayOrder ?? 0;
      return orderA - orderB;
    });
  }, [plans]);

  const getPlanAccent = (plan) => {
    if (plan.raw?.code === 'PRO') return 'from-emerald-600 via-teal-700 to-emerald-900';
    if (plan.raw?.code === 'PLUS') return 'from-emerald-50 via-white to-white';
    if (plan.raw?.code === 'LUOT_LE') return 'from-amber-50 via-white to-white';
    return 'from-stone-50 via-white to-white';
  };

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const [planData, optionData] = await Promise.all([
        getAdminSubscriptions(),
        getAdminFeatureOptions(),
      ]);
      setPlans(Array.isArray(planData) ? planData.map(normalizeSubscription) : []);
      setFeatureOptions(Array.isArray(optionData) ? optionData : []);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Không thể tải dữ liệu gói dịch vụ',
        message: error?.message || 'Vui lòng thử lại sau.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormState(emptyFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (plan) => {
    const raw = plan.raw || {};
    setEditingPlan(plan);
    setFormState({
      code: raw.code ?? '',
      name: raw.name ?? '',
      description: raw.description ?? '',
      price: raw.price ?? 0,
      introPrice: raw.introPrice ?? '',
      introDurationMonths: raw.introDurationMonths ?? '',
      currency: raw.currency ?? 'VND',
      billingType: raw.billingType ?? 'RECURRING',
      durationDays: raw.durationDays ?? 30,
      status: raw.status ?? 'ACTIVE',
      displayOrder: raw.displayOrder ?? 0,
      badgeLabel: raw.badgeLabel ?? '',
      highlighted: Boolean(raw.highlighted),
      features: Array.isArray(raw.features) ? raw.features.map(normalizeFeature) : [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
  };

  const handleDelete = async (plan) => {
    if (!plan?.id) return;
    if (!window.confirm(`Bạn chắc chắn muốn xóa gói "${plan.name}"?`)) return;
    
    try {
      await deleteAdminSubscription(plan.id);
      await fetchSubscriptions();
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Xóa gói thất bại',
        message: error?.message || 'Vui lòng thử lại sau.'
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...formState,
        price: Number(formState.price),
        introPrice: formState.introPrice === '' ? null : Number(formState.introPrice),
        introDurationMonths: formState.introDurationMonths === '' ? null : Number(formState.introDurationMonths),
        durationDays: Number(formState.durationDays),
        displayOrder: Number(formState.displayOrder),
        features: (formState.features ?? [])
          .map((feature) => ({
            featureCode: feature.featureCode || null,
            displayLimit: feature.displayLimit?.trim(),
            featureDescription: feature.featureDescription?.trim(),
            unlimited: Boolean(feature.unlimited),
          }))
          .filter((feature) => feature.featureCode),
      };

      if (editingPlan?.id) {
        await updateAdminSubscription(editingPlan.id, payload);
      } else {
        await createAdminSubscription(payload);
      }
      setIsModalOpen(false);
      showToast({
        type: 'success',
        title: 'Lưu thành công',
        message: 'Gói dịch vụ đã được cập nhật.'
      });
      await fetchSubscriptions();
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Không thể lưu gói',
        message: error?.message || 'Vui lòng thử lại sau.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Quản lý Gói dịch vụ</h1>
          <p className="text-stone-500 mt-1 font-medium">Thiết lập bảng giá, quyền hạn và các gói ưu đãi cho người dùng.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#00b14f] text-white font-bold rounded-2xl hover:bg-[#009b45] transition-all shadow-lg shadow-emerald-100 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Tạo gói mới
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[420px] bg-stone-50 rounded-[32px] animate-pulse border border-stone-100" />
          ))
        ) : (
          sortedPlans.map((plan) => {
            const accent = getPlanAccent(plan);
            const isPro = plan.raw?.code === 'PRO';
            const isCurrentStyle = plan.highlighted || isPro;

            return (
              <motion.div
                layout
                key={plan.id}
                className={`relative flex h-full flex-col overflow-hidden rounded-[32px] border transition-all duration-500 group ${
                  isCurrentStyle ? 'border-emerald-500 shadow-xl shadow-emerald-50' : 'border-stone-100 hover:border-stone-200'
                }`}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent}`} />
                {plan.highlighted && (
                  <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg">
                    {plan.badgeLabel || 'Phổ biến'}
                  </div>
                )}

                <div className="relative z-10 flex flex-1 flex-col p-8">
                  <div className="mb-8 flex items-start justify-between gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      isCurrentStyle ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-stone-50 text-stone-400'
                    }`}>
                      <Package className="w-7 h-7" />
                    </div>
                    <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => openEditModal(plan)}
                        className="rounded-xl p-2 text-stone-400 transition-all hover:bg-emerald-50 hover:text-emerald-600"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan)}
                        className="rounded-xl p-2 text-stone-400 transition-all hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className={`text-2xl font-bold tracking-tight ${isPro ? 'text-white' : 'text-stone-900'}`}>{plan.name}</h3>
                    <p className={`mt-2 text-sm leading-relaxed ${isPro ? 'text-emerald-100/80' : 'text-stone-500'}`}>
                      {plan.description || 'Gói dịch vụ cao cấp tối ưu trải nghiệm.'}
                    </p>
                  </div>

                  <div className="mb-1 flex items-baseline gap-1">
                    <span className={`text-4xl font-black leading-none tracking-tighter ${isPro ? 'text-white' : 'text-stone-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm font-bold ${isPro ? 'text-emerald-200/80' : 'text-stone-400'}`}>/{plan.interval}</span>
                  </div>

                  <div className="mt-5 border-t border-white/30 pt-5">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isPro ? 'text-emerald-100/80' : 'text-stone-400'}`}>
                      Quyền lợi gói
                    </p>
                    {plan.features?.length ? (
                      <ul className="mt-4 space-y-3 flex-grow mb-1">
                        {plan.features.map((feature, idx) => {
                          const parts = buildFeatureParts(feature);
                          if (!parts) return null;
                          return (
                            <li
                              key={`${plan.code ?? plan.id}-feat-${idx}`}
                              className={`flex items-start gap-2.5 text-[13px] leading-snug ${isPro ? 'text-emerald-100' : 'text-stone-700'}`}
                            >
                              <span className="mt-0.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-50">
                                <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} />
                              </span>
                              <span>
                                <strong className="font-semibold">{parts.featureName}</strong>
                                {parts.featureDetail && <span className="font-normal">: {parts.featureDetail}</span>}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="mt-4 flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                        <p className={`text-sm leading-relaxed font-medium ${isPro ? 'text-emerald-50' : 'text-stone-600'}`}>
                          {plan.description || 'Gói dịch vụ cao cấp tối ưu trải nghiệm.'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-8">
                    <span className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      plan.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {plan.status}
                    </span>
                    <span className={`text-[10px] font-bold ${isPro ? 'text-emerald-100/80' : 'text-stone-400'}`}>
                      Order: {plan.raw?.displayOrder ?? 0}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Redesigned Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl shadow-stone-900/20 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-stone-50/50 px-10 py-8 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-stone-100 flex items-center justify-center text-emerald-500">
                    {editingPlan ? <Edit2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                      {editingPlan ? 'Cập nhật gói dịch vụ' : 'Thiết lập gói mới'}
                    </h2>
                    <p className="text-stone-400 font-medium text-sm">Cấu hình thông số kỹ thuật và hiển thị cho gói cước.</p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-3 hover:bg-stone-100 rounded-2xl transition-colors text-stone-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-10 py-8 max-h-[65vh] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  
                  {/* Section: Thông tin định danh */}
                  <div className="md:col-span-1 space-y-1">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-2">
                      <Layout className="w-4 h-4 text-emerald-500" />
                      Thông tin cơ bản
                    </h3>
                    <p className="text-xs text-stone-400 font-medium leading-relaxed">
                      Mã code là duy nhất và dùng để định danh gói trong hệ thống Backend.
                    </p>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-2 block">Mã gói (Code)</label>
                      <input
                        value={formState.code}
                        onChange={handleChange('code')}
                        className="w-full bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl px-5 py-3.5 text-stone-900 font-bold transition-all outline-none"
                        placeholder="VD: PRO_YEARLY"
                        disabled={!!editingPlan}
                      />
                    </div>
                    <div className="group">
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-2 block">Tên hiển thị</label>
                      <input
                        value={formState.name}
                        onChange={handleChange('name')}
                        className="w-full bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl px-5 py-3.5 text-stone-900 font-bold transition-all outline-none"
                        placeholder="VD: Premium Pro"
                      />
                    </div>
                  </div>

                  {/* Section: Giá cả & Chu kỳ */}
                  <div className="md:col-span-1 space-y-1 border-t border-stone-50 pt-8">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      Giá & Chu kỳ
                    </h3>
                    <p className="text-xs text-stone-400 font-medium leading-relaxed">
                      Thiết lập giá gốc, tiền tệ và khoảng thời gian gia hạn.
                    </p>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-stone-50 pt-8">
                    <div>
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-2 block">Giá gói</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formState.price}
                          onChange={handleChange('price')}
                          className="w-full bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl px-5 py-3.5 text-stone-900 font-black transition-all outline-none pl-12"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">₫</div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-2 block">Tiền tệ</label>
                      <input
                        value={formState.currency}
                        onChange={handleChange('currency')}
                        className="w-full bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl px-5 py-3.5 text-stone-900 font-bold transition-all outline-none"
                        placeholder="VND"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-2 block">Hình thức thanh toán</label>
                      <select
                        value={formState.billingType}
                        onChange={handleChange('billingType')}
                        className="w-full bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl px-5 py-3.5 text-stone-900 font-bold transition-all outline-none appearance-none"
                      >
                        <option value="RECURRING">Định kỳ (Recurring)</option>
                        <option value="FREE">Miễn phí (Free)</option>
                        <option value="PAY_PER_USE">Theo lượt (Pay per use)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-2 block">Thời hạn (ngày)</label>
                      <input
                        type="number"
                        value={formState.durationDays}
                        onChange={handleChange('durationDays')}
                        className="w-full bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl px-5 py-3.5 text-stone-900 font-bold transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Section: Hiển thị & Trạng thái */}
                  <div className="md:col-span-1 space-y-1 border-t border-stone-50 pt-8">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      Hiển thị & Ưu đãi
                    </h3>
                    <p className="text-xs text-stone-400 font-medium leading-relaxed">
                      Quản lý thứ tự hiển thị và các nhãn khuyến mãi đặc biệt.
                    </p>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-stone-50 pt-8">
                    <div>
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-2 block">Trạng thái</label>
                      <select
                        value={formState.status}
                        onChange={handleChange('status')}
                        className="w-full bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl px-5 py-3.5 text-stone-900 font-bold transition-all outline-none appearance-none"
                      >
                        <option value="ACTIVE">Kích hoạt (Active)</option>
                        <option value="INACTIVE">Tạm ẩn (Inactive)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-2 block">Thứ tự hiển thị</label>
                      <input
                        type="number"
                        value={formState.displayOrder}
                        onChange={handleChange('displayOrder')}
                        className="w-full bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl px-5 py-3.5 text-stone-900 font-bold transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-2 block">Nhãn (Badge)</label>
                      <input
                        value={formState.badgeLabel}
                        onChange={handleChange('badgeLabel')}
                        className="w-full bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl px-5 py-3.5 text-stone-900 font-bold transition-all outline-none"
                        placeholder="VD: Phổ biến nhất"
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-8 bg-stone-50 p-4 rounded-2xl cursor-pointer" onClick={() => handleChange('highlighted')({target: {type: 'checkbox', checked: !formState.highlighted}})}>
                      <input
                        type="checkbox"
                        checked={formState.highlighted}
                        onChange={handleChange('highlighted')}
                        className="h-6 w-6 rounded-lg border-stone-200 text-emerald-500 focus:ring-emerald-500/20 transition-all"
                      />
                      <span className="text-sm font-bold text-stone-700">Làm nổi bật gói này</span>
                    </div>
                  </div>

                  {/* Section: Tính năng */}
                  <div className="md:col-span-3 border-t border-stone-50 pt-8">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-3 block">Tính năng hiển thị cho user</label>
                        <p className="text-xs text-stone-400 font-medium ml-1">Nội dung ở đây sẽ hiện y chang trên trang bảng giá của user.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormState((prev) => ({ ...prev, features: [...(prev.features ?? []), createEmptyFeature()] }))}
                        className="rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
                      >
                        Thêm tính năng
                      </button>
                    </div>
                    <div className="space-y-4">
                      {(formState.features ?? []).map((feature, index) => (
                        <div key={`feature-${index}`} className="rounded-[24px] border border-stone-100 bg-stone-50/70 p-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="md:col-span-2">
                              <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-stone-400">Mã tính năng (Feature Code)</label>
                              <select
                                value={feature.featureCode}
                                onChange={(e) => setFormState((prev) => {
                                  const next = [...(prev.features ?? [])];
                                  const selected = featureOptions.find((item) => item.code === e.target.value);
                                  next[index] = {
                                    ...next[index],
                                    featureCode: e.target.value,
                                    featureName: selected?.name ?? next[index].featureName,
                                    featureDescription: next[index].featureDescription || selected?.description || '',
                                  };
                                  return { ...prev, features: next };
                                })}
                                className="w-full rounded-2xl border-2 border-transparent bg-white px-5 py-3.5 font-medium text-stone-900 outline-none transition-all focus:border-emerald-500"
                              >
                                <option value="">Chọn feature code</option>
                                {featureOptions.map((option) => (
                                  <option key={option.code} value={option.code}>
                                    {option.code} - {option.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-stone-400">Giới hạn hiển thị</label>
                              <input
                                value={feature.displayLimit}
                                onChange={(e) => setFormState((prev) => {
                                  const next = [...(prev.features ?? [])];
                                  next[index] = { ...next[index], displayLimit: e.target.value };
                                  return { ...prev, features: next };
                                })}
                                className="w-full rounded-2xl border-2 border-transparent bg-white px-5 py-3.5 font-medium text-stone-900 outline-none transition-all focus:border-emerald-500"
                                placeholder="VD: 3/tháng"
                              />
                            </div>
                            <div className="flex items-end">
                              <label className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-sm font-bold text-stone-700">
                                <input
                                  type="checkbox"
                                  checked={feature.unlimited}
                                  onChange={(e) => setFormState((prev) => {
                                    const next = [...(prev.features ?? [])];
                                    next[index] = { ...next[index], unlimited: e.target.checked };
                                    return { ...prev, features: next };
                                  })}
                                  className="h-5 w-5 rounded border-stone-200 text-emerald-500 focus:ring-emerald-500/20"
                                />
                                Không giới hạn
                              </label>
                            </div>
                            <div className="md:col-span-4 flex items-center gap-3">
                              <input
                                value={feature.featureDescription}
                                onChange={(e) => setFormState((prev) => {
                                  const next = [...(prev.features ?? [])];
                                  next[index] = { ...next[index], featureDescription: e.target.value };
                                  return { ...prev, features: next };
                                })}
                                className="w-full rounded-2xl border-2 border-transparent bg-white px-5 py-3.5 font-medium text-stone-900 outline-none transition-all focus:border-emerald-500"
                                placeholder="VD: Đánh giá CV và gợi ý cải thiện"
                              />
                              <button
                                type="button"
                                onClick={() => setFormState((prev) => ({
                                  ...prev,
                                  features: (prev.features ?? []).filter((_, i) => i !== index),
                                }))}
                                className="rounded-xl bg-red-50 px-4 py-3 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section: Mô tả */}
                  <div className="md:col-span-3 border-t border-stone-50 pt-8">
                    <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-3 block">Mô tả quyền lợi (Description)</label>
                    <textarea
                      value={formState.description}
                      onChange={handleChange('description')}
                      rows={3}
                      className="w-full bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-[24px] px-6 py-4 text-stone-900 font-medium transition-all outline-none leading-relaxed"
                      placeholder="Mô tả các tính năng người dùng sẽ nhận được khi đăng ký gói này..."
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-10 py-8 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-6">
                <button
                  onClick={closeModal}
                  className="text-sm font-bold text-stone-400 hover:text-stone-900 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-10 py-4 bg-[#00b14f] text-white font-black rounded-2xl hover:bg-[#009b45] transition-all shadow-xl shadow-emerald-200 disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : <Check className="w-5 h-5" />}
                  {editingPlan ? 'Lưu thay đổi' : 'Tạo gói ngay'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
