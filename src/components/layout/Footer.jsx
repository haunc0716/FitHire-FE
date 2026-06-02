import React from 'react';
import { Link } from 'react-router-dom';

const FB_URL = 'https://www.facebook.com/profile.php?id=61580699131571';
const LOGIN_PATH = '/login';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Công ty',
      external: true,
      href: FB_URL,
      links: [
        { name: 'Về chúng tôi', href: FB_URL },
        { name: 'Nghề nghiệp', href: FB_URL },
        { name: 'Blog', href: FB_URL },
      ],
    },
    {
      title: 'Sản phẩm',
      links: [
        { name: 'Tính năng', path: '/features' },
        { name: 'Bảng giá', path: '/pricing' },
        { name: 'Quy trình', path: '/process' },
      ],
    },
    {
      title: 'Hỗ trợ',
      links: [
        { name: 'Trung tâm trợ giúp', path: LOGIN_PATH },
        { name: 'Liên hệ', path: LOGIN_PATH },
        { name: 'FAQ', path: LOGIN_PATH },
      ],
    },
  ];

  const renderLink = (link) => {
    if (link.href) {
      return (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-primary text-sm transition-colors"
        >
          {link.name}
        </a>
      );
    }
    return (
      <Link
        to={link.path}
        className="text-zinc-500 hover:text-primary text-sm transition-colors"
      >
        {link.name}
      </Link>
    );
  };

  return (
    <footer className="bg-white border-t border-zinc-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          {/* Logo & Info */}
          <div className="md:col-span-4">
            <Link to="/" className="font-display text-2xl font-bold tracking-tighter mb-8 block text-primary">
              FITHIRE
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Nền tảng ứng dụng AI hàng đầu giúp kết nối nhân tài Gen-Z với các doanh nghiệp tiên phong.
            </p>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-950 mb-6">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>{renderLink(link)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            © {currentYear} FITHIRE. BUILT FOR THE NEXT GENERATION OF TALENT.
          </p>
          <div className="flex gap-8">
            <a
              href={FB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
