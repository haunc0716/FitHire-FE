import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Wand2, 
  Download,
  ArrowRight,
  ChevronRight,
  X,
  FileSearch,
  Check,
  Target
} from 'lucide-react';

export default function CvStudioPage() {
  const [step, setStep] = useState(1); // 1: Upload, 2: Processing, 3: Results
  const [cvFile, setCvFile] = useState(null);
  const [jdText, setJdText] = useState('');

  const handleProcess = () => {
    setStep(2);
    // Simulate AI Processing
    setTimeout(() => {
      setStep(3);
    }, 3000);
  };

  const reset = () => {
    setStep(1);
    setCvFile(null);
    setJdText('');
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          CV Studio <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs rounded-full font-semibold border border-emerald-100">AI Powered</span>
        </h1>
        <p className="text-gray-500 mt-2">Upload your CV and paste the Job Description to get a deep fit analysis and AI-driven improvements.</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* CV Upload */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                Step 1: Your CV (PDF/Docx)
              </label>
              <div className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all ${cvFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 hover:border-emerald-400 bg-white shadow-sm'}`}>
                {cvFile ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">{cvFile.name}</p>
                    <p className="text-xs text-gray-400 mb-4">Ready for analysis</p>
                    <button 
                      onClick={() => setCvFile(null)}
                      className="text-xs text-red-500 font-medium hover:underline flex items-center gap-1 mx-auto"
                    >
                      <X className="w-3 h-3" /> Change file
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Click or drag to upload</p>
                    <p className="text-xs text-gray-400">PDF, DOCX up to 10MB</p>
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setCvFile(e.target.files[0])}
                      accept=".pdf,.doc,.docx"
                    />
                  </>
                )}
              </div>
            </div>

            {/* JD Input */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" />
                Step 2: Job Description
              </label>
              <div className="relative h-full min-h-[200px]">
                <textarea 
                  className="w-full h-full min-h-[224px] p-6 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none resize-none shadow-sm text-sm placeholder:text-gray-300 transition-all"
                  placeholder="Paste the job requirements here to see how well you match..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
                {jdText.length > 0 && (
                  <button 
                    onClick={() => setJdText('')}
                    className="absolute top-4 right-4 p-1 bg-gray-100 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 flex justify-center mt-4">
              <button
                disabled={!cvFile || !jdText.trim()}
                onClick={handleProcess}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${!cvFile || !jdText.trim() ? 'bg-gray-300 cursor-not-allowed grayscale' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 hover:-translate-y-1'}`}
              >
                <Sparkles className="w-5 h-5" />
                Analyze CV with AI
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 p-16 shadow-xl flex flex-col items-center justify-center text-center"
          >
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 animate-pulse">
                <FileSearch className="w-12 h-12" />
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute -inset-4 border-2 border-dashed border-emerald-200 rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 italic">AI is scanning your profile...</h2>
            <p className="text-gray-500 max-w-sm mb-8">We're comparing your skills with the job requirements and identifying high-impact keywords.</p>
            
            <div className="w-full max-w-xs h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
                className="h-full bg-emerald-500"
              />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Score Overview */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
              <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-50 rounded-full -mr-20 -mt-20 opacity-50 -z-10" />
              
              <div className="relative shrink-0">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                  <motion.circle 
                    cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    strokeDasharray={440}
                    initial={{ strokeDashoffset: 440 }}
                    animate={{ strokeDashoffset: 440 - (440 * 85) / 100 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="text-emerald-500" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-gray-900 tracking-tighter">85%</span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Match Rate</span>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Excellent Fit! 🎉</h2>
                <p className="text-gray-500 leading-relaxed">Your profile matches 85% of the requirements for this **Senior Frontend Developer** role. You have a strong foundation in React and Tailwind, but there are a few missing technical keywords that could improve your visibility.</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                  <button className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all text-sm">
                    <Wand2 className="w-4 h-4" /> Improve CV with AI
                  </button>
                  <button onClick={reset} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm">
                    New Analysis
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Strengths */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900">Key Strengths</h3>
                </div>
                <ul className="space-y-4 text-sm text-gray-600">
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>Strong expertise in **React.js** and **Modern JavaScript (ES6+)**.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>Proven experience with **Tailwind CSS** and **Responsive Design**.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>Clear and professional "Work Experience" structure.</span>
                  </li>
                </ul>
              </div>

              {/* Gaps */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900">Skill Gaps</h3>
                </div>
                <ul className="space-y-4 text-sm text-gray-600">
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>Missing keyword: **TypeScript** (High demand in JD).</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>No mention of **Unit Testing** (Jest/Cypress).</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>Project descriptions lack **measurable metrics** (e.g., % improvement).</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Suggestions Table */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6">AI Improvement Suggestions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="pb-4 font-semibold text-xs text-gray-400 uppercase tracking-widest">Section</th>
                      <th className="pb-4 font-semibold text-xs text-gray-400 uppercase tracking-widest">Observation</th>
                      <th className="pb-4 font-semibold text-xs text-gray-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    <tr className="group">
                      <td className="py-4 font-medium text-gray-900">Technical Skills</td>
                      <td className="py-4 text-gray-500">TypeScript is mentioned 4 times in JD but not in your CV.</td>
                      <td className="py-4 text-right">
                        <button className="text-emerald-600 font-semibold hover:text-emerald-700">Add Skill</button>
                      </td>
                    </tr>
                    <tr className="group">
                      <td className="py-4 font-medium text-gray-900">Experience #1</td>
                      <td className="py-4 text-gray-500">Current descriptions are too generic. AI can rewrite for impact.</td>
                      <td className="py-4 text-right">
                        <button className="text-emerald-600 font-semibold hover:text-emerald-700">Optimize</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
