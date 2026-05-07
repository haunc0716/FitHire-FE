import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, UserCircle, LogOut, Settings, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthSession } from '../../auth/services/authSession';

export default function UserHeader({ setMobileMenuOpen }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <button 
          className="lg:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden sm:flex items-center max-w-md w-full relative group">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search CVs, interview logs..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl text-sm outline-none transition-all duration-300"
          />
          <div className="absolute right-3 flex items-center gap-1">
            <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-medium text-gray-400 shadow-sm">
              <span className="text-xs">⌘</span> K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Upgrade Button */}
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-100 transition-colors border border-amber-200/50">
          <Sparkles className="w-3.5 h-3.5" />
          Upgrade to Pro
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-50">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-gray-100 relative" ref={dropdownRef}>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">Alex Nguyen</span>
            <span className="text-xs text-gray-500">Free Plan</span>
          </div>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-semibold border border-emerald-100 hover:ring-2 hover:ring-emerald-500 hover:ring-offset-2 transition-all focus:outline-none overflow-hidden"
          >
            {/* Can use an image here if available */}
            <span className="text-sm">A</span>
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-12 mt-1 w-56 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all">
              <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
                  A
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-gray-900 truncate">Alex Nguyen</span>
                  <span className="text-xs text-gray-500 truncate">alex@example.com</span>
                </div>
              </div>
              <div className="p-2 space-y-1">
                <Link 
                  to="/user/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
                >
                  <UserCircle className="w-4 h-4" />
                  My Profile
                </Link>
                <Link 
                  to="/user/pricing"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Upgrade Plan
                </Link>
              </div>
              <div className="border-t border-gray-50 p-2">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
