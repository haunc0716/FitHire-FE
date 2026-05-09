import React, { useState } from 'react';
import { generateMockInterviewPlan } from '../services/userFeatureAdapters';

export default function MockInterviewPage() {
  const [role, setRole] = useState('Frontend Developer');
  const [level, setLevel] = useState('Middle');
  const [plan, setPlan] = useState(null);

  const handleGenerate = async () => {
    const data = await generateMockInterviewPlan({ role, level });
    setPlan(data);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-emerald-100 bg-white/80 p-6">
        <h1 className="font-display text-3xl font-bold text-emerald-950">Mock Interview</h1>
        <p className="mt-2 text-sm text-emerald-900/70">Tạo phiên phỏng vấn mô phỏng theo vai trò và cấp độ mục tiêu.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <input value={role} onChange={(e) => setRole(e.target.value)} className="rounded-2xl border border-emerald-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-300" />
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-2xl border border-emerald-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-300">
            <option>Intern</option><option>Fresher</option><option>Junior</option><option>Middle</option><option>Senior</option>
          </select>
          <button onClick={handleGenerate} className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Tạo lộ trình phỏng vấn</button>
        </div>
      </section>

      {plan && (
        <section className="rounded-3xl border border-emerald-100 bg-white/80 p-6">
          <h2 className="font-display text-xl font-semibold text-emerald-950">Kịch bản đề xuất: {plan.role} - {plan.level}</h2>
          <ol className="mt-4 space-y-2 text-sm text-emerald-900/80">
            {plan.stages.map((stage) => <li key={stage}>• {stage}</li>)}
          </ol>
        </section>
      )}
    </div>
  );
}
