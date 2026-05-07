import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  FileText, 
  Video, 
  BrainCircuit, 
  Download, 
  ExternalLink,
  MoreVertical,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ChevronRight
} from 'lucide-react';

const historyItems = [
  { 
    id: 1, 
    type: 'cv', 
    title: 'Senior Frontend Developer CV', 
    subtitle: 'Matched with Shopee JD', 
    date: 'Oct 24, 2023', 
    score: '85%', 
    status: 'Optimized' 
  },
  { 
    id: 2, 
    type: 'interview', 
    title: 'ReactJS Technical Interview', 
    subtitle: 'Vercel Simulation', 
    date: 'Oct 22, 2023', 
    score: '8.2/10', 
    status: 'Completed' 
  },
  { 
    id: 3, 
    type: 'fit', 
    title: 'Cultural Fit Assessment', 
    subtitle: 'General Work Style', 
    date: 'Oct 20, 2023', 
    score: 'Innovator', 
    status: 'Verified' 
  },
  { 
    id: 4, 
    type: 'cv', 
    title: 'Backend Engineer Resume', 
    subtitle: 'Google JD Match', 
    date: 'Oct 15, 2023', 
    score: '62%', 
    status: 'Needs Work' 
  },
  { 
    id: 5, 
    type: 'interview', 
    title: 'Soft Skills Practice', 
    subtitle: 'Leadership Focused', 
    date: 'Oct 10, 2023', 
    score: '7.5/10', 
    status: 'Completed' 
  },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState('all');

  const filteredItems = filter === 'all' 
    ? historyItems 
    : historyItems.filter(item => item.type === filter);

  const getIcon = (type) => {
    switch(type) {
      case 'cv': return <FileText className="w-5 h-5 text-emerald-600" />;
      case 'interview': return <Video className="w-5 h-5 text-blue-600" />;
      case 'fit': return <BrainCircuit className="w-5 h-5 text-amber-600" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getBg = (type) => {
    switch(type) {
      case 'cv': return 'bg-emerald-50';
      case 'interview': return 'bg-blue-50';
      case 'fit': return 'bg-amber-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">History & Reports</h1>
          <p className="text-gray-500 mt-1 italic">Track your progress and access past AI analysis reports.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
              <Download className="w-4 h-4" /> Export All
           </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
         <div className="flex p-1 bg-gray-100 rounded-xl w-full sm:w-auto">
            {['all', 'cv', 'interview', 'fit'].map((f) => (
               <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
               >
                  {f === 'fit' ? 'Culture' : f}
               </button>
            ))}
         </div>
         <div className="relative w-full sm:w-64 group">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 focus:border-emerald-500 outline-none rounded-xl text-sm transition-all shadow-sm"
            />
         </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-gray-50">
                     <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Activity</th>
                     <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                     <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Performance</th>
                     <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                     <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {filteredItems.map((item, i) => (
                     <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group hover:bg-gray-50/50 transition-colors"
                     >
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl ${getBg(item.type)} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                 {getIcon(item.type)}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{item.title}</p>
                                 <p className="text-xs text-gray-500">{item.subtitle}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {item.date}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <span className={`text-sm font-black ${item.type === 'cv' && parseInt(item.score) < 70 ? 'text-amber-600' : 'text-gray-900'}`}>{item.score}</span>
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                              item.status === 'Optimized' || item.status === 'Verified' || item.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : 'bg-amber-50 text-amber-600 border-amber-100'
                           }`}>
                              {item.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                                 <ExternalLink className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                                 <MoreVertical className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                     </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-center gap-2 pb-10">
         <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all">1</button>
         <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all bg-gray-50">2</button>
         <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all italic">...</button>
      </div>
    </div>
  );
}
