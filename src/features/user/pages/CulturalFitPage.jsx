import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Sparkles, CheckCircle2, TrendingUp, Target, ArrowRight, Building2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { runCulturalFitScoring } from '../services/userFeatureAdapters';

const valueOptions = ['Ownership', 'Growth Mindset', 'Data-driven', 'Collaboration', 'Customer Centric', 'Agile', 'Innovation'];

export default function CulturalFitPage() {
  const [industry, setIndustry] = useState('');
  const [selectedValues, setSelectedValues] = useState(['Collaboration', 'Growth Mindset']);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleValue = (value) => {
    setSelectedValues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const onScore = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await runCulturalFitScoring({ companyValues: selectedValues, industry: industry || 'Chung' });
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
      
      {/* Background Bubbles */}
      <div className="absolute top-0 left-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-rose-200/40 blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-40 right-0 h-[300px] w-[300px] translate-x-1/3 rounded-full bg-emerald-200/40 blur-[80px] -z-10 pointer-events-none" />

      {/* 1. Header */}
      <div className="relative z-10 flex flex-col gap-3 pb-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Đánh giá Độ phù hợp Văn hóa (Cultural Fit)
        </h1>
        <p className="text-base text-slate-500 max-w-2xl leading-relaxed">
          Đánh giá mức độ tương thích giữa giá trị cốt lõi của bạn và môi trường doanh nghiệp. Từ đó tìm ra môi trường làm việc lý tưởng nhất.
        </p>
      </div>

      {/* 2. Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-5">
          <form onSubmit={onScore} className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4">Bộ thông số doanh nghiệp</h2>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Ngành nghề ứng tuyển</label>
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="VD: Công nghệ thông tin, Tài chính..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Giá trị cốt lõi ưu tiên (Chọn ít nhất 2)</label>
              <div className="flex flex-wrap gap-2">
                {valueOptions.map((value) => {
                  const active = selectedValues.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleValue(value)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        active 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-sm' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-6">
              <p className="text-xs text-slate-500">
                Tiêu hao <strong className="text-slate-900">1 lượt đánh giá</strong>.
              </p>
              <button 
                type="submit" 
                disabled={loading || selectedValues.length < 2}
                className="group flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang phân tích...' : 'Bắt đầu đánh giá'}
                {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Visual/Status */}
        <div className="lg:col-span-7">
          {!result ? (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500 shadow-sm">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Mô phỏng Môi trường</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
                Hệ thống sẽ đối chiếu hồ sơ cá nhân của bạn với các văn hóa làm việc phổ biến trong ngành để dự đoán tỷ lệ thích nghi.
              </p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/50 to-white p-6 shadow-sm flex flex-col">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 border-b border-rose-100 pb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-rose-700 mb-3">
                    <CheckCircle2 className="h-4 w-4" /> Báo cáo hoàn tất
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Mức độ tương thích</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">Dựa trên các giá trị đã chọn</p>
                </div>
                
                <div className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-sm border border-slate-100">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
                    <span className="text-lg font-black text-slate-900">{result.score}</span>
                  </div>
                  <div className="pr-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Culture Score</p>
                    <p className="text-sm font-bold text-rose-600">Rất tốt</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 flex items-start gap-3 rounded-xl bg-white p-4 border border-rose-50 shadow-sm">
                <Sparkles className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  <strong className="text-slate-900">Gợi ý môi trường:</strong> {result.score > 80 ? 'Ưu tiên doanh nghiệp có nhịp độ học hỏi cao và đề cao teamwork.' : 'Nên tìm kiếm các công ty chú trọng sự độc lập và ổn định.'}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 mt-auto">
                {/* Signals */}
                <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-slate-900">Tín hiệu phù hợp</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.fitSignals.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-slate-600">
                        <span className="text-emerald-500 mt-0.5">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks */}
                <div className="rounded-xl border border-amber-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-slate-900">Rủi ro tiềm ẩn</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.risks.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-slate-600">
                        <span className="text-amber-500 mt-0.5">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
