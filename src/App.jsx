import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './features/landing/pages/HomePage';
import FeaturesPage from './features/landing/pages/FeaturesPage';
import PricingPage from './features/pricing/pages/PricingPage';
import ProcessPage from './features/landing/pages/ProcessPage';
import SupportPage from './features/landing/pages/SupportPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
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

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/support" element={<SupportPage />} />

        {/* Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Admin Pages */}
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
      </Routes>
    </Router>
  );
}
