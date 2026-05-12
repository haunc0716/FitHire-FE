import React from 'react';
import { Outlet } from 'react-router-dom';
import UserHeader from '../components/UserHeader';

export default function UserLayout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#fafbfc]">
      {/* Global Background Effects (Optional: if we want to keep the SaaS glow) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden mix-blend-multiply">
        <div className="absolute -top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-indigo-50/50 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-emerald-50/40 blur-[120px]" />
      </div>

      {/* Top Navigation Bar */}
      <UserHeader />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full">
        {/* Child routes (Dashboard, CvJdPage, etc.) will control their own max-width */}
        <Outlet />
      </main>
    </div>
  );
}
