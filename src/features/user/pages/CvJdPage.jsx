import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
  XCircle,
} from 'lucide-react';
import {
  fetchCvScoringDetail,
  fetchCvScoringHistory,
  scoreCv,
} from '../services/userApi';

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function formatDateTime(value) {
  if (!value) {
    return '--';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '--';
  }

  return parsed.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getScoreBadgeClass(score) {
  if (typeof score !== 'number') {
    return 'bg-slate-100 text-slate-500';
  }

  if (score >= 80) {
    return 'bg-emerald-100 text-emerald-700';
  }

  if (score >= 60) {
    return 'bg-amber-100 text-amber-700';
  }

  return 'bg-rose-100 text-rose-700';
}

function getStatusLabel(status) {
  if (status === 'COMPLETED') {
    return 'Hoàn thành';
  }

  if (status === 'FAILED') {
    return 'Thất bại';
  }

  if (status === 'PROCESSING') {
    return 'Đang xử lý';
  }

  return status || 'Không rõ';
}

function StepItem({ step, title, description, active, completed }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={[
          'mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-bold transition-colors',
          completed
            ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
            : active
              ? 'border-blue-300 bg-blue-100 text-blue-700'
              : 'border-slate-200 bg-white text-slate-400',
        ].join(' ')}
      >
        {completed ? <CheckCircle2 className="h-4 w-4" /> : step}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export default function CvJdPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScoring, setIsScoring] = useState(false);
  const [result, setResult] = useState(null);
  const [scoreError, setScoreError] = useState('');

  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyTotalPages, setHistoryTotalPages] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  const stepState = useMemo(() => {
    const hasFile = Boolean(selectedFile);
    const hasResult = Boolean(result);

    return {
      hasFile,
      hasResult,
    };
  }, [result, selectedFile]);

  const loadHistory = useCallback(async (page = 0) => {
    setHistoryLoading(true);
    setHistoryError('');

    try {
      const payload = await fetchCvScoringHistory({ page, size: 8 });
      const items = toArray(payload?.content);

      setHistory(items);
      setHistoryPage(Number(payload?.number ?? page));
      setHistoryTotalPages(Number(payload?.totalPages ?? 0));

      return items;
    } catch (error) {
      setHistoryError(error?.message || 'Không thể tải lịch sử chấm điểm CV.');
      setHistory([]);
      setHistoryTotalPages(0);
      return [];
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const loadDetail = useCallback(async (sessionId) => {
    if (!sessionId) {
      return;
    }

    setSelectedSessionId(sessionId);
    setDetailLoading(true);
    setDetailError('');

    try {
      const payload = await fetchCvScoringDetail(sessionId);
      setResult(payload);
    } catch (error) {
      setDetailError(error?.message || 'Không thể lấy chi tiết kết quả chấm điểm.');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const bootstrap = async () => {
      const items = await loadHistory(0);
      if (!isActive) {
        return;
      }

      const firstSessionId = items?.[0]?.sessionId;
      if (firstSessionId) {
        loadDetail(firstSessionId);
      }
    };

    bootstrap();

    return () => {
      isActive = false;
    };
  }, [loadDetail, loadHistory]);

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0] ?? null;
    setSelectedFile(nextFile);
    setScoreError('');
  };

  const handleScoreCv = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setScoreError('Vui lòng chọn file CV để bắt đầu chấm điểm.');
      return;
    }

    setIsScoring(true);
    setScoreError('');
    setDetailError('');

    try {
      const payload = await scoreCv(selectedFile);
      setResult(payload);

      if (payload?.sessionId) {
        setSelectedSessionId(payload.sessionId);
      }

      await loadHistory(0);
    } catch (error) {
      setScoreError(error?.message || 'Không thể chấm điểm CV lúc này.');
    } finally {
      setIsScoring(false);
    }
  };

  const strengths = toArray(result?.strengths);
  const weaknesses = toArray(result?.weaknesses);
  const details = toArray(result?.details);
  const suggestions = toArray(result?.suggestions).length > 0 ? toArray(result?.suggestions) : toArray(result?.improvements);
  const missingKeywords = toArray(result?.missingKeywords);
  const missingSections = toArray(result?.missingSections);
  const detectedSkills = toArray(result?.detectedSkills);
  const totalScore = typeof result?.totalScore === 'number' ? result.totalScore : result?.overallScore;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" /> ATS CV Scoring
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
              Chấm điểm CV với AI
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Tải CV để nhận tổng điểm ATS, phân rã theo tiêu chí và phản hồi AI.
            </p>
          </div>

          <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:max-w-md">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <StepItem
                step={1}
                title="Tải CV"
                description="Chọn file PDF để chấm điểm"
                active={!stepState.hasFile}
                completed={stepState.hasFile}
              />
              <StepItem
                step={2}
                title="AI phân tích"
                description="Hệ thống xử lý và trích xuất"
                active={stepState.hasFile && isScoring}
                completed={stepState.hasResult && !isScoring}
              />
              <StepItem
                step={3}
                title="Nhận kết quả"
                description="Tổng điểm và phân tích"
                active={stepState.hasResult}
                completed={stepState.hasResult}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-4">
          <form onSubmit={handleScoreCv} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">1. Tải CV</h2>
            <p className="mt-1 text-sm text-slate-500">Hỗ trợ file PDF. Mỗi lần chấm điểm sẽ tốn 1 lượt sử dụng.</p>

            <label className="mt-5 block cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-700">Nhấn để chọn file CV</p>
              <p className="mt-1 text-xs text-slate-500">Chỉ cần 1 file PDF cho mỗi lần chấm</p>
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
            </label>

            {selectedFile ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="truncate text-sm font-medium text-slate-700">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">{Math.round(selectedFile.size / 1024)} KB</p>
              </div>
            ) : null}

            {scoreError ? (
              <p className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {scoreError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!selectedFile || isScoring}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isScoring ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang chấm điểm...
                </>
              ) : (
                <>
                  Bắt đầu chấm điểm <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Lịch sử chấm điểm</h2>
              <button
                type="button"
                onClick={() => loadHistory(historyPage)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Tải lại
              </button>
            </div>

            {historyError ? (
              <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{historyError}</p>
            ) : null}

            <div className="space-y-2">
              {historyLoading ? (
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang tải lịch sử...
                </div>
              ) : null}

              {!historyLoading && history.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">
                  Chưa có lần chấm điểm nào.
                </div>
              ) : null}

              {history.map((item) => (
                <button
                  key={item.sessionId}
                  type="button"
                  onClick={() => loadDetail(item.sessionId)}
                  className={[
                    'w-full rounded-xl border px-3 py-3 text-left transition',
                    selectedSessionId === item.sessionId
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{item.originalFileName || 'CV không tên'}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <Clock3 className="h-3.5 w-3.5" /> {formatDateTime(item.createdAt)}
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${getScoreBadgeClass(item.overallScore)}`}>
                      {typeof item.overallScore === 'number' ? `${item.overallScore} điểm` : '--'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-500">Trạng thái: {getStatusLabel(item.status)}</p>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                disabled={historyPage <= 0 || historyLoading}
                onClick={() => loadHistory(Math.max(0, historyPage - 1))}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trang trước
              </button>
              <span className="text-xs text-slate-500">
                Trang {historyTotalPages === 0 ? 0 : historyPage + 1}/{historyTotalPages}
              </span>
              <button
                type="button"
                disabled={historyLoading || historyPage + 1 >= historyTotalPages}
                onClick={() => loadHistory(historyPage + 1)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trang sau
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">2. Kết quả chấm điểm</h2>
              {result?.sessionId ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Session: {result.sessionId}
                </span>
              ) : null}
            </div>

            {detailError ? (
              <p className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {detailError}
              </p>
            ) : null}

            {isScoring || detailLoading ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
                  <p className="mt-3 text-sm font-medium text-slate-600">AI đang phân tích CV...</p>
                </div>
              </div>
            ) : null}

            {!isScoring && !detailLoading && !result ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
                <FileText className="h-8 w-8 text-slate-400" />
                <p className="mt-3 text-sm font-semibold text-slate-700">Chưa có kết quả chấm điểm</p>
                <p className="mt-1 text-sm text-slate-500">Upload CV và bắt đầu chấm điểm để xem kết quả tại đây.</p>
              </div>
            ) : null}

            {!isScoring && !detailLoading && result ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Tổng điểm CV</p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-4xl font-bold text-slate-900">{typeof totalScore === 'number' ? totalScore : '--'}</span>
                    <span className="pb-1 text-sm font-medium text-slate-500">/ 100</span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Định dạng</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{typeof result?.formatScore === 'number' ? result.formatScore : '--'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mục</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{typeof result?.sectionScore === 'number' ? result.sectionScore : '--'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Từ khóa</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{typeof result?.keywordScore === 'number' ? result.keywordScore : '--'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nội dung</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{typeof result?.contentScore === 'number' ? result.contentScore : '--'}</p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                    <p className="mb-2 text-sm font-semibold text-emerald-700">Điểm mạnh</p>
                    {strengths.length === 0 ? (
                      <p className="text-sm text-slate-500">Không có dữ liệu.</p>
                    ) : (
                      <ul className="space-y-2">
                        {strengths.map((item, index) => (
                          <li key={`strength-${index}`} className="text-sm text-slate-700">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="rounded-2xl border border-rose-100 bg-white p-4">
                    <p className="mb-2 text-sm font-semibold text-rose-700">Điểm yếu</p>
                    {weaknesses.length === 0 ? (
                      <p className="text-sm text-slate-500">Không có dữ liệu.</p>
                    ) : (
                      <ul className="space-y-2">
                        {weaknesses.map((item, index) => (
                          <li key={`weakness-${index}`} className="text-sm text-slate-700">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {(missingKeywords.length > 0 || missingSections.length > 0 || detectedSkills.length > 0) ? (
                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4">
                      <p className="mb-2 text-sm font-semibold text-amber-700">Từ khóa thiếu</p>
                      {missingKeywords.length === 0 ? (
                        <p className="text-sm text-slate-500">Không có dữ liệu.</p>
                      ) : (
                        <ul className="space-y-1">
                          {missingKeywords.map((item, index) => (
                            <li key={`missing-keyword-${index}`} className="text-sm text-slate-700">• {item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4">
                      <p className="mb-2 text-sm font-semibold text-rose-700">Mục còn thiếu</p>
                      {missingSections.length === 0 ? (
                        <p className="text-sm text-slate-500">Không có dữ liệu.</p>
                      ) : (
                        <ul className="space-y-1">
                          {missingSections.map((item, index) => (
                            <li key={`missing-section-${index}`} className="text-sm text-slate-700">• {item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                      <p className="mb-2 text-sm font-semibold text-blue-700">Kỹ năng phát hiện</p>
                      {detectedSkills.length === 0 ? (
                        <p className="text-sm text-slate-500">Không có dữ liệu.</p>
                      ) : (
                        <ul className="space-y-1">
                          {detectedSkills.slice(0, 10).map((item, index) => (
                            <li key={`detected-skill-${index}`} className="text-sm text-slate-700">• {item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ) : null}

                {suggestions.length > 0 ? (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                    <p className="mb-2 text-sm font-semibold text-blue-700">Gợi ý cải thiện</p>
                    <ul className="space-y-2">
                      {suggestions.map((item, index) => (
                        <li key={`improvement-${index}`} className="text-sm text-slate-700">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {details.length > 0 ? (
                  <div>
                    <p className="mb-3 text-sm font-semibold text-slate-800">Chi tiết tiêu chí</p>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Tiêu chí</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Điểm</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Nhận xét</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {details.map((detail, index) => (
                            <tr key={`${detail.criteriaKey || 'criteria'}-${index}`}>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">{detail.criteriaName || detail.criteriaKey || '--'}</td>
                              <td className="px-4 py-3 text-sm text-slate-700">{typeof detail.score === 'number' ? detail.score : '--'}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{detail.feedback || detail.suggestion || '--'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
