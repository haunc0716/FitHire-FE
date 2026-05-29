import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Award, 
  TrendingUp, 
  Users, 
  Zap,
  ChevronRight,
  RefreshCw,
  Building2,
  PieChart,
  BadgeCheck
} from 'lucide-react';
import { fetchAssessmentQuestions, submitAssessment } from '../services/assessmentApi';
import { useToast } from '../../../components/ui/ToastProvider';

const CULTURE_DESCRIPTIONS = {
  CLAN: {
    title: 'Văn hóa Gia đình (Clan)',
    desc: 'Môi trường làm việc thân thiện, nơi mọi người chia sẻ nhiều thứ về bản thân, giống như một gia đình lớn.',
    icon: Users,
    color: 'emerald'
  },
  ADHOCRACY: {
    title: 'Văn hóa Sáng tạo (Adhocracy)',
    desc: 'Môi trường làm việc năng động, mang tính khởi nghiệp và sáng tạo, nơi mọi người sẵn sàng chấp nhận rủi ro.',
    icon: Zap,
    color: 'amber'
  },
  MARKET: {
    title: 'Văn hóa Thị trường (Market)',
    desc: 'Môi trường làm việc hướng tới kết quả, nơi thử thách lớn nhất là hoàn thành công việc và đạt mục tiêu.',
    icon: TrendingUp,
    color: 'blue'
  },
  HIERARCHY: {
    title: 'Văn hóa Thứ bậc (Hierarchy)',
    desc: 'Môi trường làm việc được kiểm soát chặt chẽ và có cấu trúc rõ ràng, nơi các quy trình chính thức điều hành mọi việc.',
    icon: Building2,
    color: 'rose'
  }
};

