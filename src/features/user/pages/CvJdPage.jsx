import React, { useState } from 'react';
import { FileCheck2 } from 'lucide-react';
import { runCvJdScoring } from '../services/userFeatureAdapters';

export default function CvJdPage() {
  const [jdText, setJdText] = useState('');
  const [cvId, setCvId] = useState('latest');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div className="space-y-6">
      <section className="rounded-3xl border border-emerald-100 bg-white/80 p-6 lg:p-8">
        <h1 className="font-display text-3xl font-bold text-emerald-950">Chấm CV theo JD</h1>
        <p className="mt-2 text-sm text-emerald-900/70">Dán JD mục tiêu để hệ thống phân tích mức độ tương thích của CV.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <select
            value={cvId}
            onChange={(e) => setCvId(e.target.value)}
            className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <option value="latest">CV mới nhất</option>
            <option value="cv_2">CV Product Manager</option>
            <option value="cv_3">CV Data Analyst</option>
          </select>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            required
            rows={8}
            placeholder="Dán nội dung JD tại đây..."
            className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
          />
          <button type="submit" disabled={loading} className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
            {loading ? 'Đang chấm...' : 'Phân tích ngay'}
          </button>
        </form>
      </section>

      {result && (
        <section className="rounded-3xl border border-emerald-100 bg-white/80 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700"><FileCheck2 className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-emerald-700/70">Điểm tương thích</p>
              <p className="text-3xl font-bold text-emerald-900">{result.score}/100</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div><h3 className="font-semibold text-emerald-900">Điểm mạnh</h3><ul className="mt-2 space-y-1 text-emerald-900/80">{result.strengths.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div><h3 className="font-semibold text-emerald-900">Khoảng trống</h3><ul className="mt-2 space-y-1 text-emerald-900/80">{result.gaps.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div><h3 className="font-semibold text-emerald-900">Gợi ý cải thiện</h3><ul className="mt-2 space-y-1 text-emerald-900/80">{result.suggestions.map((item) => <li key={item}>• {item}</li>)}</ul></div>
          </div>
        </section>
      )}
    </div>
  );
}
