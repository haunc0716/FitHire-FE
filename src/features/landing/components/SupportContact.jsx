import React from 'react';
import { Mail, Phone } from 'lucide-react';

const SupportContact = () => {
  return (
    <section className="mt-24 grid md:grid-cols-2 gap-12 items-center bg-primary/[0.03] p-8 md:p-16 rounded-[2rem] border border-primary/5">
      <div>
        <h2 className="font-h2 text-h2 mb-6">Vẫn cần trợ giúp?</h2>
        <p className="text-body-lg text-on-surface-variant mb-10 leading-relaxed">Đội ngũ cố vấn nghề nghiệp của chúng tôi luôn sẵn sàng hỗ trợ bạn từ Thứ Hai đến Thứ Sáu để điều hướng hành trình chuyên nghiệp của bạn.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Email cho chúng tôi</p>
              <p className="font-semibold text-sm">support@fithire.edu</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Gọi cho chúng tôi</p>
              <p className="font-semibold text-sm">+1 (555) 012-3456</p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative group">
        <div className="absolute -inset-4 bg-primary/10 rounded-[2.5rem] blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
          <img alt="Modern bright coworking space" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4scvtksR-dTHm5LGE6UdqxcDr_orCSGvu_i_KI9SwlvThn0fqKGVMWTdigwMIcL_LZVsfDZibdM64So6Mb9Epb5Qp6nTyAF6GTcgQ77X8IqefLlHM6Vak33XQYmj19FFe77iXiHak1Ej5nlUZRNhxsZqen8BRUTSWzL1ewV8oW91c4Z3ZARLDL3p16wKu65TOFGq8aYsSli_mdmNkOwisWhEf8HB4hFBzSUT5o5Y4IjxFt_cYAqfXB3T02C8gDxtSjFS_NF0kh8w" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default SupportContact;
