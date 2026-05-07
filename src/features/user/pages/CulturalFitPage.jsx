import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  Info,
  Sparkles,
  Target,
  Users,
  Zap,
  Coffee,
  Rocket
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { subject: 'Adaptability', A: 120, fullMark: 150 },
  { subject: 'Collaboration', A: 98, fullMark: 150 },
  { subject: 'Innovation', A: 86, fullMark: 150 },
  { subject: 'Leadership', A: 99, fullMark: 150 },
  { subject: 'Communication', A: 85, fullMark: 150 },
  { subject: 'Empathy', A: 65, fullMark: 150 },
];

export default function CulturalFitPage() {
  const [step, setStep] = useState('intro'); // intro, test, results

  const handleStart = () => setStep('test');
  const handleFinish = () => setStep('results');

  return (
    <div className="max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 p-12 shadow-sm text-center overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full -mr-20 -mt-20 opacity-50 -z-10" />
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <BrainCircuit className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Cultural Fit Assessment</h1>
            <p className="text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">Discover your work personality and see how well you align with different company cultures (Startup vs. Corporate vs. Agile).</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-left">
               <div className="space-y-2">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                     <Target className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 tracking-tight">Accurate Profiling</h4>
                  <p className="text-xs text-gray-500">Based on proven psychometric models.</p>
               </div>
               <div className="space-y-2">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                     <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 tracking-tight">Company Matching</h4>
                  <p className="text-xs text-gray-500">Compare your traits with top tech firms.</p>
               </div>
               <div className="space-y-2">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                     <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 tracking-tight">Instant Feedback</h4>
                  <p className="text-xs text-gray-500">Get your radar chart immediately.</p>
               </div>
            </div>

            <button 
              onClick={handleStart}
              className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 hover:-translate-y-1"
            >
              Start Assessment (5 min)
            </button>
          </motion.div>
        )}

        {step === 'test' && (
          <motion.div
            key="test"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
             <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                   <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">Question 1 of 12</span>
                   <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="w-1/12 h-full bg-amber-500 rounded-full" />
                   </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">"I prefer working in environment where rules are clearly defined over flexible ones."</h2>
                
                <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto">
                   {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((option, i) => (
                      <button 
                        key={i}
                        className="w-full text-left p-5 rounded-2xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all font-medium text-gray-700 flex items-center justify-between group"
                      >
                         {option}
                         <div className="w-6 h-6 rounded-full border-2 border-gray-100 group-hover:border-amber-400 group-hover:bg-amber-100 transition-colors" />
                      </button>
                   ))}
                </div>

                <div className="flex justify-between mt-12 pt-8 border-t border-gray-50">
                   <button onClick={() => setStep('intro')} className="text-gray-400 font-semibold hover:text-gray-600">Cancel</button>
                   <button onClick={handleFinish} className="bg-amber-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-100">Next Question</button>
                </div>
             </div>
          </motion.div>
        )}

        {step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
             <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                   <div className="w-full lg:w-1/2 h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockChartData}>
                            <PolarGrid stroke="#f3f4f6" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <Radar
                               name="Alex"
                               dataKey="A"
                               stroke="#f59e0b"
                               fill="#f59e0b"
                               fillOpacity={0.4}
                            />
                         </RadarChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="w-full lg:w-1/2 space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-100">
                         <Sparkles className="w-3 h-3" /> Result: The Innovator
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">Highly Adaptable & Collaborative</h2>
                      <p className="text-gray-500 leading-relaxed italic">"You thrive in fast-paced environments where teamwork and creativity are prioritized over strict hierarchy. You are a natural problem solver who enjoys exploring new technologies."</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Top Match</span>
                            <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                               <Rocket className="w-4 h-4 text-purple-500" /> Early Stage Startup
                            </span>
                         </div>
                         <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Culture Type</span>
                            <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                               <Coffee className="w-4 h-4 text-amber-600" /> Agile & Flat
                            </span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                   <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-500" /> Career Alignment
                   </h3>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Startup Compatibility</span>
                            <span className="font-bold text-emerald-600">95%</span>
                         </div>
                         <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                            <div className="w-[95%] h-full bg-emerald-500" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Big Corp Compatibility</span>
                            <span className="font-bold text-amber-600">45%</span>
                         </div>
                         <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                            <div className="w-[45%] h-full bg-amber-500" />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col items-center justify-center text-center">
                   <h3 className="font-bold text-gray-900 mb-4 italic">Next Step?</h3>
                   <p className="text-sm text-gray-500 mb-8">Ready to see how your personality fits with Shopee, Vercel, or Google?</p>
                   <button className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-50">
                      Unlock Company Comparison <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
