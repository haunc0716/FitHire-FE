import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileSearch,
  HeartHandshake,
  Mic2,
  TrendingUp,
  Target,
  CheckCircle2,
  Circle,
  ArrowRight,
  Clock,
  FileText,
  Star,
  Activity,
  History,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchMyEntitlements, fetchMyProfile } from '../services/userApi';

const actionCards = [
  { label: 'Phân tích CV', desc: 'So khớp JD mục tiêu', to: '/user/cv-jd', icon: FileSearch, color: 'text-emerald-600', bg: 'bg-emerald-50', hover: 'group-hover:bg-emerald-100' },
  { label: 'Mock Interview', desc: 'Luyện tập AI Mentor', to: '/user/mock-interview', icon: Mic2, color: 'text-indigo-600', bg: 'bg-indigo-50', hover: 'group-hover:bg-indigo-100' },
  { label: 'Cultural Fit', desc: 'Đánh giá văn hóa', to: '/user/cultural-fit', icon: HeartHandshake, color: 'text-rose-600', bg: 'bg-rose-50', hover: 'group-hover:bg-rose-100' },
];

const recentActivities = [
  { action: 'Phân tích CV: Frontend Developer', time: '2 giờ trước', score: '85/100', status: 'success' },
  { action: 'Mock Interview: React.js', time: 'Hôm qua', score: 'Khá', status: 'info' },
  { action: 'Cập nhật hồ sơ cá nhân', time: '3 ngày trước', score: null, status: 'neutral' },
  { action: 'Đánh giá Cultural Fit', time: 'Tuần trước', score: '90%', status: 'success' },
];

const aiInsights = [
  'Kỹ năng "TypeScript" xuất hiện nhiều trong các JD mục tiêu nhưng chưa có trong CV của bạn.',
  'Bạn thường trả lời vấp ở các câu hỏi về System Design trong Mock Interview.',
  'Độ phù hợp văn hóa của bạn cực kỳ tốt với các công ty Product-base.'
];

export default function UserDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [entitlements, setEntitlements] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([fetchMyProfile(), fetchMyEntitlements()]).then(([profileResult, entitlementResult]) => {
      if (!mounted) return;
      if (profileResult.status === 'fulfilled') setProfile(profileResult.value);
      if (entitlementResult.status === 'fulfilled') setEntitlements(entitlementResult.value?.features ?? []);
    });
    return () => { mounted = false; };
  }, []);

  const greeting = useMemo(() => profile?.fullName?.split(' ')?.slice(-1)?.[0] || 'bạn', [profile]);
  
  const quotaRows = entitlements.length > 0 ? entitlements : [
    { featureCode: 'CV Analysis', used: 7, limit: 10, color: 'bg-emerald-500' },
    { featureCode: 'Mock Interview', used: 2, limit: 5, color: 'bg-indigo-500' },
    { featureCode: 'Cultural Fit', used: 4, limit: 6, color: 'bg-rose-500' },
  ];

  return (
    <div className="relative mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
      
      {/* Background Bubbles */}
      <div className="absolute top-0 left-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-emerald-200/40 blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-40 right-0 h-[300px] w-[300px] translate-x-1/3 rounded-full bg-blue-200/40 blur-[80px] -z-10 pointer-events-none" />

      {/* 1. Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Chào buổi sáng, {greeting}.
          </h1>
          <p className="text-base text-slate-500 max-w-2xl leading-relaxed">
            Tổng quan hành trình phát triển sự nghiệp của bạn.
          </p>
        </div>
      </div>

      {/* 2. Quick Stats Grid - With subtle icon colors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Điểm sẵn sàng', value: '85%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'CV đã phân tích', value: '12', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Giờ phỏng vấn', value: '4.5h', icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Đánh giá kỹ năng', value: 'A-', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, idx) => (
          <div key={idx} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Action Cards - With subtle icon colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actionCards.map((item, idx) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <Link 
              to={item.to}
              className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 hover:shadow-md"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${item.bg} ${item.color} ${item.hover}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900">{item.label}</h3>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-slate-900" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 4. Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Lịch sử hoạt động */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <History className="h-4 w-4 text-slate-500" />
                Hoạt động gần đây
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                  {activity.score && (
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold tracking-wide ${
                      activity.status === 'success' ? 'bg-emerald-50 text-emerald-700' : 
                      activity.status === 'info' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {activity.score}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights - Colored block */}
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Phân tích chuyên sâu từ AI
            </h2>
            <div className="space-y-4">
              {aiInsights.map((insight, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                  <p className="text-sm text-slate-700 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col */}
        <div className="space-y-6">
          
          {/* Usage Stats */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                Tài nguyên dịch vụ
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {quotaRows.map((item) => {
                const pct = Math.min(100, Math.round((Number(item.used) / Math.max(Number(item.limit), 1)) * 100));
                return (
                  <div key={item.featureCode} className="px-6 py-5">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.featureCode}</span>
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {item.used} / {item.limit}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Goals Checklist */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">
            <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                Việc cần làm
              </h2>
            </div>
            <div className="p-6 space-y-5">
              {[
                { title: 'Cập nhật CV mới nhất', done: true },
                { title: 'Luyện 1 bài Mock Interview', done: false },
                { title: 'Xem báo cáo năng lực', done: false }
              ].map((task, i) => (
                <div key={i} className="group flex items-start gap-3 cursor-pointer">
                  {task.done ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0 mt-0.5" />
                  )}
                  <span className={`text-sm transition-colors ${task.done ? 'text-slate-400 line-through' : 'font-medium text-slate-700 group-hover:text-slate-900'}`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
