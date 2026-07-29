import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, UserCircle, LogOut, Settings, ChevronDown, CreditCard, MessageSquareText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthSession } from '../../auth/services/authSession';
import { fetchMyProfile } from '../../user/services/userApi';
import { getAdminPayments } from '../services/paymentApi';
import { getAdminQuestions } from '../services/questionApi';

function toItems(data) {
  return Array.isArray(data) ? data : data?.items || data?.content || [];
}

export default function AdminHeader({ setMobileMenuOpen }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
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

  const loadNotifications = async () => {
    setIsNotificationsLoading(true);
    try {
      const [paymentsResult, questionsResult] = await Promise.allSettled([
        getAdminPayments(),
        getAdminQuestions(),
      ]);

      const payments = paymentsResult.status === 'fulfilled' ? toItems(paymentsResult.value) : [];
      const questions = questionsResult.status === 'fulfilled' ? toItems(questionsResult.value) : [];

      const pendingPayments = payments
        .filter((payment) => String(payment?.status || '').toUpperCase() === 'PENDING')
        .slice(0, 5)
        .map((payment) => ({
          id: `payment-${payment.id}`,
          title: `Giao dịch #${payment.id} đang chờ`,
          description: `${payment.userFullName || payment.user?.fullName || payment.userEmail || 'Khách hàng'} cần xử lý thanh toán.`,
          href: '/admin/billing',
          icon: CreditCard,
          tone: 'amber',
        }));

      const pendingQuestions = questions
        .filter((question) => String(question?.status || '').toUpperCase() === 'PENDING')
        .slice(0, 5)
        .map((question) => ({
          id: `question-${question.questionId}`,
          title: 'Câu hỏi chờ trả lời',
          description: question.title || question.content || 'Người dùng vừa gửi câu hỏi mới.',
          href: '/admin/questions',
          icon: MessageSquareText,
          tone: 'emerald',
        }));

      setNotifications([...pendingPayments, ...pendingQuestions].slice(0, 8));
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setNotifications([]);
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
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
  const notificationCount = notifications.length;

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
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setIsNotificationsOpen((open) => !open);
              if (!isNotificationsOpen) loadNotifications();
            }}
            className="relative p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all group"
            title="Thông báo"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 ? (
              <span className="absolute top-1.5 right-1.5 min-w-4 h-4 rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-bold leading-3 text-white group-hover:scale-110 transition-transform">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            ) : null}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-50 bg-gradient-to-br from-gray-50 to-white px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">Thông báo</p>
                  <p className="text-xs text-gray-500">{notificationCount} mục cần chú ý</p>
                </div>
                <button
                  onClick={loadNotifications}
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
                >
                  Làm mới
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto p-2">
                {isNotificationsLoading ? (
                  <div className="px-4 py-8 text-center text-sm font-medium text-gray-500">Đang tải thông báo...</div>
                ) : notificationCount === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-700">Không có thông báo mới</p>
                    <p className="mt-1 text-xs text-gray-400">Mọi thứ đang ổn.</p>
                  </div>
                ) : (
                  notifications.map((item) => {
                    const Icon = item.icon;
                    const toneClass = item.tone === 'amber'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-emerald-50 text-emerald-600';
                    return (
                      <Link
                        key={item.id}
                        to={item.href}
                        onClick={() => setIsNotificationsOpen(false)}
                        className="flex gap-3 rounded-xl px-3 py-3 text-left transition-all hover:bg-gray-50"
                      >
                        <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900">{item.title}</p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{item.description}</p>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

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
