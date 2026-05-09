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
    {
      id: 1,
      role: 'Frontend Developer',
      date: '08/05/2026',
      score: 85,
      duration: '24:45',
      turns: 12,
      detail: 'Mở đầu tự tin, nêu rõ 2 dự án nổi bật. Kỹ thuật React tốt, nhưng phần tối ưu hiệu năng còn thiếu ví dụ cụ thể. Khuyến nghị luyện thêm phần đo lường và giải thích trade-off.',
      transcript: [
        { role: 'AI', text: 'Chào bạn! Hãy giới thiệu ngắn gọn về bản thân.' },
        { role: 'User', text: 'Mình là Frontend Developer với 3 năm kinh nghiệm, tập trung vào React và tối ưu UI.' },
        { role: 'AI', text: 'Bạn có thể kể về một dự án nổi bật gần đây?' },
        { role: 'User', text: 'Mình xây dựng dashboard cho đội sales, tối ưu hiệu năng và trải nghiệm tương tác.' }
      ],
      aiEvaluation: {
        summary: 'Giao tiếp rõ ràng, mạch lạc. Cần bổ sung số liệu và trade-off kỹ thuật khi nói về tối ưu hiệu năng.',
        strengths: ['Mạch lạc', 'Tập trung vào người dùng', 'Nắm chắc React cơ bản'],
        improvements: ['Bổ sung số liệu hiệu năng', 'Nêu rõ trade-off và lý do lựa chọn']
      }
    },
    {
      id: 2,
      role: 'React Developer',
      date: '05/05/2026',
      score: 72,
      duration: '18:20',
      turns: 8,
      detail: 'Trả lời đúng trọng tâm nhưng thiếu cấu trúc STAR ở phần behavioral. Cần làm rõ vai trò cá nhân, kết quả định lượng và bài học rút ra.',
      transcript: [
        { role: 'AI', text: 'Hãy chia sẻ cách bạn xử lý conflict trong team.' },
        { role: 'User', text: 'Mình trao đổi thẳng thắn với team, đưa ra dữ liệu và thống nhất cách làm.' }
      ],
      aiEvaluation: {
        summary: 'Có tinh thần hợp tác, nhưng thiếu cấu trúc STAR và kết quả định lượng.',
        strengths: ['Thái độ hợp tác', 'Giải thích rõ ràng'],
        improvements: ['Cấu trúc STAR', 'Đưa ví dụ định lượng']
      }
    }
  ]);
  const [activeTab, setActiveTab] = useState('config');
  const [selectedHistory, setSelectedHistory] = useState(null);

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
    setPlan(null);
    setActiveTab('config');
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

  const handleResetPlan = () => {
    setPlan(null);
    setActiveTab('config');
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

          <button
            onClick={() => setActiveTab(activeTab === 'history' ? 'config' : 'history')}
            className="inline-flex items-center gap-2 text-base font-bold text-emerald-700 hover:text-emerald-800 transition-all"
          >
            {activeTab === 'history' ? 'Quay lại phiên mới' : 'Lịch sử'}
            <ArrowRight size={16} className="translate-y-[1px]" />
          </button>
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
                  <button
                    onClick={() => {
                      setSelectedHistory(item);
                      setActiveTab('historyDetail');
                    }}
                    className="w-full bg-emerald-600 text-white py-2.5 rounded-xl text-[10px] font-bold uppercase shadow-md shadow-emerald-600/10"
                  >
                    Chi tiết
                  </button>
                </div>
              ))}
            </motion.div>
          ) : activeTab === 'historyDetail' && selectedHistory ? (
            <motion.div key="histDetail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-emerald-50/60 to-white shadow-sm px-5 py-4">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Lịch sử phỏng vấn</p>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedHistory.role}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-emerald-700">
                  <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 font-semibold">{selectedHistory.date}</span>
                  <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 font-semibold">{selectedHistory.score}%</span>
                  <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 font-semibold">{selectedHistory.duration}</span>
                  <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 font-semibold">{selectedHistory.turns} lượt hỏi</span>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-emerald-50/40 rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ghi am cuoc phong van</span>
                    <Mic2 size={16} className="text-slate-300" />
                  </div>
                  <div className="p-5 space-y-3 text-sm">
                    {selectedHistory.transcript.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'User' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-xl px-3 py-2 ${msg.role === 'User' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-900 border border-emerald-100'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <p className="text-sm font-bold text-slate-900">Danh gia AI</p>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">
                    {selectedHistory.aiEvaluation.summary}
                  </p>
                  <div className="mb-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 py-2">
                      <p className="text-xs text-emerald-700 font-semibold">Giao tiep</p>
                      <p className="text-lg font-bold text-emerald-700">{Math.min(95, selectedHistory.score + 5)}%</p>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 py-2">
                      <p className="text-xs text-emerald-700 font-semibold">Ky thuat</p>
                      <p className="text-lg font-bold text-emerald-700">{Math.max(60, selectedHistory.score - 10)}%</p>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 py-2">
                      <p className="text-xs text-emerald-700 font-semibold">Tu duy</p>
                      <p className="text-lg font-bold text-emerald-700">{selectedHistory.score}%</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-emerald-700 mb-2">Diem manh</p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {selectedHistory.aiEvaluation.strengths.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-rose-600 mb-2">Can cai thien</p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {selectedHistory.aiEvaluation.improvements.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="cfg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-5 flex flex-col relative">
                <div className={plan ? 'bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex-1 flex flex-col gap-6 opacity-60 select-none' : 'bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex-1 flex flex-col gap-6'}>
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
                {plan && (
                  <div className="absolute inset-0 rounded-2xl bg-white/40 backdrop-blur-[1px] border border-slate-200 pointer-events-auto" />
                )}
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
                      <div className="flex items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={18} className="text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-700 tracking-tight">Kịch bản sẵn sàng</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleResetPlan}
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all"
                        >
                          <Trash2 size={14} /> Quay lại tạo mới
                        </button>
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
