import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const activePath = location.pathname;

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Tính năng', path: '/features' },
    { name: 'Bảng giá', path: '/pricing' },
    { name: 'Quy trình', path: '#' },
    { name: 'Hỗ trợ', path: '#' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-violet-100/50 shadow-[0_4px_20px_rgba(139,92,246,0.08)]">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="FitHire Logo" className="h-10 w-auto object-contain mix-blend-multiply" />
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-['Plus_Jakarta_Sans'] text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`transition-all duration-300 transform active:scale-95 ${
                activePath === link.path
                  ? 'text-violet-600 font-bold relative after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-violet-600 after:rounded-full'
                  : 'text-slate-600 hover:text-violet-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-slate-600 font-medium text-sm px-4 py-2 hover:text-violet-500 transition-all active:scale-95">
            Đăng nhập
          </button>
          <button className="primary-gradient text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-lg shadow-violet-500/20 hover:scale-105 active:scale-95 transition-all">
            Bắt đầu ngay
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
