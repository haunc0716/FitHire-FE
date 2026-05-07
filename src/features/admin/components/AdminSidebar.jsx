import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  Video, 
  BrainCircuit, 
  Settings, 
  BarChart3, 
  UserCircle,
  Menu,
  X,
  Package,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Subscription', href: '/admin/billing', icon: CreditCard },
  { name: 'Plan Management', href: '/admin/plans', icon: Package },
  { name: 'CV Analysis', href: '/admin/cv-analysis', icon: FileText },
  { name: 'Mock Interviews', href: '/admin/interviews', icon: Video },
  { name: 'Cultural Fit', href: '/admin/cultural-fit', icon: BrainCircuit },
  { name: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
  { name: 'AI Settings', href: '/admin/ai-settings', icon: Settings },
];

export default function AdminSidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isCollapsed ? 'w-20' : 'w-72'}`}>
        <div className={`flex items-center h-16 border-b border-gray-50 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent whitespace-nowrap">
                FitHire <span className="text-emerald-500 font-medium text-sm ml-1 px-2 py-0.5 bg-emerald-50 rounded-full">Admin</span>
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="flex items-center justify-center hidden lg:flex">
               <span className="text-2xl font-bold text-emerald-500">F</span>
            </div>
          )}
          
          <button 
            className="hidden lg:flex p-1 text-gray-400 hover:text-gray-600 transition-colors shrink-0 rounded-lg hover:bg-gray-100"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700 shrink-0 absolute right-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 overflow-x-hidden">
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 truncate">
                Overview
              </p>
            )}
            {isCollapsed && <div className="mb-4"></div>}
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/admin'}
                className={({ isActive }) => `
                  flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isCollapsed ? 'justify-center px-0' : 'px-3'}
                  ${isActive 
                    ? 'bg-emerald-50 text-emerald-600 shadow-[0_2px_10px_rgba(16,185,129,0.1)]' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-50">
          <button
            onClick={() => navigate('/login')}
            className={`w-full flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}
            title={isCollapsed ? "Log out" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Log out</span>}
          </button>
        </div>
      </div>
    </>
  );
}
