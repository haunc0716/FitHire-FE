import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './features/landing/pages/HomePage';
import FeaturesPage from './features/landing/pages/FeaturesPage';
import PricingPage from './features/pricing/pages/PricingPage';
import ProcessPage from './features/landing/pages/ProcessPage';
import SupportPage from './features/landing/pages/SupportPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
    </Router>
  );
}
