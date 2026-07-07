import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileSearch,
  Filter,
  ListChecks,
  MessageSquareText,
  Search,
  Target,
  XCircle,
} from 'lucide-react';
import {
  fetchCvScoringDetail,
  fetchCvScoringHistory,
  fetchMockInterviewDetail,
  fetchMockInterviewHistory,
} from '../services/userApi';
import { useToast } from '../../../components/ui/ToastProvider';

function formatDateLabel(value) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleString('vi-VN');
}

function resolveStatusLabel(score, fallback) {
  if (typeof score === 'number' && Number.isFinite(score)) {
    if (score >= 85) return 'Rất tốt';
    if (score >= 70) return 'Đạt yêu cầu';
    return 'Cần cải thiện';
  }

  if (fallback) return fallback;
  return 'Đang xử lý';
}

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [value];
    } catch {
      return value
        .split(/\r?\n|;|\u2022/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [value];
}

function normalizeScore(value) {
  const score = Number(value);
  return Number.isFinite(score) ? score : null;
}

function normalizeCvHistoryItem(item) {
  const score = normalizeScore(item?.overallScore ?? item?.score);
  const sessionId = item?.sessionId ?? item?.id;
  const createdAt = item?.createdAt || item?.updatedAt || item?.scoredAt;
  const title =
    item?.title ||
    item?.originalFileName ||
    item?.fileName ||
    (sessionId ? `Chấm CV #${sessionId}` : 'Chấm điểm CV');

  return {
    id: `cv-${sessionId ?? Math.random()}`,
    sessionId,
    type: 'cv-analysis',
    title: `Đánh giá CV "${title}"`,
    target: item?.targetCompany || item?.jobTitle || item?.position || 'Chấm điểm CV ATS',
    date: formatDateLabel(createdAt),
    rawDate: createdAt ? new Date(createdAt).getTime() : 0,
    score,
    status: resolveStatusLabel(score, item?.status),
    icon: FileSearch,
  };
}

function normalizeInterviewHistoryItem(item) {
  const score = normalizeScore(item?.overallScore ?? item?.score);
  const sessionId = item?.sessionId ?? item?.id;
  const createdAt = item?.createdAt || item?.startedAt;
  const role = item?.interviewType || item?.role || item?.level || 'Mock Interview';
  const level = item?.level || item?.experienceLevel || 'N/A';

  return {
    id: `mi-${sessionId ?? Math.random()}`,
    sessionId,
    type: 'mock-interview',
    title: `Luyện phỏng vấn: ${role}`,
    target: `Cấp độ: ${level}`,
    date: formatDateLabel(createdAt),
    rawDate: createdAt ? new Date(createdAt).getTime() : 0,
    score,
    status: resolveStatusLabel(score, item?.status),
    icon: MessageSquareText,
  };
}

function normalizeCvDetail(detail, fallback) {
  const score = normalizeScore(detail?.overallScore ?? detail?.score ?? fallback?.score);
  const suggestions = toArray(detail?.suggestions);
  const improvements = toArray(detail?.improvements);

  return {
    ...fallback,
    kindLabel: 'Chi tiết chấm CV',
    score,
    status: resolveStatusLabel(score, detail?.status || fallback?.status),
    summary:
      detail?.summary ||
      detail?.overallFeedback ||
      detail?.feedback ||
      'Chưa có nhận xét tổng quan.',
    strengths: toArray(detail?.strengths),
    weaknesses: toArray(detail?.weaknesses),
    suggestions: suggestions.length > 0 ? suggestions : improvements,
    missingKeywords: toArray(detail?.missingKeywords),
    criteriaDetails: toArray(detail?.details),
  };
}

function normalizeInterviewDetail(detail, fallback) {
  const finalReport = detail?.finalReport ?? {};
  const qaItems = toArray(detail?.qaItems);
  const score = normalizeScore(finalReport?.overallScore ?? detail?.overallScore ?? fallback?.score);
  const answered = normalizeScore(detail?.answeredQuestionCount) ?? qaItems.length;
  const targetCount = normalizeScore(detail?.targetQuestionCount) ?? answered;
  const role =
    detail?.interviewType ||
    fallback?.title?.replace('Luyện phỏng vấn: ', '') ||
    'Mock Interview';
  const level = detail?.level || fallback?.target?.replace('Cấp độ: ', '') || 'N/A';
  const recommendations = toArray(finalReport?.recommendations);

  return {
    ...fallback,
    kindLabel: 'Chi tiết phỏng vấn',
    title: `Luyện phỏng vấn: ${role}`,
    target: `Cấp độ: ${level}`,
    date: formatDateLabel(detail?.startedAt || fallback?.rawDate),
    score,
    status: resolveStatusLabel(score, detail?.status || fallback?.status),
    summary: finalReport?.summary || detail?.finalSummary || 'Chưa có nhận xét tổng quan.',
    strengths: toArray(finalReport?.strengths),
    weaknesses: toArray(finalReport?.weaknesses),
    suggestions: recommendations.length > 0 ? recommendations : toArray(finalReport?.weaknesses),
    answered,
    targetCount,
    qaItems,
  };
}

function ScoreBadge({ score }) {
  const hasScore = typeof score === 'number' && Number.isFinite(score);
  const tone = hasScore && score >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>
      {hasScore ? `${score} điểm` : 'Chưa có điểm'}
    </span>
  );
}

