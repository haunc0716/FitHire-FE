import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        isScrolled ? 'bg-white/90 backdrop-blur-xl border-b border-stone-100 py-3 shadow-sm' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="font-display text-2xl font-black tracking-tight text-primary">
          FitHire
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-semibold transition-all hover:text-primary ${
                location.pathname === link.path ? 'text-primary' : 'text-stone-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/login" className="btn-primary !py-2.5 !px-6 !text-xs">
            Bắt đầu
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
