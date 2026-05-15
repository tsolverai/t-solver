import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Loader2, 
  Search,
  Camera,
  Cpu,
  Mic,
  Image as ImageIcon,
  SendHorizontal,
  ChevronDown,
  Brain,
  BarChart,
  Bell,
  FileText,
  Lightbulb,
  Gamepad2,
  Trophy
} from 'lucide-react';
import { localAI } from '@/lib/localAI';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { UserProfile } from '../lib/storage';
import { QuizSystem } from './QuizSystem';
import { QuizAnalytics } from './QuizAnalytics';
import { ReminderSystem } from './ReminderSystem';
import { SmartNotes } from './SmartNotes';
import { AssignmentRecommender } from './AssignmentRecommender';
import { GamificationSystem } from './GamificationSystem';

const SUBJECTS = [
  "বীজগণিত", 
  "পাটিগণিত", 
  "জ্যামিতি", 
  "ত্রিকোণমিতি", 
  "শতকরা (%)", 
  "পরিসংখ্যান", 
  "বাংলা", 
  "English", 
  "Science"
];

export const SmartEducation: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'study' | 'quiz' | 'analytics' | 'reminders' | 'notes' | 'recommend' | 'gamify'>('study');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [useThinking, setUseThinking] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSolve = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const prompt = `Topic: ${subject}. Problem: ${input}. Provide a step-by-step solution in Bengali.`;
      const res = await localAI.process(prompt, 'general', useThinking);
      setResult(res);
    } catch (err) {
      setResult("Failed to solve. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 pb-20">
      {/* Sub Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-b border-white/5">
        <SubNavItem active={activeTab === 'study'} onClick={() => setActiveTab('study')} icon={<Brain size={14}/>} label="Study Help" />
        <SubNavItem active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} icon={<Gamepad2 size={14}/>} label="Quiz" />
        <SubNavItem active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart size={14}/>} label="Analytics" />
        <SubNavItem active={activeTab === 'reminders'} onClick={() => setActiveTab('reminders')} icon={<Bell size={14}/>} label="Reminders" />
        <SubNavItem active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} icon={<FileText size={14}/>} label="Smart Notes" />
        <SubNavItem active={activeTab === 'recommend'} onClick={() => setActiveTab('recommend')} icon={<Lightbulb size={14}/>} label="Suggest" />
        <SubNavItem active={activeTab === 'gamify'} onClick={() => setActiveTab('gamify')} icon={<Trophy size={14}/>} label="Journey" />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'study' && (
          <motion.div 
            key="study"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="cyber-panel p-8 space-y-10 relative overflow-visible">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="space-y-4">
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                    Student Mode <br/>
                    <span className="text-white/40 text-2xl font-bold">(সব subject solve)</span>
                  </h2>
                  <p className="text-white/40 text-xs font-bold leading-relaxed px-1">
                    আপনার প্রশ্ন লিখুন বা ছবি <br/> আপলোড করুন।
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button className="h-12 px-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all shadow-glow">
                    <Camera className="h-4 w-4 text-white/60" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Scan</span>
                  </button>
                  <div className="flex items-center gap-4 px-6 h-12 rounded-2xl bg-white/5 border border-white/10">
                     <Cpu className={`h-4 w-4 ${useThinking ? 'text-white animate-pulse' : 'text-white/20'}`} />
                     <Label htmlFor="think-student" className="text-[9px] font-black uppercase tracking-[0.2em] cursor-pointer">Thinking</Label>
                     <Switch id="think-student" checked={useThinking} onCheckedChange={setUseThinking} className="scale-75" />
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="space-y-8">
                <div className="space-y-4 relative">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-white/30 px-1">বিষয় নির্বাচন করুন</Label>
                  <div className="relative">
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full sm:w-64 h-14 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center justify-between hover:bg-white/10 transition-all text-sm font-bold"
                    >
                      {subject} <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-16 left-0 w-64 bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden z-50 shadow-2xl p-2"
                        >
                          {SUBJECTS.map((s) => (
                            <button
                              key={s}
                              onClick={() => { setSubject(s); setIsDropdownOpen(false); }}
                              className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${subject === s ? 'bg-white text-black' : 'text-white/60 hover:bg-white/5'}`}
                            >
                              {s}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="relative group">
                      <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="আপনার প্রশ্নটি এখানে লিখুন অথবা ছবি ড্র্যাগ করে আনুন..."
                        className="w-full min-h-[220px] bg-white/5 border border-white/10 rounded-[32px] p-8 text-lg font-bold placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all resize-none no-scrollbar"
                      />
                      
                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                            <Mic size={18} />
                          </button>
                          <button className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                            <ImageIcon size={18} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={handleSolve}
                          disabled={loading || !input.trim()}
                          className="h-14 px-12 bg-[#8a8a8a]/20 border border-white/10 text-white rounded-2xl flex items-center gap-4 font-black uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-black transition-all disabled:opacity-30"
                        >
                          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><SendHorizontal size={18} /> Solve</>}
                        </button>
                      </div>
                   </div>
                </div>
              </div>

              {/* Result Area */}
              <AnimatePresence>
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-8 border-t border-white/5 space-y-6"
                  >
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-glow">
                         <Sparkles className="h-4 w-4 text-black" />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">AI Logic Solution</span>
                    </div>
                    <ScrollArea className="h-fit max-h-[500px] w-full bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                      <div className="markdown-body">
                        <ReactMarkdown>{result}</ReactMarkdown>
                      </div>
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {activeTab === 'quiz' && <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><QuizSystem user={user} /></motion.div>}
        {activeTab === 'analytics' && <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><QuizAnalytics user={user} /></motion.div>}
        {activeTab === 'reminders' && <motion.div key="reminders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><ReminderSystem user={user} /></motion.div>}
        {activeTab === 'notes' && <motion.div key="notes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><SmartNotes userId={user.id} /></motion.div>}
        {activeTab === 'recommend' && <motion.div key="recommend" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><AssignmentRecommender user={user} /></motion.div>}
        {activeTab === 'gamify' && <motion.div key="gamify" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><GamificationSystem user={user} /></motion.div>}
      </AnimatePresence>
    </div>
  );
};

function SubNavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all whitespace-nowrap text-[10px] font-black uppercase tracking-widest ${active ? 'bg-white text-black shadow-glow' : 'text-white/20 hover:text-white/40'}`}
    >
      {icon}
      {label}
    </button>
  );
}
