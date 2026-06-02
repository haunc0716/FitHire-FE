import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearAuthSession } from '../../auth/services/authSession';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BrainCircuit,
  BarChart3,
  X,
  Package,
  ClipboardList,
  MessageSquareText,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const navigation = [
  { 
    group: 'Phân tích',
    items: [
      { name: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
      { name: 'Báo cáo & phân tích', href: '/admin/reports', icon: BarChart3 },
    ]
  },
  { 
    group: 'Quản lý',
    items: [
      { name: 'Quản lý người dùng', href: '/admin/users', icon: Users },
      { name: 'Quản lý gói dịch vụ', href: '/admin/plans', icon: Package },
      { name: 'Câu hỏi văn hóa', href: '/admin/assessment-questions', icon: ClipboardList },
      { name: 'Hỏi đáp người dùng', href: '/admin/questions', icon: MessageSquareText },
      { name: 'Gói dịch vụ & thanh toán', href: '/admin/billing', icon: CreditCard },
    ]
  },
];

export default function AdminSidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-stone-100 transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 lg:static lg:inset-0 flex flex-col shadow-2xl shadow-stone-200/50 lg:shadow-none ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isCollapsed ? 'w-20' : 'w-72'}`}>
        
        {/* Logo Section */}
        <div className={`flex items-center h-20 border-b border-stone-50 relative ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden group">
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 shrink-0 transform group-hover:rotate-12 transition-transform">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-stone-900 tracking-tight leading-none">
                  FitHire
                </span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">
                  Admin Panel
                </span>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 transform hover:scale-110 transition-transform cursor-pointer">
               <BrainCircuit className="w-6 h-6" />
            </div>
          )}
          
          <button 
            className="hidden lg:flex absolute -right-3 top-7 w-6 h-6 bg-white border border-stone-200 rounded-full items-center justify-center text-stone-400 hover:text-emerald-500 hover:border-emerald-200 shadow-sm transition-all z-10"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
          
          <button 
            className="lg:hidden p-2 text-stone-400 hover:text-stone-900 transition-colors absolute right-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
          {navigation.map((group) => (
            <div key={group.group} className="space-y-2">
              {!isCollapsed && (
                <h3 className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                  {group.group}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end={item.href === '/admin'}
                    className={({ isActive }) => `
                      flex items-center gap-3 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 group
                      ${isCollapsed ? 'justify-center px-0' : 'px-4'}
                      ${isActive 
                        ? 'bg-emerald-50 text-emerald-600 shadow-inner' 
                        : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                      }
                    `}
                    title={isCollapsed ? item.name : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110`} />
                        {!isCollapsed && <span className="truncate">{item.name}</span>}
                        {isActive && !isCollapsed && (
                          <motion.div 
                            layoutId="active-indicator"
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" 
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-stone-50 bg-stone-50/30">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-300 group ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
          >
            <div className="p-1.5 bg-white rounded-lg shadow-sm group-hover:bg-red-100 transition-colors">
              <LogOut className="w-5 h-5 shrink-0" />
            </div>
            {!isCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>
    </>
  );
}
