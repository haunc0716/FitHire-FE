import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  MessageSquare,
  Play,
  RotateCcw,
  Trophy,
  Target,
  Clock
} from 'lucide-react';

export default function MockInterviewPage() {
  const [sessionState, setSessionState] = useState('setup'); // setup, live, feedback
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    "Could you introduce yourself and tell us about your background in Frontend Development?",
    "What was the most challenging technical project you've worked on, and how did you overcome the obstacles?",
    "How do you handle conflict within a development team?",
    "Where do you see yourself in the next 5 years in terms of technical growth?"
  ];

  const handleStart = () => setSessionState('live');
  const handleFinish = () => setSessionState('feedback');

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-160px)] min-h-[600px]">
      <AnimatePresence mode="wait">
        {sessionState === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="h-full flex items-center justify-center"
          >
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-12 shadow-xl max-w-2xl w-full text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Video className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Mock Interview</h1>
              <p className="text-gray-500 mb-10">Practice your interview skills with our AI recruiter. Receive real-time feedback on your answers, tone, and confidence.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Target Role</label>
                  <p className="font-semibold text-gray-900">Senior Frontend Developer</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Duration</label>
                  <p className="font-semibold text-gray-900">~ 15 Minutes</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleStart}
                  className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:-translate-y-1"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start Interview Now
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
                <Mic className="w-3 h-3" /> Camera and Microphone access will be requested
              </p>
            </div>
          </motion.div>
        )}

        {sessionState === 'live' && (
          <motion.div
            key="live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col gap-6"
          >
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Stage: AI Interviewer */}
              <div className="lg:col-span-2 bg-gray-900 rounded-[2.5rem] overflow-hidden relative flex items-center justify-center group shadow-2xl">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                 
                 {/* AI Avatar Placeholder */}
                 <div className="flex flex-col items-center gap-6 relative z-10">
                    <div className="w-48 h-48 rounded-full border-4 border-blue-500/30 p-2 relative">
                       <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                       <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-600 overflow-hidden">
                          <img 
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Recruiter" 
                            alt="AI Recruiter" 
                            className="w-full h-full object-cover scale-110"
                          />
                       </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-center max-w-md">
                       <p className="text-white font-medium text-lg leading-relaxed">"{questions[currentQuestion]}"</p>
                    </div>
                 </div>

                 {/* Top Controls */}
                 <div className="absolute top-8 left-8 right-8 z-20 flex justify-between items-center">
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                       <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                       <span className="text-white text-xs font-bold uppercase tracking-widest">Live Interview</span>
                    </div>
                    <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                       <span className="text-white text-xs font-bold">Question {currentQuestion + 1} of {questions.length}</span>
                    </div>
                 </div>
              </div>

              {/* Side: User Camera */}
              <div className="flex flex-col gap-6">
                <div className="flex-1 bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden relative shadow-sm">
                   {isVideoOn ? (
                      <div className="h-full bg-emerald-50 flex items-center justify-center">
                         <img 
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
                            alt="User" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[10px] font-bold border border-white/10">
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                             ALEX NGUYEN
                          </div>
                      </div>
                   ) : (
                      <div className="h-full bg-gray-50 flex items-center justify-center text-gray-300">
                         <VideoOff className="w-16 h-16" />
                      </div>
                   )}
                   
                   {/* Overlay Controls */}
                   <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-3 rounded-xl backdrop-blur-md border border-white/10 transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                      >
                         {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={() => setIsVideoOn(!isVideoOn)}
                        className={`p-3 rounded-xl backdrop-blur-md border border-white/10 transition-all ${!isVideoOn ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                      >
                         {!isVideoOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                      </button>
                   </div>
                </div>

                {/* Subtitle/Transcript */}
                <div className="h-40 bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm overflow-y-auto">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Live Transcript</p>
                   <p className="text-sm text-gray-600 leading-relaxed italic">
                      "I have been working as a Senior Frontend Developer for over 5 years. My expertise lies in building scalable web applications using React and Tailwind CSS..."
                   </p>
                </div>
              </div>
            </div>

            {/* Bottom: Action Bar */}
            <div className="bg-white border border-gray-100 p-4 rounded-[2rem] shadow-sm flex items-center justify-between">
               <button 
                 onClick={() => setSessionState('setup')}
                 className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
               >
                  Cancel Interview
               </button>
               
               <div className="flex gap-4">
                  <button 
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(prev => prev - 1)}
                    className="p-3 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all"
                  >
                     <RotateCcw className="w-5 h-5" />
                  </button>
                  {currentQuestion < questions.length - 1 ? (
                    <button 
                      onClick={() => setCurrentQuestion(prev => prev + 1)}
                      className="flex items-center gap-3 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all"
                    >
                      Next Question
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button 
                      onClick={handleFinish}
                      className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                    >
                      Finish Interview
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
               </div>
            </div>
          </motion.div>
        )}

        {sessionState === 'feedback' && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Feedback Score Header */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
               <div className="absolute right-0 top-0 w-80 h-80 bg-blue-50 rounded-full -mr-20 -mt-20 opacity-50 -z-10" />
               <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="w-32 h-32 bg-blue-600 text-white rounded-[2.5rem] flex flex-col items-center justify-center shrink-0 shadow-xl shadow-blue-200">
                     <span className="text-4xl font-black">8.5</span>
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Final Score</span>
                  </div>
                  <div>
                     <h2 className="text-3xl font-bold text-gray-900 mb-2">Great Job, Alex!</h2>
                     <p className="text-gray-500 max-w-xl">You displayed strong technical knowledge and clear communication. Your confidence was high, although your answers could be more structured using the STAR method.</p>
                  </div>
                  <div className="flex-1 flex justify-end gap-3">
                     <button onClick={() => setSessionState('setup')} className="p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all">
                        <RotateCcw className="w-5 h-5 text-gray-400" />
                     </button>
                     <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-black transition-all">
                        <Download className="w-5 h-5" /> Download Report
                     </button>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Trophy className="w-5 h-5" /></div>
                     <h3 className="font-bold text-gray-900">Strengths</h3>
                  </div>
                  <ul className="space-y-4">
                     <li className="flex gap-3 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        Excellent technical vocabulary.
                     </li>
                     <li className="flex gap-3 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        Good pace and eye contact.
                     </li>
                  </ul>
               </div>

               <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-amber-900">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Target className="w-5 h-5" /></div>
                     <h3 className="font-bold text-gray-900">To Improve</h3>
                  </div>
                  <ul className="space-y-4">
                     <li className="flex gap-3 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        Include more measurable results.
                     </li>
                     <li className="flex gap-3 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        Avoid using filler words (um, like).
                     </li>
                  </ul>
               </div>

               <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Clock className="w-5 h-5" /></div>
                     <h3 className="font-bold text-gray-900">Stats</h3>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Avg. Answer Time</span>
                        <span className="font-bold text-gray-900">1m 45s</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Clarity Score</span>
                        <span className="font-bold text-gray-900">92%</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Keywords Used</span>
                        <span className="font-bold text-gray-900">14/20</span>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
