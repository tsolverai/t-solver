import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  ThumbsUp, 
  Share2, 
  Image as ImageIcon,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Hash
} from 'lucide-react';
import { UserProfile, storage } from '../lib/storage';
import { useTranslation } from '../lib/useTranslation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Comments } from './Comments';

interface Doubt {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  subject: string;
  chapter: string;
  content: string;
  imageUrl?: string[];
  likes: number;
  replies: number;
  status: 'pending' | 'approved' | 'resolved';
  timestamp: number;
}

export const CommunityDoubts: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { t } = useTranslation();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Form state
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);

  useEffect(() => {
    // In a real app, fetch from Supabase
    // Mocking some community doubts for now
    setDoubts([
      {
        id: '1',
        userId: 'u1',
        userName: 'Tachin Ahmed',
        subject: 'Physics',
        chapter: 'Mechanics',
        content: 'How to calculate the centrifugal force exactly in an elliptical orbit?',
        likes: 12,
        replies: 5,
        status: 'approved',
        timestamp: Date.now() - 3600000
      },
      {
        id: '2',
        userId: 'u2',
        userName: 'Pro Student',
        subject: 'Math',
        chapter: 'Calculus',
        content: 'Can anyone explain the intuitive meaning of the second derivative?',
        likes: 8,
        replies: 12,
        status: 'approved',
        timestamp: Date.now() - 86400000
      }
    ]);
  }, []);

  const handleSubmit = async () => {
    if (!subject || !content) return;
    setLoading(true);
    
    const newDoubt: Doubt = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      subject,
      chapter,
      content,
      likes: 0,
      replies: 0,
      status: 'pending',
      timestamp: Date.now()
    };

    // Simulate Supabase insert
    setTimeout(() => {
      setDoubts([newDoubt, ...doubts]);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setIsAsking(false);
        setSuccess(false);
        setSubject('');
        setChapter('');
        setContent('');
      }, 2000);
    }, 1500);
  };

  const filteredDoubts = doubts.filter(d => 
    (selectedSubject === 'All' || d.subject === selectedSubject) &&
    (d.content.toLowerCase().includes(searchQuery.toLowerCase()) || d.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4">
          <h2 className="text-5xl font-black uppercase tracking-tighter italic lg:text-7xl">{t.doubts}</h2>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
             Community Knowledge Base <span className="h-1 w-1 bg-white/20 rounded-full" /> {doubts.length} Doubts Pending Approval
          </p>
        </div>

        <button 
          onClick={() => setIsAsking(true)}
          className="h-16 px-10 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-glow flex items-center gap-3"
        >
          <Plus size={20} /> Ask Your Doubt
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/40 transition-colors" size={20} />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search community Doubts..." 
            className="h-14 pl-16 bg-white/5 border-white/10 rounded-2xl text-sm font-bold placeholder:text-white/10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          {['All', 'Physics', 'Math', 'Chemistry', 'ICT', 'Biology'].map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`h-14 px-8 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${selectedSubject === s ? 'bg-white text-black border-white shadow-glow' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredDoubts.map((doubt, idx) => (
            <motion.div
              key={doubt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="cyber-panel p-8 space-y-8 group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                   <div className="h-14 w-14 rounded-[20px] bg-white/5 border border-white/10 overflow-hidden">
                      {doubt.userAvatar ? (
                        <img src={doubt.userAvatar} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-white/20 uppercase font-black text-xs">
                           {doubt.userName.charAt(0)}
                        </div>
                      )}
                   </div>
                   <div className="space-y-1">
                      <p className="text-sm font-black uppercase italic tracking-tight">{doubt.userName}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                           {doubt.subject}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
                           {doubt.chapter}
                        </span>
                      </div>
                   </div>
                </div>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/10">
                   {new Date(doubt.timestamp).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-lg font-bold text-white/80 leading-relaxed uppercase tracking-tight">
                   {doubt.content}
                </p>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors group">
                   <ThumbsUp size={16} className="group-hover:scale-125 transition-transform" /> {doubt.likes} Reacts
                </button>
                <button 
                  onClick={() => setSelectedDoubt(doubt)}
                  className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors group"
                >
                   <MessageSquare size={16} className="group-hover:rotate-12 transition-transform" /> {doubt.replies} Knowledge Fragments
                </button>
                <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors ml-auto group">
                   <Share2 size={16} /> Nodes Link
                </button>
              </div>

              {doubt.status === 'pending' && (
                <div className="absolute top-4 right-4 flex items-center gap-2 text-amber-500/60 font-black uppercase text-[8px] tracking-[0.3em] bg-amber-500/5 px-4 py-2 rounded-full border border-amber-500/20">
                   <AlertCircle size={10} /> Approval Core Processing
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Ask Doubt Modal */}
      <AnimatePresence>
        {isAsking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-black border border-white/10 rounded-[56px] overflow-hidden shadow-2xl relative"
            >
              <div className="p-10 md:p-16 space-y-12 h-[80vh] overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between">
                   <div className="space-y-2">
                      <h3 className="text-4xl font-black uppercase italic tracking-tighter">Ask The Hive</h3>
                      <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Deploy doubt for architectural analysis</p>
                   </div>
                   <button 
                    onClick={() => setIsAsking(false)}
                    className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/10"
                   >
                    <X size={24} />
                   </button>
                </div>

                <div className="space-y-8">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                         <Label className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 ml-2">Subject Node</Label>
                         <div className="relative">
                            <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                            <select 
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 outline-none text-[10px] font-black uppercase tracking-widest text-white appearance-none cursor-pointer focus:border-white/30 transition-all"
                            >
                              <option value="" className="bg-black">Select Subject</option>
                              <option value="Physics" className="bg-black">Physics</option>
                              <option value="Math" className="bg-black">Math</option>
                              <option value="Chemistry" className="bg-black">Chemistry</option>
                              <option value="Biology" className="bg-black">Biology</option>
                              <option value="ICT" className="bg-black">ICT</option>
                            </select>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <Label className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 ml-2">Chapter Link</Label>
                         <Input 
                            value={chapter}
                            onChange={(e) => setChapter(e.target.value)}
                            placeholder="e.g. Mechanics"
                            className="h-14 bg-white/5 border-white/10 rounded-2xl pl-6 text-[10px] font-black uppercase tracking-widest text-white"
                         />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 ml-2">Query Content (Max 3000 Tokens)</Label>
                      <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your academic challenge here..."
                        className="w-full h-48 bg-white/5 border border-white/10 rounded-[32px] p-8 outline-none text-sm font-bold text-white placeholder:text-white/10 focus:border-white/30 transition-all resize-none no-scrollbar uppercase tracking-tight"
                      />
                   </div>

                   <div className="flex gap-4">
                      <button className="flex-1 h-16 bg-white/5 border border-dashed border-white/20 rounded-2xl flex items-center justify-center gap-4 hover:bg-white/10 transition-all group">
                         <ImageIcon size={20} className="text-white/20 group-hover:text-white transition-colors" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">Attach Evidence</span>
                      </button>
                      <button 
                        onClick={handleSubmit}
                        disabled={loading || success || !subject || !content}
                        className="flex-[2] h-16 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-glow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-4"
                      >
                         {loading ? <Loader2 className="animate-spin" /> : 
                          success ? <><CheckCircle2 size={20} /> Success</> : 
                          <><Send size={18} /> Deploy Query</>}
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Doubt Detail View */}
      <AnimatePresence>
        {selectedDoubt && (
          <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-2xl overflow-y-auto no-scrollbar">
             <div className="max-w-4xl mx-auto p-6 md:p-20 space-y-16">
                <div className="flex items-center justify-between">
                   <button 
                     onClick={() => setSelectedDoubt(null)}
                     className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                   >
                     <ChevronRight size={24} className="rotate-180" />
                   </button>
                   <div className="flex items-center gap-4">
                      <button className="h-14 px-10 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                         Share Node
                      </button>
                   </div>
                </div>

                <div className="space-y-12">
                   <div className="flex items-center gap-6">
                      <div className="h-20 w-20 rounded-[32px] bg-white/5 border border-white/10 overflow-hidden">
                         {selectedDoubt.userAvatar ? <img src={selectedDoubt.userAvatar} /> : <div className="h-full w-full flex items-center justify-center font-black text-2xl text-white/10">{selectedDoubt.userName.charAt(0)}</div>}
                      </div>
                      <div className="space-y-2">
                         <h2 className="text-3xl font-black uppercase italic tracking-tighter">{selectedDoubt.userName}</h2>
                         <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/20">{selectedDoubt.subject} Network</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Archived {new Date(selectedDoubt.timestamp).toLocaleString()}</span>
                         </div>
                      </div>
                   </div>

                   <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[48px] space-y-8">
                      <div className="space-y-4">
                         <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Query Content</span>
                         <p className="text-2xl md:text-3xl font-black italic uppercase italic leading-relaxed text-white/90">
                            {selectedDoubt.content}
                         </p>
                      </div>
                      <div className="grid grid-cols-2 gap-8 text-[11px] font-black uppercase tracking-widest text-white/20 pt-8 border-t border-white/5">
                         <div className="flex items-center gap-4">
                            <Hash size={16} /> Chapter: {selectedDoubt.chapter}
                         </div>
                         <div className="flex items-center gap-4">
                            <HelpCircle size={16} /> Status: {selectedDoubt.status}
                         </div>
                      </div>
                   </div>

                   {/* Integration of Comments System */}
                   <Comments contentId={selectedDoubt.id} user={user} />
                </div>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

function Loader2({ className }: { className?: string }) {
  return <div className={`animate-spin ${className}`}><ChevronRight /></div>;
}
