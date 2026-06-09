import React, { Suspense, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
const HomePage = React.lazy(() => import('./features/landing/pages/HomePage'));
const FeaturesPage = React.lazy(() => import('./features/landing/pages/FeaturesPage'));
const PricingPage = React.lazy(() => import('./features/pricing/pages/PricingPage'));
const ProcessPage = React.lazy(() => import('./features/landing/pages/ProcessPage'));
const SupportPage = React.lazy(() => import('./features/landing/pages/SupportPage'));
const LoginPage = React.lazy(() => import('./features/auth/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./features/auth/pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./features/auth/pages/ForgotPasswordPage'));
const VerifyEmailPage = React.lazy(() => import('./features/auth/pages/VerifyEmailPage'));
const RoleProtectedRoute = React.lazy(() => import('./features/auth/components/RoleProtectedRoute'));
const AdminLayout = React.lazy(() => import('./features/admin/layouts/AdminLayout'));
const DashboardPage = React.lazy(() => import('./features/admin/pages/DashboardPage'));
const UserManagementPage = React.lazy(() => import('./features/admin/pages/UserManagementPage'));
const BillingPage = React.lazy(() => import('./features/admin/pages/BillingPage'));
const ReportsPage = React.lazy(() => import('./features/admin/pages/ReportsPage'));
const AdminProfilePage = React.lazy(() => import('./features/admin/pages/AdminProfilePage'));
const PlanManagementPage = React.lazy(() => import('./features/admin/pages/PlanManagementPage'));
const AssessmentQuestionManagementPage = React.lazy(() => import('./features/admin/pages/AssessmentQuestionManagementPage'));
const QuestionManagementPage = React.lazy(() => import('./features/admin/pages/QuestionManagementPage'));
const StatisticsPage = React.lazy(() => import('./features/admin/pages/StatisticsPage'));
const MyQuestionsPage = React.lazy(() => import('./features/user/pages/MyQuestionsPage'));
const UserLayout = React.lazy(() => import('./features/user/layouts/UserLayout'));
const CvJdPage = React.lazy(() => import('./features/user/pages/CvJdPage'));
const UserHistoryPage = React.lazy(() => import('./features/user/pages/UserHistoryPage'));
const EntitlementsPage = React.lazy(() => import('./features/user/pages/EntitlementsPage'));
const CulturalFitPage = React.lazy(() => import('./features/user/pages/CulturalFitPage'));
const MockInterviewPage = React.lazy(() => import('./features/user/pages/MockInterviewPage'));
const UserPricingPage = React.lazy(() => import('./features/user/pages/UserPricingPage'));
const UserProfilePage = React.lazy(() => import('./features/user/pages/UserProfilePage'));
const ChangePasswordPage = React.lazy(() => import('./features/user/pages/ChangePasswordPage'));
const PaymentHistoryPage = React.lazy(() => import('./features/payments/pages/PaymentHistoryPage'));
const PayOSReturnPage = React.lazy(() => import('./features/payments/pages/PayOSReturnPage'));

import { clearAuthSession, getAuthSession, isSessionValid } from './features/auth/services/authSession';
import { ToastProvider } from './components/ui/ToastProvider';
import ScrollToTop from './components/layout/ScrollToTop';

const IDLE_TIMEOUT_MS = 20 * 60 * 1000;

const RouteFallback = () => (
  <div className="min-h-screen bg-warm-bg flex items-center justify-center p-6">
    <div className="w-full max-w-xl space-y-4">
      <div className="h-8 w-1/2 bg-stone-100 rounded-full animate-pulse" />
      <div className="h-5 w-full bg-stone-100 rounded-full animate-pulse" />
      <div className="h-5 w-5/6 bg-stone-100 rounded-full animate-pulse" />
      <div className="h-64 w-full bg-stone-100 rounded-3xl animate-pulse" />
    </div>
  </div>
);

function IdleLogoutWatcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef(null);
  const lastResetRef = useRef(0);

  useEffect(() => {
    const resetTimer = () => {
      const now = Date.now();
      // Only reset timer at most once every 2 seconds to save performance
      if (now - lastResetRef.current < 2000) return;
      lastResetRef.current = now;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const session = getAuthSession();
      if (!isSessionValid(session)) {
        return;
      }

      timerRef.current = setTimeout(() => {
        clearAuthSession();
        navigate('/login', { replace: true });
      }, IDLE_TIMEOUT_MS);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    // Removed mousemove as it's too frequent and usually mousedown/scroll are enough to detect activity
    events.forEach((eventName) => window.addEventListener(eventName, resetTimer, { passive: true }));

    const handleVisibility = () => {
      if (!document.hidden) {
        resetTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((eventName) => window.removeEventListener(eventName, resetTimer));
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [location.pathname, navigate]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastProvider>
        <IdleLogoutWatcher />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/support" element={<SupportPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            <Route element={<RoleProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="plans" element={<PlanManagementPage />} />
                <Route path="assessment-questions" element={<AssessmentQuestionManagementPage />} />
                <Route path="questions" element={<QuestionManagementPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="statistics" element={<StatisticsPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
              </Route>
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={['USER']} />}>
              <Route path="/user" element={<UserLayout />}>
                <Route index element={<CvJdPage />} />
                <Route path="cv-jd" element={<CvJdPage />} />
                <Route path="history" element={<UserHistoryPage />} />
                <Route path="entitlements" element={<EntitlementsPage />} />
                <Route path="cultural-fit" element={<CulturalFitPage />} />
                <Route path="mock-interview" element={<MockInterviewPage />} />
                <Route path="pricing" element={<UserPricingPage />} />
                <Route path="profile" element={<UserProfilePage />} />
                <Route path="payments" element={<PaymentHistoryPage />} />
                <Route path="questions" element={<MyQuestionsPage />} />
              </Route>
              <Route path="/change-password" element={<ChangePasswordPage />} />
            </Route>

            {/* PayOS return/cancel/success: tach rieng de luon render duoc
                ngay ca khi session vua het han. Trang PayOSReturnPage se tu
                chuyen huong ve /login neu can. */}
            <Route path="/payments/return" element={<PayOSReturnPage />} />
            <Route path="/payments/cancel" element={<PayOSReturnPage />} />
            <Route path="/payments/success" element={<PayOSReturnPage />} />


          </Routes>
        </Suspense>
      </ToastProvider>
    </Router>
  );
}
