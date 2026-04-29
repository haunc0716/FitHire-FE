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
    { name: 'TRANG CHỦ', path: '/' },
    { name: 'TÍNH NĂNG', path: '/features' },
    { name: 'BẢNG GIÁ', path: '/pricing' },
    { name: 'QUY TRÌNH', path: '/process' },
    { name: 'HỖ TRỢ', path: '/support' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-zinc-100 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="font-display text-xl font-bold tracking-tighter">
          FITHIRE
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[10px] font-bold tracking-[0.2em] transition-colors hover:text-zinc-950 ${
                location.pathname === link.path ? 'text-zinc-950' : 'text-zinc-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/login" className="btn-primary !py-2 !px-6 !text-[9px]">
            BẮT ĐẦU
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
