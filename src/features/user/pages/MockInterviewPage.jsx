import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic2,
  Sparkles,
  CheckCircle2,
  Video,
  ArrowRight,
  FileText,
  Send,
  StopCircle,
  Trash2,
  ChevronRight,
  Gift,
  X,
} from "lucide-react";
import {
  fetchMockInterviewDetail,
  fetchMockInterviewHistory,
  previewMockInterviewJd,
  speakMockInterviewText,
  startMockInterviewSession,
  submitMockInterviewFeedback,
  submitMockInterviewAnswer,
  fetchUserExperienceSurveyStatus,
  submitUserExperienceSurvey,
  transcribeMockInterviewVoice,
} from "../services/userApi";
import { useToast } from "../../../components/ui/ToastProvider";

const INITIAL_FEEDBACK_FORM = {
  overallRating: 5,
  realismRating: 5,
  questionQualityRating: 5,
  aiFeedbackRating: 5,
  likedMost: "",
  improvementSuggestion: "",
  additionalComment: "",
};

const INITIAL_SURVEY_FORM = {
  overallSatisfaction: 5,
  recommendationLikelihood: 5,
  cvAnalysisRating: 5,
  cvAnalysisUsefulness: 5,
  mockInterviewRating: 5,
  mockInterviewUsefulness: 5,
  careerRecommendationRating: 4,
  careerRecommendationUsefulness: 4,
  interfaceEase: 5,
  featureDiscoverability: 5,
  aiResponseSpeed: 5,
  aiResultClarity: 5,
  likedMost: "",
  dissatisfaction: "",
  desiredFeatures: "",
  userSegment: "",
  industry: "",
  realInterviewExperience: "",
};

const JD_MIN_LENGTH = 50;
const JD_MAX_LENGTH = 5000;

