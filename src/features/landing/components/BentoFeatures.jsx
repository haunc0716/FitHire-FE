import React from 'react';

const BentoFeatures = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* CV Optimization */}
      <div className="md:col-span-8 premium-card rounded-xl p-10 overflow-hidden relative group">
        <div className="flex flex-col md:flex-row gap-12 h-full">
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              <span className="material-symbols-outlined text-3xl" data-icon="description">description</span>
            </div>
            <h2 className="font-h2 text-h2 mb-6">Tối ưu hóa CV</h2>
            <p className="font-body-md text-on-surface-variant mb-8 leading-relaxed">AI của chúng tôi phân tích CV của bạn so với hàng ngàn hồ sơ thành công để đề xuất các từ khóa tác động cao và điều chỉnh định dạng giúp vượt qua bộ lọc ATS.</p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-body-md font-medium">
                <span className="material-symbols-outlined text-primary text-xl" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Bản đồ từ khóa ngữ nghĩa
              </li>
              <li className="flex items-center gap-3 text-body-md font-medium">
                <span className="material-symbols-outlined text-primary text-xl" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Điểm số tác động định lượng
              </li>
            </ul>
          </div>
          <div className="flex-1 relative min-h-[340px]">
            <div className="absolute inset-0 bg-slate-50 rounded-2xl flex items-center justify-center p-4">
              <img alt="Phân tích CV bằng AI" className="w-full h-full object-cover rounded-xl shadow-2xl group-hover:scale-[1.03] transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwPJgGJks3daojhu40cxH6B3-VpQBEzPozON-0bDjE3HnoIVZeMtaEQlty0bx6jH94vwFZSYTmgLZnw-4KrAJzNxSQFzFJUu67xrxVVPj-iBX0GIK4ILZKwnm9hdL4ehmuYprPOf6xG7kTb5uiKgZpnkKZuiX0nDucVc7RJ-NQzhlHcxZY3rIbtSCvYJ_UTlvhXM-fuMUK1V2Op8-75cc6x8E_cb6S2X9JP6DaHX_zkSYlHLcwZ-0Pkkty6JSFurPp26GBqx06ULU" />
            </div>
          </div>
        </div>
      </div>

      {/* Mock Interview */}
      <div className="md:col-span-4 premium-card rounded-xl p-10 group">
        <div className="w-14 h-14 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary mb-8 group-hover:bg-secondary group-hover:text-white transition-colors duration-500">
          <span className="material-symbols-outlined text-3xl" data-icon="videocam">videocam</span>
        </div>
        <h3 className="font-h3 text-h3 mb-6">Phỏng vấn thử</h3>
        <p className="font-body-md text-on-surface-variant mb-10 leading-relaxed">Thực hành với người phỏng vấn AI đầy thấu cảm. Nhận phản hồi thời gian thực về tông giọng, ngôn ngữ cơ thể và cấu trúc câu trả lời.</p>
        <div className="aspect-[4/3] bg-slate-50 rounded-2xl overflow-hidden relative">
          <img alt="Phỏng vấn trực tuyến" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9OLFvw7lGdpnbQ3q0-jSZ8jXfGMyT4Q_lXZ3N-pzg_Jzsz1_TQqkm2HWtS0uIByUdwmLWlnJ8iE_ws_T3SdIJltAgfwd-Ls3l7Q13ydTL5EneTSJnP4-FXKvf1cwAG_hiv8NlAD0rVMU8WpXC8EAFkGS02JWgHhBCvpD6AbpGEsN9xSYUPkgwTCzSrWka7Ea1sCXW8uAIJbuXKE1UA9bD1Y90PKTgJWcQDUdX5cl9QnAimM2ereSBvUIkF04__3f34gsNmaJkMYo" />
          <div className="absolute bottom-6 left-6 right-6 flex gap-3">
            <div className="h-1.5 flex-1 bg-white/40 rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-2/3"></div>
            </div>
            <div className="h-1.5 flex-1 bg-white/40 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-white/40 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Cultural Fit */}
      <div className="md:col-span-5 premium-card rounded-xl p-10 group">
        <div className="w-14 h-14 bg-tertiary-container/5 rounded-2xl flex items-center justify-center text-tertiary mb-8 group-hover:bg-tertiary group-hover:text-white transition-colors duration-500">
          <span className="material-symbols-outlined text-3xl" data-icon="hub">hub</span>
        </div>
        <h3 className="font-h3 text-h3 mb-6">Phân tích sự phù hợp văn hóa</h3>
        <p className="font-body-md text-on-surface-variant mb-10 leading-relaxed">Đánh giá các giá trị của bạn so với môi trường làm việc tiềm năng bằng hệ thống bản đồ biểu đồ radar độc quyền của chúng tôi.</p>
        <div className="flex items-center justify-center py-6">
          <div className="relative w-56 h-56">
            <div className="absolute inset-0 border border-slate-100 rounded-full"></div>
            <div className="absolute inset-8 border border-slate-100 rounded-full"></div>
            <div className="absolute inset-16 border border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 bg-primary/10 rounded-full group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000" style={{ clipPath: "polygon(50% 0%, 100% 38%, 81% 91%, 19% 91%, 0% 38%)" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* More Features Grid */}
      <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="premium-card rounded-xl p-8 group">
          <span className="material-symbols-outlined text-primary text-3xl mb-6 block" data-icon="speed">speed</span>
          <h4 className="font-bold text-lg mb-3">Phản hồi tức thì</h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">Nhận báo cáo toàn diện trong vòng 60 giây sau khi nộp bất kỳ yêu cầu nào.</p>
        </div>
        <div className="premium-card rounded-xl p-8 group">
          <span className="material-symbols-outlined text-secondary text-3xl mb-6 block" data-icon="groups">groups</span>
          <h4 className="font-bold text-lg mb-3">Cố vấn chuyên gia</h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">Kết nối với các chuyên gia trong ngành để được xác thực trực tiếp bởi con người.</p>
        </div>
        <div className="premium-card rounded-xl p-8 group">
          <span className="material-symbols-outlined text-tertiary text-3xl mb-6 block" data-icon="insights">insights</span>
          <h4 className="font-bold text-lg mb-3">Xu hướng thị trường</h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">Cập nhật mức lương thực tế và theo dõi nhu cầu kỹ năng trong thời gian thực.</p>
        </div>
        <div className="premium-card rounded-xl p-8 group">
          <span className="material-symbols-outlined text-error text-3xl mb-6 block" data-icon="security">security</span>
          <h4 className="font-bold text-lg mb-3">Bảo mật tối đa</h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">Dữ liệu của bạn được mã hóa và không bao giờ được bán cho bên thứ ba.</p>
        </div>
      </div>
    </div>
  );
};

export default BentoFeatures;
