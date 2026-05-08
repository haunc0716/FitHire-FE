import React, { useEffect, useMemo, useState } from 'react';
import { Package, Plus, MoreVertical, Check, Edit2, Trash2 } from 'lucide-react';
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
  currency: 'USD',
  billingType: 'RECURRING',
  durationDays: 30,
  status: 'ACTIVE',
  displayOrder: 0,
  badgeLabel: '',
  highlighted: false,
};

function formatPrice(value, currency) {
  if (value === null || value === undefined) {
    return '-';
  }
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return String(value);
  }
  const safeCurrency = currency || 'USD';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: safeCurrency,
      maximumFractionDigits: 0,
    }).format(numericValue);
  } catch {
    return `${safeCurrency} ${numericValue}`;
  }
}

function resolveIntervalLabel({ billingType, durationDays }) {
  if (billingType === 'FREE') {
    return 'forever';
  }
  if (billingType === 'PAY_PER_USE') {
    return 'per use';
  }
  if (durationDays) {
    return `every ${durationDays} days`;
  }
  return 'recurring';
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
      currency: raw.currency ?? 'USD',
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
    if (isSaving) {
      return;
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (plan) => {
    if (!plan?.id) {
      return;
    }
    const confirmed = window.confirm(`Bạn chắc chắn muốn xóa gói "${plan.name}"?`);
    if (!confirmed) {
      return;
    }
    setErrorMessage('');
    try {
      await deleteAdminSubscription(plan.id);
      await fetchSubscriptions();
    } catch (error) {
      setErrorMessage(error?.message || 'Xóa gói không thành công.');
    }
  };

  const buildPayload = () => {
    const parsedPrice = Number(formState.price);
    const parsedIntroPrice = formState.introPrice === '' ? null : Number(formState.introPrice);
    const parsedIntroDuration = formState.introDurationMonths === '' ? null : Number(formState.introDurationMonths);
    const parsedDurationDays = Number(formState.durationDays);
    const parsedDisplayOrder = Number(formState.displayOrder);

    if (!formState.code.trim()) {
      throw new Error('Vui lòng nhập mã gói.');
    }
    if (!formState.name.trim()) {
      throw new Error('Vui lòng nhập tên gói.');
    }
    if (Number.isNaN(parsedPrice)) {
      throw new Error('Giá gói không hợp lệ.');
    }
    if (!formState.currency.trim()) {
      throw new Error('Vui lòng nhập mã tiền tệ.');
    }
    if (Number.isNaN(parsedDurationDays) || parsedDurationDays <= 0) {
      throw new Error('Thời hạn gói phải lớn hơn 0.');
    }
    if (Number.isNaN(parsedDisplayOrder) || parsedDisplayOrder < 0) {
      throw new Error('Thứ tự hiển thị không hợp lệ.');
    }

    return {
      code: formState.code.trim(),
      name: formState.name.trim(),
      description: formState.description.trim() || null,
      price: parsedPrice,
      introPrice: parsedIntroPrice,
      introDurationMonths: parsedIntroDuration,
      currency: formState.currency.trim(),
      billingType: formState.billingType,
      durationDays: parsedDurationDays,
      status: formState.status,
      displayOrder: parsedDisplayOrder,
      badgeLabel: formState.badgeLabel.trim() || null,
      highlighted: Boolean(formState.highlighted),
    };
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');
    try {
      const payload = buildPayload();
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
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plan Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create, update, and manage pricing tiers and feature access.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 flex items-center gap-2 bg-emerald-500 text-white text-sm font-medium rounded-xl hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200"
        >
          <Plus className="w-4 h-4" />
          Create New Plan
        </button>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-100 bg-red-50 text-red-600 px-4 py-3 text-sm">
          {errorMessage}
        </div>
      )}

      {isLoading && (
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500">
          Đang tải danh sách gói dịch vụ...
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {sortedPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden relative flex flex-col">
            {plan.highlighted && (
              <div className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider py-1 text-center w-full">
                {plan.badgeLabel || 'Highlighted'}
              </div>
            )}

            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(plan)}
                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500 mb-1">/{plan.interval}</span>
                </div>
              </div>

              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 mb-6">
                {plan.status}
              </span>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Description</p>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{plan.description || 'Không có mô tả.'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <span className="text-xs text-gray-500">Last updated: {plan.raw?.updatedAt ? new Date(plan.raw.updatedAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{editingPlan ? 'Update Plan' : 'Create New Plan'}</h2>
                <p className="text-xs text-gray-500">Điền thông tin theo yêu cầu của API admin.</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
                type="button"
              >
                Close
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Code</label>
                  <input
                    value={formState.code}
                    onChange={handleChange('code')}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    placeholder="FREE_TIER"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Name</label>
                  <input
                    value={formState.name}
                    onChange={handleChange('name')}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    placeholder="Premium Pro"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Price</label>
                  <input
                    type="number"
                    value={formState.price}
                    onChange={handleChange('price')}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Currency</label>
                  <input
                    value={formState.currency}
                    onChange={handleChange('currency')}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    placeholder="USD"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Billing Type</label>
                  <select
                    value={formState.billingType}
                    onChange={handleChange('billingType')}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="FREE">FREE</option>
                    <option value="RECURRING">RECURRING</option>
                    <option value="PAY_PER_USE">PAY_PER_USE</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Duration (days)</label>
                  <input
                    type="number"
                    value={formState.durationDays}
                    onChange={handleChange('durationDays')}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Status</label>
                  <select
                    value={formState.status}
                    onChange={handleChange('status')}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Display Order</label>
                  <input
                    type="number"
                    value={formState.displayOrder}
                    onChange={handleChange('displayOrder')}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Intro Price</label>
                  <input
                    type="number"
                    value={formState.introPrice}
                    onChange={handleChange('introPrice')}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Intro Duration (months)</label>
                  <input
                    type="number"
                    value={formState.introDurationMonths}
                    onChange={handleChange('introDurationMonths')}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Badge Label</label>
                  <input
                    value={formState.badgeLabel}
                    onChange={handleChange('badgeLabel')}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    placeholder="Most Popular"
                  />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    checked={formState.highlighted}
                    onChange={handleChange('highlighted')}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                  />
                  <span className="text-xs text-gray-600">Highlighted</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600">Description</label>
                <textarea
                  value={formState.description}
                  onChange={handleChange('description')}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Mô tả ngắn về gói dịch vụ"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-60"
                type="button"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
