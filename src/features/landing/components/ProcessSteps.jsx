import React from 'react';
import { UploadCloud, Microscope, BarChart3 } from 'lucide-react';

const ProcessSteps = () => {
  return (
    <section className="max-w-[1200px] mx-auto relative mb-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        {/* Step 1 */}
        <div className="group relative">
          <div className="absolute inset-0 bg-violet-50 rounded-2xl scale-95 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100 -z-10"></div>
          <div className="p-8 rounded-2xl transition-all duration-500">
            <div className="w-14 h-14 bg-violet-600 text-white rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-violet-200">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div className="font-label-caps text-label-caps text-violet-400 mb-3">BƯỚC 01</div>
            <h3 className="font-h3 text-h3 text-on-surface mb-4">Tải lên JD</h3>
            <p className="text-on-surface-variant mb-8 leading-relaxed">Chỉ cần tải lên mô tả công việc. AI của chúng tôi sẽ tự động phân tích các kỹ năng cốt lõi, yêu cầu kỹ thuật và kỹ năng mềm.</p>
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 bg-white">
              <img alt="Giao diện tải lên" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB59Lv4qwI6lH6f37RkBCPKrLgB1IHBIEe6fD4jgcgOoErUDKq5V28tp9fJX6FNm98zCgsgOHdF7MBYPgvdudI3hYJm18oxFp0XWYyWFpQr44B9QoPPBekxRmFfhEupWkwOlxqh_pyZMURs3i2PbxajOJE8DTWkidhtUiVOvwtThp_UDAygxH-BORkQNhKZAag6QE6guRQl5NUfiQ1wBHf0jNRfDfebFLdc9_vbxc8AGI_RBhsOVeDzhVUGDAlEDMXsyIfHxSrN31E" />
            </div>
          </div>
        </div>
        {/* Step 2 */}
        <div className="group relative">
          <div className="absolute inset-0 bg-violet-50 rounded-2xl scale-95 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100 -z-10"></div>
          <div className="p-8 rounded-2xl transition-all duration-500">
            <div className="w-14 h-14 bg-violet-600 text-white rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-violet-200">
              <Microscope className="w-7 h-7" />
            </div>
            <div className="font-label-caps text-label-caps text-violet-400 mb-3">BƯỚC 02</div>
            <h3 className="font-h3 text-h3 text-on-surface mb-4">Quét CV</h3>
            <p className="text-on-surface-variant mb-8 leading-relaxed">Tải lên hàng loạt CV ứng viên. Chúng tôi thực hiện phân tích ngữ nghĩa sâu, vượt xa các từ khóa để tìm thấy kinh nghiệm thực tế.</p>
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 bg-white">
              <img alt="Giao diện quét CV" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGTnQu1ReJmTqfdobT0Oybu71hBq-JEz5L28SxvYq63XWwXB70T8GyGokXoA4vLE_tMWIzJOARSlZjqkXSqLYLi6MpV-B_ZFyoR9ZzYNm2h5GXNYE0SjFR_tC3hUckn4M1a-GI03LTLERMgfMcu4hDxyawQyjLO-Ukpfy7WiuwY-m3SdR0sZTEoT6qPcZNQixNz6_Lq8P43XETgPHgjOEdI6QUBctsLiVbOQGe2vLwCp57JW3UuiH2R2fazMC7LR15NN4boBYl84Q" />
            </div>
          </div>
        </div>
        {/* Step 3 */}
        <div className="group relative">
          <div className="absolute inset-0 bg-violet-50 rounded-2xl scale-95 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100 -z-10"></div>
          <div className="p-8 rounded-2xl transition-all duration-500">
            <div className="w-14 h-14 bg-violet-600 text-white rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-violet-200">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div className="font-label-caps text-label-caps text-violet-400 mb-3">BƯỚC 03</div>
            <h3 className="font-h3 text-h3 text-on-surface mb-4">Nhận Điểm Phù Hợp</h3>
            <p className="text-on-surface-variant mb-8 leading-relaxed">Nhận Điểm Phù Hợp chi tiết cho mỗi ứng viên, làm nổi bật các thế mạnh và khoảng trống kỹ năng tiềm năng so với JD.</p>
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 bg-white">
              <img alt="Giao diện kết quả" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8bmErGGNNh61svRSKK7t2jxQofrIKcvTvIMi2cQi_brUYBmabdF2MpDIe9R31MRiSGVPyuUyixpXNxdjEXUU9yPcGf6o-RL2vyd5tikRRlQAliyPVN5FP4YP6DRb-YNW8uc2R0O34NXb2qXBVoGrzk--czeL1FrznqrvX5J6ccvMNis9T1HXcXgBEl5g698txSQGc5O3Kvg_rsDlFg_Z2zXFricim5-Yjy7NyNw5B5XoWHF-uG6Od9BGxmv2Q8TeNmGVHpSh5GXc" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
