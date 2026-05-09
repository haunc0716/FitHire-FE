import React, { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileSearch,
  HeartHandshake,
  Mic2,
  BadgeDollarSign,
  UserCircle2,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { clearAuthSession, getAuthSession } from '../../auth/services/authSession';

const mainNavigation = [
  { name: 'Dashboard', href: '/user', icon: LayoutDashboard },
  { name: 'Chấm CV theo JD', href: '/user/cv-jd', icon: FileSearch },
  { name: 'Cultural Fit', href: '/user/cultural-fit', icon: HeartHandshake },
  { name: 'Mock Interview', href: '/user/mock-interview', icon: Mic2 },
  { name: 'Bảng giá', href: '/user/pricing', icon: BadgeDollarSign },
];

const secondaryNavigation = [
  { name: 'Hồ sơ', href: '/user/profile', icon: UserCircle2 },
];

export default function UserSidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const session = getAuthSession();

  const avatarInitial = useMemo(() => {
    const name = session?.user?.fullName?.trim?.();
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  }, [session]);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  const renderNavLink = (item) => (
    <NavLink
      key={item.name}
      to={item.href}
      end={item.href === '/user'}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-2xl py-2.5 text-sm transition-all ${isCollapsed ? 'justify-center px-0' : 'px-3'} ${
          isActive
            ? 'bg-gradient-to-r from-emerald-100 to-lime-50 text-emerald-900 shadow-[0_8px_24px_rgba(16,185,129,0.14)]'
            : 'text-emerald-900/75 hover:bg-emerald-50/70'
        }`
      }
      title={isCollapsed ? item.name : undefined}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span className="font-medium">{item.name}</span>}
    </NavLink>
  );

  return (
    <>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-emerald-950/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transform border-r border-emerald-100/70 bg-white/90 backdrop-blur-xl transition-all duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`flex h-20 items-center border-b border-emerald-100/70 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-4'}`}>
          {!isCollapsed && (
            <div>
              <p className="font-display text-lg font-bold tracking-tight text-emerald-950">FitHire</p>
              <p className="text-xs text-emerald-700/70">User Space</p>
            </div>
          )}
          {isCollapsed && <div className="text-lg font-bold text-emerald-800">F</div>}

          <button className="hidden rounded-lg p-1 text-emerald-700 hover:bg-emerald-100/60 lg:flex" onClick={() => setIsCollapsed((v) => !v)}>
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <button className="absolute right-3 rounded-lg p-1 text-emerald-800 hover:bg-emerald-100 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">{mainNavigation.map(renderNavLink)}</div>
          <div className="my-4 border-t border-emerald-100/70" />
          <div className="space-y-1">{secondaryNavigation.map(renderNavLink)}</div>
        </div>

        <div className="border-t border-emerald-100/70 p-4">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center justify-center rounded-xl border border-rose-100 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 ${isCollapsed ? 'px-0' : 'px-3'}`}
          >
            <span className="font-semibold">Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
}
