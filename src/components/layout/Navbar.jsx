import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAuthSession } from '../../features/auth/services/authSession';
import UserHeader from '../../features/user/components/UserHeader';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const session = getAuthSession();
    const valid = !!(session?.accessToken && session.expiresAt > Date.now());
    setIsLoggedIn(valid);
    setRole(session?.user?.role);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  if (isLoggedIn && role === 'USER') {
    return <UserHeader />;
  }

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Tính năng', path: '/features' },
    { name: 'Bảng giá', path: '/pricing' },
    { name: 'Quy trình', path: '/process' },
    { name: 'Hỗ trợ', path: '/support' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white shadow-[0_6px_24px_rgba(0,0,0,0.07)] border-b border-stone-200 py-2.5'
          : 'bg-white/80 backdrop-blur-lg border-b border-stone-100/60 py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/favicon.png"
            alt="FitHire logo"
            className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
          />
          <span className="font-display text-xl font-black tracking-tight text-emerald-600">
            Fit<span className="text-emerald-400">Hire</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-semibold transition-all hover:text-emerald-600 ${
                location.pathname === link.path ? 'text-emerald-600' : 'text-stone-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {isLoggedIn && role === 'ADMIN' ? (
            <Link to="/admin" className="btn-primary !py-2.5 !px-6 !text-xs bg-emerald-600 hover:bg-emerald-700">
              Admin Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn-primary !py-2.5 !px-6 !text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
