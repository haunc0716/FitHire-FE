import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const links = [
    { name: 'Tính năng', path: '/features' },
    { name: 'Bảng giá', path: '/pricing' },
    { name: 'Quy trình', path: '/process' },
    { name: 'Hỗ trợ', path: '/support' },
  ];

  return (
    <nav className="w-full bg-white border-b border-zinc-100 h-20 flex items-center sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
        <Link to="/" className="font-display text-2xl font-bold tracking-tighter">
          FITHIRE
        </Link>
        
        <div className="hidden md:flex gap-10 items-center">
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-950 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <button className="btn-primary !py-2 !px-6 !text-[10px]">
            Bắt đầu
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
