import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Loader2, MessageSquareText, Star, TrendingUp, Users } from 'lucide-react';
import { getMockInterviewFeedbacks } from '../services/mockInterviewFeedbackApi';

function formatDateTime(value) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('vi-VN');
}

function formatNumber(value, digits = 1) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0';
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: digits,
  }).format(num);
}

function average(items, field) {
  if (items.length === 0) return 0;
  const total = items.reduce((sum, item) => sum + Number(item?.[field] ?? 0), 0);
  return total / items.length;
}

function feedbackAverage(item) {
  const ratings = [
    item?.overallRating,
    item?.realismRating,
    item?.questionQualityRating,
    item?.aiFeedbackRating,
  ].map((value) => Number(value)).filter(Number.isFinite);

  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
}

function RatingCell({ value }) {
  return (
    <div className="inline-flex h-10 min-w-16 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 px-3 text-sm font-bold text-emerald-700">
      {value}/5
    </div>
  );
}

function RatingDetail({ question, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
      <p className="text-sm font-semibold leading-snug text-gray-800">{question}</p>
      <RatingCell value={value} />
    </div>
  );
}

function PriorityBadge({ priority }) {
  const isHigh = priority === 'High';

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold ${
        isHigh
          ? 'border-rose-200 bg-rose-50 text-rose-700'
          : 'border-emerald-100 bg-emerald-50 text-emerald-700'
      }`}
    >
      {priority}
    </span>
  );
}

function FeedbackText({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 leading-relaxed text-gray-700">{value || '--'}</p>
    </div>
  );
}

function DateCell({ value }) {
  const formatted = formatDateTime(value);
  const [date, ...timeParts] = formatted.split(' ');

  return (
    <div className="text-sm font-semibold text-gray-700">
      <div>{date || '--'}</div>
      <div className="mt-1 text-xs font-medium text-gray-400">{timeParts.join(' ')}</div>
    </div>
  );
}

export default function MockInterviewFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedFeedbackId, setExpandedFeedbackId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    getMockInterviewFeedbacks()
      .then((data) => {
        if (!isMounted) return;
        setFeedbacks(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch((loadError) => {
        console.error(loadError);
        if (!isMounted) return;
        setError(loadError?.message || 'Không tải được feedback Mock Interview.');
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => ({
    totalFeedbacks: feedbacks.length,
    uniqueUsers: new Set(feedbacks.map((item) => item.userId).filter(Boolean)).size,
    averageOverall: average(feedbacks, 'overallRating'),
    averageAiFeedback: average(feedbacks, 'aiFeedbackRating'),
  }), [feedbacks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback Mock Interview</h1>
        <p className="mt-1 text-sm text-gray-500">Theo dõi trải nghiệm người dùng và các đề xuất cải thiện Mock Interview.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang tải feedback...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard label="Tổng feedback" value={stats.totalFeedbacks} icon={MessageSquareText} iconClass="text-emerald-500" />
            <MetricCard label="Người dùng góp ý" value={stats.uniqueUsers} icon={Users} iconClass="text-blue-500" />
            <MetricCard label="Điểm Hài lòng trung bình" value={`${formatNumber(stats.averageOverall)}/5`} icon={Star} iconClass="text-amber-500" />
            <MetricCard label="Điểm AI feedback hữu ích" value={`${formatNumber(stats.averageAiFeedback)}/5`} icon={TrendingUp} iconClass="text-rose-500" />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-7 py-5">
              <h2 className="text-base font-bold text-gray-900">Danh sách feedback mới nhất</h2>
              <span className="text-xs font-semibold text-gray-400">Tối đa 100 record</span>
            </div>

            {feedbacks.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-gray-500">Chưa có feedback nào.</div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[980px]">
                  <div className="grid grid-cols-[1.45fr_1.25fr_0.75fr_0.75fr_0.6fr] gap-6 border-b border-gray-100 bg-gray-50 px-7 py-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                    <div>Người dùng</div>
                    <div>Phiên phỏng vấn</div>
                    <div>Ưu tiên loại</div>
                    <div>Ngày gửi</div>
                    <div>Chi tiết</div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {feedbacks.map((item) => {
                      const averageRating = feedbackAverage(item);
                      const priority = averageRating < 3 ? 'High' : 'Normal';
                      const isHighPriority = priority === 'High';
                      const isExpanded = expandedFeedbackId === item.feedbackId;

                      return (
                        <div
                          key={item.feedbackId}
                          className={`transition-colors ${
                            isHighPriority
                              ? 'border-l-4 border-rose-400 bg-rose-50/70 hover:bg-rose-50'
                              : 'hover:bg-gray-50/80'
                          }`}
                        >
                          <div className="grid grid-cols-[1.45fr_1.25fr_0.75fr_0.75fr_0.6fr] gap-6 px-7 py-5 text-sm">
                            <div className="min-w-0">
                              <div className="truncate font-bold text-gray-900">{item.userFullName || `User #${item.userId}`}</div>
                              <div className="mt-1 truncate text-xs text-gray-500">{item.userEmail || '--'}</div>
                            </div>

                            <div className="min-w-0">
                              <div className="truncate font-bold text-gray-900">{item.interviewType || 'Mock Interview'}</div>
                              <div className="mt-1 text-xs text-gray-500">{item.level || '--'} · AI score {item.overallScore ?? '--'}%</div>
                              <div className="mt-1 text-xs text-gray-400">Hoàn thành: {formatDateTime(item.completedAt)}</div>
                            </div>

                            <div>
                              <PriorityBadge priority={priority} />
                              <div className="mt-1 text-xs text-gray-400">TB {formatNumber(averageRating)}/5</div>
                            </div>

                            <DateCell value={item.createdAt} />

                            <button
                              type="button"
                              onClick={() => setExpandedFeedbackId(isExpanded ? null : item.feedbackId)}
                              className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 text-xs font-bold text-emerald-700 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50"
                            >
                              Details
                              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="mx-7 mb-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                              <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
                                <div>
                                  <div className="mb-3 flex items-center justify-between">
                                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Rating</p>
                                    <p className="text-xs font-semibold text-gray-400">Trung bình {formatNumber(averageRating)}/5</p>
                                  </div>
                                  <div className="grid gap-3">
                                    <RatingDetail
                                      question="Bạn hài lòng tổng thể đến mức nào?"
                                      value={item.overallRating}
                                    />
                                    <RatingDetail
                                      question="Phiên phỏng vấn có giống thực tế không?"
                                      value={item.realismRating}
                                    />
                                    <RatingDetail
                                      question="Câu hỏi có phù hợp với vị trí/cấp độ không?"
                                      value={item.questionQualityRating}
                                    />
                                    <RatingDetail
                                      question="Feedback từ AI có hữu ích không?"
                                      value={item.aiFeedbackRating}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <FeedbackText label="Thích nhất" value={item.likedMost} />
                                  <FeedbackText label="Góp ý thêm" value={item.additionalComment} />
                                  <FeedbackText label="Góp ý cải thiện" value={item.improvementSuggestion} />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</span>
        <Icon className={`h-4 w-4 ${iconClass}`} />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
