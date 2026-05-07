import React from 'react';
import {
  FileText,
  Video,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Flame,
  BrainCircuit,
  UserCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const mockData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 68 },
  { name: 'Wed', score: 75 },
  { name: 'Thu', score: 72 },
  { name: 'Fri', score: 85 },
  { name: 'Sat', score: 88 },
  { name: 'Sun', score: 92 },
];

export default function UserDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/50">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              3 Day Streak
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              Free Plan
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, Alex! 👋</h1>
          <p className="text-gray-500 mt-1">Your Fit Score has improved by 15% this week. Keep it up!</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link to="/user/cv-studio" className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-emerald-200 transition-all duration-300 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">Optimize CV</h3>
              <p className="text-sm text-gray-500 mt-1 mb-3">Phân tích & sửa lỗi CV theo JD công việc.</p>
              <span className="inline-flex items-center text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                Bắt đầu ngay <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>

        <Link to="/user/my-cv" className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              <UserCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">My Resumes</h3>
              <p className="text-sm text-gray-500 mt-1 mb-3">Quản lý và cập nhật bộ CV master của bạn.</p>
              <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                Quản lý CV <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>

        <Link to="/user/mock-interview" className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-purple-200 transition-all duration-300 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-purple-100/50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">Mock Interview</h3>
              <p className="text-sm text-gray-500 mt-1 mb-3">Luyện tập phỏng vấn với Recruiter AI.</p>
              <span className="inline-flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-700">
                Bắt đầu tập luyện <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Fit Score Trend</h2>
              <p className="text-sm text-gray-500">Your average match rate over the last 7 days.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">85<span className="text-lg text-gray-400">/100</span></span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                />
                <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Link to="/user/history" className="text-sm text-emerald-600 font-medium hover:text-emerald-700">View all</Link>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Frontend Developer CV</p>
                <p className="text-xs text-gray-500 mt-0.5">Matched with Shopee JD</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">92% Match</span>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">ReactJS Mock Interview</p>
                <p className="text-xs text-gray-500 mt-0.5">Completed 5 questions</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">8.5/10 Score</span>
                  <span className="text-xs text-gray-400">Yesterday</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Cultural Fit Test</p>
                <p className="text-xs text-gray-500 mt-0.5">Agile & Fast-paced Environment</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Completed</span>
                  <span className="text-xs text-gray-400">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
