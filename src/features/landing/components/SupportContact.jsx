import React from 'react';
import { Mail, Phone } from 'lucide-react';

const SupportContact = () => {
  return (
    <section className="bg-zinc-950 p-12 md:p-24 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 block mb-8">Get in touch</span>
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-12">LIÊN HỆ <br /><span className="text-zinc-700">CHÚNG TÔI.</span></h2>
          
          <div className="space-y-12">
            <div className="flex items-start gap-8">
              <div className="w-12 h-12 border border-zinc-800 flex items-center justify-center text-zinc-500">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Email</p>
                <p className="text-2xl font-bold">support@fithire.edu</p>
              </div>
            </div>
            <div className="flex items-start gap-8">
              <div className="w-12 h-12 border border-zinc-800 flex items-center justify-center text-zinc-500">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Điện thoại</p>
                <p className="text-2xl font-bold">+84 123 456 789</p>
              </div>
            </div>
          </div>
        </div>

        <div className="aspect-square bg-zinc-900 border border-zinc-800 p-2 overflow-hidden">
          <img
            alt="Support Team"
            className="w-full h-full object-cover grayscale opacity-50 hover:opacity-100 transition-all duration-1000"
            src="/images/team-collab.png"
          />
        </div>
      </div>
    </section>
  );
};

export default SupportContact;
