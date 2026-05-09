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
  Upload,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { clearAuthSession, getAuthSession } from '../../auth/services/authSession';

const navigation = [
  { name: 'Dashboard', href: '/user', icon: LayoutDashboard },
  { name: 'Chấm CV theo JD', href: '/user/cv-jd', icon: FileSearch },
  { name: 'Cultural Fit', href: '/user/cultural-fit', icon: HeartHandshake },
  { name: 'Mock Interview', href: '/user/mock-interview', icon: Mic2 },
  { name: 'Bảng giá', href: '/user/pricing', icon: BadgeDollarSign },
  { name: 'Hồ sơ', href: '/user/profile', icon: UserCircle2 },
  { name: 'Upload CV', href: '/user/cv-upload', icon: Upload },
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

  return (
    <>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-emerald-950/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 transform border-r border-emerald-100/70 bg-white/85 backdrop-blur-xl transition-all duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        <div className={`flex h-16 items-center border-b border-emerald-100/70 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-5'}`}>
          {!isCollapsed && (
            <div>
              <p className="font-display text-lg font-bold tracking-tight text-emerald-950">FitHire User Space</p>
              <p className="text-xs text-emerald-700/70">Pearl Experience</p>
            </div>
          )}
          {isCollapsed && <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">F</div>}

          <button className="hidden rounded-lg p-1 text-emerald-700 hover:bg-emerald-100/60 lg:flex" onClick={() => setIsCollapsed((v) => !v)}>
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <button className="absolute right-3 rounded-lg p-1 text-emerald-800 hover:bg-emerald-100 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {navigation.map((item) => (
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
            ))}
          </div>
        </div>

        <div className="border-t border-emerald-100/70 p-4">
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-3 rounded-2xl bg-emerald-50/70 p-3">
              <p className="text-xs text-emerald-700/80">Đang đăng nhập</p>
              <p className="truncate text-sm font-semibold text-emerald-950">{session?.user?.fullName || 'Người dùng FitHire'}</p>
            </motion.div>
          )}
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-xl py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}
          >
            <div className="h-6 w-6 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold">{avatarInitial}</div>
            {!isCollapsed && <span>Đăng xuất</span>}
            {isCollapsed && <LogOut className="h-4 w-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}
