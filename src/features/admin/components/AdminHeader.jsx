import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, UserCircle, LogOut, Settings, HelpCircle, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthSession } from '../../auth/services/authSession';
import { fetchMyProfile } from '../../user/services/userApi';

export default function AdminHeader({ setMobileMenuOpen }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchMyProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load admin profile:', err);
      }
    }
    loadProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    clearAuthSession();
    navigate('/login');
  };

  const displayName = profile?.fullName || 'Quản trị viên';
  const displayEmail = profile?.email || 'admin@fithire.com';
  const avatarUrl = profile?.avatarUrl;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 z-40 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <button
          className="lg:hidden p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search */}
        <div className="hidden sm:flex items-center max-w-md w-full relative group">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Tìm người dùng, giao dịch, cài đặt..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-sm outline-none transition-all duration-300"
          />
          <div className="absolute right-3 flex items-center gap-1">
            <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-medium text-gray-400">
              <span className="text-xs">⌘</span> K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Support/Help */}
        <button className="hidden md:flex p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all" title="Trung tâm hỗ trợ">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
        </button>

        <div className="h-6 w-px bg-gray-100 mx-1 hidden sm:block"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-2xl transition-all group"
          >
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200 overflow-hidden shrink-0 border border-white">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <div className="hidden lg:flex flex-col items-start min-w-0 pr-1">
              <span className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{displayName}</span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Quản trị viên</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
              <div className="p-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-50 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-100 overflow-hidden shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-gray-900 truncate">{displayName}</span>
                  <span className="text-xs text-gray-500 truncate">{displayEmail}</span>
                </div>
              </div>
              
              <div className="p-2">
                <Link
                  to="/admin/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
                >
                  <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                    <UserCircle className="w-4 h-4" />
                  </div>
                  Cài đặt tài khoản
                </Link>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
                >
                  <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                    <Settings className="w-4 h-4" />
                  </div>
                  Cấu hình hệ thống
                </button>
              </div>

              <div className="p-2 border-t border-gray-50 bg-gray-50/50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                    <LogOut className="w-4 h-4" />
                  </div>
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
