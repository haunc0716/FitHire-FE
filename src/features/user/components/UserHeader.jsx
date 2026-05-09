import React, { useMemo, useRef, useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LogOut,
  ChevronDown,
  Bell,
  MessageSquareText,
  UserCircle2,
  FileText,
  Target,
  FileSearch,
  History,
  Crown
} from 'lucide-react';
import { getAuthSession, clearAuthSession } from '../../auth/services/authSession';

const navGroups = [
  {
    name: 'Hồ sơ & CV',
    items: [
      { name: 'Quản lý CV', href: '/user/cv-manager', icon: FileText, desc: 'Quản lý các bản CV của bạn' },
      { name: 'Phân tích CV theo JD', href: '/user/cv-jd', icon: FileSearch, desc: 'Chấm điểm CV với công nghệ AI' }
    ]
  },
  {
    name: 'Công cụ',
    items: [
      { name: 'Luyện Phỏng vấn', href: '/user/mock-interview', icon: MessageSquareText, desc: 'Mô phỏng phỏng vấn thực tế' },
      { name: 'Đo Văn hóa', href: '/user/cultural-fit', icon: Target, desc: 'Đo lường mức độ phù hợp' }
    ]
  }
];

export default function UserHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getAuthSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for dropdowns
  const [activeDropdown, setActiveDropdown] = useState(null); 
  
  const headerRef = useRef(null);

  const userLabel = useMemo(() => session?.user?.fullName || 'Người dùng', [session]);
  const avatarInitial = useMemo(() => (userLabel?.trim()?.charAt(0) || 'U').toUpperCase(), [userLabel]);

  useEffect(() => {
    function onClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  const isGroupActive = (group) => {
    return group.items.some(item => location.pathname.startsWith(item.href));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white" ref={headerRef}>
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex h-[72px] items-center">
          
          {/* 1. Logo & Main Nav (Left Side) */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex shrink-0 items-center">
              <span className="font-display text-2xl font-bold tracking-tight text-[#00b14f]">
                FitHire
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 mt-1">
              {navGroups.map((group) => {
                const isActive = isGroupActive(group);
                const isHovered = activeDropdown === group.name;
                
                return (
                  <div 
                    key={group.name} 
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(group.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`flex items-center gap-1.5 px-4 py-5 text-[14px] font-semibold transition-colors
                        ${isActive || isHovered ? 'text-[#00b14f]' : 'text-stone-800 hover:text-[#00b14f]'}
                      `}
                    >
                      {group.name}
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isActive || isHovered ? 'text-[#00b14f]' : 'text-stone-400'} ${isHovered ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Mega Menu Dropdown */}
                    {isHovered && (
                      <div className="absolute left-0 top-full w-[320px] rounded-xl border border-stone-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] py-3 px-2">
                        {group.items.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-start gap-3 rounded-lg p-3 hover:bg-emerald-50 transition-colors group/item"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-600 transition-colors">
                              <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-stone-900 group-hover/item:text-emerald-600 transition-colors">{item.name}</p>
                              <p className="text-xs text-stone-500 mt-0.5">{item.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Static Pro Link */}
              <Link 
                to="/user/pricing"
                className="flex items-center gap-2 px-4 py-5 text-[14px] font-semibold text-stone-800 hover:text-[#00b14f] transition-colors"
              >
                FitHire
                <span className="rounded bg-[#fdb035] px-2 py-0.5 text-[11px] font-bold text-stone-900">
                  Pro
                </span>
              </Link>
            </nav>
          </div>

          {/* 2. Right Actions */}
          <div className="flex items-center gap-4 ml-auto">
            
            {/* Action Icons (Desktop) */}
            <div className="hidden md:flex items-center border-r border-stone-200 pr-5 mr-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
            </div>

            {/* User Avatar Dropdown */}
            <div 
              className="relative hidden md:block"
              onMouseEnter={() => setActiveDropdown('Avatar')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-2 cursor-pointer py-2 px-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-sm font-bold text-stone-700 border-2 border-white ring-2 ring-[#00b14f] shadow-sm hover:ring-[#009b45] transition-all">
                  {avatarInitial}
                </div>
                <div className="hidden lg:flex flex-col pl-1">
                  <span className="text-[11px] font-semibold text-stone-500 leading-none mb-1">Tài khoản</span>
                  <span className="text-[12px] font-bold text-[#00b14f] leading-none uppercase">Free</span>
                </div>
                <ChevronDown className="h-4 w-4 text-stone-400 ml-1" />
              </div>

              {activeDropdown === 'Avatar' && (
                <div className="absolute right-0 top-full w-[260px] rounded-xl border border-stone-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] py-2">
                  <div className="border-b border-stone-100 px-5 py-3 mb-2">
                    <p className="text-sm font-bold text-stone-900">{userLabel}</p>
                    <p className="text-xs font-medium text-stone-500 mt-0.5">Tài khoản ứng viên</p>
                  </div>
                  
                  <Link to="/user/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-emerald-600 transition-colors">
                    <UserCircle2 className="h-4 w-4" /> Cài đặt thông tin cá nhân
                  </Link>
                  <Link to="/user/history" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-emerald-600 transition-colors">
                    <History className="h-4 w-4" /> Lịch sử phân tích
                  </Link>
                  <Link to="/user/pricing" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-emerald-600 transition-colors">
                    <Crown className="h-4 w-4" /> Nâng cấp tài khoản Pro
                  </Link>
                  
                  <div className="my-2 border-t border-stone-100" />
                  
                  <button onClick={handleLogout} className="flex w-full items-center gap-3 px-5 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors">
                    <LogOut className="h-4 w-4" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>



            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          
          <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-white flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
              <span className="font-display text-xl font-black text-emerald-600">FitHire</span>
              <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 bg-stone-50 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white font-bold text-stone-700 border border-stone-200 shadow-sm">
                  {avatarInitial}
                </div>
                <div>
                  <p className="font-bold text-stone-900">{userLabel}</p>
                  <p className="text-xs text-stone-500">Tài khoản ứng viên</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4 space-y-6">
              {navGroups.map(group => (
                <div key={group.name}>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">{group.name}</p>
                  <div className="space-y-1">
                    {group.items.map(item => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-600"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Tài khoản</p>
                <div className="space-y-1">
                  <Link to="/user/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">
                    <UserCircle2 className="h-4 w-4" /> Cài đặt thông tin cá nhân
                  </Link>
                  <Link to="/user/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-amber-600 hover:bg-amber-50">
                    <Crown className="h-4 w-4" /> FitHire Pro
                  </Link>
                  <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50">
                    <LogOut className="h-4 w-4" /> Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
