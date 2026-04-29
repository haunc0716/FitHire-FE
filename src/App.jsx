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
      </Routes>
    </Router>
  );
}
