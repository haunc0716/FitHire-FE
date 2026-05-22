import React from 'react';
import { Video } from 'lucide-react';

export default function InterviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Phiên phỏng vấn mô phỏng</h1>
        <p className="text-sm text-gray-500 mt-1">Xem bản ghi, transcript và phản hồi từ AI cho từng phiên phỏng vấn.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
          <Video className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Kho lưu video và transcript</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Bảng điều khiển quản lý phỏng vấn mô phỏng và nhật ký đánh giá AI sẽ sớm có tại đây.
        </p>
      </div>
    </div>
  );
}