export default function CulturalFitPage() {
  const { showToast } = useToast();
  const [step, setStep] = useState('welcome'); // welcome, assessment, result
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // Array of { questionId, selectedOptionId }
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAssessmentQuestions();
      setQuestions(data);
      setStep('assessment');
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể tải bộ câu hỏi. Vui lòng thử lại sau.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (optionId) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      questionId: questions[currentQuestionIndex].questionId,
      selectedOptionId: optionId
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const submitData = answers.filter(a => a !== undefined);
      const res = await submitAssessment(submitData);
      setResult(res);
      
      // Store result in local storage so other components (like Header) can see it
      if (res.primaryCulture) {
        localStorage.setItem('fitHire_culturalFit', res.primaryCulture);
        // Trigger a custom event to notify other components
        window.dispatchEvent(new Event('culturalFitUpdated'));
      }

      setStep('result');
      showToast({
        type: 'success',
        title: 'Hoàn thành',
        message: 'Bạn đã hoàn thành bài đánh giá văn hóa doanh nghiệp!'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể gửi bài đánh giá. Vui lòng thử lại.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderWelcome = () => (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center space-y-6">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 mb-4">
          <Target className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Khám phá <span className="text-emerald-600">Văn hóa Doanh nghiệp</span> phù hợp
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Bài đánh giá này giúp bạn xác định nhóm văn hóa làm việc mà bạn phát huy tốt nhất khả năng của mình. Kết quả sẽ giúp chúng tôi gợi ý những cơ hội việc làm phù hợp hơn.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900">Nhanh chóng</h3>
            <p className="text-sm text-slate-500 mt-2">Chỉ mất khoảng 5-10 phút để hoàn thành.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <PieChart className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900">Chính xác</h3>
            <p className="text-sm text-slate-500 mt-2">Dựa trên mô hình giá trị cạnh tranh (CVF).</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900">Hữu ích</h3>
            <p className="text-sm text-slate-500 mt-2">Nhận diện phong cách làm việc của bản thân.</p>
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:translate-y-[-2px] transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              Bắt đầu đánh giá
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderAssessment = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">
              Câu hỏi {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-sm font-medium text-slate-400">
              {Math.round(progress)}% hoàn thành
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">
            {currentQuestion.content}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.optionId}
                onClick={() => handleSelectOption(option.optionId)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                  answers[currentQuestionIndex]?.selectedOptionId === option.optionId
                    ? 'border-emerald-500 bg-emerald-50/50 ring-4 ring-emerald-50'
                    : 'border-slate-100 bg-white hover:border-emerald-200 hover:bg-slate-50/50'
                }`}
              >
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                   answers[currentQuestionIndex]?.selectedOptionId === option.optionId
                   ? 'border-emerald-500 bg-emerald-500 text-white'
                   : 'border-slate-300'
                }`}>
                  {answers[currentQuestionIndex]?.selectedOptionId === option.optionId && <CheckCircle2 className="h-4 w-4" />}
                </div>
                <span className={`text-base font-semibold ${
                  answers[currentQuestionIndex]?.selectedOptionId === option.optionId ? 'text-emerald-900' : 'text-slate-700'
                }`}>
                  {option.content}
                </span>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-8">
            <button
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-0 transition-all font-display"
            >
              Quay lại
            </button>
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestionIndex] || isLoading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-slate-900 font-bold text-white hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {currentQuestionIndex === questions.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderResult = () => {
    if (!result) return null;

    const primary = CULTURE_DESCRIPTIONS[result.primaryCulture] || CULTURE_DESCRIPTIONS.CLAN;
    const secondary = result.secondaryCulture ? (CULTURE_DESCRIPTIONS[result.secondaryCulture] || CULTURE_DESCRIPTIONS.ADHOCRACY) : null;

    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
          <div className="bg-slate-900 p-10 text-center text-white relative">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <Award className="h-32 w-32" />
             </div>
             <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-xs mb-3">Kết quả đánh giá</p>
             <h2 className="text-3xl font-bold mb-4">Văn hóa của bạn là</h2>
             <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
               <primary.icon className="h-8 w-8 text-emerald-400" />
               <span className="text-2xl font-black">{primary.title}</span>
             </div>
          </div>

          <div className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-emerald-500" />
                   Đặc điểm nổi bật
                </h3>
                <p className="text-slate-600 leading-relaxed italic">
                  "{primary.desc}"
                </p>
                {secondary && (
                   <div className="pt-4 border-t border-slate-100">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Văn hóa phụ trợ</h3>
                     <div className="flex items-center gap-2 text-slate-900 font-bold">
                       <secondary.icon className="h-5 w-5 text-amber-500" />
                       {secondary.title}
                     </div>
                   </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-blue-500" />
                   Điểm số chi tiết
                </h3>
                <div className="space-y-3">
                  {Object.entries(result.scores || {}).map(([key, value]) => {
                    const cult = CULTURE_DESCRIPTIONS[key];
                    if (!cult) return null;
                    
                    const colorClasses = {
                      emerald: 'bg-emerald-500',
                      amber: 'bg-amber-500',
                      blue: 'bg-blue-500',
                      rose: 'bg-rose-500'
                    };

                    return (
                      <div key={key}>
                        <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase mb-1">
                          <span>{cult.title}</span>
                          <span>{value}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colorClasses[cult.color] || 'bg-slate-400'}`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                   <BadgeCheck className="h-6 w-6" />
                 </div>
                 <div>
                   <p className="font-bold text-slate-900">Tag hệ thống đã được cập nhật</p>
                   <p className="text-sm text-slate-500">Kết quả này sẽ hiển thị trên hồ sơ của bạn.</p>
                 </div>
               </div>
               <button 
                 onClick={() => setStep('welcome')}
                 className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all font-display"
               >
                 <RefreshCw className="h-4 w-4" />
                 Làm lại bài test
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderWelcome()}
          </motion.div>
        )}
        {step === 'assessment' && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
          >
            {renderAssessment()}
          </motion.div>
        )}
        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {renderResult()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
