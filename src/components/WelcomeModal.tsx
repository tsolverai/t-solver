import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, LogIn, Info, Loader2, Globe, GraduationCap, ArrowRight, UserCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { storage, UserProfile } from '../lib/storage';
import { translations, SupportedLanguage } from '../lib/translations';
import { AppDetails } from './AppDetails';
import { Logo } from './Logo';

interface WelcomeModalProps {
  isOpen: boolean;
  onComplete: (user: UserProfile) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onComplete }) => {
  const [mode, setMode] = useState<'lang' | 'welcome' | 'login' | 'signup' | 'select' | 'details'>('lang');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<SupportedLanguage>('bn');
  const [level, setLevel] = useState('School');
  const [rememberMe, setRememberMe] = useState(true);
  
  // User data for signup
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const translations_map: Record<string, string> = {
    bn: 'বাংলা',
    en: 'English'
  };

  const t = translations[lang] || translations.en;

  useEffect(() => {
    // Attempt local lang detection
    const saved = localStorage.getItem('tsolver_lang') as SupportedLanguage;
    if (saved) {
      setLang(saved);
      // We still show the welcome screen if they aren't fully initialized
      setMode('welcome'); 
    }
  }, []);

  const handleCreateProfile = async (isGuest = false) => {
    setLoading(true);
    const userId = isGuest ? 'guest_' + Math.random().toString(36).substring(7) : Math.random().toString(36).substring(7);
    const newUser: UserProfile = {
      id: userId,
      name: isGuest ? 'T-Solver Guest' : (name || 'T-Solver student'),
      email: isGuest ? 'guest@local.host' : (email || ''),
      phone: isGuest ? '' : (phone || ''),
      password: password, // Supabase handles hashing
      level: level,
      joinDate: Date.now(),
      preferences: {
        lang: lang,
        darkMode: true
      }
    };
    
    try {
      if (!isGuest) {
        await storage.signup(newUser, rememberMe);
      }
      
      localStorage.setItem('tsolver_lang', lang);
      onComplete(newUser);
    } catch (err) {
      console.error(err);
      alert('Initialization failed. Check network link.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAction = async () => {
    setLoading(true);
    try {
      const user = await storage.login(email, password, rememberMe);
      if (user) {
        onComplete(user);
      } else {
        alert('Credentials rejected by secure node.');
      }
    } catch (err) {
      console.error(err);
      alert('Neural link failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md bg-black border border-white/10 p-0 rounded-[40px] shadow-2xl shadow-white/5 overflow-hidden no-scrollbar">
        <div className="flex flex-col h-full max-h-[90vh] relative">
          
          <AnimatePresence mode="wait">
            {mode === 'lang' && (
              <motion.div 
                key="lang"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 md:p-12 flex flex-col items-center text-center space-y-10"
              >
                <button 
                  onClick={() => setMode('welcome')}
                  className="absolute top-8 right-8 text-white/40 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>

                <Logo size="lg" className="mb-4" />

                <div className="space-y-6 w-full">
                  <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white">{t.welcome}</h2>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 block text-center">Select Language / ভাষা নির্বাচন করুন</Label>
                    <div className="grid grid-cols-2 gap-2">
                       {(Object.keys(translations) as SupportedLanguage[]).map((l) => (
                         <button 
                          key={l}
                          onClick={() => setLang(l)}
                          className={`h-14 rounded-2xl border transition-all text-sm font-black italic uppercase ${lang === l ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                         >
                           {translations_map[l]}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setMode('welcome')}
                  className="w-full h-14 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-glow"
                >
                  Continue / এগিয়ে যান
                </button>
              </motion.div>
            )}

            {mode === 'welcome' && (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 md:p-12 flex flex-col items-center text-center space-y-10"
              >
                <button 
                  onClick={() => setMode('lang')}
                  className="absolute top-8 right-8 text-white/40 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>

                <Logo size="lg" className="mb-4" />

                <div className="space-y-6 text-center">
                  <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white">{t.welcome}</h2>
                  <div className="max-w-md mx-auto space-y-4">
                    <p className="text-white/60 text-sm font-bold leading-relaxed px-2 italic">
                       {t.description}
                    </p>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-3">
                  <button 
                    onClick={() => setMode('signup')}
                    className="h-14 flex items-center justify-center gap-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                  >
                    <UserPlus size={16} className="text-white/40" /> {t.signup}
                  </button>
                  <button 
                    onClick={() => setMode('login')}
                    className="h-14 flex items-center justify-center gap-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                  >
                    <LogIn size={16} className="text-white/40" /> {t.login}
                  </button>
                  <button 
                    onClick={() => handleCreateProfile(true)}
                    className="h-14 flex items-center justify-center gap-3 text-white/80 font-black uppercase text-[10px] tracking-widest hover:text-white transition-all underline decoration-white/10 underline-offset-8"
                  >
                    <UserCircle2 size={18} className="text-white/40" /> {t.guest}
                  </button>
                </div>

                <button 
                  onClick={() => setMode('details')}
                  className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all underline underline-offset-8 decoration-white/10"
                >
                  অ্যাপ ডিটেইলস দেখুন
                </button>
              </motion.div>
            )}

            {mode === 'signup' && (
              <motion.div 
                key="signup"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-8 md:p-16 space-y-8 h-full overflow-y-auto no-scrollbar"
              >
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                    <UserCircle2 size={24} className="text-white/40" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight">{t.signup}</h3>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Initialize profile heritage</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t.name}</Label>
                     <Input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="TACHIN"
                        className="h-14 bg-white/5 border-white/10 text-base font-black tracking-tight rounded-2xl placeholder:text-white/5"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t.phone}</Label>
                     <Input 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="h-14 bg-white/5 border-white/10 text-base font-black tracking-tight rounded-2xl placeholder:text-white/5"
                     />
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t.email}</Label>
                     <Input 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tachin@local.node"
                        type="email"
                        className="h-14 bg-white/5 border-white/10 text-base font-black tracking-tight rounded-2xl placeholder:text-white/5"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t.password}</Label>
                     <Input 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        type="password"
                        className="h-14 bg-white/5 border-white/10 text-base font-black tracking-tight rounded-2xl placeholder:text-white/5"
                     />
                   </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button onClick={() => setMode('welcome')} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white">{t.cancel}</button>
                  <button 
                    onClick={() => setMode('select')}
                    disabled={!name || !email || !password}
                    className="h-14 px-8 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest disabled:opacity-20 active:scale-95 transition-all flex items-center gap-3"
                  >
                    Phase 2 <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {mode === 'select' && (
              <motion.div 
                key="select"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="p-8 md:p-16 space-y-12"
              >
                <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase italic tracking-tight text-center">Neural Configuration</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20 text-center">Finalizing user environment parameters</p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 block text-center italic">{t.selectLevel}</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { val: 'School', label: t.school },
                        { val: 'College', label: t.college },
                        { val: 'University', label: t.university }
                      ].map(l => (
                        <button
                          key={l.val}
                          onClick={() => setLevel(l.val)}
                          className={`h-20 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 group ${
                            level === l.val 
                            ? 'bg-white text-black border-white shadow-glow' 
                            : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-tighter">{l.label}</span>
                          <div className={`h-1 w-6 rounded-full transition-all ${level === l.val ? 'bg-black/20' : 'bg-white/10'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 block text-center italic">{t.selectLang}</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                       {Object.keys(translations).map(l => (
                         <button
                          key={l}
                          onClick={() => setLang(l as SupportedLanguage)}
                          className={`h-12 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                            lang === l 
                            ? 'bg-white/20 text-white border-white/40' 
                            : 'bg-white/5 text-white/20 border-white/5 hover:bg-white/10'
                          }`}
                         >
                           {l}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex items-center justify-center gap-3 py-2 cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
                    <div className={`h-5 w-5 rounded-md border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-white border-white shadow-glow' : 'border-white/20'}`}>
                      {rememberMe && <ArrowRight size={12} className="text-black" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Remember my parameters</span>
                  </div>

                  <button 
                    onClick={() => handleCreateProfile(!name)}
                    className="h-16 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <><Globe size={16} /> {t.create}</>}
                  </button>
                  <button 
                    onClick={() => setMode('welcome')}
                    className="h-12 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all"
                  >
                    {t.cancel}
                  </button>
                </div>
              </motion.div>
            )}

            {mode === 'details' && (
              <motion.div 
                key="details"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-8 md:p-12 overflow-y-auto no-scrollbar h-full"
              >
                <AppDetails lang={lang} onClose={() => setMode('welcome')} />
              </motion.div>
            )}
            
            {mode === 'login' && (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="p-8 md:p-16 flex flex-col items-center gap-8"
              >
                <Logo size="lg" className="mb-4" />
                <div className="text-center space-y-2">
                  <h3 className="text-4xl font-black uppercase tracking-tighter italic">Neural Retrieval</h3>
                  <p className="text-[10px] font-bold text-white/20 leading-relaxed uppercase tracking-[0.2em] max-w-[240px] mx-auto">Authorize node access</p>
                </div>
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t.email}</Label>
                    <Input 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tachin@local.node"
                      type="email"
                      className="h-14 bg-white/5 border-white/10 text-base font-black tracking-tight rounded-2xl placeholder:text-white/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t.password}</Label>
                    <Input 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      type="password"
                      className="h-14 bg-white/5 border-white/10 text-base font-black tracking-tight rounded-2xl placeholder:text-white/5"
                    />
                  </div>
                  
                  <div className="flex items-center justify-center gap-3 py-2 cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
                    <div className={`h-5 w-5 rounded-md border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-white border-white shadow-glow' : 'border-white/20'}`}>
                      {rememberMe && <ArrowRight size={12} className="text-black" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors font-black">Stay logged into node</span>
                  </div>

                  <button 
                    onClick={handleLoginAction}
                    className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-glow hover:scale-105 active:scale-95 transition-all"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : t.login}
                  </button>
                  <button onClick={() => setMode('welcome')} className="w-full text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white py-4">{t.cancel}</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

