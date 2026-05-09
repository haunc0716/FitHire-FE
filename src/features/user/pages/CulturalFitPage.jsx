import React, { useState } from 'react';
import { runCulturalFitScoring } from '../services/userFeatureAdapters';

const valueOptions = ['Ownership', 'Growth Mindset', 'Data-driven', 'Collaboration', 'Customer Centric'];

export default function CulturalFitPage() {
  const [industry, setIndustry] = useState('Công nghệ');
  const [selectedValues, setSelectedValues] = useState(['Collaboration', 'Growth Mindset']);
  const [result, setResult] = useState(null);

  const toggleValue = (value) => {
    setSelectedValues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const onScore = async () => {
    const data = await runCulturalFitScoring({ companyValues: selectedValues, industry });
    setResult(data);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-emerald-100 bg-white/80 p-6">
        <h1 className="font-display text-3xl font-bold text-emerald-950">Chấm độ phù hợp văn hóa doanh nghiệp</h1>
        <p className="mt-2 text-sm text-emerald-900/70">Chọn ngành và giá trị cốt lõi để nhận đánh giá cultural fit.</p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
            placeholder="Ngành nghề"
          />
          <button onClick={onScore} className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Phân tích Cultural Fit</button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {valueOptions.map((value) => {
            const active = selectedValues.includes(value);
            return (
              <button
                key={value}
                onClick={() => toggleValue(value)}
                className={`rounded-full px-4 py-2 text-sm transition ${active ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'}`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </section>

      {result && (
        <section className="rounded-3xl border border-emerald-100 bg-white/80 p-6">
          <p className="text-sm text-emerald-700/70">Mức phù hợp tổng thể</p>
          <p className="text-3xl font-bold text-emerald-900">{result.score}/100</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <h3 className="font-semibold text-emerald-900">Tín hiệu phù hợp</h3>
              <ul className="mt-2 space-y-1 text-emerald-900/80">{result.fitSignals.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900">Điểm cần cải thiện</h3>
              <ul className="mt-2 space-y-1 text-emerald-900/80">{result.risks.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
