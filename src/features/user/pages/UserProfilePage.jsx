import React, { useEffect, useState } from 'react';
import { fetchMyProfile, updateMyProfile } from '../services/userApi';

export default function UserProfilePage() {
  const [form, setForm] = useState({ fullName: '', email: '', avatarUrl: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyProfile()
      .then((data) => {
        setForm({
          fullName: data?.fullName || '',
          email: data?.email || '',
          avatarUrl: data?.avatarUrl || '',
        });
      })
      .catch((err) => setError(err?.message || 'Không thể tải hồ sơ.'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');

    try {
      const updated = await updateMyProfile({ fullName: form.fullName, avatarUrl: form.avatarUrl });
      setForm((prev) => ({ ...prev, fullName: updated?.fullName || prev.fullName, avatarUrl: updated?.avatarUrl || prev.avatarUrl }));
      setStatus('Cập nhật hồ sơ thành công.');
    } catch (err) {
      setError(err?.message || 'Cập nhật hồ sơ thất bại.');
    }
  };

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white/85 p-6 lg:max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-emerald-950">Hồ sơ cá nhân</h1>
      <p className="mt-2 text-sm text-emerald-900/70">Quản lý thông tin cá nhân để hệ thống đề xuất phù hợp hơn.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-emerald-900">Họ và tên</label>
          <input value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-300" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-emerald-900">Email</label>
          <input value={form.email} disabled className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-sm text-emerald-800/70" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-emerald-900">Avatar URL</label>
          <input value={form.avatarUrl} onChange={(e) => setForm((p) => ({ ...p, avatarUrl: e.target.value }))} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-300" />
        </div>
        <button className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Lưu thay đổi</button>
      </form>

      {status && <p className="mt-4 text-sm text-emerald-700">{status}</p>}
      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
    </section>
  );
}
