import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const activePath = location.pathname;
  const [isScrolled, setIsScrolled] = useState(false);

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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled
          ? 'py-3 bg-white/80 backdrop-blur-2xl border-b border-violet-100/50 shadow-2xl shadow-violet-500/5'
          : 'py-6 bg-transparent'
        }`}
    >
      <div className="flex justify-between items-center w-full px-8 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center group">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="/logo.png"
            alt="FitHire Logo"
            className="h-10 w-auto object-contain mix-blend-multiply"
          />
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="relative py-2 group"
            >
              <span className={`text-sm font-bold transition-all duration-300 ${activePath === link.path ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`}>
                {link.name}
              </span>
              {activePath === link.path && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ color: '#8B5CF6' }}
            className="text-slate-600 font-bold text-sm px-4 py-2 transition-colors"
          >
            Đăng nhập
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="primary-gradient text-white font-bold text-sm px-8 py-3 rounded-full shadow-xl shadow-primary/20 transition-all"
          >
            Bắt đầu ngay
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
