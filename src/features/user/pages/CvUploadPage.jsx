import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';

export default function CvUploadPage() {
  const [uploads, setUploads] = useState([]);

  const handleFiles = (files) => {
    const mapped = Array.from(files || []).map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      fileName: file.name,
      sizeKb: Math.round(file.size / 1024),
      uploadedAt: new Date().toLocaleString('vi-VN'),
    }));

    setUploads((prev) => [...mapped, ...prev]);
  };

  const hasUpload = useMemo(() => uploads.length > 0, [uploads]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-emerald-100 bg-white/85 p-6">
        <h1 className="font-display text-3xl font-bold text-emerald-950">Upload CV để chấm</h1>
        <p className="mt-2 text-sm text-emerald-900/70">Kéo thả file PDF/DOCX hoặc chọn từ máy để bắt đầu quy trình phân tích.</p>

        <label className="mt-5 block cursor-pointer rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-10 text-center transition hover:border-emerald-400 hover:bg-emerald-50">
          <UploadCloud className="mx-auto h-8 w-8 text-emerald-700" />
          <p className="mt-3 text-sm font-medium text-emerald-900">Nhấp để chọn file hoặc kéo thả vào đây</p>
          <p className="mt-1 text-xs text-emerald-700/70">Hỗ trợ PDF, DOCX (v1: mô phỏng lưu local state)</p>
          <input type="file" className="hidden" accept=".pdf,.doc,.docx" multiple onChange={(e) => handleFiles(e.target.files)} />
        </label>

        {hasUpload && (
          <Link to="/user/cv-jd" className="mt-4 inline-flex rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            Chuyển sang chấm CV theo JD
          </Link>
        )}
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white/85 p-6">
        <h2 className="font-display text-xl font-semibold text-emerald-950">Lịch sử upload gần đây</h2>
        <div className="mt-4 space-y-2 text-sm">
          {uploads.length === 0 && <p className="text-emerald-800/70">Chưa có file nào được upload trong phiên này.</p>}
          {uploads.map((item) => (
            <div key={item.id} className="rounded-2xl border border-emerald-100 bg-emerald-50/35 p-3 text-emerald-900">
              <p className="font-medium">{item.fileName}</p>
              <p className="text-xs text-emerald-700/70">{item.sizeKb} KB • {item.uploadedAt}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
