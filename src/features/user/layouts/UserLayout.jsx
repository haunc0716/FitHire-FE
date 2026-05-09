import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';
import UserHeader from '../components/UserHeader';

export default function UserLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-[#f8fff9] via-[#f4fffa] to-[#f6fff4]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-lime-200/35 blur-3xl" />
      </div>

      <UserSidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <UserHeader onMenuOpen={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
