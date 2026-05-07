import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  CreditCard, 
  LogOut,
  Camera,
  Save,
  Check
} from 'lucide-react';

export default function UserSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'account', name: 'Account & Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'billing', name: 'Billing History', icon: CreditCard },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 mt-1">Manage your personal information, security preferences, and subscription.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm min-h-[500px]">
          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
               {/* Avatar Upload */}
               <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                     <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl font-black border-4 border-white shadow-md overflow-hidden">
                        A
                     </div>
                     <button className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                        <Camera className="w-6 h-6" />
                     </button>
                  </div>
                  <div className="text-center sm:text-left">
                     <h3 className="font-bold text-gray-900 text-lg">Your Photo</h3>
                     <p className="text-xs text-gray-500 mt-1">This will be displayed on your profile and reports.</p>
                     <div className="flex gap-3 mt-4">
                        <button className="text-xs font-bold text-emerald-600 hover:underline">Change</button>
                        <button className="text-xs font-bold text-red-500 hover:underline">Remove</button>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                     <div className="relative">
                        <User className="w-4 h-4 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input type="text" defaultValue="Alex Nguyen" className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl outline-none text-sm transition-all border" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                     <div className="relative">
                        <Mail className="w-4 h-4 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input type="email" defaultValue="alex@example.com" disabled className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border-transparent text-gray-400 rounded-xl outline-none text-sm cursor-not-allowed border" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                     <input type="text" placeholder="e.g. Frontend Developer" className="w-full px-4 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl outline-none text-sm transition-all border" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Language</label>
                     <select className="w-full px-4 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl outline-none text-sm transition-all border">
                        <option>English (US)</option>
                        <option>Tiếng Việt</option>
                     </select>
                  </div>
               </div>

               <div className="space-y-2 pt-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Professional Bio</label>
                  <textarea rows={4} className="w-full p-4 bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl outline-none text-sm transition-all border resize-none" placeholder="Write a short summary about yourself..." defaultValue="Passionate Frontend Developer with a focus on React and modern UI/UX design. Always eager to learn and grow." />
               </div>

               <div className="flex justify-end pt-6">
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                  >
                     {isSaved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                     {isSaved ? 'Saved Changes' : 'Save Changes'}
                  </button>
               </div>
            </motion.div>
          )}

          {activeTab !== 'profile' && (
             <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mb-4 italic font-bold">
                   {activeTab.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{tabs.find(t => t.id === activeTab)?.name}</h3>
                <p className="text-sm text-gray-400 max-w-xs">This section is currently under development and will be available soon.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
