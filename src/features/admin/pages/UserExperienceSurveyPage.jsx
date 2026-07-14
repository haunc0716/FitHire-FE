import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Gift, Loader2, MessageSquareText, Star, Users } from 'lucide-react';
import { getUserExperienceSurveys } from '../services/userExperienceSurveyApi';

function formatDateTime(value) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('vi-VN');
}

function formatNumber(value, digits = 1) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0';
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: digits }).format(num);
}

function average(items, field) {
  const values = items.map((item) => Number(item?.[field])).filter(Number.isFinite);
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function RatingCell({ value }) {
  return (
    <span className="inline-flex h-9 min-w-14 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 px-3 text-sm font-bold text-emerald-700">
      {value ?? '--'}/5
    </span>
  );
}

function DetailText({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 leading-relaxed text-gray-700">{value || '--'}</p>
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

export default function UserExperienceSurveyPage() {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSurveyId, setExpandedSurveyId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    getUserExperienceSurveys()
      .then((data) => {
        if (!isMounted) return;
        setSurveys(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch((loadError) => {
        console.error(loadError);
        if (!isMounted) return;
        setError(loadError?.message || 'Không tải được dữ liệu khảo sát.');
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
    totalSurveys: surveys.length,
    uniqueUsers: new Set(surveys.map((item) => item.userId).filter(Boolean)).size,
    averageSatisfaction: average(surveys, 'overallSatisfaction'),
    averageRecommendation: average(surveys, 'recommendationLikelihood'),
    totalRewardScans: surveys.reduce((sum, item) => sum + Number(item.rewardCvScans ?? 0), 0),
  }), [surveys]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Khảo sát trải nghiệm người dùng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tổng hợp mức độ hài lòng, tính hữu ích của tính năng và nhu cầu cải thiện sản phẩm.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang tải dữ liệu khảo sát...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Tổng khảo sát" value={stats.totalSurveys} icon={MessageSquareText} iconClass="text-emerald-500" />
            <MetricCard label="Người tham gia" value={stats.uniqueUsers} icon={Users} iconClass="text-blue-500" />
            <MetricCard label="Hài lòng TB" value={`${formatNumber(stats.averageSatisfaction)}/5`} icon={Star} iconClass="text-amber-500" />
            <MetricCard label="Giới thiệu TB" value={`${formatNumber(stats.averageRecommendation)}/5`} icon={Star} iconClass="text-rose-500" />
            <MetricCard label="Lượt CV đã tặng" value={stats.totalRewardScans} icon={Gift} iconClass="text-emerald-600" />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-7 py-5">
              <h2 className="text-base font-bold text-gray-900">Danh sách khảo sát mới nhất</h2>
              <span className="text-xs font-semibold text-gray-400">Tối đa 100 bản ghi</span>
            </div>

            {surveys.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-gray-500">Chưa có khảo sát nào.</div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[1080px]">
                  <div className="grid grid-cols-[1.35fr_1.1fr_0.7fr_0.7fr_0.8fr_0.55fr] gap-6 border-b border-gray-100 bg-gray-50 px-7 py-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                    <div>Người dùng</div>
                    <div>Phỏng vấn mô phỏng</div>
                    <div>Hài lòng</div>
                    <div>Giới thiệu</div>
                    <div>Ngày gửi</div>
                    <div>Chi tiết</div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {surveys.map((item) => {
                      const isExpanded = expandedSurveyId === item.surveyId;
                      return (
                        <div key={item.surveyId} className="transition-colors hover:bg-gray-50/80">
                          <div className="grid grid-cols-[1.35fr_1.1fr_0.7fr_0.7fr_0.8fr_0.55fr] gap-6 px-7 py-5 text-sm">
                            <div className="min-w-0">
                              <div className="truncate font-bold text-gray-900">{item.userFullName || `Người dùng #${item.userId}`}</div>
                              <div className="mt-1 truncate text-xs text-gray-500">{item.userEmail || '--'}</div>
                            </div>

                            <div className="min-w-0">
                              <div className="truncate font-bold text-gray-900">{item.interviewType || 'Phỏng vấn mô phỏng'}</div>
                              <div className="mt-1 text-xs text-gray-500">{item.level || '--'} - Điểm AI {item.interviewScore ?? '--'}%</div>
                            </div>

                            <RatingCell value={item.overallSatisfaction} />
                            <RatingCell value={item.recommendationLikelihood} />

                            <div className="text-sm font-semibold text-gray-700">{formatDateTime(item.createdAt)}</div>

                            <button
                              type="button"
                              onClick={() => setExpandedSurveyId(isExpanded ? null : item.surveyId)}
                              className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 text-xs font-bold text-emerald-700 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50"
                            >
                              Chi tiết
                              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="mx-7 mb-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                              <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
                                <div className="space-y-3">
                                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Đánh giá tính năng</p>
                                  <div className="grid gap-3">
                                    <FeatureRow label="Chấm CV" rating={item.cvAnalysisRating} usefulness={item.cvAnalysisUsefulness} />
                                    <FeatureRow label="Phỏng vấn mô phỏng" rating={item.mockInterviewRating} usefulness={item.mockInterviewUsefulness} />
                                    <FeatureRow label="Gợi ý nghề nghiệp" rating={item.careerRecommendationRating} usefulness={item.careerRecommendationUsefulness} />
                                  </div>
                                  <p className="pt-2 text-xs font-bold uppercase tracking-wide text-gray-400">Tính dễ sử dụng</p>
                                  <div className="grid gap-3 sm:grid-cols-2">
                                    <ScoreBox label="Giao diện" value={item.interfaceEase} />
                                    <ScoreBox label="Dễ tìm chức năng" value={item.featureDiscoverability} />
                                    <ScoreBox label="Tốc độ AI" value={item.aiResponseSpeed} />
                                    <ScoreBox label="Kết quả dễ hiểu" value={item.aiResultClarity} />
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <DetailText label="Thích nhất" value={item.likedMost} />
                                  <DetailText label="Chưa hài lòng" value={item.dissatisfaction} />
                                  <DetailText label="Tính năng mong muốn" value={item.desiredFeatures} />
                                  <div className="grid gap-3 sm:grid-cols-3">
                                    <DetailText label="Nhóm người dùng" value={item.userSegment} />
                                    <DetailText label="Ngành" value={item.industry} />
                                    <DetailText label="Kinh nghiệm phỏng vấn" value={item.realInterviewExperience} />
                                  </div>
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

function FeatureRow({ label, rating, usefulness }) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <span className="text-xs font-semibold text-gray-400">Đánh giá</span>
      <RatingCell value={rating} />
      <span />
      <span className="text-xs font-semibold text-gray-400">Hữu ích</span>
      <RatingCell value={usefulness} />
    </div>
  );
}

function ScoreBox({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <RatingCell value={value} />
    </div>
  );
}
