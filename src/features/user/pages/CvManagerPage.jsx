import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreVertical, Download, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { fetchMyCvs } from '../services/userApi';
import { useToast } from '../../../components/ui/ToastProvider';

function formatDateLabel(value) {
  if (!value) return 'Chưa có cập nhật';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa có cập nhật';
  return `Cập nhật ${date.toLocaleString('vi-VN')}`;
}

function resolveCvTitle(cv) {
  return (
    cv?.title ||
    cv?.name ||
    cv?.originalFileName ||
    cv?.fileName ||
    (cv?.id ? `CV #${cv.id}` : 'CV không tên')
  );
}

function resolveCvThumbnail(cv) {
  return (
    cv?.thumbnailUrl ||
    cv?.previewUrl ||
    cv?.fileUrl ||
    '/images/cv-analysis.png'
  );
}

function resolveCvStatus(cv) {
  const raw = cv?.status || cv?.parseStatus || cv?.state;
  if (!raw) return 'Đã tải lên';
  return String(raw).replace(/_/g, ' ');
}

function resolveCvProgress(cv) {
  const candidate = cv?.completionPercent ?? cv?.progress ?? cv?.score;
  const numeric = Number(candidate);
  if (!Number.isFinite(numeric)) return null;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

export default function CvManagerPage() {
  const { showToast } = useToast();
  const [cvs, setCvs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError('');

    fetchMyCvs()
      .then((data) => {
        if (!isMounted) return;
        const items = Array.isArray(data) ? data : data?.items || data?.content || [];
        setCvs(items);
      })
      .catch((error) => {
        if (!isMounted) return;
        const message = error?.message || 'Không thể tải danh sách CV.';
        setLoadError(message);
        showToast({ type: 'error', title: 'Tải CV thất bại', message });
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const normalizedCvs = useMemo(() => (
    cvs.map((cv) => {
      const progress = resolveCvProgress(cv);
      return {
        id: cv?.id ?? `${Math.random()}`,
        title: resolveCvTitle(cv),
        updatedAt: formatDateLabel(cv?.updatedAt || cv?.createdAt || cv?.uploadedAt),
        status: resolveCvStatus(cv),
        thumbnail: resolveCvThumbnail(cv),
        isPrimary: Boolean(cv?.isPrimary || cv?.primary || cv?.isDefault),
        progress,
      };
    })
  ), [cvs]);

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] overflow-hidden font-body">
      
      {/* Background Bubbles */}
      <div className="absolute top-0 left-0 h-[500px] w-[500px] -translate-x-1/3 -translate-y-1/4 rounded-full bg-emerald-200/40 blur-[120px] z-0 pointer-events-none" />
      <div className="absolute top-40 right-0 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-indigo-200/30 blur-[100px] z-0 pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900 font-display">Quản lý CV</h1>
          <p className="text-stone-500 mt-1 text-sm">Cập nhật và quản lý các mẫu CV của bạn để sẵn sàng ứng tuyển.</p>
        </div>

        {/* Action Banner */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900">Tạo CV mới để gia tăng cơ hội!</h3>
              <p className="text-sm text-emerald-700 mt-0.5">Sử dụng các mẫu CV chuyên nghiệp của FitHire để ghi điểm với nhà tuyển dụng.</p>
            </div>
          </div>
          <button className="hidden sm:flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Tạo mới ngay
          </button>
        </div>

        {/* CV Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Create New Card */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="group flex flex-col items-center justify-center h-[340px] rounded-2xl border-2 border-dashed border-stone-300 bg-white hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors mb-4">
              <Plus className="h-8 w-8" />
            </div>
            <p className="font-bold text-stone-700 group-hover:text-emerald-700">Tạo CV mới</p>
            <p className="text-sm text-stone-500 mt-1">Nhiều mẫu chuẩn TopCV</p>
          </motion.div>

          {/* CV Items */}
          {isLoading ? (
            [1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[340px] rounded-2xl border border-stone-200 bg-white animate-pulse"
              />
            ))
          ) : loadError ? (
            <div className="col-span-full rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
              {loadError}
            </div>
          ) : normalizedCvs.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
              Bạn chưa có CV nào. Hãy tạo CV mới để bắt đầu.
            </div>
          ) : (
            normalizedCvs.map((cv) => (
            <motion.div 
              key={cv.id}
              whileHover={{ y: -4 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm hover:shadow-xl hover:border-stone-300 transition-all"
            >
              <div className="relative h-48 bg-stone-100 border-b border-stone-200 overflow-hidden">
                <img src={cv.thumbnail} alt={cv.title} className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity" />
                
                {/* Overlay actions on hover */}
                <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors" title="Xem trước">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors" title="Tải xuống">
                    <Download className="w-5 h-5" />
                  </button>
                </div>

                {cv.isPrimary && (
                  <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3 h-3" /> CV Chính
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-stone-900 text-base line-clamp-1">{cv.title}</h3>
                    <p className="text-xs text-stone-500 mt-1">{cv.updatedAt}</p>
                  </div>
                  <button className="text-stone-400 hover:text-stone-700">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-medium text-stone-600">{cv.status}</span>
                  </div>
                  {cv.progress != null && (
                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${cv.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}
