import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, UserCircle, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminHeader({ setMobileMenuOpen }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
    // Add logout logic here (e.g., clear tokens)
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <button 
          className="lg:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search (Command Palette vibe) */}
        <div className="hidden sm:flex items-center max-w-md w-full relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3" />
          <input 
            type="text" 
            placeholder="Search users, transactions, or settings..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm outline-none transition-all duration-200"
          />
          <div className="absolute right-3 flex items-center gap-1">
            <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-medium text-gray-400">
              <span className="text-xs">⌘</span> K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-50">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100 relative" ref={dropdownRef}>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">Admin User</span>
            <span className="text-xs text-gray-500">Super Admin</span>
          </div>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium border border-emerald-200 hover:ring-2 hover:ring-emerald-500 hover:ring-offset-2 transition-all focus:outline-none"
          >
            A
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-12 mt-1 w-56 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all">
              <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
                  A
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-gray-900 truncate">Admin User</span>
                  <span className="text-xs text-gray-500 truncate">admin@fithire.com</span>
                </div>
              </div>
              <div className="p-2">
                <Link 
                  to="/admin/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
                >
                  <UserCircle className="w-4 h-4" />
                  My Profile
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
