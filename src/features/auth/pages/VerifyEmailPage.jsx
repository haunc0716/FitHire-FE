import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, KeyRound } from 'lucide-react';
import verifyEmailImg from '../../../assets/verify-email.png';

import { resendVerificationCode, verifyEmail } from '../services/authApi';
import { resolveHomeByRole, saveAuthSession } from '../services/authSession';
import { useToast } from '../../../components/ui/ToastProvider';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: '', code: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const emailFromQuery = useMemo(() => {
    const search = new URLSearchParams(location.search);
    return (search.get('email') ?? '').trim();
  }, [location.search]);

  useEffect(() => {
    if (emailFromQuery) {
      setForm((prev) => ({ ...prev, email: emailFromQuery }));
    }
  }, [emailFromQuery]);

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.code) {
      showToast({
        type: 'warning',
        title: 'Thiếu thông tin',
        message: 'Vui lòng nhập email và mã xác thực.'
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
      const authPayload = await verifyEmail({ email: form.email, code: form.code });
      const session = saveAuthSession(authPayload);
      showToast({
        type: 'success',
        title: 'Xác thực thành công',
        message: 'Đang chuyển hướng...'
      });
      navigate(resolveHomeByRole(session?.user?.role), { replace: true });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Xác thực thất bại',
        message: error?.message || 'Vui lòng thử lại.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!form.email) {
      showToast({
        type: 'warning',
        title: 'Thiếu email',
        message: 'Vui lòng nhập email để gửi lại mã.'
      });
      return;
    }

    setIsResending(true);
    try {
      await resendVerificationCode(form.email);
      showToast({
        type: 'success',
        title: 'Đã gửi lại mã',
        message: 'Vui lòng kiểm tra email của bạn.'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Không gửi được mã',
        message: error?.message || 'Vui lòng thử lại sau.'
      });
    } finally {
      setIsResending(false);
    }
  };

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
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex md:w-1/2 bg-pale p-12 lg:p-16 flex-col relative overflow-hidden items-center justify-center border-r border-stone-200/50"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[5%] right-[15%] w-[360px] h-[360px] bg-primary/10 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              y: [0, 40, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-[10%] left-[5%] w-[320px] h-[320px] bg-primary-light/10 rounded-full blur-[80px]"
          />
        </div>

        <Link
          to="/login"
          className="absolute top-12 left-12 text-stone-900 font-display text-2xl font-bold tracking-tighter z-20 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5 text-stone-400 hover:text-stone-900 transition-colors" />
          FITHIRE
        </Link>

        <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative mb-12 w-full max-w-[320px] aspect-square"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse" />
            <div className="relative z-10 w-full h-full rounded-3xl bg-white/70 border border-white/70 shadow-2xl shadow-primary/10 flex items-center justify-center overflow-hidden">
              <img src={verifyEmailImg} alt="Xác thực email" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-primary/30 rounded-full"></div>
            <span className="text-primary font-bold tracking-widest text-[10px] uppercase">
              Xác thực tài khoản
            </span>
            <div className="w-10 h-[2px] bg-primary/30 rounded-full"></div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-display font-bold text-stone-900 leading-tight mb-6">
            HOÀN TẤT <br />
            <span className="text-primary italic">XÁC THỰC EMAIL</span>
          </h2>
          <p className="text-stone-500 text-base leading-relaxed max-w-sm mx-auto">
            Nhập mã OTP gửi về email để kích hoạt tài khoản và tiếp tục sử dụng FitHire.
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 px-6 py-10 md:px-20 md:py-16 lg:px-24 flex flex-col justify-center bg-white"
      >
        <div className="max-w-md w-full mx-auto">
          <motion.div variants={itemVariants} className="text-center md:text-left mb-10">
            <Link
              to="/login"
              className="md:hidden self-start inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-12 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </Link>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-stone-900 mb-4 uppercase tracking-tight">Xác thực email</h1>
            <p className="text-stone-500 text-base leading-relaxed">
              Nhập email và mã OTP để hoàn tất đăng ký.
            </p>
          </motion.div>

          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5 text-left w-full mb-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="ten-cua-ban@gmail.com"
                  className="w-full pl-10 pr-4 py-4 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-900 placeholder:text-stone-400 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Mã OTP</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="text"
                  value={form.code}
                  onChange={handleChange('code')}
                  placeholder="Nhập mã xác thực"
                  className="w-full pl-10 pr-4 py-4 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-900 placeholder:text-stone-400 text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang xác thực...' : 'Xác thực tài khoản'}
            </button>
          </motion.form>

          <motion.div variants={itemVariants} className="text-center">
            <p className="text-xs text-stone-500 leading-relaxed">
              Không nhận được mã?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-primary font-bold hover:underline uppercase tracking-wider text-xs disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isResending ? 'Đang gửi lại...' : 'Gửi lại mã'}
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
