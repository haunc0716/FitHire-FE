import React from 'react';
import { Check } from 'lucide-react';

const ProcessFeatures = () => {
  return (
    <section className="max-w-[1200px] mx-auto mb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feature Card */}
        <div className="lg:col-span-8 bg-slate-50 p-10 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="font-h2 text-h2 text-on-surface mb-6">Công cụ Khớp nối Chính xác</h2>
            <p className="text-on-surface-variant mb-8 text-lg">Thuật toán độc quyền của chúng tôi không chỉ tìm từ khóa; nó thấu hiểu bối cảnh ngữ nghĩa trong hành trình sự nghiệp của ứng viên.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
                </div>
                <span className="text-on-surface font-semibold">98% Chính xác trong nhận diện kỹ năng</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
                </div>
                <span className="text-on-surface font-semibold">Khung đánh giá không định kiến</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 rounded-xl overflow-hidden h-72 shadow-xl border border-slate-200 bg-white">
            <img alt="Logic AI" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs0byRbsfr8XA3XFG_r89BdDGVoRzKBImgZgkDvsI91FufD56Ae4GYv0MOvidZ4QSL2wkJTuCMKuC2pafFCUTqyADLjV6ob0JIivdr7RSfuhoX8C0dnn8OwioDwpA2cFzXIfE1oGfr8P3AcHoVrj0Ofwt-dl1OMoT_JxWDmpLqt8NOasfe_8FLLpUKiY2-DNFJSlrgUyRAtGEqWMCUHGAcTloJPY92_gRiUjY0roBO1iEiD4LERWoLZrCAwwU4oPcEkHIi0WumWNc" />
          </div>
        </div>
        {/* Secondary Cards */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-violet-600 p-10 rounded-2xl text-white flex-1 flex flex-col justify-center">
            <h3 className="text-4xl font-extrabold mb-2">Nhanh hơn 85%</h3>
            <p className="text-violet-100 text-lg">Giảm thiểu thời gian sàng lọc ban đầu cho đội ngũ nhân sự.</p>
          </div>
          <div className="bg-white border border-slate-200 p-10 rounded-2xl flex-1 flex flex-col justify-center shadow-sm">
            <h3 className="font-h3 text-h3 text-on-surface mb-2">Cloud-Native</h3>
            <p className="text-on-surface-variant text-lg">Bảo mật, linh hoạt và sẵn sàng cho nhu cầu tuyển dụng toàn cầu.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessFeatures;
