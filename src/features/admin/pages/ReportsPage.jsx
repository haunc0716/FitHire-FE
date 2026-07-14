import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CreditCard,
  FileDown,
  FileSpreadsheet,
  Loader2,
  Package,
  Target,
  Users,
} from 'lucide-react';
import { getAdminUsers } from '../services/userApi';
import { getAdminSubscriptions } from '../services/subscriptionApi';
import { getAdminPayments } from '../services/paymentApi';
import {
  downloadStartupPerformanceExcel,
  downloadStartupPerformancePdf,
  previewStartupPerformanceReport,
} from '../services/reportExportApi';

const REPORT_SECTIONS = [
  { key: 'users', label: 'Thống kê người dùng' },
  { key: 'revenue', label: 'Doanh thu' },
  { key: 'paidCustomers', label: 'Khách hàng trả phí' },
  { key: 'usage', label: 'Mức độ sử dụng tính năng' },
  { key: 'survey', label: 'Khảo sát trải nghiệm' },
  { key: 'kpi', label: 'Mức độ đạt KPI' },
  { key: 'transactions', label: 'Giao dịch gần đây' },
];

function formatMoney(value, currency = 'VND') {
  const num = Number(value);
  if (!Number.isFinite(num)) return value ?? '-';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(num);
}

function formatDate(value) {
  if (!value) return 'N/A';
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

function achievementText(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '--';
  return `${num.toFixed(1)}%`;
}

function extractPlanLabel(payment) {
  return (
    payment?.plan?.name ||
    payment?.planName ||
    payment?.subscriptionName ||
    payment?.packageName ||
    payment?.productName ||
    payment?.plan ||
    'N/A'
  );
}

function toDateInputValue(date) {
  return date.toISOString().slice(0, 10);
}

function getDefaultReportForm() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    fromDate: toDateInputValue(firstDay),
    toDate: toDateInputValue(now),
    targetUsers: 100,
    targetRevenue: 5000000,
    targetPaidCustomers: 20,
    targetCvAnalyses: 100,
    targetMockInterviews: 50,
    sections: REPORT_SECTIONS.map((section) => section.key),
  };
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportForm, setReportForm] = useState(getDefaultReportForm);
  const [reportPreview, setReportPreview] = useState(null);
  const [reportError, setReportError] = useState('');
  const [isPreviewingReport, setIsPreviewingReport] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    Promise.all([getAdminUsers(), getAdminSubscriptions(), getAdminPayments()])
      .then(([usersData, subsData, paymentsData]) => {
        if (!isMounted) return;
        setUsers(Array.isArray(usersData) ? usersData : usersData?.items || usersData?.content || []);
        setSubscriptions(Array.isArray(subsData) ? subsData : subsData?.items || subsData?.content || []);
        setPayments(Array.isArray(paymentsData) ? paymentsData : paymentsData?.items || paymentsData?.content || []);
      })
      .catch((error) => {
        console.error('Không tải được dữ liệu báo cáo:', error);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const activeSubs = subscriptions.filter((s) => s.status === 'ACTIVE' || s.status === 'PENDING').length;
    const successPayments = payments.filter((p) => ['SUCCESS', 'COMPLETED'].includes(String(p.status).toUpperCase()));
    const totalRevenue = successPayments.reduce((sum, p) => {
      const value = Number(p.amount ?? p.totalAmount ?? p.price ?? p.paidAmount ?? 0);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

    return {
      totalUsers: users.length,
      activeSubs,
      totalPayments: payments.length,
      totalRevenue,
    };
  }, [users, subscriptions, payments]);

  const latestPayments = useMemo(() => (
    [...payments]
      .sort((a, b) => new Date(b.createdAt || b.paidAt || 0).getTime() - new Date(a.createdAt || a.paidAt || 0).getTime())
      .slice(0, 50)
  ), [payments]);

  const totalPages = Math.max(1, Math.ceil(latestPayments.length / pageSize));
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return latestPayments.slice(start, start + pageSize);
  }, [currentPage, latestPayments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [latestPayments.length]);

  const buildReportPayload = () => ({
    ...reportForm,
    targetUsers: Number(reportForm.targetUsers) || 0,
    targetRevenue: Number(reportForm.targetRevenue) || 0,
    targetPaidCustomers: Number(reportForm.targetPaidCustomers) || 0,
    targetCvAnalyses: Number(reportForm.targetCvAnalyses) || 0,
    targetMockInterviews: Number(reportForm.targetMockInterviews) || 0,
  });

  const updateReportField = (field, value) => {
    setReportForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleReportSection = (sectionKey) => {
    setReportForm((prev) => {
      const selected = new Set(prev.sections);
      if (selected.has(sectionKey)) {
        selected.delete(sectionKey);
      } else {
        selected.add(sectionKey);
      }
      return {
        ...prev,
        sections: Array.from(selected),
      };
    });
  };

  const handlePreviewReport = async () => {
    setIsPreviewingReport(true);
    setReportError('');
    try {
      setReportPreview(await previewStartupPerformanceReport(buildReportPayload()));
    } catch (error) {
      console.error(error);
      setReportError(error?.message || 'Không thể tạo bản xem trước báo cáo.');
    } finally {
      setIsPreviewingReport(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setReportError('');
    try {
      const blob = await downloadStartupPerformancePdf(buildReportPayload());
      downloadBlob(blob, 'fithire-startup-performance-report.pdf');
    } catch (error) {
      console.error(error);
      setReportError(error?.message || 'Không thể xuất PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    setIsGeneratingExcel(true);
    setReportError('');
    try {
      const blob = await downloadStartupPerformanceExcel(buildReportPayload());
      downloadBlob(blob, 'fithire-startup-performance-report.xlsx');
    } catch (error) {
      console.error(error);
      setReportError(error?.message || 'Không thể xuất Excel.');
    } finally {
      setIsGeneratingExcel(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Báo cáo & phân tích</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng quan dữ liệu hệ thống, giao dịch và báo cáo vận hành.</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <Target className="h-3.5 w-3.5" />
              Báo cáo hiệu quả vận hành
            </div>
            <h2 className="text-lg font-bold text-gray-900">Trình tạo báo cáo kinh doanh</h2>
            <p className="mt-1 max-w-3xl text-sm text-gray-500">
              Tổng hợp người dùng, doanh thu, khách hàng trả phí, mức độ sử dụng tính năng, khảo sát trải nghiệm, KPI và phụ lục giao dịch để xuất PDF hoặc Excel.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePreviewReport}
              disabled={isPreviewingReport}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
            >
              {isPreviewingReport ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
              Xem trước
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {isGeneratingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              Xuất PDF
            </button>
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={isGeneratingExcel}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-gray-900/10 transition hover:bg-gray-800 disabled:opacity-60"
            >
              {isGeneratingExcel ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
              Xuất Excel
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.35fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            <ReportInput label="Từ ngày" type="date" value={reportForm.fromDate} onChange={(value) => updateReportField('fromDate', value)} />
            <ReportInput label="Đến ngày" type="date" value={reportForm.toDate} onChange={(value) => updateReportField('toDate', value)} />
            <ReportInput label="Mục tiêu người dùng" type="number" value={reportForm.targetUsers} onChange={(value) => updateReportField('targetUsers', value)} />
            <ReportInput label="Mục tiêu doanh thu" type="number" value={reportForm.targetRevenue} onChange={(value) => updateReportField('targetRevenue', value)} />
            <ReportInput label="Mục tiêu khách hàng trả phí" type="number" value={reportForm.targetPaidCustomers} onChange={(value) => updateReportField('targetPaidCustomers', value)} />
            <ReportInput label="Mục tiêu chấm CV" type="number" value={reportForm.targetCvAnalyses} onChange={(value) => updateReportField('targetCvAnalyses', value)} />
            <ReportInput label="Mục tiêu phỏng vấn mô phỏng" type="number" value={reportForm.targetMockInterviews} onChange={(value) => updateReportField('targetMockInterviews', value)} />
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Nội dung báo cáo</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {REPORT_SECTIONS.map((section) => (
                  <label
                    key={section.key}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={reportForm.sections.includes(section.key)}
                      onChange={() => toggleReportSection(section.key)}
                      className="h-4 w-4 accent-emerald-600"
                    />
                    {section.label}
                  </label>
                ))}
              </div>
            </div>

            {reportError ? (
              <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {reportError}
              </div>
            ) : null}

            {reportPreview ? (
              <div className="grid gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:grid-cols-3">
                <PreviewMetric label="Người dùng" value={reportPreview.totalUsers} sub={achievementText(reportPreview.userAchievement)} />
                <PreviewMetric label="Doanh thu" value={formatMoney(reportPreview.revenue)} sub={achievementText(reportPreview.revenueAchievement)} />
                <PreviewMetric label="Khách hàng trả phí" value={reportPreview.paidCustomers} sub={achievementText(reportPreview.paidCustomerAchievement)} />
                <PreviewMetric label="Chấm CV" value={reportPreview.cvAnalyses} sub={achievementText(reportPreview.cvAnalysisAchievement)} />
                <PreviewMetric label="Phỏng vấn mô phỏng" value={reportPreview.mockInterviews} sub={achievementText(reportPreview.mockInterviewAchievement)} />
                <PreviewMetric label="Khảo sát" value={reportPreview.surveyResponses} sub={`${formatNumber(reportPreview.averageSatisfaction)}/5`} />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm font-medium text-gray-500">
                Bấm Xem trước để xem nhanh số liệu trước khi xuất file.
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang tải dữ liệu báo cáo...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Người dùng" value={stats.totalUsers} icon={Users} iconClass="text-emerald-500" />
            <MetricCard label="Gói hoạt động" value={stats.activeSubs} icon={Package} iconClass="text-blue-500" />
            <MetricCard label="Tổng giao dịch" value={stats.totalPayments} icon={BarChart3} iconClass="text-amber-500" />
            <MetricCard label="Doanh thu" value={formatMoney(stats.totalRevenue)} icon={CreditCard} iconClass="text-rose-500" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Giao dịch gần đây</h2>
            </div>
            {latestPayments.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">Chưa có giao dịch nào.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 font-bold">Mã</th>
                      <th className="px-6 py-3 font-bold">Gói</th>
                      <th className="px-6 py-3 font-bold">Số tiền</th>
                      <th className="px-6 py-3 font-bold">Trạng thái</th>
                      <th className="px-6 py-3 font-bold">Ngày</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900">{payment.id}</td>
                        <td className="px-6 py-4 text-gray-600">{extractPlanLabel(payment)}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{formatMoney(payment.amount ?? payment.totalAmount ?? payment.price)}</td>
                        <td className="px-6 py-4 text-gray-600">{payment.status || 'KHÔNG RÕ'}</td>
                        <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(payment.createdAt || payment.paidAt || payment.updatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {latestPayments.length > pageSize && (
              <div className="flex items-center justify-between gap-4 border-t border-gray-100 px-6 py-4">
                <p className="text-xs font-medium text-gray-500">
                  Trang {currentPage}/{totalPages} - Hiển thị {paginatedPayments.length} / {latestPayments.length} giao dịch
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage <= 1}
                    className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-xs font-semibold"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-xs font-semibold"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ReportInput({ label, type, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">{label}</span>
      <input
        type={type}
        min={type === 'number' ? '0' : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-emerald-500 focus:bg-white"
      />
    </label>
  );
}

function PreviewMetric({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-white bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs font-semibold text-emerald-700">{sub}</p>
    </div>
  );
}

function MetricCard({ label, value, icon, iconClass }) {
  const Icon = icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        <Icon className={`w-4 h-4 ${iconClass}`} />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