function BulletList({ items, emptyText, tone = 'emerald' }) {
  const dotClass = tone === 'rose' ? 'bg-rose-400' : tone === 'amber' ? 'bg-amber-400' : 'bg-emerald-400';

  if (!items?.length) {
    return <p className="text-sm text-stone-400">{emptyText}</p>;
  }

  return (
    <ul className="space-y-2 text-sm text-stone-700">
      {items.map((item, index) => (
        <li key={`${String(item)}-${index}`} className="flex items-start gap-2">
          <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
          <span>{typeof item === 'string' ? item : item?.feedback || item?.suggestion || JSON.stringify(item)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function UserHistoryPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailLoadingId, setDetailLoadingId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError('');

    Promise.all([
      fetchCvScoringHistory({ page: 0, size: 20 }),
      fetchMockInterviewHistory({ page: 0, size: 20 }),
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

  const openDetail = async (item) => {
    if (!item?.sessionId) {
      showToast({
        type: 'warning',
        title: 'Thiếu mã phiên',
        message: 'Không thể mở chi tiết vì lịch sử này chưa có sessionId.',
      });
      return;
    }

    setDetailLoadingId(item.id);
    setLoadError('');
    try {
      if (item.type === 'cv-analysis') {
        const detail = await fetchCvScoringDetail(item.sessionId);
        setSelectedDetail(normalizeCvDetail(detail, item));
      } else {
        const detail = await fetchMockInterviewDetail(item.sessionId);
        setSelectedDetail(normalizeInterviewDetail(detail, item));
      }
    } catch (error) {
      const message = error?.message || 'Không thể tải chi tiết lịch sử.';
      setLoadError(message);
      showToast({ type: 'error', title: 'Tải chi tiết thất bại', message });
    } finally {
      setDetailLoadingId('');
    }
  };

  const renderDetail = () => {
    if (!selectedDetail) return null;
    const isCv = selectedDetail.type === 'cv-analysis';

    return (
      <motion.div
        key="history-detail"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        <button
          type="button"
          onClick={() => setSelectedDetail(null)}
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 hover:border-emerald-200 hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại lịch sử
        </button>

        <section className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                {selectedDetail.kindLabel}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-stone-950">{selectedDetail.title}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-stone-500">
                <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1">
                  <Target className="h-3.5 w-3.5" />
                  {selectedDetail.target}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1">
                  <Clock className="h-3.5 w-3.5" />
                  {selectedDetail.date}
                </span>
                {!isCv ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1">
                    <ListChecks className="h-3.5 w-3.5" />
                    {selectedDetail.answered}/{selectedDetail.targetCount} câu hỏi
                  </span>
                ) : null}
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-center shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Điểm tổng</p>
              <p className="mt-1 text-4xl font-black text-emerald-700">
                {typeof selectedDetail.score === 'number' ? selectedDetail.score : '--'}
              </p>
              <p className="mt-1 text-sm font-semibold text-stone-500">{selectedDetail.status}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-bold text-stone-900">Nhận xét tổng quan</h3>
            </div>
            <p className="text-sm leading-7 text-stone-700">{selectedDetail.summary}</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-bold text-stone-900">Trạng thái</p>
            <ScoreBadge score={selectedDetail.score} />
            <p className="mt-3 text-sm text-stone-500">
              {isCv
                ? 'Kết quả được tổng hợp từ CV, JD và các tiêu chí ATS.'
                : 'Kết quả được tổng hợp từ các câu trả lời trong buổi phỏng vấn.'}
            </p>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-bold text-emerald-700">Điểm mạnh</p>
            <BulletList items={selectedDetail.strengths} emptyText="Chưa có điểm mạnh được ghi nhận." />
          </div>
          <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-bold text-rose-600">Cần cải thiện</p>
            <BulletList items={selectedDetail.weaknesses} emptyText="Chưa có nội dung cần cải thiện." tone="rose" />
          </div>
          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-bold text-amber-700">Gợi ý tiếp theo</p>
            <BulletList items={selectedDetail.suggestions} emptyText="Chưa có gợi ý bổ sung." tone="amber" />
          </div>
        </section>

        {isCv ? (
          <section className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-bold text-stone-900">Từ khóa còn thiếu</p>
              <div className="flex flex-wrap gap-2">
                {selectedDetail.missingKeywords?.length ? (
                  selectedDetail.missingKeywords.map((keyword, index) => (
                    <span key={`${keyword}-${index}`} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                      {keyword}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-stone-400">Chưa có từ khóa thiếu.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:col-span-2">
              <p className="mb-3 text-sm font-bold text-stone-900">Chi tiết tiêu chí</p>
              {selectedDetail.criteriaDetails?.length ? (
                <div className="overflow-hidden rounded-xl border border-stone-100">
                  <table className="min-w-full divide-y divide-stone-100 text-left text-sm">
                    <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                      <tr>
                        <th className="px-4 py-3">Tiêu chí</th>
                        <th className="px-4 py-3">Điểm</th>
                        <th className="px-4 py-3">Nhận xét</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                      {selectedDetail.criteriaDetails.map((detail, index) => (
                        <tr key={`${detail?.criteriaKey || 'criteria'}-${index}`}>
                          <td className="px-4 py-3 font-semibold text-stone-800">
                            {detail?.criteriaName || detail?.criteriaKey || '--'}
                          </td>
                          <td className="px-4 py-3 text-stone-700">
                            {typeof detail?.score === 'number' ? detail.score : '--'}
                          </td>
                          <td className="px-4 py-3 text-stone-600">
                            {detail?.feedback || detail?.suggestion || '--'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-stone-400">Chưa có chi tiết tiêu chí.</p>
              )}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-bold text-stone-900">Nội dung hỏi đáp</p>
            {selectedDetail.qaItems?.length ? (
              <div className="space-y-4">
                {selectedDetail.qaItems.map((item, index) => (
                  <div key={`${item?.questionId || 'qa'}-${index}`} className="rounded-xl border border-stone-100 bg-stone-50/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Câu hỏi {index + 1}</p>
                    <p className="mt-2 text-sm font-semibold text-stone-900">
                      {item?.questionText || item?.question || '--'}
                    </p>
                    <p className="mt-3 text-xs font-bold uppercase tracking-widest text-stone-400">Câu trả lời</p>
                    <p className="mt-1 text-sm leading-6 text-stone-700">
                      {item?.answerText || item?.answer || 'Chưa có câu trả lời.'}
                    </p>
                    {item?.feedback || item?.score ? (
                      <div className="mt-3 rounded-lg bg-white px-3 py-2 text-sm text-stone-600">
                        {typeof item?.score === 'number' ? <b>{item.score} điểm. </b> : null}
                        {item?.feedback}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-400">Chưa có nội dung hỏi đáp.</p>
            )}
          </section>
        )}
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f9fa] font-body">
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-[500px] w-[500px] -translate-x-1/3 -translate-y-1/4 rounded-full bg-emerald-200/40 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-40 z-0 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-indigo-200/30 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-stone-900">Lịch sử phân tích</h1>
          <p className="mt-1 text-sm text-stone-500">
            Xem lại các kết quả đánh giá CV và luyện phỏng vấn trước đây của bạn.
          </p>
        </div>

        {selectedDetail ? (
          renderDetail()
        ) : (
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-stone-100 p-5 sm:flex-row sm:items-center">
              <div className="flex rounded-lg bg-stone-100 p-1">
                {[
                  ['all', 'Tất cả'],
                  ['cv-analysis', 'Chấm CV'],
                  ['mock-interview', 'Phỏng vấn'],
                ].map(([tab, label]) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
                      activeTab === tab
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm lịch sử..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 py-2 pl-9 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:w-64"
                  />
                </div>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition-colors hover:bg-stone-50"
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-stone-100">
              {isLoading ? (
                <div className="p-8 text-center text-sm text-stone-500">Đang tải lịch sử...</div>
              ) : loadError ? (
                <div className="flex items-center justify-center gap-2 p-8 text-center text-sm text-rose-600">
                  <XCircle className="h-4 w-4" />
                  {loadError}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="p-8 text-center text-sm text-stone-500">Không có dữ liệu phù hợp.</div>
              ) : (
                filteredItems.map((item) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                    onClick={() => openDetail(item)}
                    disabled={detailLoadingId === item.id}
                    className="group flex w-full cursor-pointer items-start gap-4 p-5 text-left transition-colors disabled:opacity-60 sm:items-center"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        item.type === 'cv-analysis' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                      }`}
                    >
                      <item.icon className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-bold text-stone-900 transition-colors group-hover:text-emerald-600">
                        {item.title}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-stone-500">
                        <span className="font-medium">{item.target}</span>
                        <span className="h-1 w-1 rounded-full bg-stone-300" />
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.date}
                        </span>
                      </div>
                    </div>

                    <div className="hidden shrink-0 flex-col items-end sm:flex">
                      <ScoreBadge score={item.score} />
                      <span className="mt-1 text-xs font-medium text-stone-400">{item.status}</span>
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-300 transition-all group-hover:bg-emerald-50 group-hover:text-emerald-500">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </motion.button>
                ))
              )}

              {!isLoading && !loadError && filteredItems.length > 0 ? (
                <div className="flex flex-col items-center p-8 text-center text-sm text-stone-500">
                  <CheckCircle2 className="mb-2 h-8 w-8 text-stone-300" />
                  Bạn đã xem hết danh sách lịch sử
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
