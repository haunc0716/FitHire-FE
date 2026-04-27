import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto px-8 py-16">
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="FitHire Logo" className="h-8 w-auto object-contain mix-blend-multiply" />
          </Link>
          <p className="font-['Plus_Jakarta_Sans'] text-sm leading-relaxed text-slate-500">
            Tiên phong trong công nghệ tuyển dụng AI, giúp thế hệ chuyên gia tiếp theo vươn tầm thế giới.
          </p>
          <div className="flex gap-4 mt-2">
            <a className="text-slate-500 hover:text-violet-500 transition-all opacity-100 hover:opacity-80" href="#">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
              </svg>
            </a>
            <a className="text-slate-500 hover:text-violet-500 transition-all opacity-100 hover:opacity-80" href="#">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-bold text-sm uppercase tracking-wider text-slate-900">Công ty</span>
          <Link className="font-['Plus_Jakarta_Sans'] text-sm text-slate-500 hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all opacity-100 hover:opacity-80" to="/">Về chúng tôi</Link>
          <a className="font-['Plus_Jakarta_Sans'] text-sm text-slate-500 hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all opacity-100 hover:opacity-80" href="#">Nghề nghiệp</a>
          <a className="font-['Plus_Jakarta_Sans'] text-sm text-slate-500 hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all opacity-100 hover:opacity-80" href="#">Blog</a>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-bold text-sm uppercase tracking-wider text-slate-900">Pháp lý</span>
          <a className="font-['Plus_Jakarta_Sans'] text-sm text-slate-500 hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all opacity-100 hover:opacity-80" href="#">Chính sách bảo mật</a>
          <a className="font-['Plus_Jakarta_Sans'] text-sm text-slate-500 hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all opacity-100 hover:opacity-80" href="#">Điều khoản dịch vụ</a>
          <a className="font-['Plus_Jakarta_Sans'] text-sm text-slate-500 hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all opacity-100 hover:opacity-80" href="#">Cookie</a>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-bold text-sm uppercase tracking-wider text-slate-900">Liên hệ</span>
          <a className="font-['Plus_Jakarta_Sans'] text-sm text-slate-500 hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all opacity-100 hover:opacity-80" href="#">Trung tâm hỗ trợ</a>
          <a className="font-['Plus_Jakarta_Sans'] text-sm text-slate-500 hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all opacity-100 hover:opacity-80" href="#">Đối tác</a>
          <a className="font-['Plus_Jakarta_Sans'] text-sm text-slate-500 hover:text-violet-500 underline decoration-2 underline-offset-4 transition-all opacity-100 hover:opacity-80" href="#">Báo chí</a>
        </div>
      </div>
      <div className="pt-8 pb-12 border-t border-slate-200 text-center">
        <p className="font-['Plus_Jakarta_Sans'] text-xs text-slate-400">
          © 2024 FitHire. All rights reserved. Built for the next generation of talent.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
