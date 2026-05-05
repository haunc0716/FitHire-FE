import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden font-body">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex md:w-1/2 bg-zinc-950 p-16 lg:p-20 flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-white blur-[160px] rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>

        <Link
          to="/"
          className="text-white font-display text-2xl font-bold tracking-tighter relative z-10 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          FITHIRE
        </Link>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
            Đăng nhập an toàn
            <br />
            với Google.
          </h2>
          <p className="text-zinc-400 max-w-md text-base lg:text-lg leading-relaxed">
            FitHire sử dụng Google Sign-In để xác thực nhanh và bảo mật hơn.
            Nếu email chưa có trong hệ thống, tài khoản sẽ được tạo tự động.
          </p>
        </div>

        <div className="relative z-10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          Secure Auth Flow • Google ID Token • JWT Session
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 px-6 py-10 md:px-20 md:py-16 lg:px-24 flex flex-col justify-center"
      >
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-display font-bold text-zinc-950 mb-3">Đăng nhập FitHire</h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Bấm nút Google bên dưới để nhận <span className="font-semibold">idToken</span>, sau đó FE gửi về
              <span className="font-semibold"> /api/auth/google</span> để BE xác thực và đăng nhập.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 space-y-4">
            <div className="flex items-start gap-3 text-zinc-700">
              <ShieldCheck className="w-5 h-5 mt-0.5 text-zinc-900" />
              <p className="text-sm leading-relaxed">
                Không cần tạo mật khẩu thủ công. Hệ thống sẽ tự động đăng nhập nếu user đã tồn tại, hoặc tạo user mới
                nếu chưa có.
              </p>
            </div>

            <div
              className={`rounded-xl border border-zinc-200 bg-white px-4 py-3 ${
                isSubmitting ? 'pointer-events-none opacity-60' : ''
              }`}
            >
              <div ref={buttonContainerRef} className="flex justify-center min-h-11" />
            </div>

            {!isGoogleReady && !errorMessage && (
              <p className="text-xs text-zinc-500">Đang tải Google Sign-In...</p>
            )}

            {statusMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 mt-0.5" />
                <span className="text-xs">{statusMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <span className="text-xs">{errorMessage}</span>
              </div>
            )}

            {isSubmitting && (
              <p className="text-xs text-zinc-500">Vui lòng chờ, hệ thống đang xử lý đăng nhập...</p>
            )}
          </div>

          <div className="mt-8 text-sm text-zinc-500">
            Chưa có tài khoản? Bạn chỉ cần đăng nhập Google lần đầu, hệ thống sẽ tự tạo hồ sơ.
          </div>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay về trang chủ
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
