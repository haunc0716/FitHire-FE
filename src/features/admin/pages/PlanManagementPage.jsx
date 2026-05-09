import React, { useEffect, useMemo, useState } from 'react';
import { Package, Plus, MoreVertical, Check, Edit2, Trash2, X, Info, CreditCard, Layout, Star, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createAdminSubscription,
  deleteAdminSubscription,
  getAdminSubscriptions,
  updateAdminSubscription,
} from '../services/subscriptionApi';

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
};

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
    raw: subscription,
  };
}

export default function PlanManagementPage() {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formState, setFormState] = useState(emptyFormState);

  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => {
      const orderA = a.raw?.displayOrder ?? 0;
      const orderB = b.raw?.displayOrder ?? 0;
      return orderA - orderB;
    });
  }, [plans]);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await getAdminSubscriptions();
      setPlans(Array.isArray(data) ? data.map(normalizeSubscription) : []);
    } catch (error) {
      setErrorMessage(error?.message || 'Không thể tải danh sách gói.');
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
    setErrorMessage('');
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
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
  };

  const handleDelete = async (plan) => {
    if (!plan?.id) return;
    if (!window.confirm(`Bạn chắc chắn muốn xóa gói "${plan.name}"?`)) return;
    
    setErrorMessage('');
    try {
      await deleteAdminSubscription(plan.id);
      await fetchSubscriptions();
    } catch (error) {
      setErrorMessage(error?.message || 'Xóa gói không thành công.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');
    try {
      const payload = {
        ...formState,
        price: Number(formState.price),
        introPrice: formState.introPrice === '' ? null : Number(formState.introPrice),
        introDurationMonths: formState.introDurationMonths === '' ? null : Number(formState.introDurationMonths),
        durationDays: Number(formState.durationDays),
        displayOrder: Number(formState.displayOrder),
      };

      if (editingPlan?.id) {
        await updateAdminSubscription(editingPlan.id, payload);
      } else {
        await createAdminSubscription(payload);
      }
      setIsModalOpen(false);
      await fetchSubscriptions();
    } catch (error) {
      setErrorMessage(error?.message || 'Không thể lưu gói.');
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

      {errorMessage && (
        <div className="rounded-2xl border border-red-100 bg-red-50 text-red-600 px-6 py-4 text-sm font-semibold flex items-center gap-3">
          <Info className="w-5 h-5" />
          {errorMessage}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-[400px] bg-stone-50 rounded-[32px] animate-pulse border border-stone-100" />
          ))
        ) : (
          sortedPlans.map((plan) => (
            <motion.div 
              layout
              key={plan.id} 
              className={`bg-white rounded-[32px] border-2 transition-all group relative flex flex-col ${
                plan.highlighted ? 'border-emerald-500 shadow-xl shadow-emerald-50' : 'border-stone-100 hover:border-stone-200'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg z-10">
                  {plan.badgeLabel || 'Đề xuất'}
                </div>
              )}

              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    plan.highlighted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-stone-50 text-stone-400'
                  }`}>
                    <Package className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(plan)}
                      className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-stone-900 tracking-tight">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-4xl font-black text-stone-900 tracking-tighter">{plan.price}</span>
                    <span className="text-stone-400 font-bold text-sm">/{plan.interval}</span>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-stone-50">
                   <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Quyền lợi gói</p>
                   <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                      <p className="text-sm text-stone-600 leading-relaxed font-medium">
                        {plan.description || 'Gói dịch vụ cao cấp tối ưu trải nghiệm.'}
                      </p>
                   </div>
                </div>
              </div>

              <div className="px-8 py-6 bg-stone-50/50 rounded-b-[32px] flex justify-between items-center border-t border-stone-50">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                  plan.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'
                }`}>
                  {plan.status}
                </span>
                <span className="text-[10px] font-bold text-stone-400">Order: {plan.raw?.displayOrder ?? 0}</span>
              </div>
            </motion.div>
          ))
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
