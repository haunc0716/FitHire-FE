import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileSearch, HeartHandshake, Mic2, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchMyEntitlements, fetchMyProfile } from '../services/userApi';

const quickActions = [
  { label: 'Chấm CV theo JD', to: '/user/cv-jd', icon: FileSearch },
  { label: 'Mock Interview', to: '/user/mock-interview', icon: Mic2 },
  { label: 'Cultural Fit', to: '/user/cultural-fit', icon: HeartHandshake },
  { label: 'Upload CV mới', to: '/user/cv-upload', icon: Upload },
];

export default function UserDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [entitlements, setEntitlements] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    Promise.allSettled([fetchMyProfile(), fetchMyEntitlements()]).then(([profileResult, entitlementResult]) => {
      if (!mounted) return;
      if (profileResult.status === 'fulfilled') {
        setProfile(profileResult.value);
      }
      if (entitlementResult.status === 'fulfilled') {
        setEntitlements(entitlementResult.value?.features ?? []);
      }
      if (profileResult.status === 'rejected' && entitlementResult.status === 'rejected') {
        setError('Không tải được dữ liệu dashboard. Vui lòng thử lại.');
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const greeting = useMemo(() => profile?.fullName?.split(' ')?.slice(-1)?.[0] || 'bạn', [profile]);

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-emerald-100/70 bg-white/70 p-6 shadow-[0_16px_60px_rgba(16,185,129,0.08)] lg:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-emerald-700/75">Career Operating System</p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-emerald-950 lg:text-4xl">
              Chào {greeting}, cùng nâng cấp CV và khả năng phỏng vấn mỗi ngày.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-emerald-900/70">
              Đây là bảng điều khiển cá nhân với lộ trình rõ ràng: upload CV, chấm theo JD, luyện phỏng vấn và theo dõi độ phù hợp văn hóa doanh nghiệp.
            </p>
          </div>
          <Link to="/user/cv-jd" className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">
            Bắt đầu chấm CV
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((item, idx) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
            <Link to={item.to} className="block rounded-2xl border border-emerald-100 bg-white/75 p-4 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(52,211,153,0.18)]">
              <div className="mb-3 inline-flex rounded-xl bg-emerald-100 p-2 text-emerald-700">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="font-semibold text-emerald-950">{item.label}</p>
            </Link>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-emerald-100 bg-white/75 p-6">
          <h2 className="font-display text-xl font-semibold text-emerald-950">Quota dịch vụ hiện tại</h2>
          <p className="mt-2 text-sm text-emerald-900/70">Theo dõi lượt còn lại để ưu tiên các hoạt động quan trọng.</p>
          <div className="mt-4 space-y-3">
            {(entitlements.length > 0 ? entitlements : [
              { featureCode: 'CV_ANALYSIS', used: 2, limit: 10 },
              { featureCode: 'MOCK_INTERVIEW', used: 1, limit: 5 },
            ]).map((item) => {
              const used = Number(item.used ?? 0);
              const limit = Number(item.limit ?? 1);
              const pct = Math.min(100, Math.round((used / Math.max(limit, 1)) * 100));
              return (
                <div key={item.featureCode}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-emerald-900">{item.featureCode}</span>
                    <span className="text-emerald-700/80">{used}/{limit}</span>
                  </div>
                  <div className="h-2 rounded-full bg-emerald-100">
                    <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white/75 p-6">
          <h2 className="font-display text-xl font-semibold text-emerald-950">Lộ trình gợi ý hôm nay</h2>
          <ol className="mt-4 space-y-3 text-sm text-emerald-900/80">
            <li>1. Upload CV bản mới nhất và chuẩn hóa headline nghề nghiệp.</li>
            <li>2. Chấm CV theo JD mục tiêu để nhận điểm và khoảng cách kỹ năng.</li>
            <li>3. Thực hành 1 phiên mock interview theo cấp độ mong muốn.</li>
            <li>4. Cập nhật hồ sơ cá nhân để tăng độ tin cậy khi ứng tuyển.</li>
          </ol>
        </div>
      </section>

      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}
