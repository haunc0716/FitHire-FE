import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-zinc-100 pt-24 pb-12">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-zinc-950 flex items-center justify-center text-white font-display font-bold">F</div>
              <span className="font-display text-xl font-bold tracking-tighter">FitHire</span>
            </Link>
            <p className="text-muted text-base max-w-sm mb-8">
              Nền tảng ứng dụng AI hàng đầu giúp kết nối nhân tài Gen-Z với các doanh nghiệp tiên phong.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: 'Công ty', links: ['Về chúng tôi', 'Nghề nghiệp', 'Blog'] },
              { title: 'Sản phẩm', links: ['Tính năng', 'Bảng giá', 'Quy trình'] },
              { title: 'Pháp lý', links: ['Bảo mật', 'Điều khoản', 'Cookie'] },
              { title: 'Hỗ trợ', links: ['Trung tâm trợ giúp', 'Liên hệ', 'FAQ'] }
            ].map((group) => (
              <div key={group.title}>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 mb-8">{group.title}</h4>
                <ul className="space-y-4">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-zinc-500 hover:text-zinc-950 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="divider mb-12" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            © 2024 FitHire. Built for the next generation of talent.
          </p>
          <div className="flex gap-8">
            {['LinkedIn', 'Facebook', 'Instagram'].map((social) => (
              <a key={social} href="#" className="text-[10px] font-bold uppercase tracking-widest text-zinc-950 hover:text-zinc-400 transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
