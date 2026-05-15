import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { registerWithEmailPassword } from '../services/authApi';
import { saveAuthSession, resolveHomeByRole } from '../services/authSession';
import { useToast } from '../../../components/ui/ToastProvider';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const shouldReduceMotion = useReducedMotion();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ password: '', confirmPassword: '' });
  const benefits = [
    'Tối ưu CV chuẩn quốc tế miễn phí',
    'Rèn luyện phỏng vấn với AI 24/7',
    'Gợi ý việc làm phù hợp với năng lực',
    'Nhận báo cáo phân tích sự nghiệp chuyên sâu'
  ];

  const getPasswordErrorMessage = (message) => {
    if (!message) return 'Mật khẩu không hợp lệ.';
    const lower = String(message).toLowerCase();
    if (lower.includes('8 đến 72') || lower.includes('8-72') || lower.includes('password')) return message;
    if (lower.includes('exception mk')) return message;
    return message;
  };

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldErrors({ password: '', confirmPassword: '' });

    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      showToast({
        type: 'warning',
        title: 'Thiếu thông tin',
        message: 'Vui lòng nhập đầy đủ thông tin đăng ký.'
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      const errorMessage = 'Vui lòng kiểm tra lại mật khẩu xác nhận.';
      setFieldErrors({ password: errorMessage, confirmPassword: errorMessage });
      showToast({
        type: 'warning',
        title: 'Mật khẩu chưa khớp',
        message: errorMessage
      });
      return;
    }

    if (!acceptTerms) {
      showToast({
        type: 'warning',
        title: 'Chưa đồng ý điều khoản',
        message: 'Vui lòng đồng ý với điều khoản dịch vụ.'
      });
      return;
    }

    setIsSubmitting(true);
    showToast({
      type: 'info',
      title: 'Đang đăng ký',
      message: 'Vui lòng chờ trong giây lát.'
    });

    try {
      const authPayload = await registerWithEmailPassword({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      if (authPayload?.user?.emailVerified) {
        const session = saveAuthSession(authPayload);
        showToast({
          type: 'success',
          title: 'Đăng ký thành công',
          message: 'Đang chuyển hướng...'
        });
        navigate(resolveHomeByRole(session?.user?.role), { replace: true });
        return;
      }

      showToast({
        type: 'info',
        title: 'Cần xác thực email',
        message: 'Vui lòng nhập mã xác thực đã gửi về email.'
      });
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`, { replace: true });
    } catch (error) {
      const errorMessage = error?.message || 'Vui lòng thử lại.';
      const lowerMessage = errorMessage.toLowerCase();
      if (lowerMessage.includes('mật khẩu') || lowerMessage.includes('password') || lowerMessage.includes('exception mk')) {
        setFieldErrors((prev) => ({
          ...prev,
          password: getPasswordErrorMessage(errorMessage),
          confirmPassword: getPasswordErrorMessage(errorMessage),
        }));
      }
      showToast({
        type: 'error',
        title: 'Đăng ký thất bại',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col md:flex-row overflow-hidden font-body">
      {/* Left side: Why Join? */}
      <motion.div 
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
        className="hidden md:flex md:w-1/2 bg-pale p-12 lg:p-20 flex-col relative overflow-hidden border-r border-stone-200/50"
      >
        {/* Floating Bubble Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-primary-light/5 rounded-full blur-[100px]" />
        </div>

        <Link to="/" className="absolute top-12 left-12 text-stone-900 font-display text-2xl font-bold tracking-tighter z-20 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5 text-stone-400 hover:text-stone-900 transition-colors" /> FITHIRE
        </Link>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="relative mb-10 w-full max-w-[400px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/50">
            <img 
              src="/images/register-hero.png" 
              alt="Hợp tác thành công" 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pale/40 to-transparent" />
          </div>

          <h2 className="text-4xl font-display font-bold text-stone-900 leading-tight mb-8">
            BẮT ĐẦU <br /> <span className="text-primary italic">HÀNH TRÌNH MỚI.</span>
          </h2>
          
          <div className="space-y-4 text-left w-full max-w-sm mx-auto">
            {benefits.map((benefit, i) => (
              <div 
                key={i}
                className="flex items-center gap-4 text-stone-600"
              >
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium tracking-wide">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

      </motion.div>

      {/* Right side: Register Form */}
      <motion.div 
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
        className="flex-1 p-8 md:px-16 lg:px-24 py-16 flex flex-col justify-center bg-white overflow-y-auto"
      >
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-stone-900 mb-4 uppercase tracking-tight">TẠO TÀI KHOẢN</h1>
            <p className="text-stone-500 text-base">Chỉ mất 1 phút để mở ra cánh cửa sự nghiệp mới.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2 ml-1">Họ và tên</label>
              <input 
                type="text" 
                placeholder="Nguyễn Văn A"
                value={form.fullName}
                onChange={handleChange('fullName')}
                className="w-full px-4 py-4 border border-stone-100 bg-stone-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm rounded-2xl"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2 ml-1">Địa chỉ Email</label>
              <input 
                type="email" 
                placeholder="ten-cua-ban@gmail.com"
                value={form.email}
                onChange={handleChange('email')}
                className="w-full px-4 py-4 border border-stone-100 bg-stone-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm rounded-2xl"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2 ml-1">Mật khẩu</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange('password')}
                  className={`w-full px-4 py-4 pr-12 border rounded-2xl bg-stone-50 focus:bg-white focus:ring-4 outline-none transition-all text-sm ${fieldErrors.password ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/5' : 'border-stone-100 focus:border-primary focus:ring-primary/5'}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-stone-400 hover:text-stone-700"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-2 ml-1 text-xs text-rose-600 leading-relaxed">{fieldErrors.password}</p>}
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2 ml-1">Xác nhận mật khẩu</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  className={`w-full px-4 py-4 pr-12 border rounded-2xl bg-stone-50 focus:bg-white focus:ring-4 outline-none transition-all text-sm ${fieldErrors.confirmPassword ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/5' : 'border-stone-100 focus:border-primary focus:ring-primary/5'}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-stone-400 hover:text-stone-700"
                  aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="mt-2 ml-1 text-xs text-rose-600 leading-relaxed">{fieldErrors.confirmPassword}</p>}
            </div>

            <div className="flex items-start gap-3 py-2 ml-1">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 accent-primary rounded border-stone-300"
                id="terms"
                checked={acceptTerms}
                onChange={(event) => setAcceptTerms(event.target.checked)}
                required
              />
              <label htmlFor="terms" className="text-xs text-stone-500 leading-relaxed">
                Tôi đồng ý với các <Link to="/terms" className="text-primary font-bold hover:underline">Điều khoản dịch vụ</Link> và <Link to="/privacy" className="text-primary font-bold hover:underline">Chính sách bảo mật</Link> của FitHire.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-stone-500">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Đăng nhập ngay</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
