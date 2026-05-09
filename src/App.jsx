import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './features/landing/pages/HomePage';
import FeaturesPage from './features/landing/pages/FeaturesPage';
import PricingPage from './features/pricing/pages/PricingPage';
import ProcessPage from './features/landing/pages/ProcessPage';
import SupportPage from './features/landing/pages/SupportPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import RoleProtectedRoute from './features/auth/components/RoleProtectedRoute';
import AdminLayout from './features/admin/layouts/AdminLayout';
import DashboardPage from './features/admin/pages/DashboardPage';
import UserManagementPage from './features/admin/pages/UserManagementPage';
import BillingPage from './features/admin/pages/BillingPage';
import CvAnalysisPage from './features/admin/pages/CvAnalysisPage';
import InterviewsPage from './features/admin/pages/InterviewsPage';
import AdminCulturalFitPage from './features/admin/pages/CulturalFitPage';
import AiSettingsPage from './features/admin/pages/AiSettingsPage';
import ReportsPage from './features/admin/pages/ReportsPage';
import AdminProfilePage from './features/admin/pages/AdminProfilePage';
import PlanManagementPage from './features/admin/pages/PlanManagementPage';
import UserLayout from './features/user/layouts/UserLayout';
import CvJdPage from './features/user/pages/CvJdPage';
import CvManagerPage from './features/user/pages/CvManagerPage';
import UserHistoryPage from './features/user/pages/UserHistoryPage';
import CulturalFitPage from './features/user/pages/CulturalFitPage';
import MockInterviewPage from './features/user/pages/MockInterviewPage';
import UserPricingPage from './features/user/pages/UserPricingPage';
import UserProfilePage from './features/user/pages/UserProfilePage';
import ChangePasswordPage from './features/user/pages/ChangePasswordPage';
import { clearAuthSession, getAuthSession, isSessionValid } from './features/auth/services/authSession';
import { ToastProvider } from './components/ui/ToastProvider';

const IDLE_TIMEOUT_MS = 20 * 60 * 1000;

function IdleLogoutWatcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef(null);

  useEffect(() => {
    const resetTimer = () => {
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

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
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
      <ToastProvider>
        <IdleLogoutWatcher />
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/support" element={<SupportPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route element={<RoleProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="plans" element={<PlanManagementPage />} />
            <Route path="cv-analysis" element={<CvAnalysisPage />} />
            <Route path="interviews" element={<InterviewsPage />} />
            <Route path="cultural-fit" element={<AdminCulturalFitPage />} />
            <Route path="ai-settings" element={<AiSettingsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={['USER']} />}>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<CvJdPage />} />
            <Route path="cv-jd" element={<CvJdPage />} />
            <Route path="cv-manager" element={<CvManagerPage />} />
            <Route path="history" element={<UserHistoryPage />} />
            <Route path="cultural-fit" element={<CulturalFitPage />} />
            <Route path="mock-interview" element={<MockInterviewPage />} />
            <Route path="pricing" element={<UserPricingPage />} />
            <Route path="profile" element={<UserProfilePage />} />
          </Route>
          <Route path="/change-password" element={<ChangePasswordPage />} />
        </Route>
        </Routes>
      </ToastProvider>
    </Router>
  );
}
