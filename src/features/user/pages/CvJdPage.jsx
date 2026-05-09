import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  FileCheck2, 
  UploadCloud, 
  FileText, 
  Briefcase,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { runCvJdScoring } from '../services/userFeatureAdapters';

export default function CvJdPage() {
  const [jdText, setJdText] = useState('');
  const [cvId, setCvId] = useState('latest');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState([]);

  const handleFiles = (files) => {
    const mapped = Array.from(files || []).map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      fileName: file.name,
      sizeKb: Math.round(file.size / 1024),
      uploadedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    }));

    setUploads((prev) => [...mapped, ...prev]);
    if (mapped.length > 0) {
      setCvId(mapped[0].id);
    }
  };

  const cvOptions = useMemo(() => {
    const base = [
      { id: 'latest', name: 'CV mới nhất (từ hồ sơ)' },
      { id: 'cv_2', name: 'CV Product Manager' },
      { id: 'cv_3', name: 'CV Data Analyst' },
    ];

    const uploaded = uploads.map((item) => ({ id: item.id, name: `${item.fileName}` }));
    return [...uploaded, ...base];
  }, [uploads]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await runCvJdScoring({ jdText, cvId });
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
      
      {/* Background Bubbles (Bong bóng mờ) */}
      <div className="absolute top-0 left-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-emerald-200/40 blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-40 right-0 h-[300px] w-[300px] translate-x-1/3 rounded-full bg-blue-200/40 blur-[80px] -z-10 pointer-events-none" />

      {/* 1. Header (Refined Typography) */}
      <div className="relative z-10 flex flex-col gap-3 pb-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Phân tích & Chấm điểm CV
        </h1>
        <p className="text-base text-slate-500 max-w-2xl leading-relaxed">
          Đánh giá độ tương thích giữa hồ sơ của bạn và Job Description. Nhận báo cáo chi tiết và gợi ý tối ưu từ chuyên gia AI để tăng tỷ lệ đậu phỏng vấn.
        </p>
      </div>

      {/* 2. Visual Stepper */}
      <div className="hidden md:flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {[
          { step: 1, title: 'Upload CV', desc: 'PDF, DOCX', icon: UploadCloud, active: true },
          { step: 2, title: 'Chọn hồ sơ', desc: 'Từ danh sách', icon: FileText, active: true },
          { step: 3, title: 'Dán JD', desc: 'Và nhận kết quả', icon: Briefcase, active: !!jdText }
        ].map((s, i) => (
          <React.Fragment key={s.step}>
            <div className={`flex items-center gap-4 ${s.active ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{s.title}</p>
                <p className="text-xs font-medium text-slate-500">Bước {s.step} • {s.desc}</p>
              </div>
            </div>
            {i < 2 && <ChevronRight className="h-5 w-5 text-slate-300 mx-4" />}
          </React.Fragment>
        ))}
      </div>

      {/* 3. Main Workspace (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: CV Management */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">1. Nguồn CV</h2>
            
            <label className="group block cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform">
                <UploadCloud className="h-6 w-6 text-blue-500" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-700">Kéo thả hoặc nhấp để tải lên</p>
              <p className="mt-1 text-xs text-slate-500">Hỗ trợ PDF, DOCX (Tối đa 5MB)</p>
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" multiple onChange={(e) => handleFiles(e.target.files)} />
            </label>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">2. Chọn CV phân tích</label>
              <select
                value={cvId}
                onChange={(e) => setCvId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                {cvOptions.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            {uploads.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">CV vừa tải lên</p>
                <div className="space-y-2">
                  {uploads.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                        <p className="text-sm font-medium text-slate-700 truncate">{item.fileName}</p>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">{item.sizeKb} KB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: JD & Action */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="flex flex-col h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">3. Mô tả công việc (Job Description)</h2>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              required
              placeholder="Dán toàn bộ nội dung Job Description (Yêu cầu công việc, kỹ năng, kinh nghiệm...) vào đây để AI có thể đối chiếu chính xác nhất."
              className="flex-1 w-full min-h-[250px] resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
            
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
              <p className="text-xs text-slate-500 hidden sm:block">
                Tiêu hao <strong className="text-slate-900">1 lượt phân tích</strong> cho hành động này.
              </p>
              <button 
                type="submit" 
                disabled={loading || !jdText.trim()} 
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto w-full"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                    Đang AI xử lý...
                  </span>
                ) : (
                  <>
                    Phân tích CV ngay
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 4. Results Section (Glassmorphism & Colors) */}
      {result && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-6 lg:p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-emerald-100 pb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700 mb-4">
                <CheckCircle2 className="h-4 w-4" /> Hoàn tất phân tích
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Báo cáo độ tương thích</h2>
              <p className="mt-1 text-sm text-slate-500">Dựa trên CV và JD bạn vừa cung cấp.</p>
            </div>
            
            <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-emerald-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-emerald-500 drop-shadow-md" strokeDasharray={`${result.score}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="text-xl font-black text-slate-900">{result.score}</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Match Score</p>
                <p className="text-sm font-medium text-emerald-600">Khá phù hợp</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Strengths */}
            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-slate-900">Điểm mạnh</h3>
              </div>
              <ul className="space-y-3">
                {result.strengths.map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-slate-900">Khoảng trống kỹ năng</h3>
              </div>
              <ul className="space-y-3">
                {result.gaps.map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-rose-500 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-slate-900">Gợi ý cải thiện CV</h3>
              </div>
              <ul className="space-y-3">
                {result.suggestions.map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-blue-500 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
