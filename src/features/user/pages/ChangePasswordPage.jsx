import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/ui/ToastProvider';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      showToast({
        type: 'error',
        title: 'Thiếu thông tin',
        message: 'Vui lòng nhập đầy đủ thông tin mật khẩu.'
      });
      setLoading(false);
      return;
    }
    if (form.newPassword.length < 8) {
      showToast({
        type: 'warning',
        title: 'Mật khẩu quá ngắn',
        message: 'Mật khẩu mới cần tối thiểu 8 ký tự.'
      });
      setLoading(false);
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      showToast({
        type: 'error',
        title: 'Xác nhận không khớp',
        message: 'Mật khẩu xác nhận không khớp.'
      });
      setLoading(false);
      return;
    }

    showToast({
      type: 'success',
      title: 'Đã ghi nhận',
      message: 'Yêu cầu đổi mật khẩu đã được ghi nhận.'
    });
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] overflow-hidden font-body">
      <div className="absolute top-0 left-0 h-[500px] w-[500px] -translate-x-1/3 -translate-y-1/4 rounded-full bg-emerald-200/40 blur-[120px] z-0 pointer-events-none" />
      <div className="absolute top-40 right-0 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-indigo-200/30 blur-[100px] z-0 pointer-events-none" />

      <div className="relative z-10 max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 font-display tracking-tight">Đổi mật khẩu</h1>
            <p className="text-stone-500 mt-1 text-sm">Cập nhật mật khẩu để tăng bảo mật tài khoản.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/user/profile')}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-all relative after:content-[''] after:absolute after:left-6 after:-bottom-1 after:h-[2px] after:w-0 after:bg-emerald-400 after:transition-all after:duration-300 hover:after:w-[calc(100%-24px)]"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại hồ sơ
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-sky-50/80 via-indigo-50/70 to-cyan-50/80 rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-sky-200/40 blur-[22px]" />
          <div className="absolute -bottom-12 right-10 h-44 w-44 rounded-full bg-indigo-200/40 blur-[26px]" />

          <div className="relative border-b border-slate-200 p-6 bg-white/60 backdrop-blur-sm">
            <h3 className="text-base font-bold text-stone-900">Thông tin mật khẩu</h3>
            <p className="text-sm text-stone-500 mt-1">Nhập mật khẩu hiện tại và mật khẩu mới để cập nhật.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Mật khẩu hiện tại</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow bg-white"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end border-t border-stone-100">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#00b14f] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#009b45] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
