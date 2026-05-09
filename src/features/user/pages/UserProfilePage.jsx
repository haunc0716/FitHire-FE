import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Image as ImageIcon, ShieldCheck, CheckCircle2, AlertCircle, Camera } from 'lucide-react';
import { fetchMyProfile, updateMyProfile } from '../services/userApi';

export default function UserProfilePage() {
  const [form, setForm] = useState({ fullName: '', email: '', avatarUrl: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchMyProfile()
      .then((data) => {
        setForm({
          fullName: data?.fullName || '',
          email: data?.email || '',
          avatarUrl: data?.avatarUrl || '',
        });
      })
      .catch((err) => setError(err?.message || 'Không thể tải hồ sơ.'))
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    setLoading(true);

    try {
      const updated = await updateMyProfile({ fullName: form.fullName, avatarUrl: form.avatarUrl });
      setForm((prev) => ({ ...prev, fullName: updated?.fullName || prev.fullName, avatarUrl: updated?.avatarUrl || prev.avatarUrl }));
      setStatus('Cập nhật hồ sơ thành công.');
      // Auto clear status after 3s
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setError(err?.message || 'Cập nhật hồ sơ thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] overflow-hidden font-body">
      
      {/* Background Bubbles */}
      <div className="absolute top-0 left-0 h-[500px] w-[500px] -translate-x-1/3 -translate-y-1/4 rounded-full bg-emerald-200/40 blur-[120px] z-0 pointer-events-none" />
      <div className="absolute top-40 right-0 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-indigo-200/30 blur-[100px] z-0 pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900 font-display">Cài đặt tài khoản</h1>
          <p className="text-stone-500 mt-1 text-sm">Quản lý thông tin cá nhân và cài đặt bảo mật của bạn.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Avatar & Summary Card */}
          <div className="w-full lg:w-1/3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 flex flex-col items-center text-center"
            >
              <div className="relative mb-4 group cursor-pointer">
                <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-emerald-100 bg-stone-100 flex items-center justify-center">
                  {form.avatarUrl ? (
                    <img src={form.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-stone-300" />
                  )}
                </div>
                <div className="absolute inset-0 bg-stone-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <h2 className="text-lg font-bold text-stone-900">
                {fetching ? 'Đang tải...' : (form.fullName || 'Người dùng FitHire')}
              </h2>
              <p className="text-sm text-stone-500 mt-1 flex items-center gap-1.5 justify-center">
                <Mail className="h-3.5 w-3.5" />
                {fetching ? 'Đang tải...' : form.email}
              </p>

              <div className="w-full h-px bg-stone-100 my-6"></div>

              <div className="w-full flex items-center justify-between text-sm">
                <span className="text-stone-500">Trạng thái</span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full">
                  <ShieldCheck className="h-4 w-4" /> Đã xác thực
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Settings Form */}
          <div className="w-full lg:w-2/3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
            >
              <div className="border-b border-stone-100 p-6">
                <h3 className="text-base font-bold text-stone-900">Thông tin cá nhân</h3>
                <p className="text-sm text-stone-500 mt-1">Cập nhật thông tin cơ bản để hiển thị trên hệ thống.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Họ và tên</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input 
                      type="text"
                      required
                      placeholder="Nhập họ và tên của bạn"
                      value={form.fullName}
                      onChange={(e) => setForm(p => ({ ...p, fullName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow bg-white"
                    />
                  </div>
                </div>

                {/* Email (Disabled) */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Email đăng nhập</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <input 
                      type="email"
                      disabled
                      value={form.email}
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-stone-500 mt-1.5">Email này được dùng để đăng nhập và không thể thay đổi.</p>
                </div>


                {/* Status Messages */}
                {status && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-100">
                    <CheckCircle2 className="h-5 w-5" />
                    {status}
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-100">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end border-t border-stone-100">
                  <button 
                    type="submit" 
                    disabled={loading || fetching}
                    className="flex items-center gap-2 bg-[#00b14f] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#009b45] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
