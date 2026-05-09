import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { loginWithGoogle } from '../services/authApi';
import { useToast } from '../../../components/ui/ToastProvider';
import {
  getAuthSession,
  isSessionValid,
  resolveHomeByRole,
  saveAuthSession,
} from '../services/authSession';
import {
  cancelGoogleOneTap,
  loadGoogleIdentityScript,
  renderGoogleSignInButton,
} from '../services/googleIdentityService';

const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '').trim();

const LoginPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const buttonContainerRef = useRef(null);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleInitFailed, setGoogleInitFailed] = useState(false);
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    showToast({
      type: 'warning',
      title: 'Chưa hỗ trợ',
      message: 'Vui lòng click vào nút Google bên dưới để tiếp tục.'
    });
  };

  useEffect(() => {
    const currentSession = getAuthSession();
    if (isSessionValid(currentSession)) {
      navigate(resolveHomeByRole(currentSession?.user?.role), { replace: true });
    }
  }, [navigate]);

  const handleGoogleCredential = useCallback(
    async (credentialResponse) => {
      const idToken = credentialResponse?.credential;
      if (!idToken) {
        showToast({
          type: 'error',
          title: 'Đăng nhập thất bại',
          message: 'Google không trả về idToken. Vui lòng thử lại.'
        });
        return;
      }

      setIsSubmitting(true);
      showToast({
        type: 'info',
        title: 'Đang xác thực',
        message: 'Vui lòng chờ trong giây lát.'
      });

      try {
        const authPayload = await loginWithGoogle(idToken);
        const session = saveAuthSession(authPayload);
        showToast({
          type: 'success',
          title: 'Đăng nhập thành công',
          message: 'Đang chuyển hướng...'
        });
        navigate(resolveHomeByRole(session?.user?.role), { replace: true });
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Đăng nhập thất bại',
          message: error?.message || 'Vui lòng thử lại.'
        });
      } finally {
        setIsSubmitting(false);
      }
    },
      [navigate, showToast]
    );

  useEffect(() => {
    let isMounted = true;

    async function bootstrapGoogleSignIn() {
      if (!googleClientId) {
        showToast({
          type: 'error',
          title: 'Thiếu cấu hình',
          message: 'VITE_GOOGLE_CLIENT_ID chưa được cấu hình.'
        });
        setGoogleInitFailed(true);
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
        setGoogleInitFailed(false);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        showToast({
          type: 'error',
          title: 'Không thể khởi tạo Google',
          message: error?.message || 'Vui lòng thử lại sau.'
        });
        setGoogleInitFailed(true);
      }
    }

    bootstrapGoogleSignIn();
    return () => {
      isMounted = false;
      cancelGoogleOneTap();
    };
  }, [handleGoogleCredential, showToast]);

  // Framer Motion variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col md:flex-row overflow-hidden font-body">
      {/* Left side: Hero Section */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex md:w-1/2 bg-pale p-12 lg:p-16 flex-col relative overflow-hidden items-center justify-center border-r border-stone-200/50"
      >
        {/* Floating Bubble Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[5%] right-[15%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ 
              y: [0, 40, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] bg-primary-light/10 rounded-full blur-[80px]" 
          />
          <div className="absolute top-[30%] left-[-5%] w-[200px] h-[200px] bg-emerald-100/30 rounded-full blur-[60px]" />
        </div>

        <Link
          to="/"
          className="absolute top-12 left-12 text-stone-900 font-display text-2xl font-bold tracking-tighter z-20 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5 text-stone-400 hover:text-stone-900 transition-colors" />
          FITHIRE
        </Link>

        <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative mb-12 w-full max-w-[340px] aspect-square"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse" />
            <img
              src="/images/success-human.png"
              alt="FitHire User"
              className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(21,128,61,0.15)]"
            />
          </motion.div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-primary/30 rounded-full"></div>
            <span className="text-primary font-bold tracking-widest text-[10px] uppercase">
              Nền tảng tuyển dụng thông minh
            </span>
            <div className="w-10 h-[2px] bg-primary/30 rounded-full"></div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-display font-bold text-stone-900 leading-tight mb-6">
            Kiến tạo sự nghiệp <br />
            <span className="text-primary italic">đột phá</span> của bạn.
          </h2>
          <p className="text-stone-500 text-base leading-relaxed max-w-sm mx-auto">
            Đăng nhập để trải nghiệm nền tảng đồng hành giúp bạn tối ưu hồ sơ và rèn luyện kỹ năng phỏng vấn theo lộ trình cá nhân hóa.
          </p>
        </div>
      </motion.div>

      {/* Right side: Login Form */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 px-6 py-10 md:px-20 md:py-16 lg:px-24 flex flex-col justify-center bg-white"
      >
        <div className="max-w-md w-full mx-auto">
          <motion.div variants={itemVariants} className="text-center md:text-left mb-10">
            <Link
              to="/"
              className="md:hidden self-start inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-12 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại trang chủ
            </Link>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-stone-900 mb-4 uppercase tracking-tight">Đăng nhập</h1>
            <p className="text-stone-500 text-base leading-relaxed">
              Chào mừng bạn quay trở lại. <br /> Đăng nhập để tiếp tục hành trình sự nghiệp.
            </p>
          </motion.div>

          <div className="w-full">
            <motion.form variants={itemVariants} onSubmit={handleEmailSubmit} className="space-y-5 text-left w-full mb-8">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Email / Tài khoản</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ten-cua-ban@gmail.com"
                  className="w-full px-4 py-4 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-900 placeholder:text-stone-400 text-sm"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400">Mật khẩu</label>
                  <Link to="/forgot-password" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary-dark">Quên mật khẩu?</Link>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-4 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-900 placeholder:text-stone-400 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 mt-2"
              >
                Đăng nhập FitHire
              </button>
            </motion.form>

            <motion.div variants={itemVariants} className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                <span className="px-4 bg-white text-stone-400">Hoặc đăng nhập nhanh bằng</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col items-center">
              <div
                className={`transition-opacity ${isSubmitting ? 'pointer-events-none opacity-60' : ''
                  }`}
              >
                <div ref={buttonContainerRef} className="flex justify-center min-h-[40px] w-full" />
              </div>

              {!isGoogleReady && !googleInitFailed && (
                <div className="text-[10px] font-bold text-stone-400 mt-3 flex items-center gap-2 uppercase tracking-widest">
                  <div className="w-3 h-3 border-2 border-stone-300 border-t-primary rounded-full animate-spin" />
                  Đang tải Google...
                </div>
              )}
            </motion.div>
          </div>

          <motion.p variants={itemVariants} className="mt-10 text-center text-sm text-stone-500">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">Đăng ký ngay</Link>
          </motion.p>

          <motion.p variants={itemVariants} className="mt-12 text-center text-[10px] text-stone-400 leading-relaxed max-w-xs mx-auto">
            Bằng việc đăng nhập, bạn đồng ý với <Link to="#" className="underline hover:text-stone-600">Điều khoản dịch vụ</Link> và <Link to="#" className="underline hover:text-stone-600">Chính sách bảo mật</Link> của FitHire.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
