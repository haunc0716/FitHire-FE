import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const SupportContact = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-white">
       {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] -mr-64 -mt-64" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="glass-emerald p-12 md:p-24 rounded-[40px] border border-emerald-100/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary block mb-8">Get in touch</span>
              <h2 className="text-h2 mb-12">LIÊN HỆ <br /><span className="text-primary italic font-normal">CHÚNG TÔI.</span></h2>
              
              <div className="space-y-12">
                <motion.div whileHover={{ x: 10 }} className="flex items-start gap-8">
                  <div className="w-12 h-12 border border-emerald-200 flex items-center justify-center text-primary rounded-xl bg-white shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">Email</p>
                    <p className="text-2xl font-bold text-zinc-900">support@fithire.edu</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ x: 10 }} className="flex items-start gap-8">
                  <div className="w-12 h-12 border border-emerald-200 flex items-center justify-center text-primary rounded-xl bg-white shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">Điện thoại</p>
                    <p className="text-2xl font-bold text-zinc-900">+84 123 456 789</p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="aspect-square bg-emerald-50 rounded-3xl border border-emerald-100 p-3 overflow-hidden shadow-2xl relative group">
              <img
                alt="Support Team"
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-all duration-1000"
                src="/images/team-collab.png"
              />
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportContact;
