import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { loginWithGoogle } from '../services/authApi';
import { getAuthSession, saveAuthSession } from '../services/authSession';
import {
  cancelGoogleOneTap,
  loadGoogleIdentityScript,
  renderGoogleSignInButton,
} from '../services/googleIdentityService';

const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '').trim();

const LoginPage = () => {
  const navigate = useNavigate();
  const buttonContainerRef = useRef(null);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('Vui lòng click vào nút Google bên dưới để tiếp tục.');
  };

  useEffect(() => {
    const currentSession = getAuthSession();
    if (currentSession?.accessToken && currentSession.expiresAt > Date.now()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleGoogleCredential = useCallback(
    async (credentialResponse) => {
      const idToken = credentialResponse?.credential;
      if (!idToken) {
        setErrorMessage('Google không trả về idToken. Vui lòng thử lại.');
        return;
      }

      setIsSubmitting(true);
      setStatusMessage('Đang xác thực thông tin đăng nhập...');
      setErrorMessage('');

      try {
        const authPayload = await loginWithGoogle(idToken);
        saveAuthSession(authPayload);
        setStatusMessage('Đăng nhập thành công. Đang chuyển hướng...');
        navigate('/', { replace: true });
      } catch (error) {
        setErrorMessage(error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        setStatusMessage('');
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    let isMounted = true;

    async function bootstrapGoogleSignIn() {
      if (!googleClientId) {
        setErrorMessage('Thiếu cấu hình VITE_GOOGLE_CLIENT_ID cho đăng nhập Google.');
        return;
      }

      try {
        const googleIdentityApi = await loadGoogleIdentityScript();
        if (!isMounted || !buttonContainerRef.current) {
          return;
        }

        renderGoogleSignInButton({
          api: googleIdentityApi,
          containerElement: buttonContainerRef.current,
          clientId: googleClientId,
          onCredential: handleGoogleCredential,
        });
        setIsGoogleReady(true);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setErrorMessage(error?.message || 'Không thể khởi tạo đăng nhập Google.');
      }
    }

    bootstrapGoogleSignIn();
    return () => {
      isMounted = false;
      cancelGoogleOneTap();
    };
  }, [handleGoogleCredential]);

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col md:flex-row overflow-hidden font-body">
      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex md:w-1/2 bg-pale p-12 lg:p-16 flex-col relative overflow-hidden items-center justify-center border-r border-stone-200/50"
      >
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary-light/10 rounded-full blur-[80px]" />
        </div>

        <Link
          to="/"
          className="absolute top-12 left-12 text-stone-900 font-display text-2xl font-bold tracking-tighter z-10 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5 text-stone-400 hover:text-stone-900 transition-colors" />
          FITHIRE
        </Link>

        {/* Image and Content */}
        <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center mt-8">
           <div className="relative mb-10 w-full max-w-[320px] aspect-square">
             <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse" />
             <img 
               src="/images/success-human.png" 
               alt="FitHire User" 
               className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
             />
           </div>
           
           <div className="flex items-center justify-center gap-3 mb-6">
             <div className="w-10 h-[2px] bg-primary rounded-full"></div>
             <span className="text-primary font-bold tracking-widest text-xs uppercase">
               Nền tảng tuyển dụng thông minh
             </span>
             <div className="w-10 h-[2px] bg-primary rounded-full"></div>
           </div>

           <h2 className="text-3xl lg:text-4xl font-display font-bold text-stone-900 leading-tight mb-4">
             Kiến tạo sự nghiệp <br />
             <span className="text-primary italic">đột phá</span> của bạn.
           </h2>
           <p className="text-stone-500 text-base leading-relaxed max-w-md mx-auto">
             Đăng nhập để trải nghiệm nền tảng đồng hành giúp bạn tối ưu hồ sơ và rèn luyện kỹ năng phỏng vấn theo lộ trình cá nhân hóa.
           </p>
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 px-6 py-10 md:px-20 md:py-16 lg:px-24 flex flex-col justify-center bg-white"
      >
        <div className="max-w-md w-full mx-auto flex flex-col items-center text-center">
          {/* Mobile Back Button */}
          <Link
            to="/"
            className="md:hidden self-start inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-12 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-stone-900 mb-4">Đăng nhập FitHire</h1>
            <p className="text-stone-500 text-base leading-relaxed">
              Sử dụng tài khoản Google để tiếp tục. <br /> Không cần tạo mật khẩu, an toàn tuyệt đối.
            </p>
          </div>

          <div className="w-full space-y-6">
            <form onSubmit={handleEmailSubmit} className="space-y-4 text-left w-full mb-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Tài khoản Gmail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-stone-900 placeholder:text-stone-400"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full btn-primary !py-3 flex justify-center items-center"
              >
                Tiếp tục
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-stone-500 font-medium">Hoặc đăng nhập nhanh bằng</span>
              </div>
            </div>

            {/* Google Sign In */}
            <div className="flex flex-col items-center">
              {/* Removed the outer border box here */}
              <div
                className={`transition-opacity ${
                  isSubmitting ? 'pointer-events-none opacity-60' : ''
                }`}
              >
                <div ref={buttonContainerRef} className="flex justify-center min-h-[40px] w-full" />
              </div>
              
              {!isGoogleReady && !errorMessage && (
                <p className="text-xs text-stone-400 mt-3 flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-stone-300 border-t-primary rounded-full animate-spin" />
                  Đang tải Google Sign-In...
                </p>
              )}
            </div>

            {statusMessage && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 mt-4 text-left">
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                <span className="text-sm font-medium">{statusMessage}</span>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 mt-4 text-left">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <span className="text-sm font-medium">{errorMessage}</span>
              </motion.div>
            )}
          </div>
          
          <p className="mt-12 text-xs text-stone-400">
            Bằng việc đăng nhập, bạn đồng ý với <Link to="#" className="underline hover:text-stone-600">Điều khoản dịch vụ</Link> và <Link to="#" className="underline hover:text-stone-600">Chính sách bảo mật</Link> của chúng tôi.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
