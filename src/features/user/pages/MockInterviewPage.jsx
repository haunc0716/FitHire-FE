import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic2, Sparkles, CheckCircle2, Video, Target, ArrowRight } from 'lucide-react';
import { generateMockInterviewPlan } from '../services/userFeatureAdapters';

export default function MockInterviewPage() {
  const [role, setRole] = useState('Frontend Developer');
  const [level, setLevel] = useState('Middle');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await generateMockInterviewPlan({ role, level });
      setPlan(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
      
      {/* Background Bubbles */}
      <div className="absolute top-0 left-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-emerald-200/40 blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-40 right-0 h-[300px] w-[300px] translate-x-1/3 rounded-full bg-indigo-200/40 blur-[80px] -z-10 pointer-events-none" />

      {/* 1. Header */}
      <div className="relative z-10 flex flex-col gap-3 pb-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Luyện tập Phỏng vấn (Mock Interview)
        </h1>
        <p className="text-base text-slate-500 max-w-2xl leading-relaxed">
          Trải nghiệm phỏng vấn mô phỏng với AI Mentor. Chọn vị trí và cấp độ để hệ thống tự động tạo ra một kịch bản phỏng vấn bám sát thực tế nhất.
        </p>
      </div>

      {/* 2. Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleGenerate} className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4">Cấu hình phiên phỏng vấn</h2>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Vị trí ứng tuyển (Role)</label>
              <input 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                required
                placeholder="VD: Frontend Developer, Product Manager..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Cấp độ mục tiêu (Level)</label>
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)} 
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              >
                <option>Intern</option>
                <option>Fresher</option>
                <option>Junior</option>
                <option>Middle</option>
                <option>Senior</option>
              </select>
            </div>

            <div className="mt-2 flex flex-col gap-3 border-t border-slate-100 pt-6">
              <p className="text-xs text-slate-500">
                Tiêu hao <strong className="text-slate-900">1 lượt Mock Interview</strong>.
              </p>
              <button 
                type="submit" 
                disabled={loading}
                className="group flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? 'Đang khởi tạo...' : 'Tạo lộ trình phỏng vấn'}
                {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Visual/Status */}
        <div className="lg:col-span-7">
          {!plan ? (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 shadow-sm">
                <Video className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Sẵn sàng đối thoại</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
                Hệ thống AI sẽ đóng vai trò là Technical/HR Manager để đặt câu hỏi trực tiếp, giúp bạn luyện phản xạ trả lời mượt mà nhất.
              </p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between border-b border-indigo-100 pb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-700 mb-3">
                    <CheckCircle2 className="h-4 w-4" /> Kịch bản sẵn sàng
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Phiên: {plan.role}</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">Cấp độ {plan.level}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-sm">
                  <Mic2 className="h-6 w-6" />
                </div>
              </div>

              <div className="mb-6 flex items-start gap-3 rounded-xl bg-white p-4 border border-indigo-50 shadow-sm">
                <Sparkles className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  <strong className="text-slate-900">Mẹo từ Mentor:</strong> Hãy chuẩn bị sẵn giấy bút. Ghi âm mỗi phiên luyện tập để tự đánh giá lại tốc độ nói, âm lượng và độ tự tin của bản thân.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <Target className="h-4 w-4 text-slate-400" /> Các giai đoạn phỏng vấn
                </h3>
                <div className="space-y-3">
                  {plan.stages.map((stage, idx) => (
                    <div key={idx} className="flex gap-4 rounded-xl border border-slate-100 bg-white p-4 transition-colors hover:border-indigo-200">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-medium text-slate-700">{stage}</p>
                    </div>
                  ))}
                </div>
                
                <button className="mt-8 w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors">
                  Bắt đầu phỏng vấn ngay
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
