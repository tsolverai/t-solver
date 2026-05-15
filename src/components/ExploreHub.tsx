import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  FileText, 
  Video, 
  MessageSquare, 
  BarChart3, 
  Camera, 
  Gamepad2, 
  Languages, 
  BookOpen, 
  Rocket, 
  ArrowRight,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { SmartNotes } from './SmartNotes';
import { OCREngine } from './OCREngine';
import { AITeacher } from './AITeacher';
import { LanguageLearning } from './LanguageLearning';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { AssignmentSector } from './AssignmentSector';
import { PracticeEngine } from './PracticeEngine';
import { MathGame } from './MathGame';

export const ExploreHub: React.FC<{ user: any }> = ({ user }) => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const MODULES = [
    { id: 'ai-teacher', icon: MessageSquare, title: 'AI Neural Teacher', desc: 'Step-by-step tutoring engine', color: 'from-[#00f2ff] to-[#0060ff]' },
    { id: 'notes', icon: FileText, title: 'Smart Archive', desc: 'AI-Enhanced local note system', color: 'from-[#ff0080] to-[#7928ca]' },
    { id: 'ocr', icon: Camera, title: 'Neural Scan', desc: 'OCR script & diagram recognition', color: 'from-[#00ff88] to-[#0088ff]' },
    { id: 'languages', icon: Languages, title: 'Lingo Core', desc: 'Duolingo-style language evolution', color: 'from-[#ffd600] to-[#ff6b00]' },
    { id: 'practice', icon: Rocket, title: 'Rapid Practice', desc: 'Adaptive problem set generator', color: 'from-[#4ade80] to-[#3b82f6]' },
    { id: 'games', icon: Gamepad2, title: 'Logic Playground', desc: '50+ Colorful educational experiences', color: 'from-[#f472b6] to-[#8b5cf6]' },
    { id: 'analytics', icon: BarChart3, title: 'Telemetry Hub', desc: 'Deep performance analytics', color: 'from-[#94a3b8] to-[#1e293b]' },
    { id: 'assignments', icon: BookOpen, title: 'Task Sector', desc: 'Assignment solver & manager', color: 'from-[#fb7185] to-[#e11d48]' },
  ];

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-64 px-8 overflow-y-auto">
      <AnimatePresence mode="wait">
        {!activeModule ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="max-w-7xl mx-auto space-y-16"
          >
            <div className="space-y-6 text-center">
               <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full"
               >
                  <Sparkles size={14} className="text-[#00f2ff]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Ecosystem Central Hub</p>
               </motion.div>
               <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none">Explore The<br/>Neural Web</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {MODULES.map((module, i) => (
                  <motion.button 
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setActiveModule(module.id)}
                    className="cyber-panel p-10 group text-left space-y-8 relative overflow-hidden transition-all hover:border-white/40 active:scale-95"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
                    <div className="h-16 w-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-white transition-all shadow-glow">
                      <module.icon className="h-8 w-8 text-white/60 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tight">{module.title}</h3>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{module.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 text-white/0 group-hover:text-white/40 transition-all text-[8px] font-black uppercase tracking-widest translate-x-[-10px] group-hover:translate-x-0">
                      Access Local Node <ArrowRight size={12} />
                    </div>
                  </motion.button>
               ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="module"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-7xl mx-auto"
          >
            <button 
              onClick={() => setActiveModule(null)}
              className="mb-12 flex items-center gap-4 text-white/40 hover:text-white transition-all group"
            >
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110">
                <ChevronLeft size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Neural Web</span>
            </button>

            {activeModule === 'notes' && <SmartNotes userId={user.id} />}
            {activeModule === 'ocr' && <OCREngine />}
            {activeModule === 'ai-teacher' && <AITeacher subject="General Systems" user={user} />}
            {activeModule === 'languages' && <LanguageLearning />}
            {activeModule === 'practice' && <PracticeEngine subject="all" mode="rapid" />}
            {activeModule === 'analytics' && <AnalyticsDashboard subject="all" />}
            {activeModule === 'games' && <MathGame subject="T-Solver Global" />}
            {activeModule === 'assignments' && <AssignmentSector />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
