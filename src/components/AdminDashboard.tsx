import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Settings, 
  Activity, 
  Database, 
  ShieldCheck, 
  Trash2, 
  Search, 
  BarChart3,
  RefreshCw,
  MoreVertical,
  UserCheck,
  UserX,
  Lock,
  Eye,
  Megaphone,
  Gamepad2,
  Globe,
  Cpu,
  Power
} from 'lucide-react';
import { storage, UserProfile } from '../lib/storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Logo } from './Logo';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'stats' | 'users' | 'feedback' | 'settings'>('stats');
  const [users, setUsers] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Global Settings State
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    publicRegistration: true,
    announcementText: '',
    enableGames: true,
    enableCommunity: true,
    aiProvider: 'local'
  });

  useEffect(() => {
    loadData();
    const savedSettings = localStorage.getItem('tsolver_global_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse settings");
      }
    }
  }, [activeView]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeView === 'users' && isSupabaseConfigured()) {
        const { data } = await supabase.from('profiles').select('*').order('join_date', { ascending: false });
        setUsers(data || []);
      } else if (activeView === 'feedback' && isSupabaseConfigured()) {
        const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
        setFeedback(data || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('tsolver_global_settings', JSON.stringify(newSettings));
    window.dispatchEvent(new CustomEvent('tsolver-settings-updated', { detail: newSettings }));
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[80vh] flex flex-col gap-8 animate-fade-in pb-20">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 rounded-3xl bg-white text-black flex items-center justify-center shadow-glow">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">System Administration</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Root Node Control Active</p>
            </div>
          </div>
        </div>

        <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl">
          {[
            { id: 'stats', icon: Activity, label: 'Stats' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'feedback', icon: MessageSquare, label: 'Reports' },
            { id: 'settings', icon: Settings, label: 'Core' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`h-11 px-6 rounded-xl flex items-center gap-3 transition-all text-[9px] font-black uppercase tracking-widest ${activeView === item.id ? 'bg-white text-black shadow-glow' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={14} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'stats' && (
          <motion.div 
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Users" value={users.length || '---'} icon={Users} color="#00f2ff" />
              <StatCard label="Active Sessions" value="2.4k" icon={Activity} color="#00ff88" />
              <StatCard label="DB Latency" value="12ms" icon={Database} color="#ff7700" />
              <StatCard label="Feedback" value={feedback.length || '---'} icon={MessageSquare} color="#ff33cc" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="cyber-panel p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Growth Analysis</h3>
                    <BarChart3 size={16} className="text-white/20" />
                  </div>
                  <div className="h-64 flex items-end gap-3 px-4">
                     {[30, 45, 60, 40, 80, 95, 70, 85, 60, 50].map((h, i) => (
                       <div key={i} className="flex-1 bg-white/5 rounded-t-xl relative group" style={{ height: `${h}%` }}>
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl shadow-glow" />
                       </div>
                     ))}
                  </div>
               </div>

               <div className="cyber-panel p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">System Integrity</h3>
                    <RefreshCw size={16} className="text-white/20" />
                  </div>
                  <div className="space-y-4">
                     {[
                       { label: 'Supabase Auth Gateway', status: isSupabaseConfigured() ? 'Optimal' : 'Offline', val: isSupabaseConfigured() ? 99 : 0 },
                       { label: 'Cloud Storage Sync', status: 'Healthy', val: 92 },
                       { label: 'Local IDB Synchronization', status: 'Active', val: 100 },
                       { label: 'Neural Engine Core', status: 'Running', val: 85 }
                     ].map(log => (
                       <div key={log.label} className="space-y-2">
                          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                             <span className="text-white/60">{log.label}</span>
                             <span className={log.val > 90 ? 'text-green-500' : 'text-orange-500'}>{log.status}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${log.val}%` }}
                               className={`h-full ${log.val > 90 ? 'bg-green-500' : 'bg-orange-500'} shadow-glow`}
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeView === 'users' && (
          <motion.div 
            key="users"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 h-14">
              <Search size={18} className="text-white/20" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-white/10"
              />
            </div>

            <div className="cyber-panel overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">User ID</th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">Profile</th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">Email</th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">Level</th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30">Joined</th>
                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-white/30 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loading ? (
                        [1,2,3,4,5].map(i => (
                          <tr key={i} className="animate-pulse">
                            <td colSpan={6} className="px-8 py-6 h-16 bg-white/[0.01]" />
                          </tr>
                        ))
                      ) : filteredUsers.length > 0 ? filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-5 text-[10px] font-mono text-white/20">#{user.id.substring(0, 8)}</td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                               <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 overflow-hidden">
                                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/20"><Users size={16} /></div>}
                               </div>
                               <span className="text-xs font-black uppercase tracking-tight">{user.name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-xs font-bold text-white/40">{user.email}</td>
                          <td className="px-8 py-5">
                             <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/60">{user.level}</span>
                          </td>
                          <td className="px-8 py-5 text-[10px] font-black text-white/20 uppercase">{new Date(user.join_date || Date.now()).toLocaleDateString()}</td>
                          <td className="px-8 py-5 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white hover:text-black transition-all"><Eye size={14} /></button>
                                <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                             </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={6} className="px-8 py-12 text-center text-white/40 text-sm font-bold">No users found. {isSupabaseConfigured() ? '' : 'Supabase is not configured.'}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
               </div>
            </div>
          </motion.div>
        )}
        
        {activeView === 'feedback' && (
           <motion.div 
             key="feedback"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="cyber-panel p-8"
           >
              {feedback.length > 0 ? (
                 <div className="space-y-4">
                    {feedback.map((f, i) => (
                       <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-sm font-bold text-white mb-2">{f.content}</p>
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                             <span>{f.type || 'General'}</span>
                             <span>{new Date(f.created_at).toLocaleString()}</span>
                          </div>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="py-20 text-center flex flex-col items-center justify-center opacity-50">
                    <MessageSquare size={48} className="mb-4 text-white/20" />
                    <p className="text-xl font-black uppercase tracking-widest">No Feedback Yet</p>
                    <p className="text-[10px] font-bold text-white/40 tracking-[0.2em] mt-2">Check back later for user reports.</p>
                 </div>
              )}
           </motion.div>
        )}

        {activeView === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
             {/* Access Control Card */}
             <div className="cyber-panel p-8 space-y-8 flex flex-col">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                   <div className="h-10 w-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                     <Lock className="text-red-500" size={20} />
                   </div>
                   <h3 className="text-[12px] font-black uppercase tracking-widest">Access Control</h3>
                </div>
                <div className="space-y-6 flex-1">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <Label htmlFor="maintenance" className="text-xs font-black uppercase italic cursor-pointer">Maintenance Mode</Label>
                         <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest max-w-[180px]">Block non-admins</p>
                      </div>
                      <Switch id="maintenance" checked={settings.maintenanceMode} onCheckedChange={(v) => updateSetting('maintenanceMode', v)} />
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <Label htmlFor="registration" className="text-xs font-black uppercase italic cursor-pointer">Public Registration</Label>
                         <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest max-w-[180px]">Allow new user signups</p>
                      </div>
                      <Switch id="registration" checked={settings.publicRegistration} onCheckedChange={(v) => updateSetting('publicRegistration', v)} />
                   </div>
                </div>
             </div>

             {/* Feature Toggles Card */}
             <div className="cyber-panel p-8 space-y-8 flex flex-col">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                   <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                     <Power className="text-blue-500" size={20} />
                   </div>
                   <h3 className="text-[12px] font-black uppercase tracking-widest">Feature Modules</h3>
                </div>
                <div className="space-y-6 flex-1">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                           <Gamepad2 size={12} className="text-white/60" />
                           <Label htmlFor="games" className="text-xs font-black uppercase italic cursor-pointer">Logic Playground</Label>
                         </div>
                         <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest max-w-[180px]">Enable educational games</p>
                      </div>
                      <Switch id="games" checked={settings.enableGames} onCheckedChange={(v) => updateSetting('enableGames', v)} />
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                           <Globe size={12} className="text-white/60" />
                           <Label htmlFor="community" className="text-xs font-black uppercase italic cursor-pointer">Community Features</Label>
                         </div>
                         <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest max-w-[180px]">Enable doubts & feed</p>
                      </div>
                      <Switch id="community" checked={settings.enableCommunity} onCheckedChange={(v) => updateSetting('enableCommunity', v)} />
                   </div>
                </div>
             </div>

             {/* System Configuration Card */}
             <div className="cyber-panel p-8 space-y-8 flex flex-col lg:col-span-1 md:col-span-2">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                   <div className="h-10 w-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                     <Cpu className="text-purple-500" size={20} />
                   </div>
                   <h3 className="text-[12px] font-black uppercase tracking-widest">System Config</h3>
                </div>
                <div className="space-y-6 flex-1">
                   <div className="space-y-3">
                      <Label htmlFor="announcement" className="text-xs font-black uppercase italic">Global Announcement</Label>
                      <textarea 
                        id="announcement"
                        value={settings.announcementText}
                        onChange={(e) => updateSetting('announcementText', e.target.value)}
                        placeholder="Broadcast a message to all active nodes..."
                        className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-bold resize-none focus:outline-none focus:border-white/30"
                      />
                   </div>
                   
                   <div className="flex items-center justify-between">
                      <Label className="text-xs font-black uppercase italic">AI Processing</Label>
                      <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                        <button 
                          onClick={() => updateSetting('aiProvider', 'local')}
                          className={`px-4 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${settings.aiProvider === 'local' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                        >
                          Local Model
                        </button>
                        <button 
                          onClick={() => updateSetting('aiProvider', 'cloud')}
                          className={`px-4 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${settings.aiProvider === 'cloud' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                        >
                          Cloud API
                        </button>
                      </div>
                   </div>
                </div>
             </div>

             {/* Danger Zone */}
             <div className="cyber-panel p-8 space-y-6 lg:col-span-3 border-red-500/20 bg-red-500/5">
                <div className="flex items-center gap-4">
                   <Trash2 className="text-red-500" size={20} />
                   <h3 className="text-[12px] font-black uppercase tracking-widest text-red-500">Danger Zone</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <button className="h-12 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest text-red-500 transition-all">Clear Session Vault</button>
                   <button className="h-12 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest text-red-500 transition-all">Flush Neural Cache</button>
                   <button className="h-12 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest text-red-500 transition-all">Purge Analytics</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function StatCard({ label, value, icon: Icon, color }: { label: string, value: any, icon: any, color: string }) {
  return (
    <div className="cyber-panel p-8 space-y-6 relative group overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-[2.5] pointer-events-none group-hover:scale-[3] transition-transform duration-700">
        <Icon size={40} />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center" style={{ color }}>
          <Icon size={20} />
        </div>
        <MoreVertical size={14} className="text-white/10" />
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-black italic tracking-tighter">{value}</p>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">{label}</p>
      </div>
    </div>
  );
}
