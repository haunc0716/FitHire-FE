import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UploadCloud, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  Plus,
  MoreVertical,
  Check,
  Sparkles
} from 'lucide-react';

export default function MyCvPage() {
  const [resumes, setResumes] = useState([
    { id: 1, name: 'Alex_Nguyen_CV_Frontend.pdf', date: 'Oct 24, 2023', size: '1.2 MB', isDefault: true },
    { id: 2, name: 'Alex_Resume_Fullstack.pdf', date: 'Sep 12, 2023', size: '2.4 MB', isDefault: false },
  ]);

  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      // Logic to add new resume would go here
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Resumes</h1>
          <p className="text-gray-500 mt-1">Manage your master CVs and cover letters for quick applications.</p>
        </div>
        <button 
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          onClick={() => document.getElementById('cv-upload').click()}
        >
          <Plus className="w-5 h-5" /> Upload New CV
          <input type="file" id="cv-upload" className="hidden" onChange={handleUpload} />
        </button>
      </div>

      {/* Upload Zone (if empty or active) */}
      <AnimatePresence>
        {isUploading && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center overflow-hidden"
          >
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
             </div>
             <p className="text-emerald-700 font-bold">Uploading and analyzing your CV...</p>
             <p className="text-emerald-600/60 text-xs mt-1 italic">Almost there, extracting skills and experience.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resumes.map((resume) => (
          <motion.div 
            key={resume.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-3xl border p-6 shadow-sm group hover:shadow-md transition-all ${resume.isDefault ? 'border-emerald-200 ring-4 ring-emerald-50' : 'border-gray-100'}`}
          >
             <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${resume.isDefault ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                   <FileText className="w-7 h-7" />
                </div>
                <div className="flex gap-1">
                   {resume.isDefault && (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-emerald-100 mr-2">
                         Primary
                      </span>
                   )}
                   <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                      <MoreVertical className="w-4 h-4" />
                   </button>
                </div>
             </div>

             <h3 className="font-bold text-gray-900 mb-1 truncate pr-4">{resume.name}</h3>
             <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {resume.date}</span>
                <span className="flex items-center gap-1.5"><Download className="w-3 h-3" /> {resume.size}</span>
             </div>

             <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all">
                   <Eye className="w-4 h-4" /> Preview
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all">
                   <Download className="w-4 h-4" /> Download
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                   <Trash2 className="w-4 h-4" />
                </button>
             </div>
          </motion.div>
        ))}

        {/* Empty Slot / Add More */}
        <button 
          className="border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-emerald-300 hover:text-emerald-500 hover:bg-emerald-50/30 transition-all"
          onClick={() => document.getElementById('cv-upload').click()}
        >
           <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center group-hover:border-emerald-300">
              <Plus className="w-6 h-6" />
           </div>
           <span className="text-sm font-bold">Add Another Resume</span>
        </button>
      </div>


    </div>
  );
}

// Add AnimatePresence import fix
import { AnimatePresence } from 'framer-motion';
