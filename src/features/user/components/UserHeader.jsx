import React from 'react';
import { Menu, Sparkles } from 'lucide-react';

export default function UserHeader({ onMenuOpen }) {
  return (
    <header className="sticky top-0 z-30 border-b border-emerald-100/70 bg-white/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="rounded-xl border border-emerald-100 bg-white p-2 text-emerald-800 lg:hidden"
            onClick={onMenuOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-emerald-950">Không gian phát triển sự nghiệp</p>
            <p className="text-xs text-emerald-700/70">Hướng dẫn thông minh, từng bước như một mentor cá nhân</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/60 px-3 py-1.5 text-xs font-semibold text-emerald-800 md:flex">
          <Sparkles className="h-3.5 w-3.5" />
          Pearl Green UI
        </div>
      </div>
    </header>
  );
}
