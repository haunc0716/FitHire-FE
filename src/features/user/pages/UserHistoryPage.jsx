import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Search, Filter, FileSearch, MessageSquareText, ChevronRight, CheckCircle2 } from 'lucide-react';
import { fetchCvScoringHistory, fetchMockInterviewHistory } from '../services/userApi';
import { useToast } from '../../../components/ui/ToastProvider';

function formatDateLabel(value) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleString('vi-VN');
}

function resolveStatusLabel(score, fallback) {
  if (typeof score === 'number') {
    if (score >= 85) return 'Rất tốt';
    if (score >= 70) return 'Đạt yêu cầu';
    return 'Cần cải thiện';
  }

  if (fallback) return fallback;
  return 'Đang xử lý';
}

function normalizeCvHistoryItem(item) {
  const score = Number.isFinite(item?.overallScore) ? item.overallScore : Number(item?.score);
  const createdAt = item?.createdAt || item?.updatedAt || item?.scoredAt;
  const title = item?.title || item?.originalFileName || item?.fileName || (item?.sessionId ? `Chấm CV #${item.sessionId}` : 'Chấm điểm CV');

  return {
    id: `cv-${item?.sessionId ?? item?.id ?? Math.random()}`,
    type: 'cv-analysis',
    title: `Đánh giá CV "${title}"`,
    target: item?.targetCompany || item?.jobTitle || item?.position || 'Chấm điểm CV ATS',
    date: formatDateLabel(createdAt),
    rawDate: createdAt ? new Date(createdAt).getTime() : 0,
    score: Number.isFinite(score) ? score : null,
    status: resolveStatusLabel(score, item?.status),
    icon: FileSearch,
  };
}

function normalizeInterviewHistoryItem(item) {
  const score = Number.isFinite(item?.overallScore) ? item.overallScore : Number(item?.score);
  const createdAt = item?.createdAt || item?.startedAt;
  const role = item?.interviewType || item?.role || item?.level || 'Mock Interview';
  const level = item?.level || item?.experienceLevel || 'N/A';

  return {
    id: `mi-${item?.sessionId ?? item?.id ?? Math.random()}`,
    type: 'mock-interview',
    title: `Luyện phỏng vấn: ${role}`,
    target: `Cấp độ: ${level}`,
    date: formatDateLabel(createdAt),
    rawDate: createdAt ? new Date(createdAt).getTime() : 0,
    score: Number.isFinite(score) ? score : null,
    status: resolveStatusLabel(score, item?.status),
    icon: MessageSquareText,
  };
}

export default function UserHistoryPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError('');

    Promise.all([
      fetchCvScoringHistory({ page: 0, size: 20 }),
      fetchMockInterviewHistory({ page: 0, size: 20 })
    ])
      .then(([cvHistory, interviewHistory]) => {
        if (!isMounted) return;
        const cvItems = (cvHistory?.content ?? cvHistory ?? []).map(normalizeCvHistoryItem);
        const interviewItems = (interviewHistory?.content ?? interviewHistory ?? []).map(normalizeInterviewHistoryItem);
        const combined = [...cvItems, ...interviewItems].sort((a, b) => b.rawDate - a.rawDate);
        setItems(combined);
      })
      .catch((error) => {
        if (!isMounted) return;
        const message = error?.message || 'Không thể tải lịch sử.';
        setLoadError(message);
        showToast({ type: 'error', title: 'Tải lịch sử thất bại', message });
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
      const matchesTab = activeTab === 'all' || item.type === activeTab;
      if (!matchesTab) return false;
      if (!normalizedSearch) return true;
      return (
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.target.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [activeTab, items, searchTerm]);

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] overflow-hidden font-body">
      
      {/* Background Bubbles */}
      <div className="absolute top-0 left-0 h-[500px] w-[500px] -translate-x-1/3 -translate-y-1/4 rounded-full bg-emerald-200/40 blur-[120px] z-0 pointer-events-none" />
      <div className="absolute top-40 right-0 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-indigo-200/30 blur-[100px] z-0 pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900 font-display">Lịch sử phân tích</h1>
          <p className="text-stone-500 mt-1 text-sm">Xem lại các kết quả đánh giá CV và luyện phỏng vấn trước đây của bạn.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 p-5 gap-4">
            <div className="flex bg-stone-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
              >
                Tất cả
              </button>
              <button 
                onClick={() => setActiveTab('cv-analysis')}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'cv-analysis' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
              >
                Chấm CV
              </button>
              <button 
                onClick={() => setActiveTab('mock-interview')}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'mock-interview' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
              >
                Phỏng vấn
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm lịch sử..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-full sm:w-64"
                />
              </div>
              <button className="flex items-center justify-center h-9 w-9 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-stone-100">
            {isLoading ? (
              <div className="p-8 text-center text-stone-500 text-sm">
                Đang tải lịch sử...
              </div>
            ) : loadError ? (
              <div className="p-8 text-center text-rose-600 text-sm">
                {loadError}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-8 text-center text-stone-500 text-sm">
                Không có dữ liệu phù hợp.
              </div>
            ) : (
              filteredItems.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                className="flex items-start sm:items-center p-5 gap-4 cursor-pointer transition-colors group"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  item.type === 'cv-analysis' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                }`}>
                  <item.icon className="h-6 w-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-stone-900 truncate group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-stone-500">
                    <span className="font-medium">{item.target}</span>
                    <span className="h-1 w-1 rounded-full bg-stone-300"></span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.date}</span>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      item.score >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.score} Điểm
                    </span>
                  </div>
                  <span className="text-xs font-medium text-stone-400 mt-1">{item.status}</span>
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-300 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-all">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </motion.div>
            ))}

            {/* Empty State / End of list */}
            {!isLoading && !loadError && filteredItems.length > 0 && (
              <div className="p-8 text-center text-stone-500 text-sm flex flex-col items-center">
                <CheckCircle2 className="h-8 w-8 text-stone-300 mb-2" />
                Bạn đã xem hết danh sách lịch sử
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
