import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  GraduationCap,
  Globe2,
  Crown,
  BookOpen,
  ChevronRight,
  Zap,
  Target,
  Shield
} from 'lucide-react';
import { UserProfile } from '../lib/storage';
import { useTranslation } from '../lib/useTranslation';

import { SmartEducation } from './SmartEducation';

export const Dashboard: React.FC<{ 
  user: UserProfile, 
  setActiveTab?: (tab: string) => void,
  onExploreHub?: (subject: string | null) => void 
}> = ({ user, setActiveTab, onExploreHub }) => {
  const [activeSubTab, setActiveSubTab] = useState('basic');
  const { t } = useTranslation();
  
  const [globalSettings, setGlobalSettings] = useState({
    enableGames: true,
    enableCommunity: true,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('tsolver_global_settings');
    if (savedSettings) {
      try {
        setGlobalSettings(JSON.parse(savedSettings));
      } catch (e) {}
    }
  }, []);

  const getGreetingMessage = () => {
    return `${t.welcome}, ${user.name}. ${t.desc.substring(0, 50)}...`;
  };

  const getEducationLevelLabel = (level: string) => {
    switch(level) {
      case 'School': return t.school;
      case 'College': return t.college;
      case 'University': return t.university;
      default: return level;
    }
  };

  return (
    <div className="flex flex-col items-center px-4 md:px-0">
      {/* Top Banner - Interactive Status Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white/5 dark:bg-zinc-900/50 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-3xl px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-16 relative overflow-hidden group shadow-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-black dark:bg-white flex items-center justify-center">
            <Shield className="h-5 w-5 text-white dark:text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">System Status</span>
            <span className="text-[11px] font-black uppercase tracking-tighter">Core Integrity: 100%</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center px-8 md:border-x border-y md:border-y-0 py-4 md:py-0 border-black/5 dark:border-white/5 w-full md:w-auto">
           {user.isPremium ? (
            <div className="flex items-center gap-2 text-yellow-500 animate-pulse">
               <Crown size={12} fill="currentColor" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Premium Access Active</span>
            </div>
          ) : (
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 dark:text-white/30 text-center">
              {t.greeting.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">Network</span>
            <span className="text-[11px] font-black uppercase tracking-tighter">Lat: 24ms</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Zap className="h-5 w-5 text-green-500" />
          </div>
        </div>
      </motion.div>

      {/* Main Branding - Hero Section */}
      <div className="text-center space-y-6 mb-20 md:mb-32 max-w-4xl">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full mb-4">
             <Target size={12} className="text-blue-500" />
             <span className="text-[9px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">Logic Command Center</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-[-0.05em] uppercase italic text-black dark:text-white leading-[0.9]">
            {user.name.split(' ')[0]}<span className="text-transparent bg-clip-text bg-gradient-to-br from-black/20 via-black to-black/20 dark:from-white/20 dark:via-white dark:to-white/20">.Hub</span>
          </h1>
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-black/10 dark:bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] text-black/40 dark:text-white/40">
                {getEducationLevelLabel(user.level)} Level
              </span>
            </div>
            <div className="h-[1px] w-12 bg-black/10 dark:bg-white/10" />
          </div>
        </motion.div>
        
        <p className="max-w-xl mx-auto text-black/40 dark:text-white/30 text-sm md:text-lg font-medium leading-relaxed italic">
          "{getGreetingMessage()}"
        </p>
      </div>

      {/* Explore Hub Primary Content - Featured Section */}
      <div className="w-full mb-32 relative">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-black/5 dark:via-white/5 to-transparent" />
        <SmartEducation user={user} />
      </div>

      {/* Quick Action Hub - Interactive Grid */}
      <div className="w-full max-w-6xl space-y-12">
         <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Sparkles size={18} className="text-blue-500" />
              </div>
              <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-black/40 dark:text-white/30">Neural Access Points</h3>
            </div>
            <div className="h-[1px] flex-1 mx-10 bg-black/5 dark:bg-white/5 hidden md:block" />
            <button className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:gap-2 transition-all flex items-center gap-1">
              View All Nodes <ChevronRight size={14} />
            </button>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {[
              ...(globalSettings.enableGames ? [{ id: 'games', label: t.games, icon: <Sparkles size={28} />, color: 'from-cyan-500 to-blue-500', desc: '50+ Cognitive simulations' }] : []),
              ...(globalSettings.enableCommunity ? [
                { id: 'doubts', label: t.doubts, icon: <BookOpen size={28} />, color: 'from-amber-400 to-orange-500', desc: 'Community-driven solutions' },
                { id: 'feed', label: 'Global Feeds', icon: <Globe2 size={28} />, color: 'from-emerald-400 to-teal-500', desc: 'Real-time scholastic stream' },
                { id: 'groups', label: 'Study Sectors', icon: <GraduationCap size={28} />, color: 'from-rose-500 to-red-600', desc: 'Collaborative neural networks' }
              ] : [])
            ].map(card => (
              <button 
                key={card.id}
                onClick={() => setActiveTab && setActiveTab(card.id)}
                className="group relative cyber-panel p-10 flex flex-col items-start gap-8 border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all hover:-translate-y-2 overflow-hidden"
              >
                 <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
                 
                 <div className="h-16 w-16 rounded-[24px] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all duration-500 shadow-glow">
                    {card.icon}
                 </div>
                 
                 <div className="space-y-2 text-left">
                   <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black/60 dark:text-white/60">{card.label}</span>
                   <p className="text-[9px] font-bold text-black/20 dark:text-white/20 uppercase tracking-widest">{card.desc}</p>
                 </div>

                 <div className="w-full h-[1px] bg-black/5 dark:bg-white/5 group-hover:bg-black/20 dark:group-hover:bg-white/20 transition-all" />
                 
                 <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-black/20 dark:text-white/20 group-hover:text-black dark:group-hover:text-white transition-all">
                   Establish Connection <ChevronRight size={10} />
                 </div>
              </button>
            ))}
         </div>
      </div>
    </div>
  );
};


