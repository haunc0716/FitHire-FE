const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runCvJdScoring({ jdText, cvId }) {
  await wait(500);
  const base = Math.min(95, 68 + Math.floor((jdText?.length ?? 0) / 18));

  return {
    score: cvId ? base : base - 8,
    strengths: [
      'Từ khóa kỹ năng trùng khớp tốt với JD',
      'Kinh nghiệm dự án thể hiện rõ kết quả đo lường',
      'Bố cục CV dễ đọc, có trọng tâm theo vị trí ứng tuyển',
    ],
    gaps: [
      'Thiếu số liệu cụ thể ở một số bullet thành tích',
      'Chưa làm rõ mức độ sở hữu end-to-end cho dự án lớn',
    ],
    suggestions: [
      'Bổ sung 2-3 thành tựu có số liệu impact trong 2 năm gần nhất',
      'Nhấn mạnh stack phù hợp với JD ngay ở phần tóm tắt đầu CV',
      'Thêm mục kỹ năng mềm liên quan collaboration và ownership',
    ],
  };
}

export async function runCulturalFitScoring({ companyValues, industry }) {
  await wait(450);
  return {
    score: companyValues.length >= 2 ? 84 : 76,
    fitSignals: [
      `Phong cách làm việc phù hợp môi trường ${industry}`,
      'Ưu tiên học hỏi liên tục và chia sẻ tri thức trong team',
      'Có thiên hướng làm việc dựa trên dữ liệu và phản hồi nhanh',
    ],
    risks: [
      'Cần tăng mức độ chủ động lãnh đạo mini-project liên phòng ban',
      'Nên làm rõ thêm thành tích mentor/coaching trong hồ sơ cá nhân',
    ],
  };
}

export async function generateMockInterviewPlan({ role, level }) {
  await wait(350);
  return {
    role,
    level,
    stages: [
      'Mở đầu 5 phút: giới thiệu bản thân theo câu chuyện nghề nghiệp',
      'Technical deep-dive 20 phút: xử lý tình huống sát JD',
      'Behavioral 15 phút: STAR framework cho teamwork và conflict',
      'Q&A 10 phút: đặt câu hỏi ngược cho nhà tuyển dụng',
    ],
  };
}