function normalizeJdKeywordText(value) {
  return (value ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

const JD_REQUIREMENT_ITEMS = [
  {
    key: "position",
    label: "Vị trí / vai trò",
    test: (value) =>
      /\b(developer|engineer|tester|qa|designer|analyst|manager|intern|fresher|junior|middle|senior|lead|frontend|backend|fullstack|data|devops|java|react|node|business analyst|ba)\b/i.test(
        value
      ) ||
      /(vi tri|vai tro|tuyen|ung tuyen|lap trinh|kiem thu|phan tich|thiet ke|quan ly)/i.test(
        value
      ),
  },
  {
    key: "responsibilities",
    label: "Trách nhiệm chính",
    test: (value) =>
      /\b(responsibilities|responsible|develop|build|design|implement|maintain|test|analyze|manage|support|collaborate)\b/i.test(
        value
      ) ||
      /(trach nhiem|cong viec|mo ta|phat trien|xay dung|thiet ke|trien khai|bao tri|kiem thu|phan tich|phoi hop)/i.test(
        value
      ),
  },
  {
    key: "skills",
    label: "Kỹ năng / yêu cầu",
    test: (value) =>
      /\b(requirements|skills|experience|proficient|knowledge|ability|familiar|years|communication|teamwork)\b/i.test(
        value
      ) ||
      /(yeu cau|ky nang|kinh nghiem|thanh thao|hieu biet|co kha nang|uu tien|giao tiep|lam viec nhom)/i.test(
        value
      ),
  },
  {
    key: "technology",
    label: "Công nghệ / lĩnh vực",
    test: (value) =>
      /\b(java|spring|react|typescript|javascript|node|sql|postgres|mysql|mongodb|api|rest|aws|docker|kubernetes|git|figma|excel|python|machine learning|database)\b/i.test(
        value
      ),
  },
];

function analyzeMockInterviewJd(value) {
  const text = value?.trim?.() ?? "";
  const searchableText = normalizeJdKeywordText(text);
  const matched = JD_REQUIREMENT_ITEMS.filter((item) =>
    item.test(searchableText)
  ).map((item) => item.key);

  return {
    length: text.length,
    matched,
    missing: JD_REQUIREMENT_ITEMS.filter(
      (item) => !matched.includes(item.key)
    ),
    isLongEnough: text.length >= JD_MIN_LENGTH,
    isWithinLimit: text.length <= JD_MAX_LENGTH,
  };
}

function getLocalJdValidationMessage(value) {
  const analysis = analyzeMockInterviewJd(value);

  if (!analysis.length) {
    return "Vui lòng nhập JD trước khi bắt đầu phỏng vấn.";
  }

  if (!analysis.isWithinLimit) {
    return `JD quá dài. Vui lòng giữ nội dung dưới ${JD_MAX_LENGTH} ký tự.`;
  }

  return "";
}

function isUsageExhaustedError(error) {
  const message = error?.message?.toLowerCase?.() ?? "";
  const code = error?.code?.toLowerCase?.() ?? "";

  return (
    error?.status === 403 ||
    error?.status === 429 ||
    code.includes("usage") ||
    code.includes("quota") ||
    code.includes("limit") ||
    code.includes("entitlement") ||
    message.includes("hết lượt") ||
    message.includes("het luot") ||
    message.includes("vượt giới hạn") ||
    message.includes("vuot gioi han") ||
    message.includes("giới hạn sử dụng") ||
    message.includes("gioi han su dung") ||
    message.includes("quota") ||
    message.includes("usage limit")
  );
}

function RatingQuestion({ label, value, disabled, onChange }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
      <p className="mb-3 text-sm font-semibold text-slate-800">{label}</p>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            disabled={disabled}
            onClick={() => onChange(rating)}
            className={`h-9 w-9 rounded-xl border text-sm font-bold transition-all disabled:cursor-not-allowed ${
              Number(value) === rating
                ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:text-emerald-700"
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
}

function FeedbackTextarea({ label, value, disabled, placeholder, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </span>
      <textarea
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        maxLength={2000}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white disabled:bg-slate-100"
      />
    </label>
  );
}

function SurveySelect({ label, value, disabled, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-emerald-500 focus:bg-white disabled:bg-slate-100"
      >
        <option value="">Không bắt buộc</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function UserExperienceSurveyModal({
  form,
  submitting,
  onChange,
  onClose,
  onSubmit,
}) {
  const featureRatings = [
    ["Chấm CV", "cvAnalysisRating", "cvAnalysisUsefulness"],
    ["Phỏng vấn mô phỏng", "mockInterviewRating", "mockInterviewUsefulness"],
    ["Gợi ý nghề nghiệp", "careerRecommendationRating", "careerRecommendationUsefulness"],
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <Gift size={14} />
              Thưởng 3 lượt chấm CV
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Cảm ơn bạn đã trải nghiệm FitHire
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Bạn có thể dành khoảng 1 phút để giúp chúng tôi cải thiện sản phẩm không?
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:opacity-60"
            title="Đóng khảo sát"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="max-h-[calc(92vh-112px)] overflow-y-auto p-6">
          <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-2">
              <RatingQuestion
                label="Mức độ hài lòng chung"
                value={form.overallSatisfaction}
                disabled={submitting}
                onChange={(value) => onChange("overallSatisfaction", value)}
              />
              <RatingQuestion
                label="Bạn có sẵn sàng giới thiệu FitHire cho bạn bè không?"
                value={form.recommendationLikelihood}
                disabled={submitting}
                onChange={(value) => onChange("recommendationLikelihood", value)}
              />
            </section>

            <section className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <h3 className="mb-4 text-sm font-bold text-slate-900">
                Đánh giá từng tính năng
              </h3>
              <div className="space-y-3">
                {featureRatings.map(([label, ratingKey, usefulnessKey]) => (
                  <div
                    key={label}
                    className="grid gap-3 rounded-xl border border-slate-100 bg-white p-4 md:grid-cols-[1fr_240px_240px]"
                  >
                    <div className="text-sm font-bold text-slate-800">{label}</div>
                    <RatingQuestion
                      label="Đánh giá"
                      value={form[ratingKey]}
                      disabled={submitting}
                      onChange={(value) => onChange(ratingKey, value)}
                    />
                    <RatingQuestion
                      label="Hữu ích"
                      value={form[usefulnessKey]}
                      disabled={submitting}
                      onChange={(value) => onChange(usefulnessKey, value)}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-4">
              <h3 className="mb-4 text-sm font-bold text-slate-900">
                Tính dễ sử dụng
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["Giao diện dễ sử dụng", "interfaceEase"],
                  ["Các chức năng dễ tìm", "featureDiscoverability"],
                  ["AI phản hồi nhanh", "aiResponseSpeed"],
                  ["Kết quả AI dễ hiểu", "aiResultClarity"],
                ].map(([label, key]) => (
                  <RatingQuestion
                    key={key}
                    label={label}
                    value={form[key]}
                    disabled={submitting}
                    onChange={(value) => onChange(key, value)}
                  />
                ))}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <FeedbackTextarea
                label="Bạn thích nhất điều gì ở FitHire?"
                value={form.likedMost}
                disabled={submitting}
                placeholder="Điều gì làm bạn thấy hữu ích nhất?"
                onChange={(value) => onChange("likedMost", value)}
              />
              <FeedbackTextarea
                label="Điều gì khiến bạn chưa hài lòng?"
                value={form.dissatisfaction}
                disabled={submitting}
                placeholder="Khó khăn, chậm, khó hiểu..."
                onChange={(value) => onChange("dissatisfaction", value)}
              />
              <FeedbackTextarea
                label="Bạn muốn FitHire bổ sung tính năng gì?"
                value={form.desiredFeatures}
                disabled={submitting}
                placeholder="Tính năng bạn muốn có trong tương lai"
                onChange={(value) => onChange("desiredFeatures", value)}
              />
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <SurveySelect
                label="Bạn là"
                value={form.userSegment}
                disabled={submitting}
                options={["Sinh viên", "Fresher", "Junior", "Người đi làm"]}
                onChange={(value) => onChange("userSegment", value)}
              />
              <SurveySelect
                label="Ngành"
                value={form.industry}
                disabled={submitting}
                options={["Software Engineering", "AI", "Data", "Business", "Marketing", "Khác"]}
                onChange={(value) => onChange("industry", value)}
              />
              <SurveySelect
                label="Bạn đã từng phỏng vấn thật chưa?"
                value={form.realInterviewExperience}
                disabled={submitting}
                options={["Chưa", "1-2 lần", "3-5 lần", "Trên 5 lần"]}
                onChange={(value) => onChange("realInterviewExperience", value)}
              />
            </section>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Để sau
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting ? "Đang gửi..." : "Gửi khảo sát và nhận thưởng"}
              {!submitting && <Gift size={16} />}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function MockInterviewPage() {
  const { showToast } = useToast();
  const [role, setRole] = useState("Frontend Developer");
  const [level, setLevel] = useState("Middle");
  const [jd, setJd] = useState("");
  const [jdError, setJdError] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [transcript, setTranscript] = useState([
    {
      role: "AI",
      text: "Chào bạn! Tôi là AI Mentor của FitHire. Bạn đã sẵn sàng chưa?",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("config");
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingHistoryDetail, setIsLoadingHistoryDetail] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [lastResult, setLastResult] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isStartingInterview, setIsStartingInterview] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [targetQuestionCount, setTargetQuestionCount] = useState(0);
  const [pendingVoiceMeta, setPendingVoiceMeta] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState(INITIAL_FEEDBACK_FORM);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [surveyForm, setSurveyForm] = useState(INITIAL_SURVEY_FORM);
  const [showExperienceSurvey, setShowExperienceSurvey] = useState(false);
  const [isSubmittingSurvey, setIsSubmittingSurvey] = useState(false);
  const [hasSubmittedExperienceSurvey, setHasSubmittedExperienceSurvey] = useState(false);

  const primaryView = activeTab === "history" || activeTab === "historyDetail" ? "history" : "config";
  const jdAnalysis = analyzeMockInterviewJd(jd);

  const videoRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);
  const recordStartedAtRef = useRef(null);
  const lastSpokenAiTextRef = useRef("");
  const sessionStartedAtRef = useRef(null);
  const transcriptSnapshotRef = useRef(transcript);

  const scrollToBottom = () => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcript]);

  useEffect(() => {
    transcriptSnapshotRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    if (!isInterviewing || transcript.length === 0) {
      return;
    }

    const lastMessage = transcript[transcript.length - 1];
    if (lastMessage.role !== "AI") {
      return;
    }

    if (lastSpokenAiTextRef.current === lastMessage.text) {
      return;
    }

    lastSpokenAiTextRef.current = lastMessage.text;
    playAiSpeech(lastMessage.text);
  }, [isInterviewing, transcript]);

  useEffect(() => {
    if (activeTab === "history") {
      loadHistory();
    }
  }, [activeTab]);

  useEffect(
    () => () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        try {
          mediaRecorderRef.current.stop();
        } catch (error) {
          console.error(error);
        }
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    },
    []
  );

  const stopAudioCaptureStream = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
  };

  const resetRecordingState = () => {
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    recordStartedAtRef.current = null;
    setIsRecording(false);
  };

  const cleanupInterviewMedia = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error(error);
      }
    }
    stopAudioCaptureStream();
    resetRecordingState();

    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const resetSessionState = () => {
    setActiveSessionId(null);
    setCurrentQuestion(null);
    setAnsweredCount(0);
    setTargetQuestionCount(0);
    setPendingVoiceMeta(null);
    sessionStartedAtRef.current = null;
  };

  const normalizeList = (items) =>
    (items ?? []).filter((item) => typeof item === "string" && item.trim());

  const formatDurationFromMs = (durationMs) => {
    if (!durationMs || durationMs <= 0) {
      return "00:00";
    }
    const totalSeconds = Math.max(1, Math.floor(durationMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const formatDisplayDate = (value) => {
    if (!value) {
      return "--";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "--";
    }

    return date.toLocaleDateString("vi-VN");
  };

  const formatDurationFromIsoRange = (startValue, endValue) => {
    if (!startValue || !endValue) {
      return "--:--";
    }

    const startedAt = new Date(startValue).getTime();
    const endedAt = new Date(endValue).getTime();
    if (!Number.isFinite(startedAt) || !Number.isFinite(endedAt)) {
      return "--:--";
    }

    return formatDurationFromMs(Math.max(0, endedAt - startedAt));
  };

  const mapHistoryItem = (item) => {
    const answered = Number.isFinite(item?.answeredQuestionCount)
      ? item.answeredQuestionCount
      : 0;
    const target = Number.isFinite(item?.targetQuestionCount)
      ? item.targetQuestionCount
      : 0;

    return {
      id: item?.sessionId ?? `${Date.now()}-${Math.random()}`,
      sessionId: item?.sessionId ?? null,
      role: item?.interviewType?.trim?.() || item?.level?.trim?.() || "Mixed",
      date: formatDisplayDate(item?.createdAt),
      score: Number.isFinite(item?.overallScore) ? item.overallScore : 0,
      duration: formatDurationFromIsoRange(item?.createdAt, item?.completedAt),
      turns: target > 0 ? `${answered}/${target}` : answered,
      rawCreatedAt: item?.createdAt ?? null,
      rawCompletedAt: item?.completedAt ?? null,
    };
  };

  const buildTranscriptFromQaItems = (qaItems) => {
    const messages = [];
    (qaItems ?? []).forEach((qa) => {
      const questionText = qa?.questionText?.trim?.();
      const answerText = qa?.answerText?.trim?.();

      if (questionText) {
        messages.push({ role: "AI", text: questionText });
      }
      if (answerText) {
        messages.push({ role: "User", text: answerText });
      }
    });
    return messages;
  };

  const getVoiceApiErrorMessage = (error) => {
    const code = error?.code;

    if (code === "STT_TIMEOUT") {
      return "Dịch vụ STT đang phản hồi chậm. Vui lòng thử lại sau ít phút.";
    }
    if (code === "STT_UNSUPPORTED_FORMAT") {
      return "Định dạng file audio chưa được hỗ trợ.";
    }
    if (code === "STT_AUDIO_TOO_SHORT") {
      return "Audio quá ngắn, vui lòng ghi âm lâu hơn.";
    }
    if (code === "STT_AUDIO_TOO_LARGE") {
      return "Audio quá dài hoặc dung lượng quá lớn.";
    }
    if (code === "STT_EMPTY_TRANSCRIPT") {
      return "Không nhận diện được nội dung giọng nói.";
    }
    if (code === "STT_REQUEST_INVALID") {
      return "File audio chưa hợp lệ hoặc không được hỗ trợ.";
    }
    if (code === "STT_PROVIDER_ERROR") {
      return "Không thể xử lý giọng nói hiện tại.";
    }

    return error?.message || "Gửi câu trả lời voice thất bại. Vui lòng thử lại.";
  };

  const mapHistoryDetail = (detail, fallbackItem) => {
    const finalReport = detail?.finalReport;
    const strengths = normalizeList(finalReport?.strengths);
    const recommendations = normalizeList(finalReport?.recommendations);
    const weaknesses = normalizeList(finalReport?.weaknesses);
    const improvements =
      recommendations.length > 0 ? recommendations : weaknesses;
    const answered = Number.isFinite(detail?.answeredQuestionCount)
      ? detail.answeredQuestionCount
      : 0;
    const target = Number.isFinite(detail?.targetQuestionCount)
      ? detail.targetQuestionCount
      : 0;
    const transcriptItems = buildTranscriptFromQaItems(detail?.qaItems);

    return {
      id: detail?.sessionId ?? fallbackItem?.id ?? Date.now(),
      sessionId: detail?.sessionId ?? fallbackItem?.sessionId ?? null,
      role:
        detail?.interviewType?.trim?.() ||
        fallbackItem?.role ||
        detail?.level?.trim?.() ||
        "Mixed",
      date: formatDisplayDate(detail?.startedAt ?? fallbackItem?.rawCreatedAt),
      score: Number.isFinite(finalReport?.overallScore)
        ? finalReport.overallScore
        : Number.isFinite(fallbackItem?.score)
        ? fallbackItem.score
        : 0,
      duration: formatDurationFromIsoRange(
        detail?.startedAt ?? fallbackItem?.rawCreatedAt,
        detail?.completedAt ?? fallbackItem?.rawCompletedAt
      ),
      turns: target > 0 ? `${answered}/${target}` : answered,
      transcript:
        transcriptItems.length > 0
          ? transcriptItems
          : [{ role: "AI", text: "Phiên này chưa có dữ liệu hội thoại." }],
      aiEvaluation: {
        summary:
          finalReport?.summary?.trim?.() ||
          "Phiên này chưa có báo cáo tổng kết cuối buổi.",
        strengths:
          strengths.length > 0 ? strengths : ["Chưa có dữ liệu điểm mạnh."],
        improvements:
          improvements.length > 0
            ? improvements
            : ["Chưa có dữ liệu đề xuất cải thiện."],
      },
    };
  };

  const buildResultEntry = ({
    sessionId,
    finalReport,
    transcriptItems,
    answered,
    target,
  }) => {
    const strengths = normalizeList(finalReport?.strengths);
    const recommendations = normalizeList(finalReport?.recommendations);
    const weaknesses = normalizeList(finalReport?.weaknesses);
    const improvements =
      recommendations.length > 0 ? recommendations : weaknesses;
    const normalizedTranscript = transcriptItems ?? [];
    const score = Number.isFinite(finalReport?.overallScore)
      ? finalReport.overallScore
      : 0;
    const turns =
      Number.isFinite(answered) && answered > 0
        ? answered
        : normalizedTranscript.filter((item) => item.role === "User").length;

    return {
      id: Date.now(),
      sessionId: sessionId ?? null,
      role,
      date: new Date().toLocaleDateString("vi-VN"),
      score,
      duration: formatDurationFromMs(
        sessionStartedAtRef.current
          ? Date.now() - sessionStartedAtRef.current
          : 0
      ),
      turns:
        Number.isFinite(target) && target > 0 ? `${turns}/${target}` : turns,
      transcript: [...normalizedTranscript],
      aiEvaluation: {
        summary:
          finalReport?.summary?.trim() || "Bạn đã hoàn thành phiên phỏng vấn.",
        strengths:
          strengths.length > 0 ? strengths : ["Tư duy trả lời rõ ràng"],
        improvements:
          improvements.length > 0
            ? improvements
            : ["Tiếp tục luyện tập với các ví dụ cụ thể hơn"],
      },
    };
  };

  const finalizeInterview = ({
    sessionId,
    finalReport,
    transcriptItems,
    answered,
    target,
  }) => {
    cleanupInterviewMedia();
    setIsInterviewing(false);
    setIsTranscribing(false);
    setIsSubmittingAnswer(false);
    const resultEntry = buildResultEntry({
      sessionId,
      finalReport,
      transcriptItems,
      answered,
      target,
    });
    setHistory((prev) => [resultEntry, ...prev]);
    setLastResult(resultEntry);
    setFeedbackForm(INITIAL_FEEDBACK_FORM);
    setFeedbackSubmitted(true);
    setActiveTab("result");
    resetSessionState();
    maybeOpenExperienceSurvey(sessionId);
  };

  const maybeOpenExperienceSurvey = async (sessionId) => {
    if (hasSubmittedExperienceSurvey) {
      return;
    }

    try {
      const status = await fetchUserExperienceSurveyStatus();
      if (status?.submitted) {
        setHasSubmittedExperienceSurvey(true);
        setShowExperienceSurvey(false);
        return;
      }

      setSurveyForm({
        ...INITIAL_SURVEY_FORM,
        mockInterviewSessionId: sessionId ?? null,
      });
      setShowExperienceSurvey(true);
    } catch (error) {
      console.error(error);
    }
  };

  const applyAnswerResponse = (response, answerText) => {
    const normalizedAnswerText =
      response?.submittedAnswerText?.trim?.() ?? answerText?.trim?.() ?? "";
    const incomingMessages = [];
    if (normalizedAnswerText) {
      incomingMessages.push({ role: "User", text: normalizedAnswerText });
    }
    const feedbackText = response?.evaluation?.feedback?.trim();
    if (feedbackText) {
      incomingMessages.push({ role: "AI", text: feedbackText });
    }
    const nextQuestionText = response?.nextQuestion?.questionText?.trim();
    if (nextQuestionText) {
      incomingMessages.push({ role: "AI", text: nextQuestionText });
    }

    const updatedTranscript = [
      ...transcriptSnapshotRef.current,
      ...incomingMessages,
    ];
    setTranscript(updatedTranscript);
    setCurrentQuestion(response?.nextQuestion ?? null);
    setAnsweredCount((prev) => response?.answeredQuestionCount ?? prev);
    setTargetQuestionCount((prev) => response?.targetQuestionCount ?? prev);

    const isCompleted =
      response?.status === "COMPLETED" || Boolean(response?.finalReport);
    if (isCompleted) {
      finalizeInterview({
        sessionId: response?.sessionId,
        finalReport: response?.finalReport,
        transcriptItems: updatedTranscript,
        answered: response?.answeredQuestionCount,
        target: response?.targetQuestionCount,
      });
    }
  };

  const playAiSpeech = async (text) => {
    if (!text?.trim()) {
      return;
    }

    try {
      const audioBlob = await speakMockInterviewText({ text });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => URL.revokeObjectURL(audioUrl);
      audio.onerror = () => URL.revokeObjectURL(audioUrl);
      await audio.play();
    } catch (error) {
      console.error(error);
    }
  };

  const startVoiceRecording = async () => {
    if (isRecording || isTranscribing || isSubmittingAnswer) {
      return;
    }
    if (!activeSessionId || !currentQuestion?.questionId) {
      setVoiceError("Hệ thống chưa sẵn sàng nhận câu trả lời voice.");
      return;
    }

    setVoiceError("");
    setPendingVoiceMeta(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : undefined;
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data?.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start();
      recordStartedAtRef.current = Date.now();
      mediaRecorderRef.current = recorder;
      audioStreamRef.current = stream;
      setIsRecording(true);
    } catch (error) {
      console.error(error);

      if (error?.name === "NotFoundError") {
        setVoiceError("Không tìm thấy thiết bị microphone. Vui lòng kiểm tra lại mic của máy.");
        return;
      }

      if (error?.name === "NotAllowedError") {
        setVoiceError("Bạn đã chặn quyền microphone. Hãy cấp quyền mic cho trình duyệt rồi thử lại.");
        return;
      }

      setVoiceError("Không mở được microphone. Vui lòng kiểm tra quyền truy cập mic.");
    }
  };

  const stopVoiceRecordingAndTranscribe = async () => {
    if (
      !mediaRecorderRef.current ||
      !isRecording ||
      !activeSessionId ||
      !currentQuestion?.questionId
    ) {
      return;
    }

    const recorder = mediaRecorderRef.current;
    const recordedStartedAt = recordStartedAtRef.current;
    setIsRecording(false);
    setIsTranscribing(true);
    setVoiceError("");

    const audioBlob = await new Promise((resolve) => {
      recorder.onstop = () => {
        const blobType = recorder.mimeType || "audio/webm";
        resolve(new Blob(audioChunksRef.current, { type: blobType }));
      };
      recorder.stop();
    });

    const audioDurationMs = recordedStartedAt
      ? Math.max(1, Date.now() - recordedStartedAt)
      : undefined;
    stopAudioCaptureStream();
    resetRecordingState();

    try {
      const inferredExtension = audioBlob.type?.includes("ogg")
        ? "ogg"
        : audioBlob.type?.includes("wav")
        ? "wav"
        : "webm";

      const file = new File(
        [audioBlob],
        `voice-answer-${Date.now()}.${inferredExtension}`,
        {
          type: audioBlob.type || "audio/webm",
        }
      );

      const response = await transcribeMockInterviewVoice({
        file,
        sessionId: activeSessionId,
        questionId: currentQuestion.questionId,
        audioDurationMs,
      });

      const transcriptText = response?.transcript?.trim?.() ?? "";
      if (!transcriptText) {
        setVoiceError("Không nhận diện được nội dung giọng nói.");
        return;
      }

      setUserInput(transcriptText);
      setPendingVoiceMeta({
        audioDurationMs,
        transcriptConfidence: response?.confidence ?? null,
      });
    } catch (error) {
      console.error(error);
      setPendingVoiceMeta(null);
      setVoiceError(getVoiceApiErrorMessage(error));
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    const validationMessage = getLocalJdValidationMessage(jd);
    if (validationMessage) {
      setJdError(validationMessage);
      return;
    }

    setJdError("");
    setLoading(true);
    try {
      const preview = await previewMockInterviewJd({
        level,
        interviewType: role?.trim() || "mixed",
        jd: jd.trim(),
      });

      if (!preview?.valid) {
        const missingNote = preview?.missingFields?.length
          ? ` Phần còn thiếu: ${preview.missingFields.join(", ")}.`
          : "";
        setPlan(null);
        setJdError(
          `${
            preview?.suggestedFix ||
            preview?.reason ||
            "JD chưa đủ ngữ cảnh để tạo câu hỏi phỏng vấn. Vui lòng bổ sung thêm thông tin."
          }${missingNote}`
        );
        return;
      }

      setPlan({
        role: preview.detectedPosition?.trim() || role,
        level: preview.detectedLevel?.trim() || level,
        topics: preview.interviewTopics ?? [],
        responsibilities: preview.detectedResponsibilities ?? [],
        skills: preview.detectedSkills ?? [],
        technologies: preview.detectedTechnologies ?? [],
        score: preview.questionReadinessScore ?? 0,
        questionCount: preview.estimatedSpecificQuestionCount ?? 0,
      });
    } catch (error) {
      console.error(error);
      setPlan(null);
      setJdError(
        error?.message || "Không thể phân tích JD. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    if (isStartingInterview) {
      return;
    }
    const validationMessage = getLocalJdValidationMessage(jd);
    if (validationMessage) {
      setJdError(validationMessage);
      return;
    }

    setJdError("");
    setVoiceError("");
    setIsStartingInterview(true);
    try {
      const response = await startMockInterviewSession({
        level,
        interviewType: role?.trim() || "mixed",
        jd: jd.trim(),
      });

      const firstQuestion = response?.nextQuestion;
      const firstQuestionText = firstQuestion?.questionText?.trim();
      if (
        !response?.sessionId ||
        !firstQuestion?.questionId ||
        !firstQuestionText
      ) {
        throw new Error("Hệ thống chưa tạo được câu hỏi đầu tiên.");
      }

      setActiveSessionId(response.sessionId);
      setCurrentQuestion(firstQuestion);
      setAnsweredCount(0);
      setTargetQuestionCount(response?.targetQuestionCount ?? 0);
      setTranscript([{ role: "AI", text: firstQuestionText }]);
      setUserInput("");
      setPendingVoiceMeta(null);
      setIsInterviewing(true);
      lastSpokenAiTextRef.current = "";
      sessionStartedAtRef.current = Date.now();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (cameraError) {
        console.error(cameraError);
      }
    } catch (error) {
      console.error(error);
      if (isUsageExhaustedError(error)) {
        showToast({
          type: "warning",
          title: "Đã hết lượt sử dụng",
          message:
            "Bạn đã dùng hết lượt luyện phỏng vấn trong gói hiện tại. Vui lòng nâng cấp gói hoặc chờ lượt được làm mới để tiếp tục.",
        });
      }
      if (error?.status === 400) {
        setJdError(getVoiceApiErrorMessage(error));
      }
      setVoiceError(getVoiceApiErrorMessage(error));
    } finally {
      setIsStartingInterview(false);
    }
  };

  const updateFeedbackField = (field, value) => {
    setFeedbackForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSurveyField = (field, value) => {
    setSurveyForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitExperienceSurvey = async (event) => {
    event.preventDefault();

    if (isSubmittingSurvey || hasSubmittedExperienceSurvey) {
      return;
    }

    setIsSubmittingSurvey(true);
    try {
      const response = await submitUserExperienceSurvey({
        ...surveyForm,
        overallSatisfaction: Number(surveyForm.overallSatisfaction),
        recommendationLikelihood: Number(surveyForm.recommendationLikelihood),
        cvAnalysisRating: Number(surveyForm.cvAnalysisRating),
        cvAnalysisUsefulness: Number(surveyForm.cvAnalysisUsefulness),
        mockInterviewRating: Number(surveyForm.mockInterviewRating),
        mockInterviewUsefulness: Number(surveyForm.mockInterviewUsefulness),
        careerRecommendationRating: Number(surveyForm.careerRecommendationRating),
        careerRecommendationUsefulness: Number(surveyForm.careerRecommendationUsefulness),
        interfaceEase: Number(surveyForm.interfaceEase),
        featureDiscoverability: Number(surveyForm.featureDiscoverability),
        aiResponseSpeed: Number(surveyForm.aiResponseSpeed),
        aiResultClarity: Number(surveyForm.aiResultClarity),
      });

      setHasSubmittedExperienceSurvey(true);
      setShowExperienceSurvey(false);
      showToast({
        type: "success",
        title: "Đã nhận thưởng khảo sát",
        message: `Bạn vừa được cộng ${response?.rewardCvScans ?? 3} lượt chấm CV.`,
      });
    } catch (error) {
      console.error(error);
      if (error?.status === 409) {
        setHasSubmittedExperienceSurvey(true);
        setShowExperienceSurvey(false);
        return;
      }
      showToast({
        type: "error",
        title: "Chưa gửi được khảo sát",
        message: error?.message || "Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmittingSurvey(false);
    }
  };

  const handleSubmitFeedback = async (event) => {
    event.preventDefault();

    if (!lastResult?.sessionId || feedbackSubmitted || isSubmittingFeedback) {
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      await submitMockInterviewFeedback(lastResult.sessionId, {
        ...feedbackForm,
        overallRating: Number(feedbackForm.overallRating),
        realismRating: Number(feedbackForm.realismRating),
        questionQualityRating: Number(feedbackForm.questionQualityRating),
        aiFeedbackRating: Number(feedbackForm.aiFeedbackRating),
      });
      setFeedbackSubmitted(true);
      showToast({
        type: "success",
        title: "Đã gửi feedback",
        message: "Cảm ơn bạn đã giúp FitHire cải thiện Phỏng vấn mô phỏng.",
      });
    } catch (error) {
      console.error(error);
      showToast({
        type: "error",
        title: "Chưa gửi được feedback",
        message: error?.message || "Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const answerText = userInput.trim();
    if (
      !answerText ||
      !activeSessionId ||
      !currentQuestion?.questionId ||
      isSubmittingAnswer ||
      isTranscribing
    ) {
      return;
    }

    setVoiceError("");
    setIsSubmittingAnswer(true);
    setUserInput("");

    try {
      const isVoiceTranscript = Boolean(pendingVoiceMeta);
      const response = await submitMockInterviewAnswer(activeSessionId, {
        questionId: currentQuestion.questionId,
        answerText,
        inputType: isVoiceTranscript ? "VOICE_TRANSCRIPT" : "TEXT",
        ...(isVoiceTranscript
          ? {
              audioDurationMs: pendingVoiceMeta.audioDurationMs,
              transcriptConfidence: pendingVoiceMeta.transcriptConfidence,
            }
          : {}),
      });
      applyAnswerResponse(response, answerText);
      setPendingVoiceMeta(null);
    } catch (error) {
      console.error(error);
      setVoiceError(getVoiceApiErrorMessage(error));
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    setHistoryError("");
    try {
      const response = await fetchMockInterviewHistory({ page: 0, size: 20 });
      const items = (response?.content ?? []).map(mapHistoryItem);
      setHistory(items);
    } catch (error) {
      console.error(error);
      setHistoryError(
        error.message || "Không thể tải lịch sử phỏng vấn. Vui lòng thử lại."
      );
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const openHistoryDetail = async (item) => {
    if (!item?.sessionId) {
      return;
    }

    setIsLoadingHistoryDetail(true);
    setHistoryError("");
    try {
      const detail = await fetchMockInterviewDetail(item.sessionId);
      setSelectedHistory(mapHistoryDetail(detail, item));
      setActiveTab("historyDetail");
    } catch (error) {
      console.error(error);
      setHistoryError(
        error.message ||
          "Không thể tải chi tiết phiên phỏng vấn. Vui lòng thử lại."
      );
    } finally {
      setIsLoadingHistoryDetail(false);
    }
  };

  const handleResetPlan = () => {
    setPlan(null);
    setVoiceError("");
    setHistoryError("");
    setUserInput("");
    setPendingVoiceMeta(null);
    setSelectedHistory(null);
    resetSessionState();
    setActiveTab("config");
  };

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] overflow-hidden font-body text-slate-800 pb-16">
      <AnimatePresence>
        {showExperienceSurvey && (
          <UserExperienceSurveyModal
            form={surveyForm}
            submitting={isSubmittingSurvey}
            onChange={updateSurveyField}
            onClose={() => setShowExperienceSurvey(false)}
            onSubmit={handleSubmitExperienceSurvey}
          />
        )}
      </AnimatePresence>

      {/* Background Bubbles (Rainbow effect from CV Manager) */}
      <div className="absolute top-0 left-0 h-[500px] w-[500px] -translate-x-1/3 -translate-y-1/4 rounded-full bg-emerald-200/40 blur-[120px] z-0 pointer-events-none" />
      <div className="absolute top-40 right-0 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-indigo-200/30 blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] translate-y-1/3 rounded-full bg-rose-200/20 blur-[100px] z-0 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Luyện tập Phỏng vấn
            </h1>
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              Cải thiện kỹ năng phản xạ phỏng vấn cùng AI Mentor chuyên nghiệp.
            </p>
          </div>

          <div
            aria-label="Điều hướng luyện tập phỏng vấn"
            className="inline-flex items-center rounded-2xl border border-emerald-100 bg-white p-1 shadow-sm"
          >
            <button
              type="button"
              onClick={() => setActiveTab("config")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                primaryView === "config"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              Phiên mới
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                primaryView === "history"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              Lịch sử
              <ArrowRight size={16} className="translate-y-[1px]" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isInterviewing ? (
            <motion.div
              key="int"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid lg:grid-cols-12 gap-6 items-stretch"
            >
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden relative shadow-xl border-4 border-white min-h-[350px]">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase flex items-center gap-1.5 border border-white/20">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />{" "}
                    Live
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[500px]">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Hội thoại
                  </span>
                  <FileText size={16} className="text-slate-300" />
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide text-sm">
                  {transcript.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${
                        msg.role === "User" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-xl ${
                          msg.role === "User"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-emerald-50 text-emerald-900 border border-emerald-100"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={transcriptEndRef} />
                </div>
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 bg-slate-50 border-t flex gap-2"
                >
                  <button
                    type="button"
                    onClick={
                      isRecording
                        ? stopVoiceRecordingAndTranscribe
                        : startVoiceRecording
                    }
                    disabled={
                      isTranscribing ||
                      isSubmittingAnswer ||
                      !activeSessionId ||
                      !currentQuestion?.questionId
                    }
                    className={`p-2.5 rounded-xl border ${
                      isRecording
                        ? "bg-rose-600 text-white border-rose-600"
                        : "bg-white text-emerald-700 border-slate-200"
                    } disabled:opacity-60`}
                    title={isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
                  >
                    {isRecording ? (
                      <StopCircle size={16} />
                    ) : (
                      <Mic2 size={16} />
                    )}
                  </button>
                  <input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Nhập câu trả lời..."
                    disabled={
                      isTranscribing ||
                      isSubmittingAnswer ||
                      !currentQuestion?.questionId
                    }
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none disabled:bg-slate-100"
                  />
                  <button
                    type="submit"
                    disabled={
                      isTranscribing ||
                      isSubmittingAnswer ||
                      !currentQuestion?.questionId
                    }
                    className="bg-emerald-600 text-white p-2.5 rounded-xl disabled:opacity-60"
                  >
                    <Send size={16} />
                  </button>
                </form>
                {isTranscribing && (
                  <p className="px-3 pb-2 text-xs text-emerald-700">
                    Đang chuyển giọng nói thành văn bản...
                  </p>
                )}
                {voiceError && (
                  <p className="px-3 pb-2 text-xs text-rose-600">
                    {voiceError}
                  </p>
                )}
              </div>
            </motion.div>
          ) : activeTab === "result" && lastResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between gap-6">
                <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-emerald-50/60 to-white shadow-sm px-6 py-5 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={16} className="text-emerald-600" />
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                      Kết quả phỏng vấn AI
                    </p>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {lastResult.role}
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-emerald-700">
                    <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 font-semibold">
                      {lastResult.date}
                    </span>
                    {feedbackSubmitted ? (
                      <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 font-semibold">
                        Điểm số: {lastResult.score}%
                      </span>
                    ) : (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                        Gửi feedback để mở đánh giá
                      </span>
                    )}
                    <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 font-semibold">
                      {lastResult.duration}
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 font-semibold">
                      {lastResult.turns} lượt trao đổi
                    </span>
                  </div>
                </div>
                <button
                  disabled={!feedbackSubmitted}
                  onClick={() => {
                    setLastResult(null);
                    setPlan(null);
                    setActiveTab("config");
                  }}
                  className="bg-[#00b14f] text-white px-8 py-5 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-600/20 hover:bg-[#009b45] transition-all flex items-center gap-3 shrink-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#00b14f]"
                >
                  {feedbackSubmitted ? "Hoàn thành" : "Gửi feedback trước"} <CheckCircle2 size={18} />
                </button>
              </div>

              {feedbackSubmitted && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[500px]">
                  <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Nội dung cuộc hội thoại
                    </span>
                    <FileText size={16} className="text-slate-300" />
                  </div>
                  <div className="p-5 space-y-4 overflow-y-auto text-sm">
                    {lastResult.transcript.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col ${
                          msg.role === "User" ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-xl ${
                            msg.role === "User"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "bg-emerald-50 text-emerald-900 border border-emerald-100"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 size={20} className="text-emerald-600" />
                      <p className="text-base font-bold text-slate-900">
                        Đánh giá từ AI Mentor
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "{lastResult.aiEvaluation.summary}"
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">
                        Giao tiếp
                      </p>
                      <p className="text-2xl font-bold text-emerald-700">88%</p>
                    </div>
                    <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">
                        Kỹ thuật
                      </p>
                      <p className="text-2xl font-bold text-emerald-700">82%</p>
                    </div>
                    <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">
                        Tư duy
                      </p>
                      <p className="text-2xl font-bold text-emerald-700">
                        {lastResult.score}%
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-emerald-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                        Điểm mạnh
                      </p>
                      <ul className="space-y-2">
                        {lastResult.aiEvaluation.strengths.map((s, i) => (
                          <li
                            key={i}
                            className="text-sm text-slate-600 flex items-start gap-2"
                          >
                            <ChevronRight
                              size={14}
                              className="mt-0.5 text-emerald-300 shrink-0"
                            />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-rose-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />{" "}
                        Cần cải thiện
                      </p>
                      <ul className="space-y-2">
                        {lastResult.aiEvaluation.improvements.map((s, i) => (
                          <li
                            key={i}
                            className="text-sm text-slate-600 flex items-start gap-2"
                          >
                            <ChevronRight
                              size={14}
                              className="mt-0.5 text-rose-300 shrink-0"
                            />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {!feedbackSubmitted && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                      Góp ý trải nghiệm
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      Bạn thấy Phỏng vấn mô phỏng hôm nay như thế nào?
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Một vài câu trả lời ngắn sẽ giúp FitHire cải thiện câu hỏi, giọng phỏng vấn và feedback AI.
                    </p>
                  </div>
                  {feedbackSubmitted && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-100">
                      Đã gửi
                    </span>
                  )}
                </div>

                <form onSubmit={handleSubmitFeedback} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <RatingQuestion
                      label="Bạn hài lòng tổng thể đến mức nào?"
                      value={feedbackForm.overallRating}
                      disabled={feedbackSubmitted}
                      onChange={(value) => updateFeedbackField("overallRating", value)}
                    />
                    <RatingQuestion
                      label="Phiên phỏng vấn có giống thực tế không?"
                      value={feedbackForm.realismRating}
                      disabled={feedbackSubmitted}
                      onChange={(value) => updateFeedbackField("realismRating", value)}
                    />
                    <RatingQuestion
                      label="Câu hỏi có phù hợp với vị trí/cấp độ không?"
                      value={feedbackForm.questionQualityRating}
                      disabled={feedbackSubmitted}
                      onChange={(value) => updateFeedbackField("questionQualityRating", value)}
                    />
                    <RatingQuestion
                      label="Feedback từ AI có hữu ích không?"
                      value={feedbackForm.aiFeedbackRating}
                      disabled={feedbackSubmitted}
                      onChange={(value) => updateFeedbackField("aiFeedbackRating", value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <FeedbackTextarea
                      label="Điều bạn thích nhất"
                      value={feedbackForm.likedMost}
                      disabled={feedbackSubmitted}
                      placeholder="Ví dụ: câu hỏi sát JD, feedback dễ hiểu..."
                      onChange={(value) => updateFeedbackField("likedMost", value)}
                    />
                    <FeedbackTextarea
                      label="Điều cần cải thiện"
                      value={feedbackForm.improvementSuggestion}
                      disabled={feedbackSubmitted}
                      placeholder="Ví dụ: thêm câu hỏi follow-up, giọng tự nhiên hơn..."
                      onChange={(value) => updateFeedbackField("improvementSuggestion", value)}
                    />
                    <FeedbackTextarea
                      label="Góp ý thêm"
                      value={feedbackForm.additionalComment}
                      disabled={feedbackSubmitted}
                      placeholder="Bạn muốn FitHire bổ sung gì?"
                      onChange={(value) => updateFeedbackField("additionalComment", value)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!lastResult?.sessionId || feedbackSubmitted || isSubmittingFeedback}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-60 disabled:hover:bg-emerald-600"
                    >
                      {isSubmittingFeedback
                        ? "Đang gửi..."
                        : feedbackSubmitted
                          ? "Đã gửi feedback"
                          : "Gửi feedback và xem đánh giá"}
                      {!feedbackSubmitted && <Send size={16} />}
                    </button>
                  </div>
                </form>
              </div>
              )}
            </motion.div>
          ) : activeTab === "history" ? (
            <motion.div
              key="hist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {isLoadingHistory ? (
                <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                  Đang tải lịch sử phỏng vấn...
                </div>
              ) : history.length === 0 ? (
                <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                  Bạn chưa có phiên phỏng vấn nào.
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-200 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <Video size={24} className="text-emerald-400" />
                      <p className="text-2xl font-bold text-emerald-600">
                        {item.score}%
                      </p>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mb-1">
                      {item.role}
                    </h4>
                    <p className="text-[10px] text-zinc-400 mb-4">{item.date}</p>
                    <button
                      onClick={() => openHistoryDetail(item)}
                      disabled={isLoadingHistoryDetail}
                      className="w-full bg-emerald-600 text-white py-2.5 rounded-xl text-[10px] font-bold uppercase shadow-md shadow-emerald-600/10 disabled:opacity-60"
                    >
                      {isLoadingHistoryDetail ? "Đang tải..." : "Chi tiết"}
                    </button>
                  </div>
                ))
              )}
              {historyError && (
                <p className="md:col-span-3 text-sm text-rose-600">
                  {historyError}
                </p>
              )}
            </motion.div>
          ) : activeTab === "historyDetail" && selectedHistory ? (
            <motion.div
              key="histDetail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-emerald-50/60 to-white shadow-sm px-5 py-4">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                  Lịch sử phỏng vấn
                </p>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedHistory.role}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-emerald-700">
                  <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 font-semibold">
                    {selectedHistory.date}
                  </span>
                  <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 font-semibold">
                    {selectedHistory.score}%
                  </span>
                  <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 font-semibold">
                    {selectedHistory.duration}
                  </span>
                  <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 font-semibold">
                    {selectedHistory.turns} lượt hỏi
                  </span>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-emerald-50/40 rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Ghi âm cuộc phỏng vấn
                    </span>
                    <Mic2 size={16} className="text-slate-300" />
                  </div>
                  <div className="p-5 space-y-3 text-sm">
                    {selectedHistory.transcript.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${
                          msg.role === "User" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl px-3 py-2 ${
                            msg.role === "User"
                              ? "bg-emerald-600 text-white"
                              : "bg-emerald-50 text-emerald-900 border border-emerald-100"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <p className="text-sm font-bold text-slate-900">
                      Đánh giá AI
                    </p>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">
                    {selectedHistory.aiEvaluation.summary}
                  </p>
                  <div className="mb-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 py-2">
                      <p className="text-xs text-emerald-700 font-semibold">
                        Giao tiếp
                      </p>
                      <p className="text-lg font-bold text-emerald-700">
                        {Math.min(95, selectedHistory.score + 5)}%
                      </p>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 py-2">
                      <p className="text-xs text-emerald-700 font-semibold">
                        Kỹ thuật
                      </p>
                      <p className="text-lg font-bold text-emerald-700">
                        {Math.max(60, selectedHistory.score - 10)}%
                      </p>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 py-2">
                      <p className="text-xs text-emerald-700 font-semibold">
                        Tư duy
                      </p>
                      <p className="text-lg font-bold text-emerald-700">
                        {selectedHistory.score}%
                      </p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-emerald-700 mb-2">
                        Điểm mạnh
                      </p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {selectedHistory.aiEvaluation.strengths.map(
                          (item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              <span>{item}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-rose-600 mb-2">
                        Cần cải thiện
                      </p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {selectedHistory.aiEvaluation.improvements.map(
                          (item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400" />
                              <span>{item}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cfg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid lg:grid-cols-12 gap-6 items-stretch"
            >
              <div className="lg:col-span-5 flex flex-col relative">
                <div
                  className={
                    plan
                      ? "bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex-1 flex flex-col gap-6 opacity-60 select-none"
                      : "bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex-1 flex flex-col gap-6"
                  }
                >
                  <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Cấu hình phỏng vấn
                  </h2>

                  <form
                    onSubmit={handleGenerate}
                    className="flex flex-col gap-5 flex-1"
                  >
                    <div className="space-y-4 flex-1">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                          Vị trí ứng tuyển
                        </label>
                        <input
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-zinc-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                          Cấp độ mục tiêu
                        </label>
                        <select
                          value={level}
                          onChange={(e) => setLevel(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-zinc-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                        >
                          <option>Intern</option>
                          <option>Fresher</option>
                          <option>Junior</option>
                          <option>Middle</option>
                          <option>Senior</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                          Mô tả công việc (JD)
                        </label>
                        <textarea
                          value={jd}
                          onChange={(e) => {
                            setJd(e.target.value);
                            if (jdError) {
                              setJdError("");
                            }
                          }}
                          rows={4}
                          maxLength={JD_MAX_LENGTH}
                          placeholder="Nhập JD gồm vị trí, trách nhiệm chính, kỹ năng/yêu cầu và công nghệ liên quan."
                          className={`w-full rounded-xl border bg-zinc-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:bg-white transition-all resize-none h-[140px] placeholder:text-slate-400 ${
                            jdError
                              ? "border-rose-300 focus:border-rose-500"
                              : "border-slate-200 focus:border-emerald-500"
                          }`}
                        />
                        <div className="mt-2 flex items-center justify-between gap-3 text-[11px]">
                          <span
                            className={
                              jdAnalysis.isLongEnough
                                ? "font-semibold text-emerald-600"
                                : "font-semibold text-amber-600"
                            }
                          >
                            {jdAnalysis.length}/{JD_MAX_LENGTH} ký tự
                          </span>
                          <span className="text-slate-400">
                            Gợi ý {JD_MIN_LENGTH}+ ký tự
                          </span>
                        </div>
                        {jdError && (
                          <p className="mt-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                            {jdError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 pt-5 border-t border-slate-100">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex justify-center items-center gap-2"
                      >
                        {loading ? "Đang phân tích..." : "Tạo lộ trình"}
                        {!loading && <ArrowRight size={16} />}
                      </button>
                    </div>
                  </form>
                </div>
                {plan && (
                  <div className="absolute inset-0 rounded-2xl bg-white/40 backdrop-blur-[1px] border border-slate-200 pointer-events-auto" />
                )}
              </div>

              <div className="lg:col-span-7 flex flex-col">
                {!plan ? (
                  <div className="flex-1 bg-white/40 backdrop-blur-md border border-white rounded-2xl flex flex-col items-center justify-center p-10 text-center shadow-inner group">
                    <div className="w-16 h-16 bg-white/60 rounded-xl shadow-sm border border-white flex items-center justify-center text-emerald-200 mb-6 group-hover:scale-105 transition-all">
                      <Sparkles size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-900 mb-1">
                      Chờ phân tích
                    </h3>
                    <p className="text-xs text-emerald-700/50 max-w-[200px]">
                      Nhập cấu hình bên trái để chuẩn bị kịch bản.
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.98 }}
                    animate={{ scale: 1 }}
                    className="bg-emerald-50/30 backdrop-blur-md rounded-2xl border border-emerald-100 p-6 shadow-xl flex-1 flex flex-col"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            size={18}
                            className="text-emerald-600"
                          />
                          <span className="text-xs font-bold text-emerald-700 tracking-tight">
                            JD hợp lệ
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleResetPlan}
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all"
                        >
                          <Trash2 size={14} /> Chỉnh sửa JD
                        </button>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">
                        {plan.role}
                      </h2>
                      <p className="text-xs font-medium text-slate-500 mb-8">
                        Cấp độ: {plan.level}
                      </p>

                      <div className="mb-5 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-emerald-100 bg-white/70 p-4">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                            Độ sẵn sàng
                          </p>
                          <p className="mt-1 text-2xl font-black text-slate-900">
                            {plan.score}%
                          </p>
                        </div>
                        <div className="rounded-xl border border-emerald-100 bg-white/70 p-4">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                            Câu hỏi cụ thể
                          </p>
                          <p className="mt-1 text-2xl font-black text-slate-900">
                            {plan.questionCount || "--"}
                          </p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h3 className="mb-3 text-sm font-bold text-slate-900">
                          Kiến thức / kỹ năng sẽ phỏng vấn
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {(plan.topics?.length
                            ? plan.topics
                            : [
                                "Kinh nghiệm liên quan đến JD",
                                "Kỹ năng chuyên môn",
                                "Tình huống làm việc thực tế",
                              ]
                          ).map((topic, idx) => (
                            <div
                              key={`${topic}-${idx}`}
                              className="flex items-center gap-3 rounded-xl border border-white bg-white/70 p-3 text-sm font-semibold text-slate-700 shadow-sm"
                            >
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-black text-emerald-600">
                                {idx + 1}
                              </span>
                              <span className="line-clamp-2">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={startInterview}
                      disabled={isStartingInterview}
                      className="w-full bg-emerald-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-60"
                    >
                      {isStartingInterview
                        ? "Đang khởi tạo..."
                        : "Bắt đầu phỏng vấn"}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
