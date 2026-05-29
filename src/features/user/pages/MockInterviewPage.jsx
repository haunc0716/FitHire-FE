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
} from "lucide-react";
import { generateMockInterviewPlan } from "../services/userFeatureAdapters";
import {
  cancelMockInterviewSession,
  completeMockInterviewSession,
  fetchMockInterviewDetail,
  fetchMockInterviewHistory,
  speakMockInterviewText,
  startMockInterviewSession,
  submitMockInterviewAnswer,
  transcribeMockInterviewVoice,
} from "../services/userApi";

export default function MockInterviewPage() {
  const [role, setRole] = useState("Frontend Developer");
  const [level, setLevel] = useState("Middle");
  const [jd, setJd] = useState("");
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
      return "Dich vu STT dang phan hoi cham. Vui long thu lai sau it phut.";
    }
    if (code === "STT_UNSUPPORTED_FORMAT") {
      return "Dinh dang file audio chua duoc ho tro.";
    }
    if (code === "STT_AUDIO_TOO_SHORT") {
      return "Audio qua ngan, vui long ghi am lau hon.";
    }
    if (code === "STT_AUDIO_TOO_LARGE") {
      return "Audio qua dai hoac dung luong qua lon.";
    }
    if (code === "STT_EMPTY_TRANSCRIPT") {
      return "Khong nhan dien duoc noi dung giong noi.";
    }
    if (code === "STT_REQUEST_INVALID") {
      return "File audio chua hop le hoac khong duoc ho tro.";
    }
    if (code === "STT_PROVIDER_ERROR") {
      return "Khong the xu ly giong noi hien tai.";
    }

    return error?.message || "Gui cau tra loi voice that bai. Vui long thu lai.";
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
      finalReport,
      transcriptItems,
      answered,
      target,
    });
    setHistory((prev) => [resultEntry, ...prev]);
    setLastResult(resultEntry);
    setActiveTab("result");
    resetSessionState();
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
        setVoiceError("Khong nhan dien duoc noi dung giong noi.");
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
    setLoading(true);
    try {
      const data = await generateMockInterviewPlan({ role, level, jd });
      setPlan(data);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    if (isStartingInterview) {
      return;
    }
    if (!jd?.trim()) {
      setVoiceError("Vui lòng nhập JD trước khi bắt đầu phỏng vấn.");
      return;
    }

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
      setVoiceError(getVoiceApiErrorMessage(error));
    } finally {
      setIsStartingInterview(false);
    }
  };

  const stopInterview = async () => {
    if (isSubmittingAnswer) {
      return;
    }

    const sessionIdToComplete = activeSessionId;
    const answeredToComplete = answeredCount;
    const targetToComplete = targetQuestionCount;
    const transcriptSnapshot = [...transcriptSnapshotRef.current];

    if (!sessionIdToComplete || answeredToComplete <= 0) {
      if (sessionIdToComplete) {
        try {
          await cancelMockInterviewSession(sessionIdToComplete);
        } catch (cancelError) {
          console.error(cancelError);
        }
      }
      cleanupInterviewMedia();
      setIsInterviewing(false);
      setIsTranscribing(false);
      resetSessionState();
      setActiveTab("config");
      return;
    }

    setIsSubmittingAnswer(true);
    try {
      const completed = await completeMockInterviewSession(sessionIdToComplete);
      finalizeInterview({
        finalReport: completed?.finalReport,
        transcriptItems: transcriptSnapshot,
        answered: completed?.answeredQuestionCount ?? answeredToComplete,
        target: completed?.targetQuestionCount ?? targetToComplete,
      });
    } catch (error) {
      console.error(error);
      cleanupInterviewMedia();
      setIsInterviewing(false);
      setVoiceError(error.message || "Không thể kết thúc phiên phỏng vấn.");
      resetSessionState();
      setActiveTab("config");
    } finally {
      setIsSubmittingAnswer(false);
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

          <button
            onClick={() =>
              setActiveTab(activeTab === "history" ? "config" : "history")
            }
            className="inline-flex items-center gap-2 text-base font-bold text-emerald-700 hover:text-emerald-800 transition-all"
          >
            {activeTab === "history" ? "Quay lại phiên mới" : "Lịch sử"}
            <ArrowRight size={16} className="translate-y-[1px]" />
          </button>
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
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100">
                      <Mic2 size={20} />
                    </div>
                    <p className="text-xl font-bold">24:45</p>
                  </div>
                  <button
                    onClick={stopInterview}
                    className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-xs font-bold uppercase shadow-md shadow-emerald-600/10"
                  >
                    Kết thúc
                  </button>
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
                    <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 font-semibold">
                      Điểm số: {lastResult.score}%
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 font-semibold">
                      {lastResult.duration}
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 font-semibold">
                      {lastResult.turns} lượt trao đổi
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setLastResult(null);
                    setPlan(null);
                    setActiveTab("config");
                  }}
                  className="bg-[#00b14f] text-white px-8 py-5 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-600/20 hover:bg-[#009b45] transition-all flex items-center gap-3 shrink-0"
                >
                  Hoàn thành <CheckCircle2 size={18} />
                </button>
              </div>

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
                          onChange={(e) => setJd(e.target.value)}
                          rows={4}
                          className="w-full rounded-xl border border-slate-200 bg-zinc-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none h-[140px]"
                        />
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
                            Kịch bản sẵn sàng
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleResetPlan}
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all"
                        >
                          <Trash2 size={14} /> Quay lại tạo mới
                        </button>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">
                        {plan.role}
                      </h2>
                      <p className="text-xs font-medium text-slate-500 mb-8">
                        Cấp độ: {plan.level}
                      </p>

                      <div className="space-y-3 mb-8">
                        {plan.stages.map((stage, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 bg-white/60 p-4 rounded-xl border border-white shadow-sm text-sm"
                          >
                            <span className="font-bold text-emerald-300">
                              0{idx + 1}
                            </span>
                            <p className="text-slate-700 truncate">{stage}</p>
                            <ChevronRight
                              size={14}
                              className="ml-auto text-emerald-100"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={startInterview}
                      disabled={isStartingInterview}
                      className="w-full bg-emerald-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-60"
                    >
                      {isStartingInterview
                        ? "Đang khởi tạo..."
                        : "Bắt đầu ngay"}
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
