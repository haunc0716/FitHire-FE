import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Làm cách nào để xác minh hồ sơ học tập của tôi?",
      answer: "Để xác minh hồ sơ, hãy tải lên thẻ sinh viên hoặc bảng điểm chính thức trong tab 'Xác minh' ở phần cài đặt hồ sơ. Đội ngũ của chúng tôi thường xem xét trong vòng 24-48 giờ làm việc."
    },
    {
      question: "Có bất kỳ khoản phí nào dành cho sinh viên không?",
      answer: "FitHire hoàn toàn miễn phí cho sinh viên và các chuyên gia mới tốt nghiệp. Chúng tôi tin vào việc loại bỏ rào cản gia nhập cho các tài năng trẻ."
    },
    {
      question: "Công ty có thể liên hệ với tôi bằng cách nào?",
      answer: "Các công ty đã được xác minh có thể gửi cho bạn 'Cơ hội trực tiếp' dựa trên mức độ phù hợp về kỹ năng. Bạn sẽ nhận được thông báo qua email và trong bảng điều khiển FitHire."
    },
    {
      question: "Tôi có thể ứng tuyển nhiều vị trí cùng lúc không?",
      answer: "Có, không có giới hạn về số lượng đơn ứng tuyển. Tuy nhiên, chúng tôi khuyên bạn nên tập trung vào các vai trò phù hợp nhất với kỹ năng và mục tiêu nghề nghiệp hiện tại."
    }
  ];

  return (
    <section className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-h2 text-h2 mb-4">Câu hỏi thường gặp</h2>
        <p className="text-on-surface-variant">Mọi thứ bạn cần biết về nền tảng và quy trình của chúng tôi.</p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white faq-item rounded-2xl border border-slate-200 transition-all overflow-hidden">
            <button
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              className="w-full flex justify-between items-center p-6 text-left group"
            >
              <span className="font-semibold text-lg text-slate-800">{faq.question}</span>
              <Plus className={`text-outline group-hover:text-primary transition-all duration-300 w-6 h-6 ${activeIndex === index ? 'rotate-45' : ''}`} />
            </button>
            <div className={`px-6 pb-6 text-on-surface-variant font-body-md leading-relaxed transition-all duration-300 ${activeIndex === index ? 'block' : 'hidden'}`}>
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
