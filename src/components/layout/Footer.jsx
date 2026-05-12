import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Công ty',
      links: [
        { name: 'Về chúng tôi', path: '/about' },
        { name: 'Nghề nghiệp', path: '/careers' },
        { name: 'Blog', path: '/blog' },
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
      title: 'Pháp lý',
      links: [
        { name: 'Bảo mật', path: '/privacy' },
        { name: 'Điều khoản', path: '/terms' },
        { name: 'Cookie', path: '/cookie' },
      ],
    },
    {
      title: 'Hỗ trợ',
      links: [
        { name: 'Trung tâm trợ giúp', path: '/support' },
        { name: 'Liên hệ', path: '/contact' },
        { name: 'FAQ', path: '/faq' },
      ],
    },
  ];

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

          {/* Links Grid - Fixed Overflow */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-950 mb-6">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-zinc-500 hover:text-primary text-sm transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
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
            {['Linkedin', 'Facebook', 'Instagram'].map((social) => (
              <a
                key={social}
                href={`#${social.toLowerCase()}`}
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors"
              >
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
