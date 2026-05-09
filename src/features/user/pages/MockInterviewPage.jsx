import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic2, Sparkles, CheckCircle2, Video, Target, ArrowRight,
  FileText, Camera, Send, StopCircle, Play,
  Trash2, ChevronRight
} from 'lucide-react';
import { generateMockInterviewPlan } from '../services/userFeatureAdapters';

export default function MockInterviewPage() {
  const [role, setRole] = useState('Frontend Developer');
  const [level, setLevel] = useState('Middle');
  const [jd, setJd] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [transcript, setTranscript] = useState([
    { role: 'AI', text: 'Chào bạn! Tôi là AI Mentor của FitHire. Bạn đã sẵn sàng chưa?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [history, setHistory] = useState([
    { id: 1, role: 'Frontend Developer', date: '08/05/2026', score: 85 },
    { id: 2, role: 'React Developer', date: '05/05/2026', score: 72 }
  ]);
  const [activeTab, setActiveTab] = useState('config');

  const videoRef = useRef(null);
  const transcriptEndRef = useRef(null);

  const scrollToBottom = () => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcript]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await generateMockInterviewPlan({ role, level, jd });
      setPlan(data);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    setIsInterviewing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { console.error(err); }
  };

  const stopInterview = () => {
    setIsInterviewing(false);
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    const newEntry = {
      id: Date.now(), role, date: new Date().toLocaleDateString('vi-VN'),
      score: Math.floor(Math.random() * 40) + 60
    };
    setHistory([newEntry, ...history]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setTranscript([...transcript, { role: 'User', text: userInput }]);
    setUserInput('');
    setTimeout(() => {
      setTranscript(prev => [...prev, {
        role: 'AI', text: 'Tôi hiểu rồi. Bạn có thể giải thích chi tiết hơn không?'
      }]);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] overflow-hidden font-body text-slate-800 pb-16">

      {/* Background Bubbles (Rainbow effect from CV Manager) */}
      <div className="absolute top-0 left-0 h-[500px] w-[500px] -translate-x-1/3 -translate-y-1/4 rounded-full bg-emerald-200/40 blur-[120px] z-0 pointer-events-none" />
      <div className="absolute top-40 right-0 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-indigo-200/30 blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] translate-y-1/3 rounded-full bg-rose-200/20 blur-[100px] z-0 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-6 p-6 lg:p-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Luyện tập Phỏng vấn
            </h1>
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              Cải thiện kỹ năng phản xạ phỏng vấn cùng AI Mentor chuyên nghiệp.
            </p>
          </div>

          <div className="flex bg-white/40 backdrop-blur-sm p-1 rounded-xl border border-white shadow-sm h-fit">
            <button
              onClick={() => setActiveTab('config')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'config' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-400'}`}
            >
              Phiên mới
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-400'}`}
            >
              Lịch sử
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isInterviewing ? (
            <motion.div key="int" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden relative shadow-xl border-4 border-white min-h-[350px]">
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase flex items-center gap-1.5 border border-white/20">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Live
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100"><Mic2 size={20} /></div>
                    <p className="text-xl font-bold">24:45</p>
                  </div>
                  <button onClick={stopInterview} className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-xs font-bold uppercase shadow-md shadow-emerald-600/10">Kết thúc</button>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[500px]">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hội thoại</span>
                  <FileText size={16} className="text-slate-300" />
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide text-sm">
                  {transcript.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'User' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-xl ${msg.role === 'User' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-900 border border-emerald-100'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={transcriptEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 border-t flex gap-2">
                  <input value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Nhập câu trả lời..." className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none" />
                  <button className="bg-emerald-600 text-white p-2.5 rounded-xl"><Send size={16} /></button>
                </form>
              </div>
            </motion.div>
          ) : activeTab === 'history' ? (
            <motion.div key="hist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-6">
              {history.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-200 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <Video size={24} className="text-emerald-400" />
                    <p className="text-2xl font-bold text-emerald-600">{item.score}%</p>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{item.role}</h4>
                  <p className="text-[10px] text-zinc-400 mb-4">{item.date}</p>
                  <button className="w-full bg-emerald-600 text-white py-2.5 rounded-xl text-[10px] font-bold uppercase shadow-md shadow-emerald-600/10">Chi tiết</button>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="cfg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-5 flex flex-col">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex-1 flex flex-col gap-6">
                  <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Cấu hình phỏng vấn</h2>

                  <form onSubmit={handleGenerate} className="flex flex-col gap-5 flex-1">
                    <div className="space-y-4 flex-1">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vị trí ứng tuyển</label>
                        <input value={role} onChange={(e) => setRole(e.target.value)} required className="w-full rounded-xl border border-slate-200 bg-zinc-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cấp độ mục tiêu</label>
                        <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-zinc-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all">
                          <option>Intern</option><option>Fresher</option><option>Junior</option><option>Middle</option><option>Senior</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mô tả công việc (JD)</label>
                        <textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 bg-zinc-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none h-[140px]" />
                      </div>
                    </div>

                    <div className="mt-2 pt-5 border-t border-slate-100">
                      <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex justify-center items-center gap-2">
                        {loading ? 'Đang phân tích...' : 'Tạo lộ trình'}
                        {!loading && <ArrowRight size={16} />}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col">
                {!plan ? (
                  <div className="flex-1 bg-white/40 backdrop-blur-md border border-white rounded-2xl flex flex-col items-center justify-center p-10 text-center shadow-inner group">
                    <div className="w-16 h-16 bg-white/60 rounded-xl shadow-sm border border-white flex items-center justify-center text-emerald-200 mb-6 group-hover:scale-105 transition-all">
                      <Sparkles size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-900 mb-1">Chờ phân tích</h3>
                    <p className="text-xs text-emerald-700/50 max-w-[200px]">Nhập cấu hình bên trái để chuẩn bị kịch bản.</p>
                  </div>
                ) : (
                  <motion.div initial={{ scale: 0.98 }} animate={{ scale: 1 }} className="bg-emerald-50/30 backdrop-blur-md rounded-2xl border border-emerald-100 p-6 shadow-xl flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-6">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700 tracking-tight">Kịch bản sẵn sàng</span>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">{plan.role}</h2>
                      <p className="text-xs font-medium text-slate-500 mb-8">Cấp độ: {plan.level}</p>

                      <div className="space-y-3 mb-8">
                        {plan.stages.map((stage, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-white/60 p-4 rounded-xl border border-white shadow-sm text-sm">
                            <span className="font-bold text-emerald-300">0{idx + 1}</span>
                            <p className="text-slate-700 truncate">{stage}</p>
                            <ChevronRight size={14} className="ml-auto text-emerald-100" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={startInterview} className="w-full bg-emerald-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all">Bắt đầu ngay</button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
